// This module is intended to be used with the TSL Synthesis Synthesizer.
// Visit the project repository: https://github.com/Barnard-PL-Labs/TSLSynthesizer

function control({s_amFreq}){

    // Cells
    let c_amFreq = s_amFreq;

    // Terms
    let w1 = f_inc10(c_amFreq);

    let innerCircuit = controlCircuit();

    // Switches
    let o_amFreq = amFreqSwitch([w1, innerCircuit[0]], [c_amFreq, innerCircuit[1]]);


    return [o_amFreq];
}

/////////////////////////////////////////////////////////////////////////////

function amFreqSwitch
    ( p0
    , p1
    ){
    const r0 = p0[1] ? p0[0] : p1[0]; 
    return r0;
}





function controlCircuit
    (){

    // Latches
    // Gates

    // Outputs

    return [ true
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
[amFreq] = control({
    s_amFreq : amFreq,
    s_keyboardNode : false});
updateVarsToUI();

for(let i=0; i<unselectedNotes.length;i++){
    unselectedNotes[i].addEventListener("click", _ => {
        [amFreq] = control({
            s_amFreq : amFreq,
            s_keyboardNode : true});
        updateVarsToUI();    
});};




amOffBtn.click();
fmOffBtn.click();
lfoOffBtn.click();


