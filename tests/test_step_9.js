// tests/test_step_9.js — Sands of Aetheria | Validation Étape 9 (Économie : minage/crafting/commerce)
// Run: node tests/test_step_9.js
import assert from 'node:assert';
import { installMocks, createSceneHarness, createMockScene } from './_mocks.js';
import * as Craft from '../src/systems/CraftingSystem.js';
import { RECIPES } from '../src/data/recipes.js';
import { ITEMS } from '../src/data/items.js';
import { InventorySystem } from '../src/systems/InventorySystem.js';
import { Player } from '../src/entities/Player.js';
import { NPC } from '../src/entities/NPC.js';
import { NPC_TEMPLATES } from '../src/data/npcs.js';
import { ShopUI } from '../src/ui/ShopUI.js';

installMocks();
let passed = 0, failed = 0;
const test = (n, f) => { try { f(); passed++; console.log(`  ✅ ${n}`); } catch (e) { failed++; console.log(`  ❌ ${n}\n     → ${e.message}`); } };
console.log('🧪 ÉTAPE 9 — Économie (minage/crafting/commerce)');
const mkPlayer = () => { const s = createMockScene(); return { s, p: new Player(s, 100, 100) }; };
const mkNPC = (tpl) => { const s = createMockScene(); s.player = { sprite: { x: 9999, y: 9999 } }; return { s, n: new NPC(s, 100, 100, NPC_TEMPLATES[tpl]) }; };

// Crafting (logique pure)
test('8 recettes MVP définies', () => { assert.equal(Object.keys(RECIPES).length, 8); });
test('Crafter Épée de Bois consomme 3 Bois-Sec et l\'ajoute', () => {
  const inv = new InventorySystem(); inv.addItem('wood', 5);
  assert.ok(Craft.canCraft('wood_sword', inv));
  assert.ok(Craft.craft('wood_sword', inv));
  assert.equal(inv.countItem('wood'), 2); assert.ok(inv.hasItem('wood_sword'));
});
test('Recette Épée de Métal : prérequis Forge 15', () => {
  const inv = new InventorySystem(); inv.addItem('metal', 4);
  assert.ok(!Craft.canCraft('metal_sword', inv, { smithing: 0 }));
  assert.ok(Craft.canCraft('metal_sword', inv, { smithing: 15 }));
});
test('Prix : Commerce réduit l\'achat, améliore la vente', () => {
  assert.ok(Craft.buyPrice(100, 100) < Craft.buyPrice(100, 0));
  assert.ok(Craft.sellPrice(100, 100) > Craft.sellPrice(100, 0));
});
// Commerce (transactions NPC)
test('Acheter une Potion au Marchand → débit en Or', () => {
  const { n } = mkNPC('merchant'); const { p } = mkPlayer(); p.inventory.gold = 100;
  assert.ok(n.buyFrom(p, 'potion'));
  assert.equal(p.inventory.gold, 100 - Craft.buyPrice(ITEMS.potion.value, 0));
  assert.ok(p.inventory.hasItem('potion'));
});
test('Vendre une Pierre au Marchand → Or reçu', () => {
  const { n } = mkNPC('merchant'); const { p } = mkPlayer();
  p.inventory.addItem('stone', 1); const gold0 = p.inventory.gold;
  assert.ok(n.sellTo(p, 'stone'));
  assert.equal(p.inventory.gold, gold0 + Craft.sellPrice(ITEMS.stone.value, 0));
  assert.ok(!p.inventory.hasItem('stone'));
});
// Minage + respawn
const { GameScene } = await import('../src/scenes/GameScene.js').catch(e => { console.log('  ❌ import → ' + e.message); process.exit(1); });
test('Miner un Rocher → +Pierre (1-3)', () => {
  const s = createSceneHarness(GameScene); s.create();
  const node = s.resources.find(r => r.type === 'stone');
  s.world.mineNode(node);
  const got = s.player.inventory.countItem('stone');
  assert.ok(got >= 1 && got <= 3, `quantité ${got} hors bornes`);
  assert.equal(node.depleted, true);
});
test('Ressource respawn après 5 min (timestamp)', () => {
  const s = createSceneHarness(GameScene); s.create();
  const node = s.resources.find(r => r.type === 'stone');
  s.world.mineNode(node); assert.ok(node.respawnAt > 0);
  s.time.now = node.respawnAt + 1; s.world.checkRespawns();
  assert.equal(node.depleted, false, 'pas de respawn');
});
// ShopUI (structurel)
test('ShopUI : ouvre/ferme l\'interface de commerce', () => {
  const shop = new ShopUI(createMockScene());
  const npc = { template: { label: 'Marchand' }, stock: [{ id: 'potion', qty: 3 }] };
  const player = { inventory: { gold: 50, items: [{ id: 'stone', qty: 5 }] }, skills: { levels: { trade: 0 } } };
  shop.open(npc, player);
  assert.ok(shop.visible && shop.objects.length > 0);
  shop.close(); assert.equal(shop.objects.length, 0);
});

console.log(`\n📊 Résultat: ${passed} passés, ${failed} échoués`);
process.exit(failed ? 1 : 0);
