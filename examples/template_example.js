const yourInterfaceHTML  = `
<textarea id="specText" cols="70" rows="15"></textarea>
`

function createSpecificationInterface() {
    return strToDOM(yourInterfaceHTML);
}

function getSpecFromDOM(){
    return document.getElementById("specText").value;
}
