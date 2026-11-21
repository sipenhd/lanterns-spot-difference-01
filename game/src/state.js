// The game's state: which screen shows, which round runs, what the player
// has found, and the clock. Pure logic — no canvas, no DOM — so the rules
// are the same whether a person plays or a screenshot stages a frame.

import {
  ROUNDS,
  FIND_POINTS,
  HINT_COST,
  WRONG_SECONDS,
  TIME_BONUS_PER_SECOND,
  DEFAULT_SEED,
} from './config.js';
import { differencesForRound } from './differences.js';

// A fresh game, waiting on the title screen.
export function createState(seed = DEFAULT_SEED) {
  return {
    seed,
    screen: 'title', // title | playing | roundClear | win | timeUp
    round: 1,
    score: 0,
    scoreAtRoundStart: 0,
    timeLeft: ROUNDS[0].seconds,
    found: new Set(),
    hintsUsed: 0,
    crosshair: { x: 300, y: 270 }, // panel coordinates, on the right picture
    keyboardMode: false,
    toast: 'Find every difference on the right picture.',
    toastUntil: 0,
    hintPulse: null, // { id, until } — the hinted difference, pulsing gold
    lastWrong: null, // { x, y, until } — a red X where a click missed
    roundBonus: 0,
    now: 0, // milliseconds of play, advanced by the loop
  };
}

export function roundDifferences(state) {
  return differencesForRound(state.round);
}

export function remainingCount(state) {
  return roundDifferences(state).length - state.found.size;
}

export function roundConfig(state) {
  return ROUNDS[state.round - 1];
}

// Start a round: fresh found set, full fuse, score banked as the floor.
export function startRound(state) {
  state.found = new Set();
  state.timeLeft = roundConfig(state).seconds;
  state.scoreAtRoundStart = state.score;
  state.hintPulse = null;
  state.lastWrong = null;
  state.screen = 'playing';
  state.toast = `Round ${state.round}: find ${roundDifferences(state).length} differences!`;
  state.toastUntil = state.now + 2500;
}

export function startGame(state) {
  state.round = 1;
  state.score = 0;
  state.hintsUsed = 0;
  startRound(state);
}

// Advance the clock; the fuse burning out ends the round in defeat.
export function tick(state, dtSeconds) {
  if (state.screen !== 'playing') return;
  state.timeLeft -= dtSeconds;
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    state.screen = 'timeUp';
    state.toast = "Time's up — the lanterns burned down.";
    state.toastUntil = state.now + 4000;
  }
}

// Check a spot on the right picture (panel coordinates). A hit rings the
// difference on both pictures and banks points; a miss burns 3 seconds.
export function checkSpot(state, x, y) {
  if (state.screen !== 'playing') return 'idle';
  for (const d of roundDifferences(state)) {
    if (state.found.has(d.id)) continue;
    const dx = x - d.x;
    const dy = y - d.y;
    if (dx * dx + dy * dy <= d.r * d.r) {
      state.found.add(d.id);
      state.score += FIND_POINTS;
      state.toast = `Found: ${d.label}! +${FIND_POINTS}`;
      state.toastUntil = state.now + 2500;
      if (state.found.size === roundDifferences(state).length) {
        const bonus = Math.ceil(state.timeLeft) * TIME_BONUS_PER_SECOND;
        state.roundBonus = bonus;
        state.score += bonus;
        state.screen = state.round >= ROUNDS.length ? 'win' : 'roundClear';
        state.toast = state.screen === 'win'
          ? `You found them all! Time bonus +${bonus}.`
          : `Round clear! Time bonus +${bonus}.`;
        state.toastUntil = state.now + 4000;
        return 'roundClear';
      }
      return 'found';
    }
  }
  state.timeLeft = Math.max(0, state.timeLeft - WRONG_SECONDS);
  state.lastWrong = { x, y, until: state.now + 900 };
  state.toast = `Not there — ${WRONG_SECONDS} seconds lost.`;
  state.toastUntil = state.now + 2000;
  if (state.timeLeft <= 0) {
    state.screen = 'timeUp';
    state.toast = "Time's up — the lanterns burned down.";
    state.toastUntil = state.now + 4000;
    return 'timeUp';
  }
  return 'wrong';
}

// Spend a hint: 50 points, and one unfound difference pulses gold.
export function useHint(state) {
  if (state.screen !== 'playing') return false;
  const unfound = roundDifferences(state).filter((d) => !state.found.has(d.id));
  if (unfound.length === 0) return false;
  const target = unfound[Math.floor(Math.random() * unfound.length)];
  state.score = Math.max(0, state.score - HINT_COST);
  state.hintsUsed += 1;
  state.hintPulse = { id: target.id, until: state.now + 2200 };
  state.toast = `Hint: look near the ${target.label.split(' ').slice(-1)[0]}… −${HINT_COST} points`;
  state.toastUntil = state.now + 2500;
  return true;
}

// Move on from a cleared round, or restart after the fuse burned out.
export function advance(state) {
  if (state.screen === 'roundClear') {
    state.round += 1;
    startRound(state);
    return true;
  }
  return false;
}

export function retryRound(state) {
  state.score = state.scoreAtRoundStart;
  startRound(state);
}

export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
