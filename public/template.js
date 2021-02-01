const NUM_SPECS = 6;
const FROM_HTML = false;

const specificationHTML = "";
function createInterfaceFromJS(){
    return createSpecificationSimple();
    // return createSpecificationComplex();
    // return createSpecificationWritten();
}

function createSpecificationInterface() {
    if(FROM_HTML)
        return strToDOM(specificationHTML);
    else
        return createInterfaceFromJS();
}

function getSpecFromDOM(){
    return getSpecFromDOMDropdown();
}