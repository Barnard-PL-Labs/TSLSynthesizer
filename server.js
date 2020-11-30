const execFile = require('child_process').execFile;
const express = require('express');
const app = express();

const PORT = 8080;

//https://gist.github.com/aerrity/fd393e5511106420fba0c9602cc05d35
app.use(express.static("./public"));

// Start the express web server listening on 8080
app.listen(8080, () => {
  console.log('Service started on port 8080.');
});

// Serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Function to synthesize TSL spec
function synthesize() {
    return new Promise(resolve => {
        execFile('demo-files/demo.sh', ['1st', '2nd', '3rd'],
            function (err, data) {
                let returnValue;
                if (err) {
                    returnValue = "ERROR:\n" + err;
                }
                else {
                    returnValue = data.toString();
                }
                resolve(returnValue);
            })
    })
}

// Test the demo
(async function(){
  let demoResult = await synthesize();
  if(demoResult=="2nd\n")
    console.log("Async demo success!");
  else
    console.log("Async demo failure...");
})();