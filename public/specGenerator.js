class UnselectedNoteError extends Error {}

function whereIsUntil(optionList){
    for(let i=0; i<optionList.length;i++){
        if(optionList[i].className === "untilOption")
            return i;
    }
    throw new ReferenceError("An until node does not exist in the specification.");
}

function onlySelectChildren(domNode){
    let selectNodeList = [];
    for(let i=0; i<domNode.children.length; i++){
        let selectNode = domNode.children[i];
        if(selectNode.tagName === "SELECT"){
            if(selectNode.value === "")
                return [];
            selectNodeList.push(domNode.children[i]);
        }
    }
    return selectNodeList;
}

function parseUntilOptions(untilOptionList){
    const UNTIL_OPTION_IDX = 0,
          NOTE_OPTION_IDX = 1;
    let untilSpec = "";

    switch(untilOptionList[UNTIL_OPTION_IDX].value){
        case "noCond":
            return "";
        case "play":
            untilSpec += " W play ";
            untilSpec += getSelectedNote(untilOptionList[NOTE_OPTION_IDX].value);
            break;
        default:
            untilSpec += " W "
            untilSpec += untilOptionList[UNTIL_OPTION_IDX].value;
    }
    return untilSpec;
}

function parseBinOpActionOptions(actionOptionList){
    let actionSpec = actionOptionList[0].value;
    actionSpec += " (";

    const untilIdx = whereIsUntil(actionOptionList);

    let actionClause = actionOptionList.slice(1, untilIdx);
    actionSpec += actionClause
        .map(x => x.value)
        .join(' ');

    actionSpec += parseUntilOptions(actionOptionList.slice(untilIdx));
    actionSpec += ');';
    return actionSpec;
}

function parseAlwaysActionOptions(actionOptionList){
    const untilIdx = whereIsUntil(actionOptionList);

    let actionClause = actionOptionList.slice(0, untilIdx);
    let actionSpec = actionClause
                    .map(x => x.value)
                    .join(' ');

    actionSpec += parseUntilOptions(actionOptionList.slice(untilIdx));
    actionSpec += ';';
    return actionSpec;
}

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

function parseSpecNode(spec){
    const MIN_SELECTS_PLAY = 5;
    const MIN_SELECTS_ALWAYS = 0;
    const MIN_SELECTS_DEFAULT = 0;
    const PREDICATE_IDX = 0;
    const NOTE_OPTION_IDX = 1;

    let BIN_OP_IDX;
    let tslSpec = "";
    let predicate = "";
    const optionList =  onlySelectChildren(spec);

    if(optionList.length === 0)
        return [predicate, tslSpec];

    switch(optionList[PREDICATE_IDX].value){
        case "play":
            console.assert(optionList.length >= MIN_SELECTS_PLAY);
            BIN_OP_IDX = 2;

            tslSpec += "play ";
            tslSpec += getSelectedNote(optionList[NOTE_OPTION_IDX].value);
            tslSpec += ' ';
            predicate = tslSpec;
            tslSpec += parseBinOpActionOptions(optionList.slice(BIN_OP_IDX))
            break;

        case "always":
            console.assert(optionList.length >= MIN_SELECTS_ALWAYS);
            BIN_OP_IDX = 1;

            tslSpec += parseAlwaysActionOptions(optionList.slice(BIN_OP_IDX));
            break;

        default:
            console.assert(optionList.length >= MIN_SELECTS_DEFAULT);
            BIN_OP_IDX = 1;

            tslSpec += optionList[PREDICATE_IDX].value;
            tslSpec += ' ';
            tslSpec += parseBinOpActionOptions(optionList.slice(BIN_OP_IDX))
    }

    return [predicate, tslSpec];
}

// FIXME
function makeAlwaysAssume(predicateList){
    let alwaysAssume = "";
    if(predicateList.length > 1){
        alwaysAssume = "always assume{\n!(" +
            predicateList.join(" && ") + ");\n}\n"
    }
    return alwaysAssume;
}

function getSpecFromDOM(){
    let tslSpecList = [];
    let specParent = document.getElementById("specification");
    let predicateList = [];

    for(let i=0; i < specParent.children.length; i++){
        const specNode = specParent.children[i];
        if(specNode.tagName !== "ARTICLE")
            continue;
        const [predicate, tslSpec] = parseSpecNode(specNode);

        if(!tslSpec)
            continue;

        tslSpecList.push(tslSpec);
        if(predicate)
            predicateList.push(predicate);
    }

    if(tslSpecList.length === 0){
        return "";
    }

    const alwaysAssume = makeAlwaysAssume(predicateList);
    const alwaysGuarantee = "always guarantee {\n" +
        "\t" + tslSpecList.join("\n\t") + "\n}\n";

    const spec = alwaysAssume + alwaysGuarantee;
    console.log(`Got spec from DOM: \n${spec}`);

    return spec;
}