// This module is intended to be used with the TSL Synthesis Synthesizer.
// Visit the project repository: https://github.com/Barnard-PL-Labs/TSLSynthesizer

function control({ s_lfo
, s_lfoFreq
}){

    // Cells
    let c_lfo = s_lfo;
    let c_lfoFreq = s_lfoFreq;

    // Terms
    let w2 = f_False();
    let w3 = f_True();
    let w4 = f_c1();
    let w5 = f_c10();
    let w6 = f_add(c_lfoFreq, w4);
    let w7 = f_sub(c_lfoFreq, w4);
    let b8 = p_gt(c_lfoFreq, w5);
    let b9 = p_lte(c_lfoFreq, w5);

    let innerCircuit = controlCircuit(b8, b9);

    // Switches
    let o_lfo = lfoSwitch([w2, innerCircuit[0]], [w3, innerCircuit[1]], [c_lfo, innerCircuit[2]]);

    let o_lfoFreq = lfoFreqSwitch([w7, innerCircuit[3]], [w6, innerCircuit[4]], [c_lfoFreq, innerCircuit[5]]);


    return [ o_lfo
           , o_lfoFreq];
}

/////////////////////////////////////////////////////////////////////////////

function lfoSwitch
    ( p0
    , p1
    , p2
    ){
    const r1 = p1[1] ? p1[0] : p2[0]; 
    const r0 = p0[1] ? p0[0] : r1;
    return r0;
}

function lfoFreqSwitch
    ( p0
    , p1
    , p2
    ){
    const r1 = p1[1] ? p1[0] : p2[0]; 
    const r0 = p0[1] ? p0[0] : r1;
    return r0;
}


var w27 = false;
var w3 = false;
var w28 = false;
var w4 = false;
var w32 = false;
var w5 = false;

var w6 = false;
var w7 = false;
var w8 = false;
var w9 = false;
var w10 = false;
var w11 = false;
var w12 = false;
var w13 = false;
var w14 = false;
var w15 = false;
var w16 = false;
var w17 = false;
var w18 = false;
var w19 = false;
var w20 = false;
var w21 = false;
var w22 = false;
var w23 = false;
var w24 = false;
var w25 = false;
var w26 = false;
var w27 = false;
var w28 = false;
var w29 = false;
var w30 = false;
var w31 = false;
var w32 = false;

w27 = false;
w28 = false;
w32 = false;

function controlCircuit
    ( cin0
    , cin1
    ){

    // Latches
    // Gates
    w6 = w5 && w4;
    w7 = !w6 && w3;
    w8 = !cin1 && cin0;
    w9 = w8 && !w7;
    w10 = !w5 && !w4;
    w11 = w4 && !w3;
    w12 = !w10 && w8;
    w13 = w12 && !w11;
    w14 = !w13 && !w9;
    w15 = !w10 && !w6;
    w16 = w15 && cin1;
    w17 = !w3 && !cin0;
    w18 = w17 && w16;
    w19 = w5 && cin1;
    w20 = !w19 && w3;
    w21 = w20 && !w16;
    w22 = !w15 && cin1;
    w23 = !w22 && !w3;
    w24 = !w21 && !cin0;
    w25 = w24 && !w23;
    w26 = !w25 && !w18;
    w27 = !w18 && !w9;
    w28 = !w25 && !w9;
    w29 = !w16 && !w3;
    w30 = !w20 && !cin0;
    w31 = w30 && !w29;
    w32 = !w31 && !w13;

    // Outputs
    const o1 = !w14;
    const o4 = !w26;

    return [ w14
           , o1
           , false
           , w26
           , o4
           , false];

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

// Reactive Updates
[lfo, lfoFreq] = control({
    s_lfo : lfo,
    s_lfoFreq : lfoFreq,
    s_keyboardNode : false});
updateVarsToUI();

for(let i=0; i<unselectedNotes.length;i++){
    unselectedNotes[i].addEventListener("click", _ => {
        [lfo, lfoFreq] = control({
            s_lfo : lfo,
            s_lfoFreq : lfoFreq,
            s_keyboardNode : true});
        updateVarsToUI();    
});};




amOffBtn.click();
fmOffBtn.click();
lfoOffBtn.click();


