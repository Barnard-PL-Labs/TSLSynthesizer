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

let masterGain = document.getElementById("gain");

let waveformControl = document.getElementById("waveform");
waveformControl.addEventListener("change", _ => {
    waveform = waveformControl.value;
}, false);

let amSynthesis = false;
let amBtn = document.getElementById("am-btn");
let amFreq= document.getElementById("amFreq");
amBtn.addEventListener("click", _ =>{
    if(!amSynthesis){
        amSynthesis = true;
        fmSynthesis = false;
    }
    else
        amSynthesis = false;
})

let fmSynthesis = false;
let fmBtn = document.getElementById("fm-btn");
fmBtn.addEventListener("click", _ => {
    if(!fmSynthesis){
       fmSynthesis = true;
       amSynthesis = false;
    }
    else
        fmSynthesis = false;
})

let vibrato = false;
let vibFreq =  document.getElementById("lfoFreq");
let vibDepth =  document.getElementById("lfoDepth");
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

    if(vibrato){
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
