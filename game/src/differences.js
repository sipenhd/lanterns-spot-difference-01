// The differences each round hides. A difference names its spot on the
// right picture (panel coordinates, 600 x 540), a label the game shows when
// it is found, and how the right picture changes: `hide` suppresses one
// element of the base scene, `draw` paints the altered element over it.
// The left picture is always the untouched festival.

function drawLantern(ctx, x, y, color, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, 13, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(60, 10, 10, 0.55)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(0, 0, 13, 16, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255, 220, 140, 0.8)';
  ctx.beginPath();
  ctx.moveTo(-13, -4);
  ctx.lineTo(13, -4);
  ctx.moveTo(-13, 4);
  ctx.lineTo(13, 4);
  ctx.stroke();
  ctx.fillStyle = '#7a5a20';
  ctx.fillRect(-4, -20, 8, 4);
  ctx.fillStyle = '#f5c95c';
  ctx.fillRect(-2, 16, 4, 9);
  ctx.restore();
}

function drawStar(ctx, x, y, radius = 3) {
  ctx.save();
  ctx.fillStyle = '#fff6c9';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 246, 201, 0.9)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - radius * 2.4, y);
  ctx.lineTo(x + radius * 2.4, y);
  ctx.moveTo(x, y - radius * 2.4);
  ctx.lineTo(x, y + radius * 2.4);
  ctx.stroke();
  ctx.restore();
}

export const ROUND_DIFFERENCES = [
  // Round 1 — five changes, fair and findable.
  [
    {
      id: 'lantern-gold', label: 'the golden lantern', x: 300, y: 200, r: 26,
      draw(ctx) { drawLantern(ctx, 300, 200, '#f5b942'); },
    },
    {
      id: 'star-bright', label: 'the missing bright star', x: 120, y: 70, r: 14,
      hide: 'star-bright',
    },
    {
      id: 'moon-crater', label: 'the new moon crater', x: 480, y: 70, r: 16,
      draw(ctx) {
        ctx.fillStyle = 'rgba(190, 160, 110, 0.85)';
        ctx.beginPath();
        ctx.arc(478, 66, 4, 0, Math.PI * 2);
        ctx.fill();
      },
    },
    {
      id: 'awning-stripe', label: 'the teal awning stripe', x: 300, y: 420, r: 24,
      draw(ctx) {
        ctx.fillStyle = '#2a9d8f';
        ctx.fillRect(292, 408, 18, 24);
      },
    },
    {
      id: 'lantern-gone', label: 'the vanished lantern', x: 470, y: 250, r: 22,
      hide: 'lantern-low',
    },
  ],
  // Round 2 — seven changes, sharper eyes needed.
  [
    {
      id: 'night-bird', label: 'the night bird', x: 200, y: 120, r: 18,
      draw(ctx) {
        ctx.strokeStyle = '#0d0a1f';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(190, 120);
        ctx.quadraticCurveTo(196, 112, 200, 120);
        ctx.quadraticCurveTo(204, 112, 210, 120);
        ctx.stroke();
      },
    },
    {
      id: 'river-fish', label: 'the fish in the river', x: 150, y: 505, r: 18,
      draw(ctx) {
        ctx.fillStyle = '#9fd8e8';
        ctx.beginPath();
        ctx.ellipse(150, 505, 11, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(160, 505);
        ctx.lineTo(168, 499);
        ctx.lineTo(168, 511);
        ctx.closePath();
        ctx.fill();
      },
    },
    {
      id: 'pagoda-light', label: 'the lit pagoda window', x: 120, y: 322, r: 16,
      draw(ctx) {
        ctx.fillStyle = '#ffd970';
        ctx.fillRect(114, 314, 11, 15);
        ctx.fillStyle = 'rgba(255, 217, 112, 0.25)';
        ctx.beginPath();
        ctx.arc(120, 322, 20, 0, Math.PI * 2);
        ctx.fill();
      },
    },
    {
      id: 'tree-lantern', label: 'the extra tree lantern', x: 60, y: 300, r: 18,
      draw(ctx) { drawLantern(ctx, 60, 300, '#ef8354', 0.7); },
    },
    {
      id: 'pagoda-flag', label: 'the flag on the pagoda', x: 120, y: 242, r: 18,
      draw(ctx) {
        ctx.strokeStyle = '#3a2a1a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(120, 252);
        ctx.lineTo(120, 232);
        ctx.stroke();
        ctx.fillStyle = '#e5484d';
        ctx.beginPath();
        ctx.moveTo(120, 232);
        ctx.lineTo(138, 237);
        ctx.lineTo(120, 243);
        ctx.closePath();
        ctx.fill();
      },
    },
    {
      id: 'boat-lantern', label: 'the boat lantern, gone', x: 310, y: 495, r: 18,
      hide: 'boat-lantern',
    },
    {
      id: 'bridge-post', label: 'the crimson bridge post', x: 520, y: 470, r: 16,
      draw(ctx) {
        ctx.fillStyle = '#c1272d';
        ctx.fillRect(516, 452, 8, 24);
        ctx.fillStyle = '#7a1a1e';
        ctx.fillRect(514, 449, 12, 4);
      },
    },
  ],
  // Round 3 — nine changes, hidden by design.
  [
    {
      id: 'long-tassel', label: 'the longer tassel', x: 360, y: 232, r: 14,
      draw(ctx) {
        ctx.strokeStyle = '#f5c95c';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(360, 240);
        ctx.lineTo(360, 252);
        ctx.stroke();
        ctx.fillStyle = '#f5c95c';
        ctx.fillRect(357, 252, 6, 8);
      },
    },
    {
      id: 'star-moved', label: 'the star that moved', x: 540, y: 90, r: 14,
      hide: 'star-move',
      draw(ctx) { drawStar(ctx, 540, 90, 3); },
    },
    {
      id: 'roof-tile', label: 'the golden roof tile', x: 150, y: 415, r: 14,
      draw(ctx) {
        ctx.fillStyle = '#f5b942';
        ctx.fillRect(142, 410, 16, 9);
      },
    },
    {
      id: 'river-ripple', label: 'the ripple in the river', x: 420, y: 520, r: 16,
      draw(ctx) {
        ctx.strokeStyle = 'rgba(190, 220, 240, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(420, 520, 18, 6, 0, 0, Math.PI * 2);
        ctx.stroke();
      },
    },
    {
      id: 'goer-hat', label: 'the festival hat', x: 250, y: 452, r: 16,
      draw(ctx) {
        ctx.fillStyle = '#d9a441';
        ctx.beginPath();
        ctx.moveTo(250, 436);
        ctx.lineTo(266, 454);
        ctx.lineTo(234, 454);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#8a6a20';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(234, 454);
        ctx.lineTo(266, 454);
        ctx.stroke();
      },
    },
    {
      id: 'cloud-gone', label: 'the vanished cloud', x: 350, y: 100, r: 20,
      hide: 'cloud-2',
    },
    {
      id: 'jar-gone', label: 'the missing jar', x: 330, y: 445, r: 14,
      hide: 'jar-2',
    },
    {
      id: 'moon-glint', label: 'the brighter moon glint', x: 470, y: 510, r: 16,
      draw(ctx) {
        ctx.fillStyle = 'rgba(255, 230, 160, 0.75)';
        ctx.fillRect(466, 496, 9, 30);
        ctx.fillStyle = 'rgba(255, 230, 160, 0.35)';
        ctx.fillRect(459, 500, 22, 22);
      },
    },
    {
      id: 'bamboo-leaf', label: 'the bamboo leaf', x: 560, y: 330, r: 14,
      draw(ctx) {
        ctx.save();
        ctx.translate(560, 330);
        ctx.rotate(-0.6);
        ctx.fillStyle = '#4e9b47';
        ctx.beginPath();
        ctx.ellipse(0, 0, 12, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      },
    },
  ],
];

// The differences of a round (1-based), as the scene needs them.
export function differencesForRound(round) {
  return ROUND_DIFFERENCES[round - 1] ?? [];
}
