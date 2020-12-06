# TSL Synthesis Synthesizer

Based on the Synth UI from [Tinus Wanger](https://github.com/Tinusw/webAudioSynth).

Assuming you have `Node.js` installed, running the program is easy:

```sh
node server.js
```

And then open up `localhost:8080` on your favorite browser.

---------------------------------------------------------------------------------------------

This is a little synthesizer with:
- Polyphonic playable keyboard
- Two oscillators with:
  - sawtooth
  - sine
  - triagle
  - square
- By default oscillator 2 will be on the same octave as Oscillator 1, but can be shifted up, or down an octave.
- Lowpass filter with resonance
- Highpass filter with resonance
- An effects section with 2 X-Y pads:
  - A delay circuit (feedback is slightly filtered)
    - X axis controls feedback time
    - Y axis controls feedback volume
  - A distortion circuit
    - X axis controls the distortion curve
    - Y axis is in progress.
- A spectrum analyser that will give real-time output.
- It also has a mini tutorial built using [bootstrap-tour](http://bootstraptour.com/api/).

## Setting the project up & running it.

The project is bundled using webpack, so to get started run

`npm install`

To run it locally(using webpack-dev-server):
`npm dev`

To run on production(using express):
- run `npm build` to compile a new version of `bundle.js` with webpack
- run `npm start` to fire up an express server

then check out `localhost:8080`
