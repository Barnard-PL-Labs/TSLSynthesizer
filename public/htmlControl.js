NUM_SPECS = 6

////////////////////////////
//  DYNAMIC HTML LOADING  //
////////////////////////////

const specRootNode = document.getElementById("specification");
let specNodeList = [];

function changeYoungerSibling(node, optionMap){
    if(!node.value)
        return;
    const parentNode = node.parentNode,
          oldSibling = node.nextSibling,
          newSibling = strToDOM(optionMap[node.value]);
    if(oldSibling){
        parentNode.insertBefore(newSibling, oldSibling);
        oldSibling.remove();
    }
    else{
        parentNode.appendChild(newSibling);
    }
}

function changeBinOp(node, termType){
    const grandparent = node.parentNode.parentNode,
          binOpNode = grandparent.getElementsByClassName("binOp")[0];
    binOpNode.innerText = binOpMap[termType];
}

function removeSiblingsAfterIth(node, idx){
    const parentNode = node.parentNode;
    while(parentNode.children.length > idx)
        parentNode.lastChild.remove();
}

function createOptionSpan(){
    const spanNode = document.createElement("span");
    spanNode.setAttribute("class", "specOption");
    return spanNode;
}

function createSingleSpec(idx){
    const spec = document.createElement("article");
    spec.setAttribute("id", "spec-" + idx.toString());

    const predNode = createOptionSpan();
    predNode.appendChild(strToDOM(hackEmptyOption));
    predNode.appendChild(strToDOM(playingPredicates));

    const binOpNode = getSpanNode(" ... ");

    function getActionNode(termType){
        const actionNode = createOptionSpan(),
              actionSelectNode = strToDOM(updateSelector);
        actionSelectNode.addEventListener("change", e => {
            let updateSelectorMap;
            if(termType === "predicate")
                updateSelectorMap = nextUpdateSelectorMap;
            else if(termType === "update")
                updateSelectorMap = predicateSelectMap;
            else if(termType === "reset")
                updateSelectorMap = predicateSelectMap;
            else
                throw new Error("Enumerable Type Exhausted.");
            changeYoungerSibling(e.target, updateSelectorMap);
        }, false);
        actionNode.appendChild(actionSelectNode);
        actionNode.appendChild(strToDOM(dummyOptions));
        return actionNode;
    }
    let tempActionNode = getActionNode("predicate");

    spec.appendChild(getSpanNode("Playing "));
    spec.appendChild(predNode);
    spec.appendChild(binOpNode);
    spec.appendChild(tempActionNode);
    return spec;
}

// Frontend change stuff
class specStyles {
    static simple  = "simple";
    static complex = "complex";
    static written = "written";
    static toNextSpecStyle(){
        if(currSpecStyle === specStyles.simple){
            currSpecStyle = specStyles.complex;
            toggleReactiveInputVisibility();
        }
        else if(currSpecStyle === specStyles.complex){
            currSpecStyle = specStyles.written;
            toggleReactiveInputVisibility();
        }
        else if(currSpecStyle === specStyles.written){
            currSpecStyle = specStyles.simple;
        }
    }
}
let currSpecStyle = specStyles.simple;
const swapFrontendBtn = document.getElementById("frontendSwap");
function toggleReactiveInputVisibility(){
    const buttons = document.getElementsByClassName("btn");
    const musicOptions = document.getElementsByClassName("musicOption");
    function toggleVisibility(node){
        if(node.style.visibility === "hidden")
            node.style.visibility = ""
        else
            node.style.visibility = "hidden"
    }
    for(let i=0; i<buttons.length;i++)
        toggleVisibility(buttons[i])
    for(let i=0; i<musicOptions.length;i++)
        toggleVisibility(musicOptions[i])
}

swapFrontendBtn.addEventListener("click", _ => {
    specStyles.toNextSpecStyle();
    rebootSpecs();
}, false);

function bootSpecs(){
    if(currSpecStyle === specStyles.simple){
        for(let i=0; i<NUM_SPECS; i++){
            const singleSpec = createSingleSpec(i);
            specRootNode.appendChild(singleSpec);
            specNodeList.push(singleSpec);
            specRootNode.appendChild(document.createElement("br"));
        }
    }
    else if(currSpecStyle === specStyles.complex){
        for(let i=0; i<NUM_SPECS; i++){
            const singleSpec = createSingleComplexSpec(i);
            specRootNode.appendChild(singleSpec);
            specNodeList.push(singleSpec);
            specRootNode.appendChild(document.createElement("br"));
        }
    }
    else if(currSpecStyle === specStyles.written){
        const textArea = document.createElement("textarea");
        textArea.setAttribute("id", "specText");
        textArea.setAttribute("cols", "70");
        textArea.setAttribute("rows", "15");
        textArea.value = `always guarantee{
     	play note67 <-> [fmSynthesis <- toggle fmSynthesis];
     	play note64 <-> [lfo <- toggle lfo];\n}`;
        specRootNode.appendChild(textArea);
    }
    else {
        throw new Error("A wild error has occured");
    }
}

function rebootSpecs(){
    // Remove everything prior
    while(specRootNode.children.length > 0){
        specRootNode.children[specRootNode.children.length - 1].remove();
    }
    specNodeList = [];
    bootSpecs();
    resetAllSelectedNotes();
}

document.addEventListener("DOMContentLoaded", bootSpecs, false);


//////////////////
//  UI UPDATES  //
//////////////////

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
    filterQControl.value = filterQ;
    filterTypeControl.value = filterType;
    filterCutoffControl.value = filterCutoff;
    harmonizerIntervalControl.value = harmonizerInterval;
    arpeggiatorStyleControl.value = arpeggiatorStyle;
    arpeggiatorRateControl.value = arpeggiatorRate;
    showEffectStatus("am", amSynthesis);
    showEffectStatus("fm", fmSynthesis);
    showEffectStatus("lfo", lfo);
    showEffectStatus("filter", filterOn);
    showEffectStatus("harmonizer", harmonizerOn);
    showEffectStatus("arpeggiator", arpeggiatorOn);
}

document.addEventListener("click", updateVarsToUI, false);


/////////////////////////////
//  SPECIFICATION HELPERS  //
/////////////////////////////

const clearSpecBtn = document.getElementById("clearSpec");
clearSpecBtn.addEventListener("click", rebootSpecs, false);

// RANDOM SPEC
const randomSpecBtn = document.getElementById("randomSpec");
randomSpecBtn.addEventListener("click", generateRandSpec, false);

function onlySpecChildren(domNode){
    let selectNodeList = [];
    for(let i=0; i<domNode.children.length; i++){
        let selectNode = domNode.children[i];
        if(selectNode.className === "specOption"){
            if(selectNode.value === "")
                return [];
            selectNodeList.push(domNode.children[i]);
        }
    }
    return selectNodeList;
}

// https://gist.github.com/kerimdzhanov/7529623
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function chooseRandOption(selectNode){
    const numOptions = selectNode.children.length,
        randIdx = randInt(1,numOptions);

    if(numOptions === 1)
        return selectNode.children[0].value;
    else
        return selectNode.children[randIdx].value;
}

function generateRandSpec(){
    rebootSpecs();
    for(let i=0; i < specNodeList.length; i++) {
        const selectNodeList = onlySpecChildren(specNodeList[i]);
        for(let j=0; j < selectNodeList.length; j++){
            const specNode = onlySpecChildren(specNodeList[i])[j];
            specNode.firstChild.value = chooseRandOption(specNode.firstChild);
            const evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            specNode.firstChild.dispatchEvent(evt);
            specNode.lastChild.value = chooseRandOption(specNode.lastChild);
        }
    }
}

////////////////////////////
// SAVE LAST CLICKED NOTE //
////////////////////////////
const selectedNotes = document.getElementById("lastClicked");
const selectButtons = document.getElementsByClassName("selectedNoteBtn");
let selectedNotesLock = [];
let selectedNotesList = [];
for(let i=0; i<selectedNotes.children.length; i++){
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
        "Note " + (idx+1).toString() + ": None (Play to change)"
    selectedNotesLock[idx] = false;
    selectedNotesList[idx] = null;
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
