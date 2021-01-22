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

function buildFormulaFromParts(optionList, formulaList){
    let tslSpec = formulaList[0];
    if(binOpCategories[optionList[0].firstChild.value] === "update")
        tslSpec += " -> ";
    else if(binOpCategories[optionList[0].firstChild.value] === "predicate")
        tslSpec += " -> ";
    else
        throw new Error("A wild error has appeared.");
    tslSpec += formulaList[1];
    return tslSpec;
}

function parseSpecNode(spec){
    const PREDICATE_IDX = 0,
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

function makePairs(arr){
    let pairList = [];
    for(let i=0; i<arr.length; i++){
        for(let j=0; j<i; j++){
            pairList.push([arr[i], arr[j]]);
        }
    }
    return pairList;
}

function getOnlyNotePlays(predicatePairs){
    let returnList = [];
    function containsPlay(str){
        return str.search("play") !== -1;
    }
    for(let i=0; i<predicatePairs.length; i++){
        const fst = predicatePairs[i][0],
              snd = predicatePairs[i][1];
        if(containsPlay(fst) && containsPlay(snd))
            returnList.push(predicatePairs[i]);
    }
    return returnList;
}

function nandPairAssumeClause(pair){
    const fst = pair[0], snd = pair[1];
    return `!(${fst} && ${snd});`;
}

function makeAlwaysAssume(predicateList){
    if(predicateList.length <= 1)
        return "";

    const velocityAssume = "\t!(veloBelow50 noteVelocity && veloAbove50 noteVelocity);\n"

    const pairLists = makePairs(predicateList),
          notePlayedPairs = getOnlyNotePlays(pairLists),
          assumeList = notePlayedPairs.map(nandPairAssumeClause),
          noSimulPresses = "\t" + assumeList.join('\n\t');

    return "always assume{\n" + velocityAssume + noSimulPresses + "\n}\n";
}

function getSpecFromDOM(){
    let spec;
    if(isDropdown){
        let tslSpecList = [];
        let predicateSet = new Set();

        for(let i=0; i < specRootNode.children.length; i++){
            const specNode = specRootNode.children[i];
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
            "\t" + tslSpecList.join("\n\t") + "\n}\n";

        spec = alwaysAssume + alwaysGuarantee;
    }
    else {
        spec = document.getElementById("specText").value;
    }
    console.log(`Got spec from DOM: \n${spec}`);

    return spec;
}