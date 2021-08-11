function getSpecFromDOMDropdownWrittenMT(){
    let spec;
    populateUnselectedNotes();
    spec = document.getElementById("specText").value;
    console.log(`Got spec from DOM: \n${spec}`);

    return spec;
}


function createSpecificationWrittenMT(){
    currSpecStyle = specStyles.writtenMT;
    const textArea = document.createElement("textarea");
    textArea.setAttribute("id", "specText");
    textArea.setAttribute("cols", "70");
    textArea.setAttribute("rows", "15");
    textArea.value = `//#LIA#\n\nalways guarantee {
        G F [lfo <- True()];
        G F [lfo <- False()];
    
        lte lfoFreq c10() -> [lfo <- False()]  U gt lfoFreq c10();
        gt lfoFreq c10() -> [lfo <- True()] U lte lfoFreq c10();
        [lfo <- False()]   -> [lfoFreq <- add lfoFreq c1()];
        [lfo <- True()]  -> [lfoFreq <- sub lfoFreq c1()];\n}`;
    textArea.addEventListener("mouseover", _ => {
      mouseOnTextArea = true;
      console.log(mouseOnTextArea)
    })
    textArea.addEventListener("mouseout", _ => {
      mouseOnTextArea = false;
      console.log(mouseOnTextArea)
    })
    return textArea;
}