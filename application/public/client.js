// Rudimentary, needs buffing.
function getSpecFromDOM(){
    let tslSpec = "always guarantee {\n";
    let specifications = document.getElementById("specification");
    for(let i=0; i < specifications.children.length; i++){
        const spec = specifications.children[i];
        // Predicate
        console.assert(spec.querySelectorAll(".predicate").length === 1);
        let predicate = spec.querySelector(".predicate").value;
        // Action
        console.assert(spec.querySelectorAll(".action").length === 1);
        let action = spec.querySelector(".action").value;
        // Create spec
        tslSpec += `Press ${predicate} -> [Wave <- ${action}];`;
    }
    tslSpec += "\n}";
    console.log(`Got spec from DOM:\n${tslSpec}`);
    return tslSpec;
}

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
            // TODO: allow functions to be auto-implemented
            addScript("control.js");
        })
        .catch(function(error) {
            console.log(error);
        });

}

document.getElementById("synthesize-btn").addEventListener(
    "click", _ => {
        const spec = getSpecFromDOM();
        synthesize(spec);
    }
);

function addScript(scriptName){
    let controlJS = document.createElement("script");
    controlJS.setAttribute("src", scriptName);
    document.body.appendChild(controlJS);
}

