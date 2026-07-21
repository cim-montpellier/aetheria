// Enemy.js — Sands of Aetheria
// Rôle : Entité ennemi générique — stats, dégâts, mort ; IA déléguée à EnemyStates.js
// Étape de création : 5
// Dépendances : EnemyStates.js (IA), EventBus.js, Phaser (global)
// Note : les 6 états IA sont dans EnemyStates.js (split TOKEN_BUDGET §5.2).

import { setupEnemyAI } from './EnemyStates.js';
import { EventBus } from '../utils/EventBus.js';

export class Enemy {
  constructor(scene, x, y, template, id = null) {
    this.scene = scene;
    this.template = template;
    this.id = id;
    this.sprite = scene.physics.add.sprite(x, y, template.key).setOrigin(0.5);
    this.sprite.body.setCollideWorldBounds(true);
    this.sprite.body.allowGravity = false;
    this.stats = { maxHp: template.hp, speed: template.speed, attack: template.attack, attackRate: template.attackRate };
    this.hp = template.hp;
    this.dead = false;
    this.stunned = false;
    this.attackCooldown = 0;
    this.ai = setupEnemyAI(this);
  }

  hpRatio() { return this.hp / this.stats.maxHp; }

  takeDamage(amount) {
    if (this.dead) return;
    this.hp -= amount;
    EventBus.emit('enemy:hit', { enemy: this, amount });
    if (this.hp <= 0) this.die();
  }

  die() {
    if (this.dead) return;
    this.dead = true;
    this.ai.transition('DEAD');
    EventBus.emit('enemy:dead', { enemy: this });   // loot + worldState.killedEnemies (étapes 6/12)
  }

  /** Coup de mêlée — la résolution des dégâts arrive au CombatSystem (étape 6). */
  attack() {
    EventBus.emit('combat:enemy_attack', { source: this, target: this.scene.player });
  }

  /** Étourdi (contre de parade) : suspend l'IA pendant `ms`. */
  stun(ms) {
    this.stunned = true;
    this.sprite.body.setVelocity(0, 0);
    this.scene.time.delayedCall(ms, () => { this.stunned = false; });
  }

  /** Drop table à la mort : roule le butin du template (étape 7). */
  rollLoot() {
    const drops = [];
    for (const drop of this.template.loot || [])
      if (Math.random() < drop.chance) drops.push({ id: drop.id, qty: drop.qty || 1 });
    return drops;
  }

  update(delta) {
    if (!this.dead && !this.stunned) this.ai.update(delta);
    if (!this.dead) this.sprite.play(`${this.template.key}_idle`, true);   // animation (étape 13)
  }
  destroy() { this.sprite.destroy(); }
}
