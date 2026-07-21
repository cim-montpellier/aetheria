# TECH_SPEC.md — Spécifications Techniques
# Sands of Aetheria (MVP) — Stack HTML5/WebGL/Phaser 4
**Version :** 1.0 | **Standards :** ES2026 | **Environnement Cible :** Navigateur moderne (Chrome 120+, Firefox 120+, Safari 17+, Edge 120+)

---

## 1. MOTEUR DE JEU — PHASER 4

### 1.1 Version et CDN
```html
<!-- Phaser 4 — Renderer WebGL avec fallback Canvas -->
<!-- Option A : jsdelivr (recommandé pour la stabilité CDN) -->
<script src="https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js"></script>

<!-- Option B : unpkg -->
<script src="https://unpkg.com/phaser@4.1.0/dist/phaser.min.js"></script>

<!-- Option C : esm (Import Map, sans bundler) -->
<!-- "phaser": "https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.esm.js" -->
```

### 1.2 Configuration Phaser 4 (main.js)
```javascript
const GameConfig = {
    type: Phaser.WEBGL,          // WebGL forcé, fallback Canvas auto
    width: 960,
    height: 540,                  // 16:9 — responsive via ScaleManager
    backgroundColor: '#1a1208',
    pixelArt: true,               // Anti-aliasing désactivé pour pixel art
    antialias: false,
    roundPixels: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },    // Top-down : pas de gravité
            debug: false          // true en développement uniquement
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: { width: 320, height: 180 },
        max: { width: 1920, height: 1080 }
    },
    scene: [BootScene, PreloadScene, MenuScene, UIScene, GameScene]
};
```

### 1.3 Bibliothèques Complémentaires
```html
<!-- Audio — Howler.js 2.2.4 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.4/howler.min.js"></script>

<!-- Tilemaps — Tiled Map Editor (export JSON, intégré Phaser 4) -->
<!-- Pas de CDN nécessaire : Phaser 4 lit nativement le JSON Tiled -->
```

---

## 2. ARCHITECTURE LOGICIELLE

### 2.1 Structure des Dossiers

sands-of-aetheria/
├── index.html                    # Point d'entrée, import CDN
├── src/
│   ├── main.js                   # Config Phaser 4, registration des scènes
│   ├── config.js                 # Constantes globales (vitesses, stats, couleurs)
│   ├── scenes/
│   │   ├── BootScene.js          # Chargement assets minimaux (logo, barre de chargement)
│   │   ├── PreloadScene.js       # Chargement de tous les assets du jeu
│   │   ├── MenuScene.js          # Écran titre, New Game / Load Game
│   │   ├── GameScene.js          # Scène principale — monde, entités, physique
│   │   └── UIScene.js            # HUD superposé (parallèle à GameScene, toujours active)
│   ├── entities/
│   │   ├── Player.js             # Entité joueur (mouvement, combat, stats)
│   │   ├── Enemy.js              # Entité ennemi générique (State Machine IA)
│   │   ├── NPC.js                # PNJ (routines, dialogues, commerce)
│   │   └── Projectile.js        # Flèches/projectiles (pool d'objets)
│   ├── systems/
│   │   ├── SkillSystem.js        # Learn-by-doing, calculs, progression
│   │   ├── InventorySystem.js    # Gestion items, poids, équipement
│   │   ├── CombatSystem.js       # Résolution des dégâts, blessures, mort
│   │   ├── CraftingSystem.js     # Recettes, vérification ressources, crafting
│   │   ├── FactionSystem.js      # Réputation, seuils d'hostilité
│   │   ├── SaveSystem.js         # Sérialisation/désérialisation LocalStorage
│   │   ├── AudioManager.js       # Wrapper Howler.js, gestion musique/SFX
│   │   └── AIManager.js          # Mise à jour des State Machines de tous les PNJ/Ennemis
│   ├── ui/
│   │   ├── HUD.js                # Barres HP/Endurance, minimap, notifications
│   │   ├── InventoryUI.js        # Fenêtre inventaire (grille)
│   │   ├── DialogUI.js           # Bulles de dialogue PNJ
│   │   ├── ShopUI.js             # Interface de commerce
│   │   └── SkillsUI.js           # Écran des compétences
│   ├── data/
│   │   ├── items.js              # Définitions de tous les items (JSON-like)
│   │   ├── recipes.js            # Recettes de crafting
│   │   ├── enemies.js            # Templates d'ennemis (stats de base)
│   │   └── npcs.js               # Données des PNJ (routines, dialogues)
│   └── utils/
│       ├── MathUtils.js          # Helpers géométriques (distance, angle, vecteurs)
│       ├── ObjectPool.js         # Pool générique pour projectiles/particules
│       └── EventBus.js           # Bus d'événements global (découplage entre systèmes)
├── assets/
│   ├── tilemaps/
│   │   ├── world.json            # Tilemap Tiled principale (80x80)
│   │   └── world_tileset.webp    # Tileset associé
│   ├── sprites/
│   │   ├── player.webp           # Spritesheet joueur (top-down, 8 directions)
│   │   ├── enemies.webp          # Spritesheet ennemis groupés
│   │   ├── npcs.webp             # Spritesheet PNJ
│   │   ├── items.webp            # Icons d'items (grille 16x16)
│   │   └── effects.webp          # Particules, impacts, sang
│   ├── ui/
│   │   ├── hud.webp              # Éléments HUD (cadres, barres)
│   │   └── icons.webp            # Icônes UI (inventaire, compétences)
│   └── audio/
│       ├── music_hub.ogg
│       ├── music_wild.ogg
│       ├── sfx_attack.ogg
│       ├── sfx_hit.ogg
│       ├── sfx_death.ogg
│       └── sfx_pickup.ogg
└── tests/
    └── test_step_N.js            # Fichiers de test TDD par étape


### 2.2 Architecture des Scènes Phaser 4

┌──────────────────────────────────────────────────────────────┐
│                      STACK DES SCÈNES                        │
│                                                              │
│  [BootScene]   → Préchargement minimal (3 assets max)        │
│       ↓                                                      │
│  [PreloadScene] → Chargement de tous les assets + Progress   │
│       ↓                                                      │
│  [MenuScene]   → Titre, New Game, Load, Options              │
│       ↓                                                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  [GameScene]  (scène principale — active)            │    │
│  │  + [UIScene]  (en parallèle — toujours au-dessus)   │    │
│  │  Communication via EventBus (pas d'accès direct)    │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘


**Communication inter-scènes** via `EventBus.js` (pattern Observer) :
```javascript
// EventBus.js — Singleton global
class EventBus {
    static instance = new Phaser.Events.EventEmitter();
    static emit(event, data) { this.instance.emit(event, data); }
    static on(event, fn, ctx) { this.instance.on(event, fn, ctx); }
    static off(event, fn) { this.instance.off(event, fn); }
}
// Exemple d'usage :
// GameScene : EventBus.emit('player:hp_changed', { current: 75, max: 100 });
// UIScene   : EventBus.on('player:hp_changed', this.updateHPBar, this);
```

---

## 3. PHYSIQUE — ARCADE PHYSICS

### 3.1 Choix et Justification
**Arcade Physics** (inclus Phaser 4) est retenu en lieu et place de Matter.js pour 3 raisons :
1. **Performance** : AABB rectangulaires — 0 calcul de polygones. 60 FPS stable avec 50+ entités.
2. **Économie de tokens** : API simple, configuration en 3-5 lignes par entité.
3. **Suffisance MVP** : Top-down sans physique complexe (pas de rebond, pas de poids).

### 3.2 Groupes de Collision
```javascript
// Dans GameScene.js — create()
this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

// Groupes statiques (immobiles)
this.wallsLayer       // Couche de collision tilemap (murs, rochers)
this.interactables    // Ressources, coffres (overlap, pas de bloc)

// Groupes dynamiques
this.playerGroup      // Joueur seul
this.enemyGroup       // Tous les ennemis actifs
this.npcGroup         // PNJ Hub
this.projectileGroup  // Pool de projectiles (ObjectPool.js)

// Règles de collision
this.physics.add.collider(this.playerGroup, this.wallsLayer);
this.physics.add.collider(this.enemyGroup, this.wallsLayer);
this.physics.add.overlap(this.playerGroup, this.enemyGroup,
    CombatSystem.handleMeleeContact, null, this);
this.physics.add.overlap(this.playerGroup, this.interactables,
    InteractionSystem.handleProximity, null, this);
```

### 3.3 Hitboxes Joueur
```javascript
// Player.js — configurePhysics()
this.sprite.body.setSize(20, 20);       // Hitbox de collision (plus petite que le sprite)
this.attackHitbox = this.scene.physics.add.image(0, 0, null);
this.attackHitbox.setSize(32, 32);      // Hitbox d'attaque (activée 0.2s pendant swing)
this.attackHitbox.body.enable = false;  // Désactivée par défaut
```

---

## 4. SYSTÈME DE DONNÉES & SAUVEGARDE

### 4.1 Schéma de Données Joueur
```javascript
// Structure complète de l'état joueur (SaveSystem.js)
const PlayerState = {
    version: "1.0",                    // Pour migrations futures
    position: { x: 640, y: 960 },      // Position monde (pixels)
    stats: {
        hp: { current: 100, max: 100 },
        stamina: { current: 80, max: 80 },
        injuries: []                    // ["leg_left", "arm_right"]
    },
    skills: {
        melee:      { level: 0.0, xp_this_session: 0 },
        athletics:  { level: 0.0, xp_this_session: 0 },
        endurance:  { level: 0.0, xp_this_session: 0 },
        stealth:    { level: 0.0, xp_this_session: 0 },
        smithing:   { level: 0.0, xp_this_session: 0 },
        mining:     { level: 0.0, xp_this_session: 0 },
        trade:      { level: 0.0, xp_this_session: 0 }
    },
    inventory: {
        gold: 15,
        items: [
            // { id: "wood_sword", quantity: 1, equipped: true, slot: "weapon" }
        ],
        maxSlots: 24,
        equippedSlots: { weapon: null, armor: null, accessory: null }
    },
    factions: {
        oasis_merchants:  50,   // 0-100 (0=hostile, 50=neutre, 100=ami)
        sael_raiders:      0,
        nomads:           50
    }
};
```

### 4.2 Schéma de l'État du Monde
```javascript
const WorldState = {
    dayCount: 1,
    timeOfDay: 0.0,                    // 0.0=aube, 0.5=midi, 1.0=minuit
    killedEnemies: new Set(),          // IDs des ennemis permanents tués
    openedChests: new Set(),           // IDs des coffres ouverts
    fogOfWar: new Uint8Array(80 * 80), // 1 bit par tuile (découverte)
    npcStates: {
        // "rescued_merchant": { spawned: true, location: "hub" }
    },
    respawnTimers: {}                   // { "rock_23_14": 1703000000 } (timestamps)
};
```

### 4.3 API SaveSystem
```javascript
// SaveSystem.js
class SaveSystem {
    static SAVE_KEY = 'aetheria_save_v1';

    static save(playerState, worldState) {
        const data = {
            timestamp: Date.now(),
            player: playerState,
            world: {
                ...worldState,
                killedEnemies: [...worldState.killedEnemies],
                openedChests:  [...worldState.openedChests],
                fogOfWar:      Array.from(worldState.fogOfWar)
            }
        };
        localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
    }

    static load() {
        const raw = localStorage.getItem(this.SAVE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        data.world.killedEnemies = new Set(data.world.killedEnemies);
        data.world.openedChests  = new Set(data.world.openedChests);
        data.world.fogOfWar      = new Uint8Array(data.world.fogOfWar);
        return data;
    }

    static deleteSave() { localStorage.removeItem(this.SAVE_KEY); }
    static hasSave()    { return !!localStorage.getItem(this.SAVE_KEY); }
}
```

---

## 5. PATTERNS D'IA — STATE MACHINE PNJ/ENNEMIS

### 5.1 Architecture de la State Machine
```javascript
// AIManager.js — State Machine universelle
class StateMachine {
    constructor(entity) {
        this.entity = entity;
        this.states = {};          // Map<string, StateHandler>
        this.currentState = null;
        this.previousState = null;
        this.stateTime = 0;        // ms dans l'état courant
    }

    addState(name, { onEnter, onUpdate, onExit }) {
        this.states[name] = { onEnter, onUpdate, onExit };
    }

    transition(newState) {
        if (newState === this.currentState) return;
        this.states[this.currentState]?.onExit?.(this.entity);
        this.previousState = this.currentState;
        this.currentState = newState;
        this.stateTime = 0;
        this.states[newState]?.onEnter?.(this.entity);
    }

    update(delta) {
        this.stateTime += delta;
        this.states[this.currentState]?.onUpdate?.(this.entity, delta, this);
    }
}
```

### 5.2 Implémentation Ennemi Type (Enemy.js)
```javascript
// States : IDLE | PATROL | CHASE | ATTACK | FLEE | DEAD
function setupEnemyAI(enemy) {
    const sm = new StateMachine(enemy);
    const DETECT_RANGE   = 150;
    const ATTACK_RANGE   = 45;
    const DISENGAGE_DIST = 220;
    const FLEE_HP_RATIO  = 0.20;

    sm.addState('IDLE', {
        onEnter: (e) => { e.sprite.body.setVelocity(0, 0); },
        onUpdate: (e, dt, machine) => {
            const dist = Phaser.Math.Distance.Between(
                e.sprite.x, e.sprite.y,
                e.scene.player.sprite.x, e.scene.player.sprite.y
            );
            if (dist < DETECT_RANGE) machine.transition('CHASE');
            else if (machine.stateTime > 3000) machine.transition('PATROL');
        }
    });

    sm.addState('CHASE', {
        onUpdate: (e, dt, machine) => {
            const player = e.scene.player;
            const dist = Phaser.Math.Distance.Between(
                e.sprite.x, e.sprite.y, player.sprite.x, player.sprite.y
            );
            if (dist > DISENGAGE_DIST) { machine.transition('IDLE'); return; }
            if (dist < ATTACK_RANGE)   { machine.transition('ATTACK'); return; }
            if (e.stats.hp / e.stats.maxHp < FLEE_HP_RATIO) { machine.transition('FLEE'); return; }
            e.scene.physics.moveToObject(e.sprite, player.sprite, e.stats.speed);
        }
    });

    // ATTACK, PATROL, FLEE, DEAD states...
    sm.transition('IDLE');
    return sm;
}
```

### 5.3 State Machine PNJ Hub (simplifié)
```javascript
// States : ROUTINE | INTERACT | TRADE | ALARMED
// ROUTINE  : Déplacement waypoint-to-waypoint (cycle journalier)
// INTERACT : Stoppé, face au joueur, affiche bulle dialogue
// TRADE    : Ouvre ShopUI (bloque mouvements PNJ)
// ALARMED  : Fuit vers spawn si faction hostile
```

---

## 6. GESTION DU CYCLE JOUR/NUIT

```javascript
// config.js
const DAY_DURATION_MS  = 300_000; // 5 minutes réelles = 1 jour Aetheria
const DAWN_RATIO       = 0.15;    // 0.0 → 0.15 : aube (orange clair)
const DAY_RATIO        = 0.45;    // 0.15 → 0.45 : jour (blanc neutre)
const DUSK_RATIO       = 0.60;    // 0.45 → 0.60 : crépuscule (orange foncé)
const NIGHT_RATIO      = 1.00;    // 0.60 → 1.00 : nuit (bleu très sombre)

// Dans GameScene.update() :
// Interpoler la couleur d'ambiance sur la caméra (setPostPipeline ou tint global)
// Réduire rayon de vision ennemi la nuit de 30%
// PNJ rentrent à l'intérieur (transition ROUTINE → INDOOR) à DUSK_RATIO
```

---

## 7. RESPONSIVE & CONTRÔLES MOBILES

```javascript
// InputManager.js (dans Player.js)
// Clavier
this.cursors  = this.scene.input.keyboard.createCursorKeys();
this.wasd     = this.scene.input.keyboard.addKeys('W,A,S,D,Z,Q');
this.interact = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
this.dodge    = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
this.attack   = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);

// Touch Mobile : Virtual Joystick (à créer en HTML/CSS overlay)
// Joystick gauche : déplacement
// Boutons droits  : Attaque (J), Esquive (Espace), Interaction (E)
// Implémentation : Pointer Events API (sans librairie tierce)
```

---

## 8. PERFORMANCES & OPTIMISATION

| Technique | Implémentation | Impact |
|-----------|---------------|--------|
| **Object Pooling** | `ObjectPool.js` pour projectiles + particules (pool de 50 chaque) | -60% GC pressure |
| **Spatial Culling** | Mettre `setActive(false)` aux ennemis hors caméra +200px | -40% CPU physics |
| **Tilemap Layers** | Séparer Ground / Decor / Collision en 3 layers Tiled | Rendu optimisé WebGL |
| **Asset Compression** | Tous sprites en WebP (qualité 80), audio en OGG 128kbps | -50% taille totale |
| **Event Throttling** | SkillSystem ne calcule les gains que toutes les 500ms | -80% calculs skill |
| **Save Debounce** | Auto-save toutes les 60s (pas à chaque frame) | 0 lag perceptible |
