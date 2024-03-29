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

function synthesizeMT(spec){
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
                fetch('/synthesizedMT', {method: 'GET'})
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
            if(currSpecStyle === specStyles.writtenMT){
                synthesizeMT(spec);
            } else { 
                synthesize(spec); 
            }

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

function f_add(arg1, arg2){return arg1+arg2;}
function f_sub(arg1, arg2){return arg1-arg2;}
function f_c0(){return 0;}
function f_c1(){return 1;}
function f_c5(){return 5;}
function f_c10(){return 10;}
function f_c15(){return 15;}
function f_c200(){return 200;}
function f_c500(){return 500;}
function f_c250(){return 250;}
function f_c750(){return 750;}
function f_bigRand(){return Math.random() * 100;}
function f_hugeRand(){return Math.random() * 200;}
function f_smallRand(){return Math.floor(Math.random() * 3);}
function p_gt(arg1, arg2){return arg1 > arg2;}
function p_lte(arg1, arg2){return arg1 <= arg2;}
fmFreq = 300;
lfoDepth = 5;
function genRandSpec(){
	const noteBase = "note6";
	for(let i=0; i<selectedNotesList.length; i++)
	    selectedNotesList[i] = `${noteBase}${i}`;
	randomSpecBtn.click();
}

function genManyRandSpecs(times){
    const specs = [];
    for(let i=0; i<times; i++){
        genRandSpec();
        specs.push(getSpecFromDOM());
    }
    return specs
}

function concatManyRandSpecs(times){
	const specList = genManyRandSpecs(times);
	return specList.join('\n***\n\n');
}
