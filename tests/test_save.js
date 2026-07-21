// tests/test_save.js — Sands of Aetheria | Tests unitaires SaveSystem (étape 14)
// Run: node tests/test_save.js
import assert from 'node:assert';
import { SaveSystem, SAVE_KEY, SAVE_VERSION } from '../src/systems/SaveSystem.js';

const mkStore = () => { const s = {}; return { getItem: k => s[k] ?? null, setItem: (k, v) => (s[k] = v), removeItem: k => delete s[k] }; };
let passed = 0, failed = 0;
const test = (n, f) => { try { f(); passed++; console.log(`  ✅ ${n}`); } catch (e) { failed++; console.log(`  ❌ ${n}\n     → ${e.message}`); } };
console.log('🧪 test_save — SaveSystem (sérialisation round-trip)');

test('save écrit un JSON valide horodaté + version', () => {
  globalThis.localStorage = mkStore();
  SaveSystem.save({ hp: 50 }, { killedEnemies: new Set(['b1']) });
  const d = JSON.parse(globalThis.localStorage.getItem(SAVE_KEY));
  assert.equal(d.version, SAVE_VERSION); assert.ok(d.timestamp > 0);
});
test('load round-trip : Sets restaurés (killedEnemies/openedChests/fogOfWar)', () => {
  globalThis.localStorage = mkStore();
  SaveSystem.save({ hp: 1 }, { killedEnemies: new Set(['b1', 'r2']), openedChests: new Set(['c1']), fogOfWar: new Set(['hub', 'plaine']) });
  const d = SaveSystem.load();
  assert.ok(d.world.killedEnemies instanceof Set && d.world.killedEnemies.has('r2'));
  assert.ok(d.world.openedChests.has('c1')); assert.ok(d.world.fogOfWar.has('plaine'));
});
test('player round-trip intégral', () => {
  globalThis.localStorage = mkStore();
  const player = { position: { x: 100, y: 200 }, hp: 42, inventory: { gold: 99, items: [], equipped: {} }, skills: { melee: 33 } };
  SaveSystem.save(player, {});
  assert.deepEqual(SaveSystem.load().player, player);
});
test('hasSave / deleteSave', () => {
  globalThis.localStorage = mkStore();
  assert.ok(!SaveSystem.hasSave());
  SaveSystem.save({ hp: 1 }, {}); assert.ok(SaveSystem.hasSave());
  SaveSystem.deleteSave(); assert.ok(!SaveSystem.hasSave());
});
test('load sans sauvegarde / corrompue → null', () => {
  globalThis.localStorage = mkStore();
  assert.equal(SaveSystem.load(), null);
  globalThis.localStorage.setItem(SAVE_KEY, '{corrompu');
  assert.equal(SaveSystem.load(), null);
});
test('getSaveInfo : timestamp + version', () => {
  globalThis.localStorage = mkStore();
  SaveSystem.save({ hp: 1 }, {});
  const info = SaveSystem.getSaveInfo();
  assert.ok(info.timestamp > 0); assert.equal(info.version, SAVE_VERSION);
});
test('taille sauvegarde < 50KB (état réaliste chargé)', () => {
  globalThis.localStorage = mkStore();
  const items = Array.from({ length: 24 }, (_, i) => ({ id: `item_${i}`, qty: 99 }));
  const skills = { melee: 80, athletics: 60, endurance: 50, stealth: 20, smithing: 30, mining: 40, trade: 25 };
  SaveSystem.save(
    { position: { x: 1280, y: 1280 }, hp: 100, hpMax: 100, stamina: 80,
      inventory: { gold: 9999, items, equipped: { weapon: 'steel_sword', armor: 'iron_armor', accessory: null }, maxSlots: 24 }, skills },
    { dayCount: 12, timeOfDay: 0.5, killedEnemies: new Set(Array.from({ length: 30 }, (_, i) => `e${i}`)),
      openedChests: new Set(['c1', 'c2']), fogOfWar: new Set(['hub', 'plaine', 'gorges', 'campement']),
      factions: { oasis: 80, raiders: 0, nomads: 50 } });
  const size = Buffer.byteLength(globalThis.localStorage.getItem(SAVE_KEY), 'utf8');
  assert.ok(size < 50 * 1024, `sauvegarde ${size} o ≥ 50KB`);
});

console.log(`\n📊 test_save : ${passed} passés, ${failed} échoués`);
process.exit(failed ? 1 : 0);
