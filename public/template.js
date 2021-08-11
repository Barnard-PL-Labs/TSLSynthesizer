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
    switch(currSpecStyle){
        case specStyles.simple:
            return createSpecificationSimple();
            break;
        case specStyles.complex:
            return createSpecificationComplex();
            break;
        case specStyles.written:
            return createSpecificationWritten();
            break;
        case specStyles.writtenMT:
            return createSpecificationWrittenMT();
            break;
        // case specStyles.YourInterface:
        //     return createSpecificationYourInterface();
        //     break; 
        default: 
            console.log('template.js error, no currSpecStyle, default:simple');
            return getSpecFromDOMDropdownSimple(); 
    }
}

function getSpecFromDOM(){
    switch(currSpecStyle){
        case specStyles.simple:
            return getSpecFromDOMDropdownSimple();
            break;
        case specStyles.complex:
            return getSpecFromDOMDropdownComplex();
            break;
        case specStyles.written:
            return getSpecFromDOMDropdownWritten();
            break;
        case specStyles.writtenMT:
            return getSpecFromDOMDropdownWrittenMT();
            break;
        // case specStyles.YourInterface:
        //     return getSpecFromDOMDropdownYourInterface();
        //     break; 
        default: 
            console.log('template.js error, no currSpecStyle, default:simple');
            return getSpecFromDOMDropdownSimple(); 
    }
}

// Frontend change stuff
class specStyles {
    static simple  = "simple";
    static complex = "complex";
    static written = "written";
    static writtenMT = "writtenMT"
    static toNextSpecStyle(){
        if(currSpecStyle === specStyles.simple){
            currSpecStyle = specStyles.complex;
            //genuinely not sure if these are needed
            //toggleReactiveInputVisibility();
        }
        else if(currSpecStyle === specStyles.complex){
            currSpecStyle = specStyles.written;
            //toggleReactiveInputVisibility();
        }
        else if(currSpecStyle === specStyles.written){
            currSpecStyle = specStyles.writtenMT;
        }
        //NEWNEW
        else if(currSpecStyle === specStyles.writtenMT){
            currSpecStyle = specStyles.simple;
        }
    }
}

let currSpecStyle = specStyles.simple;