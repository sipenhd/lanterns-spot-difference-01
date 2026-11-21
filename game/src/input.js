// Mouse and keyboard. A click on the right picture checks the spot it
// lands on; arrow keys move a crosshair and Enter checks it, so the whole
// hunt plays without a mouse. H hints, M mutes, R retries the round.

import { RIGHT_X, PANEL_Y, PANEL_W, PANEL_H } from './config.js';

// Convert a mouse event to panel coordinates on the right picture, or null
// when the click lands outside it.
export function eventToPanelPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * canvas.width - RIGHT_X;
  const y = ((event.clientY - rect.top) / rect.height) * canvas.height - PANEL_Y;
  if (x < 0 || x >= PANEL_W || y < 0 || y >= PANEL_H) return null;
  return { x, y };
}

// Wire the canvas and keys to the game's controller.
export function attachInput(canvas, controller) {
  canvas.addEventListener('click', (event) => {
    const point = eventToPanelPoint(canvas, event);
    if (point) controller.clickSpot(point.x, point.y);
  });

  window.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
      event.preventDefault();
      controller.moveCrosshair(key);
      return;
    }
    if (key === 'Enter') {
      event.preventDefault();
      controller.pressEnter();
      return;
    }
    if (key === 'h' || key === 'H') {
      controller.pressHint();
      return;
    }
    if (key === 'm' || key === 'M') {
      controller.pressMute();
      return;
    }
    if (key === 'r' || key === 'R') {
      controller.pressRetry();
    }
  });
}
