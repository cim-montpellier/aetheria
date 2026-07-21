# 🏜️ Sands of Aetheria

> *Un monde de sable indifférent à votre existence. Devenez quelqu'un — ou mourez anonymement.*

**Sands of Aetheria** est un **RPG sandbox 2D top-down** brutal et systémique, jouable dans le navigateur (HTML5 / WebGL / [Phaser 4](https://phaser.io)). Vous commencez en *Vagabond* — sans quête, sans destinée, sans héros prédestiné. Le monde ne vous attend pas.

- **L'âme de Skyrim** : liberté totale, progression organique *learn by doing* (frapper ↑ Mêlée, courir ↑ Athlétisme, miner ↑ Minage…).
- **Les dents de Kenshi** : monde hostile et réactif, blessures localisées, mort punitive, émergence systémique.

---

## ✨ Fonctionnalités (MVP)

- 🗺️ **Monde ouvert** — tilemap unique 80×80 (4 zones : Hub Oasis, Plaine des Cendres, Gorges de Sael, Campement des Pillards).
- ⚔️ **Combat temps réel** — attaque légère/lourde, parade (contre-attaque), esquive-roulade, coups critiques, blessures (HP<30% → vitesse −30%, HP<15% → attaque −50%).
- 📈 **Progression *learn by doing*** — 7 compétences (Mêlée, Athlétisme, Endurance, Furtivité, Forge, Minage, Commerce), milestones 25/50/75/100, notifications style Skyrim.
- 🎒 **Inventaire & équipement** — 24 slots, armes/armures/consommables, impact réel sur les stats.
- ⛏️ **Économie** — minage de ressources, crafting (8 recettes), commerce avec les PNJ (prix ± skill Commerce).
- 🤝 **Factions dynamiques** — Marchands d'Oasis, Pillards de Sael, Nomades ; un crime rend une faction hostile (les gardes vous poursuivent).
- 🧠 **IA *steering behaviors*** — ennemis IDLE/PATROL/CHASE/ATTACK/FLEE/DEAD (pas d'A*), PNJ avec routines.
- 🌗 **Cycle jour/nuit** (5 min) — ambiance teintée, IA moins perçante la nuit.
- 💾 **Sauvegarde** — auto-save 60 s + sauvegarde au retour au Hub ; les ennemis tués le restent.
- 🔊 **Audio** — musique d'ambiance zonée (crossfade), SFX (Howler.js).
- 💀 **Mort punitive** — respawn au Hub, HP 25, −50% or, −50% items.

## 🎮 Contrôles

| Action | Touche(s) |
|---|---|
| Déplacement (8 directions) | `ZQSD` / `WASD` / `Flèches` |
| Course (consomme l'endurance) | `Shift` |
| Attaque légère / lourde | `J` / `K` |
| Parade | `L` |
| Esquive-roulade | `Espace` |
| Interagir (PNJ, ressources) | `E` |
| Inventaire | `I` |
| Compétences | `K` |
| Menu pause | `Échap` |

## 🚀 Lancer le jeu

**Aucun build, aucun `npm install`** — le jeu tourne en ES modules natifs via CDN.

- **GitHub Pages / Netlify** : ouvrez l'URL du site déployé.
- **En local (recommandé)** : servez le dossier avec un serveur statique, p. ex. :
  ```bash
  python3 -m http.server 8000   # puis http://localhost:8000
  ```
- **`file://`** : ouvrez `index.html` directement (le chargement des modules/tilemap peut nécessiter un serveur selon le navigateur).

## 🏗️ Architecture

```
index.html            Entrée (CDN Phaser 4.1 + Howler 2.2.4, ES modules)
manifest.json         PWA (installable)
src/
  main.js             Config Phaser + enregistrement des scènes
  config.js           Constantes globales
  scenes/             Boot · Preload · Menu · Game · UI (Game+UI en parallèle, EventBus)
  entities/           Player (+PlayerCombat mixin) · Enemy (+EnemyStates) · NPC · Projectile
  systems/            WorldManager · CombatManager · CombatSystem · SkillSystem ·
                      InventorySystem · CraftingSystem · FactionSystem · SaveSystem ·
                      AudioManager · DayNight · ParticleManager · AIManager
  ui/                 HUD · InventoryUI · SkillsUI · ShopUI
  data/               items · recipes · enemies · npcs · worldZones
  utils/              EventBus · ObjectPool · PlaceholderFactory
assets/tilemaps/      world.json (Tiled 80×80) + world_tileset.png
tests/                18 fichiers · 174 assertions (node, headless)
```

**Piliers techniques** : Arcade Physics uniquement · tilemap unique (pas de chunk loading) · IA *steering* (pas d'A*) · communication 100% **EventBus** (aucun accès scène→scène) · systèmes purs testables · *object pooling* projectiles/particules.

## 🧪 Tests

```bash
node tests/test_step_N.js   # ou l'un des bancs : test_combat / test_skills / test_save / test_ai
```
Suite complète : **18 fichiers · 174 assertions** (logique de combat, progression, sauvegarde, IA, intégration scènes).

## 🎨 Assets & crédits

Les visuels du MVP sont des **placeholders Phaser** générés procéduralement (palette *gritty desert fantasy*, voir `STYLE_GUIDE.md`) — aucun asset manquant ne bloque le jeu (`ASSETS_PLAN.md` §1). Pour la version finale, déposer des sprites **CC0** dans `assets/sprites/` ; sources recommandées :

- [Kenney.nl](https://kenney.nl/assets) — Top-Down Shooter, Tiny Dungeon, Interface Sounds, Impact Sounds (**CC0**)
- [OpenGameArt.org](https://opengameart.org) — sprites/tiles top-down (**CC0 / CC-BY**)
- [Mixkit](https://mixkit.co) / [Freesound.org](https://freesound.org) — musique & SFX (**Free / CC0**)

Icône du jeu : générée pour le projet. Polices : [Cinzel](https://fonts.google.com/specimen/Cinzel) & [Share Tech Mono](https://fonts.google.com/specimen/Share+Tech+Mono) (Google Fonts). Moteur : [Phaser 4](https://phaser.io) · Audio : [Howler.js](https://howlerjs.com).

## 📖 Documents de conception

`GDD.md` (game design) · `TECH_SPEC.md` (technique) · `BLUEPRINT.md` (plan 15 étapes) · `ASSETS_PLAN.md` · `STYLE_GUIDE.md` (direction artistique) · `TOKEN_BUDGET.md` (gouvernance).

---

### 🤖 Développement piloté par IA

Ce projet a été développé de bout en bout en **15 étapes** avec Arena.ai Agent Mode (protocole « Survived Context V2 » : mémoire persistante `MEMORY_STATE.md`, TDD, diff-based editing, budget de tokens strict).

> **Note d'initialisation agent** : avant toute tâche sur ce repository, lire l'intégralité des 6 documents de conception ci-dessus (`GDD.md`, `TECH_SPEC.md`, `BLUEPRINT.md`, `ASSETS_PLAN.md`, `STYLE_GUIDE.md`, `TOKEN_BUDGET.md`) avant de poser quelque question que ce soit.
