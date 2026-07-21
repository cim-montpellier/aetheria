# STYLE_GUIDE.md — Direction Artistique
# Sands of Aetheria (MVP) — Guide Visuel & UI
**Version :** 1.0 | **Style :** Gritty Desert Fantasy 2D Top-Down | **Moteur :** Phaser 4 WebGL

---

## 1. PHILOSOPHIE VISUELLE

> *"Un monde beau parce qu'il est hostile. La beauté vient de la lumière crue sur le sable, pas de la magie scintillante."*

**Trois mots directeurs :** ARIDE — BRUTAL — VIVANT

Le visuel de Sands of Aetheria évite le fantastique coloré et lumineux. Il s'inspire de :
- **Références visuelles :** Kenshi (teintes désaturées, monde épuisé), Dead Cells (lisibilité pixel art), Hyper Light Drifter (post-processing atmosphérique subtil).
- **Anti-références :** Pas de couleurs vives saturées, pas d'UI "dorée épique", pas d'effets magiques excessifs.

---

## 2. PALETTE DE COULEURS

### 2.1 Palette Principale — Monde & Environnement


DÉSERT & SOL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sable Chaud Clair    #D4A96A   ████  Sol Hub Oasis, zones sûres
Sable Brûlé          #C4853A   ████  Sol Plaine des Cendres
Cendre Grise         #8B7355   ████  Zones de combat, cendres
Roche Sombre         #5C4A2A   ████  Gorges, murs naturels
Terre Brûlée         #3D2B1A   ████  Campement Pillards, zones hostiles
Fond Nuit            #1A1208   ████  Background global, ciel nuit
Fond Aube            #2C1F0F   ████  Background aube/crépuscule

ARCHITECTURE & DÉCOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pierre Ocre          #A0784A   ████  Murs Hub, bâtiments
Pierre Fissurée      #7A5C35   ████  Ruines, murs endommagés
Bois Sec             #8B5A2B   ████  Palissades, caisses, portes
Eau Oasis            #1A4A6B   ████  Points d'eau rares
Végétation Rare      #4A6B2A   ████  Cactus, buissons


### 2.2 Palette Personnages & Entités


JOUEUR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Peau Désert          #C4956A   ████  Teinte skin de base
Tissu Vagabond       #6B4A2A   ████  Vêtements de départ
Métal Terne          #8A8A8A   ████  Équipement métal basique
Métal Poli           #C8C8C8   ████  Équipement métal avancé
Cuir Tanné           #8B6914   ████  Armure cuir

ENNEMIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rouge Hostile        #CC2200   ████  Bandits (indicateur faction)
Orange Danger        #FF6600   ████  Scorpions, créatures sauvages
Rouge Profond        #880000   ████  Pillards armés
Noir Menace          #2A1A1A   ████  Chef Pillards (boss)

PNJ ALLIÉS / NEUTRES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bleu Commerce        #4A7ACC   ████  Marchand (robe)
Orange Forge         #CC7722   ████  Forgeron (tablier)
Gris Garde           #7A7A7A   ████  Gardes Hub (armure)
Violet Auberge       #7A3DAA   ████  Aubergiste


### 2.3 Palette UI & HUD


UI FOND & CADRES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Fond Panel Sombre    #0F0A06   ████  Fenêtres, inventaire
Bord Panel           #3A2A1A   ████  Contours des panels
Bord Actif           #8B6030   ████  Slot sélectionné, hover
Séparateur           #2A1A0A   ████  Lignes de séparation

BARRES DE STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HP Plein             #CC2222   ████  Barre vie normale
HP Critique          #FF4444   ████  HP < 30% (pulse)
HP Fond              #2A0808   ████  Background barre HP
Endurance Pleine     #2288CC   ████  Barre endurance
Endurance Vide       #082228   ████  Background barre endurance
Endurance Épuisée    #AA4400   ████  Endurance = 0 (flash)

COMPÉTENCES & PROGRESSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Skill Bar            #CC9922   ████  Barre de progression compétence
Skill BG             #1A1208   ████  Background barre compétence
Milestone Glow       #FFD700   ████  Flash milestone (25/50/75/100)
Or Monnaie           #FFD700   ████  Affichage or, prix
Texte Notification   #F0D080   ████  Notifications Skyrim-style

TEXTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Texte Principal      #E8D5B0   ████  Corps de texte, dialogues
Texte Secondaire     #A08060   ████  Labels, descriptions
Texte Danger         #FF4444   ████  Dégâts, avertissements
Texte Succès         #44CC44   ████  Gains, succès
Texte Désactivé      #4A3A2A   ████  Options grisées


### 2.4 Palette Effets & Feedback


COMBAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sang / Impact        #8B0000   ████  Particules de sang
Poussière Combat     #C4A35A80 ████  Particules sol (alpha 50%)
Étincelles Métal     #FFAA00   ████  Impact métal sur métal
Flash Hit Joueur     #FF0000   ████  Tint flash quand joueur touché
Flash Hit Ennemi     #FF4422   ████  Tint flash quand ennemi touché
Coup Critique        #FFD700   ████  Texte CRIT!, particules

COLLECTE & INTERACTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lueur Item           #FFD70080 ████  Aura item au sol (alpha 50%)
Indicateur E         #FFFFFF80 ████  "Appuyer E" (alpha 50%, pulse)
Minimap Découverte   #C4A35A40 ████  Zones découvertes (fog of war)
Minimap Joueur       #00FF88   ████  Point joueur sur minimap
Minimap Ennemi       #FF2200   ████  Points ennemis sur minimap

JOUR / NUIT (multiplicateurs de teinte caméra)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Aube                 #FF8C42   ████  Tint orange chaud (alpha 30%)
Jour Plein           #FFFFFF   ████  Pas de tint (neutre)
Crépuscule           #FF6B35   ████  Tint orange-rouge (alpha 40%)
Nuit                 #0A1628   ████  Tint bleu très sombre (alpha 60%)


---

## 3. TYPOGRAPHIE

### 3.1 Polices (via Google Fonts CDN ou système)
```html
<!-- Dans index.html — import des fonts -->
<link href="https://fonts.googleapis.com/css2?
    family=MedievalSharp&
    family=Cinzel:wght@400;700&
    family=Share+Tech+Mono&
    display=swap" rel="stylesheet">

<!-- Fallback si Google Fonts inaccessible : -->
<!-- font-family: 'Courier New', monospace -->
```

### 3.2 Hiérarchie Typographique
```javascript
// config.js — Styles de texte Phaser 4
const TEXT_STYLES = {
    // Titre principal (Menu)
    TITLE: {
        fontFamily: "'Cinzel', 'Georgia', serif",
        fontSize: '48px',
        color: '#C4A35A',
        stroke: '#0F0A06',
        strokeThickness: 4,
        shadow: { x: 2, y: 2, color: '#000000', blur: 8, fill: true }
    },
    // HUD — Chiffres (HP, Gold)
    HUD_VALUE: {
        fontFamily: "'Share Tech Mono', 'Courier New', monospace",
        fontSize: '14px',
        color: '#E8D5B0'
    },
    // Notification Skill-Up (style Skyrim)
    SKILL_UP: {
        fontFamily: "'Cinzel', 'Georgia', serif",
        fontSize: '16px',
        color: '#FFD700',
        stroke: '#0F0A06',
        strokeThickness: 3,
        alpha: 0 // démarre invisible, tween vers 1
    },
    // Popup de dégâts flottants
    DAMAGE_POPUP: {
        fontFamily: "'Share Tech Mono', 'Courier New', monospace",
        fontSize: '18px',
        color: '#FF4444',
        stroke: '#000000',
        strokeThickness: 2
    },
    // Popup critique
    CRIT_POPUP: {
        fontFamily: "'Cinzel', 'Georgia', serif",
        fontSize: '22px',
        color: '#FFD700',
        stroke: '#8B0000',
        strokeThickness: 3
    },
    // Dialogue PNJ
    DIALOGUE: {
        fontFamily: "'Share Tech Mono', 'Courier New', monospace",
        fontSize: '13px',
        color: '#E8D5B0',
        wordWrap: { width: 280 }
    },
    // Corps UI (inventaire, descriptions)
    UI_BODY: {
        fontFamily: "'Share Tech Mono', 'Courier New', monospace",
        fontSize: '12px',
        color: '#A08060'
    },
    // Label désactivé
    UI_DISABLED: {
        fontFamily: "'Share Tech Mono', 'Courier New', monospace",
        fontSize: '12px',
        color: '#4A3A2A'
    }
};
```

---

## 4. PLACEHOLDERS PHASER — DIRECTIVES AGENT

> **⚡ RÈGLE ABSOLUE :** L'Agent utilise SYSTÉMATIQUEMENT ces primitives Phaser dès l'étape 1.
> Ne jamais référencer un fichier asset qui n'existe pas encore dans le code.
> Les placeholders sont fonctionnels, esthétiques et cohérents avec la palette.

### 4.1 Primitives Joueur & Entités
```javascript
// ═══════════════════════════════════════════════════════════════
// SYSTÈME DE CRÉATION DE PLACEHOLDERS — À inclure dans PreloadScene.js
// Respecte la palette de couleurs du Style Guide
// ═══════════════════════════════════════════════════════════════

class PlaceholderFactory {

    // Sprite rectangulaire avec indicateur de direction (triangle)
    static createCharacter(scene, key, w, h, bodyColor, accentColor) {
        const g = scene.make.graphics({ add: false });
        // Corps
        g.fillStyle(bodyColor, 1);
        g.fillRect(2, 2, w - 4, h - 4);
        // Bord
        g.lineStyle(1, accentColor, 1);
        g.strokeRect(2, 2, w - 4, h - 4);
        // Indicateur direction (triangle haut = direction neutre)
        g.fillStyle(accentColor, 0.8);
        g.fillTriangle(w/2, 2, w/2-4, 10, w/2+4, 10);
        g.generateTexture(key, w, h);
        g.destroy();
    }

    // Sprite de ressource (pierre, bois, métal) avec icône simplifiée
    static createResource(scene, key, size, color) {
        const g = scene.make.graphics({ add: false });
        g.fillStyle(color, 1);
        g.fillCircle(size/2, size/2, size/2 - 2);
        g.lineStyle(2, 0x000000, 0.5);
        g.strokeCircle(size/2, size/2, size/2 - 2);
        // Reflet (coin haut-gauche)
        g.fillStyle(0xFFFFFF, 0.2);
        g.fillCircle(size/3, size/3, size/6);
        g.generateTexture(key, size, size);
        g.destroy();
    }

    // Item au sol (lueur pulsée)
    static createItemPickup(scene, key, size, color) {
        const g = scene.make.graphics({ add: false });
        // Aura
        g.fillStyle(color, 0.2);
        g.fillCircle(size/2, size/2, size/2);
        // Corps item
        g.fillStyle(color, 1);
        g.fillRect(size/4, size/4, size/2, size/2);
        g.lineStyle(1, 0xFFFFFF, 0.5);
        g.strokeRect(size/4, size/4, size/2, size/2);
        g.generateTexture(key, size, size);
        g.destroy();
    }

    // Tuile de terrain
    static createTile(scene, key, color, pattern = 'plain') {
        const g = scene.make.graphics({ add: false });
        g.fillStyle(color, 1);
        g.fillRect(0, 0, 32, 32);
        if (pattern === 'rocky') {
            g.fillStyle(0x000000, 0.15);
            g.fillRect(4, 8, 6, 4);
            g.fillRect(18, 14, 8, 5);
            g.fillRect(10, 22, 5, 4);
        } else if (pattern === 'wall') {
            g.lineStyle(1, 0x000000, 0.3);
            g.lineBetween(0, 10, 32, 10);
            g.lineBetween(0, 21, 32, 21);
            g.lineBetween(16, 0, 16, 10);
            g.lineBetween(8, 10, 8, 21);
            g.lineBetween(24, 10, 24, 21);
        }
        g.generateTexture(key, 32, 32);
        g.destroy();
    }

    // Coffre / Conteneur
    static createContainer(scene, key, w, h, color) {
        const g = scene.make.graphics({ add: false });
        g.fillStyle(color, 1);
        g.fillRect(2, 6, w-4, h-8);
        g.fillStyle(color * 0.8, 1);
        g.fillRect(2, 2, w-4, 6); // couvercle
        g.lineStyle(1, 0xFFD700, 0.8);
        g.strokeRect(2, 2, w-4, h-4);
        // Serrure
        g.fillStyle(0xFFD700, 1);
        g.fillRect(w/2-2, h/2-2, 4, 4);
        g.generateTexture(key, w, h);
        g.destroy();
    }

    // Appel centralisé — à utiliser dans PreloadScene.preload()
    static createAll(scene) {
        // Joueur
        PlaceholderFactory.createCharacter(scene, 'player', 24, 32, 0x6B4A2A, 0xC4956A);

        // Ennemis (respecte la palette)
        PlaceholderFactory.createCharacter(scene, 'enemy_bandit',    24, 28, 0xCC2200, 0xFF4422);
        PlaceholderFactory.createCharacter(scene, 'enemy_scorpion',  20, 20, 0xFF6600, 0xFFAA00);
        PlaceholderFactory.createCharacter(scene, 'enemy_raider',    26, 32, 0x880000, 0xCC2222);
        PlaceholderFactory.createCharacter(scene, 'enemy_boss',      36, 40, 0x2A1A1A, 0xFF0000);

        // PNJ Hub
        PlaceholderFactory.createCharacter(scene, 'npc_merchant',   24, 32, 0x4A7ACC, 0x88AAFF);
        PlaceholderFactory.createCharacter(scene, 'npc_smith',      24, 32, 0xCC7722, 0xFFAA44);
        PlaceholderFactory.createCharacter(scene, 'npc_guard',      24, 32, 0x7A7A7A, 0xAAAAAA);
        PlaceholderFactory.createCharacter(scene, 'npc_innkeeper',  24, 32, 0x7A3DAA, 0xAA66FF);

        // Tuiles (cohérentes avec les zones GDD)
        PlaceholderFactory.createTile(scene, 'tile_hub_sand',   0xC4A35A, 'plain');
        PlaceholderFactory.createTile(scene, 'tile_hub_path',   0xD4A96A, 'plain');
        PlaceholderFactory.createTile(scene, 'tile_plain_ash',  0x8B7355, 'rocky');
        PlaceholderFactory.createTile(scene, 'tile_gorge_rock', 0x5C4A2A, 'rocky');
        PlaceholderFactory.createTile(scene, 'tile_camp_dirt',  0x3D2B1A, 'plain');
        PlaceholderFactory.createTile(scene, 'tile_wall',       0x7A5C35, 'wall');
        PlaceholderFactory.createTile(scene, 'tile_water',      0x1A4A6B, 'plain');

        // Ressources
        PlaceholderFactory.createResource(scene, 'resource_stone', 24, 0x888888);
        PlaceholderFactory.createResource(scene, 'resource_wood',  24, 0x8B5A2B);
        PlaceholderFactory.createResource(scene, 'resource_metal', 24, 0xAAAAAA);
        PlaceholderFactory.createResource(scene, 'resource_food',  20, 0xFF4444);

        // Items pickup
        PlaceholderFactory.createItemPickup(scene, 'item_wood_sword',    20, 0xC8A060);
        PlaceholderFactory.createItemPickup(scene, 'item_metal_sword',   20, 0xDDDDDD);
        PlaceholderFactory.createItemPickup(scene, 'item_leather_armor', 20, 0x8B6914);
        PlaceholderFactory.createItemPickup(scene, 'item_potion',        16, 0xFF0088);
        PlaceholderFactory.createItemPickup(scene, 'item_gold_coin',     14, 0xFFD700);

        // Conteneurs
        PlaceholderFactory.createContainer(scene, 'chest_wood',  32, 24, 0x8B5A2B);
        PlaceholderFactory.createContainer(scene, 'chest_metal', 32, 24, 0xAAAAAA);
        PlaceholderFactory.createContainer(scene, 'crate',       28, 28, 0x7A5C35);
    }
}
```

---

## 5. UI & HUD — RÈGLES DE DESIGN

### 5.1 Barres de Status (HUD)

```javascript
// HUD.js — createStatusBars()
// Positionnement : coin supérieur gauche, 16px de marge

// ═══ BARRE DE VIE ═══
// Fond sombre (toujours visible)
// Remplissage rouge #CC2222, transition couleur si HP < 30% → #FF4444 + pulse
// Largeur : 160px fixe, hauteur : 12px
// Texte : "HP: 75 / 100" en Share Tech Mono 12px, couleur #E8D5B0

// Animation critique HP :
// Si hp_current / hp_max < 0.30 → this.scene.tweens.add pulsation alpha 0.7↔1.0, 800ms, yoyo:true

// ═══ BARRE D'ENDURANCE ═══
// Fond sombre #082228
// Remplissage bleu #2288CC, si endurance = 0 → flash orange #AA4400 (200ms)
// Largeur : 140px, hauteur : 8px
// PAS de texte numérique (visuel uniquement pour économiser l'espace)

// ═══ INDICATEUR D'ÉTAT DE BLESSURE ═══
// Apparaît uniquement si HP < 30% (blessures localisées actives)
// Icône rouge pulsante + texte "BLESSÉ" en rouge #FF4444
// Positionnement : en dessous des barres, taille 10px

const HUD_LAYOUT = {
    margin: 16,
    barHP: { x: 16, y: 16, w: 160, h: 12 },
    barStamina: { x: 16, y: 34, w: 140, h: 8 },
    goldDisplay: { x: 16, y: 50, w: 80, h: 14 },
    injuryAlert: { x: 16, y: 70, visible: false }
};
```

### 5.2 Notifications "Skill Up" — Style Skyrim

```javascript
// UIScene.js — createSkillNotification(skillName, newLevel)
// Inspiré directement du système de notification Skyrim

// LAYOUT :
// Apparaît centré en bas de l'écran (y: height - 100)
// Deux lignes :
//   Ligne 1 : "[Icône compétence]  Compétence améliorée : MÊLÉE"
//   Ligne 2 : "Niveau [X] atteint" (si milestone) OU rien
// Durée d'affichage : 4 secondes
// Animation entrée : tween y de +20px → 0, alpha 0 → 1 (400ms ease-out)
// Animation sortie : tween alpha 1 → 0 (600ms ease-in) après 3s

// COULEURS :
// Fond : rectangle noir semi-transparent #000000 alpha 70%, 280x50px
// Bord : ligne fine #8B6030 (1px)
// Ligne 1 : couleur #E8D5B0, font 'Cinzel' 14px
// Ligne 2 milestone : couleur #FFD700, font 'Cinzel' 16px, bold

// CAS MILESTONE (niveaux 25, 50, 75, 100) :
// Ajouter particules dorées autour de la notification (Phaser.GameObjects.Particles)
// Jouer SFX 'sfx_levelup' (plus grave/solennel que les autres SFX)

function showSkillNotification(scene, skillName, level) {
    const MILESTONE = [25, 50, 75, 100];
    const isMilestone = MILESTONE.includes(Math.floor(level));
    const x = scene.scale.width / 2;
    const y = scene.scale.height - 100;

    // Fond
    const bg = scene.add.rectangle(x, y, 300, isMilestone ? 60 : 50,
        0x000000, 0.70).setStrokeStyle(1, 0x8B6030);

    // Texte principal
    const line1 = scene.add.text(x, y - 10,
        `⚔ Compétence améliorée : ${skillName.toUpperCase()}`,
        { fontFamily: "'Cinzel', serif", fontSize: '13px', color: '#E8D5B0' }
    ).setOrigin(0.5);

    // Texte milestone
    let line2 = null;
    if (isMilestone) {
        line2 = scene.add.text(x, y + 12,
            `✦ Niveau ${Math.floor(level)} — Nouveau Seuil Atteint ✦`,
            { fontFamily: "'Cinzel', serif", fontSize: '14px', color: '#FFD700' }
        ).setOrigin(0.5);
    }

    // Tween entrée
    [bg, line1, line2].filter(Boolean).forEach(obj => {
        obj.setAlpha(0).setY(obj.y + 20);
        scene.tweens.add({
            targets: obj, alpha: 1, y: obj.y - 20,
            duration: 400, ease: 'Power2'
        });
    });

    // Auto-destroy après 4s
    scene.time.delayedCall(3400, () => {
        [bg, line1, line2].filter(Boolean).forEach(obj => {
            scene.tweens.add({
                targets: obj, alpha: 0,
                duration: 600, ease: 'Power2',
                onComplete: () => obj.destroy()
            });
        });
    });
}
```

### 5.3 Popups de Dégâts Flottants

```javascript
// CombatSystem.js — showDamagePopup(scene, x, y, amount, isCrit)
function showDamagePopup(scene, x, y, amount, isCrit = false) {
    const style = isCrit ? TEXT_STYLES.CRIT_POPUP : TEXT_STYLES.DAMAGE_POPUP;
    const label = isCrit ? `CRIT! -${amount}` : `-${amount}`;
    const text = scene.add.text(x, y - 16, label, style).setOrigin(0.5);

    // Tween : monte et disparaît
    scene.tweens.add({
        targets: text,
        y: y - 60,
        alpha: 0,
        duration: isCrit ? 1200 : 800,
        ease: 'Power2',
        onComplete: () => text.destroy()
    });

    // Effet de scale pour les crits
    if (isCrit) {
        scene.tweens.add({
            targets: text,
            scaleX: 1.4, scaleY: 1.4,
            yoyo: true, duration: 150
        });
    }
}
```

### 5.4 Indicateur d'Interaction

```javascript
// Affiché au-dessus des entités interactables (PNJ, coffres, ressources)
// Texte : "[ E ]" — font Share Tech Mono, 11px, couleur #FFFFFF alpha 60%
// Animation : pulse alpha entre 40% et 80%, cycle 1200ms, infini
// Positionnement : centré horizontalement, -20px au-dessus du sprite

function createInteractIndicator(scene, targetSprite) {
    const indicator = scene.add.text(
        targetSprite.x, targetSprite.y - 24,
        '[ E ]',
        { fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: '#FFFFFF' }
    ).setOrigin(0.5).setAlpha(0.6);

    scene.tweens.add({
        targets: indicator,
        alpha: 0.3,
        yoyo: true,
        duration: 600,
        repeat: -1
    });
    return indicator;
}
```

### 5.5 Minimap

```javascript
// HUD.js — Minimap en coin supérieur droit
// Dimensions : 110x110px, fond #0F0A06 alpha 80%, bord #3A2A1A
// Positionnement : x: width - 126, y: 16

// Rendu : RenderTexture Phaser 4 mise à jour toutes les 5 frames
// Échelle de la minimap : worldWidth/minimapWidth = 2560/110 ≈ 23.3x

// Éléments affichés :
// Zones découvertes : rect couleur de zone alpha 40% (fogOfWar démasqué)
// Zones inexplorées : noir opaque (fogOfWar = 0)
// Joueur : cercle vert #00FF88 rayon 3px (toujours visible)
// Ennemis dans rayon de vue : cercles rouges #FF2200 rayon 2px
// Points d'intérêt découverts : carrés jaunes #FFD700 2x2px (coffres, PNJ)
```

---

## 6. POST-PROCESSING WebGL — EFFETS ATMOSPHÉRIQUES

> **CONTRAINTE TOKEN BUDGET :** Ces effets sont implémentés à l'Étape 13 (polish).
> Toujours utiliser les pipelines natifs Phaser 4 pour éviter les shaders custom coûteux.

### 6.1 Vignette Ambiante (Pipeline Phaser natif)

```javascript
// GameScene.js — Implémentation vignette via Graphics overlay
// Méthode légère : pas de shader GLSL custom (économise les tokens)

createVignetteOverlay() {
    // Gradient radial du bord vers le centre
    // Phaser 4 ne supporte pas les gradients natifs → simuler avec
    // un cercle inversé (fond noir avec trou transparent au centre)
    const vignette = this.add.graphics();
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    // Plusieurs cercles concentriques de plus en plus transparents
    const steps = 6;
    for (let i = 0; i < steps; i++) {
        const ratio = i / steps;
        const radius = Math.max(cx, cy) * (1 - ratio * 0.5);
        const alpha = ratio * 0.5; // max 50% opacité en bord
        vignette.fillStyle(0x000000, alpha * 0.8);
        vignette.fillCircle(cx, cy, radius);
    }
    vignette.setScrollFactor(0).setDepth(100);
    this.vignetteOverlay = vignette;
}

// Renforcement de la vignette si HP critique
updateVignetteIntensity(hpRatio) {
    if (hpRatio < 0.30) {
        // Vignette rouge pulsante pour signaler l'état critique
        const pulse = Math.sin(Date.now() / 400) * 0.15 + 0.25;
        this.vignetteOverlay.setAlpha(pulse);
        this.vignetteOverlay.setTint(0xFF0000);
    } else {
        this.vignetteOverlay.setAlpha(1).clearTint();
    }
}
```

### 6.2 Teinte Atmosphérique Jour/Nuit

```javascript
// GameScene.js — Cycle jour/nuit via Camera tint
// Méthode native Phaser 4 — 0 coût GPU supplémentaire

const DAYNIGHT_TINTS = {
    dawn:  { color: 0xFF8C42, alpha: 0.25 },
    day:   { color: 0xFFFFFF, alpha: 0.00 }, // Aucune teinte
    dusk:  { color: 0xFF6B35, alpha: 0.35 },
    night: { color: 0x0A1628, alpha: 0.55 }
};

updateDayNightCycle(timeRatio) {
    // timeRatio : 0.0 (aube) → 1.0 (minuit)
    let tint;
    if      (timeRatio < 0.15) tint = DAYNIGHT_TINTS.dawn;
    else if (timeRatio < 0.45) tint = DAYNIGHT_TINTS.day;
    else if (timeRatio < 0.60) tint = DAYNIGHT_TINTS.dusk;
    else                       tint = DAYNIGHT_TINTS.night;

    // Appliquer via un overlay rectangle simple (plus compatible que camera.setTint)
    this.dayNightOverlay.setFillStyle(tint.color, tint.alpha);
}
```

### 6.3 Effets de Particules (Phaser 4 Particles natif)

```javascript
// GameScene.js — Système de particules configuré une fois, réutilisé

setupParticleSystems() {
    // Impact combat — poussière et éclats
    this.dustParticles = this.add.particles(0, 0, 'particle_dust', {
        speed: { min: 20, max: 80 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.6, end: 0 },
        alpha: { start: 0.6, end: 0 },
        lifespan: { min: 200, max: 400 },
        tint: [0xC4A35A, 0x8B7355, 0x5C4A2A],
        quantity: 6,
        emitting: false   // Manuel — emit() lors d'un impact
    });

    // Collecte item — lueur dorée
    this.pickupParticles = this.add.particles(0, 0, 'particle_glow', {
        speed: { min: 10, max: 40 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.4, end: 0 },
        alpha: { start: 0.8, end: 0 },
        lifespan: 600,
        tint: [0xFFD700, 0xFFAA00],
        quantity: 8,
        emitting: false
    });

    // Mort d'ennemi — particules de sang
    this.bloodParticles = this.add.particles(0, 0, 'particle_blood', {
        speed: { min: 30, max: 100 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.5, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: { min: 300, max: 600 },
        tint: [0x8B0000, 0xAA1111],
        quantity: 10,
        emitting: false
    });
}

// Placeholder si assets particules absents :
// Remplacer 'particle_dust' par un Graphics carré 4x4 généré dynamiquement
```

### 6.4 Screen Shake

```javascript
// CombatSystem.js — Déclenché à chaque coup reçu par le joueur
function triggerScreenShake(scene, intensity = 0.004, duration = 200) {
    scene.cameras.main.shake(duration, intensity);
}

// Intensités recommandées :
// Coup léger reçu    : intensity 0.003, duration 150ms
// Coup lourd reçu    : intensity 0.006, duration 250ms
// Mort d'ennemi      : intensity 0.002, duration 100ms
// Coup critique infligé : intensity 0.005, duration 180ms
// Explosion/Boss     : intensity 0.010, duration 400ms
```

---

## 7. RÈGLES VISUELLES GÉNÉRALES


PIXEL ART
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ pixelArt: true dans la config Phaser 4
✅ roundPixels: true pour éviter le flou sous-pixel
✅ Tous les sprites sur grille de 8px (dimensions multiples de 8)
✅ Anti-aliasing DÉSACTIVÉ pour les sprites et tilemaps
❌ Pas de filtrage bilinéaire sur les textures pixel art

COHÉRENCE ATMOSPHÉRIQUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Toujours utiliser la palette §2 pour les placeholders
✅ Jamais de couleur vive saturée hors feedback de combat
✅ Les ennemis ont TOUJOURS une teinte de rouge dans leur palette
✅ Les PNJ alliés ont des teintes bleues ou chaudes (jamais rouge)
✅ Les zones de danger (Gorges, Campement) sont PLUS SOMBRES que le Hub

LISIBILITÉ DU JEU (priorité absolue sur l'esthétique)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Le joueur doit être INSTANTANÉMENT reconnaissable (couleur unique dans la scène)
✅ Les ennemis hostiles doivent avoir une coloration rouge visible à 200px
✅ Les items au sol ont une aura lumineuse (même en placeholder)
✅ Les barres HP ont un contraste suffisant sur n'importe quel fond
✅ Texte UI toujours sur fond semi-transparent (jamais texte nu sur tilemap)