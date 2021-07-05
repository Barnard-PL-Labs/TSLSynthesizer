// This module is intended to be used with the TSL Synthesis Synthesizer.
// Visit the project repository: https://github.com/Barnard-PL-Labs/TSLSynthesizer

function control({ s_amFreq
, s_arpeggiatorOn
, s_arpeggiatorStyle
, s_harmonizerOn
, s_lfoFreq
, s_note55
, s_note61
, s_waveform
}){

    // Cells
    let c_amFreq = s_amFreq;
    let c_arpeggiatorOn = s_arpeggiatorOn;
    let c_arpeggiatorStyle = s_arpeggiatorStyle;
    let c_harmonizerOn = s_harmonizerOn;
    let c_lfoFreq = s_lfoFreq;
    let c_waveform = s_waveform;

    // Terms
    let w8 = f_downStyle();
    let w9 = f_triangle();
    let w10 = f_inc1(c_lfoFreq);
    let w11 = f_inc10(c_amFreq);
    let w12 = f_toggle(c_arpeggiatorOn);
    let w13 = f_toggle(c_harmonizerOn);
    let b14 = p_play(s_note55);
    let b15 = p_play(s_note61);

    let innerCircuit = controlCircuit(b15, b14);

    // Switches
    let o_amFreq = amFreqSwitch([w11, innerCircuit[0]], [c_amFreq, innerCircuit[1]]);

    let o_arpeggiatorOn = arpeggiatorOnSwitch([w12, innerCircuit[6]], [c_arpeggiatorOn, innerCircuit[7]]);

    let o_arpeggiatorStyle = arpeggiatorStyleSwitch([w8, innerCircuit[8]], [c_arpeggiatorStyle, innerCircuit[9]]);

    let o_harmonizerOn = harmonizerOnSwitch([w13, innerCircuit[10]], [c_harmonizerOn, innerCircuit[11]]);

    let o_lfoFreq = lfoFreqSwitch([w10, innerCircuit[4]], [c_lfoFreq, innerCircuit[5]]);

    let o_waveform = waveformSwitch([w9, innerCircuit[2]], [c_waveform, innerCircuit[3]]);


    return [ o_amFreq
           , o_arpeggiatorOn
           , o_arpeggiatorStyle
           , o_harmonizerOn
           , o_lfoFreq
           , o_waveform];
}

/////////////////////////////////////////////////////////////////////////////

function amFreqSwitch
    ( p0
    , p1
    ){
    const r0 = p0[1] ? p0[0] : p1[0]; 
    return r0;
}

function arpeggiatorOnSwitch
    ( p0
    , p1
    ){
    const r0 = p0[1] ? p0[0] : p1[0]; 
    return r0;
}

function arpeggiatorStyleSwitch
    ( p0
    , p1
    ){
    const r0 = p0[1] ? p0[0] : p1[0]; 
    return r0;
}

function harmonizerOnSwitch
    ( p0
    , p1
    ){
    const r0 = p0[1] ? p0[0] : p1[0]; 
    return r0;
}

function lfoFreqSwitch
    ( p0
    , p1
    ){
    const r0 = p0[1] ? p0[0] : p1[0]; 
    return r0;
}

function waveformSwitch
    ( p0
    , p1
    ){
    const r0 = p0[1] ? p0[0] : p1[0]; 
    return r0;
}


var w6 = false;
var w3 = false;

var w4 = false;
var w5 = false;
var w6 = false;

w6 = false;

function controlCircuit
    ( cin0
    , cin1
    ){

    // Latches
    // Gates
    w4 = !w3 && !cin1;
    w5 = !w3 && !cin0;
    w6 = !w5 && !w4;

    // Outputs
    const o0 = !w4;
    const o2 = !w5;
    const o4 = !w5;
    const o6 = !w4;
    const o10 = !w5;

    return [ o0
           , w4
           , o2
           , w5
           , o4
           , w5
           , o6
           , w4
           , true
           , false
           , o10
           , w5];

 }

/////////////////////////////////////////////////////////////////////////////

// Implemented Functions
function p_play(input){return input;}
function p_press(input){return input;}
function p_change(input){return input;}
function p_veloBelow50(velocity){return velocity<=50}
function p_veloAbove50(velocity){return velocity>50}
function f_True(){return true;}
function f_False(){return false;}
function f_sawtooth(){return "sawtooth";}
function f_sine(){return "sine";}
function f_square(){return "square";}
function f_triangle(){return "triangle";}
function f_upStyle(){return "up";}
function f_downStyle(){return "down";}
function f_upDownStyle(){return "up-down";}
function f_randomStyle(){return "random";}
function f_lowpass(){return "lowpass";}
function f_highpass(){return "highpass";}
function f_bandpass(){return "bandpass";}
function f_toggle(input){return !input};
function f_inc1000(arg){return arg+1000;}
function f_dec1000(arg){return Math.max(arg-1000,0);}
function f_inc100(arg){return Math.min(arg+100,10000);}
function f_dec100(arg){return Math.max(arg-100,20);}
function f_inc10(arg){return arg+10;}
function f_dec10(arg){return Math.max(arg-10,0);}
function f_inc1(arg){return arg+1;}
function f_dec1(arg){return Math.max(arg-1,0);}
function f_inc1max12(arg){return Math.min(arg+1,12);}
function f_dec1min12(arg){return Math.max(arg-1,-12);}
function f_getWaveformVal(node){return waveformControl.value}
function f_getArpType(node){return arpeggiatorStyleControl.value}


// Notes
var note55 = document.getElementById("note55");
var note61 = document.getElementById("note61");

// Reactive Updates
[amFreq, arpeggiatorOn, arpeggiatorStyle, harmonizerOn, lfoFreq, waveform] = control({
    s_amFreq : amFreq,
    s_arpeggiatorOn : arpeggiatorOn,
    s_arpeggiatorStyle : arpeggiatorStyle,
    s_harmonizerOn : harmonizerOn,
    s_lfoFreq : lfoFreq,
    s_note55 : false,
    s_note61 : false,
    s_waveform : waveform,
    s_keyboardNode : false});
updateVarsToUI();

note55.addEventListener("click", _ => {
    [amFreq, arpeggiatorOn, arpeggiatorStyle, harmonizerOn, lfoFreq, waveform] = control({
        s_amFreq : amFreq,
        s_arpeggiatorOn : arpeggiatorOn,
        s_arpeggiatorStyle : arpeggiatorStyle,
        s_harmonizerOn : harmonizerOn,
        s_lfoFreq : lfoFreq,
        s_note55 : true,
        s_note61 : false,
        s_waveform : waveform,
        s_keyboardNode : false});
    updateVarsToUI();
});

note61.addEventListener("click", _ => {
    [amFreq, arpeggiatorOn, arpeggiatorStyle, harmonizerOn, lfoFreq, waveform] = control({
        s_amFreq : amFreq,
        s_arpeggiatorOn : arpeggiatorOn,
        s_arpeggiatorStyle : arpeggiatorStyle,
        s_harmonizerOn : harmonizerOn,
        s_lfoFreq : lfoFreq,
        s_note55 : false,
        s_note61 : true,
        s_waveform : waveform,
        s_keyboardNode : false});
    updateVarsToUI();
});

for(let i=0; i<unselectedNotes.length;i++){
    unselectedNotes[i].addEventListener("click", _ => {
        [amFreq, arpeggiatorOn, arpeggiatorStyle, harmonizerOn, lfoFreq, waveform] = control({
            s_amFreq : amFreq,
            s_arpeggiatorOn : arpeggiatorOn,
            s_arpeggiatorStyle : arpeggiatorStyle,
            s_harmonizerOn : harmonizerOn,
            s_lfoFreq : lfoFreq,
            s_note55 : false,
            s_note61 : false,
            s_waveform : waveform,
            s_keyboardNode : true});
        updateVarsToUI();    
});};


var triggerNotes = new Set(["s_note55", "s_note61"]);
function reactiveUpdateOnMIDI(note, velocity){
    const noteSignal = 's_note' + note;
    const noteVelocity = velocity;
    const inputTemplate = {
        s_amFreq : amFreq,
        s_arpeggiatorOn : arpeggiatorOn,
        s_arpeggiatorStyle : arpeggiatorStyle,
        s_harmonizerOn : harmonizerOn,
        s_lfoFreq : lfoFreq,
        s_note55 : false,
        s_note61 : false,
        s_waveform : waveform,
        s_keyboardNode : false,
    };
    inputTemplate[noteSignal] = true;
    if(triggerNotes.has(noteSignal)){
        [amFreq, arpeggiatorOn, arpeggiatorStyle, harmonizerOn, lfoFreq, waveform] = control(inputTemplate);
        updateVarsToUI();
    }
}

amOffBtn.click();
fmOffBtn.click();
lfoOffBtn.click();


