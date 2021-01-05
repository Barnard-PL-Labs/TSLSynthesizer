window.AudioContext = window.AudioContext || window.webkitAudioContext;




// Function to parse the MIDI messages we receive
function getMIDIMessage(message) {
    var command = message.data[0];
    var note = message.data[1];
    var velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

    switch (command) {
        case 144: // note on
            if (velocity > 0) {
                noteOn(note, velocity);
            } else {
                noteOff(note);
            }
            break;
        case 128: // note off
            noteOff(note);
            break;

    }
}

// Function to handle noteOn messages (ie. key is pressed)
function noteOn(note, velocity) {
    let noteName = midiNoteToNoteName[note]
    audioKeyDown(noteName, getFrequencyOfNote(noteName))
}

// Function to handle noteOff messages (ie. key is released)
function noteOff(note) {
    let noteName = midiNoteToNoteName[note]
    audioKeyUp(noteName, getFrequencyOfNote(noteName))
}


function getFrequencyOfNote(note) {
    var notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
        key_number,
        octave;

    if (note.length === 3) {
        octave = note.charAt(2);
    } else {
        octave = note.charAt(1);
    }

    key_number = notes.indexOf(note.slice(0, -1));

    if (key_number < 3) {
        key_number = key_number + 12 + ((octave - 1) * 12) + 1;
    } else {
        key_number = key_number + ((octave - 1) * 12) + 1;
    }

    return 440 * Math.pow(2, (key_number - 49) / 12);
};








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

// VARIABLE INIT
let nodes = [];
let waveform = 'sine';
let masterGain = document.getElementById("gain");

let midiNoteToNoteName = {
      45: "A2",
      46: "A#2",
      47: "B2",
      48: "C3",
      49: "C#3",
      50: "D3",
      51: "D#3",
      52: "E3",
      53: "F3",
      54: "F#3",
      55: "G3",
      56: "G#3",
      57: "A3",
      58: "A#3",
      59: "B3",
      60: "C4",
      61: "C#4",
      62: "D4",
      63: "D#4",
      64: "E4",
      65: "F4",
      66: "F#4",
      67: "G4",
      68: "G#4",
      69: "A4",
      70: "A#4",
      71: "B4",
      72: "C5",
      73: "C#5",
      74: "D5",
      75: "D#5",
      76: "E5",
      77: "F5",
      78: "F#5",
      79: "G5",
    }

// WAVEFORM
let waveformControl = document.getElementById("waveform");
waveformControl.addEventListener("change", _ => {
    waveform = waveformControl.value;
}, false);

// AM SYNTHESIS
let amSynthesis = false;
let amOnBtn = document.getElementById("amOnBtn");
let amOffBtn = document.getElementById("amOffBtn");
let amFreq= document.getElementById("amFreq");
amOnBtn.addEventListener("click", _ => {
    amSynthesis = true;
    fmSynthesis = false;
});
amOffBtn.addEventListener("click", _ => {amSynthesis = false;});

// FM SYNTHESIS
let fmSynthesis = false;
let fmOnBtn = document.getElementById("fmOnBtn");
let fmOffBtn = document.getElementById("fmOffBtn");
fmOnBtn.addEventListener("click", _ => {
    fmSynthesis = true;
    amSynthesis = false;
});
fmOffBtn.addEventListener("click", _ => {fmSynthesis = false;});

// LFO
let lfo = false;
let vibFreq =  document.getElementById("lfoFreq");
let vibDepth =  document.getElementById("lfoDepth");
let lfoOnBtn = document.getElementById("lfoOnBtn");
let lfoOffBtn = document.getElementById("lfoOffBtn");
lfoOnBtn.addEventListener("click", _ => {lfo = true;});
lfoOffBtn.addEventListener("click", _ => {lfo = false;});

let carrierMap = {};





function audioKeyDown(note, frequency) {
    let oscillator = context.createOscillator();
    const modulationIndex = context.createGain();
    oscillator.type = waveform;

    oscillator.frequency.value = frequency;
    modulationIndex.gain.value = parseFloat(masterGain.value);

    if(amSynthesis){
        let carrier = context.createOscillator();
        carrier.frequency.value = parseInt(amFreq.value);

        const modulated = context.createGain();
        modulated.gain.value = 1.0 - parseFloat(masterGain.value);

        oscillator.connect(modulationIndex).connect(modulated.gain);
        carrier.connect(modulated);
        modulated.connect(context.destination);
        carrier.start(0);

        carrierMap[oscillator] = [carrier];
    }

    else if(fmSynthesis){
        modulationIndex.gain.value *= 100;
        oscillator.connect(modulationIndex);

        let carrier = context.createOscillator();
        modulationIndex.connect(carrier.frequency);

        carrier.connect(context.destination);
        carrier.start(0);

        carrierMap[oscillator] = [carrier];
    }

    else {
        oscillator.connect(modulationIndex);
        modulationIndex.connect(context.destination);
    }

    if(lfo){
        let vibOsc = context.createOscillator();
        let vibIdx = context.createGain();
        vibIdx.gain.value = parseInt(vibDepth.value);
        vibOsc.frequency.value = parseInt(vibFreq.value);

        vibOsc.connect(vibIdx);
        vibIdx.connect(oscillator.frequency);
        vibOsc.start();
        if(carrierMap[oscillator])
            carrierMap[oscillator].push(vibOsc);
        else
            carrierMap[oscillator] = [vibOsc];
    }

    oscillator.start(0);
    nodes.push(oscillator);

};


function audioKeyUp(note, frequency) {
    let new_nodes = [];

    for (let i = 0; i < nodes.length; i++) {
        if (Math.round(nodes[i].frequency.value) === Math.round(frequency)) {
            nodes[i].stop(0);
            nodes[i].disconnect();
            // XXX
            if(nodes[i] in carrierMap){
                let auxNodes = carrierMap[nodes[i]];
                for(let j=0; j < auxNodes.length; j++){
                    let auxNode = auxNodes[j];
                    auxNode.stop(0);
                    auxNode.disconnect(0);
                }
                delete carrierMap[nodes[i]];
            }
        } else {
            new_nodes.push(nodes[i]);
        }
    }

    nodes = new_nodes;
};

keyboard.keyDown = audioKeyDown;
keyboard.keyUp = audioKeyUp;

keyboard = new QwertyHancock(settings);

const allKeys = document.getElementById("keyboard").children[0].children;
