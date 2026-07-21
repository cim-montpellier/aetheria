// npcs.js — Sands of Aetheria
// Rôle : Données des PNJ du Hub Oasis de Kaleth (4 templates ; le garde est spawné ×2)
// Étape de création : 5 (stock commerce ét.9, faction ét.10)
// Dépendances : aucune (données pures). Waypoints en pixels (centre de tuile).

const T = 32;
const C = (t) => t * T + T / 2;   // centre d'une tuile en pixels

export const NPC_TEMPLATES = {
  merchant:  { key: 'npc_merchant',  speed: 40, label: 'Marchand',   faction: 'oasis', waypoints: [[C(6), C(6)], [C(13), C(6)]],
               stock: [{ id: 'potion', qty: 5 }, { id: 'bandage', qty: 5 }, { id: 'food', qty: 10 }, { id: 'wood_sword', qty: 3 }, { id: 'leather_armor', qty: 2 }] },
  smith:     { key: 'npc_smith',     speed: 40, label: 'Forgeron',   faction: 'oasis', waypoints: [[C(5), C(13)], [C(5), C(16)]],
               stock: [{ id: 'metal_sword', qty: 2 }, { id: 'iron_axe', qty: 1 }, { id: 'iron_armor', qty: 1 }, { id: 'potion', qty: 3 }] },
  guard:     { key: 'npc_guard',     speed: 55, label: 'Garde',      faction: 'oasis', waypoints: [[C(10), C(3)], [C(16), C(3)]] },
  innkeeper: { key: 'npc_innkeeper', speed: 35, label: 'Aubergiste', faction: 'oasis', waypoints: [[C(14), C(14)], [C(17), C(14)]],
               stock: [{ id: 'food', qty: 10 }, { id: 'bandage', qty: 5 }, { id: 'potion', qty: 5 }] },
};
