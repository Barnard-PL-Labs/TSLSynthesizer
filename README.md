# The TSL Synthesis Synthesizer

[Try it live -- Link not yet active](#)

_* Note: This project is still under development. It has yet to release even a 0.1.0 version. *_

## Installation
You need `node.js` and `docker`, which are widely available on `apt`, `snap`, `pacman`, etc.
You also need the `haskell` tool stack, which should be installable on most systems with
```sh
curl -sSL https://get.haskellstack.org/ | sh
```
If not, the [`haskell` stack documentation](https://docs.haskellstack.org/en/stable/install_and_upgrade/) has a variety of other installation methods.

After cloning and moving into the repository, install some `node.js` packages:

```sh
npm install child_process
npm install express
npm install fs
```

Then, pull the `tsltools` repository:
```sh
git clone https://github.com/wonhyukchoi/tsltools
```

Then, we need to `make` tsltools:
```sh
cd tsltools
make
cd -
```

Then, pull the docker image (you may need sudo privileges here): 
```sh
docker <not yet pushed to docker hub>
```

Finally, run the application:
```sh
node server.js
```
Then open your favorite browser to `localhost:4747`, and enjoy!


## Acknowledgments
The UI is adopted from [qwerty hancock](https://stuartmemo.com/qwerty-hancock/).
