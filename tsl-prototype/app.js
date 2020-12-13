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

/////////////////////
//  Mixer Buttons  //
///////////////////// 

let buttonA = document.getElementById("btnA");

/////////////////////
//  Program Logic  //
///////////////////// 

let playButton = document.getElementById('playBtn');
let currPlaying = False;
let audioOutput;

// Manages play/pause and audio update based on event listeners
playButton.addEventListener("click", function() {
  if(!currPlaying){
    let program = hardCodedProgram();
    currPlaying = True;
    anyKey.addEventListener("onclick", audioOutput = program.audioOutput());
  }
  else{
    currPlaying = False;
    audioOutput.stop();
  }
});

// Make this a class
function hardCodedProgram() {
  let track2Playing = False;
  buttonA.addEventListener("onclick", function(){track2Playing = True;});
  function audioOutput() {
    if(!track2Playing)
      return trackA;
    else
      return trackB;
  }
}

/*
  make sure to have an event listener, but to depend on the actions of the circuit

  - the function/circuit should start when we press play
  -                             stop  when we press pause

  - learn how to get elements from spec.

  boil down to a very stripped down version of the app:
    - always Track1 until Track2
    - pressButton -> Track2
*/

// Swap with webaudio later on
let audioSource = document.getElementById("audioSource");
let audioTag = document.getElementById('audio');

function playAudio(input) {
  //empty var to read file
  var reader;
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