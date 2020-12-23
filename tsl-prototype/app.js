/////////////////////
//  Specification  //
/////////////////////

// TODO: use
const spec1Head = document.getElementById('1-predicate-fst');
console.log(spec1Head).value;

//////////////////////
//  HTTP w/ Server  //
//////////////////////
const synthesized = "foobarbaz";
document.getElementsByTagName("textarea")[0].value = synthesized;

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

////////////////////////
//  Synthesized Code  //
////////////////////////
spec = `
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

// Implemented functions
function btnPressed(btnBool) {
  return btnBool;
}

function play() {
  return true;
}

function stop() {
  return false;
}

// Initialize cells and outputs
let o_audio = true,
    o_trackA = true,
    o_trackB = true,
    o_trackC = false,
    c_audio = o_audio,
    c_trackA = o_trackA,
    c_trackB = o_trackB,
    c_trackC = o_trackC;

// Human transpiled to js from kotlin.
function updateAudio(btnA, btnB) {
  let btnAPressed = btnPressed(btnA);
  let btnBPressed = btnPressed(btnB);
  let circuit = this.controlCircuit(btnAPressed, btnBPressed);

  c_audio = o_audio;
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

function audioSwitch(stop, play, prev) {
  const temp = play[1] ? play[0] : prev[0];
  return stop[1] ? stop[0] : temp;
}

function trackASwitch(prev, play) {
  return prev[1] ? prev[0] : play[0]
}

function trackBSwitch(prev, stop, play) {
  const temp = stop[1] ? stop[0] : play[0];
  return prev[1] ? prev[0] : temp;
}

function trackCSwitch(prev, play) {
  return prev[1] ? prev[0] : play[0];
}

function controlCircuit(btnAPressed, btnBPressed) {
  return [false, true, true, false, false, true, false, false, false, true];
}

/////////////////////
//  Audio Control  //
/////////////////////

let audioCtx;
const audioGain = 0.1;
let switchVal = 0;

async function loadBuffer(bufferURL) {
  const response = await fetch(bufferURL);
  const arrayBuffer = await response.arrayBuffer();
  return await audioCtx.decodeAudioData(arrayBuffer);
}

async function initWebAudio() {
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

document.getElementById('btnA').addEventListener("click", async function () {
  await initWebAudio();
})

document.getElementById('btnB').addEventListener("click", function () {
  if (switchVal % 2 === 0) {
    audioCtx.suspend();
    switchVal++;
  } else {
    audioCtx.resume();
    switchVal++;
  }
}, false);

/////////////////////
//  Program Logic  //
/////////////////////

let playButton = document.getElementById('playBtn');
let currPlaying = false;

// Manages play/pause and audio update based on event listeners
playButton.addEventListener("click", function() {
  if(!currPlaying){
    currPlaying = true;
    react();
  }
  else{
    currPlaying = false;
  }
});

function react(){
  buttonA.addEventListener("click", _ => updateAudio(true, false) && playAudio());
  buttonB.addEventListener("click", _ => updateAudio(false, true) && playAudio());
}

// TODO: make fake circuit

// TODO: implement this part
function playAudio(){
  if(o_audio){
    if(o_trackA){}
    else{}
    if(o_trackB){}
    else{}
    if(o_trackC){}
    else{}
  }
  else
    audioCtx.suspend();
}
