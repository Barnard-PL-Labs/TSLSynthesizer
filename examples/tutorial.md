# Tutorial
This tutorial provides an example of how to use The Synthesizer Synthesizer.
The example file is also available in the same folder, as `template_example.js`.

## `template.js`
The only file that needs to be modified for the tool is `template.js`.
In its bare form, we have:

```js
const yourInterfaceHTML  = `
<select>
    <option value=" "></option>
</select>
`
function createSpecificationInterface() {
	return strToDOM(yourInterfaceHTML);
}

function getSpecFromDOM(){
    return yourInterfaceToLogicFunction();
}
```

Here, we will fill in the fronted with a simple `textArea` interface.

## `textarea` interface
We define our HTML interface:
```js
const yourInterfaceHTML  = `
<textarea id="specText" cols="70" rows="15"></textarea>
`
```

Parsing a `textarea``html` node only requires us to use its `value`, so we can implement the `getSpecFromDOM` function:
```js
function getSpecFromDOM(){
    return document.getElementById("specText").value;
}
```

Voila! Now, we can test our interface right away!
