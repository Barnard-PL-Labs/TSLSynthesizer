///////////////////
//  HTML FIELDS  //
///////////////////

NUM_SPECS = 4

const predicateOptions = `
<select class="predicateOption">
    <option value=""></option> 
    <option value="always">Always</option> 
    <option value="play">Played Note:</option>
    <option value="[waveform <- sine()]">waveform is sine</option>
    <option value="[waveform <- sawtooth()]">waveform is sawtooth</option>
    <option value="[waveform <- square()]">waveform is square</option>
    <option value="[waveform <- triangle()]">waveform is triangle</option>
    <option value="[amSynthesis <- True()]">AM on</option> 
    <option value="[amSynthesis <- False()]">AM off</option> 
    <option value="[fmSynthesis <- True()]">FM on</option> 
    <option value="[fmSynthesis <- False()]">FM off</option> 
    <option value="[lfo <- True()]">LFO on</option> 
    <option value="[lfo <- False()]">LFO off</option>
</select>
`

const actionOptions = `
<select class="actionSelect">
    <option value=""></option> 
    <option value="[waveform <- sine()]">waveform to sine</option>
    <option value="[waveform <- sawtooth()]">waveform to sawtooth</option>
    <option value="[waveform <- square()]">waveform to square</option>
    <option value="[waveform <- triangle()]">waveform to triangle</option>
    <option value="[amSynthesis <- True()]">AM on</option> 
    <option value="[amSynthesis <- False()]">AM off</option> 
    <option value="[fmSynthesis <- True()]">FM on</option> 
    <option value="[fmSynthesis <- False()]">FM off</option> 
    <option value="[lfo <- True()]">LFO on</option> 
    <option value="[lfo <- False()]">LFO off</option>
</select> 
`

const untilOptions = `
<select class="untilOption">
    <option value=""></option> 
    <option value="">No Condition</option> 
    <option value="play">Played Note:</option>
    <option value="[waveform <- sine()]">waveform to sine</option>
    <option value="[waveform <- sawtooth()]">waveform to sawtooth</option>
    <option value="[waveform <- square()]">waveform to square</option>
    <option value="[waveform <- triangle()]">waveform to triangle</option>
    <option value="[amSynthesis <- True()]">AM on</option> 
    <option value="[amSynthesis <- False()]">AM off</option> 
    <option value="[fmSynthesis <- True()]">FM on</option> 
    <option value="[fmSynthesis <- False()]">FM off</option> 
    <option value="[lfo <- True()]">LFO on</option> 
    <option value="[lfo <- False()]">LFO off</option>
</select>
`

const playNoteOptions = `
<select class="playNoteOptions">
    <option value=""></option> 
    <option value="play">Selected Note</option>
    <option value="playBelow">Above Selected Note</option>
    <option value="playAbove">Below Selected Note</option>
</select> 
`

// TODO:
// CHANGE NAMING
const binOperatorOptions = `
<select class="binOp">
    <option value=""></option> 
    <option value=" -> ">Implies</option>
    <option value=" <-> ">Equivalence</option>
    <option value=" -> X ">Next</option>
    <option value=" W ">Weak Until</option>
    <option value=" U ">Until</option>
</select> 
`

function strToDOM(html){
    const domNode = document.createElement("template");
    domNode.innerHTML = html.trim();
    return domNode.content.firstChild;
}

function getSpanNode(innerText){
    const spanNode = document.createElement("span");
    spanNode.innerText = innerText;
    return spanNode;
}

function getWhitespaceSpanNode(){
    return getSpanNode("    ");
}

function getActionClauseList(){
    return [
        getWhitespaceSpanNode(),
        strToDOM(actionOptions),
        getSpanNode(" W "),
        strToDOM(untilOptions)
    ];
}

////////////////////////////
//  DYNAMIC HTML LOADING  //
////////////////////////////

function nodesAfterPredicate(predicate){
    let returnNodes = [];
    switch(predicate.value){
        case "":
            return returnNodes;
        case "always":
            break;
        case "play":
            returnNodes.push(strToDOM(playNoteOptions));
            returnNodes.push(getWhitespaceSpanNode());
            break;
        default:
            break;
    }
    returnNodes.push(strToDOM(binOperatorOptions));
    returnNodes.push(getWhitespaceSpanNode());
    returnNodes = returnNodes.concat(getActionClauseList());
    return returnNodes;
}


///////////////////////////////////////////
//  EVENT LISTENERS AND INITIALIZATIONS  //
///////////////////////////////////////////


function specificationHTMLInit(){
    const root = document.getElementById("specification");
    for(let i=0; i<NUM_SPECS; i++){
        const singleSpec = document.createElement('article');
        singleSpec.setAttribute("id", "spec-" + i.toString());
        singleSpec.appendChild(getSpanNode("When  "));
        singleSpec.appendChild(strToDOM(predicateOptions));
        singleSpec.appendChild(getWhitespaceSpanNode());
        root.appendChild(singleSpec);
        root.appendChild(document.createElement("br"));
    }
}

const NUM_INITIAL = 2;

function predEventListenerInit(){
    const predicates = document.getElementsByClassName("predicateOption");
    for(let i=0; i<predicates.length; i++){
        let currPred = predicates[i];
        let parent = currPred.parentNode;
        currPred.addEventListener("change", function(){

            // Refresh options
            while(parent.children.length > NUM_INITIAL)
                parent.children[NUM_INITIAL].remove();

            if(currPred.value === "")
                return;

            parent.appendChild(getWhitespaceSpanNode());

            const nodesAfter = nodesAfterPredicate(currPred);
            for(let j=0; j<nodesAfter.length; j++)
                parent.appendChild(nodesAfter[j]);
        })
    }
}

function untilEventListener(event){
    const currUntil = event.target;
    const parent = currUntil.parentNode;
    const lastSibling = parent.children[parent.children.length-1];

    if(lastSibling.classList[0] === "playNoteOptions")
        lastSibling.remove();

    if(currUntil.value === "play"){
        parent.appendChild(getWhitespaceSpanNode());
        parent.appendChild(strToDOM(playNoteOptions));
    }
}

document.addEventListener("DOMContentLoaded", function() {
    specificationHTMLInit();
    predEventListenerInit();
}, false);

document.addEventListener("change", function(e){
    if(e.target.className === "untilOption")
        untilEventListener(e);
})

