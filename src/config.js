// config.js — Sands of Aetheria
// Rôle : Constantes globales du projet (module pur, sans dépendance Phaser)
// Étape de création : 1
// Dépendances : aucune
// ⚠️ Ne jamais référencer le global `Phaser` ici : ce module est importé par
//    les tests headless (node) qui ne chargent pas Phaser.

// ── Moteur / Affichage ──────────────────────────────────────────
export const GAME_VERSION = '0.1.0';
export const GAME_WIDTH = 960;          // px — ratio 16:9
export const GAME_HEIGHT = 540;         // px
export const BG_COLOR = '#1a1208';      // Fond Nuit (STYLE_GUIDE §2.1)
export const DEBUG_MODE = true;         // → false à l'étape 15 (release)

// ── Monde (tilemap UNIQUE 80x80 — chunk loading INTERDIT) ───────
export const TILE_SIZE = 32;            // px
export const WORLD_TILES_X = 80;
export const WORLD_TILES_Y = 80;
export const WORLD_WIDTH = WORLD_TILES_X * TILE_SIZE;   // 2560
export const WORLD_HEIGHT = WORLD_TILES_Y * TILE_SIZE;  // 2560

// ── Joueur (Kenshi : on démarre "nobody", affaibli) ─────────────
export const PLAYER_WALK_SPEED = 120;   // px/s
export const PLAYER_RUN_SPEED = 200;    // px/s — consomme l'endurance
export const PLAYER_HP_MAX = 100;
export const PLAYER_HP_START = 50;      // GDD §4.3 : départ blessé
export const PLAYER_STAMINA_MAX = 80;
export const PLAYER_START_GOLD = 15;
// ── Joueur : endurance / esquive / blessures (étape 4) ──────────
export const STAMINA_RUN_DRAIN = 12;     // endurance/s en course
export const STAMINA_REGEN = 10;         // endurance/s au repos
export const STAMINA_REGEN_DELAY = 1000; // ms de repos avant régén (XML: 1s)
export const DODGE_COST = 25;            // GDD §4.2
export const DODGE_SPEED = 320;          // px/s pendant le dash (~80px sur 0.25s)
export const DODGE_INVULN_MS = 300;      // GDD §4.2 : invincibilité 0.3s
export const INJURY_LEG_RATIO = 0.30;    // HP < 30% → vitesse -30% (jambe)
export const INJURY_ARM_RATIO = 0.15;    // HP < 15% → attaque -50% (bras, utilisé étape 6)
export const INTERACT_RANGE = 48;        // rayon d'interaction E en px (GDD §3.2)

// ── IA ennemie (Steering Behaviors — valeurs TECH_SPEC §5.2) ────
export const DETECT_RANGE = 150;        // px — IDLE/PATROL → CHASE
export const ATTACK_RANGE = 45;         // px — CHASE → ATTACK
export const DISENGAGE_DIST = 220;      // px — CHASE → IDLE
export const FLEE_HP_RATIO = 0.20;      // hp/maxHp < 0.20 → FLEE

// ── Cycle jour/nuit ─────────────────────────────────────────────
export const DAY_DURATION_MS = 300_000; // 5 min réelles = 1 jour Aetheria
export const RESOURCE_RESPAWN_MS = 300_000; // 5 min réelles (GDD §3.3 : respawn ressources)

// ── Sauvegarde (localStorage — backend INTERDIT) ────────────────
export const SAVE_KEY = 'aetheria_save_v1';
export const SETTINGS_KEY = 'aetheria_settings_v1';

// ── Palette (STYLE_GUIDE §2 — jamais de couleur hors-palette) ───
export const COLORS = {
  bg: 0x1a1208,
  // Sols / zones
  hubSand: 0xc4a35a, hubPath: 0xd4a96a, plainAsh: 0x8b7355,
  gorgeRock: 0x5c4a2a, campDirt: 0x3d2b1a, wall: 0x7a5c35, water: 0x1a4a6b,
  // Joueur
  playerBody: 0x6b4a2a, playerSkin: 0xc4956a,
  // UI / HUD
  hpFull: 0xcc2222, hpCrit: 0xff4444, stamina: 0x2288cc,
  gold: 0xffd700, textMain: 0xe8d5b0, textDim: 0xa08060,
  panelBg: 0x0f0a06, panelBorder: 0x3a2a1a,
};

// ── Clés d'enregistrement des scènes ────────────────────────────
export const SCENES = {
  BOOT: 'BootScene', PRELOAD: 'PreloadScene', MENU: 'MenuScene',
  UI: 'UIScene', GAME: 'GameScene',
};
