// PreloadScene.js — Sands of Aetheria
// Rôle : Chargement des assets — barre de progression + génération des placeholders
// Étape de création : 1 (stub) → 2 (implémentation réelle)
// Dépendances : config.js (SCENES, COLORS), PlaceholderFactory, Phaser (global)
// RÉÉCRITURE COMPLÈTE (étape 2) — Raison : stub étape 1 remplacé par le vrai preloader.

import { SCENES, COLORS } from '../config.js';
import { PlaceholderFactory } from '../utils/PlaceholderFactory.js';

export class PreloadScene extends Phaser.Scene {
  constructor() { super({ key: SCENES.PRELOAD }); }

  preload() {
    // Barre de progression (sert au chargement des assets réels à l'étape 13)
    const cx = this.scale.width / 2, cy = this.scale.height / 2;
    this.add.rectangle(cx, cy, 320, 16, COLORS.panelBg).setStrokeStyle(1, COLORS.panelBorder);
    this.barFill = this.add.rectangle(cx - 158, cy, 4, 12, COLORS.gold).setOrigin(0, 0.5);
    this.load.on('progress', (v) => this.barFill.setSize(4 + 312 * v, 12));

    // Tilemap du monde (Tiled JSON) + tileset — générés par tools/gen_tilemap.js
    this.load.tilemapTiledJSON('world', 'assets/tilemaps/world.json');
    this.load.image('world_tileset', 'assets/tilemaps/world_tileset.png');

    // Placeholders procéduraux (instantanés) — remplacés par les assets CC0 à l'étape 13.
    PlaceholderFactory.createAll(this);
    // Étape 13 — charger les vrais assets par-dessus les placeholders :
    // this.load.spritesheet('player', 'assets/sprites/player.webp', { frameWidth: 24, frameHeight: 32 });
  }

  create() {
    this.setupAnimations();
    this.add.text(this.scale.width / 2, this.scale.height / 2 - 40, 'Désert chargé…', {
      fontFamily: "'Share Tech Mono', monospace", fontSize: '12px', color: '#a08060',
    }).setOrigin(0.5);
    // Transition vers le menu principal
    this.time.delayedCall(400, () => this.scene.start(SCENES.MENU));
  }

  // Animations (placeholder 1 frame ; vrais spritesheets multi-frames = assets CC0, ASSETS_PLAN §3.1)
  setupAnimations() {
    const a = this.anims;
    a.create({ key: 'idle', frames: [{ key: 'player' }], frameRate: 1 });
    a.create({ key: 'walk', frames: [{ key: 'player' }], frameRate: 8 });
    a.create({ key: 'run', frames: [{ key: 'player' }], frameRate: 12 });
    a.create({ key: 'attack', frames: [{ key: 'player' }], frameRate: 10 });
    for (const k of ['enemy_bandit', 'enemy_scorpion', 'enemy_raider', 'enemy_boss'])
      a.create({ key: k + '_idle', frames: [{ key: k }], frameRate: 1 });
  }
}
