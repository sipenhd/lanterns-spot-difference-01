// Screenshot staging: ?shot=start|play|hunt|end freezes a frame of the real
// game, through its real state — no special rendering path. The cover shows
// the title over the festival; play shows round 2 mid-hunt with markers and
// a counter; hunt shows round 3 against the clock; end shows the win screen.

import { startGame, startRound } from './state.js';
import { differencesForRound } from './differences.js';

// Stage one named scene on a fresh state and return it.
export function stageShot(state, shot) {
  if (shot === 'play') {
    startGame(state);
    state.round = 2;
    startRound(state);
    const diffs = differencesForRound(2);
    for (const d of diffs.slice(0, 3)) state.found.add(d.id);
    state.score = 300;
    state.timeLeft = 74;
    state.toast = `Found: ${diffs[2].label}! +100`;
    state.toastUntil = state.now + 10000;
    return state;
  }
  if (shot === 'hunt') {
    startGame(state);
    state.round = 3;
    startRound(state);
    const diffs = differencesForRound(3);
    for (const d of diffs.slice(0, 2)) state.found.add(d.id);
    state.score = 1450;
    state.timeLeft = 18;
    state.toast = `Found: ${diffs[1].label}! +100`;
    state.toastUntil = state.now + 10000;
    return state;
  }
  if (shot === 'end') {
    startGame(state);
    state.round = 3;
    startRound(state);
    for (const d of differencesForRound(3)) state.found.add(d.id);
    state.screen = 'win';
    state.score = 3600;
    state.roundBonus = 180;
    state.toast = 'You found them all! Time bonus +180.';
    state.toastUntil = state.now + 10000;
    return state;
  }
  return state; // 'start' and anything else: the title screen.
}
