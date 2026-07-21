// tests/test_skills.js — Sands of Aetheria | Tests unitaires SkillSystem (étape 14)
// Run: node tests/test_skills.js
import assert from 'node:assert';
import { installMocks } from './_mocks.js';
import { SkillSystem, SKILLS, BASE_GAIN, MILESTONES } from '../src/systems/SkillSystem.js';
import { EventBus } from '../src/utils/EventBus.js';

installMocks();
let passed = 0, failed = 0;
const test = (n, f) => { try { f(); passed++; console.log(`  ✅ ${n}`); } catch (e) { failed++; console.log(`  ❌ ${n}\n     → ${e.message}`); } };
console.log('🧪 test_skills — SkillSystem (learn by doing)');

test('7 compétences initialisées à 0', () => {
  const s = new SkillSystem();
  assert.equal(Object.keys(s.levels).length, 7);
  assert.ok(Object.values(s.levels).every(v => v === 0));
});
test('gainFor : BASE_GAIN × (1 − level/150), décroissant', () => {
  assert.equal(SkillSystem.gainFor(0), BASE_GAIN);
  assert.ok(SkillSystem.gainFor(50) < SkillSystem.gainFor(0));
  assert.ok(SkillSystem.gainFor(90) < SkillSystem.gainFor(50));
});
test('register + update throttlé à 500ms', () => {
  const s = new SkillSystem(); s.register('melee', 1);
  s.update(300); assert.equal(s.levels.melee, 0);
  s.update(300); assert.ok(s.levels.melee > 0);   // cumul 600ms ≥ 500
});
test('milestone émis au franchissement de 25', () => {
  EventBus.reset(); const s = new SkillSystem(); const ms = [];
  EventBus.on('skill:milestone', d => ms.push(d));
  s.levels.melee = 24.95; s.register('melee', 1); s.update(500);
  assert.ok(ms.some(m => m.skill === 'melee' && m.level === 25));
});
test('milestones = [25, 50, 75, 100]', () => assert.deepEqual(MILESTONES, [25, 50, 75, 100]));
test('niveau plafonné à 100', () => {
  const s = new SkillSystem(); s.levels.melee = 99.99; s.register('melee', 100); s.update(500);
  assert.equal(s.levels.melee, 100);
});
test('skills:updated émis après un gain', () => {
  EventBus.reset(); const s = new SkillSystem(); let updated = false;
  EventBus.on('skills:updated', () => updated = true);
  s.register('mining', 1); s.update(500);
  assert.ok(updated);
});
test('snapshot : niveaux + noms', () => {
  const s = new SkillSystem(); s.levels.melee = 12;
  const snap = s.snapshot();
  assert.equal(snap.melee.level, 12); assert.equal(snap.melee.name, SKILLS.melee.name);
});

console.log(`\n📊 test_skills : ${passed} passés, ${failed} échoués`);
process.exit(failed ? 1 : 0);
