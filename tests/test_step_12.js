// tests/test_step_12.js — Sands of Aetheria | Validation Étape 12 (Sauvegarde/Chargement/Pause)
// Run: node tests/test_step_12.js
import assert from 'node:assert';
import { installMocks, createSceneHarness } from './_mocks.js';
import { SaveSystem, SAVE_KEY } from '../src/systems/SaveSystem.js';
import { EventBus } from '../src/utils/EventBus.js';

installMocks();
// localStorage mocké (in-memory) — client-only, pas de backend
const mkStore = () => { const s = {}; return { getItem: k => s[k] ?? null, setItem: (k, v) => (s[k] = v), removeItem: k => delete s[k], _s: s }; };

let passed = 0, failed = 0;
const test = (n, f) => { try { f(); passed++; console.log(`  ✅ ${n}`); } catch (e) { failed++; console.log(`  ❌ ${n}\n     → ${e.message}`); } };
console.log('🧪 ÉTAPE 12 — Sauvegarde / Chargement / Pause');
const { GameScene } = await import('../src/scenes/GameScene.js');
const { HUD } = await import('../src/ui/HUD.js');
const newGame = () => { EventBus.reset(); const s = createSceneHarness(GameScene); s.create(); return s; };

// SaveSystem — persistance pure
test('SaveSystem : save écrit dans localStorage (JSON valide)', () => {
  globalThis.localStorage = mkStore();
  SaveSystem.save({ hp: 50 }, { killedEnemies: new Set(['b1']) });
  const raw = globalThis.localStorage.getItem(SAVE_KEY);
  assert.ok(JSON.parse(raw) !== null); assert.ok(SaveSystem.hasSave());
});
test('SaveSystem : load restaure les Sets (killedEnemies)', () => {
  globalThis.localStorage = mkStore();
  SaveSystem.save({ hp: 50 }, { killedEnemies: new Set(['b1', 'r2']), fogOfWar: new Set(['hub']) });
  const d = SaveSystem.load();
  assert.ok(d.world.killedEnemies instanceof Set && d.world.killedEnemies.has('r2'));
});
test('SaveSystem : deleteSave / hasSave', () => {
  globalThis.localStorage = mkStore();
  SaveSystem.save({ hp: 1 }, {}); assert.ok(SaveSystem.hasSave());
  SaveSystem.deleteSave(); assert.ok(!SaveSystem.hasSave());
});
// Round-trip joueur
test('Sauvegarde → chargement restaure HP/or/inventaire/skills/position', () => {
  globalThis.localStorage = mkStore();
  const s1 = newGame();
  s1.player.hp = 42; s1.player.inventory.gold = 99; s1.player.inventory.addItem('potion', 2);
  s1.player.skills.levels.melee = 33; s1.player.sprite.setPosition(500, 600);
  s1.doSave();
  const s2 = newGame(); s2.restoreSave(SaveSystem.load());
  assert.equal(s2.player.hp, 42); assert.equal(s2.player.inventory.gold, 99);
  assert.ok(s2.player.inventory.hasItem('potion', 2)); assert.equal(s2.player.skills.levels.melee, 33);
  assert.equal(s2.player.sprite.x, 500);
});
// État monde persistant
test('Ennemis tués restent morts après rechargement', () => {
  globalThis.localStorage = mkStore();
  const s1 = newGame();
  const killedId = s1.enemies[0].id;
  s1.enemies[0].die();                 // → onEnemyDead → worldState.killedEnemies
  s1.doSave();
  const s2 = createSceneHarness(GameScene); s2.init({ save: SaveSystem.load() }); s2.create();
  assert.ok(!s2.enemies.some(e => e.id === killedId), 'ennemi tué a respawn');
});
// Auto-save
test('Auto-save : doSave horodate la sauvegarde', () => {
  globalThis.localStorage = mkStore();
  const s = newGame(); s.doSave();
  assert.ok(JSON.parse(globalThis.localStorage.getItem(SAVE_KEY)).timestamp > 0);
});
// Menu pause
test('HUD : menu pause Échap (toggle)', () => {
  EventBus.reset(); const s = createSceneHarness(GameScene); s.create();
  const hud = new HUD(s); hud.create();
  hud.togglePause(); assert.equal(hud.paused, true); assert.ok(hud.pauseObjects.length > 0);
  hud.togglePause(); assert.equal(hud.paused, false);
});

console.log(`\n📊 Résultat: ${passed} passés, ${failed} échoués`);
process.exit(failed ? 1 : 0);
