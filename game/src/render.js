// Everything the player sees: the HUD, the two pictures, the rings on
// found differences, the crosshair, and the title / clear / win / time-up
// screens. The scene itself lives in scene.js; this file frames it.

import {
  CANVAS_W,
  CANVAS_H,
  PANEL_W,
  PANEL_H,
  PANEL_Y,
  LEFT_X,
  RIGHT_X,
} from './config.js';
import { drawScene } from './scene.js';
import { differencesForRound } from './differences.js';
import { roundDifferences, remainingCount, formatTime } from './state.js';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawPanel(ctx, state, x, diffs) {
  ctx.save();
  roundRect(ctx, x, PANEL_Y, PANEL_W, PANEL_H, 10);
  ctx.clip();
  ctx.translate(x, PANEL_Y);
  drawScene(ctx, state.seed, diffs);
  ctx.restore();
  ctx.strokeStyle = '#c9a86a';
  ctx.lineWidth = 2;
  roundRect(ctx, x, PANEL_Y, PANEL_W, PANEL_H, 10);
  ctx.stroke();
}

function drawFoundRings(ctx, state) {
  const diffs = roundDifferences(state);
  for (const d of diffs) {
    if (!state.found.has(d.id)) continue;
    for (const px of [LEFT_X, RIGHT_X]) {
      const cx = px + d.x;
      const cy = PANEL_Y + d.y;
      ctx.strokeStyle = '#37d67a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, d.r + 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#37d67a';
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#37d67a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy);
      ctx.lineTo(cx - 1, cy + 5);
      ctx.lineTo(cx + 7, cy - 5);
      ctx.stroke();
    }
  }
}

function drawHintPulse(ctx, state) {
  if (!state.hintPulse || state.now > state.hintPulse.until) return;
  const d = roundDifferences(state).find((x) => x.id === state.hintPulse.id);
  if (!d) return;
  const pulse = 0.5 + 0.5 * Math.sin(state.now / 130);
  ctx.strokeStyle = `rgba(245, 185, 66, ${0.5 + pulse * 0.5})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(RIGHT_X + d.x, PANEL_Y + d.y, d.r + 6 + pulse * 5, 0, Math.PI * 2);
  ctx.stroke();
}

function drawWrongMark(ctx, state) {
  if (!state.lastWrong || state.now > state.lastWrong.until) return;
  const { x, y } = state.lastWrong;
  const cx = RIGHT_X + x;
  const cy = PANEL_Y + y;
  ctx.strokeStyle = '#ff5a5a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy - 8);
  ctx.lineTo(cx + 8, cy + 8);
  ctx.moveTo(cx + 8, cy - 8);
  ctx.lineTo(cx - 8, cy + 8);
  ctx.stroke();
}

function drawCrosshair(ctx, state) {
  if (!state.keyboardMode || state.screen !== 'playing') return;
  const cx = RIGHT_X + state.crosshair.x;
  const cy = PANEL_Y + state.crosshair.y;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 18, cy);
  ctx.lineTo(cx - 7, cy);
  ctx.moveTo(cx + 7, cy);
  ctx.lineTo(cx + 18, cy);
  ctx.moveTo(cx, cy - 18);
  ctx.lineTo(cx, cy - 7);
  ctx.moveTo(cx, cy + 7);
  ctx.lineTo(cx, cy + 18);
  ctx.stroke();
}

function drawHud(ctx, state) {
  ctx.fillStyle = '#0d0a1f';
  ctx.fillRect(0, 0, CANVAS_W, 56);
  ctx.fillStyle = '#f5c95c';
  ctx.font = 'bold 24px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Lanterns of Luminara', 16, 29);
  ctx.fillStyle = '#e8e4ff';
  ctx.font = '18px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Round ${state.round} / 3`, 560, 29);
  const left = remainingCount(state);
  ctx.fillStyle = left === 0 ? '#37d67a' : '#ffd970';
  ctx.fillText(`${left} left`, 700, 29);
  ctx.fillStyle = '#e8e4ff';
  ctx.textAlign = 'right';
  ctx.fillText(`Score ${state.score}`, 1010, 29);
  const urgent = state.timeLeft <= 15 && state.screen === 'playing';
  ctx.fillStyle = urgent ? '#ff5a5a' : '#e8e4ff';
  ctx.fillText(`Time ${formatTime(state.timeLeft)}`, 1264, 29);
}

function drawPanelLabels(ctx) {
  ctx.font = '15px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#c9b8e8';
  ctx.fillText('ORIGINAL — study this picture', LEFT_X + PANEL_W / 2, PANEL_Y - 8);
  ctx.fillText('CHANGED — find the differences here', RIGHT_X + PANEL_W / 2, PANEL_Y - 8);
}

function drawFooter(ctx, state) {
  ctx.fillStyle = '#0d0a1f';
  ctx.fillRect(0, 612, CANVAS_W, CANVAS_H - 612);
  ctx.fillStyle = '#b8aed6';
  ctx.font = '15px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const message = state.now < state.toastUntil ? state.toast
    : 'Click a difference on the right picture · H hint (−50) · Arrow keys + Enter · M mute · R retry';
  ctx.fillText(message, CANVAS_W / 2, 652);
}

function drawScreenOverlay(ctx, state, title, lines, accent) {
  ctx.fillStyle = 'rgba(13, 10, 31, 0.82)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = accent;
  ctx.font = 'bold 54px Georgia, serif';
  ctx.fillText(title, CANVAS_W / 2, 250);
  ctx.fillStyle = '#e8e4ff';
  ctx.font = '20px Georgia, serif';
  lines.forEach((line, i) => {
    ctx.fillText(line, CANVAS_W / 2, 320 + i * 34);
  });
}

// The whole frame: HUD, both pictures, markers, and whichever screen is up.
export function render(ctx, state) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#0d0a1f';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  drawHud(ctx, state);
  drawPanelLabels(ctx);
  const diffs = roundDifferences(state);
  drawPanel(ctx, state, LEFT_X, []);
  drawPanel(ctx, state, RIGHT_X, diffs);
  drawFoundRings(ctx, state);
  drawHintPulse(ctx, state);
  drawWrongMark(ctx, state);
  drawCrosshair(ctx, state);
  drawFooter(ctx, state);

  if (state.screen === 'title') {
    drawScreenOverlay(ctx, state, 'Lanterns of Luminara', [
      'Two pictures of the night festival hang side by side.',
      'The right one hides the changes — ring every difference before',
      'the lanterns burn down. 3 rounds: 5, then 7, then 9 differences.',
      'Click a difference, or move with the arrow keys and press Enter.',
      'H spends a hint (50 points). A wrong click burns 3 seconds.',
      '',
      'Press Enter to begin',
    ], '#f5c95c');
  } else if (state.screen === 'roundClear') {
    drawScreenOverlay(ctx, state, `Round ${state.round} clear!`, [
      `You found all ${diffs.length} differences. Time bonus +${state.roundBonus}.`,
      `Score ${state.score} — the next round hides ${differencesForRound(state.round + 1)?.length ?? 0} differences.`,
      '',
      'Press Enter for the next round',
    ], '#37d67a');
  } else if (state.screen === 'win') {
    drawScreenOverlay(ctx, state, 'You found them all!', [
      `Every lantern, star and ripple accounted for — all ${diffs.length} in the last round.`,
      `Final score ${state.score} · Hints used ${state.hintsUsed}`,
      '',
      'Press Enter to play again',
    ], '#f5c95c');
  } else if (state.screen === 'timeUp') {
    drawScreenOverlay(ctx, state, "Time's up", [
      `The lanterns burned down with ${remainingCount(state)} differences still hidden.`,
      `Score ${state.score} — Round ${state.round}.`,
      '',
      'Press R to retry the round',
    ], '#ff5a5a');
  }
}

// The one-line status the screen reader (and the play-test) reads.
export function statusText(state) {
  if (state.screen === 'title') return 'Title screen. Press Enter to begin.';
  if (state.screen === 'win') return `You win. Final score ${state.score}. Press Enter to play again.`;
  if (state.screen === 'timeUp') return `Time up. Score ${state.score}. Press R to retry round ${state.round}.`;
  if (state.screen === 'roundClear') {
    return `Round ${state.round} clear. Score ${state.score}. Press Enter for round ${state.round + 1}.`;
  }
  return `Round ${state.round}, ${remainingCount(state)} differences left, score ${state.score}, ${formatTime(state.timeLeft)} remaining.`;
}
