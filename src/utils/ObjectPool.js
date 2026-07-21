// ObjectPool.js — Sands of Aetheria
// Rôle : Pool générique réutilisable (projectiles, particules) — anti-GC
// Étape de création : 2
// Dépendances : aucune (logique pure)
// Pattern : acquire()/release() — max 50 instances par pool (TOKEN_BUDGET §4.1).

export class ObjectPool {
  /**
   * @param {Function} factory  () => T          crée un objet neuf
   * @param {Function} reset    (obj, ...args)   réinitialise un objet réutilisé
   * @param {number}   maxSize  capacité max du pool (défaut 50)
   */
  constructor(factory, reset, maxSize = 50) {
    this.factory = factory;
    this.reset = reset;
    this.maxSize = maxSize;
    this.pool = [];            // objets disponibles
    this.active = new Set();   // objets en cours d'usage
  }

  /** Pré-remplit le pool avec n objets (idéalement au boot, hors frame). */
  prewarm(n) {
    for (let i = 0; i < n && this.pool.length < this.maxSize; i++) this.pool.push(this.factory());
    return this;
  }

  /** Récupère un objet (le recycle ou le crée). Retourne null si saturé. */
  acquire(...args) {
    let obj = this.pool.pop();
    if (!obj) obj = this.size < this.maxSize ? this.factory() : null;
    if (!obj) return null;
    this.reset(obj, ...args);
    this.active.add(obj);
    return obj;
  }

  /** Rend un objet au pool (supprimé de l'ensemble actif). */
  release(obj) {
    if (!this.active.delete(obj)) return;
    if (this.pool.length < this.maxSize) this.pool.push(obj);
  }

  /** Rend tous les objets actifs au pool. */
  releaseAll() { for (const o of [...this.active]) this.release(o); }
  get size() { return this.pool.length + this.active.size; }
  get activeCount() { return this.active.size; }
  get availableCount() { return this.pool.length; }
}
