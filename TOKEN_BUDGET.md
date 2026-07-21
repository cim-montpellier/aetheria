# TOKEN_BUDGET.md — Gouvernance Mémoire & Contraintes LLM
# Sands of Aetheria (MVP) — Protocole "Survived Context V2"
**Version :** 1.0 | **Étapes Totales :** 15 | **Risque Principal :** Context starvation étapes 5-9

---

## 1. PHILOSOPHIE DE GOUVERNANCE

> **⚡ PRINCIPE FONDATEUR :** Chaque token économisé est un token disponible pour du code de qualité.
> L'Agent Mode d'Arena.ai a une fenêtre de contexte limitée. Ce document est la LOI.
> En cas de conflit entre une "bonne idée" et ce TOKEN_BUDGET.md, TOKEN_BUDGET.md gagne toujours.

### Les 3 Ennemis du Contexte LLM


ENNEMI 1 : La Réécriture Complète
└─ Réécrire 300 lignes pour changer 10 lignes = -290 tokens utiles
└─ Solution : DIFF Protocol obligatoire (§3)

ENNEMI 2 : La Complexité Rampante (Scope Creep)
└─ Ajouter des features non prévues = dette de tokens non budgétée
└─ Solution : Périmètre MVP strict, aucune feature hors GDD.md sans instruction

ENNEMI 3 : L'Historique Conversationnel
└─ Chaque échange accumule des tokens qu'on ne peut pas effacer
└─ Solution : MEMORY_STATE.md comme unique source de vérité (§4)


---

## 2. LIMITES STRICTES PAR TYPE DE FICHIER

> **RÈGLE D'OR :** Si un fichier dépasse sa limite → le découper en sous-modules AVANT d'écrire.
> Ne jamais créer un fichier qui viole ces limites dès le départ.

### 2.1 Tableau des Limites

| Type de Fichier | Limite MAX (lignes) | Action si dépassé | Priorité |
|----------------|--------------------|--------------------|----------|
| `index.html` | 50 lignes | Externaliser les styles en CSS | 🔴 Absolue |
| `src/main.js` | 80 lignes | Déplacer la config dans config.js | 🔴 Absolue |
| `src/config.js` | 120 lignes | Découper en config_game.js + config_ui.js | 🔴 Absolue |
| `src/scenes/BootScene.js` | 60 lignes | Acceptable tel quel (petite scène) | 🔴 Absolue |
| `src/scenes/PreloadScene.js` | 100 lignes | Externaliser PlaceholderFactory | 🔴 Absolue |
| `src/scenes/MenuScene.js` | 120 lignes | OK — scène complète mais simple | 🟡 Forte |
| `src/scenes/GameScene.js` | **250 lignes** | ⚠️ CRITIQUE — découper en sous-systèmes | 🔴 Absolue |
| `src/scenes/UIScene.js` | 180 lignes | Externaliser les widgets UI | 🟡 Forte |
| `src/entities/Player.js` | **250 lignes** | ⚠️ CRITIQUE — extraire InputHandler.js | 🔴 Absolue |
| `src/entities/Enemy.js` | 200 lignes | Extraire les states dans AIStates.js | 🟡 Forte |
| `src/entities/NPC.js` | 150 lignes | OK si states simples | 🟡 Forte |
| `src/entities/Projectile.js` | 80 lignes | Minimaliste par design | 🟢 Normale |
| `src/systems/CombatSystem.js` | 200 lignes | Extraire DamageCalculator.js si besoin | 🟡 Forte |
| `src/systems/SkillSystem.js` | 150 lignes | OK — logique pure, peu de dépendances | 🟢 Normale |
| `src/systems/InventorySystem.js` | 150 lignes | OK | 🟢 Normale |
| `src/systems/CraftingSystem.js` | 120 lignes | OK | 🟢 Normale |
| `src/systems/FactionSystem.js` | 100 lignes | Simple table de réputation | 🟢 Normale |
| `src/systems/SaveSystem.js` | 150 lignes | OK — sérialisation pure | 🟢 Normale |
| `src/systems/AudioManager.js` | 100 lignes | Wrapper Howler léger | 🟢 Normale |
| `src/systems/AIManager.js` | 100 lignes | StateMachine pure | 🟢 Normale |
| `src/ui/HUD.js` | 180 lignes | Découper Minimap.js si besoin | 🟡 Forte |
| `src/ui/InventoryUI.js` | 150 lignes | OK | 🟢 Normale |
| `src/ui/ShopUI.js` | 130 lignes | OK | 🟢 Normale |
| `src/ui/DialogUI.js` | 100 lignes | OK | 🟢 Normale |
| `src/ui/SkillsUI.js` | 120 lignes | OK | 🟢 Normale |
| `src/utils/EventBus.js` | 30 lignes | Singleton minimaliste | 🔴 Absolue |
| `src/utils/ObjectPool.js` | 60 lignes | OK | 🟢 Normale |
| `src/utils/MathUtils.js` | 80 lignes | OK | 🟢 Normale |
| `src/data/items.js` | 150 lignes | Max 15 items MVP | 🟡 Forte |
| `src/data/enemies.js` | 80 lignes | Max 4 templates | 🟡 Forte |
| `src/data/npcs.js` | 80 lignes | Max 4 PNJ Hub | 🟡 Forte |
| `src/data/recipes.js` | 60 lignes | Max 8 recettes | 🟢 Normale |
| `tests/test_step_N.js` | 80 lignes | 1 fichier de test par étape | 🟢 Normale |
| `MEMORY_STATE.md` | **150 lignes** | ⚠️ Compresser → MEMORY_ARCHIVE.md | 🔴 Absolue |

### 2.2 Règle de Découpage Automatique


SI un fichier source approche 80% de sa limite (ex: Player.js à 200 lignes) :
├─ L'agent DOIT proposer le découpage AVANT d'ajouter du code
├─ Découpage préférentiel :
│   Player.js (250) → Player.js (150) + InputHandler.js (100)
│   GameScene.js (250) → GameScene.js (150) + WorldManager.js (100)
│   CombatSystem.js (200) → CombatSystem.js (120) + EffectSystem.js (80)
└─ Toujours découper selon la responsabilité fonctionnelle (SRP)


---

## 3. LIBRAIRIES & SYSTÈMES — LISTE BLANCHE / LISTE NOIRE

### 3.1 ✅ AUTORISÉ (Liste Blanche)

| Librairie / Système | Raison d'autorisation | CDN URL |
|--------------------|-----------------------|---------|
| **Phaser 4.1** (WebGL, Arcade Physics) | Moteur principal — tout-en-un | `cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js` |
| **Howler.js 2.2.4** | Audio léger, API simple | `cdnjs.cloudflare.com/ajax/libs/howler/2.2.4/howler.min.js` |
| **Arcade Physics** (inclus Phaser 4) | AABB léger, 0 config complexe | Inclus dans Phaser |
| **Phaser.Events.EventEmitter** | EventBus natif Phaser | Inclus dans Phaser |
| **Phaser.GameObjects.Particles** | Système particules natif Phaser 4 | Inclus dans Phaser |
| **localStorage API** (vanilla JS) | Sauvegarde sans dépendance | Natif navigateur |
| **Google Fonts** (Cinzel, Share Tech Mono) | Typographie, chargement async | `fonts.googleapis.com` |
| **Import Maps** (vanilla) | Module loading sans bundler | Natif navigateur |
| **Pointer Events API** (vanilla) | Touch mobile sans librairie | Natif navigateur |

### 3.2 ❌ INTERDIT (Liste Noire — trop coûteux en tokens/complexité)

| Librairie / Système | Raison d'interdiction | Alternative Imposée |
|--------------------|-----------------------|---------------------|
| **Matter.js** | Physique complexe, surplus complet pour top-down | Arcade Physics |
| **Behavior Trees** | Trop verbeux à implémenter, surplus pour MVP | State Machine 4-6 états |
| **A* Pathfinding complet** | Algorithme lourd, dépendance externe | Steering Behaviors simples (seek/flee) |
| **React / Vue / Svelte** | Framework UI inutile, overhead massif | Phaser GameObjects + HTML/CSS minimal |
| **Webpack / Rollup / Parcel** | Build tool inutile (pas de npm dans sandbox) | Import Maps ou CDN direct |
| **Three.js** | Moteur 3D hors-scope | Phaser 4 uniquement |
| **TypeScript** (compilé) | Nécessite un build step, impossible en sandbox | JavaScript ES2024+ vanilla |
| **Lodash / Underscore** | Utilities remplacées par ES2024 natif | Array.from, Object.entries, etc. |
| **Socket.io / Multiplayer** | Hors-scope MVP, infrastructure requise | Aucune alternative — pas dans le MVP |
| **Box2D / Rapier WASM** | WASM lourd à charger, complexité inutile | Arcade Physics |
| **TweenMax / GSAP** | Redondant avec Phaser.Tweens natif | Phaser Tweens |
| **MongoDB / Firebase** | Backend requis — interdit MVP client-only | localStorage uniquement |

### 3.3 ⚠️ CONDITIONNEL (utiliser seulement si explicitement décidé)

| Librairie | Condition d'utilisation | Risque Token |
|-----------|------------------------|--------------|
| **EasyStar.js** (pathfinding) | Seulement si l'IA ennemie doit naviguer autour d'obstacles complexes (Gorges) | Moyen |
| **nipplejs** (joystick mobile) | Seulement si le joystick custom HTML/CSS est trop complexe à déboguer | Faible |
| **pako** (compression) | Seulement si la sauvegarde LocalStorage dépasse 50KB | Faible |

---

## 4. ARCHITECTURE FORCÉE — MONDE OUVERT LÉGER MVP

> Ces contraintes architecturales garantissent un MVP livrable en 15 étapes
> sans exploser la complexité de code ni la fenêtre de contexte.

### 4.1 Une Seule Grande Scène (PAS de Chunk Loading)


DÉCISION ARCHITECTURALE IRRÉVOCABLE :
Le monde de Sands of Aetheria MVP est une UNIQUE tilemap de 80x80 tuiles (2560x2560px).
INTERDICTION de tout système de chunk loading ou streaming de tilemap.

Justification :
  - Chunk loading = +200 lignes de code complexe = tokens perdus
  - 80x80 tuiles × 32px = 2560px — raisonnable en mémoire WebGL
  - Phaser 4 gère nativement le culling des tuiles hors caméra
  - La caméra suit le joueur → seulement ~30x17 tuiles visibles simultanément

Implémentation :
  - 1 fichier world.json (export Tiled)
  - 3 layers : Ground, Decor, Collision
  - Spatial culling ennemis : setActive(false) si hors caméra + 200px
  - Object pooling pour projectiles et particules (max 50 instances chacun)


### 4.2 Scène Unique Game + UI Parallèle


DÉCISION : 2 scènes actives simultanément (GameScene + UIScene)
PAS de scènes de zones séparées, PAS de scene.stop/start pour les transitions.

Architecture :
  GameScene.js ──── Monde, entités, physique, IA, caméra
  UIScene.js ─────── HUD, inventaire, dialogues, minimap (scrollFactor: 0)

Communication : UNIQUEMENT via EventBus.js
  Jamais : UIScene.scene.get('GameScene').player.hp
  Toujours : EventBus.on('player:stats_changed', updateHUD)

Transitions dans-jeu : Fondus caméra GameScene (camera.fade/flash)
Transition vers Menu : this.scene.start('MenuScene') + this.scene.stop('GameScene')


### 4.3 IA Ennemie — Steering Behaviors (Pas d'A*)


DÉCISION : IA de déplacement par Steering Behaviors, pas par pathfinding A*.

Pourquoi :
  A* sur une tilemap 80x80 = algorithme lourd + graphe de navigation = +150 lignes
  Steering Behaviors = 20 lignes, résultat visuel satisfaisant pour un MVP

Implémentation Steering autorisée :
  SEEK   : Aller vers la cible (moveToObject Phaser natif)
  FLEE   : Fuir la cible (direction inverse × speed)
  WANDER : Patrol aléatoire entre waypoints prédéfinis
  AVOID  : Séparation avec autres ennemis (raycast Arcade Physics simple)

Limitation acceptée (documentée dans GDD.md) :
  Les ennemis peuvent temporairement se bloquer dans les coins des murs.
  C'est acceptable pour le MVP. Un A* sera envisagé post-MVP.


### 4.4 Système de Compétences — Calcul Throttlé


DÉCISION : Les gains de compétences sont calculés toutes les 500ms, pas à chaque frame.

Justification : Éviter des dizaines de calculs par seconde inutiles.

Implémentation :
  SkillSystem.js maintient un timer interne.
  Chaque entité ENREGISTRE ses actions (attaques, distance courue)
  toutes les 500ms, SkillSystem.update() les consomme et calcule les gains.
  Emit 'skill:progressed' sur EventBus → UIScene affiche notification si milestone.


### 4.5 Sauvegarde — LocalStorage avec Compression Conditionnelle


DÉCISION : Sauvegarde en JSON brut localStorage.
Compression pako.js uniquement si JSON.stringify > 45KB.

Structure de clés :
  'aetheria_save_v1'       → État complet (player + world)
  'aetheria_settings_v1'   → Options (volume, contrôles)

Limite de taille :
  localStorage disponible : ~5MB par domaine
  Taille cible sauvegarde : < 30KB
  Données volumineuses (fogOfWar Uint8Array) : stockées en base64 compressé


---

## 5. BUDGET ESTIMATIF PAR ÉTAPE

### 5.1 Tableau de Budget Complet

| Étape | Nom | Taille | Lignes Créées | Lignes Modif. (DIFF) | Nb Fichiers | Alerte |
|-------|-----|--------|--------------|----------------------|-------------|--------|
| 1 | Scaffolding & Game Loop | **S** | ~235 | 0 | 6 (+MEMORY_STATE) | ✅ Sûr |
| 2 | Scènes & Preloader | **M** | ~285 | ~30 | 5 | ✅ Sûr |
| 3 | Tilemap & Monde | **L** | ~120 + assets | ~150 | 4 | ✅ Sûr |
| 4 | Joueur & Contrôles | **L** | ~200 | ~70 | 3 | ✅ Sûr |
| 5 | PNJ, Ennemis & IA | **XL** | ~510 | ~80 | 7 | ⚠️ **Surveiller** |
| 6 | Combat Complet | **XL** | ~260 | ~180 | 6 | ⚠️ **Surveiller** |
| 7 | Inventaire & Items | **L** | ~400 | ~30 | 5 | ✅ Sûr |
| 8 | Progression Skills | **M** | ~250 | ~65 | 4 | ✅ Sûr |
| 9 | Économie & Crafting | **L** | ~290 | ~110 | 5 | ✅ Sûr |
| 10 | HUD & Factions | **M** | ~280 | ~60 | 4 | ✅ Sûr |
| 11 | Audio & Jour/Nuit | **M** | ~100 | ~110 | 4 | ✅ Sûr |
| 12 | Sauvegarde & Pause | **M** | ~150 | ~150 | 4 | ✅ Sûr |
| 13 | Polish Visuel | **L** | ~60 | ~210 | 8 | ✅ Sûr |
| 14 | TDD & Optimisation | **L** | ~270 (tests) | ~variable | 5 | ✅ Sûr |
| 15 | Build Final & Deploy | **M** | ~80 | ~25 | 4 | ✅ Sûr |

**Total estimé :** ~3 490 lignes créées + ~1 270 lignes DIFF = ~4 760 lignes équivalentes

### 5.2 Points de Risque Identifiés


⚠️ ÉTAPE 5 (IA) — Risque : XL avec 7 fichiers
   → Si AIManager + Enemy + NPC dépassent les budgets : scinder Enemy en
     Enemy.js (core) + EnemyStates.js (states) AVANT d'écrire.

⚠️ ÉTAPE 6 (Combat) — Risque : Cascade de DIFF sur 6 fichiers
   → Utiliser DIFF protocol strict. Pas de réécriture Player.js entier.
   → Si CombatSystem dépasse 200 lignes → extraire EffectSystem.js.

⚠️ ÉTAPES 5-8 — Risque : Accumulation historique conversationnel
   → À partir de l'étape 8, vérifier l'indicateur de santé de session.
   → Si 🔴 → déclencher Context Reset Protocol immédiatement.

⚠️ MEMORY_STATE.md — Risque : Croissance incontrôlée
   → Vérifier la taille à chaque étape.
   → Si > 150 lignes → archiver dans MEMORY_ARCHIVE.md (section "BUGS RÉSOLUS").


---

## 6. SEUILS D'ALERTE DE SESSION


INDICATEURS DE SANTÉ DE LA SESSION AGENT MODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟢 VERT — Session en bonne santé
   Conditions : Étapes < 10/15, MEMORY_STATE.md < 80 lignes,
                Aucun fichier proche de sa limite, < 10 échanges

🟡 ORANGE — Ralentir, surveiller
   Conditions : Étapes ≥ 10/15, MEMORY_STATE.md entre 80-130 lignes,
                Un fichier à > 80% de sa limite, 10-15 échanges
   Action : Simplifier l'étape en cours, compresser MEMORY_STATE.md

🔴 ROUGE — Context Reset Recommandé Immédiatement
   Conditions : MEMORY_STATE.md > 130 lignes (risque proche 150),
                > 15 échanges conversationnels, répétition de questions,
                Oubli de décisions précédentes
   Action : Annoncer le reset, vérifier MEMORY_STATE.md complet,
             demander nouvelle session avec upload du workspace

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AFFICHAGE OBLIGATOIRE à chaque fin d'étape :
"📊 Session: Étape [N]/15 — [X] fichiers — MEMORY: [Y] lignes — Santé: [🟢/🟡/🔴]"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


---

## 7. RÈGLES DE COMPRESSION MEMORY_STATE.md

Quand MEMORY_STATE.md approche 130 lignes, appliquer cette compression :


COMPRESSER :
  Section "BUGS RÉSOLUS" :
    → Garder les 5 bugs les plus récents (format ultra-court : 1 ligne par bug)
    → Archiver les autres dans MEMORY_ARCHIVE.md
    → Format court : "Étape N: [bug] → [fix en 5 mots]"

  Section "DÉCISIONS D'ARCHITECTURE" :
    → Conserver uniquement les décisions actives
    → Supprimer les décisions obsolètes (remplacées par de nouvelles)

NE JAMAIS COMPRESSER :
  Section "ÉTAT DU WORKSPACE" (tableau fichiers) → Toujours complet
  Section "VARIABLES D'ENVIRONNEMENT" → Toujours complet
  Section "PROGRESSION" → Toujours à jour
  Section "PROCHAINE ÉTAPE" → Toujours présente


---

## 8. PÉRIMÈTRE MVP — FEATURES HORS-SCOPE

> Ces features sont explicitement EXCLUES du MVP pour respecter le budget de 15 étapes.
> Toute demande d'implémentation de ces features DOIT être refusée par l'Agent.


❌ HORS-SCOPE MVP (à implémenter post-MVP uniquement)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Système de construction de base (Kenshi base building)
- Recrutement et gestion de compagnons
- Système de maladies/empoisonnements
- Économie dynamique (fluctuation des prix selon l'offre/demande)
- Plus de 4 types d'ennemis distincts
- Plus de 3 zones du monde (Hub, Plaine, Gorges, Campement = 4 zones OK)
- Quêtes scriptées (la narration émergente suffit pour le MVP)
- Système de réputation affiché numériquement (seuils d'hostilité = suffisant)
- Multijoueur de quelque nature que ce soit
- Génération procédurale de la carte
- Météo dynamique (pluie, tempête de sable)
- Montures ou véhicules
- Magie et sorts
- Mini-jeux (crochetage, etc.)
- Échanges complexes entre PNJ (économie PNJ-à-PNJ)