// tests/test_step_6.js — Sands of Aetheria | Validation Étape 6 (Combat complet)
// Run: node tests/test_step_6.js
import assert from 'node:assert';
import { installMocks, createSceneHarness, createMockScene } from './_mocks.js';
import * as CS from '../src/systems/CombatSystem.js';
import { Player } from '../src/entities/Player.js';
import { Enemy } from '../src/entities/Enemy.js';
import { Projectile } from '../src/entities/Projectile.js';
import { ENEMY_TEMPLATES } from '../src/data/enemies.js';
import { EventBus } from '../src/utils/EventBus.js';

installMocks();
let passed = 0, failed = 0;
const test = (n, f) => { try { f(); passed++; console.log(`  ✅ ${n}`); } catch (e) { failed++; console.log(`  ❌ ${n}\n     → ${e.message}`); } };
console.log('🧪 ÉTAPE 6 — Combat complet');
const mkPlayer = () => { const s = createMockScene(); return { s, p: new Player(s, 100, 100) }; };
const mkEnemy = (tpl = 'bandit') => { const s = createMockScene(); s.player = { sprite: { x: 9999, y: 9999 } }; return { s, e: new Enemy(s, 100, 100, ENEMY_TEMPLATES[tpl]) }; };

// Formule de dégâts
test('Dégâts léger = attack × (1 + melee/200)', () => {
  assert.equal(CS.computeDamage({ attack: 10, meleeSkill: 0 }), 10);
  assert.equal(CS.computeDamage({ attack: 10, meleeSkill: 100 }), 15);
});
test('Dégâts lourd ×2.5 et critique ×1.5', () => {
  assert.equal(CS.computeDamage({ attack: 10, heavy: true }), 25);
  assert.equal(CS.computeDamage({ attack: 10, crit: true }), 15);
});
test('Blessure bras : HP<15% → attaque ×0.5', () => {
  assert.equal(CS.playerAttackMultiplier(0.10), 0.5); assert.equal(CS.playerAttackMultiplier(0.50), 1);
  assert.equal(CS.computeDamage({ attack: 10, hpRatio: 0.10 }), 5);
});
test('Parade : -60% dégâts, contre si < 200ms', () => {
  assert.deepEqual(CS.resolveParry(20, false, 0), { damage: 20, countered: false });
  assert.deepEqual(CS.resolveParry(20, true, 500), { damage: 8, countered: false });
  assert.deepEqual(CS.resolveParry(20, true, 100), { damage: 8, countered: true });
});
// Joueur : attaque, dégâts, mort/respawn
test('Attaque légère : consomme endurance + cooldown', () => {
  const { p } = mkPlayer(); p.stamina = 80; p.lightAttack();
  assert.equal(p.stamina, 80 - CS.LIGHT_STAMINA); assert.equal(p.attackCooldown, CS.LIGHT_COOLDOWN);
});
test('Joueur touché perd des PV ; invincible (esquive) = 0 dégât', () => {
  const { p } = mkPlayer(); p.hp = 50; p.takeDamage(20); assert.equal(p.hp, 30);
  p.invincible = true; p.takeDamage(20); assert.equal(p.hp, 30);
});
test('Mort joueur → respawn Hub, HP=25, or -50%', () => {
  const { s, p } = mkPlayer(); p.hp = 10; p.gold = 15; p.takeDamage(20); s.flushDelayed();
  assert.equal(p.hp, 25); assert.equal(p.gold, 7); assert.equal(p.dead, false);
});
// Ennemi : dégâts + mort (drop via EventBus)
test('Ennemi prend des dégâts et meurt (émet enemy:dead)', () => {
  EventBus.reset(); const { e } = mkEnemy('scorpion');
  let deadFired = false; EventBus.on('enemy:dead', () => deadFired = true);
  e.takeDamage(30); assert.equal(e.dead, true); assert.equal(e.ai.currentState, 'DEAD'); assert.ok(deadFired);
});
// Projectile poolé
test('Projectile : tir dirigé, vie décroît, expire', () => {
  const pr = new Projectile(createMockScene()); pr.fire(0, 0, 100, 0, 200, 12);
  assert.equal(pr.active, true); assert.equal(pr.sprite.body.velocity.x, 200); assert.equal(pr.damage, 12);
  pr.update(2500); assert.equal(pr.active, false);
});
// Intégration GameScene
const { GameScene } = await import('../src/scenes/GameScene.js').catch(e => { console.log('  ❌ import → ' + e.message); process.exit(1); });
test('GameScene : coup joueur → ennemi perd des PV', () => {
  const s = createSceneHarness(GameScene); s.create();
  const enemy = s.enemies[0]; const hp0 = enemy.hp;
  s.player.attacking = 'light'; s.combat.playerHitsEnemy(enemy);
  assert.ok(enemy.hp < hp0, 'ennemi non blessé');
});
test('GameScene : attaque ennemie → joueur perd des PV', () => {
  const s = createSceneHarness(GameScene); s.create();
  const enemy = s.enemies[0]; enemy.sprite.x = s.player.sprite.x + 20; enemy.sprite.y = s.player.sprite.y;
  const hp0 = s.player.hp; s.combat.onEnemyAttack({ source: enemy, target: s.player });
  assert.ok(s.player.hp < hp0, 'joueur non blessé');
});

console.log(`\n📊 Résultat: ${passed} passés, ${failed} échoués`);
process.exit(failed ? 1 : 0);
