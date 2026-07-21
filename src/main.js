// main.js — Sands of Aetheria
// Rôle : Configuration Phaser 4 + enregistrement des scènes + démarrage
// Étape de création : 1
// Dépendances : config.js, scenes/* (Phaser + Howler chargés en global via CDN)

import { GAME_WIDTH, GAME_HEIGHT, BG_COLOR, DEBUG_MODE } from './config.js';
import { BootScene } from './scenes/BootScene.js';
import { PreloadScene } from './scenes/PreloadScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { UIScene } from './scenes/UIScene.js';
import { GameScene } from './scenes/GameScene.js';

const GameConfig = {
  type: Phaser.WEBGL,                 // WebGL forcé, fallback Canvas auto
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: BG_COLOR,
  pixelArt: true,                     // anti-aliasing OFF (pixel art)
  antialias: false,
  roundPixels: true,
  parent: 'game-container',
  physics: {
    default: 'arcade',                // Arcade uniquement (Matter.js INTERDIT)
    arcade: { gravity: { x: 0, y: 0 }, debug: DEBUG_MODE },  // top-down : 0 gravité
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: { width: 320, height: 180 },
    max: { width: 1920, height: 1080 },
  },
  // 5 scènes : Boot démarre (1re de la liste) ; GameScene + UIScene actives en parallèle.
  scene: [BootScene, PreloadScene, MenuScene, UIScene, GameScene],
};

window.addEventListener('load', () => {
  window.game = new Phaser.Game(GameConfig);
});
