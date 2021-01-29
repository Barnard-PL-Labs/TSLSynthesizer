# The TSL Synthesis Synthesizer

[Try it live!](https://tslsynthesissynthesizer.com/)

This is the TSL Synthesis Synthesizer, a keyboard synthesizer that can dynamically apply effects depending on users' specifications. 

Recommended usage is through a MIDI controller. Connect your MIDI device to your computer, load the website, and start playing!
Note, however, that [WebMIDI](https://developer.mozilla.org/en-US/docs/Web/API/MIDIAccess) is only currently supported for Google Chrome, MS Edge and Opera -- it will not work on Firefox and Safari. You can still use the UI keyboard, as [WebAudio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) is supported by all major browsers.

Synthesis uses [Temporal Stream Logic](https://link.springer.com/chapter/10.1007/978-3-030-25540-4_35), a logic for reactive synthesis that separates control and data. 

## Tutorial

[Demo](https://www.youtube.com/watch?v=Rs2Q8bbbixs)


## Local installation

### Dependencies

1. `Node.js`
2. `Docker`
3. The `haskell` tool stack

`Node.js` and `docker` are widely available, and on most official repositories, i.e. via `apt`, `snap`, `pacman`.

The `haskell` tool stack can be installed on most systems with 
```sh
curl -sSL https://get.haskellstack.org/ | sh
```
If not, the [`haskell` stack documentation](https://docs.haskellstack.org/en/stable/install_and_upgrade/) has a variety of other installation methods.

### Installation

The build process involves installing `node.js` packages, and configuring `stack`, all of which _do not_ interfere with system installations; they are local to this project. The project does, however, pull a `docker` image, which you may delete after playing with the project.

Simply run:
```sh
chmod +x install.sh
./install.sh
```

Depending on your system, you may need to grant `sudo` privilege to `docker`.

#### Retry with '--allow-different-user'

Depending on your system, you may get the following error:

```
You are not the owner of '~/.stack/'. Aborting to protect file permissions.
Retry with '--allow-different-user' to disable this precaution.
```

If you get this error, add the following line in your `~/.stack/config.yaml`:

```yaml
allow-different-user: true
```

### Run the application

To run the application:
```sh
node server.js
```
Then open your favorite browser to `localhost:4747`, and enjoy!


## Acknowledgments
The UI is adopted from [qwerty hancock](https://stuartmemo.com/qwerty-hancock/).
