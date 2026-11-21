// A tiny static server for playing the game locally: it serves game/ on
// http://localhost:8080, so game/index.html opens at the root and its
// modules load from beside it. No build step, no network beyond localhost.
//
//   node serve.ts

import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), 'game');
const PORT = 8080;

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

const server = createServer((req, res) => {
  const path = normalize(decodeURIComponent((req.url ?? '/').split('?')[0]));
  const file = path === '/' ? 'index.html' : path.replace(/^\/+/, '');
  const target = join(root, file);
  if (!target.startsWith(root) || !existsSync(target)) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': TYPES[extname(target)] ?? 'application/octet-stream' });
  res.end(readFileSync(target));
});

server.listen(PORT, () => {
  console.log(`Lanterns of Luminara at http://localhost:${PORT}`);
});
