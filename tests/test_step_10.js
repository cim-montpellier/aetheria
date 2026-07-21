// tests/test_step_10.js — Sands of Aetheria | Validation Étape 10 (HUD & Factions)
// Run: node tests/test_step_10.js
import assert from 'node:assert';
import { installMocks, createSceneHarness, createMockScene } from './_mocks.js';
import { FactionSystem } from '../src/systems/FactionSystem.js';
import { HUD } from '../src/ui/HUD.js';
import { EventBus } from '../src/utils/EventBus.js';

installMocks();
let passed = 0, failed = 0;
const test = (n, f) => { try { f(); passed++; console.log(`  ✅ ${n}`); } catch (e) { failed++; console.log(`  ❌ ${n}\n     → ${e.message}`); } };
console.log('🧪 ÉTAPE 10 — HUD & Factions');
const mkHUD = () => { EventBus.reset(); const s = createMockScene(); const hud = new HUD(s); hud.create(); return { s, hud }; };

// FactionSystem (logique pure)
test('Factions : réputations initiales (Oasis 50, Pillards 0, Nomades 50)', () => {
  const f = new FactionSystem();
  assert.equal(f.rep.oasis, 50); assert.equal(f.rep.raiders, 0); assert.equal(f.rep.nomads, 50);
  assert.ok(f.isHostile('raiders') && !f.isHostile('oasis'));
});
test('Factions : modifyRep + seuil d\'hostilité + clamp 0-100', () => {
  EventBus.reset(); const f = new FactionSystem();
  f.modifyRep('oasis', -30); assert.equal(f.rep.oasis, 20); assert.ok(f.isHostile('oasis'));   // 20 < 25
  f.modifyRep('oasis', -100); assert.equal(f.rep.oasis, 0);                                    // clamp bas
  f.modifyRep('nomads', 100); assert.equal(f.rep.nomads, 100);                                 // clamp haut
});
// HUD
test('HUD : barre HP temps réel (largeur) + état critique', () => {
  const { hud } = mkHUD();
  hud.updateHP(50, 100); assert.equal(hud.hpFill.width, 80); assert.equal(hud.critical, false);  // 160×0.5
  hud.updateHP(20, 100); assert.equal(hud.hpFill.width, 32); assert.equal(hud.critical, true);   // <30%
});
test('HUD : barre Endurance se vide/régénère', () => {
  const { hud } = mkHUD();
  hud.updateStamina(40, 80); assert.equal(hud.stamFill.width, 70);   // 140×0.5
  hud.updateStamina(80, 80); assert.equal(hud.stamFill.width, 140);
});
test('HUD : mini-carte révèle les zones visitées (fog of war)', () => {
  const { hud } = mkHUD();
  hud.updateMinimap(336, 464); assert.ok(hud.discovered.has('hub'));      // position Hub
  hud.updateMinimap(2100, 400); assert.ok(hud.discovered.has('gorges'));  // position Gorges
  assert.ok(!hud.discovered.has('campement'));                            // non visité
});
test('HUD : notification affichée puis retirée (3s)', () => {
  const { s, hud } = mkHUD();
  const before = s._delayed.length;
  hud.notify('+3 Pierre', '#88cc88');
  assert.equal(hud.notifications.length, 1); assert.ok(s._delayed.length > before);
});
// Intégration GameScene : factions + gardes
const { GameScene } = await import('../src/scenes/GameScene.js').catch(e => { console.log('  ❌ import → ' + e.message); process.exit(1); });
test('Attaquer un Marchand → Oasis hostile → gardes HOSTILE', () => {
  EventBus.reset(); const s = createSceneHarness(GameScene); s.create();
  const guard = s.npcs.find(n => n.template.key === 'npc_guard');
  const merchant = s.npcs.find(n => n.template.key === 'npc_merchant');
  s.playerHitsNPC(merchant);
  assert.ok(s.factions.isHostile('oasis'), 'Oasis non hostile');
  assert.equal(guard.ai.currentState, 'HOSTILE');
});
// UIScene : HUD branché via EventBus
const { UIScene } = await import('../src/scenes/UIScene.js').catch(e => { console.log('  ❌ import → ' + e.message); process.exit(1); });
test('UIScene : HUD créé, player:stats met à jour les barres', () => {
  EventBus.reset(); const s = createSceneHarness(UIScene); s.create();
  assert.ok(s.hud);
  EventBus.emit('player:stats', { hp: 40, hpMax: 100, stamina: 40, staminaMax: 80, x: 336, y: 464 });
  assert.equal(s.hud.hpFill.width, 64);   // 160×0.4
});

console.log(`\n📊 Résultat: ${passed} passés, ${failed} échoués`);
process.exit(failed ? 1 : 0);
