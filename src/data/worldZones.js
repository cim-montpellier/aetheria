// worldZones.js — Sands of Aetheria
// Rôle : Logique PURE du layout du monde (zones, sol, collisions, décor) — 80x80
// Étape de création : 3
// Dépendances : aucune (module pur — importable par le générateur ET les tests)
// Source de vérité : BLUEPRINT §Étape3 (coords zones) + GDD §3.1/§8 (contenu zones).

export const TILES_X = 80, TILES_Y = 80, TILE = 32;

// GID des tuiles (1-based ; 0 = vide). Index tileset = GID - 1.
export const GID = {
  HUB_SAND: 1, PLAINE_ASH: 2, GORGE_ROCK: 3, CAMP_DIRT: 4,
  WALL: 5, WATER: 6, HUB_PATH: 7, DECOR_ROCK: 8, DECOR_CACTUS: 9,
};
export const TILESET_COUNT = 9;

// Rectangles de zones (BLUEPRINT). La Plaine sert de base (wilderness dominante).
export const ZONES = {
  hub:       { x0: 0,  y0: 0,  x1: 19, y1: 19, gid: GID.HUB_SAND,   color: 0xc4a35a },
  plaine:    { x0: 20, y0: 0,  x1: 59, y1: 49, gid: GID.PLAINE_ASH, color: 0x8b7355 },
  gorges:    { x0: 60, y0: 0,  x1: 79, y1: 79, gid: GID.GORGE_ROCK, color: 0x5c4a2a },
  campement: { x0: 60, y0: 50, x1: 79, y1: 79, gid: GID.CAMP_DIRT,  color: 0x3d2b1a },
};

// Oasis (eau) au cœur du Hub ; spawn joueur au sud de l'oasis (près du puits).
export const HUB_OASIS = { x0: 8, y0: 8, x1: 11, y1: 11 };
export const PLAYER_SPAWN = { x: 10 * TILE + TILE / 2, y: 14 * TILE + TILE / 2 };

/** Identifiant de zone pour une tuile (priorité : campement > gorges > hub > plaine). */
export function zoneAt(tx, ty) {
  const { campement, gorges, hub } = ZONES;
  if (tx >= campement.x0 && tx <= campement.x1 && ty >= campement.y0 && ty <= campement.y1) return 'campement';
  if (tx >= gorges.x0 && tx <= gorges.x1 && ty >= gorges.y0 && ty <= gorges.y1) return 'gorges';
  if (tx >= hub.x0 && tx <= hub.x1 && ty >= hub.y0 && ty <= hub.y1) return 'hub';
  return 'plaine';
}

/** GID de sol (Ground) pour une tuile. */
export function groundGidAt(tx, ty) {
  if (tx >= HUB_OASIS.x0 && tx <= HUB_OASIS.x1 && ty >= HUB_OASIS.y0 && ty <= HUB_OASIS.y1) return GID.WATER;
  return ZONES[zoneAt(tx, ty)].gid;
}

/** Cette tuile est-elle solide (couche Collision) ? */
export function isCollision(tx, ty) {
  if (tx <= 0 || ty <= 0 || tx >= TILES_X - 1 || ty >= TILES_Y - 1) return true;   // bordure monde
  const z = zoneAt(tx, ty);
  if (z === 'campement') {                                                          // palissade + entrée nord
    const c = ZONES.campement;
    const onEdge = tx === c.x0 + 1 || tx === c.x1 - 1 || ty === c.y0 + 1 || ty === c.y1 - 1;
    const gate = ty === c.y0 + 1 && tx >= 68 && tx <= 71;
    if (onEdge && !gate) return true;
  }
  if ((z === 'plaine' || z === 'gorges') && tx > 2 && ty > 2 && (tx * 7 + ty * 13) % 53 === 0) return true; // rochers épars
  return false;
}

/** GID de décor (Decor) pour une tuile (0 = rien). */
export function decorGidAt(tx, ty) {
  if (isCollision(tx, ty) || zoneAt(tx, ty) === 'hub') return 0;
  if ((tx * 11 + ty * 5) % 41 === 0) return GID.DECOR_ROCK;
  if (zoneAt(tx, ty) === 'plaine' && (tx * 3 + ty * 17) % 67 === 0) return GID.DECOR_CACTUS;
  return 0;
}
