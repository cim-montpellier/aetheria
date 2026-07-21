// InventoryUI.js — Sands of Aetheria
// Rôle : Fenêtre d'inventaire (grille 24 slots, équipement, or, stats) — overlay UIScene
// Étape de création : 7
// Dépendances : data/items.js, EventBus.js, Phaser (global)
// Découplage : rend un snapshot ; les actions (équiper/utiliser) passent par EventBus.
// Note MVP : interaction au clic (équiper/consommer) ; drag-and-drop = polish post-MVP.

import { ITEMS } from '../data/items.js';
import { EventBus } from '../utils/EventBus.js';

const COLS = 6, SLOT = 48, PAD = 4;

export class InventoryUI {
  constructor(scene) {
    this.scene = scene;
    this.visible = false;
    this.objects = [];
  }

  toggle(snapshot) { this.visible ? this.close() : this.open(snapshot); }
  open(snapshot) { this.render(snapshot); }
  close() { this.visible = false; this.objects.forEach(o => o.destroy()); this.objects = []; }

  render(snapshot) {
    this.close();
    this.visible = true;
    const s = this.scene;
    const px = s.scale.width / 2 - 170, py = 70;
    const put = (o) => { this.objects.push(o.setScrollFactor(0)); return o; };

    // Panneau + titre
    put(s.add.rectangle(px + 170, py + 150, 340, 300, 0x0f0a06, 0.94).setStrokeStyle(1, 0x3a2a1a).setDepth(900));
    put(s.add.text(px + 170, py + 16, 'INVENTAIRE', { fontFamily: "'Cinzel', serif", fontSize: '18px', color: '#c4a35a' }).setOrigin(0.5).setDepth(901));
    put(s.add.text(px + 18, py + 274, `Or : ${snapshot.gold}`, { fontFamily: "'Share Tech Mono', monospace", fontSize: '13px', color: '#ffd700' }).setDepth(901));

    // Grille 24 slots
    for (let i = 0; i < snapshot.maxSlots; i++) {
      const col = i % COLS, row = Math.floor(i / COLS);
      const x = px + 18 + col * (SLOT + PAD), y = py + 40 + row * (SLOT + PAD);
      const slot = put(s.add.rectangle(x + SLOT / 2, y + SLOT / 2, SLOT, SLOT, 0x2a1a0a).setStrokeStyle(1, 0x3a2a1a).setDepth(901));
      const item = snapshot.items[i];
      if (item) {
        put(s.add.image(x + SLOT / 2, y + SLOT / 2, ITEMS[item.id].icon).setDepth(902));
        if (item.qty > 1) put(s.add.text(x + SLOT - 8, y + SLOT - 14, `${item.qty}`, { fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: '#e8d5b0' }).setDepth(903));
        slot.setInteractive().on('pointerdown', () => this.onSlotClick(item));
      }
    }

    // Équipement + stats
    const eq = snapshot.equipped;
    const stats = this._stats(eq);
    put(s.add.text(px + 220, py + 50, `Arme : ${eq.weapon ? ITEMS[eq.weapon].name : '—'}`, { fontFamily: "'Share Tech Mono', monospace", fontSize: '12px', color: '#e8d5b0' }).setDepth(901));
    put(s.add.text(px + 220, py + 72, `Armure : ${eq.armor ? ITEMS[eq.armor].name : '—'}`, { fontFamily: "'Share Tech Mono', monospace", fontSize: '12px', color: '#e8d5b0' }).setDepth(901));
    put(s.add.text(px + 220, py + 104, `Attaque +${stats.attack}`, { fontFamily: "'Share Tech Mono', monospace", fontSize: '12px', color: '#ff6644' }).setDepth(901));
    put(s.add.text(px + 220, py + 124, `Défense +${stats.defense}`, { fontFamily: "'Share Tech Mono', monospace", fontSize: '12px', color: '#44aaff' }).setDepth(901));
    put(s.add.text(px + 170, py + 286, '[ I ] fermer · clic : équiper/utiliser', { fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: '#a08060' }).setOrigin(0.5).setDepth(901));
  }

  _stats(eq) {
    let attack = 0, defense = 0;
    for (const id of Object.values(eq)) if (id) { attack += ITEMS[id].attack || 0; defense += ITEMS[id].defense || 0; }
    return { attack, defense };
  }

  onSlotClick(item) {
    const def = ITEMS[item.id];
    if (['weapon', 'armor', 'accessory'].includes(def.type)) EventBus.emit('inventory:equip', { id: item.id });
    else if (def.type === 'consumable') EventBus.emit('inventory:use', { id: item.id });
  }
}
