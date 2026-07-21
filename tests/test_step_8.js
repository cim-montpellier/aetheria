// tests/test_step_8.js — Sands of Aetheria | Validation Étape 8 (Progression "Learn by Doing")
// Run: node tests/test_step_8.js
import assert from 'node:assert';
import { installMocks, createSceneHarness, createMockScene } from './_mocks.js';
import { SkillSystem, SKILLS } from '../src/systems/SkillSystem.js';
import { SkillsUI } from '../src/ui/SkillsUI.js';
import { Player } from '../src/entities/Player.js';
import { EventBus } from '../src/utils/EventBus.js';

installMocks();
let passed = 0, failed = 0;
const test = (n, f) => { try { f(); passed++; console.log(`  ✅ ${n}`); } catch (e) { failed++; console.log(`  ❌ ${n}\n     → ${e.message}`); } };
console.log('🧪 ÉTAPE 8 — Progression "Learn by Doing"');
const mkPlayer = () => { const s = createMockScene(); return { s, p: new Player(s, 100, 100) }; };

// Formule & mécanique de gain (logique pure)
test('Frapper des ennemis augmente la Mêlée', () => {
  const ss = new SkillSystem(); ss.register('melee', 1); ss.update(500);
  assert.ok(ss.levels.melee > 0);
});
test('Courir augmente l\'Athlétisme', () => {
  const ss = new SkillSystem(); ss.register('athletics', 5); ss.update(500);
  assert.ok(ss.levels.athletics > 0);
});
test('Gains throttlés : rien avant 500ms, appliqué à 500ms', () => {
  const ss = new SkillSystem(); ss.register('melee', 1);
  ss.update(300); assert.equal(ss.levels.melee, 0);    // < 500ms
  ss.update(300); assert.ok(ss.levels.melee > 0);      // cumul 600ms ≥ 500
});
test('Formule diminishing : le gain diminue avec le niveau', () => {
  const g0 = SkillSystem.gainFor(0), g50 = SkillSystem.gainFor(50), g90 = SkillSystem.gainFor(90);
  assert.equal(g0, 0.15);                              // BASE_GAIN au niveau 0
  assert.ok(g50 < g0 && g90 < g50, 'gain non décroissant');
  assert.ok(g90 < 0.1, 'gain encore élevé à haut niveau');
});
test('Niveau plafonné à 100', () => {
  const ss = new SkillSystem(); ss.levels.melee = 99.99; ss.register('melee', 100); ss.update(500);
  assert.equal(ss.levels.melee, 100);
});
// Milestones
test('Milestone 25 → emit skill:milestone {skill, level:25}', () => {
  EventBus.reset(); const ss = new SkillSystem(); const ms = [];
  EventBus.on('skill:milestone', (d) => ms.push(d));
  ss.levels.melee = 24.95; ss.register('melee', 1); ss.update(500);
  assert.ok(ms.some(m => m.skill === 'melee' && m.level === 25));
});
test('Milestone 50 Mêlée → critChance 10% (bonus passif)', () => {
  const { p } = mkPlayer();
  p.skills.levels.melee = 49.95; p.skills.register('melee', 1); p.skills.update(500);
  assert.equal(p.critChance, 0.10);
});
// Hook joueur
test('Player : frapper enregistre la Mêlée (hook learn-by-doing)', () => {
  const { p } = mkPlayer(); p.stamina = 80; p.lightAttack(); p.skills.update(500);
  assert.ok(p.skills.levels.melee > 0);
});
// UI compétences
test('SkillsUI : fenêtre des 7 compétences', () => {
  const ui = new SkillsUI(createMockScene()); const snap = new SkillSystem().snapshot();
  ui.open(snap);
  assert.ok(ui.visible && Object.keys(snap).length === 7 && ui.objects.length >= 7);
  ui.close(); assert.equal(ui.objects.length, 0);
});
// UIScene : notification skill-up (style Skyrim)
const { UIScene } = await import('../src/scenes/UIScene.js').catch(e => { console.log('  ❌ import → ' + e.message); process.exit(1); });
test('UIScene : notification skill-up au milestone (timer 4s)', () => {
  EventBus.reset(); const s = createSceneHarness(UIScene); s.create();
  const before = s._delayed.length;
  EventBus.emit('skill:milestone', { skill: 'melee', level: 25, name: 'Mêlée' });
  assert.ok(s._delayed.length > before, 'notification non planifiée');
});
test('UIScene : SkillsUI créée + snapshot via skills:updated', () => {
  EventBus.reset(); const s = createSceneHarness(UIScene); s.create();
  assert.ok(s.skillsUI);
  EventBus.emit('skills:updated', { melee: { level: 12, name: 'Mêlée', title: 'Guerrier' } });
  assert.equal(s.skillsSnapshot.melee.level, 12);
});

console.log(`\n📊 Résultat: ${passed} passés, ${failed} échoués`);
process.exit(failed ? 1 : 0);
