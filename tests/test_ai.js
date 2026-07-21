// tests/test_ai.js — Sands of Aetheria | Tests unitaires StateMachine (étape 14)
// Run: node tests/test_ai.js
import assert from 'node:assert';
import { StateMachine } from '../src/systems/AIManager.js';

let passed = 0, failed = 0;
const test = (n, f) => { try { f(); passed++; console.log(`  ✅ ${n}`); } catch (e) { failed++; console.log(`  ❌ ${n}\n     → ${e.message}`); } };
console.log('🧪 test_ai — StateMachine (FSM universelle)');

test('transition : onEnter/onExit appelés, stateTime remis à 0', () => {
  const log = []; const sm = new StateMachine({});
  sm.addState('A', { onEnter: () => log.push('eA'), onExit: () => log.push('xA'), onUpdate: () => {} });
  sm.addState('B', { onEnter: () => log.push('eB'), onUpdate: () => {} });
  sm.transition('A'); assert.deepEqual(log, ['eA']);
  sm.update(100); assert.equal(sm.stateTime, 100);
  sm.transition('B'); assert.deepEqual(log, ['eA', 'xA', 'eB']); assert.equal(sm.stateTime, 0);
});
test('transition no-op vers le même état (1 seul onEnter)', () => {
  const log = []; const sm = new StateMachine({});
  sm.addState('A', { onEnter: () => log.push('eA'), onUpdate: () => {} });
  sm.transition('A'); sm.transition('A');
  assert.deepEqual(log, ['eA']);
});
test('transition vers état inconnu → ignorée', () => {
  const sm = new StateMachine({});
  sm.addState('A', { onEnter: () => {}, onUpdate: () => {} });
  sm.transition('A'); sm.transition('ZZZ');
  assert.equal(sm.currentState, 'A');
});
test('update : stateTime cumule + onUpdate appelé à chaque tick', () => {
  let ticks = 0; const sm = new StateMachine({});
  sm.addState('A', { onUpdate: () => ticks++ });
  sm.transition('A'); sm.update(16); sm.update(16);
  assert.equal(sm.stateTime, 32); assert.equal(ticks, 2);
});
test('previousState suivi lors des transitions', () => {
  const sm = new StateMachine({});
  sm.addState('A', { onUpdate: () => {} }); sm.addState('B', { onUpdate: () => {} });
  sm.transition('A'); sm.transition('B');
  assert.equal(sm.previousState, 'A'); assert.equal(sm.currentState, 'B');
});
test('onUpdate reçoit (entity, delta, machine)', () => {
  const entity = { id: 1 }; let got = null;
  const sm = new StateMachine(entity);
  sm.addState('A', { onUpdate: (e, dt, m) => { got = { e, dt, m }; } });
  sm.transition('A'); sm.update(16);
  assert.equal(got.e, entity); assert.equal(got.dt, 16); assert.equal(got.m, sm);
});

console.log(`\n📊 test_ai : ${passed} passés, ${failed} échoués`);
process.exit(failed ? 1 : 0);
