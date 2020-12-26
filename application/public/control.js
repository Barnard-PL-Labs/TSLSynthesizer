/*
TSL SPEC
initially guarantee {
    [Wave <- Square];
}

always guarantee {
    Press C4 -> X [Wave <- Sawtooth];
}
*/

// Synthesized based on the commit below.
// https://github.com/wonhyukchoi/tsltools/commit/c4406a9db33e22a0b6f0d08b75b5d96e66da77e3

function control(s_C4, s_Sawtooth, s_Square, s_Wave){

    let b4 = p_Press(s_C4);
    let innerCircuit = controlCircuit(b4);
    let c_Wave = s_Wave;
    let o_Wave = WaveSwitch([c_Wave, innerCircuit[0]],
                            [s_Square, innerCircuit[1]],
                            [s_Sawtooth, innerCircuit[2]]);
    return(o_Wave)
}

function WaveSwitch(p0, p1, p2){
    const r1 = p1[1] ? p1[0] : p2[0];
    return p0[1] ? p0[0] : r1;
}

var w2;

function controlCircuit(cin0){
    w2 = cin0;
    const o1 = !w2;
    return [false, o1, w2];
}

// IMPLEMENTED FUNCTIONS BEGIN
function p_Press(noteBool){
    return noteBool;
}

const c4 = document.getElementById("C4");

// Initialize all
waveform = control(false, "sawtooth", "square", waveform);

c4.addEventListener("click", function(){
    waveform = control(true, "sawtooth", "square", waveform);
});

// IMPLEMENTED FUNCTIONS END
