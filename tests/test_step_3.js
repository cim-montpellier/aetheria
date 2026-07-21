// tests/test_step_3.js — Sands of Aetheria | Validation Étape 3 (Tilemap & Monde)
// Run: node tests/test_step_3.js
import assert from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { installMocks, createSceneHarness } from './_mocks.js';
import * as WZ from '../src/data/worldZones.js';
import { GID } from '../src/data/worldZones.js';

installMocks();
let passed = 0, failed = 0;
const test = (n, f) => { try { f(); passed++; console.log(`  ✅ ${n}`); } catch (e) { failed++; console.log(`  ❌ ${n}\n     → ${e.message}`); } };
console.log('🧪 ÉTAPE 3 — Tilemap & Monde');
const ROOT = new URL('..', import.meta.url).pathname;
const WJSON = ROOT + 'assets/tilemaps/world.json';
const WPNG = ROOT + 'assets/tilemaps/world_tileset.png';

// worldZones — logique pure du monde
test('Monde 80x80, tuile 32', () => { assert.equal(WZ.TILES_X, 80); assert.equal(WZ.TILES_Y, 80); assert.equal(WZ.TILE, 32); });
test('Zones: hub / plaine / gorges / campement', () => {
  assert.equal(WZ.zoneAt(10, 10), 'hub'); assert.equal(WZ.zoneAt(30, 30), 'plaine');
  assert.equal(WZ.zoneAt(70, 10), 'gorges'); assert.equal(WZ.zoneAt(70, 60), 'campement');
});
test('groundGidAt: oasis=eau, sinon sol de zone', () => {
  assert.equal(WZ.groundGidAt(9, 9), GID.WATER); assert.equal(WZ.groundGidAt(10, 15), GID.HUB_SAND);
  assert.equal(WZ.groundGidAt(30, 30), GID.PLAINE_ASH); assert.equal(WZ.groundGidAt(70, 10), GID.GORGE_ROCK);
  assert.equal(WZ.groundGidAt(70, 60), GID.CAMP_DIRT);
});
test('Collision: bordure du monde solide', () => { assert.equal(WZ.isCollision(0, 5), true); assert.equal(WZ.isCollision(79, 40), true); });
test('Collision: intérieur du Hub dégagé', () => { assert.equal(WZ.isCollision(10, 15), false); });
test('Collision: palissade Campement (mur + entrée)', () => {
  const c = WZ.ZONES.campement;
  assert.equal(WZ.isCollision(c.x0 + 1, c.y1 - 1), true);  // bord de palissade
  assert.equal(WZ.isCollision(69, c.y0 + 1), false);        // entrée (gate x68-71)
});

// world.json — asset généré
test('world.json existe + structure Tiled (3 layers)', () => {
  assert.ok(existsSync(WJSON), 'world.json manquant');
  const m = JSON.parse(readFileSync(WJSON, 'utf8'));
  assert.equal(m.width, 80); assert.equal(m.height, 80); assert.equal(m.tilewidth, 32);
  assert.deepEqual(m.layers.map(l => l.name), ['Ground', 'Decor', 'Collision']);
  assert.equal(m.tilesets[0].image, 'world_tileset.png'); assert.equal(m.tilesets[0].tilecount, 9);
});
test('world.json: Ground = 6400 tuiles, GID dans [1,9]', () => {
  const g = JSON.parse(readFileSync(WJSON, 'utf8')).layers.find(l => l.name === 'Ground').data;
  assert.equal(g.length, 6400); assert.ok(g.every(v => v >= 1 && v <= 9), 'GID hors bornes');
});

// world_tileset.png — asset généré
test('world_tileset.png: PNG valide 288x32 (9 tuiles)', () => {
  assert.ok(existsSync(WPNG), 'world_tileset.png manquant');
  const b = readFileSync(WPNG);
  assert.deepEqual([...b.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], 'signature PNG invalide');
  assert.equal(b.readUInt32BE(16), 288); assert.equal(b.readUInt32BE(20), 32);
});

// Scènes — intégration tilemap
const [{ PreloadScene }, { GameScene }] = await Promise.all([
  import('../src/scenes/PreloadScene.js'), import('../src/scenes/GameScene.js'),
]).catch(e => { console.log('  ❌ import scènes → ' + e.message); process.exit(1); });
test('PreloadScene.preload charge world + tileset', () => {
  const s = createSceneHarness(PreloadScene); s.preload();
  const keys = s.load._queue.map(q => q.key);
  assert.ok(keys.includes('world'), 'tilemap world non chargée');
  assert.ok(keys.includes('world_tileset'), 'tileset non chargé');
});
test('GameScene.create: tilemap 3 layers + collision + bounds', () => {
  const s = createSceneHarness(GameScene); s.create();
  assert.equal(s._rec.tilemapKey, 'world');
  assert.deepEqual(s._rec.map._layers.map(l => l.name), ['Ground', 'Decor', 'Collision']);
  assert.ok(s._rec.map._layers.find(l => l.name === 'Collision')._collExcl, 'collision non activée');
  assert.deepEqual(s._rec.worldBounds, [0, 0, 2560, 2560]);
  assert.deepEqual(s._rec.camBounds, [0, 0, 2560, 2560]);
});

console.log(`\n📊 Résultat: ${passed} passés, ${failed} échoués`);
process.exit(failed ? 1 : 0);
