// Module : Amfm
//
// JavaScript Interface for amfm.
//

/////////////////////////////////////////////////////////////////////////////

function control({ s_AMSynth
                     , s_C4
                     , s_False
                     , s_Sawtooth
                     , s_Sine
                     , s_True
                     , s_Wave
                     , s_amFreq
                 }){

    // Terms
    let b8 = p_Change(s_amFreq);
    let b9 = p_Press(s_C4);

    let innerCircuit = controlCircuit(b9, b8);
    // Output Cells
    let c_AMSynth = s_AMSynth;
    let c_Wave = s_Wave;

    // Switches
    let o_AMSynth = AMSynthSwitch([s_True, innerCircuit[3]], [s_False, innerCircuit[4]], [c_AMSynth, innerCircuit[5]]);

    let o_Wave = WaveSwitch([c_Wave, innerCircuit[0]], [s_Sine, innerCircuit[1]], [s_Sawtooth, innerCircuit[2]]);


    return[o_AMSynth, o_Wave];
}

/////////////////////////////////////////////////////////////////////////////

function AMSynthSwitch
( p0
    , p1
    , p2
){
    const r1 = p1[1] ? p1[0] : p2[0];
    const r0 = p0[1] ? p0[0] : r1;
    return r0;
}

function WaveSwitch
( p0
    , p1
    , p2
){
    const r1 = p1[1] ? p1[0] : p2[0];
    const r0 = p0[1] ? p0[0] : r1;
    return r0;
}


var cin0;
var w3;


cin0 = false;

function controlCircuit
( cin0
    , cin1
){
    w3 = cin0;

// Gates

// Outputs
    const         o1 = !w3;
    const         o4 = !w3;

    return [false, o1, w3, w3, o4, false];

}

