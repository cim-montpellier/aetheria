// PlayerCombat.js — Sands of Aetheria
// Rôle : Actions de combat du joueur (attaques, esquive, dégâts reçus, mort/respawn).
//        Mixin appliqué sur Player.prototype — EXTRAIT de Player.js à l'étape 13 (TOKEN §2.2).
// Étape de création : 13 (extraction ; logique issue de l'étape 6, inchangée)
// Dépendances : config.js, worldZones.js, CombatSystem.js, EventBus.js

import { PLAYER_STAMINA_MAX, DODGE_COST, DODGE_SPEED, DODGE_INVULN_MS } from '../config.js';
import { PLAYER_SPAWN } from '../data/worldZones.js';
import * as Combat from '../systems/CombatSystem.js';
import { EventBus } from '../utils/EventBus.js';

export const PlayerCombat = {
  lightAttack() {
    if (this.attackCooldown > 0 || this.charging || this.stamina < Combat.LIGHT_STAMINA) return;
    this.stamina -= Combat.LIGHT_STAMINA;
    this.attackCooldown = Combat.LIGHT_COOLDOWN;
    this.swing('light');
  },
  heavyAttack() {
    if (this.attackCooldown > 0 || this.charging || this.stamina < Combat.HEAVY_STAMINA) return;
    this.stamina -= Combat.HEAVY_STAMINA;
    this.charging = true;
    this.scene.time.delayedCall(Combat.HEAVY_CHARGE, () => { this.charging = false; this.swing('heavy'); });
  },
  swing(type) {
    this.attacking = type;
    this.skills.register('melee');                              // frapper ↑ Mêlée
    this._updateHitbox();
    this.scene.time.delayedCall(Combat.LIGHT_HITBOX_MS, () => { this.attacking = null; this.attackHitbox.body.enable = false; });
    EventBus.emit('player:attack', { type, x: this.sprite.x, y: this.sprite.y });
  },
  _updateHitbox() {
    const off = 28;
    this.attackHitbox.setPosition(this.sprite.x + this.facing.x * off, this.sprite.y + this.facing.y * off);
    this.attackHitbox.body.enable = true;
  },
  /** Dégâts du swing courant : { amount, crit }. */
  currentDamage(type) {
    const crit = Combat.isCrit(this.critChance);
    const amount = Combat.computeDamage({ attack: this.totalAttack(), meleeSkill: this.meleeSkill, heavy: type === 'heavy', crit, hpRatio: this.hp / this.hpMax });
    return { amount, crit };
  },
  dodge(cmd) {
    this.stamina -= DODGE_COST;
    this.invincible = true;
    this.skills.register('athletics');                          // esquiver ↑ Athlétisme
    const dx = cmd.moveX || this.facing.x, dy = cmd.moveY || this.facing.y;
    this.sprite.body.setVelocity(dx * DODGE_SPEED, dy * DODGE_SPEED);
    this.scene.time.delayedCall(DODGE_INVULN_MS, () => { this.invincible = false; });
  },
  takeDamage(amount, source = null) {
    if (this.invincible || this.dead) return;
    this.skills.register('endurance');                          // subir/parer ↑ Endurance
    let dmg = amount;
    if (this.parrying) {
      const r = Combat.resolveParry(amount, true, this.parryTime);
      dmg = r.damage;
      if (r.countered && source?.stun) { source.stun(Combat.PARRY_STUN); EventBus.emit('combat:parry_counter', { source }); }
    }
    dmg = Math.max(1, dmg - this.inventory.equippedStats().defense);   // réduction d'armure
    this.hp -= dmg;
    EventBus.emit('player:hp_changed', { current: Math.max(0, this.hp), max: this.hpMax, ratio: this.hp / this.hpMax });
    Combat.flashSprite(this.sprite, this.scene, 0xff0000);
    this.scene.cameras.main.shake(150, 0.005);                    // screen shake (STYLE_GUIDE §6.4)
    if (source?.sprite) Combat.knockback(this.sprite, source.sprite);
    if (this.hp <= 0) { this.hp = 0; this.die(); }
  },
  die() {
    if (this.dead) return;
    this.dead = true;
    this.sprite.body.setVelocity(0, 0);
    this.loseHalfItems();                                       // pénalité Kenshi : -50% items
    EventBus.emit('player:dead', {});                           // écran Game Over (HUD)
    this.scene.time.delayedCall(1500, () => this.respawn());
  },
  respawn() {
    this.dead = false;
    this.hp = 25;                                               // GDD §4.3 : respawn affaibli
    this.stamina = PLAYER_STAMINA_MAX;
    this.gold = Math.floor(this.gold / 2);                      // pénalité Kenshi : -50% or
    this.sprite.setPosition(PLAYER_SPAWN.x, PLAYER_SPAWN.y);
    this.invincible = true;
    this.scene.time.delayedCall(1500, () => { this.invincible = false; });
    EventBus.emit('player:respawn', { gold: this.gold });
  },
};
