// ParticleManager.js — Sands of Aetheria
// Rôle : Effets de particules pilotés par événements (impact combat, collecte, mort).
//        Créé à l'étape 13 (extrait du futur code particules de GameScene, TOKEN §2.2).
// Dépendances : EventBus.js, Phaser (global, add.particles). Garde si renderer indisponible.

import { EventBus } from '../utils/EventBus.js';

export class ParticleManager {
  constructor(scene) {
    this.scene = scene;
    this.available = typeof scene.add.particles === 'function';
    this.emitters = {};
    if (this.available) this._create();
    this._bind();
  }

  _create() {
    const s = this.scene;
    this.emitters.impact = s.add.particles(0, 0, 'particle_dust', { speed: { min: 20, max: 80 }, lifespan: 300, quantity: 6, emitting: false });
    this.emitters.pickup = s.add.particles(0, 0, 'particle_glow', { speed: { min: 10, max: 40 }, lifespan: 600, quantity: 8, emitting: false });
    this.emitters.death = s.add.particles(0, 0, 'particle_blood', { speed: { min: 30, max: 100 }, lifespan: 500, quantity: 10, emitting: false });
  }

  _bind() {
    EventBus.on('enemy:hit', (d) => this.burst('impact', d.enemy?.sprite?.x, d.enemy?.sprite?.y), this);
    EventBus.on('enemy:dead', (d) => this.burst('death', d.enemy?.sprite?.x, d.enemy?.sprite?.y), this);
    EventBus.on('item:picked', () => { const p = this.scene.player; if (p) this.burst('pickup', p.sprite.x, p.sprite.y); }, this);
  }

  /** Émet une salve à la position (x,y). No-op si renderer indisponible. */
  burst(key, x, y) {
    const e = this.emitters[key];
    if (!this.available || x == null || !e) return;
    if (e.emitParticleAt) e.emitParticleAt(x, y);
    else { e.setPosition(x, y); e.explode?.(); }
  }
}
