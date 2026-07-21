# MEMORY_STATE.md — Cerveau Persistant

## Projet : Sands of Aetheria | Étape 14/15 | Santé : 🟡

### 🏗️ ÉTAT DU WORKSPACE
| Fichier | Rôle | Dernière Modif | Statut |
|---|---|---|---|
| index.html | Entrée HTML + CDN | Étape 1 | ✅ Stable |
| src/main.js | Config Phaser + 5 scènes | Étape 2 | ✅ Stable |
| src/config.js | Constantes globales | Étape 9 | ✅ Stable (modif ét.9) |
| src/utils/EventBus.js | Bus événements (lazy) | Étape 1 | ✅ Stable |
| src/utils/ObjectPool.js | Pool générique anti-GC | Étape 2 | ✅ Stable |
| src/utils/PlaceholderFactory.js | Textures placeholder + particules | Étape 13 | ✅ Stable (modif ét.13) |
| src/scenes/BootScene.js | Boot + logo + FPS | Étape 1 | ✅ Stable |
| src/scenes/PreloadScene.js | Preloader + placeholders + anims | Étape 13 | ✅ Stable (modif ét.13) |
| src/scenes/MenuScene.js | Menu + Load Game (save + date) | Étape 12 | ✅ Stable (modif ét.12) |
| src/scenes/GameScene.js | Orchestration (combat→CombatManager) | Étape 13 | ✅ Stable (modif ét.13) 161L |
| src/scenes/UIScene.js | UIScene + pause Échap | Étape 12 | ✅ Stable (modif ét.12) |
| src/systems/AIManager.js | StateMachine universelle (pure) | Étape 5 | ✅ Stable |
| src/systems/CombatSystem.js | Formules dégâts + feedback (pur) | Étape 6 | ✅ Stable |
| src/systems/InventorySystem.js | Inventaire 24 slots (pur) | Étape 7 | ✅ Stable |
| src/systems/SkillSystem.js | 7 compétences learn-by-doing (pur) | Étape 8 | ✅ Stable |
| src/systems/CraftingSystem.js | Crafting + prix commerce (pur) | Étape 9 | ✅ Stable |
| src/systems/FactionSystem.js | Réputation 3 factions (pur) | Étape 10 | ✅ Stable |
| src/systems/WorldManager.js | Monde+peuplement+minage (skip killed) | Étape 12 | ✅ Stable (modif ét.12) |
| src/systems/DayNight.js | Cycle jour/nuit (pur) | Étape 11 | ✅ Stable |
| src/systems/AudioManager.js | Wrapper Howler (musique/SFX) | Étape 11 | ✅ Stable |
| src/systems/SaveSystem.js | Sauvegarde LocalStorage (pur) | Étape 12 | ✅ Stable |
| src/systems/CombatManager.js | Combat en jeu (extrait GameScene) | Étape 13 | ✅ Stable |
| src/systems/ParticleManager.js | Particules impact/collecte/mort | Étape 13 | ✅ Stable |
| src/entities/Player.js | Joueur (combat→PlayerCombat mixin) | Étape 13 | ✅ Stable (modif ét.13) 126L |
| src/entities/PlayerCombat.js | Combat joueur (mixin, extrait) | Étape 13 | ✅ Stable |
| src/entities/InputHandler.js | Contrôles 3 schémas + attaque/parade | Étape 6 | ✅ Stable (modif ét.6) |
| src/entities/Enemy.js | Ennemi + animation | Étape 13 | ✅ Stable (modif ét.13) |
| src/entities/EnemyStates.js | 6 états IA (Steering+vision nuit) | Étape 11 | ✅ Stable (modif ét.11) |
| src/entities/NPC.js | PNJ 5 états (+HOSTILE) + commerce | Étape 10 | ✅ Stable (modif ét.10) |
| src/entities/Projectile.js | Projectile poolé (boss ranged) | Étape 6 | ✅ Stable |
| src/data/worldZones.js | Logique pure zones/collision/décor | Étape 3 | ✅ Stable |
| src/data/enemies.js | 4 templates (ranged + loot) | Étape 7 | ✅ Stable (modif ét.7) |
| src/data/npcs.js | 4 templates PNJ (stock+faction) | Étape 10 | ✅ Stable (modif ét.10) |
| src/data/items.js | 15 items MVP (armes/armures/conso/ressources) | Étape 7 | ✅ Stable |
| src/data/recipes.js | 8 recettes de crafting | Étape 9 | ✅ Stable |
| src/ui/InventoryUI.js | Grille inventaire 24 slots (overlay) | Étape 7 | ✅ Stable |
| src/ui/SkillsUI.js | Fenêtre 7 compétences + barres | Étape 8 | ✅ Stable |
| src/ui/ShopUI.js | Boutique achat/vente/craft | Étape 9 | ✅ Stable |
| src/ui/HUD.js | HUD barres+minimap+notifs+pause+vignette | Étape 13 | ✅ Stable (modif ét.13) |
| tools/gen_tilemap.js | Générateur world.json + tileset PNG | Étape 3 | ✅ Stable |
| assets/tilemaps/world.json | Tilemap Tiled 80x80 (3 layers) | Étape 3 | ✅ Généré |
| assets/tilemaps/world_tileset.png | Tileset 9 tuiles 32px (PNG) | Étape 3 | ✅ Généré |
| tests/_mocks.js | Mocks Phaser (harness scènes+entités) | Étape 5 | ✅ Stable |
| tests/smoke_boot.js | Smoke test boot headless | Étape 1 | ✅ Stable |
| tests/test_step_1.js | Tests TDD étape 1 | Étape 1 | ✅ Stable |
| tests/test_step_2.js | Tests TDD étape 2 | Étape 2 | ✅ Stable |
| tests/test_step_3.js | Tests TDD étape 3 | Étape 3 | ✅ Stable |
| tests/test_step_4.js | Tests TDD étape 4 | Étape 4 | ✅ Stable |
| tests/test_step_5.js | Tests TDD étape 5 | Étape 5 | ✅ Stable |
| tests/test_step_6.js | Tests TDD étape 6 | Étape 6 | ✅ Stable |
| tests/test_step_7.js | Tests TDD étape 7 | Étape 7 | ✅ Stable |
| tests/test_step_8.js | Tests TDD étape 8 | Étape 8 | ✅ Stable |
| tests/test_step_9.js | Tests TDD étape 9 | Étape 9 | ✅ Stable |
| tests/test_step_10.js | Tests TDD étape 10 | Étape 10 | ✅ Stable |
| tests/test_step_11.js | Tests TDD étape 11 | Étape 11 | ✅ Stable |
| tests/test_step_12.js | Tests TDD étape 12 | Étape 12 | ✅ Stable |
| tests/test_step_13.js | Tests TDD étape 13 | Étape 13 | ✅ Stable |
| tests/test_combat.js | Tests unitaires CombatSystem | Étape 14 | ✅ Stable |
| tests/test_skills.js | Tests unitaires SkillSystem | Étape 14 | ✅ Stable |
| tests/test_save.js | Tests unitaires SaveSystem | Étape 14 | ✅ Stable |
| tests/test_ai.js | Tests unitaires StateMachine | Étape 14 | ✅ Stable |

### ⚙️ VARIABLES D'ENVIRONNEMENT CRITIQUES
- Phaser 4.1 CDN : `https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js`
- Howler 2.2.4 CDN : `https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.4/howler.min.js`
- Résolution : 960x540 (16:9) | backgroundColor `#1a1208` | pixelArt+roundPixels, antialias off
- Monde : 2560x2560px = tilemap 80x80 × TILE_SIZE 32 | 4 zones | 3 layers (Ground/Decor/Collision)
- Spawn joueur : (336,464)px = tuile (10,14) sud oasis Hub | GID tuiles 1-9 (worldZones.js)
- Régénérer tilemap si worldZones.js change : `node tools/gen_tilemap.js`
- Joueur : WALK 120 / RUN 200 px/s | HP_MAX 100 | STAMINA_MAX 80 | spawn Hub (Puits)
- IA ranges : DETECT 150 | ATTACK 45 | DISENGAGE 220 | FLEE_HP_RATIO 0.20
- Jour/nuit : DAY_DURATION_MS 300000 (5 min = 1 jour)
- Node v22.22.3 (auto-detect ESM) → `node --check` syntaxe, `node tests/test_step_N.js` unitaires

### 🐛 BUGS RÉSOLUS (max 5 entrées)
- (bugs résolus archivés dans MEMORY_ARCHIVE.md — compressions étapes 6 & 9)

### 🏛️ DÉCISIONS D'ARCHITECTURE (irrévocables)
- Moteur : Phaser 4.1 CDN jsdelivr (Howler.js audio) — pas de bundler/npm
- Modules : ES modules natifs navigateur (`<script type=module>`), `Phaser` = global CDN
- Physique : Arcade uniquement (Matter.js INTERDIT) | gravity y:0 (top-down)
- Monde : tilemap UNIQUE 80x80 (chunk loading INTERDIT)
- IA : Steering Behaviors seek/flee/wander (A* INTERDIT)
- Sauvegarde : localStorage `aetheria_save_v1` (backend INTERDIT)
- EventBus lazy (instancié au 1er usage) → testable headless sans Phaser
- Scènes : GameScene + UIScene en parallèle, comm UNIQUEMENT via EventBus
- Tests headless : modules purs (config/EventBus/formules) importables sans Phaser
- Arbitrage ranges IA : valeurs TECH_SPEC §5.2 (150/45/220/0.20) retenues (= tests XML), GDD §4.4 approx → harmonisé

### 📊 PROGRESSION
- Étapes terminées : 1 à 14
- Étape en cours : 15 (à venir)
- Complétion : 93% (14/15)
- 🧪 SUITE TDD : 18 fichiers · 174 assertions · TOUT VERT

### 🚦 PROCHAINE ÉTAPE
Étape 15 [M] — BUILD FINAL, DOCUMENTATION & DÉPLOIEMENT : README.md complet (description,
contrôles, comment jouer, crédits assets CC0), index.html DIFF (meta SEO/OpenGraph/
favicon/PWA), manifest.json (PWA), config.js DIFF (DEBUG_MODE=false). Vérifications :
zéro erreur console en release, fonctionnement depuis file:// et GitHub Pages/Netlify,
crédits assets. ZIP final exportable.

### 📝 NOTES CRITIQUES POUR REPRISE (8 max — détail dans MEMORY_ARCHIVE.md)
- Splits d'architecture (rester sous les limites) : Player/InputHandler (TOKEN §2.2), Enemy/EnemyStates (TOKEN §5.2).
- Systèmes PURS testables : CombatSystem (dégâts), InventorySystem, SkillSystem, CraftingSystem.
  UI découplées via EventBus (snapshot + actions) — JAMAIS d'accès scène→scène.
- Formules : dégâts = attack×(1+melee/200), lourd ×2.5, crit ×1.5 ; skills gain = 0.15×(1−level/150), throttle 500ms.
- Monde : Plaine en base, overlays Hub(0-19,0-19)/Gorges(60-79,*)/Campement(60-79,50-79) — coords BLUEPRINT font foi.
  world.json tableaux bruts + tileset PNG. Régénérer : `node tools/gen_tilemap.js`.
- Mort punitive (Kenshi) : respawn Hub HP=25, −50% or, −50% items (shuffle). Drop = auto-loot (boss → Épée d'Acier).
- Contrôles : ZQSD/WASD/flèches · Shift=course · J/K=attaque · L=parade · Espace=esquive · E=interagir · I=inventaire · K=compétences.
- INFRA TEST : tests/_mocks.js (installMocks, createSceneHarness, createMockScene, MockGraphics) + smoke_boot.js.
  Validation : `node --check <f>` + `node tests/<f>.js`. (Arbitrages détaillés → MEMORY_ARCHIVE.md.)
- Étapes 9-14 (détail → MEMORY_ARCHIVE) : Crafting/Commerce, Factions+HUD, DayNight+Audio (extraction WorldManager),
  Sauvegarde, ✅ 2 extractions ét.13 (PlayerCombat mixin + CombatManager → Player 126L/GameScene 161L) + polish
  (ParticleManager events, animations, vignette HP<30%, screen shake), 🧪 ét.14 4 bancs unitaires (33 assertions,
  aucun bug, save <50KB). Assets CC0 réels = drop manuel (placeholders Phaser fonctionnels, ASSETS_PLAN §1).
- NOTE compression : tableau workspace (48 fichiers) = plancher incompressible ; MEMORY ~120L est le minimum
  atteignable à ce stade (la cible <100 du protocole suppose moins de fichiers).
