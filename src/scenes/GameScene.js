// GameScene.js — Sands of Aetheria
// Rôle : Scène principale — orchestration (joueur, combat, boutique, factions, update).
//        Le monde/peuplement/minage est délégué à WorldManager (extrait étape 11, TOKEN §2.2).
// Étape de création : 2 (refactor extraction étape 11)
// Dépendances : config.js, WorldManager, Player, Projectile, CombatSystem, CraftingSystem,
//               FactionSystem, ObjectPool, EventBus, Phaser (global)

import { SCENES, TILE_SIZE } from '../config.js';
import { PLAYER_SPAWN, zoneAt } from '../data/worldZones.js';
import { Player } from '../entities/Player.js';
import { EventBus } from '../utils/EventBus.js';
import * as Craft from '../systems/CraftingSystem.js';
import { FactionSystem, CRIME_REP_PENALTY } from '../systems/FactionSystem.js';
import { WorldManager } from '../systems/WorldManager.js';
import { CombatManager } from '../systems/CombatManager.js';
import { ParticleManager } from '../systems/ParticleManager.js';
import { timeRatio, phaseAt, DAYNIGHT_TINTS } from '../systems/DayNight.js';
import { AudioManager } from '../systems/AudioManager.js';
import { SaveSystem } from '../systems/SaveSystem.js';

export class GameScene extends Phaser.Scene {
  constructor() { super({ key: SCENES.GAME }); }
  init(data) { this.loadData = data?.save || null; }   // sauvegarde transmise par MenuScene

  create() {
    // État monde persisté (étape 12) ; restauré si chargement
    this.worldState = { killedEnemies: new Set(), openedChests: new Set(), dayCount: 1, timeOfDay: 0, fogOfWar: new Set(['hub']) };
    if (this.loadData?.world) {
      this.worldState.killedEnemies = this.loadData.world.killedEnemies;
      this.worldState.openedChests = this.loadData.world.openedChests;
      this.worldState.fogOfWar = this.loadData.world.fogOfWar;
      this.worldState.dayCount = this.loadData.world.dayCount;
    }
    this.world = new WorldManager(this);
    this.world.createWorld();
    this.createPlayer();
    this.world.spawnEntities();                    // ignore les ennemis déjà tués
    this.combat = new CombatManager(this);
    this.combat.setup();
    this.particles = new ParticleManager(this);                  // particules impact/collecte/mort (étape 13)
    this.world.spawnResources();
    this.setupShop();
    this.setupFactions();
    if (this.loadData) this.restoreSave(this.loadData);
    this.setupDayNightAudio();
    this.setupSave();
    // HUD en parallèle (overlay au-dessus du jeu — scrollFactor 0 côté UIScene)
    this.scene.launch(SCENES.UI);
  }

  // Joueur (spawn oasis Hub) + collider contre la couche de collision (murs)
  createPlayer() {
    this.player = new Player(this, PLAYER_SPAWN.x, PLAYER_SPAWN.y);
    this.physics.add.collider(this.player.sprite, this.wallsLayer);
  }

  update(time, delta) {
    this.updateDayNight(time);                     // ambiance jour/nuit continue même en pause
    if (this.gamePaused) return;
    this.player?.update(delta);
    for (const e of this.enemies) e.update(delta);
    for (const n of this.npcs) n.update(delta);
    if (this.projectilePool) this.combat.updateProjectiles(delta);
    this.world.checkRespawns();
    this.updateAudio();
  }

  // ── Commerce : boutique PNJ via EventBus (étape 9) ────────────
  setupShop() {
    EventBus.on('npc:trade', (d) => this.openShop(d.npc), this);
    EventBus.on('shop:action', (d) => this.shopAction(d), this);
    EventBus.on('shop:close', () => this.closeShop(), this);
  }
  openShop(npc) {
    this.activeShopNpc = npc;
    EventBus.emit('shop:open', { npc, player: this.player });
  }
  shopAction({ type, itemId }) {
    const npc = this.activeShopNpc;
    if (!npc) return;
    if (type === 'buy') npc.buyFrom(this.player, itemId);
    else if (type === 'sell') npc.sellTo(this.player, itemId);
    else if (type === 'craft') Craft.craft(itemId, this.player.inventory, this.player.skills.levels);
    this.openShop(npc);                                            // refresh de la boutique
  }
  closeShop() {
    if (this.activeShopNpc) { this.activeShopNpc.ai.transition('ROUTINE'); this.activeShopNpc = null; }
  }

  // ── Factions : crime → réputation ↓ → gardes hostiles (étape 10) ──
  setupFactions() {
    this.factions = new FactionSystem();
    for (const n of this.npcs) this.physics.add.overlap(this.player.attackHitbox, n.sprite, () => this.playerHitsNPC(n));
    EventBus.on('faction:changed', (d) => {
      if (d.hostile) for (const n of this.npcs) if (n.faction === d.faction && n.template.key === 'npc_guard') n.setHostile();
    }, this);
  }
  playerHitsNPC(npc) {
    if (!npc.faction || npc._crimeCd) return;                              // anti-spam
    npc._crimeCd = true; this.time.delayedCall(800, () => (npc._crimeCd = false));
    this.factions.modifyRep(npc.faction, CRIME_REP_PENALTY);
    if (npc.template.key !== 'npc_guard') npc.ai.transition('ALARMED');    // civilien fuit
  }

  // ── Cycle jour/nuit + audio (étape 11) ────────────────────────
  setupDayNightAudio() {
    this.dayNightOverlay = this.add.rectangle(this.scale.width / 2, this.scale.height / 2,
      this.scale.width, this.scale.height, 0xffffff, 0).setScrollFactor(0).setDepth(500);
    this.currentPhase = 'day';
    this.detectMultiplier = 1.0;
    this.audio = new AudioManager();
    EventBus.on('player:attack', () => this.audio.playSFX('attack', 'assets/audio/sfx_attack.ogg'), this);
    EventBus.on('enemy:hit', () => this.audio.playSFX('hit', 'assets/audio/sfx_hit.ogg'), this);
    EventBus.on('item:picked', () => this.audio.playSFX('pickup', 'assets/audio/sfx_pickup.ogg'), this);
  }
  updateDayNight(time) {
    const phase = phaseAt(timeRatio(time));
    const tint = DAYNIGHT_TINTS[phase];
    this.dayNightOverlay.setFillStyle(tint.color, tint.alpha);
    this.detectMultiplier = phase === 'night' ? 0.7 : 1.0;                 // IA nocturne : détection -30%
    if (phase !== this.currentPhase) {
      this.currentPhase = phase;
      EventBus.emit('daynight:phase', { phase, isNight: phase === 'night' });
    }
  }
  updateAudio() {
    if (!this.player) return;
    const zone = zoneAt(Math.floor(this.player.sprite.x / TILE_SIZE), Math.floor(this.player.sprite.y / TILE_SIZE));
    this.worldState.fogOfWar.add(zone);                                      // fog of war (sauvegardé)
    this.worldState.timeOfDay = timeRatio(this.time.now);
    const key = zone === 'hub' ? 'music_hub' : 'music_wild';
    this.audio.playMusic(key, `assets/audio/${key}.ogg`);
    if (zone === 'hub' && this._lastZone && this._lastZone !== 'hub') this.doSave();   // save au retour Hub
    this._lastZone = zone;
  }

  // ── Sauvegarde / chargement / pause (étape 12) ────────────────
  buildSaveData() {
    return {
      player: this.player.serialize(),
      world: { dayCount: this.worldState.dayCount, timeOfDay: this.worldState.timeOfDay,
        killedEnemies: this.worldState.killedEnemies, openedChests: this.worldState.openedChests,
        fogOfWar: this.worldState.fogOfWar, factions: this.factions.snapshot() },
    };
  }
  doSave() {
    const d = this.buildSaveData();
    SaveSystem.save(d.player, d.world);
    EventBus.emit('game:saved', { timestamp: Date.now() });
  }
  restoreSave(data) {
    if (!data) return;
    this.player.loadState(data.player);
    if (data.world.factions) for (const k in data.world.factions) if (k in this.factions.rep) this.factions.rep[k] = data.world.factions[k];
  }
  setupSave() {
    this.time.addEvent({ delay: 60000, loop: true, callback: () => this.doSave() });   // auto-save 60s
    EventBus.on('game:pause', (d) => { this.gamePaused = d.paused; }, this);
    EventBus.on('game:save_quit', () => { this.doSave(); this.scene.start(SCENES.MENU); }, this);
  }
}
