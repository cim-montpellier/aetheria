# MEMORY_ARCHIVE.md — Archive (bugs résolus + notes supersédées)
# Sands of Aetheria — créé à l'étape 6 (compression MEMORY_STATE, protocole §7)

## 🐛 Bugs résolus archivés
- Étape 4 : harness « mkSprite is not defined » → fabriques mkBody/mkSprite non
  insérées dans tests/_mocks.js (édition floue) → ré-insérées avec ancrage unique.
- Étape 7 : InventoryUI « setStrokeStyle is not a function » → mock mkSprite incomplet
  (createMockScene) → méthodes chaînables (setStrokeStyle/setScrollFactor/setSize/...) ajoutées.

## 📝 Notes détaillées par étape (compression étape 9)
- Étape 2 : PlaceholderFactory externalisé (src/utils, TOKEN §2.2). Menu → scene.start(GAME) ;
  GameScene lance UIScene via scene.launch (HUD parallèle, TECH_SPEC §4.2).
- Étape 3 : world.json en tableaux JSON bruts ; tileset PNG (fallback WebP ASSETS_PLAN §2).
  Palissade camp + entrée nord x68-71.
- Étapes 4-5 : helpers PURS testables : computeMove (3 schémas), effectiveSpeed (jambe HP<30% → −30%),
  staminaStep (régén ≥1s). StateMachine pure (AIManager, TECH_SPEC §5.1).
- Étape 6 : Player = actions (swing, hitbox 200ms). Dégâts ennemi→joueur via EventBus 'combat:enemy_attack' ;
  boss = tir poolé (Projectile + ObjectPool). resolveParry −60% / contre si <200ms.
- Étape 7 : Inventaire PUR possédé par le Player ; drop = auto-loot (boss → Épée d'Acier). Mort → −50% items + or.
- Étape 8 : Player possède skills + hooks minimaux (register) → 186L, extraction ÉVITÉE (logique dans SkillSystem).
  Notification skill-up Skyrim (UIScene, 4s).

## ⚖️ Arbitrages documentés
- Contrôles : Shift = course (étape 4, BLUEPRINT) → Parade remappée sur L (GDD §4.2 voulait Shift=parade ;
  conflit résolu en gardant Shift=course). Souris = polish étape 13.
- Formule skills : GDD (autorité MAXIMAL) fait foi — gain = 0.15×(1−level/150). Le seuil « gain<0.01 à nv85 »
  du prompt est incohérent avec sa propre formule (donne ~0.065 à nv85) ; la décroissance est réelle et testée.
- Ranges IA : valeurs TECH_SPEC §5.2 (150/45/220/0.20) retenues (= tests XML), GDD §4.4 approx → harmonisé.

## 📝 Notes détaillées étapes 13-14 (compression étape 14)
- Étape 13 : ⚠️ Player 201L + GameScene 208L (>80%=200) → extraction obligatoire avant animations/particules.
  ✅ 2 EXTRACTIONS faites — PlayerCombat.js (mixin 85L) + CombatManager.js (71L) → Player 126L, GameScene 161L
  (non-régression 135 assertions OK ; tests ét.6/7 mis à jour : s.combat.playerHitsEnemy/onEnemyAttack/onEnemyDead).
  Polish : ParticleManager (bursts sur enemy:hit/dead + item:picked), animations (PreloadScene anims idle/walk/
  run/attack + ennemis _idle, Player.animForState pur, Enemy play), vignette HUD HP<30%, screen shake
  (PlayerCombat.takeDamage). Assets CC0 réels = drop manuel dans assets/sprites/ (placeholders fonctionnels, ASSETS_PLAN §1).
- Étape 14 🧪 : 4 bancs unitaires systèmes purs (test_combat 12, test_skills 8, test_save 7, test_ai 6 = 33
  assertions). AUCUN bug révélé → systèmes robustes, aucune correction nécessaire. Save < 50KB validé (perf headless).
  Suite complète : 18 fichiers · 174 assertions · tout vert. FPS/mémoire/FMP = checks navigateur (manuel).

## 📝 Notes détaillées étapes 9-12 (compression étape 12)
- Étape 9 : CraftingSystem PUR (canCraft/craft + buyPrice/sellPrice ± skill Commerce). Transactions dans le
  NPC (buyFrom/sellTo, il possède le stock). Ressources = nœuds monde minables (E, 1-3, respawn 5min, skill
  Minage). Boutique découplée via EventBus. Interact marchand → TRADE (test étape 5 : INTERACT testé sur le Garde).
- Étape 10 : FactionSystem PUR (rép 0-100, seuil hostile <25, crime −30). HUD (barres HP/stam, mini-carte
  fog-of-war par zone, notifications 3s) via 'player:stats' (inclut x/y). Crime PNJ → faction hostile →
  gardes HOSTILE (poursuite), civils ALARMED (fuite).
- Étape 11 : ✅ EXTRACTION WorldManager.js FAITE (GameScene 207→132L). DayNight PUR (4 phases, teintes
  §6.2, IA nocturne detectMultiplier 0.7). AudioManager (Howler crossfade Hub/Wild, SFX throttle 60ms, mute).
- Étape 12 : SaveSystem PUR (save/load/delete, Sets sérialisés, clé aetheria_save_v1). Player.serialize/
  loadState. WorldManager skip ennemis tués (worldState.killedEnemies). GameScene : worldState, init/restoreSave,
  auto-save 60s + save retour Hub, pause (gamePaused). MenuScene Load Game + date. HUD menu pause Échap.

## 📝 Notes supersédées / résolues
- Étape 1 : PreloadScene.js créé en stub vide pour valider la transition Boot→Preload.
  ✅ Résolu étape 2 (réécrit en vrai preloader + PlaceholderFactory.createAll).
- Question « jouable étape 6 vs 7 » : TRANCHÉ — l'étape 6 porte le jalon 🎮 Premier
  Jouable (marqueur 🎮 BLUEPRINT + XML). Étape 7 (inventaire) enrichit le game loop.
