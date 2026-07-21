// tests/test_step_5.js — Sands of Aetheria | Validation Étape 5 (PNJ, Ennemis & IA)
// Run: node tests/test_step_5.js
import assert from 'node:assert';
import { installMocks, createSceneHarness, createMockScene } from './_mocks.js';
import { StateMachine } from '../src/systems/AIManager.js';
import { Enemy } from '../src/entities/Enemy.js';
import { NPC } from '../src/entities/NPC.js';
import { ENEMY_TEMPLATES } from '../src/data/enemies.js';
import { NPC_TEMPLATES } from '../src/data/npcs.js';
import { EventBus } from '../src/utils/EventBus.js';

installMocks();
let passed = 0, failed = 0;
const test = (n, f) => { try { f(); passed++; console.log(`  ✅ ${n}`); } catch (e) { failed++; console.log(`  ❌ ${n}\n     → ${e.message}`); } };
console.log('🧪 ÉTAPE 5 — PNJ, Ennemis & IA');
const mkEnemy = (ex, ey, px, py, tpl = 'bandit') => {
  const s = createMockScene(); s.player = { sprite: { x: px, y: py } };
  return { s, e: new Enemy(s, ex, ey, ENEMY_TEMPLATES[tpl]) };
};
const mkNPC = (tpl, x, y, px, py) => {
  const s = createMockScene(); s.player = { sprite: { x: px, y: py } };
  return { s, n: new NPC(s, x, y, NPC_TEMPLATES[tpl]) };
};

// StateMachine (logique pure — TECH_SPEC §5.1)
test('StateMachine : transition onEnter/onExit + stateTime + no-op', () => {
  const log = []; const sm = new StateMachine({});
  sm.addState('A', { onEnter: () => log.push('eA'), onExit: () => log.push('xA'), onUpdate: () => {} });
  sm.addState('B', { onEnter: () => log.push('eB'), onUpdate: () => {} });
  sm.transition('A'); sm.update(100); assert.equal(sm.stateTime, 100);
  sm.transition('B'); assert.deepEqual(log, ['eA', 'xA', 'eB']); assert.equal(sm.stateTime, 0);
  sm.transition('B'); assert.equal(log.length, 3);
});

// Transitions ennemi (Steering seek/flee)
test('Enemy IDLE → CHASE si joueur < 150px', () => {
  const { e } = mkEnemy(1000, 1000, 1100, 1000); assert.equal(e.ai.currentState, 'IDLE');
  e.update(16); assert.equal(e.ai.currentState, 'CHASE');
});
test('Enemy CHASE → ATTACK si joueur < 45px', () => {
  const { e } = mkEnemy(1000, 1000, 1030, 1000); e.update(16); e.update(16);
  assert.equal(e.ai.currentState, 'ATTACK');
});
test('Enemy CHASE → IDLE si joueur > 220px', () => {
  const { s, e } = mkEnemy(1000, 1000, 1100, 1000); e.update(16); assert.equal(e.ai.currentState, 'CHASE');
  s.player.sprite.x = 1300; e.update(16); assert.equal(e.ai.currentState, 'IDLE');
});
test('Enemy → FLEE si HP < 20%', () => {
  const { e } = mkEnemy(1000, 1000, 1100, 1000); e.hp = e.stats.maxHp * 0.1;
  e.update(16); e.update(16); assert.equal(e.ai.currentState, 'FLEE');
});

// PNJ Hub
test('NPC ROUTINE : se déplace vers son waypoint', () => {
  const { n } = mkNPC('merchant', 100, 100, 9999, 9999); n.update(16);
  assert.equal(n.ai.currentState, 'ROUTINE');
  const v = n.sprite.body.velocity; assert.ok(v.x !== 0 || v.y !== 0, 'NPC immobile en ROUTINE');
});
test('NPC ROUTINE → INTERACT si joueur appuie E à portée', () => {
  EventBus.reset(); const { n } = mkNPC('guard', 100, 100, 120, 100); n.update(16);   // garde (sans stock)
  EventBus.emit('player:interact', { x: 120, y: 100 });
  assert.equal(n.ai.currentState, 'INTERACT');
});
test('NPC → ALARMED si faction hostile', () => {
  const { n } = mkNPC('guard', 100, 100, 9999, 9999); n.setAlarmed();
  assert.equal(n.ai.currentState, 'ALARMED');
});

// Intégration GameScene
const { GameScene } = await import('../src/scenes/GameScene.js').catch(e => { console.log('  ❌ import → ' + e.message); process.exit(1); });
test('GameScene : 11 ennemis (3 zones) + 5 PNJ Hub, tous avec IA', () => {
  const s = createSceneHarness(GameScene); s.create();
  assert.equal(s.enemies.length, 11); assert.equal(s.npcs.length, 5);
  assert.ok(s.enemies.every(e => e.ai && e.ai.currentState));
});

console.log(`\n📊 Résultat: ${passed} passés, ${failed} échoués`);
process.exit(failed ? 1 : 0);
