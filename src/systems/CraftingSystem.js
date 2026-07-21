// CraftingSystem.js — Sands of Aetheria
// Rôle : Crafting (recettes) + prix de commerce — logique PURE, testable headless.
// Étape de création : 9
// Dépendances : data/recipes.js, data/items.js, EventBus.js. Aucune dépendance Phaser.
// Référence : GDD §5 (crafting), §6.1 (Commerce : -0.3% achat / +0.3% vente par niveau).

import { RECIPES } from '../data/recipes.js';
import { ITEMS } from '../data/items.js';
import { EventBus } from '../utils/EventBus.js';

// ── Crafting ────────────────────────────────────────────────────
/** Vérifie ingrédients + prérequis de Forge. `skills` = { smithing: niveau }. */
export function canCraft(recipeId, inventory, skills = {}) {
  const r = RECIPES[recipeId];
  if (!r) return false;
  if ((skills.smithing || 0) < (r.level || 0)) return false;
  for (const [ing, qty] of Object.entries(r.ingredients))
    if (!inventory.hasItem(ing, qty)) return false;
  return true;
}

/** Consomme les ingrédients et ajoute le résultat. Retourne true si réussi. */
export function craft(recipeId, inventory, skills = {}) {
  if (!canCraft(recipeId, inventory, skills)) return false;
  const r = RECIPES[recipeId];
  for (const [ing, qty] of Object.entries(r.ingredients)) inventory.removeItem(ing, qty);
  inventory.addItem(r.result, 1);
  inventory.skills?.register?.('smithing');
  EventBus.emit('inventory:changed', inventory.snapshot());
  return true;
}

// ── Prix de commerce (skill Commerce) ───────────────────────────
/** Prix d'achat : -0.3% par niveau de Commerce (min 1). */
export function buyPrice(baseValue, tradeLevel = 0) {
  return Math.max(1, Math.round(baseValue * (1 - 0.003 * tradeLevel)));
}
/** Prix de vente : base 50%, +0.3% par niveau de Commerce (min 1). */
export function sellPrice(baseValue, tradeLevel = 0) {
  return Math.max(1, Math.round(baseValue * 0.5 * (1 + 0.003 * tradeLevel)));
}

export { RECIPES, ITEMS };
