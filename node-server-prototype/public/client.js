// Create onclick event
let inputBox = document.getElementById("inputBox");
document.getElementById("synthesisBtn").addEventListener("click", showResult);

// https://gist.github.com/aerrity/fd393e5511106420fba0c9602cc05d35
function showResult(){

  let display = document.getElementById("tslResult");

  // POST
  fetch('/clicked', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      spec: inputBox.value
    })
  })
    .then(function(response){
      if(response.ok){
        console.log('POST success.');
        return;
      }
      throw new Error('POST failed.');
    })
    .catch(function(error){
      console.log(error);
    });

  // GET
  fetch('/clicks', {method: 'GET'})
    .then(function(response){
      if(response.ok){
        console.log("GET success.");
        return response.json();
      }
      throw new Error('GET failed.');
    })
    .then(function(data){
      display.innerHTML = data.result;
    })
    .catch(function(error) {
      console.log(error);
    });

}