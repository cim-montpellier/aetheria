// DayNight.js — Sands of Aetheria
// Rôle : Cycle jour/nuit — ratio temporel, phase, teinte d'ambiance. Logique PURE, testable.
// Étape de création : 11
// Dépendances : config.js (DAY_DURATION_MS). Référence TECH_SPEC §6 + STYLE_GUIDE §6.2.

import { DAY_DURATION_MS } from '../config.js';

export const DAY_PHASES = { dawn: [0, 0.15], day: [0.15, 0.45], dusk: [0.45, 0.60], night: [0.60, 1.0] };
export const DAYNIGHT_TINTS = {           // teintes caméra (STYLE_GUIDE §6.2)
  dawn:  { color: 0xff8c42, alpha: 0.25 },
  day:   { color: 0xffffff, alpha: 0.0 },
  dusk:  { color: 0xff6b35, alpha: 0.35 },
  night: { color: 0x0a1628, alpha: 0.55 },
};

/** Position dans le cycle [0,1) (0=aube, boucle toutes les 5 min). */
export function timeRatio(elapsedMs) { return (elapsedMs % DAY_DURATION_MS) / DAY_DURATION_MS; }

/** Phase courante : 'dawn' | 'day' | 'dusk' | 'night'. */
export function phaseAt(ratio) {
  for (const [phase, [lo, hi]] of Object.entries(DAY_PHASES)) if (ratio >= lo && ratio < hi) return phase;
  return 'night';
}

export function tintAt(ratio) { return DAYNIGHT_TINTS[phaseAt(ratio)]; }
export function isNight(ratio) { return phaseAt(ratio) === 'night'; }
