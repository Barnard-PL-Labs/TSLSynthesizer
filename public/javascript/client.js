console.log("Client-side activated.");

// Create onclick event
document.getElementById("synthesisBtn").addEventListener("click", showResult);

function showResult(){
  let display = document.getElementById("tslResult");
  display.innerHTML = "Hi!";
}