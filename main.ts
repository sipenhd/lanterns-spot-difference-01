// Lanterns of Luminara — the hand-in program (Node 22, standard library
// only). It carries the game from this repository to /output: the whole
// game/ folder and the screenshots/, then writes /output/dossier.json with
// the make.fun library, so the judge reads the same dossier the scorer
// rebuilds from the same files. Outside the grader, MAKEFUN_OUTPUT_DIR
// stands in for /output:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The game first: every static file the browser loads, as it stands.
mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, 'game'), join(outDir, 'game'), { recursive: true });

// Then the screenshots, the renders of the game's own code.
const shotsDir = join(repoRoot, 'screenshots');
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });
}

// The dossier, under the scorer's own caps: at most 160 KiB of source text,
// 4 screenshots of at most 256 KiB each, game/ within 993 entries and
// 48 MiB, no path over 1000 bytes. Only the text cap shapes the bytes;
// the rest refuse an entry the scorer would refuse.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
