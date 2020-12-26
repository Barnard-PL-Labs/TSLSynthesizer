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

masterGain.gain.value = 0.1;
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

// IMPLEMENTED FUNCTIONS BEGIN
function p_Press(noteBool){
    return noteBool;
}

const c4 = document.getElementById("C4");

// Initialize all
waveform = control(false, "sawtooth", "square", waveform);

c4.addEventListener("click", function(){
    waveform = control(true, "sawtooth", "square", waveform);
});

// IMPLEMENTED FUNCTIONS END