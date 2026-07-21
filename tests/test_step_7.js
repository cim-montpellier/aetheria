// tests/test_step_7.js — Sands of Aetheria | Validation Étape 7 (Inventaire & Items)
// Run: node tests/test_step_7.js
import assert from 'node:assert';
import { installMocks, createSceneHarness, createMockScene } from './_mocks.js';
import { InventorySystem } from '../src/systems/InventorySystem.js';
import { Player } from '../src/entities/Player.js';
import { InventoryUI } from '../src/ui/InventoryUI.js';
import { EventBus } from '../src/utils/EventBus.js';

installMocks();
let passed = 0, failed = 0;
const test = (n, f) => { try { f(); passed++; console.log(`  ✅ ${n}`); } catch (e) { failed++; console.log(`  ❌ ${n}\n     → ${e.message}`); } };
console.log('🧪 ÉTAPE 7 — Inventaire & Items');
const mkPlayer = () => { const s = createMockScene(); return { s, p: new Player(s, 100, 100) }; };

// InventorySystem — logique pure
test('Ramasser un item l\'ajoute à l\'inventaire', () => {
  const inv = new InventorySystem(24);
  assert.equal(inv.addItem('stone', 3), 0); assert.equal(inv.countItem('stone'), 3); assert.ok(inv.hasItem('stone', 3));
});
test('Stack : ressources empilées (max 99), overflow sur nouveau slot', () => {
  const inv = new InventorySystem(24); inv.addItem('stone', 150);
  assert.equal(inv.countItem('stone'), 150); assert.equal(inv.items.length, 2);   // 99 + 51
});
test('Retirer des items', () => {
  const inv = new InventorySystem(24); inv.addItem('stone', 10); inv.removeItem('stone', 4);
  assert.equal(inv.countItem('stone'), 6);
});
test('Inventaire plein (24 slots) → refus + notification', () => {
  EventBus.reset(); let full = false; EventBus.on('inventory:full', () => full = true);
  const inv = new InventorySystem(24);
  for (let i = 0; i < 24; i++) inv.addItem('wood_sword');   // stack 1 → 24 slots
  assert.equal(inv.addItem('wood_sword'), 1); assert.ok(full);
});
// Équipement → impact sur les stats
test('Équiper une arme augmente les dégâts', () => {
  const { p } = mkPlayer(); p.inventory.addItem('wood_sword');
  const before = p.totalAttack(); p.inventory.equip('wood_sword');
  assert.equal(p.totalAttack(), before + 5); assert.equal(p.inventory.equipped.weapon, 'wood_sword');
});
test('Équiper une armure réduit les dégâts reçus', () => {
  const { p } = mkPlayer(); p.inventory.addItem('leather_armor'); p.inventory.equip('leather_armor');
  p.hp = 50; p.takeDamage(20); assert.equal(p.hp, 35);   // 20 - 5 défense
});
test('Consommer une potion régénère les HP', () => {
  const { p } = mkPlayer(); p.inventory.addItem('potion'); p.hp = 30; p.useItem('potion');
  assert.equal(p.hp, 70); assert.ok(!p.inventory.hasItem('potion'));
});
test('Mort → perte de 50% des items (Kenshi)', () => {
  const { p } = mkPlayer();
  for (const id of ['stone', 'wood', 'metal', 'food']) p.inventory.addItem(id);   // 4 piles
  p.loseHalfItems(); assert.equal(p.inventory.items.length, 2);
});
// Inventaire UI
test('InventoryUI : ouvre/ferme la grille (24 slots)', () => {
  const ui = new InventoryUI(createMockScene());
  ui.open({ items: [{ id: 'potion', qty: 2 }], equipped: {}, gold: 15, maxSlots: 24 });
  assert.ok(ui.visible && ui.objects.length >= 24);
  ui.close(); assert.ok(!ui.visible && ui.objects.length === 0);
});
// Intégration GameScene : drop à la mort
const { GameScene } = await import('../src/scenes/GameScene.js').catch(e => { console.log('  ❌ import → ' + e.message); process.exit(1); });
test('Mort ennemi → auto-loot (le boss lâche l\'Épée d\'Acier)', () => {
  const s = createSceneHarness(GameScene); s.create();
  const boss = s.enemies.find(e => e.template.key === 'enemy_boss');
  s.combat.onEnemyDead({ enemy: boss });
  assert.ok(s.player.inventory.hasItem('steel_sword'), 'butin du boss manquant');
});
// UIScene découplée via EventBus
const { UIScene } = await import('../src/scenes/UIScene.js').catch(e => { console.log('  ❌ import → ' + e.message); process.exit(1); });
test('UIScene : snapshot inventaire mis à jour via EventBus', () => {
  EventBus.reset(); const s = createSceneHarness(UIScene); s.create();
  EventBus.emit('inventory:changed', { items: [{ id: 'stone', qty: 3 }], equipped: {}, gold: 20, maxSlots: 24 });
  assert.equal(s.invSnapshot.gold, 20); assert.ok(s.inventoryUI);
});

console.log(`\n📊 Résultat: ${passed} passés, ${failed} échoués`);
process.exit(failed ? 1 : 0);
