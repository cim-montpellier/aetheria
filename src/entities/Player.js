// Player.js — Sands of Aetheria
// Rôle : Entité joueur — mouvement, endurance, compétences, inventaire, sauvegarde.
//        Les actions de combat sont dans PlayerCombat.js (mixin, extrait étape 13).
// Étape de création : 4 (combat ét.6 → extrait PlayerCombat ét.13, TOKEN §2.2)
// Dépendances : config.js, worldZones.js, InputHandler, InventorySystem, SkillSystem,
//               CombatSystem, EventBus, PlayerCombat, Phaser (global)

import {
  PLAYER_WALK_SPEED, PLAYER_RUN_SPEED, PLAYER_HP_MAX, PLAYER_HP_START, PLAYER_STAMINA_MAX,
  PLAYER_START_GOLD, STAMINA_RUN_DRAIN, STAMINA_REGEN, STAMINA_REGEN_DELAY, DODGE_COST, INJURY_LEG_RATIO,
} from '../config.js';
import { PLAYER_SPAWN } from '../data/worldZones.js';
import { InputHandler } from './InputHandler.js';
import { InventorySystem } from '../systems/InventorySystem.js';
import { SkillSystem } from '../systems/SkillSystem.js';
import * as Combat from '../systems/CombatSystem.js';
import { EventBus } from '../utils/EventBus.js';
import { PlayerCombat } from './PlayerCombat.js';

export class Player {
  constructor(scene, x = PLAYER_SPAWN.x, y = PLAYER_SPAWN.y) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, 'player').setOrigin(0.5);
    this.sprite.body.setSize(20, 20);
    this.sprite.body.setCollideWorldBounds(true);
    this.sprite.body.allowGravity = false;
    // Stats (Kenshi : départ "nobody" affaibli)
    this.hp = PLAYER_HP_START; this.hpMax = PLAYER_HP_MAX;
    this.stamina = PLAYER_STAMINA_MAX; this.restTimer = 0;
    this.inventory = new InventorySystem(24);
    this.inventory.gold = PLAYER_START_GOLD;
    this.baseAttack = 10;
    this.meleeSkill = 0;
    this.critChance = 0;
    // État combat
    this.facing = { x: 0, y: 1 };
    this.invincible = false; this.dead = false;
    this.attackCooldown = 0; this.charging = false; this.attacking = null;
    this.parrying = false; this.parryTime = 0;
    this.attackHitbox = scene.physics.add.sprite(x, y, 'player');
    this.attackHitbox.body.enable = false;
    this.input = new InputHandler(scene);
    scene.cameras.main.startFollow(this.sprite, true, 0.1, 0.1);
    EventBus.on('inventory:equip', (d) => this.inventory.equip(d.id), this);
    EventBus.on('inventory:use', (d) => this.useItem(d.id), this);
    this.skills = new SkillSystem();
    EventBus.on('skill:milestone', (d) => this.onMilestone(d), this);
  }

  get gold() { return this.inventory.gold; }
  set gold(v) { this.inventory.gold = v; }

  update(delta) {
    if (this.dead) return;
    const cmd = this.input.read();
    if (this.attackCooldown > 0) this.attackCooldown -= delta;
    if (cmd.interact) EventBus.emit('player:interact', { x: this.sprite.x, y: this.sprite.y, facing: this.facing });
    this.parrying = cmd.parry && this.stamina > 0;
    if (this.parrying) { this.stamina = Math.max(0, this.stamina - Combat.PARRY_STAMINA * delta / 1000); this.parryTime += delta; }
    else this.parryTime = 0;
    if (cmd.lightAttack) this.lightAttack();
    if (cmd.heavyAttack) this.heavyAttack();
    if (cmd.dodge && this.stamina >= DODGE_COST && !this.invincible) this.dodge(cmd);
    const moving = !!(cmd.moveX || cmd.moveY);
    const running = cmd.running && moving && this.stamina > 0 && !this.parrying;
    const speed = this.effectiveSpeed(running ? PLAYER_RUN_SPEED : PLAYER_WALK_SPEED);
    this.sprite.body.setVelocity(this.parrying ? 0 : cmd.moveX * speed, this.parrying ? 0 : cmd.moveY * speed);
    if (moving) this.facing = { x: cmd.moveX, y: cmd.moveY };
    const st = Player.staminaStep(this.stamina, this.restTimer, running, moving, delta);
    this.stamina = st.stamina; this.restTimer = st.restTimer;
    if (running) this.skills.register('athletics', delta / 1000);
    this.skills.update(delta);
    this.sprite.play(Player.animForState(cmd.moveX, cmd.moveY, running, this.attacking), true);   // animation (étape 13)
    EventBus.emit('player:stats', { hp: this.hp, hpMax: this.hpMax, stamina: this.stamina, staminaMax: PLAYER_STAMINA_MAX, x: this.sprite.x, y: this.sprite.y });
  }

  // ── Attaque totale / objets / milestones ──────────────────────
  totalAttack() { return this.baseAttack + this.inventory.equippedStats().attack; }
  useItem(id) {
    const effect = this.inventory.consume(id);
    if (effect?.heal) this.hp = Math.min(this.hpMax, this.hp + effect.heal);
    return effect;
  }
  loseHalfItems() {
    const items = this.inventory.items;
    for (let i = items.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [items[i], items[j]] = [items[j], items[i]]; }
    items.splice(Math.ceil(items.length / 2));
  }
  onMilestone({ skill, level }) {
    if (skill === 'melee' && level >= 50) this.critChance = 0.10;   // GDD §6.3 : Mêlée 50 → critique 10%
  }

  // ── Sauvegarde (étape 12) ─────────────────────────────────────
  serialize() {
    return { position: { x: this.sprite.x, y: this.sprite.y }, hp: this.hp, hpMax: this.hpMax,
      stamina: this.stamina, inventory: this.inventory.snapshot(), skills: { ...this.skills.levels } };
  }
  loadState(st) {
    if (!st) return;
    this.sprite.setPosition(st.position.x, st.position.y);
    this.hp = st.hp; this.hpMax = st.hpMax; this.stamina = st.stamina;
    this.inventory.gold = st.inventory.gold;
    this.inventory.items = st.inventory.items.map(s => ({ ...s }));
    this.inventory.equipped = { ...st.inventory.equipped };
    for (const k in st.skills) if (k in this.skills.levels) this.skills.levels[k] = st.skills[k];
  }

  // ── Helpers purs ──────────────────────────────────────────────
  effectiveSpeed(base) { return Player.effectiveSpeed(this.hp / this.hpMax, base); }
  static effectiveSpeed(hpRatio, base) { return hpRatio < INJURY_LEG_RATIO ? base * 0.7 : base; }   // blessure jambe
  static staminaStep(stamina, restTimer, running, moving, delta) {
    const dt = delta / 1000;
    if (running && moving && stamina > 0) return { stamina: Math.max(0, stamina - STAMINA_RUN_DRAIN * dt), restTimer: 0 };
    const rt = restTimer + delta;
    if (rt >= STAMINA_REGEN_DELAY) return { stamina: Math.min(PLAYER_STAMINA_MAX, stamina + STAMINA_REGEN * dt), restTimer: rt };
    return { stamina, restTimer: rt };
  }
  /** Clé d'animation selon l'état (idle/walk/run/attack) — étape 13. */
  static animForState(vx, vy, running, attacking) {
    if (attacking) return 'attack';
    if (vx === 0 && vy === 0) return 'idle';
    return running ? 'run' : 'walk';
  }
}

Object.assign(Player.prototype, PlayerCombat);   // mixin combat (lightAttack/takeDamage/die/...)
