// Lanterns of Luminara — configuration: board geometry, rounds, scoring.
// A spot-the-difference hunt at a night lantern festival. Two panels hang
// side by side; the right one hides the changes. Three rounds, a shorter
// fuse each round, hints cost points, wrong clicks cost seconds.

export const CANVAS_W = 1280;
export const CANVAS_H = 692;

// The two pictures: same size, hung side by side under the HUD.
export const PANEL_W = 600;
export const PANEL_H = 540;
export const PANEL_Y = 64;
export const LEFT_X = 16;
export const RIGHT_X = 664;

// Rounds: how many differences hide, and how long the fuse burns.
export const ROUNDS = [
  { differences: 5, seconds: 120 },
  { differences: 7, seconds: 100 },
  { differences: 9, seconds: 90 },
];

export const FIND_POINTS = 100; // points banked for each difference found
export const HINT_COST = 50; // points a hint spends
export const WRONG_SECONDS = 3; // seconds a wrong click burns
export const TIME_BONUS_PER_SECOND = 10; // points per second left on a clear

export const DEFAULT_SEED = 7;
