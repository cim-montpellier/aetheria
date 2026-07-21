// WorldManager.js — Sands of Aetheria
// Rôle : Construction du monde (tilemap + 3 layers) + peuplement (ennemis, PNJ, ressources)
//        + minage/respawn. EXTRAIT de GameScene à l'étape 11 (TOKEN §2.2 : GameScene > 200L).
// Étape de création : 11 (extraction ; logique inchangée, venues de GameScene étapes 3/5/9)
// Dépendances : config.js, entities (Enemy/NPC), data (templates), EventBus.js, Phaser (global)

import { COLORS, WORLD_WIDTH, WORLD_HEIGHT, TILE_SIZE, INTERACT_RANGE, RESOURCE_RESPAWN_MS } from '../config.js';
import { Enemy } from '../entities/Enemy.js';
import { NPC } from '../entities/NPC.js';
import { ENEMY_TEMPLATES } from '../data/enemies.js';
import { NPC_TEMPLATES } from '../data/npcs.js';
import { EventBus } from '../utils/EventBus.js';

const C = (t) => t * TILE_SIZE + TILE_SIZE / 2;   // centre de tuile en px

export class WorldManager {
  constructor(scene) { this.scene = scene; }

  // Tilemap + 3 layers (Ground/Decor/Collision) + collisions + bounds monde
  createWorld() {
    const s = this.scene;
    s.map = s.make.tilemap({ key: 'world' });
    s.tileset = s.map.addTilesetImage('world_tileset', 'world_tileset');
    s.groundLayer = s.map.createLayer('Ground', s.tileset, 0, 0);
    s.decorLayer = s.map.createLayer('Decor', s.tileset, 0, 0);
    s.collisionLayer = s.map.createLayer('Collision', s.tileset, 0, 0);
    s.collisionLayer.setCollisionByExclusion([-1]);      // solide sur toute tuile non-vide
    s.wallsLayer = s.collisionLayer;
    s.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    s.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    s.cameras.main.setBackgroundColor(COLORS.bg);
  }

  // Ennemis par zone + PNJ du Hub (narration systémique, sans quête)
  spawnEntities() {
    const s = this.scene;
    s.enemies = [];
    s.npcs = [];
    const addEnemy = (tpl, tx, ty, id) => {
      if (s.worldState?.killedEnemies?.has(id)) return;   // ennemi tué → ne respawn pas (étape 12)
      const e = new Enemy(s, C(tx), C(ty), ENEMY_TEMPLATES[tpl], id);
      s.enemies.push(e);
      s.physics.add.collider(e.sprite, s.wallsLayer);
    };
    const addNPC = (tpl, tx, ty) => {
      const n = new NPC(s, C(tx), C(ty), NPC_TEMPLATES[tpl]);
      s.npcs.push(n);
      s.physics.add.collider(n.sprite, s.wallsLayer);
    };
    addEnemy('bandit', 28, 12, 'b1'); addEnemy('bandit', 35, 25, 'b2'); addEnemy('bandit', 45, 40, 'b3');   // Plaine
    addEnemy('scorpion', 30, 35, 's1'); addEnemy('scorpion', 50, 15, 's2');
    addEnemy('raider', 66, 15, 'r1'); addEnemy('raider', 72, 30, 'r2'); addEnemy('raider', 68, 42, 'r3');    // Gorges
    addEnemy('boss', 70, 65, 'boss'); addEnemy('raider', 65, 70, 'r4'); addEnemy('raider', 74, 72, 'r5');   // Campement
    addNPC('merchant', 7, 7); addNPC('smith', 5, 14); addNPC('guard', 11, 3); addNPC('guard', 16, 3); addNPC('innkeeper', 15, 14);  // Hub
  }

  // Ressources minables (Rochers/Arbres-cactus/Filons) + respawn 5 min
  spawnResources() {
    const s = this.scene;
    s.resources = [];
    const addNode = (type, tx, ty) => {
      const icon = type === 'stone' ? 'resource_stone' : type === 'wood' ? 'resource_wood' : 'resource_metal';
      const sprite = s.physics.add.sprite(C(tx), C(ty), icon);
      s.resources.push({ sprite, type, depleted: false, respawnAt: 0 });
    };
    addNode('stone', 25, 10); addNode('stone', 33, 20); addNode('stone', 41, 30);
    addNode('wood', 28, 15); addNode('wood', 38, 22);
    addNode('metal', 65, 20); addNode('metal', 70, 35);
    EventBus.on('player:interact', this.onInteract, this);
  }

  onInteract({ x, y }) {
    const s = this.scene;
    let nearest = null, nd = Infinity;
    for (const r of s.resources) {
      if (r.depleted) continue;
      const d = Phaser.Math.Distance.Between(x, y, r.sprite.x, r.sprite.y);
      if (d < INTERACT_RANGE && d < nd) { nd = d; nearest = r; }
    }
    if (nearest) this.mineNode(nearest);
  }

  mineNode(node) {
    const s = this.scene;
    const qty = 1 + Math.floor(Math.random() * 3);                 // 1-3 (GDD §3.3)
    s.player.inventory.addItem(node.type, qty);
    s.player.skills.register('mining');                            // Minage ↑
    EventBus.emit('resource:mined', { type: node.type, qty });
    node.depleted = true;
    node.respawnAt = s.time.now + RESOURCE_RESPAWN_MS;
    node.sprite.setVisible(false);
  }

  checkRespawns() {
    const s = this.scene;
    for (const r of s.resources)
      if (r.depleted && s.time.now >= r.respawnAt) { r.depleted = false; r.sprite.setVisible(true); }
  }
}
