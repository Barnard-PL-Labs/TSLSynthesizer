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

// VARIABLE INIT
let nodes = [];
let waveform = 'sine';
let masterGain = document.getElementById("gain");

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

keyboard.keyDown = function (note, frequency) {
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

keyboard.keyUp = function (note, frequency) {
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

keyboard = new QwertyHancock(settings);

const allKeys = document.getElementById("keyboard").children[0].children;
