
const {exec, execFile} = require('child_process');
const express = require('express');
const fs = require('fs');
const https = require('https');
const app = express();

app.use(express.json());

let tmpFileHeader;
let tslFile;

//https://gist.github.com/aerrity/fd393e5511106420fba0c9602cc05d35
app.use(express.static("./public"));

//try with https, if files found, go to app.listen
try {
    const httpsOptions = {
        cert: fs.readFileSync("/etc/letsencrypt/live/tslsynthesissynthesizer.com/fullchain.pem"),
    //	ca: fs.readFileSync(""),
        key: fs.readFileSync("/etc/letsencrypt/live/tslsynthesissynthesizer.com/privkey.pem")
    };

    const httpsServer = https.createServer(httpsOptions, app);

    httpsServer.listen(443, 'tslsynthesissynthesizer.com');
} catch {
    //to run locally
    const PORT = 4747;
    app.listen(PORT, () => {
        console.log(`Service started on port ${PORT}.`);
    });
}
// Serve the homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// GET and POST
app.get('/synthesized', async (req, res) => {
    let synthesized = await synthesize();
    await deleteTmpFiles();
    res.send({result:synthesized});
})

app.post('/spec', async (req, res) => {
    await writeTmpFile(req.body.spec);
    res.sendStatus(201);
})

function writeTmpFile(spec){
    tmpFileHeader = "tmp" + Math.random().toString().slice(2,8);
    tslFile = tmpFileHeader + ".tsl";
    return new Promise(resolve => {
        fs.writeFile(tslFile, spec, function (err) {
            if (err) throw err;
            else
                console.log('Temp file creation successful.');
            resolve();
        });
    })
}

function deleteTmpFiles(){
    const shellCmd = "rm " + tmpFileHeader + "*";
    return new Promise(resolve => {
        exec(shellCmd,
            function(err, data){
                if (err)
                    console.log("Temp file deletions unsuccessful.\nPlease manually delete them.");
                else
                    console.log("Temp files deletion successful.");
                resolve();
            })
    })
}

// Function to synthesize TSL spec
function synthesize() {
    return new Promise(resolve => {
        execFile('bash', ['synthesize.sh', tslFile],
            function (err, data) {
                let returnValue;
                // XXX
                if (err) {
                    returnValue = "ERROR" + err;
                }
                else {
                    returnValue = data.toString();
                }
                resolve(returnValue);
            })
    })
}
