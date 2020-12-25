window.AudioContext = window.AudioContext || window.webkitAudioContext;

let context = new AudioContext(),
    settings = {
        id: 'keyboard',
        width: 700,
        height: 150,
        startNote: 'A2',
        margin: 'auto',
        whiteNotesColour: '#fff',
        blackNotesColour: '#000',
        borderColour: '#000',
        activeColour: 'yellow',
        octaves: 3
    },
    keyboard = new QwertyHancock(settings);

let masterGain = context.createGain();
let nodes = [];
let waveform = 'sine';

masterGain.gain.value = 0.3;
masterGain.connect(context.destination);

keyboard.keyDown = function (note, frequency) {
    let oscillator = context.createOscillator();
    oscillator.type = waveform;
    oscillator.frequency.value = frequency;
    oscillator.connect(masterGain);
    oscillator.start(0);

    nodes.push(oscillator);
};

keyboard.keyUp = function (note, frequency) {
    let new_nodes = [];

    for (let i = 0; i < nodes.length; i++) {
        if (Math.round(nodes[i].frequency.value) === Math.round(frequency)) {
            nodes[i].stop(0);
            nodes[i].disconnect();
        } else {
            new_nodes.push(nodes[i]);
        }
    }

    nodes = new_nodes;
};

keyboard = new QwertyHancock(settings);

const tslSpec=`
initially guarantee {
    [Wave <- Square];
}
always guarantee {
    Press C4 -> X [Wave <- Sawtooth];
}
`

// https://gist.github.com/aerrity/fd393e5511106420fba0c9602cc05d35
function synthesize(){

    let display = document.getElementById("tslResult");

    // POST
    fetch('/spec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            spec: tslSpec
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
            console.log(data.result);
        })
        .catch(function(error) {
            console.log(error);
        });

}

synthesize();