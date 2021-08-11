////////////////////////////////////////////////////
//      Populate the 'unselected' nodes           //
// USE FOR YOUR getSpecFromDOMDropdownYourInterface() //
////////////////////////////////////////////////////
const unselectedNotes = [];
function populateUnselectedNotes(){
    const allNotes = document.getElementsByClassName("keyboardNote");
    for(let i=0; i<allNotes.length; i++){
        if(selectedNotesList.includes(allNotes[i].getAttribute("id")))
            continue;
        unselectedNotes.push(allNotes[i]);
    }
}


////////////////////////////////////////////////////
//      parse the specificaiton Nodes             //
// USE FOR YOUR getSpecFromDOMDropdownYourInterface() //
////////////////////////////////////////////////////
function parseSpecNode(spec){
    let PREDICATE_IDX;
    if(currSpecStyle === specStyles.simple)
        PREDICATE_IDX = 0;
    else if(currSpecStyle === specStyles.complex)
        PREDICATE_IDX = 1;
    else
        throw new Error("Unknown specification style");
    const optionList =  onlySpecChildren(spec);

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


function buildFormulaFromParts(optionList, formulaList){
    if(currSpecStyle === specStyles.simple){
        let tslSpec = formulaList[0];
        // XXX: hack on hack since the first child on the predicate node is "playing"...
        if(binOpCategories[optionList[0].lastChild.value] === "always")
            tslSpec += " ";
        else if(binOpCategories[optionList[0].firstChild.value] === "update")
            tslSpec += " <-> ";
        else if(binOpCategories[optionList[0].firstChild.value] === "predicate")
            tslSpec += " <-> ";
        else
            throw new Error("A wild error has appeared.");
        tslSpec += formulaList[1];
        return tslSpec;
    }
    else if(currSpecStyle === specStyles.complex){
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
        if(binOpCategories[optionList[1].lastChild.value] === "always")
            tslSpec += " ";
        else if(binOpCategories[optionList[1].firstChild.value] === "update")
            tslSpec += " -> ";
        else if(binOpCategories[optionList[1].firstChild.value] === "predicate")
            tslSpec += " <-> ";
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
    else {
        throw new Error("Unknown specification style.");
    }
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
    if(currSpecStyle === specStyles.simple){
        if(predicateList.length <= 1)
            return "";

        const pairLists = makePairs(predicateList),
            notePlayedPairs = getOnlyNotePlays(pairLists),
            assumeList = notePlayedPairs.map(nandPairAssumeClause),
            noSimulPresses = "\t" + assumeList.join('\n\t');

        return "always assume{\n"  + noSimulPresses + "\n}\n";
    }
    else if(currSpecStyle === specStyles.complex){
        let alwaysAssume = "always assume{" + "\n";

        if(predicateList.length < 1)
            return alwaysAssume + "}";

        const tempPredicateList = [];
        for(let i=0; i<predicateList.length;i++){
            if(predicateList[i] !== "G")
                tempPredicateList.push(predicateList[i]);
        }
        predicateList = tempPredicateList;

        let noPredSimul = ""
        if(predicateList.length >= 2){
            noPredSimul = "\t!(" +
                predicateList.join(" && ") +
                ");\n";
        }
        alwaysAssume += noPredSimul;
        alwaysAssume += "\n}\n";

        return alwaysAssume;
    }
    else{
        throw new Error("Unknown spec style.");
    }

}


