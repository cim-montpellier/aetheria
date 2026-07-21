// UIScene.js — Sands of Aetheria
// Rôle : HUD superposé (overlay) — lancé en parallèle de GameScene.
//        Inventaire (toggle I) branché à l'étape 7.
// Étape de création : 2 (inventaire ajouté étape 7)
// Dépendances : config.js, ui/InventoryUI.js, EventBus.js, Phaser (global)
// Communication avec GameScene UNIQUEMENT via EventBus (jamais d'accès direct).

import { SCENES } from '../config.js';
import { InventoryUI } from '../ui/InventoryUI.js';
import { SkillsUI } from '../ui/SkillsUI.js';
import { ShopUI } from '../ui/ShopUI.js';
import { HUD } from '../ui/HUD.js';
import { SkillSystem } from '../systems/SkillSystem.js';
import { EventBus } from '../utils/EventBus.js';

export class UIScene extends Phaser.Scene {
  constructor() { super({ key: SCENES.UI }); }

  create() {
    // Placeholder HUD (barres HP/endurance/minimap à l'étape 10)
    this.add.text(16, this.scale.height - 24, 'HUD — étape 10 · [I] Inventaire', {
      fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: '#a08060',
    }).setScrollFactor(0).setDepth(1000);

    // Inventaire — découplé du joueur via EventBus (snapshot + actions)
    this.invSnapshot = { items: [], equipped: { weapon: null, armor: null, accessory: null }, gold: 0, maxSlots: 24 };
    this.inventoryUI = new InventoryUI(this);
    EventBus.on('inventory:changed', (snap) => {
      this.invSnapshot = snap;
      if (this.inventoryUI.visible) this.inventoryUI.render(snap);
    }, this);
    this.input.keyboard.on('keydown-I', () => this.inventoryUI.toggle(this.invSnapshot));

    // Compétences (toggle K) + notifications skill-up (style Skyrim, STYLE_GUIDE §5.2)
    this.skillsUI = new SkillsUI(this);
    this.skillsSnapshot = new SkillSystem().snapshot();
    EventBus.on('skills:updated', (snap) => {
      this.skillsSnapshot = snap;
      if (this.skillsUI.visible) this.skillsUI.render(snap);
    }, this);
    EventBus.on('skill:milestone', (d) => this.showSkillNotification(d), this);
    this.input.keyboard.on('keydown-K', () => this.skillsUI.toggle(this.skillsSnapshot));

    // Commerce : boutique PNJ ouverte via EventBus (étape 9)
    this.shopUI = new ShopUI(this);
    EventBus.on('shop:open', (d) => this.shopUI.open(d.npc, d.player), this);
    // HUD : barres HP/endurance, mini-carte fog-of-war, notifications (étape 10)
    this.hud = new HUD(this);
    this.hud.create();
    this.input.keyboard.addKey('ESC').on('down', () => this.hud.togglePause());   // menu pause (étape 12)
    // Indicateur jour/nuit (icône soleil/lune, étape 11)
    this.phaseIcon = this.add.text(this.scale.width - 70, this.scale.height - 24, '☀ Jour',
      { fontFamily: "'Share Tech Mono', monospace", fontSize: '12px', color: '#ffd700' }).setScrollFactor(0).setDepth(1000);
    EventBus.on('daynight:phase', (d) => this.phaseIcon.setText(d.isNight ? '☾ Nuit' : '☀ Jour'), this);
  }

  /** Notification "Compétence améliorée" style Skyrim (visible 4s puis disparaît). */
  showSkillNotification({ skill, level, name }) {
    const TITLES = { 25: 'Adepte', 50: 'Expert', 75: 'Maître', 100: 'Légende' };
    const x = this.scale.width / 2, y = this.scale.height - 100;
    const bg = this.add.rectangle(x, y, 300, 56, 0x000000, 0.7).setStrokeStyle(1, 0x8b6030).setScrollFactor(0).setDepth(950);
    const l1 = this.add.text(x, y - 12, `⚔ Compétence améliorée : ${(name || skill).toUpperCase()}`,
      { fontFamily: "'Cinzel', serif", fontSize: '13px', color: '#e8d5b0' }).setOrigin(0.5).setScrollFactor(0).setDepth(951);
    const l2 = this.add.text(x, y + 12, `✦ Niveau ${level} — ${TITLES[level] || 'Seuil'} ✦`,
      { fontFamily: "'Cinzel', serif", fontSize: '14px', color: '#ffd700' }).setOrigin(0.5).setScrollFactor(0).setDepth(951);
    [bg, l1, l2].forEach(o => { o.setAlpha(0); this.tweens.add({ targets: o, alpha: 1, duration: 400 }); });
    this.time.delayedCall(4000, () => [bg, l1, l2].forEach(o =>
      this.tweens.add({ targets: o, alpha: 0, duration: 600, onComplete: () => o.destroy() })));
  }
}
