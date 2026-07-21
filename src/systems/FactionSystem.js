// FactionSystem.js — Sands of Aetheria
// Rôle : Réputation des 3 factions, seuils d'hostilité, propagation — logique PURE, testable.
// Étape de création : 10
// Dépendances : EventBus.js ('faction:changed'). Aucune dépendance Phaser.
// Référence : GDD §7 (Oasis neutre/ami, Pillards hostiles, Nomades neutres), TECH_SPEC §4.1 (0-100).

import { EventBus } from '../utils/EventBus.js';

export const FACTIONS = {
  oasis:   { name: "Marchands d'Oasis", base: 50 },
  raiders: { name: 'Pillards de Sael',  base: 0 },
  nomads:  { name: 'Nomades',           base: 50 },
};
export const HOSTILE_THRESHOLD = 25;   // réputation < 25 → hostile (0=hostile, 50=neutre, 100=ami)
export const CRIME_REP_PENALTY = -30;  // attaquer un PNJ de la faction

export class FactionSystem {
  constructor() {
    this.rep = {};
    for (const [k, f] of Object.entries(FACTIONS)) this.rep[k] = f.base;
  }

  modifyRep(faction, delta) {
    if (!(faction in this.rep)) return;
    this.rep[faction] = Math.max(0, Math.min(100, this.rep[faction] + delta));
    EventBus.emit('faction:changed', { faction, rep: this.rep[faction], hostile: this.isHostile(faction) });
  }

  isHostile(faction) { return this.rep[faction] < HOSTILE_THRESHOLD; }
  snapshot() { return { ...this.rep }; }
}
