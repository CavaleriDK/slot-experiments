# Slot Experiments

## Getting started

To get started quickly, execute the following commands to install dependency and run the dev server

```
npm i
npm run dev
```

This opens a new browser window with the game running on localhost:8080 by default.

## Implementation details

This game repo is build on top of [pixi-typescript-boilderplate](https://github.com/yordan-kanchelov/pixi-typescript-boilerplate) as a scaffolding point, [Pixi.js 7.x](https://pixijs.io/) as a rendering library and [GSAP 3.x](https://gsap.com/) as the tween library.

The core gameplay loop is building around a finite state machine. All available states can be found in the [states](/src/states/) directory. The game entry point is [Game.ts](/src//Game.ts). The demo includes a [fake server](/src/srv/FakeProtocol.ts) to mimic game server behaviour 

### Extending with new features 

Adding new gameplay features is as simple as changing a relevant state or creating a new state for your feature. Implementing a new feature like respins with sticky wilds can be done on a high level as:

1. Update the server protocol to contain the feature details in spin responses. The feature can have WILDS position and the updated view after the respin.
2. Update the [Spinning](/src/states/Spinning.ts) or [WinFlow](/src/states/WinFlow.ts) state and check if the spin response has activated a respin
3. Create a new state that: a) highlights the wilds in a way that makes sense visually for the drop-down spin style, b) drop down other symbols, c) drop in new respin-symbols

The game automatically deploys to its [Github pages](https://CavaleriDK.github.io/slot-experiments/). Deployment runs on an automatic CD pipeline for every push or PR to the main branch. 

The game can be build and deployed manually by copying the artifacts from ./dist/ after executing `npm run lint && npm run test && npm run prebuild && npm run build`.