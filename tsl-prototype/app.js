var audioCtx;
var osc;

(function(){
    if(audioCtx){
        return;
    }
    audioCtx = new(window.AudioContext || window.webkitAudioContext)
    const globalGain = audioCtx.createGain();
    globalGain.gain.setValueAtTime(.4, audioCtx.currentTime);

    oscSteady = audioCtx.createOscillator();
    oscSteady.frequency.setValueAtTime(1200, audioCtx.currentTime);
    oscSteady.connect(globalGain).connect(audioCtx.destination);
    oscSteady.start();

    osc = audioCtx.createOscillator();
    osc.connect(globalGain).connect(audioCtx.destination);
    osc.start();
})();