// CombatSystem.js — Sands of Aetheria
// Rôle : Résolution des dégâts (formules pures) + feedback visuel (popups, flash, knockback)
// Étape de création : 6
// Dépendances : config.js (INJURY_ARM_RATIO), Phaser (global, pour popups/tweens)
// Les formules sont PURES (testables headless) ; le feedback nécessite une scène.

import { INJURY_ARM_RATIO } from '../config.js';

// ── Constantes de combat (GDD §4.2 / BLUEPRINT étape 6) ─────────
export const LIGHT_COOLDOWN = 400, LIGHT_HITBOX_MS = 200, LIGHT_STAMINA = 5;
export const HEAVY_CHARGE = 800, HEAVY_MULT = 2.5, HEAVY_STAMINA = 20, HEAVY_STUN = 300;
export const PARRY_REDUCTION = 0.4, PARRY_COUNTER_WINDOW = 200, PARRY_STUN = 500, PARRY_STAMINA = 10;
export const DODGE_COOLDOWN = 1200;
export const CRIT_MULT = 1.5;
export const KNOCKBACK_FORCE = 200;

// ── Formules PURES ──────────────────────────────────────────────
/** Dégâts de base : attack × (1 + melee/200) — progression Skyrim. */
export function damageFormula(attack, meleeSkill = 0) { return attack * (1 + meleeSkill / 200); }

/** Chance de coup critique (Mêlée 50 → 0.10, étape 8). */
export function isCrit(chance) { return Math.random() < chance; }

/** Blessure bras (Kenshi) : HP < 15% → dégâts ×0.5. */
export function playerAttackMultiplier(hpRatio) { return hpRatio < INJURY_ARM_RATIO ? 0.5 : 1; }

/** Dégâts finaux (entier, min 1) selon lourd/critique/blessure. */
export function computeDamage({ attack, meleeSkill = 0, heavy = false, crit = false, hpRatio = 1 }) {
  let dmg = damageFormula(attack, meleeSkill);
  if (heavy) dmg *= HEAVY_MULT;
  if (crit) dmg *= CRIT_MULT;
  dmg *= playerAttackMultiplier(hpRatio);
  return Math.max(1, Math.round(dmg));
}

/** Parade : -60% dégâts ; contre-attaque (stun) si parade fraîche (< 200ms). */
export function resolveParry(amount, parrying, parryTime) {
  if (!parrying) return { damage: amount, countered: false };
  return { damage: Math.round(amount * PARRY_REDUCTION), countered: parryTime <= PARRY_COUNTER_WINDOW };
}

// ── Feedback visuel (nécessite une scène) ───────────────────────
/** Popup de dégâts flottant (STYLE_GUIDE §5.3). */
export function showDamagePopup(scene, x, y, amount, crit = false) {
  const text = scene.add.text(x, y - 16, crit ? `CRIT! -${amount}` : `-${amount}`, {
    fontFamily: crit ? "'Cinzel', serif" : "'Share Tech Mono', monospace",
    fontSize: crit ? '20px' : '16px', color: crit ? '#FFD700' : '#FF4444',
    stroke: '#000000', strokeThickness: 2,
  }).setOrigin(0.5);
  scene.tweens.add({ targets: text, y: y - 60, alpha: 0, duration: crit ? 1200 : 800, ease: 'Power2', onComplete: () => text.destroy() });
}

/** Flash rouge sur le sprite touché (100ms). */
export function flashSprite(sprite, scene, color = 0xff4422) {
  sprite.setTint(color);
  scene.time.delayedCall(100, () => sprite.clearTint());
}

/** Recul : pousse la cible loin de la source. */
export function knockback(targetSprite, sourceSprite, force = KNOCKBACK_FORCE) {
  const dx = targetSprite.x - sourceSprite.x, dy = targetSprite.y - sourceSprite.y;
  const len = Math.hypot(dx, dy) || 1;
  targetSprite.body.setVelocity(dx / len * force, dy / len * force);
}
