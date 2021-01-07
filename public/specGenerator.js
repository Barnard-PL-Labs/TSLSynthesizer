const initiallyGuarantee= `
initially guarantee {
    [amSynthesis <- False()];
    [fmSynthesis <- False()];
    [waveform <- sine()];
    [lfo <- False()];
}
`

class UnselectedNoteError extends Error {}

// XXX
function whereisUntil(optionList){
    for(let i=0; i<optionList.length;i++){
        if(optionList[i].className === "untilOption")
            return i;
    }
    throw "err";
}

function parseUntilOptions(untilOptionList){
    let untilSpec = "";
    switch(untilOptionList[0].value){
        case "noCond":
            return "";
        // Magic numbers...
        case "play":
            untilSpec += " W "
            untilSpec += untilOptionList[1].value;
            if(!selectedNotesList[1])
                throw new UnselectedNoteError;
            untilSpec += ' ' + selectedNotesList[1];
            break;
        default:
            untilSpec += " W "
            untilSpec += untilOptionList[0].value;
    }
    return untilSpec;
}

function parseBinOpActionOptions(actionOptionList){
    let actionSpec = actionOptionList[0].value;
    actionSpec += " (";

    const untilIdx = whereisUntil(actionOptionList);

    let actionClause = actionOptionList.slice(1, untilIdx);
    actionSpec += actionClause
        .map(x => x.value)
        .join(' ');

    actionSpec += parseUntilOptions(actionOptionList.slice(untilIdx));
    actionSpec += ');';
    return actionSpec;
}

function parseAlwaysActionOptions(actionOptionList){
    const untilIdx = whereisUntil(actionOptionList);

    let actionClause = actionOptionList.slice(0, untilIdx);
    let actionSpec = actionClause
                    .map(x => x.value)
                    .join(' ');

    actionSpec += parseUntilOptions(actionOptionList.slice(untilIdx));
    actionSpec += ';';
    return actionSpec;
}

function returnOnlySelectChildren(domNode){
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

function parseSpecNode(spec){
    const MIN_SELECTS_PLAY = 5;
    const MIN_SELECTS_ALWAYS = 0;
    const MIN_SELECTS_DEFAULT = 0;

    let tslSpec = "";
    let predicate = "";
    const optionList = returnOnlySelectChildren(spec);

    if(optionList.length === 0)
        return [predicate, tslSpec];

    switch(optionList[0].value){
        case "play":
            console.assert(optionList.length >= MIN_SELECTS_PLAY);
            tslSpec += optionList[1].value;
            if(!selectedNotesList[0])
                throw new UnselectedNoteError;
            tslSpec += ' ' + selectedNotesList[0] + ' ';
            predicate = tslSpec;
            tslSpec += parseBinOpActionOptions(optionList.slice(2))
            break;
        case "always":
            console.assert(optionList.length >= MIN_SELECTS_ALWAYS);
            break;
        default:
            console.assert(optionList.length >= MIN_SELECTS_DEFAULT);
            tslSpec += optionList[0].value;
            tslSpec += ' ';
            tslSpec += parseBinOpActionOptions(optionList.slice(1))
    }

    return [predicate, tslSpec];
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

    // FIXME: fix always assume clause
    let alwaysAssume = "";
    if(predicateList.length > 1){
        alwaysAssume = "always assume{\n!(" +
            predicateList.join(" && ") + ");\n}\n"
    }

    const alwaysGuarantee = "always guarantee {\n" +
        tslSpecList.join("\t\n") + "\n}\n";

    const spec = initiallyGuarantee + alwaysAssume + alwaysGuarantee;
    console.log(`Got spec from DOM: ${spec}`);
    return spec;
}