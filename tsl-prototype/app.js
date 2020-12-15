/////////////////////
//  Audio Control  //
/////////////////////

// Swap with webaudio later on
let audioSource = document.getElementById("audioSource");
let audioTag = document.getElementById('audio');

function playAudio(input) {
  //empty var to read file
  let reader;
  //if a file is uploaded then use FileReader to read file
  if (input.files && input.files[0]) {
    reader = new FileReader();
    //onload set the audio source with the uploaded audio
    reader.onload = function(e) {
      audioSource.setAttribute('src', e.target.result);
      //load source
      audioTag.load();
      //play source
      audioTag.play();
    }
    //read contents of of file
    reader.readAsDataURL(input.files[0]);
  }
}

/////////////////////
//  Specification  //
///////////////////// 

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


/////////////////////
//  Program Logic  //
/////////////////////

let playButton = document.getElementById('playBtn');
let currPlaying = false;
let program;

// Manages play/pause and audio update based on event listeners
playButton.addEventListener("click", function() {
  if(!currPlaying){
    program = new hardCodedProgram(playAudio);
    currPlaying = true;
    document.body.addEventListener("click", function(){program.play()});
  }
  else{
    currPlaying = false;
    audioTag.pause();
  }
});

////////////////////////
//  Synthesized Code  //
////////////////////////

let synthesized = document.getElementsByTagName("textarea")[0];

const spec1 = "Always Track1 Until Track2\npressButtonA -> Track2"
class hardCodedProgram{
  constructor(playAudio){
    this.track2Playing = false;
    this.playAudio = playAudio;
    buttonA.addEventListener("click", _ => this.track2Playing = true);
    synthesized.value = spec1;
  }
  play(){
    audioTag.pause();
    if(!this.track2Playing)
      playAudio(trackA);
    else
      playAudio(trackB);
  }
}


// TODO
/*

// Spec:
// button1 --> play/pause
// knob 1 --> volume
// knob 2 --> freq
// trackA and trackB
// trackB until trackC
// buttonB -> play/pause trackB
function hardCodedProgram2(){
  let isPlaying = null; // Then isPlaying can change
  // [isPlaying <- trackA] is predicate
}

// Uses DOM elements.
function programFromSpecification(){
}

// Uses parameters.
function programWithArgs(){
}
 */


//////////////////////
//  HTTP w/ Server  //
//////////////////////