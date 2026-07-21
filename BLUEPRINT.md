# BLUEPRINT.md — Plan de Développement en 15 Étapes
# Sands of Aetheria (MVP) — Pour Arena.ai Agent Mode
**Version :** 1.0 | **Total Étapes :** 15 | **Jouable dès :** Étape 7

---

## LÉGENDE

| Symbole | Signification |
|---------|--------------|
| **S** | Small — 100-200 lignes, 2-3 fichiers, ~15-20 min agent |
| **M** | Medium — 200-400 lignes, 3-5 fichiers, ~20-35 min agent |
| **L** | Large — 400-600 lignes, 5-8 fichiers, ~35-50 min agent |
| **XL** | Extra-Large — 600-800 lignes, 8-10 fichiers, ~50-70 min agent |
| 🎮 | Étape marquant un jalon jouable dans le sandbox |
| 🧪 | Étape de test/validation TDD obligatoire |
| 💾 | Mise à jour obligatoire de MEMORY_STATE.md |

---

## ÉTAPE 1 — SCAFFOLDING & GAME LOOP
**Complexité :** S | 💾

### Objectif
Créer la structure complète du projet, configurer Phaser 4 via CDN, et afficher un canvas WebGL fonctionnel avec un game loop actif.

### Livrables
| Fichier | Action | Lignes Est. |
|---------|--------|-------------|
| `index.html` | CRÉER — structure HTML5, import CDN Phaser 4.1 + Howler.js | 35 |
| `src/main.js` | CRÉER — GameConfig Phaser 4, registration des 5 scènes | 60 |
| `src/config.js` | CRÉER — toutes les constantes globales du projet | 80 |
| `src/utils/EventBus.js` | CRÉER — Singleton EventEmitter | 20 |
| `src/scenes/BootScene.js` | CRÉER — Boot minimal, logo placeholder rectangulaire | 40 |
| `MEMORY_STATE.md` | CRÉER — initialisation de la mémoire persistante | 50 |

### Tests de Validation (Sandbox)
- [ ] `index.html` s'ouvre sans erreur console
- [ ] Canvas WebGL visible (couleur de fond `#1a1208`)
- [ ] FPS counter affiché (Phaser debug ou custom)
- [ ] BootScene démarre et transite vers PreloadScene (vide acceptable)

### Dépendances
Aucune — étape fondatrice.

---

## ÉTAPE 2 — SYSTÈME DE SCÈNES & PRELOADER
**Complexité :** M | 💾

### Objectif
Implémenter le flux complet de scènes (Boot → Preload → Menu → Game) avec chargement d'assets via placeholders Phaser Graphics.

### Livrables
| Fichier | Action | Lignes Est. |
|---------|--------|-------------|
| `src/scenes/PreloadScene.js` | CRÉER — barre de progression, chargement placeholders | 80 |
| `src/scenes/MenuScene.js` | CRÉER — titre, boutons New Game / Load Game / Options | 120 |
| `src/scenes/GameScene.js` | CRÉER — squelette vide, fond coloré, caméra initialisée | 60 |
| `src/scenes/UIScene.js` | CRÉER — squelette vide, lancée en parallèle de GameScene | 30 |
| `src/utils/ObjectPool.js` | CRÉER — pool générique réutilisable | 50 |

### Tests de Validation
- [ ] Navigation fluide Boot → Preload → Menu → Game
- [ ] Bouton "New Game" lance GameScene
- [ ] Bouton "Load Game" désactivé si pas de sauvegarde
- [ ] UIScene active simultanément à GameScene (vérifier `scene.manager.scenes`)

### Dépendances
Étape 1.

---

## ÉTAPE 3 — TILEMAP & MONDE DE JEU
**Complexité :** L | 💾

### Objectif
Charger et afficher la tilemap principale (world.json), définir les 4 zones, et configurer les limites du monde et les couches de collision.

### Livrables
| Fichier | Action | Lignes Est. |
|---------|--------|-------------|
| `assets/tilemaps/world.json` | CRÉER — tilemap Tiled 80x80, 4 zones, 3 layers (Ground/Decor/Collision) | généré |
| `assets/tilemaps/world_tileset.webp` | CRÉER — tileset placeholder (couleurs unies par zone) | image |
| `src/scenes/GameScene.js` | MODIFIER DIFF — chargement tilemap, 3 layers, physics.setBounds | +120 |
| `src/scenes/PreloadScene.js` | MODIFIER DIFF — ajout chargement tilemap JSON + tileset image | +20 |

### Détail Tilemap MVP

Zones (en tuiles 32px) :
- Hub Oasis        : x:0-19,  y:0-19  (couleur : #c4a35a — sable chaud)
- Plaine Cendres   : x:20-59, y:0-49  (couleur : #8b7355 — cendres)
- Gorges de Sael   : x:60-79, y:0-79  (couleur : #5c4a2a — roche sombre)
- Campement Pillards: x:60-79, y:50-79 (couleur : #3d2b1a — terre brûlée)


### Tests de Validation
- [ ] Tilemap visible avec les 4 zones colorées distinctes
- [ ] Caméra limitée aux bounds du monde (0, 0, 2560, 2560)
- [ ] Couche Collision active (vérifier avec `arcade.debug: true`)
- [ ] FPS stable > 55 avec la tilemap complète chargée

### Dépendances
Étapes 1, 2.

---

## ÉTAPE 4 — ENTITÉ JOUEUR & CONTRÔLES
**Complexité :** L | 💾

### Objectif
Implémenter le personnage joueur complet avec mouvement 8 directions, animations placeholder, caméra de suivi, et contrôles clavier + touch.

### Livrables
| Fichier | Action | Lignes Est. |
|---------|--------|-------------|
| `src/entities/Player.js` | CRÉER — sprite, physique Arcade, input, animations, endurance | 200 |
| `src/scenes/GameScene.js` | MODIFIER DIFF — instanciation Player, collider walls | +40 |
| `src/config.js` | MODIFIER DIFF — constantes joueur (vitesses, HP, endurance) | +30 |

### Animations Placeholder (Phaser Graphics — sans spritesheet)
```javascript
// Approche placeholder si assets absents :
// Créer un Rectangle 24x32 coloré (vert) comme "sprite" joueur
// Indicateur de direction : triangle de 8px sur le côté actif
// Animations : changer la teinte (running=vert vif, idle=vert moyen)
```

### Contrôles Implémentés
- ZSQD / WASD / Flèches → déplacement 8 directions
- Shift → course (consomme endurance)
- Espace → esquive roulade (implémentée comme dash + timer invincibilité)
- E → interaction (emit `player:interact` sur EventBus)
- Touch : Joystick virtuel HTML/CSS overlay (pointerId gauche = move, droite = attaque)

### Tests de Validation
- [ ] Joueur se déplace dans les 8 directions
- [ ] Caméra suit le joueur avec lerp (pas de snap brutal)
- [ ] Joueur ne traverse pas la couche Collision
- [ ] Endurance se consomme à la course et se régénère au repos
- [ ] Contrôles tactiles fonctionnels sur viewport mobile (F12 DevTools)

### Dépendances
Étapes 1, 2, 3.

---

## ÉTAPE 5 — PNJ, ENTITÉS ENNEMIES & IA STATE MACHINE
**Complexité :** XL | 💾

### Objectif
Implémenter le système d'IA (State Machine universelle), les ennemis patrouilleurs, et les PNJ du Hub avec routines basiques.

### Livrables
| Fichier | Action | Lignes Est. |
|---------|--------|-------------|
| `src/systems/AIManager.js` | CRÉER — StateMachine class + update loop | 100 |
| `src/entities/Enemy.js` | CRÉER — entité générique + 6 states (IDLE/PATROL/CHASE/ATTACK/FLEE/DEAD) | 220 |
| `src/entities/NPC.js` | CRÉER — PNJ avec states ROUTINE/INTERACT/TRADE/ALARMED | 130 |
| `src/data/enemies.js` | CRÉER — templates stats (Bandit, Scorpion, Pillard, Chef) | 60 |
| `src/data/npcs.js` | CRÉER — données PNJ Hub (Marchand, Forgeron, Gardes, Aubergiste) | 60 |
| `src/scenes/GameScene.js` | MODIFIER DIFF — spawn ennemis par zone, PNJ Hub | +80 |

### Tests de Validation
- [ ] Ennemi passe IDLE → CHASE quand joueur à < 150px
- [ ] Ennemi passe CHASE → ATTACK quand joueur à < 45px
- [ ] Ennemi FLEE quand HP < 20%
- [ ] PNJ Hub se déplace entre waypoints (aller-retour simple)
- [ ] PNJ Hub passe INTERACT quand joueur appuie E à portée

### Dépendances
Étapes 1-4.

---

## ÉTAPE 6 — SYSTÈME DE COMBAT COMPLET
**Complexité :** XL | 🎮 | 💾

### Objectif
Implémenter le système de combat temps réel complet : attaques, hitboxes, dégâts, blessures localisées, mort/respawn — le jeu devient JOUABLE.

### Livrables
| Fichier | Action | Lignes Est. |
|---------|--------|-------------|
| `src/systems/CombatSystem.js` | CRÉER — résolution dégâts, blessures, mort, knockback | 180 |
| `src/entities/Player.js` | MODIFIER DIFF — ajout attaque légère/lourde/parade, hitbox attaque | +120 |
| `src/entities/Enemy.js` | MODIFIER DIFF — prise de dégâts, drop loot à la mort | +60 |
| `src/entities/Projectile.js` | CRÉER — projectile poolé (pour ennemis à distance) | 80 |
| `src/scenes/GameScene.js` | MODIFIER DIFF — overlap combat, feedback visuel (flash, knockback) | +50 |

### Mécaniques de Combat Détaillées

Attaque Légère  : Dégâts = stats.attack * (1 + skills.melee/200)
                  Hitbox activée 200ms, cooldown 400ms
Attaque Lourde  : Charge 800ms → Dégâts x2.5, stun ennemi 300ms
Esquive         : Invincibilité 300ms, dash 80px, cooldown 1200ms
Parade          : -60% dégâts, si timing < 200ms → contre (stun ennemi 500ms)

Feedback Visuel (Phaser Graphics — sans spritesheet) :
- Hit : Flash rouge sur sprite touché (tintFill 100ms)
- Mort ennemi : Tween fadeOut 500ms puis destroy
- Coup critique : Texte popup "+CRIT" en jaune


### Tests de Validation
- [ ] Attaque légère inflige dégâts à l'ennemi (vérifier HP dans debug)
- [ ] Attaque lourde charge et frappe (feedback visuel visible)
- [ ] Esquive donne invincibilité (ennemi ne peut pas toucher pendant 300ms)
- [ ] Mort ennemi déclenche fadeOut et drop d'item (placeholder)
- [ ] Mort joueur → écran Game Over → respawn Hub avec -50% ressources
- [ ] **GAMEPLAY TEST** : Session de 5 min sans crash ni erreur console

### Dépendances
Étapes 1-5.

---

## ÉTAPE 7 — INVENTAIRE & SYSTÈME D'ITEMS
**Complexité :** L | 🎮 | 💾

### Objectif
Implémenter la collecte d'items, la gestion de l'inventaire (grille 24 slots), l'équipement (arme/armure) et l'impact sur les stats.

### Livrables
| Fichier | Action | Lignes Est. |
|---------|--------|-------------|
| `src/systems/InventorySystem.js` | CRÉER — add/remove/equip/unequip, calcul stats équipées | 150 |
| `src/data/items.js` | CRÉER — définitions 15 items MVP (armes, armures, consommables, ressources) | 100 |
| `src/ui/InventoryUI.js` | CRÉER — grille 24 slots, drag-and-drop, affichage stats | 150 |
| `src/scenes/UIScene.js` | MODIFIER DIFF — toggle InventoryUI sur touche I | +20 |
| `src/entities/Enemy.js` | MODIFIER DIFF — drop table d'items à la mort | +30 |

### Tests de Validation
- [ ] Ramasser un item l'ajoute à l'inventaire
- [ ] Équiper une arme augmente les dégâts de combat
- [ ] Équiper une armure augmente la résistance aux dégâts
- [ ] Consommer une potion régénère les HP
- [ ] Inventaire plein : notification "Inventaire plein"

### Dépendances
Étapes 1-6.

---

## ÉTAPE 8 — PROGRESSION "LEARN BY DOING" & COMPÉTENCES
**Complexité :** M | 💾

### Objectif
Implémenter le système de progression systémique (7 compétences), les formules de gain, et les milestones de déblocage (25/50/75/100).

### Livrables
| Fichier | Action | Lignes Est. |
|---------|--------|-------------|
| `src/systems/SkillSystem.js` | CRÉER — calculs gains, formule diminishing, milestones, events | 150 |
| `src/ui/SkillsUI.js` | CRÉER — fenêtre 7 compétences avec barres de progression | 100 |
| `src/entities/Player.js` | MODIFIER DIFF — hooks emit events (combat, course, esquive, minage) | +40 |
| `src/scenes/UIScene.js` | MODIFIER DIFF — toggle SkillsUI sur touche K, notification level-up | +25 |

### Tests de Validation
- [ ] Frapper ennemis augmente `skills.melee` (vérifier dans console)
- [ ] Courir augmente `skills.athletics` (tester 30s de course)
- [ ] Milestone 25 affiche notification "Compétence : [nom] — Niveau Adepte"
- [ ] Milestone 50 active le bonus passif (critique 10% pour Mêlée)
- [ ] Formule diminishing returns fonctionnelle (gain < 0.01 à niveau 90+)

### Dépendances
Étapes 1-7.

---

## ÉTAPE 9 — ÉCONOMIE : MINAGE, CRAFTING & COMMERCE
**Complexité :** L | 💾

### Objectif
Implémenter la récolte de ressources (minage/collecte), le système de crafting avec recettes, et le commerce avec les PNJ marchands.

### Livrables
| Fichier | Action | Lignes Est. |
|---------|--------|-------------|
| `src/systems/CraftingSystem.js` | CRÉER — vérification recettes, consommation ressources, création item | 100 |
| `src/data/recipes.js` | CRÉER — 8 recettes MVP | 60 |
| `src/ui/ShopUI.js` | CRÉER — interface achat/vente, prix dynamiques | 130 |
| `src/entities/NPC.js` | MODIFIER DIFF — state TRADE, stock Marchand, stock Forgeron | +50 |
| `src/scenes/GameScene.js` | MODIFIER DIFF — spawn ressources (Rochers/Filons), interaction minage | +60 |

### Tests de Validation
- [ ] Miner un Rocher ajoute 1-3 Pierre à l'inventaire
- [ ] Crafter "Épée de Bois" consomme 3 Bois-Sec et l'ajoute à l'inventaire
- [ ] Commerce avec Marchand : vendre Pierre → recevoir Or
- [ ] Commerce avec Marchand : acheter Potion → débité en Or
- [ ] Ressources respawn après 5 min réelles (vérifier timestamp)

### Dépendances
Étapes 1-8.

---

## ÉTAPE 10 — HUD COMPLET & SYSTÈME DE FACTIONS
**Complexité :** M | 💾

### Objectif
Finaliser le HUD in-game (HP, Endurance, mini-map, notifications), implémenter le système de factions avec réputation et hostilité dynamique.

### Livrables
| Fichier | Action | Lignes Est. |
|---------|--------|-------------|
| `src/ui/HUD.js` | CRÉER — barres HP/Endurance animées, mini-carte (fog of war), queue de notifications | 180 |
| `src/systems/FactionSystem.js` | CRÉER — réputation 3 factions, seuils hostilité, propagation | 100 |
| `src/scenes/UIScene.js` | MODIFIER DIFF — intégration HUD, mise à jour via EventBus | +40 |
| `src/entities/NPC.js` | MODIFIER DIFF — transition ALARMED si faction hostile | +20 |

### Tests de Validation
- [ ] Barre HP se met à jour en temps réel (réduction visible lors de dégâts)
- [ ] Barre Endurance se vide à la course et se régénère
- [ ] Mini-carte révèle les zones visitées
- [ ] Attaquer un Marchand rend la faction Oasis hostile (gardes CHASE)
- [ ] Notification de level-up compétence apparaît et disparaît après 3s

### Dépendances
Étapes 1-9.

---

## ÉTAPE 11 — AUDIO & CYCLE JOUR/NUIT
**Complexité :** M | 💾

### Objectif
Intégrer l'audio complet via Howler.js (musique ambiance + SFX combat/UI) et implémenter le cycle jour/nuit avec variation d'ambiance visuelle.

### Livrables
| Fichier | Action | Lignes Est. |
|---------|--------|-------------|
| `src/systems/AudioManager.js` | CRÉER — wrapper Howler.js, musique/SFX, fade, volume | 100 |
| `src/scenes/GameScene.js` | MODIFIER DIFF — cycle jour/nuit (tint caméra, IA nocturne) | +60 |
| `src/scenes/UIScene.js` | MODIFIER DIFF — indicateur heure (icône soleil/lune) | +20 |
| `src/scenes/GameScene.js` | MODIFIER DIFF — hooks audio sur combat/crafting/pickup | +30 |

### Sources Audio (CC0 — voir ASSETS_PLAN.md)
- Musique Hub : Mixkit "Desert ambient" ou placeholder silence
- Musique Wild : Freesound "ambient tension" CC0
- SFX combat : Kenney Interface Sounds (CC0)

### Tests de Validation
- [ ] Musique Hub joue en boucle sans coupure
- [ ] Musique change lors du passage Hub → Plaine (fade cross)
- [ ] SFX attaque joue à chaque frappe (vérifier pas de duplication)
- [ ] Cycle jour/nuit visible (teinte caméra varie sur 5 min)
- [ ] Mute/Unmute via bouton dans UIScene

### Dépendances
Étapes 1-10.

---

## ÉTAPE 12 — SAUVEGARDE, CHARGEMENT & MENU PAUSE
**Complexité :** M | 💾

### Objectif
Implémenter le système de sauvegarde complet (LocalStorage), l'auto-save, le menu pause, et le chargement d'une partie sauvegardée depuis le menu principal.

### Livrables
| Fichier | Action | Lignes Est. |
|---------|--------|-------------|
| `src/systems/SaveSystem.js` | CRÉER — save/load/delete, sérialisation état complet, versioning | 150 |
| `src/scenes/MenuScene.js` | MODIFIER DIFF — Load Game actif, affichage date/heure sauvegarde | +40 |
| `src/scenes/GameScene.js` | MODIFIER DIFF — auto-save 60s, save au retour Hub, restore world state | +60 |
| `src/ui/HUD.js` | MODIFIER DIFF — menu pause (Échap), options volume, bouton Save & Quit | +50 |

### Tests de Validation
- [ ] New Game crée une sauvegarde après 10s
- [ ] Quitter et relancer → Load Game restaure position, HP, inventaire, compétences
- [ ] Ennemis tués restent morts après rechargement
- [ ] Coffres ouverts restent ouverts après rechargement
- [ ] Auto-save toutes les 60s (vérifier timestamp localStorage)

### Dépendances
Étapes 1-11.

---

## ÉTAPE 13 — POLISH VISUEL & ASSETS FINAUX
**Complexité :** L | 💾

### Objectif
Remplacer tous les placeholders par les assets graphiques réels (spritesheets Kenney/OpenGameArt), ajouter les effets de particules et le juice visuel.

### Livrables
| Fichier | Action | Lignes Est. |
|---------|--------|-------------|
| `assets/sprites/` | INTÉGRER — spritesheets joueur, ennemis, PNJ, items (CC0) | assets |
| `assets/tilemaps/world_tileset.webp` | REMPLACER — tileset aride/fantasy réel | asset |
| `src/entities/Player.js` | MODIFIER DIFF — animations réelles (idle/walk/run/attack) | +60 |
| `src/entities/Enemy.js` | MODIFIER DIFF — animations réelles + death animation | +40 |
| `src/scenes/GameScene.js` | MODIFIER DIFF — Phaser.GameObjects.Particles (impact, pickups, mort) | +80 |
| `src/ui/HUD.js` | MODIFIER DIFF — assets UI réels (cadres, icônes) | +30 |

### Effets Visuels à Ajouter
- Particules d'impact (poussière + étincelles) au contact combat
- Particles de collecte (lueur dorée) au ramassage d'item
- Screen shake (0.005 intensité, 200ms) sur coup reçu
- Vignette noire progressive quand HP < 30%

### Tests de Validation
- [ ] Tous les placeholders remplacés (aucun rectangle uni pour entities)
- [ ] Animations joueur : idle, walk 8 dirs, attack, death
- [ ] 60 FPS stable avec tous les assets visuels chargés
- [ ] Particules de combat visibles sans impacter le FPS

### Dépendances
Étapes 1-12.

---

## ÉTAPE 14 — TESTS TDD, OPTIMISATION & BUGFIX
**Complexité :** L | 🧪 | 💾

### Objectif
Écrire et exécuter les tests de non-régression pour tous les systèmes, profiler les performances, et corriger les bugs identifiés.

### Livrables
| Fichier | Action | Lignes Est. |
|---------|--------|-------------|
| `tests/test_combat.js` | CRÉER — tests unitaires CombatSystem | 80 |
| `tests/test_skills.js` | CRÉER — tests SkillSystem (formules, milestones) | 60 |
| `tests/test_save.js` | CRÉER — tests SaveSystem (sérialisation round-trip) | 70 |
| `tests/test_ai.js` | CRÉER — tests StateMachine (transitions) | 60 |
| `src/systems/*.js` | MODIFIER DIFF — corrections basées sur résultats tests | variable |

### Tests de Performance
```bash
# Dans le sandbox — mesures cibles
# 60 FPS stable avec 30 ennemis actifs simultanément
# Memory heap < 80 MB après 10 min de jeu
# LocalStorage save < 50 KB (vérifier JSON.stringify)
# First Meaningful Paint < 3 secondes (réseau simulé 4G)
```

### Tests Gameplay Obligatoires
- [ ] Session complète 15 min sans crash
- [ ] Cycle complet : Hub → Plaine → Gorges → Campement → Victoire → Hub
- [ ] Sauvegarder, quitter, relancer, reprendre exactement où on était
- [ ] Mobile : Contrôles tactiles fonctionnels, 30+ FPS sur viewport 375x667

### Dépendances
Toutes les étapes précédentes (1-13).

---
## ÉTAPE 15 — BUILD FINAL, DOCUMENTATION & DÉPLOIEMENT
**Complexité :** M | 💾

### Objectif
Produire le build de production final, créer le README complet avec instructions de jeu, et packager le projet prêt à déployer.

### Livrables
| Fichier | Action | Lignes Est. |
|---------|--------|-------------|
| `README.md` | CRÉER — description jeu, contrôles, comment jouer, crédits assets | 80 |
| `index.html` | MODIFIER DIFF — meta tags SEO, OpenGraph, favicon, PWA manifest link | +20 |
| `manifest.json` | CRÉER — PWA manifest (icône, nom, display: standalone) | 20 |
| `src/config.js` | MODIFIER DIFF — `DEBUG_MODE = false`, désactiver tous console.log | +5 |
| `MEMORY_STATE.md` | MISE À JOUR FINALE — état complet du projet terminé | update |

### Vérifications Finales
- [ ] Zéro erreur console en mode release
- [ ] Jeu fonctionne depuis `file://` (pas de serveur HTTP requis)
- [ ] Jeu fonctionne sur GitHub Pages / Netlify (test déploiement direct)
- [ ] README.md complet avec crédits pour tous les assets CC0 utilisés
- [ ] ZIP final du dossier complet exporté depuis le workspace

### Dépendances
Toutes les étapes (1-14).

---

## RÉSUMÉ DU PLAN


Étape  1 : [S]  Scaffolding & Game Loop
Étape  2 : [M]  Scènes & Preloader
Étape  3 : [L]  Tilemap & Monde
Étape  4 : [L]  Joueur & Contrôles
Étape  5 : [XL] PNJ, Ennemis & IA
Étape  6 : [XL] 🎮 COMBAT — Premier Jouable
Étape  7 : [L]  🎮 Inventaire & Items
Étape  8 : [M]  Progression "Learn by Doing"
Étape  9 : [L]  Économie : Minage, Crafting, Commerce
Étape 10 : [M]  HUD & Factions
Étape 11 : [M]  Audio & Cycle Jour/Nuit
Étape 12 : [M]  Sauvegarde & Chargement
Étape 13 : [L]  Polish Visuel & Assets Finaux
Étape 14 : [L]  🧪 TDD, Optimisation & Bugfix
Étape 15 : [M]  Build Final & Déploiement


**Charge totale estimée :** 4 200 lignes de code sur 45+ fichiers
**Étapes XL (critique):** 2 (Étapes 5 et 6) — à surveiller pour potentiel scindage