// Projectile.js — Sands of Aetheria
// Rôle : Projectile poolé (ennemis à distance, ex. chef pillard) — anti-GC (TOKEN §4.1)
// Étape de création : 6
// Dépendances : Phaser (global). Gérés via ObjectPool dans GameScene.

export class Projectile {
  constructor(scene) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(0, 0, 'item_gold_coin').setOrigin(0.5);  // placeholder
    this.sprite.body.allowGravity = false;
    this.sprite.setVisible(false);
    this.active = false;
    this.damage = 0;
    this.life = 0;
  }

  /** Tire de (x,y) vers (tx,ty) à `speed` px/s, `damage` dégâts, vie 2s. */
  fire(x, y, tx, ty, speed, damage) {
    this.sprite.setPosition(x, y);
    const dx = tx - x, dy = ty - y, len = Math.hypot(dx, dy) || 1;
    this.sprite.body.setVelocity(dx / len * speed, dy / len * speed);
    this.damage = damage;
    this.life = 2000;
    this.active = true;
    this.sprite.setVisible(true);
    this.sprite.body.enable = true;
  }

  update(delta) {
    if (!this.active) return;
    this.life -= delta;
    if (this.life <= 0) this.expire();
  }

  expire() {
    this.active = false;
    this.sprite.body.setVelocity(0, 0);
    this.sprite.body.enable = false;
    this.sprite.setVisible(false);
  }
}
