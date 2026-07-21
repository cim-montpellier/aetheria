// CombatManager.js — Sands of Aetheria
// Rôle : Résolution de combat en jeu — overlaps joueur/ennemis, projectiles, drop/loot.
//        EXTRAIT de GameScene.js à l'étape 13 (TOKEN §2.2 — GameScene > 200L).
// Étape de création : 13 (extraction ; logique de l'étape 6, inchangée)
// Dépendances : config.js, Projectile, CombatSystem, ObjectPool, EventBus, Phaser (global)

import { ATTACK_RANGE } from '../config.js';
import { Projectile } from '../entities/Projectile.js';
import * as Combat from '../systems/CombatSystem.js';
import { ObjectPool } from '../utils/ObjectPool.js';
import { EventBus } from '../utils/EventBus.js';

export class CombatManager {
  constructor(scene) { this.scene = scene; }

  setup() {
    const s = this.scene;
    for (const e of s.enemies) s.physics.add.overlap(s.player.attackHitbox, e.sprite, () => this.playerHitsEnemy(e));
    EventBus.on('combat:enemy_attack', this.onEnemyAttack, this);
    EventBus.on('enemy:dead', this.onEnemyDead, this);
    s.projectilePool = new ObjectPool(() => new Projectile(s), () => {}, 10).prewarm(5);
  }

  playerHitsEnemy(enemy) {
    const s = this.scene;
    if (!s.player.attacking || enemy.dead || enemy._hitThisSwing) return;   // 1 coup / swing
    enemy._hitThisSwing = true;
    s.time.delayedCall(Combat.LIGHT_HITBOX_MS, () => { enemy._hitThisSwing = false; });
    const { amount, crit } = s.player.currentDamage(s.player.attacking);
    enemy.takeDamage(amount);
    Combat.showDamagePopup(s, enemy.sprite.x, enemy.sprite.y, amount, crit);
    Combat.flashSprite(enemy.sprite, s, 0xff4422);
    Combat.knockback(enemy.sprite, s.player.sprite);
    s.cameras.main.shake(120, 0.003);
  }

  onEnemyAttack({ source, target }) {
    if (!target || target.dead || target.invincible) return;
    if (source.template.ranged) { this.spawnProjectile(source); return; }   // boss : tir poolé
    const d = Phaser.Math.Distance.Between(source.sprite.x, source.sprite.y, target.sprite.x, target.sprite.y);
    if (d < ATTACK_RANGE * 1.5) target.takeDamage(source.stats.attack, source);
  }

  onEnemyDead({ enemy }) {
    const s = this.scene;
    if (enemy.id) s.worldState.killedEnemies.add(enemy.id);                 // mort persistée (étape 12)
    s.tweens.add({ targets: enemy.sprite, alpha: 0, duration: 500, onComplete: () => enemy.sprite.setVisible(false) });
    for (const drop of enemy.rollLoot()) {                                  // drop table → auto-loot
      const leftover = s.player.inventory.addItem(drop.id, drop.qty);
      if (drop.qty - leftover > 0) EventBus.emit('item:picked', { id: drop.id, qty: drop.qty - leftover });
    }
  }

  spawnProjectile(source) {
    const s = this.scene;
    const p = s.projectilePool.acquire();
    if (p) p.fire(source.sprite.x, source.sprite.y, s.player.sprite.x, s.player.sprite.y, 220, source.stats.attack);
  }

  updateProjectiles(delta) {
    const s = this.scene;
    for (const p of [...s.projectilePool.active]) {
      p.update(delta);
      if (!p.active) { s.projectilePool.release(p); continue; }
      if (Phaser.Math.Distance.Between(p.sprite.x, p.sprite.y, s.player.sprite.x, s.player.sprite.y) < 20) {
        s.player.takeDamage(p.damage, p.sprite);
        p.expire(); s.projectilePool.release(p);
      }
    }
  }
}
