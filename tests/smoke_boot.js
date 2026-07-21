// tests/smoke_boot.js — Sands of Aetheria
// Rôle : Smoke test headless — tout le graphe de modules ES se charge et le jeu
//        démarre (new Phaser.Game) sans erreur. Valide le boot de l'étape 1.
// Run  : node tests/smoke_boot.js
import assert from 'node:assert';
import { installMocks } from './_mocks.js';

const { MockGame, window } = installMocks();
let passed = 0, failed = 0;
const test = (n, f) => { try { f(); passed++; console.log(`  ✅ ${n}`); } catch (e) { failed++; console.log(`  ❌ ${n}\n     → ${e.message}`); } };

console.log('🔥 SMOKE TEST — boot du graphe de modules (headless)');

// Importer main.js évalue config.js, EventBus, BootScene/PreloadScene (class extends
// Phaser.Scene) et construit GameConfig (Phaser.WEBGL / Phaser.Scale.*) sans throw.
const main = await import('../src/main.js').catch(e => ({ __err: e }));
test('main.js + graphe complet importés sans erreur', () => assert.ok(!main.__err, main.__err?.message));

// Déclenche le listener 'load' → new Phaser.Game(GameConfig)
test('démarrage Phaser.Game au load', () => { window.dispatch('load'); assert.equal(MockGame.instances.length, 1); });

const cfg = MockGame.instances[0]?.config;
test('GameConfig : 960x540 + fond #1a1208', () => { assert.equal(cfg.width, 960); assert.equal(cfg.height, 540); assert.equal(cfg.backgroundColor, '#1a1208'); });
test('GameConfig : WebGL + pixelArt + roundPixels', () => { assert.equal(cfg.type, 2); assert.equal(cfg.pixelArt, true); assert.equal(cfg.roundPixels, true); });
test('GameConfig : physique Arcade, gravité 0 (top-down)', () => { assert.equal(cfg.physics.default, 'arcade'); assert.equal(cfg.physics.arcade.gravity.y, 0); });
test('GameConfig : 5 scènes (Boot→Preload→Menu→UI→Game)', () => {
  assert.equal(cfg.scene.length, 5);
  assert.deepEqual(cfg.scene.map(s => s.name), ['BootScene', 'PreloadScene', 'MenuScene', 'UIScene', 'GameScene']);
});

console.log(`\n📊 Smoke: ${passed} passés, ${failed} échoués`);
process.exit(failed ? 1 : 0);
