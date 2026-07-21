// PlaceholderFactory.js — Sands of Aetheria
// Rôle : Génère TOUTES les textures placeholder (Phaser Graphics) — palette STYLE_GUIDE
// Étape de création : 2 (externalisé depuis PreloadScene — TOKEN_BUDGET §2.2)
// Dépendances : config.js (COLORS), Phaser (global, via scene.make.graphics)
// ⚡ ASSETS_PLAN : un asset manquant ne bloque jamais → placeholder systématique.
//    Remplacé par les vrais spritesheets CC0 à l'étape 13.

import { COLORS } from '../config.js';

export const PlaceholderFactory = {
  // Personnage : corps + bord + triangle indicateur de direction
  createCharacter(scene, key, w, h, body, accent) {
    const g = scene.make.graphics({ add: false });
    g.fillStyle(body, 1); g.fillRect(2, 2, w - 4, h - 4);
    g.lineStyle(1, accent, 1); g.strokeRect(2, 2, w - 4, h - 4);
    g.fillStyle(accent, 0.8); g.fillTriangle(w / 2, 2, w / 2 - 4, 10, w / 2 + 4, 10);
    g.generateTexture(key, w, h); g.destroy();
  },
  // Ressource (cercle + reflet)
  createResource(scene, key, size, color) {
    const g = scene.make.graphics({ add: false });
    g.fillStyle(color, 1); g.fillCircle(size / 2, size / 2, size / 2 - 2);
    g.lineStyle(2, 0x000000, 0.5); g.strokeCircle(size / 2, size / 2, size / 2 - 2);
    g.fillStyle(0xffffff, 0.2); g.fillCircle(size / 3, size / 3, size / 6);
    g.generateTexture(key, size, size); g.destroy();
  },
  // Item au sol (aura + corps)
  createItemPickup(scene, key, size, color) {
    const g = scene.make.graphics({ add: false });
    g.fillStyle(color, 0.2); g.fillCircle(size / 2, size / 2, size / 2);
    g.fillStyle(color, 1); g.fillRect(size / 4, size / 4, size / 2, size / 2);
    g.lineStyle(1, 0xffffff, 0.5); g.strokeRect(size / 4, size / 4, size / 2, size / 2);
    g.generateTexture(key, size, size); g.destroy();
  },
  // Tuile 32x32 (plain / rocky / wall)
  createTile(scene, key, color, pattern = 'plain') {
    const g = scene.make.graphics({ add: false });
    g.fillStyle(color, 1); g.fillRect(0, 0, 32, 32);
    if (pattern === 'rocky') {
      g.fillStyle(0x000000, 0.15); g.fillRect(4, 8, 6, 4); g.fillRect(18, 14, 8, 5); g.fillRect(10, 22, 5, 4);
    } else if (pattern === 'wall') {
      g.lineStyle(1, 0x000000, 0.3); g.lineBetween(0, 10, 32, 10); g.lineBetween(0, 21, 32, 21); g.lineBetween(16, 0, 16, 10);
    }
    g.generateTexture(key, 32, 32); g.destroy();
  },
  // Génère l'ensemble des placeholders (appelé dans PreloadScene.preload)
  createAll(scene) {
    const C = COLORS, f = PlaceholderFactory;
    f.createCharacter(scene, 'player', 24, 32, C.playerBody, C.playerSkin);
    f.createCharacter(scene, 'enemy_bandit', 24, 28, 0xcc2200, 0xff4422);
    f.createCharacter(scene, 'enemy_scorpion', 20, 20, 0xff6600, 0xffaa00);
    f.createCharacter(scene, 'enemy_raider', 26, 32, 0x880000, 0xcc2222);
    f.createCharacter(scene, 'enemy_boss', 36, 40, 0x2a1a1a, 0xff0000);
    f.createCharacter(scene, 'npc_merchant', 24, 32, 0x4a7acc, 0x88aaff);
    f.createCharacter(scene, 'npc_smith', 24, 32, 0xcc7722, 0xffaa44);
    f.createCharacter(scene, 'npc_guard', 24, 32, 0x7a7a7a, 0xaaaaaa);
    f.createCharacter(scene, 'npc_innkeeper', 24, 32, 0x7a3daa, 0xaa66ff);
    f.createTile(scene, 'tile_hub_sand', C.hubSand); f.createTile(scene, 'tile_hub_path', C.hubPath);
    f.createTile(scene, 'tile_plain_ash', C.plainAsh, 'rocky'); f.createTile(scene, 'tile_gorge_rock', C.gorgeRock, 'rocky');
    f.createTile(scene, 'tile_camp_dirt', C.campDirt); f.createTile(scene, 'tile_wall', C.wall, 'wall');
    f.createTile(scene, 'tile_water', C.water);
    f.createResource(scene, 'resource_stone', 24, 0x888888); f.createResource(scene, 'resource_wood', 24, 0x8b5a2b);
    f.createResource(scene, 'resource_metal', 24, 0xaaaaaa); f.createResource(scene, 'resource_food', 20, 0xff4444);
    f.createItemPickup(scene, 'item_wood_sword', 20, 0xc8a060); f.createItemPickup(scene, 'item_metal_sword', 20, 0xdddddd);
    f.createItemPickup(scene, 'item_leather_armor', 20, 0x8b6914); f.createItemPickup(scene, 'item_potion', 16, 0xff0088);
    f.createItemPickup(scene, 'item_gold_coin', 14, C.gold);
    // Particules (placeholder — petits disques, étape 13)
    f.createResource(scene, 'particle_dust', 6, 0xc4a35a);
    f.createResource(scene, 'particle_glow', 6, 0xffd700);
    f.createResource(scene, 'particle_blood', 6, 0x8b0000);
  },
};
