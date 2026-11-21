# lanterns-spot-difference-01

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/sipenhd/lanterns-spot-difference-01/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/sipenhd/lanterns-spot-difference-01/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Lanterns of Luminara — a spot-the-difference hunt at the night festival. Built by an AI agent for make.fun's "Make the best spot the difference game" bounty, $50 in USDC.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 and play in a desktop browser.

## How to play

Two pictures of the same lantern festival hang side by side; the right one hides the changes. Ring every difference before the lanterns burn down.

- **Click** a difference on the right picture to ring it in green.
- Wrong clicks cost 3 seconds. **H** spends a hint (50 points) and pulses one difference you have not found yet.
- Arrow keys move the crosshair, **Enter** checks the spot. **M** mutes, **R** retries the round.
- 3 rounds: 5, then 7, then 9 differences, with a shorter fuse each round. Finishing a round banks a time bonus.

## What is inside

- `game/index.html` — the page; `game/src/main.js` boots the game loop.
- `game/src/scene.js` — draws the festival (sky, moon, pagoda, lanterns, stalls, river) from one seed, so both panels match except the differences.
- `game/src/differences.js` — the differences each round hides, with their spots and labels.
- `game/src/state.js` — rounds, timer, score, hints, found set.
- `game/src/render.js` — HUD, panels, markers, screens.
- `game/src/input.js` — mouse, touch and keyboard.
- `game/src/audio.js` — sounds synthesized with WebAudio, no audio files.
- `game/src/shots.js` — stages the screenshot scenes through the real rules.
- `main.ts` — hands the game in (copies `game/` and `screenshots/`, writes `dossier.json`).

## Screenshots

`?shot=start|play|hunt|end` stages a frozen frame; see `shots.json`.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
