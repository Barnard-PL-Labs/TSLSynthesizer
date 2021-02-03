class ComplexTSLHTML {
    static amfmUpdates = `
        <select>
            <option value=""></option>
            <option value="on">On</option>
            <option value="off">Off</option>
            <option value="inc10">Increase frequency by 10Hz</option>
            <option value="dec10">Decrease frequency by 10Hz</option>
        </select>
    `
    static lfoUpdates = `
        <select>
            <option value=""></option>
            <option value="on">On</option>
            <option value="off">Off</option>
            <option value="inc1">Increase frequency by 1Hz</option>
            <option value="dec1">Decrease frequency by 1Hz</option>
            <option value="depthInc10">Increase depth by 1</option>
            <option value="depthDec10">Decrease depth by 1</option>
        </select>
    `
    static arpUpdates = `
        <select>
            <option value=""></option>
            <option value="on">on</option>
            <option value="off">off</option>
            <option value="up">up</option>
            <option value="upDown">up-down</option>
            <option value="down">down</option>
            <option value="random">random</option>
        </select>
    `

    static arpPredicates = this.arpUpdates;

    static predicateSelectMap = {
        always: dummyOptions,
        am: onOffPredicates,
        fm: onOffPredicates,
        lfo: onOffPredicates,
        filter: onOffPredicates,
        harmon: onOffPredicates,
        arp: this.arpPredicates,
        waveform: waveformPredicates,
        playing: playingPredicates
    }
    static nextUpdateSelectorMap = {
        am: this.amfmUpdates,
        fm: this.amfmUpdates,
        lfo: this.lfoUpdates,
        filter: onOffPredicates,
        harmon: onOffPredicates,
        arp: this.arpUpdates,
        waveform: waveformUpdates
    }
}


function createSingleComplexSpec(idx){
    const spec = document.createElement("article");
    spec.setAttribute("id", "spec-" + idx.toString());
    spec.appendChild(getSpanNode("When "));

    const whileNode = createOptionSpan(),
        whileSelectNode = strToDOM(whileSelector);
    whileSelectNode.addEventListener("change", e => {
        changeYoungerSibling(e.target, ComplexTSLHTML.predicateSelectMap)
    }, false);
    whileNode.appendChild(whileSelectNode);
    whileNode.appendChild(strToDOM(dummyOptions));

    const predNode = createOptionSpan(),
        predSelectNode = strToDOM(predicateSelector);
    predNode.appendChild(predSelectNode);
    predNode.appendChild(strToDOM(dummyOptions));
    // FIXME: unreadable mess
    predSelectNode.addEventListener("change", e => {
        const node     = e.target,
            termType = binOpCategories[node.value],
            grandparent = node.parentNode.parentNode;
        changeYoungerSibling(node, ComplexTSLHTML.predicateSelectMap);
        changeBinOp(node, termType);
        grandparent.lastChild.remove();
        grandparent.appendChild(getActionNode(termType));
    });

    const binOpNode = getSpanNode(" ... ");
    binOpNode.setAttribute("class", "binOp");

    function getActionNode(termType){
        const actionNode = createOptionSpan(),
            actionSelectNode = strToDOM(updateSelector);
        actionSelectNode.addEventListener("change", e => {
            let updateSelectorMap;
            if(termType === "predicate")
                updateSelectorMap = ComplexTSLHTML.nextUpdateSelectorMap;
            else if(termType === "update")
                updateSelectorMap = ComplexTSLHTML.predicateSelectMap;
            else if(termType === "reset"){
                updateSelectorMap = ComplexTSLHTML.predicateSelectMap;
            }
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
    spec.appendChild(binOpNode);
    spec.appendChild(tempActionNode);
    return spec;
}