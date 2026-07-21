// MenuScene.js — Sands of Aetheria
// Rôle : Écran titre — Nouvelle Partie / Charger / Options
// Étape de création : 2
// Dépendances : config.js (SCENES, COLORS, SAVE_KEY), Phaser (global)

import { SCENES, COLORS, SAVE_KEY } from '../config.js';
import { SaveSystem } from '../systems/SaveSystem.js';

export class MenuScene extends Phaser.Scene {
  constructor() { super({ key: SCENES.MENU }); }

  create() {
    const cx = this.scale.width / 2;
    this.add.rectangle(cx, this.scale.height / 2, this.scale.width, this.scale.height, COLORS.bg);
    this.add.text(cx, 150, 'SANDS OF AETHERIA', {
      fontFamily: "'Cinzel', Georgia, serif", fontSize: '44px', color: '#c4a35a',
      stroke: '#0f0a06', strokeThickness: 4,
    }).setOrigin(0.5);
    this.add.text(cx, 198, 'Un monde de sable indifférent à votre existence.', {
      fontFamily: "'Share Tech Mono', monospace", fontSize: '13px', color: '#a08060',
    }).setOrigin(0.5);

    // Boutons (GameScene lance UIScene en parallèle au démarrage)
    this.buttons = {};
    this.buttons.newGame = this.makeButton(cx, 290, 'Nouvelle Partie', () => this.scene.start(SCENES.GAME));
    this.loadEnabled = this.hasSave();
    this.buttons.load = this.makeButton(cx, 340, 'Charger', () => this.loadGame(), this.loadEnabled);
    this.buttons.options = this.makeButton(cx, 390, 'Options', () => this.showOptions());
    if (this.loadEnabled) {                                          // date de la sauvegarde (étape 12)
      const info = SaveSystem.getSaveInfo();
      if (info) this.add.text(cx, 362, `Sauvegarde : ${new Date(info.timestamp).toLocaleString()}`,
        { fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: '#a08060' }).setOrigin(0.5);
    }

    this.add.text(cx, 470, 'v0.1 — MVP', {
      fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: '#4a3a2a',
    }).setOrigin(0.5);
  }

  makeButton(x, y, label, onClick, enabled = true) {
    const btn = this.add.rectangle(x, y, 240, 38, enabled ? COLORS.wall : 0x2a1a0a)
      .setStrokeStyle(1, COLORS.panelBorder).setInteractive();
    this.add.text(x, y, label, {
      fontFamily: "'Cinzel', Georgia, serif", fontSize: '16px',
      color: enabled ? '#e8d5b0' : '#4a3a2a',
    }).setOrigin(0.5);
    if (enabled) btn.on('pointerdown', onClick);   // désactivé = pas de handler
    btn.enabled = enabled;
    return btn;
  }

  hasSave() {
    return typeof localStorage !== 'undefined' && !!localStorage.getItem(SAVE_KEY);
  }

  loadGame() {
    const data = SaveSystem.load();
    if (data) this.scene.start(SCENES.GAME, { save: data });   // transmet la sauvegarde à GameScene
  }

  showOptions() {
    // MVP : options minimales. Étendu post-MVP (volume, contrôles).
    this.add.text(this.scale.width / 2, 432, 'Options : plein écran via le navigateur.', {
      fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: '#a08060',
    }).setOrigin(0.5);
  }
}
