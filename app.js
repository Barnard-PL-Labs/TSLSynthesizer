const http = require('http');
const fs = require('fs');
const execFile = require('child_process').execFile;

const PORT = 8080;

fs.readFile('./index.html', function (err, html) {
  if(err)
    throw err;
  http.createServer(function(request, response){
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(html);
    response.end();
  }).listen(PORT);
})

async function execute(){
  let result = await sh();
  console.log("RESULT: " + result);
}

function sh() {
    return new Promise(resolve => {
        execFile('./demo-files/demo.sh', ['1st', '2nd', '3rd'],
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

execute();