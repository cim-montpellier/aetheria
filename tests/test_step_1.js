// tests/test_step_1.js — Sands of Aetheria
// Rôle : Validation Étape 1 (Scaffolding & Game Loop) — TDD
// Run  : node tests/test_step_1.js
import assert from 'node:assert';
import { existsSync, readFileSync } from 'node:fs';

const ROOT = new URL('..', import.meta.url).pathname;
let passed = 0, failed = 0;
const test = (name, fn) => {
  try { fn(); passed++; console.log(`  ✅ ${name}`); }
  catch (e) { failed++; console.log(`  ❌ ${name}\n     → ${e.message}`); }
};

console.log('🧪 ÉTAPE 1 — Scaffolding & Game Loop');

// 1. Existence des fichiers livrables
const FILES = ['index.html', 'src/main.js', 'src/config.js',
  'src/utils/EventBus.js', 'src/scenes/BootScene.js'];
for (const f of FILES)
  test(`fichier existe: ${f}`, () => assert.ok(existsSync(ROOT + f), `${f} manquant`));

// 2. config.js — module pur, constantes globales
const cfg = await import('../src/config.js').catch(e => ({ __err: e }));
test('config.js importable (module pur, sans Phaser)', () => assert.ok(!cfg.__err, cfg.__err?.message));
test('GAME 960x540 + fond #1a1208', () => {
  assert.equal(cfg.GAME_WIDTH, 960); assert.equal(cfg.GAME_HEIGHT, 540);
  assert.equal(cfg.BG_COLOR, '#1a1208');
});
test('Monde 2560x2560, tuile 32px', () => {
  assert.equal(cfg.WORLD_WIDTH, 2560); assert.equal(cfg.WORLD_HEIGHT, 2560);
  assert.equal(cfg.TILE_SIZE, 32);
});
test('Vitesses joueur marche=120 / course=200', () => {
  assert.equal(cfg.PLAYER_WALK_SPEED, 120); assert.equal(cfg.PLAYER_RUN_SPEED, 200);
});
test('HP_MAX=100, STAMINA_MAX=80', () => {
  assert.equal(cfg.PLAYER_HP_MAX, 100); assert.equal(cfg.PLAYER_STAMINA_MAX, 80);
});
test('IA ranges DETECT=150 ATTACK=45 DISENGAGE=220', () => {
  assert.equal(cfg.DETECT_RANGE, 150); assert.equal(cfg.ATTACK_RANGE, 45);
  assert.equal(cfg.DISENGAGE_DIST, 220);
});

// 3. EventBus.js — découplage inter-systèmes (mock Phaser injecté, lazy)
globalThis.Phaser = { Events: { EventEmitter: class {
  #m = new Map();
  on(e, f, c) { if (!this.#m.has(e)) this.#m.set(e, []); this.#m.get(e).push({ f, c }); }
  emit(e, d) { (this.#m.get(e) || []).forEach(({ f, c }) => f.call(c, d)); }
  off(e, f) { this.#m.set(e, (this.#m.get(e) || []).filter(x => x.f !== f)); }
  removeAllListeners() { this.#m.clear(); }
} } };
const bus = await import('../src/utils/EventBus.js').catch(e => ({ __err: e }));
test('EventBus.js importable (Phaser lazy → testable headless)', () => assert.ok(!bus.__err && bus.EventBus, bus.__err?.message));
test('EventBus emit/on découplé', () => {
  let got = null; bus.EventBus.on('t:ping', d => got = d);
  bus.EventBus.emit('t:ping', { v: 7 }); assert.deepEqual(got, { v: 7 });
});
test('EventBus off retire le listener', () => {
  let n = 0; const h = () => n++;
  bus.EventBus.on('t:x', h); bus.EventBus.off('t:x', h);
  bus.EventBus.emit('t:x'); assert.equal(n, 0);
});

// 4. index.html — CDN + module + fond
const html = existsSync(ROOT + 'index.html') ? readFileSync(ROOT + 'index.html', 'utf8') : '';
test('index.html: CDN Phaser 4.1.0', () => assert.match(html, /phaser@4\.1\.0\/dist\/phaser\.min\.js/));
test('index.html: CDN Howler 2.2.4', () => assert.match(html, /howler\/2\.2\.4\/howler\.min\.js/));
test('index.html: <script type=module>', () => assert.match(html, /type=["']module["']/));
test('index.html: src/main.js chargé', () => assert.match(html, /src\/main\.js/));
test('index.html: fond #1a1208', () => assert.match(html, /#1a1208/i));

console.log(`\n📊 Résultat: ${passed} passés, ${failed} échoués`);
process.exit(failed ? 1 : 0);
