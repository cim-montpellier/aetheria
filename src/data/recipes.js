// recipes.js — Sands of Aetheria
// Rôle : 8 recettes de crafting MVP (TOKEN_BUDGET §8 : max 8). Référence GDD §5.2.
// Étape de création : 9
// Dépendances : aucune (données pures). `level` = prérequis compétence Forge (smithing).

export const RECIPES = {
  wood_sword:    { result: 'wood_sword',    ingredients: { wood: 3 },            level: 0,  station: 'atelier' },
  bandage:       { result: 'bandage',       ingredients: { food: 1 },            level: 0,  station: 'atelier' },
  potion:        { result: 'potion',        ingredients: { food: 2, stone: 1 },  level: 0,  station: 'atelier' },
  leather_armor: { result: 'leather_armor', ingredients: { wood: 5, stone: 2 },  level: 0,  station: 'forge' },
  big_potion:    { result: 'big_potion',    ingredients: { food: 4, crystal: 1 }, level: 15, station: 'atelier' },
  metal_sword:   { result: 'metal_sword',   ingredients: { metal: 4 },           level: 15, station: 'forge' },
  iron_axe:      { result: 'iron_axe',      ingredients: { metal: 6, wood: 2 },  level: 30, station: 'forge' },
  iron_armor:    { result: 'iron_armor',    ingredients: { metal: 8, stone: 2 }, level: 30, station: 'forge' },
};
