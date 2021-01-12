NUM_SPECS = 4

////////////////////////////
//  DYNAMIC HTML LOADING  //
////////////////////////////

const specRootNode = document.getElementById("specification");
const specNodeList = [];

function changeYoungerSibling(node, optionMap){
    const parentNode = node.parentNode,
          oldSibling = node.nextSibling,
          newSibling = optionMap[node.value];
    parentNode.insertBefore(newSibling, oldSibling);
    oldSibling.remove();
}

function changeBinOp(node, termType){
    const binOpNode = node.parentNode.getElementsByClassName("binOp")[0];
    binOpNode.innerText = binOpMap[termType];
}

function removeSiblingsAfterIth(node, idx){
    const parentNode = node.parentNode;
    while(parentNode.children.length > idx)
        parentNode.lastChild.remove();
}

function createSingleSpec(idx){
    const spec = document.createElement("div");
    spec.setAttribute("id", "spec-" + idx.toString());
    spec.appendChild(getSpanNode("When "));

    const whileNode = document.createElement("span"),
          whileSelectNode = strToDOM(whileSelector);
    whileSelectNode.addEventListener("change", e => {
        changeYoungerSibling(e.target, predicateSelectMap)
    }, false);
    whileNode.appendChild(whileSelectNode);
    whileNode.appendChild(strToDOM(dummyOptions));

    const predNode = document.createElement("span"),
          predSelectNode = strToDOM(predicateSelector),
          binOpNode = getSpanNode(" ... ");
    predNode.appendChild(predSelectNode);
    predNode.appendChild(strToDOM(dummyOptions));
    binOpNode.setAttribute("class", "binOp");
    predNode.appendChild(binOpNode);
    // FIXME: unreadable mess
    predSelectNode.addEventListener("change", e => {
        const node     = e.target,
              termType = binOpCategories[node.value],
              grandparent = node.parentNode.parentNode;
        changeYoungerSibling(node, predicateSelectMap);
        changeBinOp(node, termType);
        grandparent.lastChild.remove();
        grandparent.appendChild(getActionNode(termType));
    });

    function getActionNode(termType){
        const actionNode = document.createElement("span"),
            actionSelectNode = strToDOM(updateSelector);
        actionSelectNode.addEventListener("change", e => {
            let updateSelectorMap;
            if(termType === "predicate")
                updateSelectorMap = nextUpdateSelectorMap;
            else if(termType === "update")
                updateSelectorMap = impliesUpdateSelectorMap;
            else
                throw new Error("Enumerable Type Exhausted.");
            changeYoungerSibling(e.target, updateSelectorMap);
        }, false);
        actionNode.appendChild(actionSelectNode);
        actionNode.appendChild(strToDOM(dummyOptions));
        return actionNode;
    }
    const tempActionNode = getActionNode("predicate");

    spec.appendChild(whileNode);
    spec.appendChild(getSpanNode(" , "));
    spec.appendChild(predNode);
    spec.appendChild(tempActionNode);
    return spec;
}

function specFieldsInit(){
    for(let i=0; i<NUM_SPECS; i++){
        const singleSpec = createSingleSpec(i);
        specRootNode.appendChild(singleSpec);
        specNodeList.push(singleSpec);
        specRootNode.appendChild(document.createElement("br"));
    }
}

function bootSpecs(){
    specFieldsInit();
}

function rebootSpecs(){
    // Remove everything prior
    while(specRootNode.children.length > 0){
        specRootNode.children[specRootNode.children.length - 1].remove();
    }
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
    showEffectStatus("am", amSynthesis);
    showEffectStatus("fm", fmSynthesis);
    showEffectStatus("lfo", lfo);
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

// https://gist.github.com/kerimdzhanov/7529623
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function chooseRandOption(selectNode){
}

function generateRandSpec(){
    rebootSpecs();
    for(let i=0; i < specNodeList.length; i++) {
    }
}

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

