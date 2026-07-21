// BootScene.js — Sands of Aetheria
// Rôle : Boot minimal — logo placeholder, compteur FPS, transition PreloadScene
// Étape de création : 1
// Dépendances : config.js (COLORS, SCENES), Phaser (global CDN)

import { COLORS, SCENES } from '../config.js';

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: SCENES.BOOT }); }

  create() {
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    // Logo placeholder (rectangles palette — remplacé par un vrai logo à l'étape 13)
    this.add.rectangle(cx, cy - 30, 220, 64, COLORS.hubSand).setStrokeStyle(2, COLORS.wall);
    this.add.text(cx, cy - 30, 'SANDS OF\nAETHERIA', {
      fontFamily: "'Cinzel', Georgia, serif", fontSize: '26px',
      color: '#1a1208', align: 'center', lineHeight: 30,
    }).setOrigin(0.5);
    this.add.text(cx, cy + 28, 'chargement du désert…', {
      fontFamily: "'Share Tech Mono', monospace", fontSize: '12px', color: '#a08060',
    }).setOrigin(0.5);

    // Compteur FPS custom (coin haut-gauche, au-dessus du jeu)
    this.fpsText = this.add.text(8, 6, 'FPS —', {
      fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: '#e8d5b0',
    }).setScrollFactor(0).setDepth(1000);
    this.time.addEvent({
      delay: 250, loop: true,
      callback: () => this.fpsText.setText(`FPS ${Math.round(this.game.loop.actualFps)}`),
    });

    // Transition vers le Preloader (stub vide à l'étape 1, complété à l'étape 2)
    this.time.delayedCall(900, () => this.scene.start(SCENES.PRELOAD));
  }
}
