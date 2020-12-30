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
                <select name="action1" class="action">
                    <option value=""></option>
                    <option value="LFOOn">activate LFO</option>
                    <option value="LFOOff">deactivate LFO</option>
                    <option value="FMOn">activate FM Synthesis</option>
                    <option value="AMOn">activate AM synthesis</option>
                    <option value="square">waveform to square</option>
                    <option value="sawtooth">waveform to sawtooth</option>
                    <option value="sine">waveform to sine</option>
                    <option value="triangle">waveform to triangle</option>
                </select>
`
document.addEventListener("DOMContentLoaded", _ => {
    let specificationBox = document.getElementById("specification");
    for(let i=0; i<3;i++){
        const temp = document.createElement('article');
        temp.innerHTML = htmlLoad;
        specificationBox.appendChild(temp);
    }
});

// Rudimentary, needs buffing.
function getSpecFromDOM(){
    let tslSpec = "";
    let specifications = document.getElementById("specification");
    for(let i=0; i < specifications.children.length; i++){
        const spec = specifications.children[i];

        // Predicate
        console.assert(spec.querySelectorAll(".predicate").length === 1);
        let predicate = spec.querySelector(".predicate").value;

        // Action
        console.assert(spec.querySelectorAll(".action").length === 1);
        let action = spec.querySelector(".action").value;

        // If spec is unspecified
        if(!predicate || !action)
            continue;

        // Create spec
        tslSpec += `Press ${predicate} -> [Wave <- ${action}];\n`;
    }

    // If no specs have been initialized
    if(!tslSpec){
        console.log("No specs initialized.");
        return "";
    }

    tslSpec = "always guarantee {\n" + tslSpec + "}";
    console.log(`Got spec from DOM:\n${tslSpec}`);
    return tslSpec;
}

const tempSpec = `
initially guarantee {
    [Wave <- Sine];
    [AMSynth <- False];
}

always guarantee {
	Change amFreq -> X [AMSynth <- True];
	Press C4 -> X [Wave <- Sawtooth];
}
`


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
                // FIXME
                // let script = document.createElement("script");
                // script.text = synthesized;
                // document.body.appendChild(script);

                // TODO: obviate the need to hand-implement functions
                addScript("tempControl.js");
                addScript("implemented.js");

                synthStatus.innerHTML = "Status: Synthesis Complete!\t"
            }

        })
        .catch(function(error) {
            console.log(error);
        });

}


document.getElementById("synthesize-btn").addEventListener(
    "click", _ => {
        synthStatus.innerHTML = "Status: Synthesizing...\t"
        const spec = getSpecFromDOM();
        if(!spec){
            synthStatus.innerHTML = "Status: No specification given\t";
            return;
        }
        synthesize(tempSpec)
        // FIXME
        // synthesize(spec);
    }
);

function addScript(scriptName){
    let controlJS = document.createElement("script");
    controlJS.setAttribute("src", scriptName);
    document.body.appendChild(controlJS);
}

