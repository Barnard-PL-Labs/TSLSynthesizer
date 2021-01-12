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
    <option value="1">Note 1</option>
    <option value="2">Note 2</option>
    <option value="3">Note 3</option>
    <option value="velocityLow">with velocity < 50</option>
    <option value="velocityHigh">with velocity > 50</option>
</select>
`

const predicateSelectMap = {
    always: strToDOM(dummyOptions),
    am: strToDOM(freqPredicates),
    fm: strToDOM(freqPredicates),
    lfo: strToDOM(freqPredicates),
    waveform: strToDOM(waveformPredicates),
    playing: strToDOM(playingPredicates)
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
    am: strToDOM(freqPredicates),
    fm: strToDOM(freqPredicates),
    lfo: strToDOM(freqPredicates),
    waveform: strToDOM(waveformUpdates)
}

const nextUpdateSelectorMap = {
    am: strToDOM(amfmUpdates),
    fm: strToDOM(amfmUpdates),
    lfo: strToDOM(lfoUpdates),
    waveform: strToDOM(waveformUpdates)
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

