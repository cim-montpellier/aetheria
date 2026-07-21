// InventorySystem.js — Sands of Aetheria
// Rôle : Gestion d'inventaire (24 slots, piles, équipement) — logique PURE, testable
// Étape de création : 7
// Dépendances : data/items.js, EventBus.js (notifications). Aucune dépendance Phaser.
// Découplage : émet 'inventory:changed'/'inventory:full' ; l'UI écoute (jamais d'accès direct).

import { ITEMS, EQUIP_SLOTS } from '../data/items.js';
import { EventBus } from '../utils/EventBus.js';

export class InventorySystem {
  constructor(maxSlots = 24) {
    this.maxSlots = maxSlots;
    this.items = [];                                  // [{ id, qty }] — piles
    this.equipped = { weapon: null, armor: null, accessory: null };
    this.gold = 0;
  }

  // ── Ajout / retrait ───────────────────────────────────────────
  /** Ajoute `qty` items. Retourne le reliquat non ajouté (0 = tout ajouté). */
  addItem(id, qty = 1) {
    const def = ITEMS[id];
    if (!def) return qty;
    let remaining = qty;
    if (def.stack > 1) {                              // 1) empiler sur les piles existantes
      for (const s of this.items) {
        if (remaining <= 0) break;
        if (s.id === id && s.qty < def.stack) {
          const add = Math.min(def.stack - s.qty, remaining);
          s.qty += add; remaining -= add;
        }
      }
    }
    while (remaining > 0 && this.items.length < this.maxSlots) {   // 2) slots vides
      const add = Math.min(def.stack, remaining);
      this.items.push({ id, qty: add }); remaining -= add;
    }
    if (qty - remaining > 0) this._changed();
    if (remaining > 0) EventBus.emit('inventory:full', { id, remaining });
    return remaining;
  }

  /** Retire `qty` items. Retourne la quantité effectivement retirée. */
  removeItem(id, qty = 1) {
    let remaining = qty;
    for (let i = this.items.length - 1; i >= 0 && remaining > 0; i--) {
      const s = this.items[i];
      if (s.id !== id) continue;
      const take = Math.min(s.qty, remaining);
      s.qty -= take; remaining -= take;
      if (s.qty <= 0) this.items.splice(i, 1);
    }
    const removed = qty - remaining;
    if (removed > 0) this._changed();
    return removed;
  }

  countItem(id) { let n = 0; for (const s of this.items) if (s.id === id) n += s.qty; return n; }
  hasItem(id, qty = 1) { return this.countItem(id) >= qty; }
  isFull() { return this.items.length >= this.maxSlots; }

  // ── Équipement ────────────────────────────────────────────────
  equip(id) {
    const def = ITEMS[id];
    if (!def || !EQUIP_SLOTS.includes(def.type) || !this.hasItem(id)) return false;
    const slot = def.type;
    this.removeItem(id, 1);
    if (this.equipped[slot]) this.addItem(this.equipped[slot], 1);   // remplace l'ancien
    this.equipped[slot] = id;
    this._changed();
    return true;
  }

  unequip(slot) {
    if (!this.equipped[slot] || this.isFull()) return false;
    this.addItem(this.equipped[slot], 1);
    this.equipped[slot] = null;
    this._changed();
    return true;
  }

  /** Stats cumulées de l'équipement : { attack, defense }. */
  equippedStats() {
    let attack = 0, defense = 0;
    for (const id of Object.values(this.equipped)) {
      if (!id) continue;
      attack += ITEMS[id].attack || 0;
      defense += ITEMS[id].defense || 0;
    }
    return { attack, defense };
  }

  // ── Consommables ──────────────────────────────────────────────
  /** Consomme un item ; retourne son effet { heal } (appliqué par le joueur). */
  consume(id) {
    const def = ITEMS[id];
    if (!def || def.type !== 'consumable' || !this.hasItem(id)) return null;
    this.removeItem(id, 1);
    return { heal: def.heal || 0 };
  }

  // ── Sérialisation (sauvegarde, étape 12) ──────────────────────
  snapshot() {
    return { gold: this.gold, items: this.items.map(s => ({ ...s })), equipped: { ...this.equipped }, maxSlots: this.maxSlots };
  }

  _changed() { EventBus.emit('inventory:changed', this.snapshot()); }
}
