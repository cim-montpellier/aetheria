// enemies.js — Sands of Aetheria
// Rôle : Templates de stats des 4 types d'ennemis (TOKEN_BUDGET §8 : max 4 types)
// Étape de création : 5
// Dépendances : aucune (données pures)

export const ENEMY_TEMPLATES = {
  bandit:   { key: 'enemy_bandit',   hp: 40,  speed: 70,  attack: 8,  attackRate: 900,  label: 'Bandit',
              loot: [{ id: 'stone', chance: 0.6, qty: 2 }, { id: 'food', chance: 0.5 }, { id: 'wood_sword', chance: 0.15 }] },
  scorpion: { key: 'enemy_scorpion', hp: 25,  speed: 115, attack: 6,  attackRate: 700,  label: 'Scorpion géant',
              loot: [{ id: 'food', chance: 0.4 }, { id: 'bandage', chance: 0.15 }] },
  raider:   { key: 'enemy_raider',   hp: 70,  speed: 65,  attack: 14, attackRate: 1000, label: 'Pillard armé',
              loot: [{ id: 'metal', chance: 0.6, qty: 2 }, { id: 'potion', chance: 0.3 }, { id: 'metal_sword', chance: 0.15 }] },
  boss:     { key: 'enemy_boss',     hp: 180, speed: 55,  attack: 22, attackRate: 1200, label: 'Chef Pillard', ranged: true,
              loot: [{ id: 'steel_sword', chance: 1 }, { id: 'metal', chance: 1, qty: 3 }, { id: 'big_potion', chance: 1 }] },
};
