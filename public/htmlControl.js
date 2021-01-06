///////////////////////////////////////
//  INITIALIZE SPECIFICATION FIELD   //
///////////////////////////////////////

NUM_SPECS = 4

function specHtmlInit(){
    const root = document.getElementById("specification");
    for(let i=0; i<NUM_SPECS; i++){
        const singleSpec = document.createElement('article');
        singleSpec.setAttribute("id", "spec-" + i.toString());
        singleSpec.appendChild(createPredicateHTML());
        singleSpec.appendChild(document.createTextNode("\t"));
        root.appendChild(singleSpec);
    }
}

function createPredicateHTML(){
    const predicate = document.createElement("select");
    predicate.setAttribute("class", "predicate");
    predicate.appendChild(document.createElement("option"));

    const when = document.createElement("option");
    when.setAttribute("value", "when");
    when.innerText = "When..."
    predicate.appendChild(when);

    const always = document.createElement("option");
    always.setAttribute("value", "always");
    always.innerText = "Always"
    predicate.appendChild(always);

    return predicate;
}

function predEventListenerInit(){
    const predicates = document.getElementsByClassName("predicate");
    for(let i=0; i<predicates.length; i++){
        let currPred = predicates[i];
        let parent = currPred.parentNode;
        currPred.addEventListener("change", function(){

            // Refresh options
            while(parent.children.length > 1)
                parent.children[1].remove();

            if(currPred.value === "")
                return;
            else if(currPred.value === "when") {
                parent.appendChild(createPlayOptions());
            }

            parent.appendChild(document.createTextNode('\t'));

            // Add action
            let action = document.createElement("template");
            action.setAttribute("id", "foo");
            action.innerHTML = actionHTML.trim();
            parent.appendChild(action.content);

            parent.appendChild(document.createTextNode('\t'));
            parent.appendChild(createUntilOptions());
        })
    }
}

function createPlayOptions(){
    const playNote = document.createElement("select");
    playNote.setAttribute("class", "playNote");
    playNote.appendChild(document.createElement("option"));

    const exact = document.createElement("option");
    exact.setAttribute("value", "exact");
    exact.innerText = "Played selected note";
    playNote.append(exact);

    const below = document.createElement("option");
    below.setAttribute("value", "below");
    below.innerText = "Played below selected note";
    playNote.append(below);

    const above = document.createElement("option");
    above.setAttribute("value", "above");
    above.innerText = "Played above selected note";
    playNote.append(above);

    return playNote;
}

const actionHTML = `
<select class="action">
    <option value=""></option> 
    <option value="sine">waveform to sine</option>
    <option value="sawtooth">waveform to sawtooth</option>
    <option value="square">waveform to square</option>
    <option value="triangle">waveform to triangle</option>
    <option value="amOn">AM on</option> 
    <option value="amOff">AM off</option> 
    <option value="fmOn">FM on</option> 
    <option value="fmOff">FM off</option> 
    <option value="lfoOn">LFO on</option> 
    <option value="lfoOff">LFO off</option>
</select> 
until
`

function createUntilOptions(){
    const playNote = document.createElement("select");
    playNote.setAttribute("class", "until");
    playNote.appendChild(document.createElement("option"));

    const noCondition = document.createElement("option");
    noCondition.setAttribute("value", "");
    noCondition.innerText = "No condition";
    playNote.append(noCondition);

    const exact = document.createElement("option");
    exact.setAttribute("value", "exact");
    exact.innerText = "Played selected note";
    playNote.append(exact);

    const below = document.createElement("option");
    below.setAttribute("value", "below");
    below.innerText = "Played below selected note";
    playNote.append(below);

    const above = document.createElement("option");
    above.setAttribute("value", "above");
    above.innerText = "Played above selected note";
    playNote.append(above);

    return playNote;
}

document.addEventListener("DOMContentLoaded", function() {
    specHtmlInit();
    predEventListenerInit();
}, false);
