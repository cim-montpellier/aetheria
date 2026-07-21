// tests/test_step_4.js — Sands of Aetheria | Validation Étape 4 (Joueur & Contrôles)
// Run: node tests/test_step_4.js
import assert from 'node:assert';
import { installMocks, createSceneHarness } from './_mocks.js';
import { InputHandler } from '../src/entities/InputHandler.js';
import { Player } from '../src/entities/Player.js';
import { PLAYER_HP_START, PLAYER_STAMINA_MAX } from '../src/config.js';

installMocks();
let passed = 0, failed = 0;
const test = (n, f) => { try { f(); passed++; console.log(`  ✅ ${n}`); } catch (e) { failed++; console.log(`  ❌ ${n}\n     → ${e.message}`); } };
console.log('🧪 ÉTAPE 4 — Joueur & Contrôles');
const cm = InputHandler.computeMove;
const approx = (a, b) => Math.abs(a - b) < 1e-6;

// 3 schémas de contrôle (logique pure)
test('WASD : 4 directions', () => {
  assert.deepEqual(cm({ D: true }), { x: 1, y: 0 }); assert.deepEqual(cm({ A: true }), { x: -1, y: 0 });
  assert.deepEqual(cm({ W: true }), { x: 0, y: -1 }); assert.deepEqual(cm({ S: true }), { x: 0, y: 1 });
});
test('ZQSD (AZERTY) : Q=gauche, Z=haut', () => {
  assert.deepEqual(cm({ Q: true }), { x: -1, y: 0 }); assert.deepEqual(cm({ Z: true }), { x: 0, y: -1 });
});
test('Flèches : 4 directions', () => {
  assert.deepEqual(cm({ ArrowRight: true }), { x: 1, y: 0 }); assert.deepEqual(cm({ ArrowUp: true }), { x: 0, y: -1 });
  assert.deepEqual(cm({ ArrowLeft: true }), { x: -1, y: 0 }); assert.deepEqual(cm({ ArrowDown: true }), { x: 0, y: 1 });
});
test('Diagonale normalisée (×0.7071)', () => {
  const r = cm({ D: true, S: true }); assert.ok(approx(r.x, Math.SQRT1_2) && approx(r.y, Math.SQRT1_2));
});

// Blessures (Kenshi) — vitesse effective
test('Blessure jambe : HP<30% → vitesse -30%', () => {
  assert.equal(Player.effectiveSpeed(1.0, 120), 120);
  assert.equal(Player.effectiveSpeed(0.25, 120), 84);   // 120 × 0.7
});

// Endurance — conso course / régén au repos (après délai 1s)
test('Endurance : course consomme, repos régénère (≥1s), cap max', () => {
  assert.ok(Player.staminaStep(80, 0, true, true, 1000).stamina < 80, 'pas de consommation');
  assert.equal(Player.staminaStep(50, 0, false, false, 500).stamina, 50, 'régén trop tôt');
  assert.ok(Player.staminaStep(50, 1000, false, false, 1000).stamina > 50, 'pas de régén');
  assert.ok(Player.staminaStep(PLAYER_STAMINA_MAX, 5000, false, false, 10000).stamina <= PLAYER_STAMINA_MAX, 'dépasse max');
});

// Intégration : Player créé par GameScene
const { GameScene } = await import('../src/scenes/GameScene.js').catch(e => { console.log('  ❌ import GameScene → ' + e.message); process.exit(1); });
const mkGame = () => { const s = createSceneHarness(GameScene); s.create(); return s; };
test('Player borné au monde (collideWorldBounds)', () => { assert.equal(mkGame().player.sprite.body._cw, true); });
test('Caméra suit le joueur en lerp (pas de snap)', () => { const f = mkGame()._rec.follow; assert.ok(f && f.lx > 0 && f.lx < 1); });
test('Stats initiaux Kenshi : HP=50, Endurance=80', () => { const p = mkGame().player; assert.equal(p.hp, PLAYER_HP_START); assert.equal(p.stamina, PLAYER_STAMINA_MAX); });
test('Collider joueur ↔ murs enregistré', () => { assert.ok(mkGame()._rec.colliders?.length >= 1); });
test('Esquive : invincible 300ms puis fin', () => {
  const s = mkGame(); const p = s.player; p.stamina = 80;
  p.dodge({ moveX: 1, moveY: 0 }); assert.equal(p.invincible, true); assert.ok(p.stamina < 80);
  s.flushDelayed(); assert.equal(p.invincible, false);
});

console.log(`\n📊 Résultat: ${passed} passés, ${failed} échoués`);
process.exit(failed ? 1 : 0);
