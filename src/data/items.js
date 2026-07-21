// items.js — Sands of Aetheria
// Rôle : Définitions des 15 items MVP (armes, armures, consommables, ressources)
// Étape de création : 7
// Dépendances : aucune (données pures). TOKEN_BUDGET §8 : max 15 items MVP.
// type: weapon(attack) | armor(defense) | consumable(heal) | resource(craft) | accessory

export const ITEMS = {
  // ── Ressources (empilables, servent au craft — étape 9) ──
  stone:         { id: 'stone',         name: 'Pierre',        type: 'resource',   icon: 'resource_stone',     value: 2,  stack: 99 },
  wood:          { id: 'wood',          name: 'Bois-Sec',      type: 'resource',   icon: 'resource_wood',      value: 3,  stack: 99 },
  metal:         { id: 'metal',         name: 'Métal Brut',    type: 'resource',   icon: 'resource_metal',     value: 8,  stack: 99 },
  crystal:       { id: 'crystal',       name: 'Cristal Rare',  type: 'resource',   icon: 'item_potion',        value: 50, stack: 10 },
  // ── Consommables (soin) ──
  food:          { id: 'food',          name: 'Nourriture',    type: 'consumable', icon: 'resource_food',      value: 5,  stack: 10, heal: 10 },
  bandage:       { id: 'bandage',       name: 'Bandage',       type: 'consumable', icon: 'item_potion',        value: 12, stack: 5,  heal: 20 },
  potion:        { id: 'potion',        name: 'Potion de Soin', type: 'consumable', icon: 'item_potion',        value: 25, stack: 5,  heal: 40 },
  big_potion:    { id: 'big_potion',    name: 'Grande Potion', type: 'consumable', icon: 'item_potion',        value: 60, stack: 3,  heal: 80 },
  // ── Armes (bonus d'attaque) ──
  wood_sword:    { id: 'wood_sword',    name: 'Épée de Bois',  type: 'weapon',     icon: 'item_wood_sword',    value: 15,  stack: 1, attack: 5 },
  metal_sword:   { id: 'metal_sword',   name: 'Épée de Métal', type: 'weapon',     icon: 'item_metal_sword',   value: 60,  stack: 1, attack: 12 },
  iron_axe:      { id: 'iron_axe',      name: 'Hache de Fer',  type: 'weapon',     icon: 'item_metal_sword',   value: 90,  stack: 1, attack: 16 },
  steel_sword:   { id: 'steel_sword',   name: "Épée d'Acier",  type: 'weapon',     icon: 'item_metal_sword',   value: 150, stack: 1, attack: 20 },
  // ── Armures (réduction de dégâts) ──
  ragged_tunic:  { id: 'ragged_tunic',  name: 'Tunique Usée',  type: 'armor',      icon: 'item_leather_armor', value: 10,  stack: 1, defense: 2 },
  leather_armor: { id: 'leather_armor', name: 'Armure de Cuir', type: 'armor',      icon: 'item_leather_armor', value: 40,  stack: 1, defense: 5 },
  iron_armor:    { id: 'iron_armor',    name: 'Armure de Fer', type: 'armor',      icon: 'item_leather_armor', value: 120, stack: 1, defense: 12 },
};

export const EQUIP_SLOTS = ['weapon', 'armor', 'accessory'];
