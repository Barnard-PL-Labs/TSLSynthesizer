/*
initially guarantee {
    [Wave <- Sine];
    [AMSynth <- False];
}

always guarantee {
	Change amFreq -> X [AMSynth <- True];
	Press C4 -> X [Wave <- Sawtooth];
}
 */
function p_Change(input){return input;}
function p_Press(input){return input;}


[amSynthesis, waveform] = control({
    s_C4 : false,
    s_False : false,
    s_Sawtooth: "sawtooth",
    s_Sine: "sine",
    s_True: true,
    s_Wave: waveform,
    s_amFreq: false
});

const c4 = document.getElementById("C4");
c4.addEventListener("click", _ =>{
    [amSynthesis, waveform] = control({
        s_C4 : true,
        s_False : false,
        s_Sawtooth: "sawtooth",
        s_Sine: "sine",
        s_True: true,
        s_Wave: waveform,
        s_amFreq: false
    });
});


amFreqRange.addEventListener("change", _ => {
    [amSynthesis, waveform] = control({
        s_C4 : false,
        s_False : false,
        s_Sawtooth: "sawtooth",
        s_Sine: "sine",
        s_True: true,
        s_Wave: waveform,
        s_amFreq: true
    });
})


