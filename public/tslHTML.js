////////////////
//  RAW HTML  //
////////////////
const updateSelector = `
<select class="selector">
    <option value=""></option>
    <option value="am">AM</option>
    <option value="fm">FM</option>
    <option value="lfo">LFO</option>
    <option value="filter">filter</option>
    <option value="harmon">harmonizer</option>
    <option value="arp">arpeggiator</option>
    <option value="waveform">waveform</option>
</select>
`
const amfmUpdates = `
<select>
    <option value=""></option>
    <option value="toggle">toggles</option>
    <option value="inc10">increases frequency by 10Hz</option>
    <option value="dec10">decreases frequency by 10Hz</option>
</select>
`
const lfoUpdates = `
<select>
    <option value=""></option>
    <option value="toggle">toggles</option>
    <option value="inc1">increases frequency by 1Hz</option>
    <option value="dec1">decreases frequency by 1Hz</option>
    <option value="depthInc10">increases depth by 10</option>
    <option value="depthDec10">decreases depth by 10</option>
</select>
`
const filterUpdates = `
<select>
    <option value=""></option>
    <option value="toggle">toggle</option>
    <option value="inc1000">increase cutoff by 1000</option>
    <option value="dec1000">decrease rate by 1000</option>
    <option value="inc1">increase Q by 1</option>
    <option value="dec1">decrease Q by 1</option>
    <option value="lowpass">low-pass</option>
    <option value="highpass">high-pass</option>
    <option value="bandpass">band-pass</option>
</select>
`

const arpUpdates = `
<select>
    <option value=""></option>
    <option value="toggle">toggle</option>
    <option value="inc10">increase rate by 10</option>
    <option value="dec10">decrease rate by 10</option>
    <option value="up">up</option>
    <option value="upDown">up-down</option>
    <option value="down">down</option>
    <option value="random">random</option>
</select>
`

const harmonUpdates = `
<select>
    <option value=""></option>
    <option value="toggle">toggle</option>
    <option value="inc1">increase interval by 1</option>
    <option value="dec1">decrease interval by 1</option>
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
    <option value="filter">filter</option>
    <option value="harmon">harmonizer</option>
    <option value="arp">arpeggiator</option>
    <option value="waveform">waveform</option>
    <option value="playing">playing</option>
</select>
`
const toggleOption = `
<select>
    <option value=""></option>
    <option value="toggle">toggle</option>
</select>
`
const arpPredicates = arpUpdates;
const waveformPredicates = waveformUpdates;
const playingPredicates = `
<select>
    <option value=""></option>
    <option value="0">Note 1</option>
    <option value="1">Note 2</option>
    <option value="2">Note 3</option>
    <option value="3">Note 4</option>
</select>
`

const hackEmptyOption = `
<select hidden>
    <option value="playing"></option>
</select>
`

const predicateSelectMap = {
    always: dummyOptions,
    am: toggleOption,
    fm: toggleOption,
    lfo: toggleOption,
    filter: toggleOption,
    harmon: toggleOption,
    arp: arpPredicates,
    waveform: waveformPredicates,
    playing: playingPredicates
}

const binOpCategories = {
    "": "reset",
    am: "update",
    fm: "update",
    lfo: "update",
    filter: "update",
    harmon: "update",
    arp: "update",
    waveform: "update",
    playing: "predicate"
}

const binOpMap = {
    reset: " ... ",
    update: " always means ",
    predicate: " changes "
}

const nextUpdateSelectorMap = {
    am: amfmUpdates,
    fm: amfmUpdates,
    lfo: lfoUpdates,
    filter: filterUpdates,
    harmon: harmonUpdates,
    arp: arpUpdates,
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
                case "toggle":
                    return "[amSynthesis <- toggle amSynthesis]";
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
                case "toggle":
                    return "[fmSynthesis <- toggle fmSynthesis]";
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
                case "toggle":
                    return "[lfo <- toggle lfo]";
                case "inc1":
                    return "[lfoFreq <- inc1 lfoFreq]";
                case "dec1":
                    return "[lfoFreq <- dec1 lfoFreq]";
                case "depthInc10":
                    return "[lfoDepth <- inc1 lfoDepth]"
                case "depthDec10":
                    return "[lfoDepth <- dec1 lfoDepth]"
                default:
                    throw new Error("Out of switch cases");
            }
        case "filter":
            switch(action){
                case "":
                    return "";
                case "toggle":
                    return "[filterOn <- toggle filterOn]";
                case "inc1000":
                    return "[filterCutoff <- inc1000 filterCutoff]";
                case "dec1000":
                    return "[filterCutoff <- dec1000 filterCutoff]";
                case "inc1":
                    return "[filterQ <- inc1 filterQ]";
                case "dec1":
                    return "[filterQ <- dec1 filterQ]";
                case "lowpass":
                    return "[filterType <- lowpass()]";
                case "highpass":
                    return "[filterType <- highpass()]";
                case "bandpass":
                    return "[filterType <- bandpass()]";
                default:
                    throw new Error("Out of switch cases");
            }
        case "harmon":
            switch(action){
                case "":
                    return "";
                case "toggle":
                    return "[harmonizerOn <- toggle harmonizerOn]";
                case "inc1":
                    return "[harmonizerInterval <- inc1max12 harmonizerInterval]";
                case "dec1":
                    return "[harmonizerInterval <- dec1min12 harmonizerInterval]";
                default:
                    throw new Error("Out of switch cases");
            }
        case "arp":
            switch(action){
                case "":
                    return "";
                case "toggle":
                    return "[arpeggiatorOn <- toggle arpeggiatorOn]";
                case "inc10":
                    return "[arpeggiatorRate <- inc10 arpeggiatorRate]";
                case "dec10":
                    return "[arpeggiatorRate <- dec10 arpeggiatorRate]";
                case "up":
                    return "[arpeggiatorStyle <- upStyle()]";
                case "down":
                    return "[arpeggiatorStyle <- downStyle()]";
                case "upDown":
                    return "[arpeggiatorStyle <- upDownStyle()]";
                case "random":
                    return "[arpeggiatorStyle <- randomStyle()]";
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
