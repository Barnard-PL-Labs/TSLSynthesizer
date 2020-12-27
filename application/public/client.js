let synthStatus = document.getElementById("synth-status");

// Rudimentary, needs buffing.
function getSpecFromDOM(){
    let tslSpec = "";
    let specifications = document.getElementById("specification");
    for(let i=0; i < specifications.children.length; i++){
        const spec = specifications.children[i];

        // Predicate
        console.assert(spec.querySelectorAll(".predicate").length === 1);
        let predicate = spec.querySelector(".predicate").value;

        // Action
        console.assert(spec.querySelectorAll(".action").length === 1);
        let action = spec.querySelector(".action").value;

        // If spec is unspecified
        if(!predicate || !action)
            continue;

        // Create spec
        tslSpec += `Press ${predicate} -> [Wave <- ${action}];\n`;
    }

    // If no specs have been initialized
    if(!tslSpec){
        console.log("No specs initialized.");
        return "";
    }

    tslSpec = "always guarantee {\n" + tslSpec + "}";
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
            console.log(typeof(synthesized));

            // XXX
            if(synthesized.toString().search("UNREALIZABLE") !== -1){
                synthStatus.innerHTML = "Status: Unrealizable... please try again\t";
            }

            else {
                let script = document.createElement("script");
                script.text = synthesized;
                document.body.appendChild(script);

                // TODO: allow functions to be auto-implemented
                addScript("control.js");

                synthStatus.innerHTML = "Status: Synthesis Complete!\t"
            }

        })
        .catch(function(error) {
            console.log(error);
        });

}


document.getElementById("synthesize-btn").addEventListener(
    "click", _ => {
        synthStatus.innerHTML = "Status: Synthesizing...\t"
        const spec = getSpecFromDOM();
        if(!spec){
            synthStatus.innerHTML = "Status: No specification given\t";
            return;
        }
        synthesize(spec);
    }
);

function addScript(scriptName){
    let controlJS = document.createElement("script");
    controlJS.setAttribute("src", scriptName);
    document.body.appendChild(controlJS);
}

