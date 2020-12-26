const tslSpec=`
initially guarantee {
    [Wave <- Square];
}

always guarantee {
    Press C4 -> X [Wave <- Sawtooth];
}
`

// https://gist.github.com/aerrity/fd393e5511106420fba0c9602cc05d35
function synthesize(spec){
    // POST
    fetch('/spec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            spec: spec
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
    fetch('/synthesized', {method: 'GET'})
        .then(function(response){
            if(response.ok){
                console.log("GET success.");
                return response.json();
            }
            throw new Error('GET failed.');
        })
        .then(function(data){
            let synthesized = data.result;
            let script = document.createElement("script");
            script.text = synthesized;
            document.body.appendChild(script);
        })
        .catch(function(error) {
            console.log(error);
        });

}

synthesize(tslSpec);

// function addScript(scriptName){
//     let controlJS = document.createElement("script");
//     controlJS.setAttribute("src", scriptName);
//     document.body.appendChild(controlJS);
// }

// document.getElementById("synthesize-btn").addEventListener(
//     "click", _ => {
//         addScript("public/control.js");
//     }
// );