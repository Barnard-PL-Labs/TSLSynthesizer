///////////////////
//  HTML FIELDS  //
///////////////////

NUM_SPECS = 4

const predicateOptions = `
<select class="predicateOption">
    <option value=""></option> 
    <option value="always">Always</option> 
    <option value="play">Played Note:</option>
    <option value="[waveform <- sine()]">waveform changes to sine</option>
    <option value="[waveform <- sawtooth()]">waveform changes to sawtooth</option>
    <option value="[waveform <- square()]">waveform changes to square</option>
    <option value="[waveform <- triangle()]">waveform changes to triangle</option>
    <option value="[amSynthesis <- True()]">AM turned on</option> 
    <option value="[amSynthesis <- False()]">AM turned off</option> 
    <option value="[fmSynthesis <- True()]">FM turned on</option> 
    <option value="[fmSynthesis <- False()]">FM turned off</option> 
    <option value="[lfo <- True()]">LFO turned on</option> 
    <option value="[lfo <- False()]">LFO turned off</option>
</select>
`

const actionOptions = `
<select class="actionSelect">
    <option value=""></option> 
    <option value="[waveform <- sine()]">waveform to sine</option>
    <option value="[waveform <- sawtooth()]">waveform to sawtooth</option>
    <option value="[waveform <- square()]">waveform to square</option>
    <option value="[waveform <- triangle()]">waveform to triangle</option>
    <option value="[amSynthesis <- True()]">turn AM on</option> 
    <option value="[amSynthesis <- False()]">turn AM off</option> 
    <option value="[fmSynthesis <- True()]">turn FM on</option> 
    <option value="[fmSynthesis <- False()]">turn FM off</option> 
    <option value="[lfo <- True()]">turn LFO on</option> 
    <option value="[lfo <- False()]">turn LFO off</option>
    <option value="[amFreq <- inc10 amFreq ]">inc amFreq by 10</option>
</select> 
`

const untilOptions = `
<select class="untilOption">
    <option value=""></option> 
    <option value="noCond">No Condition</option> 
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
    <option value="0">Note 1</option>
    <option value="1">Note 2</option>
    <option value="2">Note 3</option>
</select> 
`

const binOperatorOptions = `
<select class="binOp">
    <option value=""></option> 
    <option value="->">simultaneously</option>
    <option value="-> X">change</option>
</select> 
`

// XXX
const predicateBinOperatorOptions = `
<select class="binOp">
    <option value=""></option> 
    <option value="-> X">change</option>
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
        getSpanNode(" until "),
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
            returnNodes.push(strToDOM(predicateBinOperatorOptions));
            break;
        default:
            returnNodes.push(strToDOM(binOperatorOptions));
            break;
    }
    returnNodes.push(getWhitespaceSpanNode());
    returnNodes = returnNodes.concat(getActionClauseList());
    return returnNodes;
}


///////////////////////////////////////////
//  EVENT LISTENERS AND INITIALIZATIONS  //
///////////////////////////////////////////

const specRootNode = document.getElementById("specification");
const specNodeList = [];

function specificationHTMLInit(){
    for(let i=0; i<NUM_SPECS; i++){
        const singleSpec = document.createElement('article');
        singleSpec.setAttribute("id", "spec-" + i.toString());
        singleSpec.appendChild(getSpanNode("When  "));
        singleSpec.appendChild(strToDOM(predicateOptions));
        singleSpec.appendChild(getWhitespaceSpanNode());
        specRootNode.appendChild(singleSpec);
        specNodeList.push(singleSpec);
        specRootNode.appendChild(document.createElement("br"));
    }
}

const NUM_INITIAL_NODES = 2;

function createSiblingOptionsFromPredicate(predicateNode){
    const parent = predicateNode.parentNode;

    // Refresh options
    while(parent.children.length > NUM_INITIAL_NODES)
        parent.children[NUM_INITIAL_NODES].remove();

    if(predicateNode.value === "")
        return;

    parent.appendChild(getWhitespaceSpanNode());

    const nodesAfter = nodesAfterPredicate(predicateNode);
    for(let j=0; j<nodesAfter.length; j++)
        parent.appendChild(nodesAfter[j]);
}

function initAllPredEventListeners(){
    const predicates = document.getElementsByClassName("predicateOption");
    for(let i=0; i<predicates.length; i++){
        let currPred = predicates[i];
        currPred.addEventListener("change", _ => {
            createSiblingOptionsFromPredicate(currPred)
        })
    }
}

function addNoteSelectOptionChild(parentNode){
    parentNode.appendChild(getWhitespaceSpanNode());
    parentNode.appendChild(strToDOM(playNoteOptions));
}

function createUntilEventListener(event){
    const currUntil = event.target;
    const parent = currUntil.parentNode;
    const lastSibling = parent.children[parent.children.length-1];

    if(lastSibling.classList[0] === "playNoteOptions")
        lastSibling.remove();

    if(currUntil.value === "play")
        addNoteSelectOptionChild(parent);
}

function bootSpecs(){
    specificationHTMLInit();
    initAllPredEventListeners();
}
document.addEventListener("DOMContentLoaded", bootSpecs, false);

document.addEventListener("change", function(e){
    if(e.target.className === "untilOption")
        createUntilEventListener(e);
})

function showEffectStatus(effect, statusVar){
    const domNode = document.getElementById(effect + "Status");
    const status = statusVar ? "On" : "Off";
    domNode.innerText = `${effect.toUpperCase()}: ${status}`;
}

function updateVarsToUI(){
    waveformControl.value = waveform;
    lfoDepthControl.value = lfoDepth;
    lfoFreqControl.value = lfoFreq;
    amFreqControl.value = amFreq;
    fmFreqControl.value = fmFreq;
    showEffectStatus("am", amSynthesis);
    showEffectStatus("fm", fmSynthesis);
    showEffectStatus("lfo", lfo);
}

document.addEventListener("click", updateVarsToUI, false);


////////////////////////////
// SAVE LAST CLICKED NOTE //
////////////////////////////
const selectedNotes = document.getElementById("lastClicked");
const selectButtons = document.getElementsByClassName("selectedNoteBtn");
let selectedNotesLock = [];
let selectedNotesList = [];
for(let i=0; i<selectedNotes.length; i++){
    selectedNotesLock.push(false);
    selectedNotesList.push(null);
}

function saveLastClicked(e){
    const note = e.target.id;
    for(let i=0; i<selectedNotes.children.length; i++){
        if(selectedNotesLock[i])
            continue;

        selectedNotesList[i] = note;
        const noteNum = note.slice(4);
        selectedNotes.children[i].children[0].innerText = "" +
            "Note " + (i+1).toString() + ": MIDI note " + 
            noteNum + " (" + midiNoteToNoteName[noteNum] + ")";
    }
}

function resetIthSelectedNote(idx, buttonNode){
    const SPAN_LABEL_IDX = 0;
    buttonNode.parentNode.children[SPAN_LABEL_IDX].innerText = "" +
        "Note " + (idx+1).toString() + ": None (Play to Change)"
    selectedNotesLock[idx] = false;
}

function resetAllSelectedNotes(){
    for(let i=0; i<selectedNotesList.length; i++)
        resetIthSelectedNote(i, selectButtons[i]);
}

function lockAllSelectedNotes(){
    for(let i=0; i<selectedNotesLock.length; i++)
        selectedNotesLock[i] = true;
}

document.addEventListener("DOMContentLoaded", _ => {
    for(let i=0; i<selectButtons.length; i++){
        selectButtons[i].addEventListener("click", _ => {
            // Save --> Reset
            if(selectedNotesLock[i]){
                const selectedButton = selectButtons[i];
                resetIthSelectedNote(i, selectedButton);
            }
            else{ //  --> Save
                selectedNotesLock[i] = true;
            }
        })
    }
})

for(let i=0; i<allKeys.length; i++){
    const keyNote = allKeys[i];
    keyNote.addEventListener("click", e => saveLastClicked(e), false);
}

/////////////////////////////
//  SPECIFICATION HELPERS  //
/////////////////////////////

const clearSpecBtn = document.getElementById("clearSpec");
clearSpecBtn.addEventListener("click", rebootSpecs, false);
function rebootSpecs(){
    // Remove everything prior
    while(specRootNode.children.length > 0){
        specRootNode.children[specRootNode.children.length - 1].remove();
    }
    bootSpecs();
    resetAllSelectedNotes();
}

/////////////////////////////////////////////////
//  AUTOMATIC RANDOM SPECIFICATION GENERATION  //
/////////////////////////////////////////////////

const randomSpecBtn = document.getElementById("randomSpec");
randomSpecBtn.addEventListener("click", generateRandSpec, false);

// https://gist.github.com/kerimdzhanov/7529623
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function chooseRandOption(selectNode){
    if(selectNode.tagName !== "SELECT")
        throw new TypeError("Input should be a SELECT DOM Node");

    const numOptions = selectNode.children.length,
          randIdx = randInt(1,numOptions);
    return selectNode.children[randIdx].value;
}

function generateRandSpec(){
    const PREDICATE_IDX = 1;
    for(let i=0; i < specNodeList.length; i++){
        const specParentNode = specNodeList[i],
              predNode = specParentNode.children[PREDICATE_IDX];

        // Choose random predicate
        predNode.value = chooseRandOption(predNode);
        createSiblingOptionsFromPredicate(predNode);

        // Choose random values for other options
        for(let j=PREDICATE_IDX+1; j<specParentNode.children.length; j++){
            const optionNode = specParentNode.children[j];
            if(optionNode.tagName !== "SELECT")
                continue;
            optionNode.value = chooseRandOption(optionNode);
        }

        // Check last until clause
        if(specParentNode.children[specParentNode.children.length-1].value === "play"){
            addNoteSelectOptionChild(specParentNode);
            const noteSelectNode = specParentNode.children[specParentNode.children.length - 1];
            noteSelectNode.value = chooseRandOption(noteSelectNode);
        }
    }
}