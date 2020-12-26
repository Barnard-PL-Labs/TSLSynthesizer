// https://gist.github.com/aerrity/fd393e5511106420fba0c9602cc05d35
function synthesize(spec){

    // POST
    fetch('/spec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            spec: tslSpec
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
            let returnValue = data.result;
            console.log(returnValue);
            return returnValue;
        })
        .catch(function(error) {
            console.log(error);
        });

}

// TODO: dynamically add returned code to html