// AIManager.js — Sands of Aetheria
// Rôle : StateMachine universelle pour l'IA (PNJ/ennemis) — pattern FSM (TECH_SPEC §5.1)
// Étape de création : 5
// Dépendances : aucune (logique pure, testable headless)

export class StateMachine {
  constructor(entity) {
    this.entity = entity;
    this.states = {};
    this.currentState = null;
    this.previousState = null;
    this.stateTime = 0;          // ms passées dans l'état courant
  }

  addState(name, { onEnter, onUpdate, onExit }) {
    this.states[name] = { onEnter, onUpdate, onExit };
  }

  transition(newState) {
    if (newState === this.currentState || !this.states[newState]) return;  // no-op
    this.states[this.currentState]?.onExit?.(this.entity);
    this.previousState = this.currentState;
    this.currentState = newState;
    this.stateTime = 0;
    this.states[newState]?.onEnter?.(this.entity);
  }

  update(delta) {
    this.stateTime += delta;
    this.states[this.currentState]?.onUpdate?.(this.entity, delta, this);
  }
}
