// tests/test_step_13.js — Sands of Aetheria | Validation Étape 13 (Polish visuel)
// Run: node tests/test_step_13.js
import assert from 'node:assert';
import { installMocks, createSceneHarness, createMockScene } from './_mocks.js';
import { ParticleManager } from '../src/systems/ParticleManager.js';
import { Player } from '../src/entities/Player.js';
import { EventBus } from '../src/utils/EventBus.js';

installMocks();
let passed = 0, failed = 0;
const test = (n, f) => { try { f(); passed++; console.log(`  ✅ ${n}`); } catch (e) { failed++; console.log(`  ❌ ${n}\n     → ${e.message}`); } };
console.log('🧪 ÉTAPE 13 — Polish visuel & assets');

// ParticleManager (piloté par événements)
test('ParticleManager : burst impact à la position de l\'ennemi touché', () => {
  EventBus.reset();
  const pm = new ParticleManager(createMockScene());
  assert.ok(pm.available, 'particules indisponibles');
  EventBus.emit('enemy:hit', { enemy: { sprite: { x: 100, y: 200 } } });
  assert.ok(pm.emitters.impact._bursts.some(b => b.x === 100 && b.y === 200), 'pas de burst impact');
});
test('ParticleManager : burst mort (ennemi) + collecte (joueur)', () => {
  EventBus.reset();
  const s = createMockScene(); s.player = { sprite: { x: 50, y: 60 } };
  const pm = new ParticleManager(s);
  EventBus.emit('enemy:dead', { enemy: { sprite: { x: 10, y: 20 } } });
  assert.ok(pm.emitters.death._bursts.some(b => b.x === 10 && b.y === 20));
  EventBus.emit('item:picked', { id: 'stone', qty: 1 });
  assert.ok(pm.emitters.pickup._bursts.some(b => b.x === 50 && b.y === 60));
});
// Sélection d'animation (logique pure)
test('Animation joueur : idle/walk/run/attack selon l\'état', () => {
  assert.equal(Player.animForState(0, 0, false, null), 'idle');
  assert.equal(Player.animForState(1, 0, false, null), 'walk');
  assert.equal(Player.animForState(1, 0, true, null), 'run');
  assert.equal(Player.animForState(0, 0, false, 'light'), 'attack');
});
// Animations créées au preload
const { PreloadScene } = await import('../src/scenes/PreloadScene.js');
test('PreloadScene : animations joueur créées (idle/walk/run/attack)', () => {
  const s = createSceneHarness(PreloadScene); s.create();
  const keys = s.anims._created.map(c => c.key);
  for (const k of ['idle', 'walk', 'run', 'attack']) assert.ok(keys.includes(k), `anim ${k} manquante`);
});
// Vignette HP critique
const { HUD } = await import('../src/ui/HUD.js');
test('HUD : vignette rouge si HP < 30%, sinon transparente', () => {
  EventBus.reset(); const s = createMockScene(); const hud = new HUD(s); hud.create();
  hud.updateHP(20, 100); assert.equal(hud.vignette.alpha, 0.25);   // critique
  hud.updateHP(80, 100); assert.equal(hud.vignette.alpha, 0);      // normal
});
// Screen shake sur coup reçu
const { GameScene } = await import('../src/scenes/GameScene.js');
test('Screen shake sur coup reçu par le joueur', () => {
  EventBus.reset(); const s = createSceneHarness(GameScene); s.create();
  s.player.hp = 50; s.player.takeDamage(10);
  assert.ok(s._rec.shake && s._rec.shake.i > 0, 'pas de screen shake');
});

console.log(`\n📊 Résultat: ${passed} passés, ${failed} échoués`);
process.exit(failed ? 1 : 0);
