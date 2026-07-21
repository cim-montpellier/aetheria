// NPC.js — Sands of Aetheria
// Rôle : PNJ du Hub — 4 états (ROUTINE/INTERACT/TRADE/ALARMED), routines waypoints
// Étape de création : 5
// Dépendances : AIManager.js (StateMachine), config.js (INTERACT_RANGE), EventBus.js, Phaser
// Réactivité système (GDD §7.2) : INTERACT sur E à portée, ALARMED si faction hostile (ét.10).

import { StateMachine } from '../systems/AIManager.js';
import { INTERACT_RANGE } from '../config.js';
import { ITEMS } from '../data/items.js';
import * as Craft from '../systems/CraftingSystem.js';
import { EventBus } from '../utils/EventBus.js';

export class NPC {
  constructor(scene, x, y, template) {
    this.scene = scene;
    this.template = template;
    this.sprite = scene.physics.add.sprite(x, y, template.key).setOrigin(0.5);
    this.sprite.body.setCollideWorldBounds(true);
    this.sprite.body.allowGravity = false;
    this.spawn = { x, y };
    this.waypoints = template.waypoints.map(([wx, wy]) => ({ x: wx, y: wy }));
    this.wpIndex = 0;
    this.stock = template.stock ? template.stock.map(s => ({ ...s })) : null;   // commerce (étape 9)
    this.faction = template.faction || null;                                    // faction (étape 10)
    this.ai = this.setupAI();
    EventBus.on('player:interact', this.onPlayerInteract, this);
  }

  setupAI() {
    const sm = new StateMachine(this);
    const dist = (n, x, y) => Phaser.Math.Distance.Between(n.sprite.x, n.sprite.y, x, y);

    sm.addState('ROUTINE', {
      onUpdate: (n, dt, m) => {
        const wp = n.waypoints[n.wpIndex];
        if (dist(n, wp.x, wp.y) < 8) { n.wpIndex = (n.wpIndex + 1) % n.waypoints.length; return; }
        n.scene.physics.moveToObject(n.sprite, wp, n.template.speed);   // aller-retour waypoints
      },
    });
    sm.addState('INTERACT', {
      onEnter: (n) => { n.sprite.body.setVelocity(0, 0); EventBus.emit('npc:interact', { npc: n }); },
      onUpdate: (n, dt, m) => {
        const p = n.scene.player.sprite;
        if (dist(n, p.x, p.y) > INTERACT_RANGE * 1.6) m.transition('ROUTINE');   // joueur s'éloigne
      },
    });
    sm.addState('TRADE', {   // ouvre le ShopUI (économie étape 9)
      onEnter: (n) => { n.sprite.body.setVelocity(0, 0); EventBus.emit('npc:trade', { npc: n }); },
      onUpdate: () => {},
    });
    sm.addState('ALARMED', {   // fuit vers son spawn si faction hostile
      onUpdate: (n, dt, m) => {
        n.scene.physics.moveToObject(n.sprite, n.spawn, n.template.speed * 1.4);
        if (dist(n, n.spawn.x, n.spawn.y) < 8) m.transition('ROUTINE');
      },
    });
    sm.addState('HOSTILE', {   // garde hostile : poursuit le joueur (étape 10)
      onUpdate: (n) => {
        const p = n.scene.player;
        if (p) n.scene.physics.moveToObject(n.sprite, p.sprite, n.template.speed * 1.3);
      },
    });

    sm.transition('ROUTINE');
    return sm;
  }

  onPlayerInteract(data) {
    if (this.ai.currentState !== 'ROUTINE' && this.ai.currentState !== 'INTERACT') return;
    const d = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, data.x, data.y);
    if (d >= INTERACT_RANGE) return;
    this.ai.transition(this.stock ? 'TRADE' : 'INTERACT');   // marchand → boutique (étape 9)
  }

  // ── Commerce (étape 9) : le PNJ possède le stock ──────────────
  buyFrom(player, itemId) {
    const si = this.stock?.find(s => s.id === itemId && s.qty > 0);
    if (!si) return false;
    const price = Craft.buyPrice(ITEMS[itemId].value, player.skills.levels.trade);
    if (player.inventory.gold < price) return false;
    player.inventory.gold -= price;
    player.inventory.addItem(itemId, 1);
    si.qty--;
    player.skills.register('trade');
    EventBus.emit('inventory:changed', player.inventory.snapshot());
    return true;
  }
  sellTo(player, itemId) {
    if (!player.inventory.hasItem(itemId)) return false;
    const price = Craft.sellPrice(ITEMS[itemId].value, player.skills.levels.trade);
    player.inventory.removeItem(itemId, 1);
    player.inventory.gold += price;
    player.skills.register('trade');
    const si = this.stock?.find(s => s.id === itemId);
    if (si) si.qty++; else this.stock?.push({ id: itemId, qty: 1 });
    EventBus.emit('inventory:changed', player.inventory.snapshot());
    return true;
  }

  setAlarmed() { this.ai.transition('ALARMED'); }
  setHostile() { this.ai.transition('HOSTILE'); }
  openTrade() { this.ai.transition('TRADE'); }
  update(delta) { this.ai.update(delta); }
  destroy() { EventBus.off('player:interact', this.onPlayerInteract, this); this.sprite.destroy(); }
}
