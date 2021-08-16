function getSpecFromDOMDropdownWritten(){
    let spec;
    populateUnselectedNotes();
    spec = document.getElementById("specText").value;
    console.log(`Got spec from DOM: \n${spec}`);

    return spec;
}

function createSpecificationWritten(){
    currSpecStyle = specStyles.written;
    const textArea = document.createElement("textarea");
    textArea.setAttribute("id", "specText");
    textArea.setAttribute("cols", "70");
    textArea.setAttribute("rows", "15");
    textArea.value = `always guarantee{
     	play note67 <-> [fmSynthesis <- toggle fmSynthesis];
     	play note64 <-> [lfo <- toggle lfo];\n}`;
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
