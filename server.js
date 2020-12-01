const execFile = require('child_process').execFile;
const express = require('express');
const app = express();
app.use(express.json());

const PORT = 8080;

let tslSpec;

//https://gist.github.com/aerrity/fd393e5511106420fba0c9602cc05d35
app.use(express.static("./public"));

// Start the express web server listening on 8080
app.listen(8080, () => {
  console.log(`Service started on port ${PORT}.`);
});

// Serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// GET and POST
app.get('/clicks', async (req, res) => {
  let synthesized = await synthesize(tslSpec);
  let returnStr = tslSpec + "<br><br>Synthesized:<br><br>" + synthesized;
  res.send({result:returnStr});
})

app.post('/clicked', (req, res) => {
  tslSpec = req.body.spec;
  res.sendStatus(201);
})

// Function to synthesize TSL spec
function synthesize(tsl) {
    return new Promise(resolve => {
        execFile('demo-files/demo.sh', [tsl],
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
  let demoResult = await synthesize("foobarbaz");
  if(demoResult=="foobarbaz\n")
    console.log("Async demo success!");
  else
    console.log("Async demo failure...");
})();