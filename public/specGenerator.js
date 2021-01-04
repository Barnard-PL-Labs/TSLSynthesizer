const initially= `
initially guarantee {
    [amSynthesis <- False()];
    [fmSynthesis <- False()];
    [waveform <- sine()];
    [lfo <- False()];
}
`


// TODO
// The spec to DOM function is currently under heavy development.
// It will change according to changes in the interface.
// Currently hardcoded for prototype & demonstration purposes.
function getSpecFromDOM(){
    let tslSpec = "";
    let specifications = document.getElementById("specification");

    let predicateList = [];

    for(let i=0; i < specifications.children.length; i++){
        const spec = specifications.children[i];

        // Predicate
        console.assert(spec.querySelectorAll(".predicate").length === 1);
        let predicate = spec.querySelector(".predicate").value;
        let predicateTSL;
        if(predicate === "note")
            predicateTSL = `press ${lastClicked}`;
        else if(predicate === "amFreq")
            predicateTSL = "change amFreq";
        else if(predicate === "toSine")
            predicateTSL = "change waveformControl && [waveform <- sine()]";
        // else
        //     throw "Predicate error";

        // Action
        console.assert(spec.querySelectorAll(".action").length === 1);
        let action = spec.querySelector(".action").value;
        let actionTSL;
        if(action.search("waveform") !== -1){
            if(action.search("square") !== -1)
                actionTSL = "[waveform <- square()]";
            else if(action.search("sine") !== -1)
                actionTSL = "[waveform <- sine()]";
            else if(action.search("triangle") !== -1)
                actionTSL = "[waveform <- triangle()]";
            else if(action.search("sawtooth") !== -1)
                actionTSL = "[waveform <- sawtooth()]";
            // else
            //     throw "Waveform Error";
        }
        else if(action.search("LFO") !== -1){
            if(action.search("On") !== -1)
                actionTSL = "[lfo <- True()]";
            else if(action.search("Off") !== -1)
                actionTSL = "[lfo <- False()]";
            // else
            //     throw "LFO error";
        }
        else if(action.search("AM") !== -1)
            actionTSL = "[amSynthesis <- True()]";
        else if(action.search("FM") !== -1)
            actionTSL = "[fmSynthesis <- True()]";
        // else
        //     throw "Action error";

        // If spec is incomplete, abort
        if(!predicate || !action)
            continue;
        // Otherwise add the predicate to ALWAYS ASSUME clause
        else
            predicateList.push(predicateTSL);

        // Create spec
        tslSpec += `\t${predicateTSL} -> X ${actionTSL};\n`;
    }

    // If no specs have been initialized
    if(!tslSpec){
        console.log("No specs initialized.");
        return "";
    }

    tslSpec = "always guarantee {\n" + tslSpec + "}";

    // Add ALWAYS ASSUME clause
    if(predicateList.length > 1){
        let assumeClause = "always assume {\n\t";
        for(let i=0; i<predicateList.length; i++){
            const predicate = predicateList[i];
            assumeClause += "!(" + predicate +") || ";
        }
        assumeClause = assumeClause.slice(0, -4) + ";\n}\n";
        tslSpec = assumeClause + tslSpec;
    }

    tslSpec = initially + tslSpec;
    console.log(`Got spec from DOM:\n${tslSpec}`);
    return tslSpec;
}
