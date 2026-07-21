// ShopUI.js — Sands of Aetheria
// Rôle : Interface de commerce (achat/vente) + crafting chez le forgeron — overlay UIScene.
// Étape de création : 9
// Dépendances : data/items.js, data/recipes.js, CraftingSystem.js, EventBus.js, Phaser (global)
// Découplage : lit le stock/or via les refs passées à open() ; les ACTIONS passent par
//              EventBus ('shop:action'/'shop:close'), traitées par GameScene.

import { ITEMS } from '../data/items.js';
import { RECIPES } from '../data/recipes.js';
import * as Craft from '../systems/CraftingSystem.js';
import { EventBus } from '../utils/EventBus.js';

export class ShopUI {
  constructor(scene) {
    this.scene = scene;
    this.visible = false;
    this.objects = [];
    this.npc = null;
    this.player = null;
  }

  open(npc, player) { this.npc = npc; this.player = player; this.render(); }

  close() {
    this.visible = false;
    this.objects.forEach(o => o.destroy());
    this.objects = [];
    EventBus.emit('shop:close', {});
  }

  render() {
    this.objects.forEach(o => o.destroy());
    this.objects = [];
    this.visible = true;
    const s = this.scene;
    const px = s.scale.width / 2 - 175, py = 50;
    const trade = this.player.skills.levels.trade;
    const put = (o) => { this.objects.push(o.setScrollFactor(0)); return o; };
    const txt = (x, y, t, c = '#e8d5b0', sz = '12px') =>
      put(s.add.text(x, y, t, { fontFamily: "'Share Tech Mono', monospace", fontSize: sz, color: c }).setDepth(901));

    put(s.add.rectangle(px + 175, py + 165, 350, 330, 0x0f0a06, 0.95).setStrokeStyle(1, 0x3a2a1a).setDepth(900));
    txt(px + 175, py + 14, this.npc.template.label.toUpperCase(), '#c4a35a', '16px').setOrigin(0.5);
    txt(px + 175, py + 34, `Or : ${this.player.inventory.gold}`, '#ffd700').setOrigin(0.5);

    // ── Achat (stock du PNJ) ──
    txt(px + 16, py + 56, '— Acheter —', '#a08060');
    (this.npc.stock || []).forEach((si, i) => {
      if (si.qty <= 0) return;
      const y = py + 74 + i * 20;
      const price = Craft.buyPrice(ITEMS[si.id].value, trade);
      const row = txt(px + 16, y, `${ITEMS[si.id].name} x${si.qty}  ${price}or`, '#e8d5b0');
      row.setInteractive().on('pointerdown', () => EventBus.emit('shop:action', { type: 'buy', itemId: si.id }));
    });

    // ── Vente (ressources du joueur) ──
    txt(px + 200, py + 56, '— Vendre —', '#a08060');
    this.player.inventory.items.filter(it => ITEMS[it.id].type === 'resource').slice(0, 6).forEach((it, i) => {
      const y = py + 74 + i * 20;
      const price = Craft.sellPrice(ITEMS[it.id].value, trade);
      const row = txt(px + 200, y, `${ITEMS[it.id].name} x${it.qty}  ${price}or`, '#88cc88');
      row.setInteractive().on('pointerdown', () => EventBus.emit('shop:action', { type: 'sell', itemId: it.id }));
    });

    // ── Crafting (forgeron uniquement) ──
    if (this.npc.template.key === 'npc_smith') {
      txt(px + 16, py + 200, '— Forger —', '#a08060');
      Object.keys(RECIPES).filter(id => RECIPES[id].station === 'forge').slice(0, 4).forEach((id, i) => {
        const ok = Craft.canCraft(id, this.player.inventory, this.player.skills.levels);
        const row = txt(px + 16, py + 218 + i * 18, `${ITEMS[RECIPES[id].result].name} ${ok ? '✓' : '(manque)'}`, ok ? '#ffd700' : '#4a3a2a');
        if (ok) row.setInteractive().on('pointerdown', () => EventBus.emit('shop:action', { type: 'craft', itemId: id }));
      });
    }

    const close = txt(px + 175, py + 306, '[ fermer ]', '#ff6644');
    close.setOrigin(0.5).setInteractive().on('pointerdown', () => this.close());
  }
}
