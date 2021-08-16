const yourInterfaceHTML  = `
<select>
    <option value=" "></option>
</select>
`

// Option 1) Create a function that returns a HTML node
// with your specification interface HTML node inside
// Option 2) Write your interface in HTML,
// and use the helper function strToDOM to return a HTML node object
function createSpecificationInterface() {
     return createSpecificationSimple();
    //return createSpecificationComplex();
    // return createSpecificationWritten();
	// return strToDOM(yourInterfaceHTML);
}

function getSpecFromDOM(){
     return getSpecFromDOMSimple();
    //return getSpecFromDOMComplex();
    // return getSpecFromDOMWritten();
    // return yourInterfaceToLogicFunction();
}
