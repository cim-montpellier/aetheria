// SkillSystem.js — Sands of Aetheria
// Rôle : Progression "Learn by Doing" — 7 compétences, gains par l'action throttlés (500ms),
//        formule diminishing, milestones 25/50/75/100. Logique PURE, testable headless.
// Étape de création : 8
// Dépendances : EventBus.js (events skill:milestone / skills:updated). Aucune dépendance Phaser.
// Référence : GDD §6 (formule gain = BASE_GAIN × (1 − level/150)), TECH_SPEC §4.4 (throttle 500ms).

import { EventBus } from '../utils/EventBus.js';

export const SKILLS = {
  melee:     { name: 'Mêlée',      title: 'Guerrier' },
  athletics: { name: 'Athlétisme', title: 'Coureur' },
  endurance: { name: 'Endurance',  title: 'Robuste' },
  stealth:   { name: 'Furtivité',  title: 'Ombre' },
  smithing:  { name: 'Forge',      title: 'Forgeron' },
  mining:    { name: 'Minage',     title: 'Mineur' },
  trade:     { name: 'Commerce',   title: 'Marchand' },
};
export const MILESTONES = [25, 50, 75, 100];
export const BASE_GAIN = 0.15;
export const THROTTLE_MS = 500;

export class SkillSystem {
  constructor() {
    this.levels = {};
    for (const k of Object.keys(SKILLS)) this.levels[k] = 0;
    this.pending = {};      // intensité accumulée entre deux updates
    this.timer = 0;
  }

  /** Gain diminishing (GDD §6.2) : BASE_GAIN × intensity × (1 − level/150). */
  static gainFor(level, intensity = 1) {
    return BASE_GAIN * intensity * (1 - level / 150);
  }

  /** Enregistre une action éligible (appelé par les hooks du joueur). */
  register(skill, intensity = 1) {
    if (!(skill in this.levels)) return;
    this.pending[skill] = (this.pending[skill] || 0) + intensity;
  }

  /** Throttlé à 500ms : consomme les actions en attente et applique les gains. */
  update(delta) {
    this.timer += delta;
    if (this.timer < THROTTLE_MS) return;
    this.timer = 0;
    for (const [skill, intensity] of Object.entries(this.pending)) {
      const before = this.levels[skill];
      const after = Math.min(100, before + SkillSystem.gainFor(before, intensity));
      this.levels[skill] = after;
      this._checkMilestones(skill, before, after);
    }
    this.pending = {};
    EventBus.emit('skills:updated', this.snapshot());
  }

  _checkMilestones(skill, before, after) {
    for (const m of MILESTONES)
      if (before < m && after >= m)
        EventBus.emit('skill:milestone', { skill, level: m, name: SKILLS[skill].name, title: SKILLS[skill].title });
  }

  snapshot() {
    const out = {};
    for (const [k, level] of Object.entries(this.levels))
      out[k] = { level, name: SKILLS[k].name, title: SKILLS[k].title };
    return out;
  }
}
