// tools/gen_tilemap.js — Sands of Aetheria
// Rôle : GÉNÈRE assets/tilemaps/world.json (Tiled 80x80) + world_tileset.png (9 tuiles).
//        Outil de développement (lancé une fois) — PAS du code runtime du jeu.
// Run  : node tools/gen_tilemap.js
// Dépendances : src/data/worldZones.js (logique pure), node:zlib, node:fs.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { TILES_X, TILES_Y, TILE, GID, TILESET_COUNT, groundGidAt, isCollision, decorGidAt } from '../src/data/worldZones.js';

// ── Encodeur PNG minimal (RGBA 8-bit) ──────────────────────────
function crc32(buf) {
  let crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    let c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td), 0);
  return Buffer.concat([len, td, crc]);
}
function encodePNG(w, h, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit, RGBA
  const stride = w * 4;
  const raw = Buffer.alloc((stride + 1) * h);
  for (let y = 0; y < h; y++) {
    const rs = y * (stride + 1);
    raw[rs] = 0; // filtre None
    for (let x = 0; x < stride; x++) raw[rs + 1 + x] = rgba[y * stride + x];
  }
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

// ── Tileset : 9 tuiles 32x32 en ligne (288x32) ─────────────────
const W = TILESET_COUNT * TILE, H = TILE;
const px = Buffer.alloc(W * H * 4); // transparent par défaut
const setp = (x, y, r, g, b, a = 255) => {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const o = (y * W + x) * 4; px[o] = r; px[o + 1] = g; px[o + 2] = b; px[o + 3] = a;
};
const fillTile = (i, r, g, b) => { for (let y = 0; y < TILE; y++) for (let x = 0; x < TILE; x++) setp(i * TILE + x, y, r, g, b); };
const speckle = (i, r, g, b) => { for (let k = 0; k < 12; k++) { const x = (k * 7) % 26 + 3, y = (k * 11) % 26 + 3; setp(i * TILE + x, y, r, g, b); setp(i * TILE + x + 1, y, r, g, b); } };

fillTile(0, 0xc4, 0xa3, 0x5a);                                   // hub sand
fillTile(1, 0x8b, 0x73, 0x55); speckle(1, 0x6b, 0x53, 0x35);     // plaine ash (caillouteux)
fillTile(2, 0x5c, 0x4a, 0x2a); speckle(2, 0x3c, 0x2a, 0x1a);     // gorges rock
fillTile(3, 0x3d, 0x2b, 0x1a);                                   // campement dirt
fillTile(4, 0x7a, 0x5c, 0x35);                                   // wall (base)
for (let x = 0; x < TILE; x++) { setp(4 * TILE + x, 10, 0x4a, 0x3c, 0x25); setp(4 * TILE + x, 21, 0x4a, 0x3c, 0x25); }
for (let y = 0; y < 10; y++) setp(4 * TILE + 16, y, 0x4a, 0x3c, 0x25);
for (let y = 11; y < 21; y++) setp(4 * TILE + 8, y, 0x4a, 0x3c, 0x25);
fillTile(5, 0x1a, 0x4a, 0x6b);                                   // water
fillTile(6, 0xd4, 0xa9, 0x6a);                                   // hub path
for (let y = 0; y < TILE; y++) for (let x = 0; x < TILE; x++)     // decor rock (fond transparent)
  if (Math.hypot(x - 16, y - 17) < 10) setp(7 * TILE + x, y, 0x88, 0x88, 0x88);
for (let y = 6; y < 28; y++) { setp(8 * TILE + 15, y, 0x4a, 0x6b, 0x2a); setp(8 * TILE + 16, y, 0x4a, 0x6b, 0x2a); }
for (let x = 10; x < 16; x++) setp(8 * TILE + x, 14, 0x4a, 0x6b, 0x2a);
for (let x = 17; x < 23; x++) setp(8 * TILE + x, 18, 0x4a, 0x6b, 0x2a);

// ── world.json (Tiled) — données en tableaux JSON (format le + fiable) ──
const cell = (fn) => { const a = []; for (let y = 0; y < TILES_Y; y++) for (let x = 0; x < TILES_X; x++) a.push(fn(x, y)); return a; };
const layer = (id, name, data) => ({ id, name, type: 'tilelayer', x: 0, y: 0, width: TILES_X, height: TILES_Y, opacity: 1, visible: true, data });
const world = {
  type: 'map', version: 1.1, tiledversion: '1.10.2', orientation: 'orthogonal', renderorder: 'right-down',
  width: TILES_X, height: TILES_Y, tilewidth: TILE, tileheight: TILE, infinite: false, nextlayerid: 4, nextobjectid: 1,
  tilesets: [{ columns: TILESET_COUNT, firstgid: 1, image: 'world_tileset.png', imagewidth: W, imageheight: H, margin: 0, spacing: 0, tilewidth: TILE, tileheight: TILE, tilecount: TILESET_COUNT, name: 'world_tileset' }],
  layers: [
    layer(1, 'Ground', cell((x, y) => groundGidAt(x, y))),
    layer(2, 'Decor', cell((x, y) => decorGidAt(x, y))),
    layer(3, 'Collision', cell((x, y) => (isCollision(x, y) ? GID.WALL : 0))),
  ],
};

// ── Écriture ───────────────────────────────────────────────────
mkdirSync(new URL('../assets/tilemaps/', import.meta.url), { recursive: true });
writeFileSync(new URL('../assets/tilemaps/world_tileset.png', import.meta.url), encodePNG(W, H, px));
writeFileSync(new URL('../assets/tilemaps/world.json', import.meta.url), JSON.stringify(world));
console.log(`✅ world_tileset.png (${W}x${H}, ${TILESET_COUNT} tuiles) + world.json (${TILES_X}x${TILES_Y}, 3 layers) générés`);
