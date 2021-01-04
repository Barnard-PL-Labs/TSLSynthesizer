//////////
// HTML //
//////////

// FIXME
const htmlLoad = `
                When
                <select name="predicate" class="predicate">
                    <option value=""></option>
                    <option value="note">Play last played note</option>
                    <option value="amFreq">Change AMFreq</option>
                    <option value="toSine">Waveform is Sine</option>
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

function removeSharp(str){return str.replace("#", "Sharp");}
function addSharp(str){return str.replace("Sharp", "#");}

// TSL lexer does not recognize "#".
// Must change all ids to "sharp".
document.addEventListener("DOMContentLoaded", _ => {
    for(let i=0; i<allKeys.length; i++){
        const keyNote = allKeys[i];
        keyNote.setAttribute("id", removeSharp(keyNote.id));
    }
})

////////////////////////////
// SAVE LAST CLICKED NOTE //
////////////////////////////
let lastClicked;
const lastClickHTML = document.getElementById("lastClicked");

function saveLastClicked(e){
    lastClicked = e.target.id;
    lastClickHTML.innerText = "Last Played Note: " + addSharp(lastClicked);
}

for(let i=0; i<allKeys.length; i++){
    const keyNote = allKeys[i];
    keyNote.addEventListener("click", e => saveLastClicked(e), false);
}

////////////////////////////
// SERVER HANDSHAKE LOGIC //
////////////////////////////

let synthStatus = document.getElementById("synth-status");

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
