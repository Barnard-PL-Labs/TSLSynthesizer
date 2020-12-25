const execFile = require('child_process').execFile;
const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const PORT = 8080;

let tmpFileName;

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
app.get('/synthesized', async (req, res) => {
    let synthesized = await synthesize();
    await deleteTmpFile();
    res.send({result:synthesized});
})

app.post('/spec', async (req, res) => {
    await writeTmpFile(req.body.spec);
    res.sendStatus(201);
})

function writeTmpFile(spec){
    tmpFileName = "tmp" + Math.random().toString().slice(2,8) + ".tsl";
    return new Promise(resolve => {
        fs.writeFile(tmpFileName, spec, function (err) {
            if (err) throw err;
            else
                console.log('Temp file creation successful.');
            resolve();
        });
    })
}

function deleteTmpFile(spec){
    return new Promise(resolve => {
        fs.unlink(tmpFileName, function (err) {
            if (err) throw err;
            else
                console.log('Temp file deletion successful.');
            resolve();
        });
    })
}

// Function to synthesize TSL spec
// Currently ignores input and runs hardcoded output.
function synthesize() {
    return new Promise(resolve => {
        execFile('sh', ['synthesize.sh', tmpFileName],
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

