// tests/test_combat.js — Sands of Aetheria | Tests unitaires CombatSystem (étape 14)
// Run: node tests/test_combat.js
import assert from 'node:assert';
import * as C from '../src/systems/CombatSystem.js';

let passed = 0, failed = 0;
const test = (n, f) => { try { f(); passed++; console.log(`  ✅ ${n}`); } catch (e) { failed++; console.log(`  ❌ ${n}\n     → ${e.message}`); } };
console.log('🧪 test_combat — CombatSystem (formules pures)');

test('damageFormula : attack × (1 + melee/200)', () => {
  assert.equal(C.damageFormula(10, 0), 10);
  assert.equal(C.damageFormula(10, 100), 15);
  assert.equal(C.damageFormula(20, 50), 25);
});
test('computeDamage : léger = base arrondie', () => assert.equal(C.computeDamage({ attack: 10 }), 10));
test('computeDamage : lourd ×2.5', () => assert.equal(C.computeDamage({ attack: 10, heavy: true }), 25));
test('computeDamage : critique ×1.5', () => assert.equal(C.computeDamage({ attack: 10, crit: true }), 15));
test('computeDamage : cumul mêlée+lourd+crit', () => {
  assert.equal(C.computeDamage({ attack: 10, meleeSkill: 100, heavy: true, crit: true }), 56);  // 10×1.5×2.5×1.5=56.25
});
test('computeDamage : blessure bras HP<15% → ×0.5', () => {
  assert.equal(C.computeDamage({ attack: 10, hpRatio: 0.10 }), 5);
  assert.equal(C.computeDamage({ attack: 10, hpRatio: 0.50 }), 10);
});
test('computeDamage : minimum 1 dégât', () => assert.ok(C.computeDamage({ attack: 0 }) >= 1));
test('playerAttackMultiplier : <15% HP → 0.5, sinon 1', () => {
  assert.equal(C.playerAttackMultiplier(0.10), 0.5);
  assert.equal(C.playerAttackMultiplier(0.15), 1);
  assert.equal(C.playerAttackMultiplier(0.50), 1);
});
test('isCrit : proba 0 → jamais, 1 → toujours', () => {
  for (let i = 0; i < 20; i++) { assert.equal(C.isCrit(0), false); assert.equal(C.isCrit(1), true); }
});
test('resolveParry : sans parade → dégâts pleins', () => {
  assert.deepEqual(C.resolveParry(20, false, 0), { damage: 20, countered: false });
});
test('resolveParry : parade -60%, contre si <200ms', () => {
  assert.deepEqual(C.resolveParry(20, true, 500), { damage: 8, countered: false });
  assert.deepEqual(C.resolveParry(20, true, 100), { damage: 8, countered: true });
});
test('Constantes de combat (GDD §4.2)', () => {
  assert.equal(C.LIGHT_COOLDOWN, 400); assert.equal(C.HEAVY_MULT, 2.5);
  assert.equal(C.CRIT_MULT, 1.5); assert.equal(C.PARRY_REDUCTION, 0.4); assert.equal(C.DODGE_COOLDOWN, 1200);
});

console.log(`\n📊 test_combat : ${passed} passés, ${failed} échoués`);
process.exit(failed ? 1 : 0);
