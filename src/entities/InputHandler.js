// InputHandler.js — Sands of Aetheria
// Rôle : Lecture des contrôles (ZQSD + WASD + flèches, Shift/Espace/E) → état normalisé
// Étape de création : 4 (extrait de Player — TOKEN_BUDGET §2.2, garde Player lean)
// Dépendances : Phaser (global, clavier)

export class InputHandler {
  constructor(scene) {
    const kb = scene.input.keyboard;
    this.cursors = kb.createCursorKeys();          // up/down/left/right/space/shift
    this.keys = kb.addKeys('W,A,S,D,Z,Q,E,J,K,L');       // WASD + ZQSD + E + attaque J/K + parade L
    this.touch = { x: 0, y: 0, active: false };    // joystick virtuel (overlay HTML — polish)
  }

  // PUR : vecteur de mouvement depuis l'état brut des touches (3 schémas cumulés).
  static computeMove(k) {
    const up = k.W || k.Z || k.ArrowUp;
    const down = k.S || k.ArrowDown;
    const left = k.A || k.Q || k.ArrowLeft;
    const right = k.D || k.ArrowRight;
    let x = (right ? 1 : 0) - (left ? 1 : 0);
    let y = (down ? 1 : 0) - (up ? 1 : 0);
    if (x !== 0 && y !== 0) { x *= Math.SQRT1_2; y *= Math.SQRT1_2; }  // diagonale normalisée
    return { x, y };
  }

  /** État d'entrée courant : { moveX, moveY, running, dodge, interact }. */
  read() {
    const c = this.cursors, k = this.keys;
    const raw = {
      W: k.W.isDown, Z: k.Z.isDown, ArrowUp: c.up.isDown,
      S: k.S.isDown, ArrowDown: c.down.isDown,
      A: k.A.isDown, Q: k.Q.isDown, ArrowLeft: c.left.isDown,
      D: k.D.isDown, ArrowRight: c.right.isDown,
    };
    const { x, y } = InputHandler.computeMove(raw);
    return {
      moveX: x + (this.touch.active ? this.touch.x : 0),
      moveY: y + (this.touch.active ? this.touch.y : 0),
      running: c.shift.isDown,
      dodge: Phaser.Input.Keyboard.JustDown(c.space),
      interact: Phaser.Input.Keyboard.JustDown(k.E),
      lightAttack: Phaser.Input.Keyboard.JustDown(k.J),
      heavyAttack: k.K.isDown,
      parry: k.L.isDown,
    };
  }
}
