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
    program = new ReactiveControl();
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
spec= `
  --- Full TSL Spec ---
  // buttonA => play/stop audio
  press buttonA && [audio <- play] -> X [audio <- stop];
  press buttonA && [audio <- stop] -> X [audio <- play];

  // buttonB => play/stop trackB
  press buttonB && [trackB <- play] -> X [trackB <- stop];
  press buttonB && [trackB <- stop] -> X [trackB <- play];

  // trackB => trackA
  [trackB <- play] -> [trackA <- play];

  // trackB UNTIL trackC
  [trackB <- play] W [trackC <- play];
`

// TODO
function p_press(foo){}
function play(){return true;}
function stop(){return false;}

let o_audio  = true,
    o_trackA = true,
    o_trackB = true,
    o_trackC = false,
    c_audio  = o_audio,
    c_trackA = o_trackA,
    c_trackB = o_trackB,
    c_trackC = o_trackC;

// Human transpiled to js from kotlin.
class ReactiveControl{
  constructor(buttonA, buttonB){
    this.btnAPressed = p_press(buttonA);
    this.btnBPressed = p_press(buttonB);
  }
  returnOutput(){
    let circuit = this.controlCircuit();

    c_audio  = o_audio;
    c_trackA = o_trackA;
    c_trackB = o_trackB;
    c_trackC = o_trackC;

    let stop = stop();
    let play = play();

    o_audio = this.audioSwitch([stop, circuit[7]],
                               [play, circuit[8]],
                               [c_audio, circuit[9]]);
    o_trackA = this.trackASwitch([c_trackA, circuit[5]],
                                 [play, circuit[6]]);
    o_trackB = this.trackBSwitch([c_trackB, circuit[2]],
                                 [stop, circuit[3]],
                                 [play, circuit[4]]);
    o_trackC = this.trackCSwitch([c_trackC, circuit[0]],
                                 [play, circuit[1]]);
  }
  audioSwitch(stop, play, prev){
    const temp = play[1] ? play[0] : prev[0];
    return stop[1] ? stop[0] : temp;
  }
  trackASwitch(prev, play){
    return prev[1] ? prev[0] : play[0]
  }
  trackBSwitch(prev, stop, play){
    const temp = stop[1] ? stop[0] : play[0];
    return prev[1] ? prev[0] : temp;
  }
  trackCSwitch(prev, play){
    return prev[1] ? prev[0] : play[0];
  }
  controlCircuit(){
    return [false, true, true, false, false, true, false, false, false, true];
  }
}


//////////////////////
//  HTTP w/ Server  //
//////////////////////
