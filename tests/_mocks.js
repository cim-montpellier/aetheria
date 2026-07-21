// tests/_mocks.js — Sands of Aetheria
// Rôle : Mocks Phaser + window/document + harness de scène pour tests headless
//        (node, sans navigateur). Réutilisé étapes 2-14. Sanctionné TDD ("mocks Phaser").
// ⚠️ Infra de test UNIQUEMENT — jamais chargée par le jeu (navigateur).

class MockEventEmitter {
  #m = new Map();
  on(e, f, c) { if (!this.#m.has(e)) this.#m.set(e, []); this.#m.get(e).push({ f, c }); return this; }
  once(e, f, c) { const w = (d) => { this.off(e, w); f.call(c, d); }; this.on(e, w, c); return this; }
  off(e, f) { this.#m.set(e, (this.#m.get(e) || []).filter(x => x.f !== f)); return this; }
  emit(e, d) { (this.#m.get(e) || []).slice().forEach(({ f, c }) => f.call(c, d)); return this; }
  removeAllListeners() { this.#m.clear(); return this; }
}

class MockScene { constructor(config) { this._sceneConfig = config || {}; this.key = this._sceneConfig.key; } }

class MockGame { constructor(config) { this.config = config; MockGame.instances.push(this); } }
MockGame.instances = [];

export function installMocks() {
  MockGame.instances.length = 0;
  globalThis.Phaser = {
    WEBGL: 2, CANVAS: 1, AUTO: 0, HEADLESS: 4,
    Scale: { FIT: 'FIT', ENVELOP: 'ENVELOP', NONE: 'NONE', CENTER_BOTH: 'CENTER_BOTH' },
    Scene: MockScene, Game: MockGame,
    Events: { EventEmitter: MockEventEmitter, EventDispatcher: MockEventEmitter },
    Math: {
      Distance: { Between: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1) },
      Clamp: (v, a, b) => Math.min(b, Math.max(a, v)),
      Linear: (a, b, t) => a + (b - a) * t,
      Between: (a, b) => Math.floor(a + Math.random() * (b - a + 1)),
    },
    Input: { Keyboard: { KeyCodes: { E: 69, I: 73, J: 74, K: 75, SPACE: 32, SHIFT: 16, ESC: 27 }, JustDown: (k) => !!k?._justDown } },
  };
  const listeners = {};
  globalThis.window = {
    addEventListener: (ev, cb) => { (listeners[ev] ||= []).push(cb); },
    dispatch: (ev) => (listeners[ev] || []).forEach(cb => cb()),
  };
  globalThis.document = { createElement: () => ({}), body: {} };
  return { MockGame, window: globalThis.window };
}

// ── Mock Graphics (pour PlaceholderFactory) ────────────────────
export class MockGraphics {
  constructor(registry) { this.registry = registry; }
  fillStyle() { return this; } lineStyle() { return this; } clear() { return this; }
  fillRect() { return this; } strokeRect() { return this; }
  fillCircle() { return this; } strokeCircle() { return this; }
  fillTriangle() { return this; } lineBetween() { return this; }
  setScrollFactor() { return this; } setDepth() { return this; } setAlpha() { return this; } setVisible() { return this; }
  generateTexture(key, w, h) { this.registry[key] = { w, h }; return this; }
  destroy() {}
}

// ── Fabriques d'entités partagées (sprites + corps physique) ───
function mkBody(rec) {
  return {
    velocity: { x: 0, y: 0 }, enable: true, allowGravity: false, _cw: null,
    setSize() { return this; }, setOffset() { return this; }, setMaxVelocity() { return this; }, setImmovable() { return this; },
    setCollideWorldBounds(v) { this._cw = v; rec.collideWorld = v; return this; },
    setVelocity(x, y) { this.velocity.x = x; this.velocity.y = y; rec.lastVelocity = [x, y]; return this; },
  };
}
function mkSprite(x, y, key, rec) {
  const body = mkBody(rec);
  const spr = {
    x, y, key, body, _handlers: {},
    setOrigin() { return spr; }, setPosition(nx, ny) { spr.x = nx; spr.y = ny; return spr; },
    setDepth() { return spr; }, setTint() { return spr; }, clearTint() { return spr; },
    setAlpha(a) { spr.alpha = a; return spr; }, setFlipX() { return spr; }, setScale() { return spr; },
    setVisible() { return spr; }, setInteractive() { return spr; },
    setStrokeStyle() { return spr; }, setScrollFactor() { return spr; }, setSize(w, h) { spr.width = w; if (h !== undefined) spr.height = h; return spr; },
    setFillStyle(color, alpha) { spr.fillColor = color; spr.fillAlpha = alpha; return spr; },
    setText(t) { spr.text = t; return spr; }, setStyle() { return spr; },
    anims: { play() { return spr; }, stop() { return spr; }, isPlaying: false },
    on(ev, cb) { spr._handlers[ev] = cb; return spr; }, emit(ev, ...a) { spr._handlers[ev]?.(...a); return spr; },
    play(key) { spr._playedAnim = key; return spr; },
    destroy() { spr.destroyed = true; },
  };
  return spr;
}

// ── Harness : instancie une scène et outille tous les `this.*` ──
export function createSceneHarness(SceneClass, opts = {}) {
  const scene = new SceneClass();
  const calls = { start: [], launch: [], stop: [] };
  const textures = {};
  const delayed = [];
  const rec = { worldBounds: null, camBounds: null, camCenter: null, tilemapKey: null, map: null };
  const mkGo = (type, extra = {}) => {
    const handlers = {};
    const obj = {
      type, ...extra, _handlers: handlers,
      setOrigin() { return obj; }, setScrollFactor() { return obj; }, setDepth() { return obj; },
      setAlpha(a) { obj.alpha = a; return obj; }, setVisible() { return obj; }, setStrokeStyle() { return obj; },
      setFillStyle(color, alpha) { obj.fillColor = color; obj.fillAlpha = alpha; return obj; },
      setStyle() { return obj; }, setText(t) { obj.text = t; return obj; }, setPosition() { return obj; },
      setTint() { return obj; }, clearTint() { return obj; }, setSize(w, h) { obj.width = w; if (h !== undefined) obj.height = h; return obj; },
      setInteractive() { obj.interactive = true; return obj; },
      on(ev, cb) { handlers[ev] = cb; return obj; },
      emit(ev, ...a) { handlers[ev]?.(...a); return obj; },
      play(key) { obj._playedAnim = key; return obj; },
      destroy() {},
    };
    return obj;
  };
  scene.scale = { width: opts.width ?? 960, height: opts.height ?? 540 };
  scene.add = {
    text: (x, y, t, s) => mkGo('text', { x, y, text: t, style: s }),
    rectangle: (x, y, w, h, c, a) => mkGo('rectangle', { x, y, width: w, height: h, fillColor: c, fillAlpha: a }),
    graphics: () => new MockGraphics(textures),
    image: (x, y, k) => mkGo('image', { x, y, key: k }),
    particles: (x, y, key) => { const e = { x, y, key, _bursts: [], emitParticleAt(px, py) { this._bursts.push({ x: px, y: py }); return this; }, setPosition(px, py) { this.x = px; this.y = py; return this; }, explode() { return this; } }; (rec.particles ||= []).push(e); return e; },
  };
  scene.make = {
    graphics: () => new MockGraphics(textures),
    tilemap: (cfg) => {
      rec.tilemapKey = cfg.key;
      const map = {
        _layers: [], _tilesets: [], widthInTiles: 80, heightInTiles: 80, tileWidth: 32, tileHeight: 32,
        addTilesetImage(n, t) { const ts = { name: n, tex: t }; map._tilesets.push(ts); return ts; },
        createLayer(n, ts, x, y) {
          const layer = { name: n, visible: true, x, y, _collExcl: null, _coll: null,
            setCollisionByExclusion(a) { this._collExcl = a; }, setCollision(a) { this._coll = a; } };
          map._layers.push(layer); return layer;
        },
      };
      rec.map = map; return map;
    },
  };
  scene.anims = { _created: [], create(cfg) { this._created.push(cfg); return cfg; }, exists() { return false; } };
  scene.load = {
    _queue: [],
    on() {},
    tilemapTiledJSON(key, url) { this._queue.push({ type: 'tilemap', key, url }); },
    image(key, url) { this._queue.push({ type: 'image', key, url }); },
    spritesheet(key, url) { this._queue.push({ type: 'spritesheet', key, url }); },
    audio(key, url) { this._queue.push({ type: 'audio', key, url }); },
  };
  scene.scene = {
    start: (k) => calls.start.push(k), launch: (k) => calls.launch.push(k),
    stop: (k) => calls.stop.push(k), get: () => null, manager: { scenes: [], keys: {} },
  };
  scene.input = {
    keyboard: {
      addKey: () => ({ isDown: false, on() {}, removeAllListeners() {} }),
      createCursorKeys: () => ({ up: { isDown: false }, down: { isDown: false }, left: { isDown: false }, right: { isDown: false }, space: { isDown: false }, shift: { isDown: false } }),
      addKeys: (s) => { const o = {}; String(s).split(',').forEach(k => o[k.trim()] = { isDown: false }); return o; },
      on() {}, off() {},
    },
    on() {}, off() {},
  };
  scene.physics = {
    world: { setBounds: (...a) => { rec.worldBounds = a; }, enable() {}, bounds: {} },
    add: {
      sprite: (x, y, k) => mkSprite(x, y, k, rec),
      existing: (o) => o,
      collider: (a, b) => { (rec.colliders ||= []).push([a, b]); return {}; },
      overlap: (a, b) => { (rec.overlaps ||= []).push([a, b]); return {}; },
    },
    moveToObject: (sprite, target, speed) => {
      const dx = target.x - sprite.x, dy = target.y - sprite.y, len = Math.hypot(dx, dy) || 1;
      return sprite.body.setVelocity(dx / len * speed, dy / len * speed);
    },
  };
  scene.cameras = { main: { setBounds: (...a) => { rec.camBounds = a; }, centerOn: (...a) => { rec.camCenter = a; }, startFollow: (t, round, lx, ly) => { rec.follow = { target: t, lx, ly }; }, fade() {}, flash() {}, shake: (d, i) => { rec.shake = { d, i }; }, setZoom() {}, setBackgroundColor() {}, setLerp() {} } };
  scene.time = { now: 0, addEvent: () => ({ remove() {} }), delayedCall: (d, cb) => { delayed.push(cb); return { remove() {} }; } };
  scene.tweens = { add: (c) => { c.onComplete?.(); return { stop() {} }; } };
  scene._calls = calls; scene._textures = textures; scene._delayed = delayed; scene._rec = rec;
  scene.flushDelayed = () => { while (delayed.length) delayed.shift()(); };
  return scene;
}

// ── Mock de scène "plat" pour tester les ENTITÉS (Enemy/NPC isolés) ──
export function createMockScene(opts = {}) {
  const rec = { colliders: [], overlaps: [], follow: null, worldBounds: null, moveTo: null };
  const delayed = [];
  const scene = {
    _rec: rec, _delayed: delayed,
    flushDelayed: () => { while (delayed.length) delayed.shift()(); },
    scale: { width: opts.width ?? 960, height: opts.height ?? 540 },
    player: opts.player ?? { sprite: { x: 0, y: 0 } },
    add: {
      text: (x, y) => mkSprite(x, y, 'text', rec), rectangle: (x, y) => mkSprite(x, y, 'rect', rec),
      graphics: () => new MockGraphics({}), image: (x, y, k) => mkSprite(x, y, k, rec),
      particles: (x, y, key) => { const e = { x, y, key, _bursts: [], emitParticleAt(px, py) { this._bursts.push({ x: px, y: py }); return this; }, setPosition(px, py) { this.x = px; this.y = py; return this; }, explode() { return this; } }; (rec.particles ||= []).push(e); return e; },
    },
    make: { graphics: () => new MockGraphics({}) },
    anims: { _created: [], create(cfg) { this._created.push(cfg); return cfg; }, exists() { return false; } },
    physics: {
      add: {
        sprite: (x, y, k) => mkSprite(x, y, k, rec), existing: (o) => o,
        collider: (a, b) => { rec.colliders.push([a, b]); return {}; },
        overlap: (a, b) => { rec.overlaps.push([a, b]); return {}; },
      },
      moveToObject: (sprite, target, speed) => {
        rec.moveTo = { speed };
        const dx = target.x - sprite.x, dy = target.y - sprite.y, len = Math.hypot(dx, dy) || 1;
        return sprite.body.setVelocity(dx / len * speed, dy / len * speed);
      },
      world: { setBounds: (...a) => { rec.worldBounds = a; }, bounds: {} },
    },
    cameras: { main: { startFollow: (t, r, lx, ly) => { rec.follow = { t, lx, ly }; }, setBounds() {}, shake: (d, i) => { rec.shake = { d, i }; } } },
    input: { keyboard: { addKey: () => ({ isDown: false, on() {} }), createCursorKeys: () => ({ up: { isDown: false }, down: { isDown: false }, left: { isDown: false }, right: { isDown: false }, space: { isDown: false }, shift: { isDown: false } }), addKeys: (s) => { const o = {}; String(s).split(',').forEach(k => o[k.trim()] = { isDown: false }); return o; } }, on() {} },
    time: { now: 0, addEvent: () => ({ remove() {} }), delayedCall: (d, cb) => { delayed.push(cb); return { remove() {} }; } },
    tweens: { add: (c) => { c.onComplete?.(); return { stop() {} }; } },
  };
  return scene;
}
