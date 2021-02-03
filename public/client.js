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
                            synthStatus.innerText = "Status: Unrealizable... please try again\t";
                        }

                        else if(synthesized.toString().search("ERROR") !== -1){
                            synthStatus.innerText = "Server Error. Please refresh page.\t";
                            console.log(synthesized);
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
                    return fetch;
                }
           else
                throw new Error('POST failed.');
        })
        .catch(function(error){
            console.log(error);
        });
}


document.getElementById("synthesize-btn").addEventListener(
    "click", _ => {

        let prevSynthesized = document.getElementById("synthesizedScript");
        if(prevSynthesized)
            prevSynthesized.remove();
        lockAllSelectedNotes();

        synthStatus.innerHTML = "Status: Synthesizing...\t"
        try{
            const spec = getSpecFromDOM();
            if(!spec){
                synthStatus.innerHTML = "Status: No specification given\t";
                return;
            }
            synthesize(spec);
        }
        catch(err){
            if(err instanceof UnselectedNoteError)
                synthStatus.innerHTML = "You did not select notes.\t"
            else{
                synthStatus.innerText = "Server Error. Please refresh page.\t";
                throw err;
            }
        }
    }
);


/////////////////////////
// Web MIDI connection //
/////////////////////////


// Request MIDI access
if (navigator.requestMIDIAccess) {
    console.log('This browser supports WebMIDI!');

    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

} else {
    console.log('WebMIDI is not supported in this browser.');
}

// Function to run when requestMIDIAccess is successful
function onMIDISuccess(midiAccess) {
    var inputs = midiAccess.inputs;
    var outputs = midiAccess.outputs;

    // Attach MIDI event "listeners" to each input
    for (var input of midiAccess.inputs.values()) {
        input.onmidimessage = getMIDIMessage;
    }
}

// Function to run when requestMIDIAccess fails
function onMIDIFailure() {
    console.log('Error: Could not access MIDI devices.');

}
