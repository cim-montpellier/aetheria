# ASSETS_PLAN.md — Plan d'Intégration des Ressources
# Sands of Aetheria (MVP) — Sources CC0, Formats, Pipeline Agent
**Version :** 1.0

---

## 1. RÈGLE D'OR DE L'AGENT — LE PRINCIPE PLACEHOLDER

> **⚡ DIRECTIVE ABSOLUE :** Un asset manquant ne bloque JAMAIS le développement.
> Si un asset graphique ou audio est absent, l'Agent DOIT utiliser immédiatement
> un placeholder Phaser. Le code ne doit jamais contenter de strings vers des
> assets non-existants sans fallback.

### 1.1 Bibliothèque de Placeholders Phaser (à utiliser sans hésitation)

```javascript
// ══════════════════════════════════════════════════════════════
// PLACEHOLDERS GRAPHIQUES — Utiliser dans PreloadScene ou create()
// ══════════════════════════════════════════════════════════════

// Placeholder : Rectangle coloré comme sprite
function createRectPlaceholder(scene, key, width, height, color) {
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(color, 1);
    graphics.fillRect(0, 0, width, height);
    graphics.generateTexture(key, width, height);
    graphics.destroy();
}

// Placeholder : Spritesheet (grille de frames colorées avec ID visible)
function createSpritesheetPlaceholder(scene, key, frameW, frameH, frameCount, color) {
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    for (let i = 0; i < frameCount; i++) {
        const hue = (color + i * 20) % 0xFFFFFF;
        graphics.fillStyle(hue, 1);
        graphics.fillRect(i * frameW, 0, frameW - 1, frameH - 1);
        graphics.fillStyle(0xFFFFFF, 1);
    }
    graphics.generateTexture(key, frameW * frameCount, frameH);
    graphics.destroy();
    scene.textures.get(key).add('__BASE', 0, 0, 0, frameW * frameCount, frameH);
}

// ══════════════════════════════════════════════════════════════
// APPELS CONCRETS À UTILISER DANS PreloadScene.js
// ══════════════════════════════════════════════════════════════

// Joueur (spritesheet 9 frames : 8 directions + idle)
createRectPlaceholder(this, 'player', 24, 32, 0x00AA44);

// Ennemis
createRectPlaceholder(this, 'enemy_bandit',   24, 28, 0xCC2200);
createRectPlaceholder(this, 'enemy_scorpion', 20, 20, 0xFF6600);
createRectPlaceholder(this, 'enemy_raider',   26, 32, 0x880000);
createRectPlaceholder(this, 'enemy_boss',     36, 40, 0x440000);

// PNJ Hub
createRectPlaceholder(this, 'npc_merchant',  24, 32, 0x0066FF);
createRectPlaceholder(this, 'npc_smith',     24, 32, 0xFF8800);
createRectPlaceholder(this, 'npc_guard',     24, 32, 0x888888);
createRectPlaceholder(this, 'npc_innkeeper', 24, 32, 0x9933FF);

// Tileset (4 couleurs par zone)
createRectPlaceholder(this, 'tile_hub',    32, 32, 0xC4A35A);
createRectPlaceholder(this, 'tile_plain',  32, 32, 0x8B7355);
createRectPlaceholder(this, 'tile_gorge',  32, 32, 0x5C4A2A);
createRectPlaceholder(this, 'tile_camp',   32, 32, 0x3D2B1A);
createRectPlaceholder(this, 'tile_wall',   32, 32, 0x2C1F0F);
createRectPlaceholder(this, 'tile_water',  32, 32, 0x1A4A6B);

// Items (icônes 16x16)
createRectPlaceholder(this, 'item_stone',       16, 16, 0x888888);
createRectPlaceholder(this, 'item_wood',        16, 16, 0x8B5A2B);
createRectPlaceholder(this, 'item_metal',       16, 16, 0xAAAAAA);
createRectPlaceholder(this, 'item_food',        16, 16, 0xFF4444);
createRectPlaceholder(this, 'item_wood_sword',  16, 16, 0xC8A060);
createRectPlaceholder(this, 'item_metal_sword', 16, 16, 0xDDDDDD);
createRectPlaceholder(this, 'item_leather_armor',16,16, 0x8B6914);
createRectPlaceholder(this, 'item_potion',      16, 16, 0xFF0088);
createRectPlaceholder(this, 'item_gold_coin',   16, 16, 0xFFD700);

// UI
createRectPlaceholder(this, 'ui_bar_bg',    200, 16, 0x333333);
createRectPlaceholder(this, 'ui_bar_hp',    200, 16, 0xDD2222);
createRectPlaceholder(this, 'ui_bar_stam',  200, 16, 0x22AADD);
createRectPlaceholder(this, 'ui_slot_bg',   48,  48, 0x2A2A2A);
createRectPlaceholder(this, 'ui_panel',     300, 400, 0x1A1208);
```

### 1.2 Placeholder Audio (Silence + Console Warning)
```javascript
// AudioManager.js — Fallback si fichier audio absent
function safePlaySFX(key) {
    if (this.sounds[key]) {
        this.sounds[key].play();
    } else {
        // Ne jamais throw — juste ignorer silencieusement
        console.warn(`[AudioManager] SFX absent : ${key} — skipping`);
    }
}
```

---

## 2. FORMATS EXIGÉS

| Type d'Asset | Format Obligatoire | Raison | Fallback |
|-------------|-------------------|--------|---------|
| Spritesheets | **WebP** (qualité 80) | -50% taille vs PNG, support universel Chrome/FF/Safari 2026 | PNG si WebP impossible |
| Tileset | **WebP** (qualité 85) | Tilemap chargée une fois, doit être rapide | PNG |
| Icônes UI | **WebP** (qualité 80) | Petit mais nombreux | SVG inline si icône simple |
| Audio Musique | **OGG** (128 kbps) | Format libre, Howler.js natif | MP3 en fallback (Howler auto) |
| Audio SFX | **OGG** (96 kbps) | Petite taille, latence faible | MP3 |
| Tilemaps | **JSON** (export Tiled) | Format natif Phaser 4 | — |
| Données | **JS modules** (items.js, etc.) | Pas de fetch nécessaire | — |

---

## 3. BESOINS PRÉCIS PAR CATÉGORIE

### 3.1 Spritesheets Joueur

Fichier   : assets/sprites/player.webp
Dimension : 216 x 32 px (9 frames × 24px)
Frames    :
  0 = Idle (face caméra)
  1 = Walk Nord        5 = Walk Sud
  2 = Walk Nord-Est    6 = Walk Sud-Ouest
  3 = Walk Est         7 = Walk Ouest
  4 = Walk Nord-Ouest  8 = Walk Sud-Est
Animation Attaque : surcharger frame idle avec flash (tint)
Style     : Top-down 2D, proportions 3/4, pixel art ou illustrated


### 3.2 Spritesheets Ennemis

Fichier   : assets/sprites/enemies.webp
Contenu   : 4 ennemis côte à côte, chacun 4 frames (idle + walk 2 dirs)
  - Bandit léger     : 24x28 px × 4 frames
  - Scorpion géant   : 20x20 px × 4 frames
  - Pillard armé     : 26x32 px × 4 frames
  - Chef Pillards    : 36x40 px × 4 frames (boss)
Style     : Cohérent avec le joueur, ambiance aride/fantasy


### 3.3 Spritesheets PNJ

Fichier   : assets/sprites/npcs.webp
Contenu   : 4 PNJ, chacun 2 frames (idle + parle)
  - Marchand : robes colorées, sacoche
  - Forgeron : tablier, marteau
  - Garde    : armure légère, lance
  - Aubergiste : tenue simple, tablier


### 3.4 Tileset Monde

Fichier    : assets/tilemaps/world_tileset.webp
Dimension  : 256 x 256 px (8×8 tuiles de 32px)
Tuiles nécessaires (avec position dans la grille) :
  (0,0) Sable plat Hub          (1,0) Sable rugueux
  (2,0) Cendres sol             (3,0) Roche sol
  (0,1) Mur pierre Hub          (1,1) Rocher déco
  (2,1) Arbre-cactus            (3,1) Filon de métal
  (0,2) Eau (oasis)             (1,2) Porte bois
  (2,2) Sol campement           (3,2) Palissade bois
  (0,3) Décor : os              (1,3) Décor : crâne
Style      : Pixel art 32px, ambiance désert aride/fantasy moyen-orient


### 3.5 UI & HUD

Fichier    : assets/ui/hud.webp
Contenu    :
  - Cadre barre HP (200x20 px, fond sombre)
  - Remplissage barre HP (rouge-vif)
  - Cadre barre Endurance (200x12 px)
  - Remplissage barre Endurance (bleu clair)
  - Cadre mini-carte (120x120 px, coins arrondis)
  - Slot inventaire (48x48 px, bord inset)
  - Fond panel (extensible, 9-slice compatible)
Style : Minimaliste sombre, tons ocre/brun, lisible sur fond de jeu


### 3.6 Effets Visuels

Fichier    : assets/sprites/effects.webp
Contenu    :
  - Particule de poussière (8x8 px, 4 frames)
  - Particule d'impact (12x12 px, 5 frames)
  - Lueur de collecte (16x16 px, 6 frames)
  - Indicateur critique (texte "CRIT!" peut être généré par Phaser Text)


---

## 4. SOURCES CC0 RECOMMANDÉES

### 4.1 Graphismes 2D Top-Down

| Source | URL | Licence | Contenu Pertinent | Priorité |
|--------|-----|---------|------------------|----------|
| **Kenney.nl** | https://kenney.nl/assets | **CC0** | Top-down Shooter, RPG Assets, Interface, Tiny Dungeon | ⭐⭐⭐ |
| **OpenGameArt** | https://opengameart.org | CC0/CC-BY | RPG tiles, character sprites, top-down sets | ⭐⭐⭐ |
| **itch.io Free** | https://itch.io/game-assets/free/tag-top-down | varies | Nombreux packs top-down gratuits (lire licence) | ⭐⭐ |
| **Craftpix.net** | https://craftpix.net/freebies/ | Free (non-CC0) | Top-down RPG sets | ⭐⭐ |

#### Packs Kenney Recommandés (CC0, téléchargement direct)

Top-Down Shooter       : https://kenney.nl/assets/top-down-shooter
Tiny Dungeon           : https://kenney.nl/assets/tiny-dungeon
RPG Urban Pack         : https://kenney.nl/assets/rpg-urban-pack
Interface Pack         : https://kenney.nl/assets/interface-sounds
Input Prompts          : https://kenney.nl/assets/input-prompts-pixel-16


### 4.2 Audio SFX

| Source | URL | Licence | Contenu |
|--------|-----|---------|---------|
| **Kenney Interface Sounds** | https://kenney.nl/assets/interface-sounds | CC0 | Clicks, notifications, UI |
| **Kenney Impact Sounds** | https://kenney.nl/assets/impact-sounds | CC0 | Coups, impacts physiques |
| **Mixkit** | https://mixkit.co/free-sound-effects/game/ | Free | SFX jeux variés |
| **Freesound.org** | https://freesound.org (filtrer CC0) | CC0 | Bibliothèque immense |

#### Recherches Freesound Recommandées (termes CC0)

"sword hit" + CC0 licence
"footsteps sand" + CC0
"pickup item" + CC0
"enemy death" + CC0
"chest open" + CC0


### 4.3 Musique Ambiante

| Source | URL | Licence | Pistes Pertinentes |
|--------|-----|---------|-------------------|
| **Mixkit** | https://mixkit.co/free-music/free-music-for-games/ | Free | Desert ambient, adventure loops |
| **FreeMusicArchive** | https://freemusicarchive.org | CC-BY | Ambient, electronic |
| **Soundimage.org** | https://soundimage.org | Free (crédit) | RPG, adventure, ambient |
| **OpenGameArt (audio)** | https://opengameart.org/content/tags/loopable | CC0/CC-BY | Musiques loopable RPG |

---

## 5. PIPELINE D'INTÉGRATION POUR L'AGENT

### 5.1 Workflow de l'Agent (par étape concernée)


Pour chaque asset dans une étape :

1. VÉRIFIER si l'asset existe déjà dans /assets/
   └─ SI OUI → charger normalement dans PreloadScene
   └─ SI NON → utiliser le placeholder Phaser correspondant (§1.1)

2. SI un asset CC0 est disponible via URL directe (CDN Kenney/OpenGameArt) :
   └─ Télécharger via commande bash sandbox :
      wget -O assets/sprites/player.webp [URL_ASSET]
   └─ OU ajouter en chargement différé dans PreloadScene :
      this.load.spritesheet('player', '[URL]', { frameWidth: 24, frameHeight: 32 });

3. TOUJOURS ajouter une entrée dans ASSETS_PLAN.md → section "Assets Intégrés"
   avec : nom_clé | fichier | source | licence | étape_intégrée

4. JAMAIS bloquer l'exécution du code si un asset est manquant.
   Le placeholder doit être fonctionnel avant que l'asset réel arrive.


### 5.2 Chargement Optimal dans PreloadScene.js
```javascript
// PreloadScene.js — Structure de chargement recommandée

preload() {
    // 1. Créer TOUS les placeholders en premier (instantané)
    this.createAllPlaceholders();

    // 2. Charger les assets réels par-dessus (écrase les placeholders si succès)
    this.load.on('loaderror', (file) => {
        console.warn(`[PreloadScene] Asset non trouvé : ${file.key} — placeholder maintenu`);
        // NE PAS throw — continuer avec le placeholder
    });

    // Tilemaps (priorité haute — définit le monde)
    this.load.tilemapTiledJSON('world', 'assets/tilemaps/world.json');
    this.load.image('world_tileset', 'assets/tilemaps/world_tileset.webp');

    // Spritesheets
    this.load.spritesheet('player', 'assets/sprites/player.webp',
        { frameWidth: 24, frameHeight: 32 });
    this.load.spritesheet('enemies', 'assets/sprites/enemies.webp',
        { frameWidth: 24, frameHeight: 32 });

    // Audio (non-bloquant)
    this.load.audio('music_hub',  ['assets/audio/music_hub.ogg',  'assets/audio/music_hub.mp3']);
    this.load.audio('music_wild', ['assets/audio/music_wild.ogg', 'assets/audio/music_wild.mp3']);
    this.load.audio('sfx_attack', ['assets/audio/sfx_attack.ogg', 'assets/audio/sfx_attack.mp3']);
    // ... autres SFX
}

createAllPlaceholders() {
    // Appeler toutes les fonctions createRectPlaceholder() de §1.1
    // Ceci garantit que le jeu peut tourner même avec 0 assets externes
}
```

---

## 6. REGISTRE DES ASSETS (À MAINTENIR PAR L'AGENT)

L'agent doit maintenir ce tableau à jour dans MEMORY_STATE.md à chaque étape :

| Clé Phaser | Fichier | Source | Licence | Étape | Statut |
|------------|---------|--------|---------|-------|--------|
| `player` | sprites/player.webp | Kenney Top-Down Shooter | CC0 | 13 | ⏳ En attente |
| `enemies` | sprites/enemies.webp | OpenGameArt | CC0 | 13 | ⏳ En attente |
| `world_tileset` | tilemaps/world_tileset.webp | Kenney RPG Urban | CC0 | 13 | ⏳ En attente |
| `music_hub` | audio/music_hub.ogg | Mixkit | Free | 11 | ⏳ En attente |
| `sfx_attack` | audio/sfx_attack.ogg | Kenney Impact | CC0 | 11 | ⏳ En attente |
| *(tous les autres)* | *placeholder Phaser* | *Généré* | *N/A* | *1* | ✅ Placeholder actif |

> **Note pour l'Agent :** Mettre à jour le statut de "⏳ En attente" à "✅ Intégré" ou "⚠️ Placeholder maintenu" à chaque étape de polish visuel (Étape 13).

---

## 7. CONTRAINTES TECHNIQUES DE TRAITEMENT


Taille maximale par asset individuel :
  Spritesheet joueur  : < 50 KB
  Spritesheet ennemis : < 80 KB
  Tileset principal   : < 150 KB
  Musique loop (OGG)  : < 800 KB par piste
  SFX individuels     : < 50 KB chacun
  Total assets        : < 3 MB (objectif), < 5 MB (maximum absolu)

Dimensions recommandées pour le pixel art :
  Tuiles monde        : 32 × 32 px
  Personnages         : 24 × 32 px (ratio 3:4)
  Ennemis petits      : 20 × 20 px
  Icônes items        : 16 × 16 px
  Éléments UI         : multiples de 8px pour le pixel art

Toujours utiliser pixelArt: true dans la config Phaser
et roundPixels: true pour éviter le flou de sous-pixel.
