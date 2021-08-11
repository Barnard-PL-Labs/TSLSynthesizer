function createSpecificationSimple(){
    let specificationDiv = document.createElement("div");
    for(let i=0; i<NUM_SPECS; i++){
        const singleSpec = createSingleSpec(i);
        specificationDiv.appendChild(singleSpec);
        specNodeList.push(singleSpec);
        specificationDiv.appendChild(document.createElement("br"));
    }
    return specificationDiv;
}

function getSpecFromDOMDropdownSimple(){
    let spec;
    populateUnselectedNotes();
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
    console.log(`Got spec from DOM: \n${spec}`);

    return spec;
}

