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
  let returnStr = "<em><strong>Specification</strong></em>:<br><br>" + 
    tslSpec + "<br><br>" + 
    "<em><strong>Synthesized</strong></em>:<br><br>" + 
    synthesized;
  res.send({result:returnStr});
})

app.post('/clicked', (req, res) => {
  tslSpec = req.body.spec;
  res.sendStatus(201);
})

// Function to synthesize TSL spec
// Currently ignores input and runs hardcoded output.
function synthesize(tsl) {
    return new Promise(resolve => {
        execFile('tsltools/tsl2tlsf', ['tsltools/frpzoo.tsl'],
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