//get input by id
var trackA = document.getElementById("trackAFile")
//get source by id
var audioSource = document.getElementById("audioSource");
//get audio by id
var audioTag = document.getElementById('audio');

//button to press play
var playButton = document.getElementById('playBtn')

playButton.addEventListener("click", function() {
  playAudio(trackA);
})

/*
  make sure to have an event listener, but to depend on the actions of the circuit

  - the function/circuit should start when we press play
  -                             stop  when we press pause

  boil down to a very stripped down version of the app:
    - always Track1 until Track2
    - pressButton -> Track2
*/

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