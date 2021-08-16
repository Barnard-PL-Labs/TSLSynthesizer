# Temporal Stream Logic

A Temporal Stream Logic (TSL) specification is built from multiple parts, that are formally known as __logical operators, temporal operators, predicate terms__ and __function terms__.
Here, we present examples in an intuitive format to help you write specifications in TSL.

## Operators

| Operator | Syntax   | Name       | Meaning                |
|----------|----------|------------|------------------------|
| <->      | a <-> b  | iff        | a if and only iff b    |
| ->       | a -> b   | implies    | a implies b            |
| &&       | a && b   | and        | a AND b                |
| \|\|     | a \|\| b | or         | a OR b                 |
| !        | !a       | not        | not a                  |
| X        | X a      | next       | On next timestep       |
| F        | F a      | eventually | Eventually             |
| U        | a U b    | until      | a must be true until b |
| G        | G a      | always     | a is always true       |

## Playing notes
* Syntax: `play note45` ~ `play note79`
Corresponds to playing any note between A2 and G5.

### Example:
```
play note64 <-> [lfo <- toggle lfo];
```
Playing note 64 (E4) toggles LFO.

## Turning effects on or off
* `True()`: turns effect on.
* `False()`: turns effect off.
* `toggle()`: toggles on/off.

### Available effects
`amSynthesis, fmSynthesis, lfo, filterOn, harmonizerOn, arpeggiatorOn`

### Example:
```
[amSynthesis <- True()] -> X [amSynthesis <- False()]
```
When you turn on AM Synthesis, it gets turned back off on the next timestep.

## Changing type of effect
Change the type of waveform, arpeggiator style, or filter style.

Available effects:

* `waveform`: `sine(), sawtooth(), square(), triangle()`
* `arpeggiatorStyle`: `downStyle(), upStyle(), upDownStyle(), randomStyle()`
* `filterType`: `lowpass(), highpass(), bandpass()`

### Example:
```
[waveform <- sawtooth()] && ([arpeggiatorStyle <- downStyle()] || [arpeggiatorStyle <- upStyle()]);
```
Waveform is sawtooth and arpeggiator style is down style or up style.

## Changing values of effects
Increment/decrement value by 1, 10, 100, or 1,000.
Functions are named `inc1`, `dec1`, `inc10`, ... etc.

### Available Parameters
`amFreq, fmFreq, lfoDepth, lfoFreq, filterQControl, harmonizerInterval, arpeggiatorRate`


### Example:
```
[amFreq <- inc1 amFreq] <-> [fmFreq <- dec1 fmFreq]
```
Increasing AM frequency by 1 always triggers decrement of FM frequency and vice versa.
