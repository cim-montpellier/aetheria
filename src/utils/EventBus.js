// EventBus.js — Sands of Aetheria
// Rôle : Bus d'événements global (singleton) — découplage inter-scènes/systèmes
// Étape de création : 1
// Dépendances : Phaser.Events.EventEmitter (global CDN, instancié en lazy)
// Pattern : Observer. JAMAIS d'accès direct scène→scène ; toujours via EventBus.
// Note : instanciation paresseuse → module importable headless (tests node sans
//        Phaser) et aucun souci d'ordre d'initialisation au boot.

export const EventBus = {
  _emitter: null,

  _get() {
    if (!this._emitter) this._emitter = new Phaser.Events.EventEmitter();
    return this._emitter;
  },

  emit(event, data) { this._get().emit(event, data); },
  on(event, fn, ctx) { this._get().on(event, fn, ctx); return this; },
  once(event, fn, ctx) { this._get().once(event, fn, ctx); return this; },
  off(event, fn, ctx) { this._get().off(event, fn, ctx); return this; },

  // Réinitialise le bus (entre deux parties / pour les tests)
  reset() { this._emitter?.removeAllListeners(); this._emitter = null; },
};
