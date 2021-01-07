window.AudioContext = window.AudioContext || window.webkitAudioContext;




// Function to parse the MIDI messages we receive
function getMIDIMessage(message) {
    var command = message.data[0];
    var note = message.data[1];
    var velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

    switch (command) {
        case 144: // note on
            if (velocity > 0) {
                midiNoteOn(note, velocity);
            } else {
                midiNoteOff(note);
            }
            break;
        case 128: // note off
            midiNoteOff(note);
            break;

    }
}

// Function to handle midiNoteOn messages (ie. key is pressed)
function midiNoteOn(note, velocity) {
    let noteName = midiNoteToNoteName[note]
    audioKeyDown(noteName, getFrequencyOfNote(noteName))
}

// Function to handle midiNoteOff messages (ie. key is released)
function midiNoteOff(note) {
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
let globalGain = context.createGain();
globalGain.gain.value = 0.7; //temorary, need to add eventlistener as well
globalGain.connect(context.destination);

let amSynthesis = false;
let fmSynthesis = false;


let noteNames = ["A2","A#2","B2","C3","C#3","D3","D#3","E3",
                  "F3","F#3","G3","G#3","A3","A#3","B3","C4",
                  "C#4","D4","D#4","E4","F4","F#4","G4","G#4",
                  "A4","A#4","B4","C5","C#5","D5","D#5","E5",
                  "F5","F#5","G5"];


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
      79: "G5"
    };

let noteSignals = {};
noteNames.forEach(function (noteName, index) {

    var nodesDict = {};

    // Oscillator
    var osc = context.createOscillator();
    osc.frequency.value = getFrequencyOfNote(noteName);
    osc.type = waveform;

    // Key Gain
    var keyGain = context.createGain();
    // keyGain.gain.setValueAtTime(0.001, context.currentTime);
    keyGain.gain.value = 0.001;

    // AM Synthesis nodes
    var amOsc = context.createOscillator();
    var amGain = context.createGain();
    if (amSynthesis) {
      amOsc.frequency.value = parseInt(amFreq.value);
    } else {
      amOsc.frequency.value = 0;
    }
    amGain.gain.value = 0.5;
    var modulatedGain = context.createGain();
    modulatedGain.gain.value = 1.0 - amGain.gain.value;


    // FM Synthesis nodes
    var fmOsc = context.createOscillator();
    var fmGain = context.createGain();
    if (fmSynthesis) {
      fmOsc.frequency.value = 100; //Temporary, really we need to let user choose frequency
    } else {
      fmOsc.frequency.value = 0;
    }
    fmGain.gain.value = 100;


    amOsc.connect(amGain);
    amGain.connect(modulatedGain.gain);

    fmOsc.connect(fmGain);
    fmGain.connect(osc.frequency);

    osc.connect(modulatedGain);

    modulatedGain.connect(keyGain);
    keyGain.connect(globalGain);

    osc.start(0);
    amOsc.start(0);
    fmOsc.start(0);

    nodesDict["oscillator"] = osc;
    nodesDict["am"] = [amOsc, amGain, modulatedGain];
    nodesDict["fm"] = [fmOsc, fmGain];
    nodesDict["keyGain"] = keyGain;

    noteSignals[noteName] = nodesDict;

});


// WAVEFORM
let waveformControl = document.getElementById("waveform");
waveformControl.addEventListener("change", _ => {
    waveform = waveformControl.value;
}, false);



// AM Synthesis Parameters
let amOnBtn = document.getElementById("amOnBtn");
let amOffBtn = document.getElementById("amOffBtn");
let amFreq= document.getElementById("amFreq");
amOnBtn.addEventListener("click", _ => {
    amSynthesis = true;
    fmSynthesis = false;

    noteNames.forEach(function (noteName, index) {
        noteSignals[noteName]["am"][0].frequency.value = parseInt(amFreq.value);
    })

});
amOffBtn.addEventListener("click", _ => {
    amSynthesis = false;

    noteNames.forEach(function (noteName, index) {
        noteSignals[noteName]["am"][0].frequency.value = 0;
    })

});

// FM Synthesis Parameters
let fmOnBtn = document.getElementById("fmOnBtn");
let fmOffBtn = document.getElementById("fmOffBtn");
// NOTE, shouldn't we have a slider for fmFreq?
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


    let keyGain = noteSignals[note]["keyGain"];
    keyGain.gain.setTargetAtTime(0.95, context.currentTime, 0.01)

    let oscillator = context.createOscillator();
    oscillator.start(0);

};


function audioKeyUp(note, frequency) {

    let keyGain = noteSignals[note]["keyGain"];
    keyGain.gain.setTargetAtTime(0.001, context.currentTime, 0.01)

};

keyboard.keyDown = audioKeyDown;
keyboard.keyUp = audioKeyUp;

keyboard = new QwertyHancock(settings);

const allKeys = document.getElementById("keyboard").children[0].children;
