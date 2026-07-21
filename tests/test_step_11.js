// tests/test_step_11.js — Sands of Aetheria | Validation Étape 11 (Audio & Cycle Jour/Nuit)
// Run: node tests/test_step_11.js
import assert from 'node:assert';
import { installMocks, createSceneHarness, createMockScene } from './_mocks.js';
import { timeRatio, phaseAt, tintAt, isNight, DAYNIGHT_TINTS } from '../src/systems/DayNight.js';
import { AudioManager } from '../src/systems/AudioManager.js';
import { DAY_DURATION_MS } from '../src/config.js';
import { EventBus } from '../src/utils/EventBus.js';

installMocks();
// Mock Howler (CDN absent en headless) — AudioManager doit fonctionner avec
globalThis.Howl = class { constructor(o) { this.o = o; } play() { return 1; } fade() {} stop() {} };
globalThis.Howler = { mute: () => {} };

let passed = 0, failed = 0;
const test = (n, f) => { try { f(); passed++; console.log(`  ✅ ${n}`); } catch (e) { failed++; console.log(`  ❌ ${n}\n     → ${e.message}`); } };
console.log('🧪 ÉTAPE 11 — Audio & Cycle Jour/Nuit');

// Cycle jour/nuit (logique pure — TECH_SPEC §6 / STYLE_GUIDE §6.2)
test('Phases jour/nuit : aube/jour/crépuscule/nuit', () => {
  assert.equal(phaseAt(0.10), 'dawn'); assert.equal(phaseAt(0.30), 'day');
  assert.equal(phaseAt(0.50), 'dusk'); assert.equal(phaseAt(0.80), 'night');
});
test('Teinte : jour neutre (alpha 0), nuit bleutée (0.55)', () => {
  assert.equal(tintAt(0.30).alpha, 0); assert.equal(tintAt(0.80).alpha, 0.55);
  assert.equal(tintAt(0.80).color, DAYNIGHT_TINTS.night.color);
});
test('timeRatio : cycle borné + boucle (5 min)', () => {
  assert.equal(timeRatio(0), 0); assert.equal(timeRatio(DAY_DURATION_MS / 2), 0.5);
  assert.equal(timeRatio(DAY_DURATION_MS), 0);   // reboucle
});
test('isNight : vrai la nuit seulement', () => { assert.ok(isNight(0.8) && !isNight(0.3)); });

// Audio (wrapper Howler)
test('Musique : crossfade Hub → Plaine (change de piste)', () => {
  const a = new AudioManager();
  a.playMusic('music_hub', 'a.ogg'); assert.equal(a.currentMusicKey, 'music_hub');
  a.playMusic('music_wild', 'b.ogg'); assert.equal(a.currentMusicKey, 'music_wild');
  a.playMusic('music_wild', 'b.ogg'); assert.equal(a.currentMusicKey, 'music_wild');  // même piste = no-op
});
test('SFX : joue + anti-duplication (throttle 60ms)', () => {
  const a = new AudioManager();
  assert.equal(a.playSFX('attack', 'x.ogg', 1000), true);
  assert.equal(a.playSFX('attack', 'x.ogg', 1020), false);   // < 60ms → ignoré
  assert.equal(a.playSFX('attack', 'x.ogg', 1100), true);    // ≥ 60ms → rejoué
});
test('Mute/Unmute : SFX coupé quand muet', () => {
  const a = new AudioManager();
  assert.equal(a.toggleMute(), true); assert.equal(a.playSFX('attack', 'x.ogg', 5000), false);  // muet
  assert.equal(a.toggleMute(), false); assert.equal(a.playSFX('attack', 'x.ogg', 6000), true);
});

// Intégration GameScene : overlay jour/nuit + IA nocturne + audio
const { GameScene } = await import('../src/scenes/GameScene.js').catch(e => { console.log('  ❌ import → ' + e.message); process.exit(1); });
test('GameScene : overlay jour/nuit + teinte variable', () => {
  EventBus.reset(); const s = createSceneHarness(GameScene); s.create();
  assert.ok(s.dayNightOverlay, 'overlay absent');
  s.updateDayNight(DAY_DURATION_MS * 0.8);   // nuit
  assert.equal(s.dayNightOverlay.fillAlpha, 0.55);
  s.updateDayNight(DAY_DURATION_MS * 0.3);   // jour
  assert.equal(s.dayNightOverlay.fillAlpha, 0);
});
test('GameScene : IA nocturne → détection -30% (detectMultiplier)', () => {
  EventBus.reset(); const s = createSceneHarness(GameScene); s.create();
  s.updateDayNight(DAY_DURATION_MS * 0.8); assert.equal(s.detectMultiplier, 0.7);   // nuit
  s.updateDayNight(DAY_DURATION_MS * 0.3); assert.equal(s.detectMultiplier, 1.0);   // jour
});

// UIScene : indicateur heure (icône soleil/lune)
const { UIScene } = await import('../src/scenes/UIScene.js').catch(e => { console.log('  ❌ import → ' + e.message); process.exit(1); });
test('UIScene : indicateur jour/nuit via EventBus', () => {
  EventBus.reset(); const s = createSceneHarness(UIScene); s.create();
  EventBus.emit('daynight:phase', { phase: 'night', isNight: true });
  assert.match(s.phaseIcon.text, /Nuit/);
  EventBus.emit('daynight:phase', { phase: 'day', isNight: false });
  assert.match(s.phaseIcon.text, /Jour/);
});

console.log(`\n📊 Résultat: ${passed} passés, ${failed} échoués`);
process.exit(failed ? 1 : 0);
