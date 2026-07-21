// EnemyStates.js — Sands of Aetheria
// Rôle : Les 6 états IA ennemi (IDLE/PATROL/CHASE/ATTACK/FLEE/DEAD) — Steering behaviors
// Étape de création : 5 (extrait de Enemy.js — TOKEN_BUDGET §5.2, Enemy doit rester < 200L)
// Dépendances : AIManager.js (StateMachine), config.js (ranges IA), Phaser (global)
// Note : SEEK = moveToObject, FLEE = direction inverse, WANDER = dérive (pas d'A*).

import { StateMachine } from '../systems/AIManager.js';
import { DETECT_RANGE, ATTACK_RANGE, DISENGAGE_DIST, FLEE_HP_RATIO } from '../config.js';

export function setupEnemyAI(enemy) {
  const sm = new StateMachine(enemy);
  const dist = (e) => Phaser.Math.Distance.Between(e.sprite.x, e.sprite.y, e.scene.player.sprite.x, e.scene.player.sprite.y);
  const detect = (e) => DETECT_RANGE * (e.scene.detectMultiplier || 1);   // vision nocturne -30% (étape 11)

  sm.addState('IDLE', {
    onEnter: (e) => e.sprite.body.setVelocity(0, 0),
    onUpdate: (e, dt, m) => {
      if (dist(e) < detect(e)) return m.transition('CHASE');
      if (m.stateTime > 3000) m.transition('PATROL');
    },
  });

  sm.addState('PATROL', {
    onUpdate: (e, dt, m) => {
      if (dist(e) < detect(e)) return m.transition('CHASE');
      const a = m.stateTime / 400;   // Steering WANDER : dérive sinusoïdale lente
      e.sprite.body.setVelocity(Math.cos(a) * e.stats.speed * 0.4, Math.sin(a) * e.stats.speed * 0.4);
      if (m.stateTime > 2500) m.transition('IDLE');
    },
  });

  sm.addState('CHASE', {
    onUpdate: (e, dt, m) => {
      if (e.hpRatio() < FLEE_HP_RATIO) return m.transition('FLEE');
      const d = dist(e);
      if (d > DISENGAGE_DIST) return m.transition('IDLE');
      if (d < ATTACK_RANGE) return m.transition('ATTACK');
      e.scene.physics.moveToObject(e.sprite, e.scene.player.sprite, e.stats.speed);  // Steering SEEK
    },
  });

  sm.addState('ATTACK', {
    onEnter: (e) => { e.attackCooldown = e.stats.attackRate; e.sprite.body.setVelocity(0, 0); },
    onUpdate: (e, dt, m) => {
      if (e.hpRatio() < FLEE_HP_RATIO) return m.transition('FLEE');
      if (dist(e) > ATTACK_RANGE * 1.6) return m.transition('CHASE');
      e.attackCooldown -= dt;
      if (e.attackCooldown <= 0) { e.attack(); e.attackCooldown = e.stats.attackRate; }
    },
  });

  sm.addState('FLEE', {
    onUpdate: (e, dt, m) => {
      const p = e.scene.player.sprite;   // Steering FLEE : direction opposée au joueur
      const dx = e.sprite.x - p.x, dy = e.sprite.y - p.y, len = Math.hypot(dx, dy) || 1;
      e.sprite.body.setVelocity(dx / len * e.stats.speed, dy / len * e.stats.speed);
      if (m.stateTime > 5000 && e.hpRatio() >= FLEE_HP_RATIO) m.transition('IDLE');
    },
  });

  sm.addState('DEAD', {
    onEnter: (e) => { e.sprite.body.setVelocity(0, 0); e.sprite.body.enable = false; },
    onUpdate: () => {},
  });

  sm.transition('IDLE');
  return sm;
}
