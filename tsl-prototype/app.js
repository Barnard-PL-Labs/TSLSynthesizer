/////////////////////
//  Audio Control  //
/////////////////////

let audioCtx;
const audioGain = 0.1;
let switchVal = 0;

async function loadBuffer(bufferURL){
  const response = await fetch(bufferURL);
  const arrayBuffer = await response.arrayBuffer();
  return await audioCtx.decodeAudioData(arrayBuffer);
}

async function initWebAudio(){
  audioCtx = new (window.AudioContext || window.webkitAudioContext);
  let audioSource = await loadBuffer('./sample.mp3');
  let source = audioCtx.createBufferSource();
  source.buffer = audioSource;

  let gainNode = audioCtx.createGain();
  gainNode.gain.value = audioGain;
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  source.loop = true;
  source.start();

  let audioSrc2 = await loadBuffer('./sample2.mp3');
  let src2 = audioCtx.createBufferSource();
  src2.buffer = audioSrc2;
  src2.connect(audioCtx.destination);
  src2.start();
}

document.getElementById('btnA').addEventListener("click", async function(){
  await initWebAudio();
})

document.getElementById('btnB').addEventListener("click", function(){
  if(switchVal % 2 === 0){
    audioCtx.suspend();
    switchVal ++;
  }
  else{
    audioCtx.resume();
    switchVal ++;
  }
}, false);

/////////////////////
//  Specification  //
/////////////////////

// TODO: get spec from DOM

///////////////////
//  Track Files  //
/////////////////// 

let trackA = document.getElementById("trackAFile");
let trackB = document.getElementById("trackBFile");
let trackC = document.getElementById("trackCFile");
let trackD = document.getElementById("trackDFile");
let noTrack = null;

/////////////////////
//  Mixer Buttons  //
///////////////////// 

let buttonA = document.getElementById("btnA");
let buttonB = document.getElementById("btnB");
let knobA = document.getElementById("knobA");
let knobB = document.getElementById("knobB");


/////////////////////
//  Program Logic  //
/////////////////////

let playButton = document.getElementById('playBtn');
let currPlaying = false;
let program;

// Manages play/pause and audio update based on event listeners
playButton.addEventListener("click", function() {
  if(!currPlaying){
    program = new Control();
    currPlaying = true;
    document.body.addEventListener("click", function(){program.play()});
  }
  else{
    currPlaying = false;
    program.stop();
  }
});

////////////////////////
//  Synthesized Code  //
////////////////////////

let synthesized = document.getElementsByTagName("textarea")[0];
/*
  --- Full TSL Spec ---
  press buttonA &&  [output <- audio] => ![output <- audio]
  press buttonA && ![output <- audio] =>  [output <- audio]
  [audio <- playAudio trackA trackB trackC aPlaying bPlaying cPlaying gain freq]
  [gain <- knob1]
  [freq <- knob2]
  bPlaying => aPlaying
  bPlaying UNTIL cPlaying
  press buttonB && bPlaying => [trackB <- stop]
  [trackB <- stop] => NEXT !bPlaying
  [trackB <- play] => NEXT  bPlaying
 */
const spec2 = "buttonA=>play/stop\n" +
              "knob1=>gain\n" +
              "knob2=>freq\n" +
              "trackB => trackA\n" +
              "playing trackB UNTIL playing trackC\n" +
              "buttonB=>play/stop trackB"
class Control{
  // Synthesized
  constructor() {
    this.output = null;
    this.audio = null;
    this.gain = 0;
    this.freq = 0;
    this.trackAPlaying = false;
    this.trackBPlaying = false;
    this.trackCPlaying = false;
    this.untilConsumed = false;
    this.control();
    synthesized.value = spec2;
  }
  // Synthesized
  control(){
    // press buttonA => play/stop
    buttonA.addEventListener("click",
        ev => this.audio = this.audioPlayingControl(this.output, this.audio));
    // press buttonB => play/stop trackB
    buttonB.addEventListener("click",
        ev => this.trackBPlaying = this.trackBPlayingControl(this.trackBPlaying));
    // [gain <- knobA]
    knobA.addEventListener("change",
        ev => this.gain = this.changeGain(ev));
    // [freq <- knobB]
    knobB.addEventListener("change",
        ev => this.gain = this.changeFreq(ev));
    // [audio <- playAudio trackA trackB trackC aPlaying bPlaying cPlaying]
    document.body.addEventListener("click",
        ev => this.audio =
                     this.audioUpdate(trackA, trackB, trackC,
                                      this.trackAPlaying, this.trackBPlaying, this.trackCPlaying,
                                      this.gain, this.freq));
    // bPlaying => aPlaying
    document.body.addEventListener("click",
        ev => this.trackAPlaying = this.bImpliesA(this.trackBPlaying));
    // bPlaying UNTIL cPlaying
    document.body.onload = ev => this.trackBPlaying = this.initB();
    document.body.addEventListener("click",
        ev => this.trackCPlaying = this.bUntilC(this.trackBPlaying, this.untilConsumed));
  }

  // Synthesized (control) functions
  audioPlayingControl(output, audio){
    if(output !== audio)
      return audio;
    else
      return null;
  }
  trackBPlayingControl(trackBPlaying){
    return !trackBPlaying;
  }
  bImpliesA(trackBPlaying){
    if(trackBPlaying)
      return true;
    return true;  // equally valid to return false
  }
  initB(){
    return true;
  }
  bUntilC(trackBPlaying, untilConsumed){
    if(!trackBPlaying && untilConsumed)
      return true;
    return true;  // equally valid to return false
  }
  changeFreq(freq){
    return freq;
  }
  changeGain(gain){
    return gain;
  }

  // Implemented functions
  playAudio(trackA, trackB, trackC,
              trackAPlaying, trackBPlaying, trackCPlaying,
              gain, freq){
    // Do some webAudio magic
  }
  play(){
    // Play this.audio
  }
  stop(){
    // Stop webAudio
  }
}


//////////////////////
//  HTTP w/ Server  //
//////////////////////
