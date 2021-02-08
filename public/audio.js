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
    let noteName = midiNoteToNoteName[note];
    audioKeyDown(noteName, getFrequencyOfNote(noteName), velocity);
    // let elementName = noteName.replace("#", "Sharp");
    let elementName = "note" + note.toString()
    lightenUp(document.getElementById(elementName));
    reactiveUpdateOnMIDI(note, velocity);
}

// Function to handle midiNoteOff messages (ie. key is released)
function midiNoteOff(note) {
    let noteName = midiNoteToNoteName[note];
    audioKeyUp(noteName, getFrequencyOfNote(noteName));
    // let elementName = noteName.replace("#", "Sharp");
    let elementName = "note" + note.toString()
    darkenDown(document.getElementById(elementName));
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

keyboard.keyDown = qwertyKeyDown;
keyboard.keyUp = qwertyKeyUp;

keyboard.mDown = audioKeyDown;
keyboard.mUp = audioKeyUp;


// VARIABLE INIT
let activeNotes = new Set();
// TODO: add eventListener to gain
let masterGain = document.getElementById("gain");
let globalGain = context.createGain();
let userGainLevel = 0.8
globalGain.gain.value = userGainLevel;
globalGain.connect(context.destination);

// Waveform
let waveform = 'sine';
const waveformControl = document.getElementById("waveform");
waveformControl.addEventListener("change", _ => {
    waveform = waveformControl.value;
})
const gainControl = document.getElementById("gain");
gainControl.addEventListener("change", _ => {
    userGainLevel = gainControl.value
})

// AM Synthesis Parameters
let amSynthesis = false;
const amFreqControl = document.getElementById("amFreq");
let amFreq = parseInt(amFreqControl.value);
amFreqControl.addEventListener("change", _ => {
    amFreq = parseInt(amFreqControl.value);
})
let amOnBtn = document.getElementById("amOnBtn");
let amOffBtn = document.getElementById("amOffBtn");
amOnBtn.addEventListener("click", _ => {
    if(amSynthesis) return;
    amSynthesis = true;
})
amOffBtn.addEventListener("click", _ => {
    if(!amSynthesis) return;
    amSynthesis = false;
})

// FM Synthesis Parameters
let fmSynthesis = false;
const fmFreqControl = document.getElementById("fmFreq");
let fmFreq = parseInt(amFreqControl.value);
fmFreqControl.addEventListener("change", _ => {
    fmFreq = parseInt(fmFreqControl.value);
})
let fmOnBtn = document.getElementById("fmOnBtn");
let fmOffBtn = document.getElementById("fmOffBtn");
fmOnBtn.addEventListener("click", _ => {
    if(fmSynthesis) return;
    fmSynthesis = true;
})
fmOffBtn.addEventListener("click", _ => {
    if(!fmSynthesis) return;
    fmSynthesis = false;
    resetOscillatorFrequencies();
})

// LFO
let lfo = false;
const lfoFreqControl =  document.getElementById("lfoFreq");
const lfoDepthControl =  document.getElementById("lfoDepth");
let lfoFreq = parseInt(lfoFreqControl.value);
let lfoDepth = parseInt(lfoDepthControl.value);
lfoFreqControl.addEventListener("change", _ => {
    lfoFreq = parseInt(lfoFreqControl.value);
})
lfoDepthControl.addEventListener("change", _ => {
    lfoDepth = parseInt(lfoDepthControl.value);
})
let lfoOnBtn = document.getElementById("lfoOnBtn");
let lfoOffBtn = document.getElementById("lfoOffBtn");
lfoOnBtn.addEventListener("click", _ => {
    if(lfo) return;
    lfo = true;
})
lfoOffBtn.addEventListener("click", _ => {
    if(!lfo) return;
    lfo = false;
})


// FILTER
let filterOn = false;
let filterType = "lowpass"
let filterCutoff = 10000;
let filterQ = 1;

const filterCutoffControl =  document.getElementById("filterCutoff");
filterCutoffControl.addEventListener("change", _ => {
    filterCutoff = parseInt(filterCutoffControl.value);
})

const filterQControl =  document.getElementById("filterQ");
filterQControl.addEventListener("change", _ => {
    filterQ = Math.pow(10, parseInt(filterQControl.value));
})


const filterTypeControl =  document.getElementById("filterTypeDropdown");
filterTypeControl.addEventListener("change", _ => {
    filterType = filterTypeControl.value;
})

let filterOnBtn = document.getElementById("filterOnBtn");
let filterOffBtn = document.getElementById("filterOffBtn");
filterOnBtn.addEventListener("click", _ => {
    if(filterOn) return;
    filterOn = true;
})
filterOffBtn.addEventListener("click", _ => {
    if(!filterOn) return;
    filterOn = false;
})


// HARMONIZER
let harmonizerOn = false;
let harmonizerInterval = -5;
let harmonizerNoteSet = new Set();

const harmonizerIntervalControl =  document.getElementById("harmonizerInterval");
harmonizerIntervalControl.addEventListener("change", _ => {
    harmonizerInterval = parseInt(harmonizerIntervalControl.value);
})

let harmonizerOnBtn = document.getElementById("harmonizerOnBtn");
let harmonizerOffBtn = document.getElementById("harmonizerOffBtn");
harmonizerOnBtn.addEventListener("click", _ => {
    // if(harmonizerOn) return;
    // harmonizerOn = true;
    toggleHarmonizer(1);
})
harmonizerOffBtn.addEventListener("click", _ => {
    // if(!harmonizerOn) return;
    // harmonizerOn = false;
    toggleHarmonizer(0);
})




// ARPEGGIATOR
let arpeggiatorOn = false;
let arpeggiatorStyle = "up";
let arpeggiatorRate = 6;
// let _arpeggiatorInterval;

const arpeggiatorRateControl =  document.getElementById("arpeggiatorRate");
arpeggiatorRateControl.addEventListener("change", _ => {
    arpeggiatorRate = parseInt(arpeggiatorRateControl.value);
})

const arpeggiatorStyleControl =  document.getElementById("arpeggiatorStyleDropdown");
arpeggiatorStyleControl.addEventListener("change", _ => {
    arpeggiatorStyle = arpeggiatorStyleControl.value;
})

let arpeggiatorOnBtn = document.getElementById("arpeggiatorOnBtn");
let arpeggiatorOffBtn = document.getElementById("arpeggiatorOffBtn");
arpeggiatorOnBtn.addEventListener("click", _ => {
    if(arpeggiatorOn) return;
    arpeggiatorOn = true;
})
arpeggiatorOffBtn.addEventListener("click", _ => {
    if(!arpeggiatorOn) return;
    arpeggiatorOn = false;
})


let midiNoteToNoteName = {
      33: "A1",
      34: "A#1",
      35: "B1",
      36: "C2",
      37: "C#2",
      38: "D2",
      39: "D#2",
      40: "E2",
      41: "F2",
      42: "F#2",
      43: "G2",
      44: "G#2",
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
      80: "G#5",
      81: "A5",
      82: "A#5",
      83: "B5",
      84: "C6",
      85: "C#6",
      86: "D6",
      87: "D#6",
      88: "E6",
      89: "F6",
      90: "F#6",
      91: "G6"
};

let noteNameToMidiNote = {};
for (midiNote in midiNoteToNoteName) {
    noteNameToMidiNote[midiNoteToNoteName[parseInt(midiNote)]] = parseInt(midiNote);
}


let noteNames = [];
for (midiNote in midiNoteToNoteName) {
    noteNames.push(midiNoteToNoteName[parseInt(midiNote)]);
}


// let chords = {
//
//     "CM":   new Set(["C","E","G"])
//     "Cm":   new Set(["C","D#","G"])
//     "C#M":  new Set(["C#","F","G#"])
//     "C#m":  new Set(["C#","E","G#"])
//     "DM":   new Set(["D","F#","A"])
//     "Dm":   new Set(["D","F","A"])
//     "D#M":  new Set(["D#","G","A#"])
//     "D#m":  new Set(["D#","F#","A#"])
//     "EM":   new Set(["E","G#","A"])
//     "Em":   new Set(["E","G","A"])
//     "FM":   new Set(["F","A","C"])
//     "Fm":   new Set(["F","G#","C"])
//     "F#M":  new Set(["F#","A#","C#"])
//     "F#m":  new Set(["F#","A","C#"])
//     "GM":   new Set(["G","B","D"])
//     "Gm":   new Set(["G","A#","D"])
//     "G#M":  new Set(["G#","C","D#"])
//     "G#m":  new Set(["G#","B","D#"])
//     "AM":   new Set(["A","C#","E"])
//     "Am":   new Set(["A","C","E"])
//     "A#M":  new Set(["A#","D","F"])
//     "A#m":  new Set(["A#","C#","F"])
//     "BM":   new Set(["B","D#","F#"])
//     "Bm":   new Set(["B","D","F#"])
//
//     "CM7":  new Set(["C","E","G","B"])
//     "Cm7":  new Set(["C","D#","G","A#"])
//     "C#M7": new Set(["C#","F","G#","C"])
//     "C#m7": new Set(["C#","E","G#","B"])
//     "DM7":  new Set(["D","F#","A","C#"])
//     "Dm7":  new Set(["D","F","A","C"])
//     "D#M7": new Set(["D#","G","A#","D"])
//     "D#m7": new Set(["D#","F#","A#","C#"])
//     "EM7":  new Set(["E","G#","A","D#"])
//     "Em7":  new Set(["E","G","A","D"])
//     "FM7":  new Set(["F","A","C","E"])
//     "Fm7":  new Set(["F","G#","C","D#"])
//     "F#M7": new Set(["F#","A#","C#","F"])
//     "F#m7": new Set(["F#","A","C#","E"])
//     "GM7":  new Set(["G","B","D","F#"])
//     "Gm7":  new Set(["G","A#","D","F"])
//     "G#M7": new Set(["G#","C","D#","G"])
//     "G#m7": new Set(["G#","B","D#","F#"])
//     "AM7":  new Set(["A","C#","E","G#"])
//     "Am7":  new Set(["A","C","E","G"])
//     "A#M7": new Set(["A#","D","F","A"])
//     "A#m7": new Set(["A#","C#","F","G#"])
//     "BM7":  new Set(["B","D#","F#","A#"])
//     "Bm7":  new Set(["B","D","F#","A"])
//
//     "C7":   new Set(["C","E","G","A#"])
//     "C#7":  new Set(["C#","F","G#","B"])
//     "D7":   new Set(["D","F#","A","C"])
//     "D#7":  new Set(["D#","G","A#","C#"])
//     "E7":   new Set(["E","G#","A","D"])
//     "F7":   new Set(["F","A","C","D#"])
//     "F#7":  new Set(["F#","A#","C#","E"])
//     "G7":   new Set(["G","B","D","F"])
//     "G#7":  new Set(["G#","C","D#","F#"])
//     "A7":   new Set(["A","C#","E","G"])
//     "A#7":  new Set(["A#","D","F","G#"])
//     "B7":   new Set(["B","D#","F#","A"])
// }

let noteSignals = {};

function initializeSignals(){
    noteNames.forEach(function (noteName, index) {

        var nodesDict = {};

        // Oscillator
        var osc = context.createOscillator();
        osc.frequency.value = getFrequencyOfNote(noteName);
        osc.type = waveform;

        // Key Gain
        var keyGain = context.createGain();
        // keyGain.gain.setValueAtTime(0.001, context.currentTime);
        keyGain.gain.value = 0.00001;

        // AM Synthesis nodes
        var amOsc = context.createOscillator();
        var amGain = context.createGain();
        if (amSynthesis) {
          amOsc.frequency.value = parseInt(amFreq);
        } else {
          amOsc.frequency.value = 0;
        }
        amGain.gain.value = 0.5;
        var modulatedGain = context.createGain();
        modulatedGain.gain.value = 1.0 - amGain.gain.value;


        // FM Synthesis nodes
        var fmOsc = context.createOscillator();
        var fmGain = context.createGain();
        // if (fmSynthesis) {
        //   fmOsc.frequency.value = 100; //Temporary, really we need to let user choose frequency
        // } else {
        //   fmOsc.frequency.value = 0;
        // }
        fmOsc.frequency.value = 0;
        fmGain.gain.value = 100;

        // LFO nodes
        var lfoOsc = context.createOscillator();
        var lfoGain = context.createGain();
        lfoOsc.frequency.value = 0;
        lfoGain.gain.value = lfoDepth;


        var filter = context.createBiquadFilter();
        filter.type = filterType;
        filter.frequency.value = filterCutoff;
        filter.Q.value = filterQ;




        amOsc.connect(amGain);
        amGain.connect(modulatedGain.gain);

        fmOsc.connect(fmGain);
        fmGain.connect(osc.frequency);

        lfoOsc.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        osc.connect(modulatedGain);

        modulatedGain.connect(filter);

        filter.connect(keyGain);
        keyGain.connect(globalGain);

        osc.start(0);
        amOsc.start(0);
        fmOsc.start(0);
        lfoOsc.start(0);

        nodesDict["oscillator"] = osc;
        nodesDict["am"] = [amOsc, amGain, modulatedGain];
        nodesDict["fm"] = [fmOsc, fmGain];
        nodesDict["lfo"] = [lfoOsc, lfoGain];
        nodesDict["filter"] = filter;
        nodesDict["keyGain"] = keyGain;

        noteSignals[noteName] = nodesDict;

    });
}
initializeSignals();


function resetOscillatorFrequencies() {
    for (noteName of noteNames) {
        noteSignals[noteName]["oscillator"].frequency.value = getFrequencyOfNote(noteName);
    }
}


// Triggger boolean functions


function N_ActiveNotes(n){
    return activeNotes.size == n;
}

function atLeastN_ActiveNotes(n){
    return activeNotes.size >= n;
}

function atMostN_ActiveNotes(n){
    return activeNotes.size <= n;
}

// Including octave
function noteInSetIsActive(noteSet){
    let intersection = new Set([...activeNotes].filter(x => noteSet.has(x)));
    return intersection.size > 0;
}


function allOfNoteSetIsActive(noteSet){
    let intersection = new Set([...activeNotes].filter(x => noteSet.has(x)));
    return intersection.size == noteSet.size;
}

function onlyNoteSetIsActive(noteSet){
    let intersection = new Set([...activeNotes].filter(x => noteSet.has(x)));
    return intersection.size == noteSet.size &&
                  activeNotes.size == intersection.size;
}


// Not including octave
function pitchClassInSetIsActive(noteSet){
    let activePitches = new Set();
    for (e of activeNotes) {
	     activePitches.add(e.slice(0,-1));
    }

    let checkPitches = new Set();
    for (e of noteSet) {
	     checkPitches.add(e.slice(0,-1));
    }

    let intersection = new Set([...activePitches].filter
                                              (x => checkPitches.has(x)));
    return intersection.size > 0;
}

// Not including octave and exclusive
function onlyPitchSetIsActive(noteSet){
    let activePitches = new Set();
    for (e of activeNotes) {
	     activePitches.add(e.slice(0,-1));
    }

    let checkPitches = new Set();
    for (e of noteSet) {
	     checkPitches.add(e.slice(0,-1));
    }

    let intersection = new Set([...activePitches].filter
                                              (x => checkPitches.has(x)));
    return intersection.size == activePitches.size;
}

// Not including octave and non-exclusive
function allOfPitchSetIsActive(noteSet){
    let activePitches = new Set();
    for (e of activeNotes) {
	     activePitches.add(e.slice(0,-1));
    }

    let checkPitches = new Set();
    for (e of noteSet) {
	     checkPitches.add(e.slice(0,-1));
    }

    let intersection = new Set([...activePitches].filter
                                              (x => checkPitches.has(x)));
    return intersection.size <= activePitches.size;
}


function allOfChordIsActive(chord){
    let chordSet = chords[chord];
    return allOfPitchSetIsActive(chordSet);
}

function onlyChordIsActive(chord){
    let chordSet = chords[chord];
    return onlyPitchSetIsActive(chordSet);
}


function noteWaveformIs(noteName, waveform){
    return noteSignals[noteName]["oscillator"].type == waveform;
}

// True if note is above or the same as reference
function noteIsAbove(note, reference){
    return noteNameToMidiNote[note] >= noteNameToMidiNote[reference]
}

// True if note is below reference
function noteIsBelow(note, reference){
    return noteNameToMidiNote[note] < noteNameToMidiNote[reference]
}

function playHarmNoteOfNoteName(noteName) {
    let harmNote = midiNoteToNoteName[noteNameToMidiNote[noteName] + harmonizerInterval];
    playNote(harmNote);
    harmonizerNoteSet.add(harmNote);
}

function stopHarmNoteOfNoteName(noteName) {
    let harmNote = midiNoteToNoteName[noteNameToMidiNote[noteName] + harmonizerInterval];
    if (!activeNotes.has(harmNote)) {
       stopNote(harmNote);
    }
    harmonizerNoteSet.delete(harmNote);
}

function toggleHarmonizer(on=-1) {

    if (on === -1) {
        if (!harmonizerOn) {
            for (noteName of activeNotes) {
                playHarmNoteOfNoteName(noteName);
            }
            harmonizerOn = true;
        } else {
            for (noteName of activeNotes) {
                stopHarmNoteOfNoteName(noteName);
            }
            harmonizerOn = false;
        }
    } else if (on) {
        if (!harmonizerOn) {
            for (noteName of activeNotes) {
                playHarmNoteOfNoteName(noteName);
            }
            harmonizerOn = true;
        }
    } else {
        if (harmonizerOn) {
            for (noteName of activeNotes) {
                stopHarmNoteOfNoteName(noteName);
            }
            harmonizerOn = false;
        }
    }
}

function clearHarmonizerNoteSet() {
    for (noteName of harmonizerNoteSet) {
        if (!activeNotes.has(noteName)) {
            stopNote(noteName);
        }
        harmonizerNoteSet.delete(noteName);
    }
}

function changeHarmonizerInterval(newInterval) {
    if (harmonizerOn) {
        for (noteName of activeNotes) {
            let harmNote = midiNoteToNoteName[noteNameToMidiNote[noteName] + harmonizerInterval];
            stopNote(harmNote);
            harmonizerNoteSet.delete(harmNote);
        }
        harmonizerInterval = newInterval;
        for (noteName of activeNotes) {
            playHarmNoteOfNoteName(noteName);
        }
    } else {
        harmonizerInterval = newInterval;
        for (noteName of harmonizerNoteSet) {
            if (!activeNotes.has(noteName)) {
              stopNote(harmNote);
              harmonizerNoteSet.delete(harmNote);
            }
        }
    }
}


let _arpNotes;
let _arpIndex;
let _notePlaying;
let _arpAscending;
let _arpeggiatorInterval;
let _arpeggiating = false;



function removeNoteFromArpNotes(note) {
    let index = _arpNotes.indexOf(note);
    if (index !== -1) {
        _arpNotes.splice(index, 1);
    }
}

function insertNoteToArpNotes(note) {
    let midiNotes = [];
    for (noteName of _arpNotes) {
        midiNotes.push(noteNameToMidiNote[noteName]);
    }
    midiNotes.sort(function(a,b){return a-b});
    let insertMidiNote = noteNameToMidiNote[note];

    let idx = 0;
    while (idx < midiNotes.length) {
        //if the note is already present, do nothing
        if (midiNotes[idx] === insertMidiNote) {
            return;
        }
        //if note at this index is greater than insertion note, insert
        if (midiNotes[idx] > insertMidiNote) {
            break;
        }
        idx += 1;
    }
    _arpNotes.splice(idx, 0, note);
}

function arpeggiate() {

    let timeInterval = Math.floor(1000*(1/arpeggiatorRate));


    let midiNotes = [];
    for (noteName of activeNotes) {
        midiNotes.push(noteNameToMidiNote[noteName]);
    }
    midiNotes.sort(function(a,b){return a-b});
    _arpNotes = [];
    for (midiNote of midiNotes) {
        _arpNotes.push(midiNoteToNoteName[midiNote]);
    }
    if (arpeggiatorStyle === "up" || arpeggiatorStyle === "up-down"){
        _arpIndex = 0;
        _arpAscending = 1;
    } else if (arpeggiatorStyle === "down") {
        _arpIndex = _arpNotes.length - 1;
        _arpAscending = 0;
    } else {
        _arpIndex = Math.floor(Math.random() * _arpNotes.length);
    }
    _arpeggiating = true;
    _arpeggiatorInterval = setInterval(playArpNote, timeInterval);
}

function playArpNote() {
    if (typeof _notePlaying !== 'undefined') {
        stopNote(_notePlaying);
        if (harmonizerOn) {
            let harmNote = midiNoteToNoteName[noteNameToMidiNote[_notePlaying] + harmonizerInterval];
            stopNote(harmNote);
        }
    }
    if (_arpIndex >= _arpNotes.length) {
        _arpIndex = _arpNotes.length - 1;
    }

    if (!arpeggiatorOn) {
        _arpNotes = [];
        clearInterval(_arpeggiatorInterval);
        for (note of activeNotes) {
            playNote(note);
            if (harmonizerOn) {
                playHarmNoteOfNoteName(note);
            }
        }
    }

    _notePlaying = _arpNotes[_arpIndex];
    playNote(_notePlaying);

    if (harmonizerOn) {
        playHarmNoteOfNoteName(_notePlaying);
    } else {
        stopHarmNoteOfNoteName(_notePlaying);
    }

    if (arpeggiatorStyle === "up") {
        _arpIndex = (_arpIndex+1) % _arpNotes.length;
    } else if (arpeggiatorStyle === "up-down") {
        if (_arpIndex === 0 && !_arpAscending) {
            _arpAscending = 1 - _arpAscending;
        } else if (_arpIndex === _arpNotes.length - 1 && _arpAscending) {
            _arpAscending = 1 - _arpAscending;
        }

        if (_arpAscending) {
            _arpIndex += 1;
        } else {
            _arpIndex -= 1;
        }
    } else if (arpeggiatorStyle === "down") {
        _arpIndex = (_arpIndex-1);
        if (_arpIndex < 0) {
            _arpIndex += _arpNotes.length;
        }
    } else { //random
        _arpIndex = Math.floor(Math.random() * _arpNotes.length);
    }
}



//Helper function to make sure harmonizing doesn't cause an infinite loop
function playNote(note, velocity){
    globalGain.gain.setTargetAtTime(userGainLevel/activeNotes.size,
                                          context.currentTime, 0.01);

    if (amSynthesis) {
        noteSignals[note]["am"][0].frequency.value = amFreq;
    } else {
        noteSignals[note]["am"][0].frequency.value = 0;
    }
    if (fmSynthesis) {
        noteSignals[note]["fm"][0].frequency.value = fmFreq;
        noteSignals[note]["fm"][1].gain.setTargetAtTime(
                                        100,
                                        context.currentTime,
                                        0.01);
    } else {
        noteSignals[note]["fm"][0].frequency.value = 0;
        noteSignals[note]["fm"][1].gain.setTargetAtTime(
                                        0,
                                        context.currentTime,
                                        0.01);
    }
    if (lfo) {
        noteSignals[note]["lfo"][0].frequency.value = lfoFreq;
        noteSignals[note]["lfo"][1].gain.value = lfoDepth;
    } else {
        noteSignals[note]["lfo"][0].frequency.value = 0;
        noteSignals[note]["lfo"][1].gain.setTargetAtTime(
                                        0,
                                        context.currentTime,
                                        0.01);
    }
    if (filterOn) {
        noteSignals[note]["filter"].type = filterType;
        noteSignals[note]["filter"].frequency.value = filterCutoff;
        noteSignals[note]["filter"].Q.value = filterQ;
    } else {
        noteSignals[note]["filter"].type = "lowpass";
        noteSignals[note]["filter"].frequency.value = 10000;
        noteSignals[note]["filter"].Q.value = 1;
    }



    noteSignals[note]["oscillator"].type = waveform;


    let keyGain = noteSignals[note]["keyGain"];
    if (typeof velocity !== 'undefined') {
        var amp = 0.95*(velocity/127);
    } else {
        var amp = 0.90;
    }

    console.assert(amp <= 1, amp, velocity);
    keyGain.gain.setTargetAtTime(amp, context.currentTime, 0.01)

}

function stopNote(note){
    // globalGain.gain.setTargetAtTime(userGainLevel/activeNotes.size,
    //                                       context.currentTime, 0.01);

    let keyGain = noteSignals[note]["keyGain"];
    keyGain.gain.setTargetAtTime(0.00001, context.currentTime, 0.01)
}


function audioKeyDown(note, frequency, velocity) {

    activeNotes.add(note);

    if (arpeggiatorOn && activeNotes.size > 1) {
        if (typeof _arpNotes !== 'undefined'){
            for (noteName of _arpNotes){
                stopNote(noteName);
            }
        }
        if (_arpeggiating) {
            insertNoteToArpNotes(note);
        } else {
          clearInterval(_arpeggiatorInterval);
          arpeggiate();
          _arpeggiating = true;
        }
        return;
    }

    playNote(note, velocity);

    if (harmonizerOn) {
        playHarmNoteOfNoteName(note);
    } else {
        clearHarmonizerNoteSet();
    }

    //for some reason it won't play without these two lines.
    //they literally do nothing. the oscillator isn't connected to anything.
    let oscillator = context.createOscillator();
    oscillator.start(0);

};


function audioKeyUp(note, frequency) {
    activeNotes.delete(note);

    if (arpeggiatorOn) {
        if (typeof _arpNotes !== 'undefined'){
            for (noteName of _arpNotes){
                stopNote(noteName);
            }
        }
        if (_arpeggiating && activeNotes.size > 1) {
            removeNoteFromArpNotes(note);
        } else {
            clearInterval(_arpeggiatorInterval);
            _arpeggiating = false;
            for (noteName of activeNotes) {
                playNote(noteName);
            }
        }
    }

    stopNote(note);

    if (harmonizerOn) {
        stopHarmNoteOfNoteName(note);
    } else {
        clearHarmonizerNoteSet();
    }
};


function qwertyKeyDown(note, frequency) {
    audioKeyDown(note, frequency);
    reactiveUpdateOnMIDI(noteNameToMidiNote[note], 127);
}
function qwertyKeyUp(note, frequency) {
    audioKeyUp(note, frequency);
}



// This function will be removed once synthesized.
function reactiveUpdateOnMIDI(note, velocity){}

//////////////////////////////////
//  CHANGE KEYBOARD ID TO MIDI  //
//////////////////////////////////

const allKeys = document.getElementById("keyboard").children[0].children;

// document.addEventListener("DOMContentLoaded", _ => {
    for(let i=0; i<allKeys.length; i++){
        const keyNote = allKeys[i],
              midiNoteName = "note" + noteNameToMidiNote[keyNote.getAttribute("id")];
        keyNote.setAttribute("id", midiNoteName);
        keyNote.setAttribute("class", "keyboardNote");
    }
// })



// comment
