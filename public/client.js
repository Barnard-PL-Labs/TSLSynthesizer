let synthStatus = document.getElementById("synth-status");

// FIXME
const htmlLoad = `
                When
                <select name="predicate" class="predicate">
                    <option value=""></option>
                    <option value="C4">C4 Pressed</option>
                    <option value="amFreq">Change AMFreq</option>
                </select>
            <span>&Implies;</span>
                <select name="action" class="action">
                    <option value=""></option>
                    <option value="LFOOn">activate LFO</option>
                    <option value="LFOOff">deactivate LFO</option>
                    <option value="FMOn">activate FM Synthesis</option>
                    <option value="AMOn">activate AM synthesis</option>
                    <option value="waveform-square">waveform to square</option>
                    <option value="waveform-sawtooth">waveform to sawtooth</option>
                    <option value="waveform-sine">waveform to sine</option>
                    <option value="waveform-triangle">waveform to triangle</option>
                </select>
`

// INITIALIZE SPEC FIELD
document.addEventListener("DOMContentLoaded", _ => {
    let specificationBox = document.getElementById("specification");
    for(let i=0; i<3;i++){
        const specChild = document.createElement('article');
        specChild.innerHTML = htmlLoad;
        specificationBox.appendChild(specChild);
    }
});

// TODO
// The spec to DOM function is currently under heavy development.
// It will change according to changes in the interface.
// Currently hardcoded for prototype & demonstration purposes.
function getSpecFromDOM(){
    let tslSpec = "";
    let specifications = document.getElementById("specification");
    
    let predicateList = [];

    for(let i=0; i < specifications.children.length; i++){
        const spec = specifications.children[i];

        // Predicate
        console.assert(spec.querySelectorAll(".predicate").length === 1);
        let predicate = spec.querySelector(".predicate").value;
        let predicateTSL;
        if(predicate === "C4")
            predicateTSL = "Press C4";
        else
            predicateTSL = "Change amFreq";

        // Action
        console.assert(spec.querySelectorAll(".action").length === 1);
        let action = spec.querySelector(".action").value;
        let actionTSL;
        if(action.search("waveform") !== -1){
            if(action.search("square") !== -1)
                actionTSL = "[waveform <- square]";
            else if(action.search("sine") !== -1)
                actionTSL = "[waveform <- sine]";
            else if(action.search("triangle") !== -1)
                actionTSL = "[waveform <- triangle]";
            else if(action.search("sawtooth") !== -1)
                actionTSL = "[waveform <- sawtooth]";
            else
                throw "Waveform Error";
        }
        else if(action.search("LFO") !== -1){
            if(action.search("On") !== -1)
                actionTSL = "[lfo <- True]";
            else if(action.search("Off") !== -1)
                actionTSL = "[lfo <- False]";
            else
                throw "LFO error";
        }
        else if(action.search("AM") !== -1)
            actionTSL = "[amSynthesis <- True]"
        else
            actionTSL = "[fmSynthesis <- True]"

        // If spec is unspecified
        if(!predicate || !action)
            continue;
        else
            predicateList.push(predicateTSL);

        // Create spec
        tslSpec += `\t${predicateTSL} -> X ${actionTSL};\n`;
    }

    // If no specs have been initialized
    if(!tslSpec){
        console.log("No specs initialized.");
        return "";
    }

    tslSpec = "always guarantee {\n" + tslSpec + "}";

    // FIXME
    if(predicateList.length > 1){
        let assumeClause = "always assume{\n\t";
        for(let i=0; i<predicateList.length; i++){
            const predicate = predicateList[i];
            assumeClause += "!(" + predicate +") || ";
        }
        assumeClause = assumeClause.slice(0, -4) + ";\n}";
        tslSpec = assumeClause + tslSpec;
    }

    console.log(`Got spec from DOM:\n${tslSpec}`);
    return tslSpec;
}

// https://gist.github.com/aerrity/fd393e5511106420fba0c9602cc05d35
function synthesize(spec){
    // POST
    fetch('/spec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            spec: spec
        })
    })
        .then(function(response){
            if(response.ok){
                console.log('POST success.');
                return;
            }
            throw new Error('POST failed.');
        })
        .catch(function(error){
            console.log(error);
        });

    // GET
    fetch('/synthesized', {method: 'GET'})
        .then(function(response){
            if(response.ok){
                console.log("GET success.");
                return response.json();
            }
            throw new Error('GET failed.');
        })
        .then(function(data){
            let synthesized = data.result;

            // XXX
            if(synthesized.toString().search("UNREALIZABLE") !== -1){
                synthStatus.innerHTML = "Status: Unrealizable... please try again\t";
            }

            else {
                let script = document.createElement("script");
                script.text = synthesized;
                script.setAttribute("id", "synthesizedScript");
                document.body.appendChild(script);
                synthStatus.innerHTML = "Status: Synthesis Complete!\t"
            }

        })
        .catch(function(error) {
            console.log(error);
        });

}


document.getElementById("synthesize-btn").addEventListener(
    "click", _ => {

        let prevSynthesized = document.getElementById("synthesizedScript");
        if(prevSynthesized)
            prevSynthesized.remove();

        synthStatus.innerHTML = "Status: Synthesizing...\t"
        const spec = getSpecFromDOM();
        if(!spec){
            synthStatus.innerHTML = "Status: No specification given\t";
            return;
        }
        synthesize(spec);
    }
);
