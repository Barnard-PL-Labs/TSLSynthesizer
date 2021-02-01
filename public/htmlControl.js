////////////////////////////
//  DYNAMIC HTML LOADING  //
////////////////////////////

const specRootParent = document.getElementById("specification");
let specRootNode;
let specNodeList = [];


function bootSpecs(){
    specRootNode = createSpecificationInterface();
    specRootParent.appendChild(specRootNode);
}

function rebootSpecs(){
    // Remove everything prior
    while(specRootParent.children.length > 0){
        specRootParent.children[specRootParent.children.length - 1].remove();
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
