// tests/test_step_2.js — Sands of Aetheria | Validation Étape 2 (Scènes & Preloader)
// Run: node tests/test_step_2.js
import assert from 'node:assert';
import { installMocks, createSceneHarness } from './_mocks.js';
import { SCENES, SAVE_KEY } from '../src/config.js';

installMocks();
let passed = 0, failed = 0;
const test = (n, f) => { try { f(); passed++; console.log(`  ✅ ${n}`); } catch (e) { failed++; console.log(`  ❌ ${n}\n     → ${e.message}`); } };
console.log('🧪 ÉTAPE 2 — Scènes & Preloader');

// Import dynamique (après installMocks) des modules liés à Phaser
const mods = await Promise.all([
  import('../src/utils/ObjectPool.js'), import('../src/utils/PlaceholderFactory.js'),
  import('../src/scenes/PreloadScene.js'), import('../src/scenes/MenuScene.js'),
  import('../src/scenes/GameScene.js'), import('../src/scenes/UIScene.js'),
]).catch(e => { console.log('  ❌ import → ' + e.message); process.exit(1); });
const [{ ObjectPool }, { PlaceholderFactory }, { PreloadScene }, { MenuScene }, { GameScene }, { UIScene }] = mods;

// ObjectPool — logique pure
test('ObjectPool acquire crée via factory', () => {
  let n = 0; const p = new ObjectPool(() => ({ id: ++n }), () => {});
  assert.equal(p.acquire().id, 1); assert.equal(p.activeCount, 1);
});
test('ObjectPool release puis réutilise le même objet', () => {
  const p = new ObjectPool(() => ({}), () => {}); const a = p.acquire(); p.release(a);
  assert.equal(p.availableCount, 1); assert.equal(p.acquire(), a);
});
test('ObjectPool reset appelé à l\'acquire', () => {
  const p = new ObjectPool(() => ({ v: 0 }), (o) => { o.v = 9; }); assert.equal(p.acquire().v, 9);
});
test('ObjectPool saturé au-delà de maxSize → null', () => {
  const p = new ObjectPool(() => ({}), () => {}, 2); p.acquire(); p.acquire(); assert.equal(p.acquire(), null);
});
test('ObjectPool prewarm + releaseAll', () => {
  const p = new ObjectPool(() => ({}), () => {}, 5); p.prewarm(3); assert.equal(p.availableCount, 3);
  p.acquire(); p.releaseAll(); assert.equal(p.activeCount, 0);
});
// PlaceholderFactory — génère les textures placeholder
test('PlaceholderFactory.createAll génère les textures clés', () => {
  const s = createSceneHarness(GameScene); PlaceholderFactory.createAll(s);
  for (const k of ['player', 'enemy_bandit', 'npc_merchant', 'tile_hub_sand', 'resource_stone', 'item_potion'])
    assert.ok(s._textures[k], `texture ${k} manquante`);
});
// Clés de scènes + flux Boot→Preload→Menu→Game(+UI)
test('Scènes : clés correctes', () => {
  assert.equal(new PreloadScene().key, SCENES.PRELOAD); assert.equal(new MenuScene().key, SCENES.MENU);
  assert.equal(new GameScene().key, SCENES.GAME); assert.equal(new UIScene().key, SCENES.UI);
});
test('PreloadScene transite vers MenuScene', () => {
  const s = createSceneHarness(PreloadScene); s.create(); s.flushDelayed();
  assert.ok(s._calls.start.includes(SCENES.MENU));
});
test('MenuScene : New Game lance GameScene', () => {
  globalThis.localStorage = { getItem: () => null };
  const s = createSceneHarness(MenuScene); s.create(); s.buttons.newGame.emit('pointerdown');
  assert.ok(s._calls.start.includes(SCENES.GAME));
});
test('MenuScene : Load désactivé si aucune sauvegarde', () => {
  globalThis.localStorage = { getItem: () => null };
  const s = createSceneHarness(MenuScene); s.create(); assert.equal(s.loadEnabled, false);
});
test('MenuScene : Load activé si sauvegarde présente', () => {
  globalThis.localStorage = { getItem: (k) => (k === SAVE_KEY ? '{}' : null) };
  const s = createSceneHarness(MenuScene); s.create(); assert.equal(s.loadEnabled, true);
});
test('GameScene lance UIScene en parallèle', () => {
  const s = createSceneHarness(GameScene); s.create(); assert.ok(s._calls.launch.includes(SCENES.UI));
});

console.log(`\n📊 Résultat: ${passed} passés, ${failed} échoués`);
process.exit(failed ? 1 : 0);
