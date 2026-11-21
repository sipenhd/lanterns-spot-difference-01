// The festival scene, drawn procedurally on canvas from one seed, so both
// pictures match except for the differences a round hides. Every element a
// difference can touch is drawn at a fixed spot and tagged with an id; the
// rest is seeded texture (stars, fireflies, ripples) that never moves.

import { mulberry32, range } from './random.js';

// The paper lanterns hung across the night, with their colours fixed.
const LANTERNS = [
  { x: 70, y: 185, color: '#e5484d' },
  { x: 150, y: 195, color: '#f5b942' },
  { x: 230, y: 188, color: '#ef8354' },
  { x: 300, y: 200, color: '#e5484d' },
  { x: 370, y: 192, color: '#f5b942' },
  { x: 440, y: 198, color: '#ef8354' },
  { x: 510, y: 190, color: '#e5484d' },
  { x: 110, y: 250, color: '#f5b942' },
  { x: 190, y: 258, color: '#e5484d' },
  { x: 270, y: 252, color: '#ef8354' },
  { x: 350, y: 256, color: '#f5b942' },
  { x: 430, y: 252, color: '#e5484d' },
  { x: 470, y: 250, color: '#f5b942', id: 'lantern-low' },
  { x: 540, y: 256, color: '#ef8354' },
  { x: 360, y: 225, color: '#e5484d' },
];

function drawLanternShape(ctx, x, y, color, scale = 1) {
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

function drawGlow(ctx, x, y, radius, color) {
  const g = ctx.createRadialGradient(x, y, 2, x, y, radius);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(255, 200, 100, 0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

// Draws one panel of the festival into ctx (panel coordinates, 600 x 540).
// `diffs` is the round's difference list: the left picture passes [], the
// right picture passes the round's differences, so it hides the `hide`
// elements and paints the `draw` alterations over the base scene.
export function drawScene(ctx, seed, diffs) {
  const rng = mulberry32(seed);
  const hidden = new Set(diffs.map((d) => d.hide).filter(Boolean));

  // --- Sky ---
  const sky = ctx.createLinearGradient(0, 0, 0, 540);
  sky.addColorStop(0, '#171233');
  sky.addColorStop(0.55, '#3b2a6b');
  sky.addColorStop(0.8, '#7a4a8a');
  sky.addColorStop(1, '#2a1a4a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 540);

  // --- Stars: a seeded field, plus two fixed bright ones a round can move ---
  for (let i = 0; i < 80; i++) {
    const x = range(rng, 8, 592);
    const y = range(rng, 8, 330);
    const r = range(rng, 0.8, 2);
    ctx.fillStyle = rng() > 0.85 ? '#ffe9a8' : '#e8e4ff';
    ctx.globalAlpha = range(rng, 0.4, 1);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  if (!hidden.has('star-bright')) {
    ctx.fillStyle = '#fff6c9';
    ctx.beginPath();
    ctx.arc(120, 70, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 246, 201, 0.9)';
    ctx.beginPath();
    ctx.moveTo(112, 70);
    ctx.lineTo(128, 70);
    ctx.moveTo(120, 62);
    ctx.lineTo(120, 78);
    ctx.stroke();
  }
  if (!hidden.has('star-move')) {
    ctx.fillStyle = '#fff6c9';
    ctx.beginPath();
    ctx.arc(520, 60, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- Moon ---
  drawGlow(ctx, 475, 78, 70, 'rgba(255, 230, 160, 0.35)');
  ctx.fillStyle = '#f7e8b0';
  ctx.beginPath();
  ctx.arc(475, 78, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(190, 160, 110, 0.7)';
  ctx.beginPath();
  ctx.arc(462, 68, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(488, 88, 4, 0, Math.PI * 2);
  ctx.fill();

  // --- Clouds ---
  ctx.fillStyle = 'rgba(40, 28, 80, 0.85)';
  ctx.beginPath();
  ctx.ellipse(150, 110, 55, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  if (!hidden.has('cloud-2')) {
    ctx.beginPath();
    ctx.ellipse(350, 100, 60, 15, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.ellipse(520, 150, 50, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // --- Distant rooftops ---
  ctx.fillStyle = '#241a45';
  ctx.fillRect(0, 400, 600, 30);
  ctx.fillStyle = '#1a1233';
  for (let x = 20; x < 600; x += 90) {
    ctx.beginPath();
    ctx.moveTo(x, 400);
    ctx.lineTo(x + 45, 378);
    ctx.lineTo(x + 90, 400);
    ctx.closePath();
    ctx.fill();
  }

  // --- Pagoda on the left ---
  ctx.fillStyle = '#2c2148';
  ctx.fillRect(98, 300, 44, 100);
  ctx.fillStyle = '#3a2c5e';
  for (const ty of [300, 328, 356, 384]) {
    ctx.beginPath();
    ctx.moveTo(88, ty + 12);
    ctx.lineTo(152, ty + 12);
    ctx.lineTo(142, ty);
    ctx.lineTo(98, ty);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#2c2148';
  ctx.fillRect(116, 238, 8, 64);
  ctx.beginPath();
  ctx.moveTo(120, 232);
  ctx.lineTo(132, 250);
  ctx.lineTo(108, 250);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#241a45';
  ctx.fillRect(114, 314, 11, 15);

  // --- Lantern strings ---
  ctx.strokeStyle = '#241a30';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(30, 168);
  ctx.quadraticCurveTo(300, 210, 570, 170);
  ctx.moveTo(60, 232);
  ctx.quadraticCurveTo(300, 272, 560, 236);
  ctx.stroke();
  for (const lantern of LANTERNS) {
    if (lantern.id && hidden.has(lantern.id)) continue;
    drawGlow(ctx, lantern.x, lantern.y, 26, 'rgba(255, 190, 90, 0.22)');
    drawLanternShape(ctx, lantern.x, lantern.y, lantern.color);
  }

  // --- Tree on the left edge, bamboo on the right ---
  ctx.strokeStyle = '#1c1428';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(28, 470);
  ctx.lineTo(34, 330);
  ctx.moveTo(34, 360);
  ctx.lineTo(70, 300);
  ctx.stroke();
  ctx.fillStyle = '#2c4a2e';
  ctx.beginPath();
  ctx.arc(40, 300, 46, 0, Math.PI * 2);
  ctx.arc(80, 320, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#3a6b35';
  ctx.lineWidth = 7;
  for (const bx of [566, 580]) {
    ctx.beginPath();
    ctx.moveTo(bx, 470);
    ctx.lineTo(bx - 4, 320);
    ctx.stroke();
  }
  ctx.strokeStyle = '#4e9b47';
  ctx.lineWidth = 2;
  for (const [lx, ly] of [[566, 360], [580, 390], [562, 420]]) {
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(lx + 16, ly - 8);
    ctx.stroke();
  }

  // --- Festival stalls ---
  const stalls = [
    { x: 30, awning: ['#e5484d', '#f7ead7'] },
    { x: 230, awning: ['#2a9d8f', '#f7ead7'] },
    { x: 430, awning: ['#7b5ea7', '#f7ead7'] },
  ];
  for (const stall of stalls) {
    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect(stall.x, 435, 180, 36);
    ctx.fillStyle = '#5a4028';
    ctx.fillRect(stall.x, 435, 180, 6);
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = stall.awning[i % 2];
      ctx.fillRect(stall.x + i * 30, 406, 30, 29);
    }
    ctx.fillStyle = '#2a1c10';
    ctx.fillRect(stall.x, 406, 180, 4);
  }
  // Goods on the middle stall's counter.
  ctx.fillStyle = '#c96f2e';
  ctx.beginPath();
  ctx.arc(300, 448, 9, 0, Math.PI * 2);
  ctx.fill();
  if (!hidden.has('jar-2')) {
    ctx.fillStyle = '#8fb8c9';
    ctx.beginPath();
    ctx.arc(330, 445, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5a4028';
    ctx.fillRect(326, 433, 8, 4);
  }
  ctx.fillStyle = '#e0a458';
  ctx.beginPath();
  ctx.arc(360, 448, 9, 0, Math.PI * 2);
  ctx.fill();
  // A festival-goer browsing the middle stall.
  ctx.fillStyle = '#d9a441';
  ctx.beginPath();
  ctx.arc(250, 452, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3a5a8c';
  ctx.beginPath();
  ctx.moveTo(250, 460);
  ctx.lineTo(232, 472);
  ctx.lineTo(268, 472);
  ctx.closePath();
  ctx.fill();

  // --- River along the bottom ---
  ctx.fillStyle = '#16224d';
  ctx.fillRect(0, 470, 600, 70);
  ctx.strokeStyle = 'rgba(140, 180, 230, 0.35)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 14; i++) {
    const y = 482 + Math.floor(rng() * 48);
    const x = range(rng, 20, 540);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 34, y);
    ctx.stroke();
  }
  // The moon's glint on the water.
  ctx.fillStyle = 'rgba(255, 230, 160, 0.45)';
  ctx.fillRect(469, 476, 7, 52);
  ctx.fillStyle = 'rgba(255, 230, 160, 0.2)';
  ctx.fillRect(458, 482, 26, 40);

  // --- A little boat with a lantern ---
  ctx.fillStyle = '#4a2c1a';
  ctx.beginPath();
  ctx.moveTo(282, 490);
  ctx.lineTo(338, 490);
  ctx.lineTo(326, 504);
  ctx.lineTo(294, 504);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2a1a10';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(310, 490);
  ctx.lineTo(310, 478);
  ctx.stroke();
  if (!hidden.has('boat-lantern')) {
    drawGlow(ctx, 310, 488, 16, 'rgba(255, 190, 90, 0.3)');
    drawLanternShape(ctx, 310, 488, '#f5b942', 0.55);
  }

  // --- Arched bridge on the right ---
  ctx.strokeStyle = '#5a3a28';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(430, 474);
  ctx.quadraticCurveTo(505, 428, 580, 474);
  ctx.stroke();
  ctx.strokeStyle = '#7a4a30';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(445, 470);
  ctx.lineTo(445, 452);
  ctx.moveTo(520, 468);
  ctx.lineTo(520, 450);
  ctx.moveTo(575, 470);
  ctx.lineTo(575, 452);
  ctx.stroke();

  // --- Fireflies ---
  for (let i = 0; i < 24; i++) {
    ctx.fillStyle = 'rgba(220, 255, 150, 0.9)';
    ctx.globalAlpha = range(rng, 0.3, 0.9);
    ctx.beginPath();
    ctx.arc(range(rng, 10, 590), range(rng, 200, 460), 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // --- The round's alterations, painted over the base scene ---
  for (const d of diffs) {
    if (typeof d.draw === 'function') d.draw(ctx);
  }

  // --- A soft vignette, so the panels read as pictures ---
  const vig = ctx.createRadialGradient(300, 270, 200, 300, 270, 420);
  vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vig.addColorStop(1, 'rgba(10, 6, 26, 0.35)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, 600, 540);
}
