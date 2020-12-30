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

let nodes = [];
let waveform = 'sine';

let volumeControl = document.getElementById("gain");
let masterGain = parseFloat(volumeControl.value);
volumeControl.addEventListener("change", _=>{
    masterGain = parseFloat(volumeControl.value);
}, false);

let waveformControl = document.getElementById("waveform");
waveformControl.addEventListener("change", _ => {
    waveform = waveformControl.value;
}, false);

let amSynthesis = false;
let amBtn = document.getElementById("am-btn");
let amFreqRange = document.getElementById("amFreq");
amBtn.addEventListener("click", _ =>{
    if(!amSynthesis){
        amSynthesis = true;
        fmSynthesis = false;
    }
    else
        amSynthesis = false;
})
let amFreq = parseInt(amFreqRange.value);
amFreqRange.addEventListener("change", _ => {
    amFreq = parseInt(amFreqRange.value);
})

let fmSynthesis = false;
let fmBtn = document.getElementById("fm-btn");
let fmFreqRange = document.getElementById("fmFreq");
fmBtn.addEventListener("click", _ => {
    if(!fmSynthesis){
       fmSynthesis = true;
       amSynthesis = false;
    }
    else
        fmSynthesis = false;
})

let vibrato = false;
let lfoBtn = document.getElementById("lfo-btn");
lfoBtn.addEventListener("click", _ => {
    vibrato = !vibrato;
})

let carrierMap = {};

keyboard.keyDown = function (note, frequency) {
    let oscillator = context.createOscillator();
    const modulationIndex = context.createGain();
    oscillator.type = waveform;

    oscillator.frequency.value = frequency;
    modulationIndex.gain.value = masterGain;

    if(amSynthesis){
        let carrier = context.createOscillator();
        carrier.frequency.value = amFreq;

        const modulated = context.createGain();
        modulated.gain.value = 1.0 - masterGain;

        oscillator.connect(modulationIndex).connect(modulated.gain);
        carrier.connect(modulated);
        modulated.connect(context.destination);
        carrier.start(0);

        carrierMap[oscillator] = carrier;
    }

    else if(fmSynthesis){
        modulationIndex.gain.value *= 100;
        oscillator.connect(modulationIndex);

        let carrier = context.createOscillator();
        modulationIndex.connect(carrier.frequency);

        carrier.connect(context.destination);
        carrier.start(0);

        carrierMap[oscillator] = carrier;
    }

    else {
        oscillator.connect(modulationIndex);
        modulationIndex.connect(context.destination);
    }

    if(vibrato){

    }

    oscillator.start(0);
    nodes.push(oscillator);

};

keyboard.keyUp = function (note, frequency) {
    let new_nodes = [];

    for (let i = 0; i < nodes.length; i++) {
        if (Math.round(nodes[i].frequency.value) === Math.round(frequency)) {
            nodes[i].stop(0);
            nodes[i].disconnect();
            // XXX
            if(nodes[i] in carrierMap){
                carrierMap[nodes[i]].stop(0);
                carrierMap[nodes[i]].disconnect();
                delete carrierMap[nodes[i]];
            }
        } else {
            new_nodes.push(nodes[i]);
        }
    }

    nodes = new_nodes;
};

keyboard = new QwertyHancock(settings);
