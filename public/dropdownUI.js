
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

////////////////////
////NODE HELPERS////
////////////////////


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



///////////////////////////
////swap interfaces btn////
///////////////////////////

const swapFrontendBtn = document.getElementById("frontendSwap");
swapFrontendBtn.addEventListener("click", _ => {
    specStyles.toNextSpecStyle();
    console.log('switch interface button exectued');
    rebootSpecs();
}, false);



///////////////////////
////RANDOM SPEC BTN////
///////////////////////
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
	for(let i=0; i <selectedNotes.children.length; i++){
		let rand_int = Math.floor(Math.random() * 34) + 45;
		let note = `note${rand_int}`;
		selectedNotesList[i] = note;
		selectedNotes.children[i].children[0].innerText = "" +
			"Note " + (i+1).toString() + ": MIDI note " +
			rand_int + " (" + midiNoteToNoteName[rand_int] + ")";
	}
}



////////////////////////
///UHH...LEGACY CODE////
////////////////////////
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