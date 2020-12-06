var audioContext;

var modulatorFreq;
var modulationIdx;

function init() {
    audioContext = new(window.AudioContext || window.webkitAudioContex);
    var osc = audioContext.createOscillator();
    modulatorFreq = audioContext.createOscillator();

    modulationIdx = audioContext.createGain();
    modulationIdx.gain.value = 100;
    modulatorFreq.frequency.value = 100;

    modulatorFreq.connect(modulationIdx);
    modulationIdx.connect(osc.frequency);

    osc.connect(audioContext.destination);

    osc.start();
    modulatorFreq.start();
}

// init();