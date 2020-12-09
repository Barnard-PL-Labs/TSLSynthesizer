//get input by id
var audioFile = document.getElementById("file")
//get source by id
var audioSource = document.getElementById("audioSource");
//get audio by id
var audioTag = document.getElementById('audio');

//apply event listener to input using the playAudio function
audioFile.addEventListener("change", function() {
  playAudio(this);
});


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