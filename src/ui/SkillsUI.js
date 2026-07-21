// SkillsUI.js — Sands of Aetheria
// Rôle : Fenêtre des 7 compétences avec barres de progression (overlay UIScene, toggle K)
// Étape de création : 8
// Dépendances : Phaser (global). Rend un snapshot de SkillSystem (découplé).

const BAR_W = 120;

export class SkillsUI {
  constructor(scene) {
    this.scene = scene;
    this.visible = false;
    this.objects = [];
  }

  toggle(snapshot) { this.visible ? this.close() : this.open(snapshot); }
  open(snapshot) { this.render(snapshot); }
  close() { this.visible = false; this.objects.forEach(o => o.destroy()); this.objects = []; }

  render(snapshot) {
    this.close();
    this.visible = true;
    const s = this.scene;
    const px = s.scale.width / 2 - 150, py = 60;
    const put = (o) => { this.objects.push(o.setScrollFactor(0)); return o; };
    const mono = (sz, color) => ({ fontFamily: "'Share Tech Mono', monospace", fontSize: sz, color });

    put(s.add.rectangle(px + 150, py + 130, 300, 264, 0x0f0a06, 0.94).setStrokeStyle(1, 0x3a2a1a).setDepth(900));
    put(s.add.text(px + 150, py + 16, 'COMPÉTENCES', { fontFamily: "'Cinzel', serif", fontSize: '18px', color: '#c4a35a' }).setOrigin(0.5).setDepth(901));

    let i = 0;
    for (const skill of Object.values(snapshot)) {
      const y = py + 48 + i * 27;
      const lvl = Math.floor(skill.level);
      put(s.add.text(px + 16, y, skill.name, mono('12px', '#e8d5b0')).setDepth(901));
      put(s.add.rectangle(px + 100 + BAR_W / 2, y + 6, BAR_W, 8, 0x1a1208).setStrokeStyle(1, 0x2a1a0a).setDepth(901));
      if (skill.level > 0)
        put(s.add.rectangle(px + 100 + (skill.level / 100) * BAR_W / 2, y + 6, (skill.level / 100) * BAR_W, 6, 0xcc9922).setDepth(902));
      put(s.add.text(px + 240, y, `${lvl}`, mono('12px', lvl >= 100 ? '#ffd700' : '#a08060')).setDepth(901));
      i++;
    }
    put(s.add.text(px + 150, py + 248, '[ K ] fermer · progresser en agissant', mono('10px', '#a08060')).setOrigin(0.5).setDepth(901));
  }
}
