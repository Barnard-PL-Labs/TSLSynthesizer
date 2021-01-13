class UnselectedNoteError extends Error {}

function getSelectedNote(noteOption){
    const selectedNoteNum = parseInt(noteOption);
    if(Number.isNaN(selectedNoteNum))
        throw new TypeError("Invalid note number");

    const selectedNote = selectedNotesList[selectedNoteNum];
    if(!selectedNote)
        throw new UnselectedNoteError;
    else
        return selectedNote;
}

// XXX: huge hardcoded hack
function buildFormulaFromParts(optionList, formulaList){
    let tslSpec = "",
        weakUntilClause = null;
    if(optionList[0].firstChild.value !== "always"){
        tslSpec += formulaList[0];
        tslSpec += " -> ";
        weakUntilClause = weakUntilMap(optionList[0]);
    }
    tslSpec += "(";
    tslSpec += "(";
    tslSpec += formulaList[1];
    if(binOpCategories[optionList[1].firstChild.value] === "update")
        tslSpec += " -> ";
    else if(binOpCategories[optionList[1].firstChild.value] === "predicate")
        tslSpec += " -> X ";
    else
        throw new Error("A wild error has appeared.");

    tslSpec += formulaList[2];
    tslSpec += ")";

    if(weakUntilClause){
        tslSpec += " W ";
        tslSpec += weakUntilClause;
    }

    tslSpec += ")";
    return tslSpec;
}

function parseSpecNode(spec){
    const PREDICATE_IDX = 1,
          optionList =  onlySpecChildren(spec);

    if(optionList.length === 0)
        return ["", ""];

    // XXX: Hardcoded

    let formulaList = []
    for(let i=0; i<optionList.length; i++){
        const node     = optionList[i],
              termType = node.firstChild.value,
              action   = node.lastChild.value;
        if(!termType || !action)
            return ["", ""];
        formulaList.push(formulaMap(termType, action));
    }
    let tslSpec = buildFormulaFromParts(optionList, formulaList);
    tslSpec += ";";

    let predicate = "";
    if(optionList[PREDICATE_IDX].firstChild.value === "playing"){
        predicate = formulaList[PREDICATE_IDX];
    }
    else {
        predicate = "";
    }

    return [predicate, tslSpec];
}

const termVars = `
amBtnPresses  = press amOnBtn || press amOffBtn;
fmBtnPresses  = press fmOnBtn || press fmOffBtn;
lfoBtnPresses = press lfoOnBtn || press lfoOffBtn;
anyBtnPresses = amBtnPresses || fmBtnPresses || lfoBtnPresses || change waveformControl;
`
const btnAssumes = `
	!(press amOnBtn && press amOffBtn);
	!(press fmOnBtn && press fmOffBtn);
	!(press lfoOnBtn && press lfoOffBtn);
`
const btnGuarantees = `
    press amOnBtn   -> X [amSynthesis <- True()];
    press amOffBtn  -> X [amSynthesis <- False()];
    press fmOnBtn   -> X [fmSynthesis <- True()];
    press fmOffBtn  -> X [fmSynthesis <- False()];
    press lfoOnBtn  -> X [lfo <- True()];
    press lfoOffBtn -> X [lfo <- False()];
	change waveformControl -> X [waveform <- getWavefomVal()];
`

// TODO
function makeAlwaysAssume(predicateList){
    let alwaysAssume = "always assume{" + btnAssumes + "\n";

    if(predicateList.length < 1)
        return alwaysAssume + "}";

    let noPredSimul = ""
    if(predicateList.length >= 2){
        noPredSimul = "\t!(" +
            predicateList.join(" && ") +
            ");\n";
    }
    const noBtnSimul = "\t" + predicateList.map(x =>
        "!(" + x + " && anyBtnPresses);"
    ).join("\n\t");

    alwaysAssume += noPredSimul;
    alwaysAssume += noBtnSimul;
    alwaysAssume += "\n}\n";

    return alwaysAssume;
}

function getSpecFromDOM(){
    let tslSpecList = [];
    let specParent = document.getElementById("specification");
    let predicateSet = new Set();

    for(let i=0; i < specParent.children.length; i++){
        const specNode = specParent.children[i];
        if(specNode.tagName !== "ARTICLE")
            continue;
        const [predicate, tslSpec] = parseSpecNode(specNode);

        if(!tslSpec)
            continue;

        tslSpecList.push(tslSpec);
        if(predicate)
            predicateSet.add(predicate);
    }

    if(tslSpecList.length === 0){
        return "";
    }

    const predicateList = [...predicateSet];
    const alwaysAssume = makeAlwaysAssume(predicateList);
    const alwaysGuarantee = "always guarantee {\n" +
        "\t" + tslSpecList.join("\n\t") + btnGuarantees + "\n}\n";

    const spec = termVars + alwaysAssume + alwaysGuarantee;
    console.log(`Got spec from DOM: \n${spec}`);

    return spec;
}