// Boots the game: reads ?seed= and ?shot= from the URL, builds the state,
// wires the input and the sounds, and runs the frame loop. The canvas holds
// the whole game; the #status line mirrors it for screen readers.

import { DEFAULT_SEED, PANEL_W, PANEL_H } from './config.js';
import {
  createState,
  startGame,
  tick,
  checkSpot,
  useHint,
  advance,
  retryRound,
} from './state.js';
import { render, statusText } from './render.js';
import { attachInput } from './input.js';
import { SoundFX } from './audio.js';
import { stageShot } from './shots.js';
import { differencesForRound } from './differences.js';

const params = new URLSearchParams(window.location.search);
const seed = Number.parseInt(params.get('seed') ?? '', 10) || DEFAULT_SEED;
const shot = params.get('shot');

const canvas = document.getElementById('game');
const statusEl = document.getElementById('status');
const ctx = canvas.getContext('2d');

const state = createState(seed);
if (shot) stageShot(state, shot);

const sounds = new SoundFX();
let lastWholeSecond = -1;

const controller = {
  clickSpot(x, y) {
    const result = checkSpot(state, x, y);
    if (result === 'found') sounds.found();
    else if (result === 'wrong') sounds.wrong();
    else if (result === 'roundClear') sounds.roundClear();
    else if (result === 'timeUp') sounds.wrong();
  },
  moveCrosshair(key) {
    state.keyboardMode = true;
    const step = 24;
    const c = state.crosshair;
    if (key === 'ArrowLeft') c.x = Math.max(0, c.x - step);
    if (key === 'ArrowRight') c.x = Math.min(PANEL_W, c.x + step);
    if (key === 'ArrowUp') c.y = Math.max(0, c.y - step);
    if (key === 'ArrowDown') c.y = Math.min(PANEL_H, c.y + step);
  },
  pressEnter() {
    sounds.ensure();
    if (state.screen === 'title' || state.screen === 'win') {
      startGame(state);
      return;
    }
    if (state.screen === 'roundClear') {
      if (advance(state)) sounds.roundClear();
      return;
    }
    if (state.screen === 'playing') {
      state.keyboardMode = true;
      this.clickSpot(state.crosshair.x, state.crosshair.y);
    }
  },
  pressHint() {
    if (useHint(state)) sounds.hint();
  },
  pressMute() {
    const muted = sounds.toggleMute();
    state.toast = muted ? 'Sound off (M to turn it back on).' : 'Sound on.';
    state.toastUntil = state.now + 2000;
  },
  pressRetry() {
    if (state.screen === 'timeUp' || state.screen === 'playing') retryRound(state);
  },
};

attachInput(canvas, controller);

// A handle for the play-test: the state and the round's differences.
window.__luminara = { state, controller, differencesForRound };

let last = performance.now();
let lastStatus = '';
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  state.now = now;
  tick(state, dt);
  if (state.screen === 'playing' && state.timeLeft <= 10) {
    const whole = Math.ceil(state.timeLeft);
    if (whole !== lastWholeSecond) {
      lastWholeSecond = whole;
      sounds.tick();
    }
  }
  render(ctx, state);
  const text = statusText(state);
  if (text !== lastStatus) {
    lastStatus = text;
    statusEl.textContent = text;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
