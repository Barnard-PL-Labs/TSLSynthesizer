///////////////////
//  UPDATE TERMS //
///////////////////
function freqUpdateTerms(varName){
    const freqTerm = varName + "Freq";
    return {
        "on": `[${varName} <- True()]`,
        "off": `[${varName} <- False()]`,
        "inc10": `[${freqTerm} <- inc10 ${freqTerm}]`,
        "dec10": `[${freqTerm} <- dec10 ${freqTerm}]`
    }
}

const waveformUpdateMap = {
    "sine": "[waveform <- sine()]",
    "sawtooth": "[waveform <- sawtooth()]",
    "square": "[waveform <- square()]",
    "triangle": "[waveform <- triangle()]"
};

const updateMap = {
    am: freqUpdateTerms("amSynthesis"),
    fm: freqUpdateTerms("fmSynthesis"),
    lfo: function(){
        const lfoUpdates = freqUpdateTerms("lfo");
        const lfoDepth = {
            "inc10Depth": `[lfoDepth <- inc10 lfoDepth]`,
            "dec10Depth": `[lfoDepth <- dec10 lfoDepth]`
        };
        return {...lfoUpdates, ...lfoDepth};
    }(),
    waveform: waveformUpdateMap
};

///////////////////////
//  PREDICATE TERMS  //
//////////////////////
function freqPredicateTerms(varName, minFreq, maxFreq){
    const midFreq = Math.floor((minFreq + maxFreq)/2),
        freqPreds = {};
    freqPreds[`${varName} > ${midFreq}`] = `isAbove ${midFreq} ${varName}`;
    freqPreds[`${varName} < ${midFreq}`] = `isBelow ${midFreq} ${varName}`;
    return freqPreds;
}

function playNotePredicates(){
    return {
        "Note 1": selectedNotesList[0].toString(),
        "Note 2": selectedNotesList[1].toString(),
        "Note 3": selectedNotesList[2].toString()
    }
}

function concatDict(dict1, dict2){
    return {...dict1, ...dict2};
}

function concatDict3(dict1, dict2, dict3){
    return {...dict1, ...dict2, ...dict3};
}

const predicateMap = {
    am: concatDict(updateMap["am"], freqPredicateTerms("amFreq", 0, 1000)),
    fm: concatDict(updateMap["fm"], freqPredicateTerms("fmFreq", 0, 1000)),
    lfo: concatDict3(updateMap["lfo"],
        freqPredicateTerms("lfoFreq", 0, 100),
        freqPredicateTerms("lfoDepth", 0, 20)),
    waveform: updateMap["waveform"]
}

////////////////
//  RAW HTML  //
////////////////
const updateSelector = `
<select class="selector">
    <option value=""></option>
    <option value="am">AM</option>
    <option value="fm">FM</option>
    <option value="lfo">LFO</option>
    <option value="waveform">waveform</option>
</select>
`
const amfmUpdates = `
<select>
    <option value=""></option>
    <option value="on">On</option>
    <option value="off">Off</option>
    <option value="inc10">Increase frequency by 10Hz</option>
    <option value="dec10">Decrease frequency by 10Hz</option>
</select>
`
const lfoUpdates = `
<select>
    <option value=""></option>
    <option value="on">On</option>
    <option value="off">Off</option>
    <option value="inc10">Increase frequency by 10Hz</option>
    <option value="dec10">Decrease frequency by 10Hz</option>
    <option value="depthInc10">Increase depth by 1</option>
    <option value="depthDec10">Decrease depth by 1</option>
</select>
`
const waveformUpdates = `
<select>
    <option value=""></option>
    <option value="sine">sine</option>
    <option value="sawtooth">sawtooth</option>
    <option value="square">square</option>
    <option value="triangle">triangle</option>
</select>
`
const whileSelector = `
<select class="selector">
    <option value=""></option>
    <option value="always">Always</option>
    <option value="am">AM</option>
    <option value="fm">FM</option>
    <option value="lfo">LFO</option>
    <option value="waveform">waveform</option>
</select>
`
const dummyOptions = `
<select>
    <option value=" "></option>
</select>
`
const predicateSelector = `
<select class="selector">
    <option value=""></option>
    <option value="am">AM</option>
    <option value="fm">FM</option>
    <option value="lfo">LFO</option>
    <option value="waveform">waveform</option>
    <option value="playing">playing</option>
</select>
`
const freqPredicates = `
<select>
    <option value=""></option>
    <option value="on">On</option>
    <option value="off">Off</option>
</select>
`
const waveformPredicates = waveformUpdates;
const playingPredicates = `
<select>
    <option value=""></option>
    <option value="0">Note 1</option>
    <option value="1">Note 2</option>
    <option value="2">Note 3</option>
    <option value="veloLow">with velocity < 50</option>
    <option value="veloHigh">with velocity > 50</option>
</select>
`

const predicateSelectMap = {
    always: dummyOptions,
    am: freqPredicates,
    fm: freqPredicates,
    lfo: freqPredicates,
    waveform: waveformPredicates,
    playing: playingPredicates
}

const binOpCategories = {
    am: "update",
    fm: "update",
    lfo: "update",
    waveform: "update",
    playing: "predicate"
}

const binOpMap = {
    update: " always means ",
    predicate: " changes "
}

const impliesUpdateSelectorMap = {
    am: freqPredicates,
    fm: freqPredicates,
    lfo: freqPredicates,
    waveform: waveformUpdates
}

const nextUpdateSelectorMap = {
    am: amfmUpdates,
    fm: amfmUpdates,
    lfo: lfoUpdates,
    waveform: waveformUpdates
}

// XXX: Abomination
function formulaMap(termType, action){
    switch(termType){
        case "":
            return "";
        case "always":
            return "";
        case "am":
            switch(action){
                case "":
                    return "";
                case "on":
                    return "[amSynthesis <- True()]";
                case "off":
                    return "[amSynthesis <- False()]";
                case "inc10":
                    return "[amFreq <- inc10 amFreq]";
                case "dec10":
                    return "[amFreq <- dec10 amFreq]";
                default:
                    throw new Error("Out of switch cases");
            }
        case "fm":
            switch(action){
                case "":
                    return "";
                case "on":
                    return "[fmSynthesis <- True()]";
                case "off":
                    return "[fmSynthesis <- False()]";
                case "inc10":
                    return "[fmFreq <- inc10 fmFreq]";
                case "dec10":
                    return "[fmFreq <- dec10 fmFreq]";
                default:
                    throw new Error("Out of switch cases");
            }
        case "lfo":
            switch(action){
                case "":
                    return "";
                case "on":
                    return "[lfo <- True()]";
                case "off":
                    return "[lfo <- False()]";
                case "inc10":
                    return "[lfoFreq <- inc10 lfoFreq]";
                case "dec10":
                    return "[lfoFreq <- dec10 lfoFreq]";
                case "depthInc10":
                    return "[lfoDepth <- inc1 lfoFreq]"
                case "depthDec10":
                    return "[lfoDepth <- dec1 lfoFreq]"
                default:
                    throw new Error("Out of switch cases");
            }
        case "waveform":
            switch(action){
                case "":
                    return "";
                case "sine":
                    return "[waveform <- sine()]"
                case "sawtooth":
                    return "[waveform <- sawtooth()]"
                case "square":
                    return "[waveform <- square()]"
                case "triangle":
                    return "[waveform <- triangle()]"
                default:
                    throw new Error("Out of switch cases");
            }
        case "playing":
            switch(action){
                case "":
                    return "";
                case "veloLow":
                    return "veloBelow50 noteVelocity";
                case "veloHigh":
                    return "veloAbove50 noteVelocity";
                default:
                    const selectedNote = getSelectedNote(action);
                    return `play ${selectedNote}`;
            }
        default:
            throw new Error("Out of switch cases");
    }
}

// XXX: Abomination #2
function weakUntilMap(specOptionNode){
    const termType = specOptionNode.firstChild.value,
          action   = specOptionNode.lastChild.value;
    switch(termType){
        case "":
            return "";
        case "am":
            switch(action){
                case "on":
                    return "[amSynthesis <- False()]"
                case "off":
                    return "[amSynthesis <- True()]"
                default:
                    throw new Error("Out of switch cases");
            }
        case "fm":
            switch(action){
                case "on":
                    return "[fmSynthesis <- False()]"
                case "off":
                    return "[fmSynthesis <- True()]"
                default:
                    throw new Error("Out of switch cases");
            }
        case "lfo":
            switch(action){
                case "on":
                    return "[lfo <- False()]"
                case "off":
                    return "[lfo <- True()]"
                default:
                    throw new Error("Out of switch cases");
            }
        case "waveform":
            const sine = "[waveform <- sine()]",
                  sawtooth = "[waveform <- sawtooth()]",
                  square = "[waveform <- square()]",
                  triangle = "[waveform <- triangle()]";
            function orAll(arg1, arg2, arg3){
                return "(" + [arg1, arg2, arg3].join(" || ") + ")";
            }
            switch(action){
                case "sine":
                    return orAll(sawtooth, square, triangle);
                case "sawtooth":
                    return orAll(sine, square, triangle);
                case "square":
                    return orAll(sine, sawtooth, triangle);
                case "triangle":
                    return orAll(sine, sawtooth, square);
                default:
                    throw new Error("Out of switch cases");
            }
        default:
            throw new Error("Out of switch cases");
    }
}

////////////////////////
//  HELPER FUNCTIONS  //
////////////////////////

function getSpanNode(innerText){
    const spanNode = document.createElement("span");
    spanNode.innerText = innerText;
    return spanNode;
}

function strToDOM(html){
    const domNode = document.createElement("template");
    domNode.innerHTML = html.trim();
    return domNode.content.firstChild;
}

