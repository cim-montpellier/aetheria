// AudioManager.js — Sands of Aetheria
// Rôle : Wrapper Howler.js — musique (crossfade), SFX (anti-duplication), mute/volume.
// Étape de création : 11
// Dépendances : Howler (global CDN). Garde si Howler absent (placeholder silence, ASSETS_PLAN §1.2).

export class AudioManager {
  constructor() {
    this.available = typeof Howl !== 'undefined';
    this.muted = false;
    this.volume = 0.7;
    this.currentMusicKey = null;
    this.music = {};
    this.sounds = {};
    this._sfxCooldown = {};
  }

  /** Musique d'ambiance en crossfade (1s). No-op si même piste. */
  playMusic(key, url) {
    if (this.currentMusicKey === key) return;
    if (this.available && this.music[this.currentMusicKey]) this.music[this.currentMusicKey].fade(this.volume, 0, 1000);
    this.currentMusicKey = key;
    if (this.available) {
      if (!this.music[key]) this.music[key] = new Howl({ src: [url], loop: true, volume: this.volume });
      this.music[key].fade(0, this.volume, 1000);
      this.music[key].play();
    }
  }

  /** SFX ; anti-duplication via `minInterval` ms (évite le spam sonore). Retourne true si joué. */
  playSFX(key, url, now = (typeof performance !== 'undefined' ? performance.now() : Date.now()), minInterval = 60) {
    if (!this.available || this.muted) return false;
    if (this._sfxCooldown[key] != null && now - this._sfxCooldown[key] < minInterval) return false;
    this._sfxCooldown[key] = now;
    if (!this.sounds[key]) this.sounds[key] = new Howl({ src: [url], volume: this.volume });
    this.sounds[key].play();
    return true;
  }

  setMuted(m) { this.muted = m; if (this.available && typeof Howler !== 'undefined') Howler.mute(m); }
  toggleMute() { this.setMuted(!this.muted); return this.muted; }
}
