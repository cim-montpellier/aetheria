// SaveSystem.js — Sands of Aetheria
// Rôle : Sauvegarde/chargement LocalStorage — sérialisation PlayerState + WorldState, versioning.
// Étape de création : 12
// Dépendances : aucune (localStorage natif, backend INTERDIT). Référence TECH_SPEC §4.3.

export const SAVE_KEY = 'aetheria_save_v1';
export const SAVE_VERSION = '1.0';

const hasLS = () => typeof localStorage !== 'undefined';

export const SaveSystem = {
  /** Sérialise + écrit. worldState.killedEnemies/openedChests (Sets) → tableaux. */
  save(playerState, worldState = {}) {
    const data = {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      player: playerState,
      world: {
        dayCount: worldState.dayCount || 1,
        timeOfDay: worldState.timeOfDay || 0,
        killedEnemies: [...(worldState.killedEnemies || [])],
        openedChests: [...(worldState.openedChests || [])],
        fogOfWar: worldState.fogOfWar ? [...worldState.fogOfWar] : [],
        factions: worldState.factions || {},
      },
    };
    if (hasLS()) localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    return data;
  },

  /** Lit + désérialise (tableaux → Sets). Retourne null si aucune/corrompue. */
  load() {
    if (!hasLS()) return null;
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    try {
      const data = JSON.parse(raw);
      data.world.killedEnemies = new Set(data.world.killedEnemies || []);
      data.world.openedChests = new Set(data.world.openedChests || []);
      data.world.fogOfWar = new Set(data.world.fogOfWar || []);
      return data;
    } catch (e) { return null; }
  },

  hasSave() { return hasLS() && !!localStorage.getItem(SAVE_KEY); },
  deleteSave() { if (hasLS()) localStorage.removeItem(SAVE_KEY); },

  /** Méta-infos pour le menu (date/heure). */
  getSaveInfo() {
    if (!hasLS()) return null;
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    try { const d = JSON.parse(raw); return { timestamp: d.timestamp, version: d.version }; } catch (e) { return null; }
  },
};
