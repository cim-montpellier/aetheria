// HUD.js — Sands of Aetheria
// Rôle : HUD in-game — barres HP/Endurance animées, mini-carte fog-of-war, file de notifications.
// Étape de création : 10
// Dépendances : EventBus.js, data/items.js, data/worldZones.js (zoneAt), Phaser (global).
// Découplage : mis à jour via EventBus ('player:stats'/'player:hp_changed'/...). Référence STYLE_GUIDE §5.

import { EventBus } from '../utils/EventBus.js';
import { ITEMS } from '../data/items.js';
import { zoneAt } from '../data/worldZones.js';

const HP_W = 160, STAM_W = 140, MINI = 110, TILE = 32, WORLD_PX = 80 * TILE;
const ZONE_COLORS = { hub: 0xc4a35a, plaine: 0x8b7355, gorges: 0x5c4a2a, campement: 0x3d2b1a };

export class HUD {
  constructor(scene) {
    this.scene = scene;
    this.discovered = new Set();      // fog of war : zones visitées
    this.notifications = [];
    this.critical = false;
    this.frame = 0;
    this.paused = false;              // menu pause (étape 12)
    this.pauseObjects = [];
  }

  create() {
    const s = this.scene;
    // Barres HP / Endurance (STYLE_GUIDE §5.1)
    s.add.rectangle(16 + HP_W / 2, 22, HP_W, 12, 0x2a0808).setScrollFactor(0).setDepth(800);
    this.hpFill = s.add.rectangle(16, 22, HP_W, 12, 0xcc2222).setOrigin(0, 0.5).setScrollFactor(0).setDepth(801);
    s.add.rectangle(16 + STAM_W / 2, 38, STAM_W, 8, 0x082228).setScrollFactor(0).setDepth(800);
    this.stamFill = s.add.rectangle(16, 38, STAM_W, 8, 0x2288cc).setOrigin(0, 0.5).setScrollFactor(0).setDepth(801);
    this.hpText = s.add.text(18, 12, 'HP', { fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: '#e8d5b0' }).setScrollFactor(0).setDepth(802);
    // Mini-carte (coin haut droit)
    this.minimap = s.add.graphics().setScrollFactor(0).setDepth(800);
    this.miniX = s.scale.width - MINI - 16; this.miniY = 16;
    // Vignette rouge progressive si HP < 30% (STYLE_GUIDE §6.1, étape 13)
    this.vignette = s.add.rectangle(s.scale.width / 2, s.scale.height / 2, s.scale.width, s.scale.height, 0xff0000, 0).setScrollFactor(0).setDepth(700);
    // Événements
    EventBus.on('player:stats', this.onStats, this);
    EventBus.on('player:hp_changed', (d) => this.updateHP(d.current, d.max), this);
    EventBus.on('skill:milestone', (d) => this.notify(`${d.name} → Niveau ${d.level} !`, '#ffd700'), this);
    EventBus.on('resource:mined', (d) => this.notify(`+${d.qty} ${d.type}`, '#88cc88'), this);
    EventBus.on('item:picked', (d) => this.notify(`+${d.qty || 1} ${ITEMS[d.id]?.name || d.id}`, '#ffd700'), this);
    EventBus.on('faction:changed', (d) => { if (d.hostile) this.notify('⚠ Faction hostile !', '#ff4444'); }, this);
  }

  onStats(d) {
    this.updateHP(d.hp, d.hpMax);
    this.updateStamina(d.stamina, d.staminaMax);
    if (++this.frame % 5 === 0 && d.x !== undefined) this.updateMinimap(d.x, d.y);   // mini-carte throttlée
  }

  updateHP(current, max) {
    const ratio = Math.max(0, current / max);
    this.hpFill.setSize(HP_W * ratio, 12);
    this.critical = ratio < 0.3;                                  // blessures : pulse critique
    if (this.critical) this.hpFill.setTint(0xff4444); else this.hpFill.clearTint();
    this.hpText.setText(`HP ${Math.ceil(current)}/${max}`);
    this.vignette.setAlpha(this.critical ? 0.25 : 0);             // vignette si HP critique
  }

  updateStamina(current, max) {
    this.stamFill.setSize(STAM_W * Math.max(0, current / max), 8);
  }

  updateMinimap(x, y) {
    this.discovered.add(zoneAt(Math.floor(x / TILE), Math.floor(y / TILE)));
    this.drawMinimap(x, y);
  }

  drawMinimap(x, y) {
    const g = this.minimap.clear();
    const sc = MINI / WORLD_PX;
    g.fillStyle(0x0f0a06, 0.85); g.fillRect(this.miniX - 2, this.miniY - 2, MINI + 4, MINI + 4);
    for (const [zone, color] of Object.entries(ZONE_COLORS)) {
      if (!this.discovered.has(zone)) continue;                   // fog of war : non visité = noir
      const r = this._zoneRect(zone);
      g.fillStyle(color, 0.6); g.fillRect(this.miniX + r.x * sc, this.miniY + r.y * sc, r.w * sc, r.h * sc);
    }
    g.fillStyle(0x00ff88, 1); g.fillRect(this.miniX + x * sc - 1, this.miniY + y * sc - 1, 3, 3);   // joueur
  }

  _zoneRect(zone) {
    if (zone === 'hub') return { x: 0, y: 0, w: 20 * TILE, h: 20 * TILE };
    if (zone === 'gorges') return { x: 60 * TILE, y: 0, w: 20 * TILE, h: 50 * TILE };
    if (zone === 'campement') return { x: 60 * TILE, y: 50 * TILE, w: 20 * TILE, h: 30 * TILE };
    return { x: 20 * TILE, y: 0, w: 40 * TILE, h: 80 * TILE };    // plaine (base)
  }

  notify(text, color = '#e8d5b0') {
    const s = this.scene;
    const n = s.add.text(s.scale.width / 2, 90 + this.notifications.length * 22, text,
      { fontFamily: "'Cinzel', serif", fontSize: '14px', color, stroke: '#0f0a06', strokeThickness: 3 })
      .setOrigin(0.5).setScrollFactor(0).setDepth(850);
    this.notifications.push(n);
    s.time.delayedCall(3000, () => s.tweens.add({ targets: n, alpha: 0, duration: 500,
      onComplete: () => { n.destroy(); this.notifications = this.notifications.filter(o => o !== n); } }));
  }

  // ── Menu pause (Échap, étape 12) ──────────────────────────────
  togglePause() {
    this.paused = !this.paused;
    if (this.paused) this.showPauseMenu(); else this.hidePauseMenu();
    EventBus.emit('game:pause', { paused: this.paused });
  }
  showPauseMenu() {
    const s = this.scene, cx = s.scale.width / 2, cy = s.scale.height / 2;
    const put = (o) => { this.pauseObjects.push(o); return o; };
    put(s.add.rectangle(cx, cy, 240, 190, 0x0f0a06, 0.95).setStrokeStyle(1, 0x3a2a1a).setScrollFactor(0).setDepth(990));
    put(s.add.text(cx, cy - 64, 'PAUSE', { fontFamily: "'Cinzel', serif", fontSize: '24px', color: '#c4a35a' }).setOrigin(0.5).setScrollFactor(0).setDepth(991));
    const save = put(s.add.text(cx, cy - 10, 'Sauvegarder & Quitter', { fontFamily: "'Share Tech Mono', monospace", fontSize: '13px', color: '#e8d5b0' }).setOrigin(0.5).setScrollFactor(0).setDepth(991).setInteractive());
    save.on('pointerdown', () => EventBus.emit('game:save_quit', {}));
    const mute = put(s.add.text(cx, cy + 24, 'Mute audio', { fontFamily: "'Share Tech Mono', monospace", fontSize: '13px', color: '#e8d5b0' }).setOrigin(0.5).setScrollFactor(0).setDepth(991).setInteractive());
    mute.on('pointerdown', () => EventBus.emit('game:toggle_mute', {}));
    const resume = put(s.add.text(cx, cy + 58, 'Reprendre', { fontFamily: "'Share Tech Mono', monospace", fontSize: '13px', color: '#88cc88' }).setOrigin(0.5).setScrollFactor(0).setDepth(991).setInteractive());
    resume.on('pointerdown', () => this.togglePause());
  }
  hidePauseMenu() {
    this.pauseObjects.forEach(o => o.destroy());
    this.pauseObjects = [];
  }
}
