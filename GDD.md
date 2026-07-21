# GDD.md — Game Design Document
# Sands of Aetheria (MVP)
**Version :** 1.0 | **Format :** HTML5/WebGL 2D Top-Down | **Cible :** MVP jouable en 15 étapes Agent IA

---

## 1. PITCH & VISION

### Phrase de Vision
> *"Un monde de sable indifférent à votre existence. Devenez quelqu'un — ou mourez anonymement."*

### Concept Core
**Sands of Aetheria** est un RPG sandbox 2D top-down qui fusionne deux philosophies de design :
- **L'âme de Skyrim** : La liberté totale d'exploration, un monde cohérent avec ses factions et ses secrets, et une progression organique où chaque action renforce la compétence associée.
- **L'impitoyabilité de Kenshi** : Le joueur commence en "Vagabond" — sans quête principale, sans héros prédestiné. Le monde n'attend pas. Les ennemis peuvent être plus forts. La mort est punitive. L'émergence narrative remplace la narration scriptée.

### Différenciateur Clé (MVP)
Là où la plupart des RPG 2D donnent un but au joueur, **Aetheria le lui retire** pour mieux lui rendre. La progression est entièrement systémique : courir rend plus rapide, se battre rend plus fort, miner donne plus de ressources. Aucun niveau d'expérience global — uniquement des compétences vivantes.

---

## 2. BOUCLE DE GAMEPLAY PRINCIPALE (CORE LOOP)


┌─────────────────────────────────────────────────────────────────┐
│                     BOUCLE MACRO (Session)                      │
│  Explorer → Rencontrer → Survivre → Progresser → Explorer plus  │
└─────────────────────────────────────────────────────────────────┘
         │                │               │               │
         ▼                ▼               ▼               ▼
   Découvrir         Combattre       Récolter/        Améliorer
   une Zone          ou Fuir         Crafter          ses Stats
   (Chunks)          (Temps réel)    (Économie)       (Learn-by-doing)


### Boucle Micro (Combat)

Détection Ennemi → Positionnement (Endurance) → Attaque/Esquive/Parade
       → Feedback (Dégâts/Sang/Son) → Résolution → Butin


### Boucle Micro (Survie/Économie)

Collecter Ressources (Pierre/Bois/Métal) → Crafter Équipement
       → Vendre au Marchand Hub → Acheter Consommables
       → Retourner en Zone Sauvage


---

## 3. MÉCANIQUES D'EXPLORATION

### 3.1 Structure du Monde (MVP)
Le monde est une **grande tilemap unique** (80x80 tuiles de 32px = 2560x2560px) divisée logiquement en zones :

| Zone | Taille | Difficulté | Contenu |
|------|--------|------------|---------|
| **Hub : Oasis de Kaleth** | 20x20 tuiles | Sûre | Marchand, Forgeron, Auberge, Quai de départ |
| **Plaine des Cendres** | 30x30 tuiles | Faible-Moyenne | Ressources communes, Ennemis légers, Ruines |
| **Gorges de Sael** | 20x20 tuiles | Moyenne-Haute | Ressources rares, Ennemis forts |
| **Campement des Pillards** | 10x10 tuiles | Haute | Boss mineur, Coffres, Quête émergente |

### 3.2 Navigation
- **Mouvement** : ZSQD ou WASD (8 directions). Vitesse de marche : 120px/s. Vitesse de course : 200px/s (consomme Endurance).
- **Interaction** : Touche `E` ou clic sur objet/PNJ dans un rayon de 48px.
- **Mini-carte** : Coin supérieur droit, découverte progressive (fog of war simple).
- **Transitions de zones** : Fondus enchaînés lors du passage de zones (aucun chargement — même tilemap).

### 3.3 Objets d'Environnement Interactifs
- **Ressources** : Rochers (pierre), Arbres-cactus (bois), Filons (métal) — respawn toutes les 5 min réelles.
- **Conteneurs** : Caisses et coffres (loot aléatoire depuis une table de butin).
- **Portes** : Maisons du Hub, entrée du Campement ennemi (verrouillée si faction hostile).

---

## 4. MÉCANIQUES DE COMBAT

### 4.1 Principes
- **Temps réel**, vue top-down, pas de tour par tour.
- **Hitboxes rectangulaires** simplifiées (Arcade Physics Phaser 4).
- **Ressource d'Action** : L'Endurance gère à la fois la course et les attaques spéciales.

### 4.2 Actions du Joueur
| Action | Input | Effet | Coût Endurance |
|--------|-------|-------|----------------|
| Attaque légère | Clic Gauche / `J` | Dégâts faibles, rapide (0.4s cooldown) | 5 |
| Attaque lourde | Clic Droit maintenu / `K` | Dégâts forts, lent (1.2s charge) | 20 |
| Esquive roulade | `Espace` + direction | Invincibilité 0.3s, déplacement 80px | 25 |
| Parade | `Shift` maintenu | Réduit dégâts de 60%, contre-attaque si timing parfait | 10/s |

### 4.3 Système de Dégâts & Blessures
- **Points de Vie** : Pool global (ex : 100 HP de base).
- **Blessures Localisées (simplifié Kenshi)** :
  - Si HP < 30% → Malus de vitesse -30% (jambe blessée).
  - Si HP < 15% → Malus d'attaque -50% (bras blessé), état "Chancelant" visible.
- **Mort** : Écran Game Over → Respawn au Hub avec 50% des ressources perdues (pénalité Kenshi légère).

### 4.4 IA Ennemie (State Machine à 4 États)

IDLE → [Détection joueur dans 150px] → PATROL
PATROL → [Joueur dans 80px] → CHASE
CHASE → [Joueur dans portée attaque 40px] → ATTACK
ATTACK → [Joueur fuit > 200px] → PATROL
ATTACK/CHASE → [HP ennemi < 20%] → FLEE (retour à IDLE après 5s)


---

## 5. MÉCANIQUES DE SURVIE & ÉCONOMIE

### 5.1 Ressources Primaires
| Ressource | Source | Usage |
|-----------|--------|-------|
| Pierre | Rochers (Plaine) | Crafting outils basiques |
| Bois-Sec | Arbres-cactus (Plaine) | Crafting armes légères, feu de camp |
| Métal Brut | Filons (Gorges) | Crafting armes/armures avancées |
| Nourriture | Ennemis, Marchands | Régénération HP hors combat |
| Or | Vente, Coffres | Monnaie pour marchands |

### 5.2 Crafting (Workbench)
Deux stations dans le Hub :
- **Forge** (Forgeron) : Armes + Armures (nécessite Métal + Compétence Forge ≥ 10).
- **Atelier** (perso + banc de travail trouvable) : Outils + Consommables.

Recettes MVP :

Épée de Bois    = 3 Bois-Sec + Compétence Forge 0
Armure de Cuir  = 5 Bois-Sec + 2 Pierre
Épée de Métal   = 4 Métal + Compétence Forge 15
Potion de Soin  = 2 Nourriture + 1 Pierre (broyée)


---

## 6. SYSTÈME DE PROGRESSION — "LEARN BY DOING"

### 6.1 Compétences (7 compétences MVP)
Chaque compétence a un niveau de 0 à 100. Pas de niveau global. Pas d'XP.

| Compétence | Se progresse par... | Bonus par niveau |
|-----------|---------------------|-----------------|
| **Mêlée** | Frapper des ennemis | +0.5% dégâts attaque légère/lourde |
| **Athlétisme** | Courir, esquiver | +0.3% vitesse, -0.2% coût endurance esquive |
| **Endurance** | Subir des dégâts, pararades | +1 HP max, +0.5 régén endurance |
| **Furtivité** | Se déplacer accroupi près d'ennemis | Rayon détection ennemi -0.5% |
| **Forge** | Utiliser la forge | Débloque recettes avancées à seuils (15, 30, 50) |
| **Minage** | Miner des filons | +0.5% ressources par frappe |
| **Commerce** | Acheter/Vendre | -0.3% prix achat, +0.3% prix vente |

### 6.2 Formule de Progression
```javascript
// Gain de compétence par action
const BASE_GAIN = 0.15; // par action éligible
const DIMINISHING = 1 - (skill.level / 150); // ralentit vers 100
skill.level += BASE_GAIN * DIMINISHING;
```

### 6.3 Caps et Seuils Notables
- **Niveau 25** : Débloque animation spéciale (feedback visuel uniquement).
- **Niveau 50** : Débloque une capacité passive (ex: Mêlée 50 → Chance de coup critique 10%).
- **Niveau 75** : Débloque titre/surnom visible dans l'UI.
- **Niveau 100** : Maîtrise — feedback visuel distinctif, bonus maximal.

---

## 7. FACTIONS & PNJ (MVP)

### 7.1 Factions
| Faction | Base | Disposition initiale | Condition d'hostilité |
|---------|------|---------------------|----------------------|
| **Marchands d'Oasis** | Hub | Neutre/Amical | Voler ou attaquer dans le Hub |
| **Pillards de Sael** | Campement | Hostile | Toujours (sauf Furtivité 50+) |
| **Nomades** | Plaine | Neutre | Attaquer l'un d'eux |

### 7.2 Comportements PNJ (Hub)
- **Routines journalières** : Cycle jour/nuit simplifié (5 min réelles = 1 jour Aetheria). PNJ se déplacent entre points waypoints.
- **Réactivité** : Si le joueur attaque dans le Hub → Gardes deviennent hostiles → Hub verrouillé 2 min réelles.
- **Commerce** : Interface de troc simple (inventaire joueur ↔ stock marchand, prix basés sur Or).

---

## 8. DESIGN DE L'ENVIRONNEMENT

### 8.1 Hub : Oasis de Kaleth

┌────────────────────────────────────┐
│  [Puits Central]  [Marché]         │
│  [Forgeron]       [Auberge]        │
│  [Garde x2]       [Sortie Nord]    │
│  [Portail Est→Gorges]              │
│  [Sortie Sud→Plaine des Cendres]   │
└────────────────────────────────────┘

- Spawn du joueur : Près du Puits Central.
- PNJ permanents : 1 Marchand général, 1 Forgeron, 2 Gardes, 1 Aubergiste (soin payant).
- Ambiance : Sable, palmiers-cactus, architecture pierre ocre.

### 8.2 Plaine des Cendres
- Ennemis : Bandits légers (Mêlée 10-20), Scorpions géants (rapides, faibles).
- Ressources : Rochers (Pierre), Arbres-cactus (Bois), quelques Caisses abandonnées.
- Points d'intérêt : 2 Ruines (coffres avec loot moyen), 1 Campement nomade (troc possible).

### 8.3 Gorges de Sael
- Ennemis : Pillards armés (Mêlée 30-45), Gardes de caravane corrompus.
- Ressources : Filons de Métal Brut, Cristaux rares (vente haute valeur).
- Points d'intérêt : Chemin vers le Campement des Pillards.

### 8.4 Campement des Pillards (Objectif Facultatif)
- Structure : Palissade, 4 Pillards + 1 Chef (mini-boss, Mêlée 60).
- Récompense : Coffre principal (meilleure arme du MVP), libération d'un PNJ captif (déblocage quête commerce).
- Narration émergente : PNJ sauvé devient marchand au Hub, élargissant le stock.

---

## 9. SYSTÈME DE SAUVEGARDE

- **Auto-save** : Toutes les 60 secondes réelles + à chaque retour au Hub.
- **Données sauvegardées** : Position joueur, HP/Endurance, inventaire, niveaux de compétences, état du monde (ennemis morts, coffres ouverts, fog of war), réputation factions.
- **Stockage** : `localStorage` sous la clé `aetheria_save_v1`.
- **New Game / Load Game** : Depuis le menu principal.
