// ======================================================================
//  Bộ máy "sân khấu pixel": đặt nhân vật, di chuyển, nói, hiệu ứng hạt
// ======================================================================
(function () {
  const SP = n => `assets/sprites/${n}.png`;
  const PRELOAD = ["tnv_nam","tnv_nam_di1","tnv_nam_di2","tnv_nam_omqua","tnv_nam_traoqua","tnv_nu","tnv_nu_lixi","be_trai","be_trai_nhay","be_trai_omqua","be_gai","be_gai_lixi","ba_cu","bo_doi","bac_si","mc","c_thuongbinh","c_sinhvien","c_ongdo","c_cattoc","c_dacau","c_cau","c_vetranh","c_guitar","c_naubanh","q_hopqua","q_chongqua","q_banhchung","q_lixi","q_mai","q_dao","q_denlong","q_co","q_xedap","q_thuoc","q_balo","q_cuc","b_xebus","b_taiche","b_hienmau","b_photobooth","b_cayled","b_oanquan","b_leu","b_ghecattoc"];
  PRELOAD.forEach(n => { const i = new Image(); i.src = SP(n); });

  class Stop extends Error {}

  class Stage {
    constructor(el) { this.el = el; this.alive = false; this.run = 0; }
    get on() { return this.alive; }
    wait(ms) {
      const run = this.run;
      return new Promise((res, rej) => setTimeout(() => (this.alive && run === this.run) ? res() : rej(new Stop()), ms));
    }
    // x: % tâm ngang, y: % từ đáy, h: % chiều cao cảnh
    add(name, { x = 50, y = 8, h = 36, flip = false, cls = "", z } = {}) {
      const d = document.createElement("div");
      d.className = "sprite " + cls;
      d.style.cssText = `left:${x}%;bottom:${y}%;height:${h}%;translate:-50% 0;z-index:${z ?? Math.round(100 - y)}`;
      const im = document.createElement("img");
      im.src = SP(name); im.alt = ""; im.style.height = "100%"; im.draggable = false;
      if (flip) im.style.transform = "scaleX(-1)";
      d.appendChild(im); d._img = im; d._x = x; d._y = y;
      this.el.appendChild(d);
      return d;
    }
    set(sp, name) { sp._img.src = SP(name); }
    flip(sp, f) { sp._img.style.transform = f ? "scaleX(-1)" : ""; }
    cls(sp, c, on = true) { sp._img.classList.toggle(c, on); }
    async move(sp, x, ms, { frames, y, ease = "linear" } = {}) {
      const from = { left: sp._x + "%", bottom: sp._y + "%" };
      const to = { left: x + "%", bottom: (y ?? sp._y) + "%" };
      const a = sp.animate([from, to], { duration: ms, easing: ease, fill: "forwards" });
      let t;
      if (frames) { let i = 0; t = setInterval(() => this.set(sp, frames[i++ % frames.length]), 180); }
      else sp._img.classList.add("bob");
      try { await this.wait(ms); }
      finally { clearInterval(t); if (!frames) sp._img.classList.remove("bob"); }
      sp._x = x; if (y != null) sp._y = y;
      sp.style.left = x + "%"; sp.style.bottom = sp._y + "%"; a.cancel();
    }
    say(sp, text, ms = 1800) {
      const b = document.createElement("div");
      b.className = "bubble"; b.textContent = text;
      const r = sp.getBoundingClientRect(), s = this.el.getBoundingClientRect();
      b.style.left = Math.max(16, Math.min(84, (r.left + r.width / 2 - s.left) / s.width * 100)) + "%";
      b.style.top = ((r.top - s.top) / s.height * 100 - 2) + "%";
      this.el.appendChild(b);
      setTimeout(() => b.remove(), ms);
    }
    label(text, cls = "scene-label") {
      let l = this.el.querySelector("." + cls);
      if (!l) { l = document.createElement("div"); l.className = cls; this.el.appendChild(l); }
      l.textContent = text; return l;
    }
    // hạt pixel bay lên / tỏa ra
    burst(x, y, { n = 14, colors = ["#f2c14e", "#e2453a", "#fff"], spread = 12, up = 18, size = 1.2, dur = 900, shape } = {}) {
      for (let i = 0; i < n; i++) {
        const p = document.createElement("div");
        p.className = "fx";
        const c = colors[i % colors.length];
        p.style.cssText = `left:${x}%;bottom:${y}%;width:${size}%;aspect-ratio:1;background:${c}`;
        if (shape) { p.textContent = shape; p.style.cssText = `left:${x}%;bottom:${y}%;color:${c};font:700 clamp(10px,1.6vw,20px) monospace`; }
        this.el.appendChild(p);
        const dx = (Math.random() - .5) * spread, dy = up * (.5 + Math.random());
        p.animate([{ transform: "translate(0,0)", opacity: 1 }, { transform: `translate(${dx * 8}px,${-dy * 6}px)`, opacity: 0 }],
          { duration: dur * (.7 + Math.random() * .6), easing: "cubic-bezier(.2,.7,.3,1)" }).onfinish = () => p.remove();
      }
    }
    clear() { this.el.querySelectorAll(".sprite,.bubble,.fx,.scene-label,.scene-score,.flash,.spot-light,.road-dash").forEach(e => e.remove()); }
  }

  // ---------------------------- KỊCH BẢN ----------------------------
  const WALK = ["tnv_nam_di1", "tnv_nam_di2"];
  const S = {};

  S.hero = async s => {
    const team = [["tnv_nam_omqua", 34], ["be_trai_omqua", 30], ["tnv_nu_lixi", 34], ["be_gai_lixi", 29], ["c_sinhvien", 34], ["bo_doi", 35], ["ba_cu", 32], ["tnv_nam", 34]];
    s.add("q_mai", { x: 5, y: 3, h: 50 }); s.add("q_dao", { x: 95, y: 3, h: 50 });
    const walkers = team.map(([n, h], i) => {
      const sp = s.add(n, { x: -8 - i * 13, y: 4, h: h * 1.6 });
      return sp;
    });
    // đi diễu hành liên tục
    await Promise.all(walkers.map((sp, i) => s.move(sp, sp._x + 125, 17000)));
  };

  S.p1 = async s => {
    s.label("Cà Mau · 20–21/12/2026");
    const dash = document.createElement("div"); dash.className = "road-dash";
    dash.style.cssText = "position:absolute;left:0;right:0;bottom:9%;height:1.4%;background:repeating-linear-gradient(90deg,#f3e2b8 0 3%,transparent 3% 6%);z-index:2";
    s.el.appendChild(dash);
    const kids = [s.add("be_trai", { x: 80, y: 6, h: 30, flip: true }), s.add("be_gai", { x: 90, y: 6, h: 29, flip: true }), s.add("ba_cu", { x: 70, y: 7, h: 32, flip: true })];
    const bus = s.add("b_xebus", { x: -40, y: 5, h: 46, z: 60 });
    const roll = dash.animate([{ backgroundPosition: "0 0" }, { backgroundPosition: "-200% 0" }], { duration: 2600, easing: "ease-out" });
    await s.move(bus, 26, 2600, { ease: "cubic-bezier(.2,.8,.3,1)" });
    s.burst(12, 8, { colors: ["#d8c4a0", "#c9b28c"], up: 6, spread: 6, n: 10 });
    await s.wait(300);
    const tnv = s.add("tnv_nam_di1", { x: 36, y: 6, h: 34 });
    const bs = s.add("bac_si", { x: 32, y: 6, h: 34 });
    s.move(bs, 60, 1600);
    await s.move(tnv, 52, 1500, { frames: WALK });
    s.set(tnv, "tnv_nam");
    s.say(bs, "Khám bệnh miễn phí nè!");
    const thuoc = s.add("q_thuoc", { x: 63, y: 6, h: 14 });
    await s.wait(1200);
    // trao xe đạp
    const xe = s.add("q_xedap", { x: 52, y: 6, h: 20, z: 99 });
    s.set(tnv, "tnv_nam_traoqua");
    await s.move(xe, 76, 900);
    s.set(kids[0], "be_trai_nhay"); s.cls(kids[0], "jump");
    s.say(kids[0], "Con cảm ơn ạ!");
    s.burst(78, 30, { n: 18 });
    const balo = s.add("q_balo", { x: 86, y: 6, h: 15 });
    s.set(kids[1], "be_gai_lixi");
    await s.wait(2600);
  };

  S.p2 = async s => {
    const lab = s.label("Tuyến đường cờ Tổ quốc: 0 lá cờ");
    const bd = s.add("bo_doi", { x: 92, y: 6, h: 36, flip: true });
    const tnv = s.add("tnv_nam_di1", { x: -5, y: 6, h: 34 });
    let n = 0;
    for (let x = 8; x <= 80; x += 9) {
      await s.move(tnv, x - 3, 520, { frames: WALK });
      const f = s.add("q_co", { x, y: 18, h: 30, cls: "", z: 5 });
      f.classList.add("flag-pop"); f.animate([{ translate: "-50% 60%", opacity: 0 }, { translate: "-50% 0", opacity: 1 }], { duration: 500, easing: "cubic-bezier(.2,1.6,.4,1)" });
      lab.textContent = `Tuyến đường cờ Tổ quốc: ${++n} lá cờ`;
    }
    s.set(tnv, "tnv_nam_omqua");
    s.say(bd, "Chúc mừng năm mới!");
    await s.wait(900);
    s.set(tnv, "tnv_nam_traoqua");
    s.burst(88, 30, { n: 16 });
    s.say(tnv, "Xuân biên giới ấm áp!");
    await s.wait(2600);
  };

  S.p3 = async s => {
    s.label("Sân chơi Sắc màu quanh em");
    const dc = s.add("c_dacau", { x: 18, y: 6, h: 34 });
    const cau = s.add("c_cau", { x: 26, y: 30, h: 7, z: 99 });
    const ve = s.add("c_vetranh", { x: 48, y: 6, h: 32 });
    const bt = s.add("be_trai_nhay", { x: 68, y: 6, h: 32, cls: "" }); s.cls(bt, "jump");
    const nu = s.add("tnv_nu", { x: 92, y: 6, h: 34, flip: true });
    const bg = s.add("be_gai", { x: 80, y: 6, h: 29 });
    for (let k = 0; k < 4; k++) {
      cau.animate([{ bottom: "30%" }, { bottom: "78%" }, { bottom: "30%" }], { duration: 1100, easing: "ease-in-out" });
      s.burst(56, 30, { n: 10, colors: ["#e2453a", "#f2c14e", "#2e9ad6", "#4cbb5a", "#c25bd6"], up: 14, spread: 14 });
      await s.wait(1100);
    }
    s.set(nu, "tnv_nu_lixi");
    s.say(nu, "Lì xì đầu năm nè!");
    await s.wait(800);
    s.set(bg, "be_gai_lixi");
    s.burst(80, 35, { n: 20 });
    await s.wait(2200);
  };

  S.p4 = async s => {
    const spot = document.createElement("div"); spot.className = "spot-light"; s.el.appendChild(spot);
    const fl = document.createElement("div"); fl.className = "flash"; s.el.appendChild(fl);
    const score = s.label("Smile Score: 0", "scene-score");
    s.label("Tết trao – Xuân đoàn viên · 23–24/01/2027");
    const tree = s.add("b_cayled", { x: 9, y: 4, h: 62, cls: "glow" });
    const pb = s.add("b_photobooth", { x: 90, y: 4, h: 52, flip: true });
    const mc = s.add("mc", { x: 50, y: 30, h: 36 });
    const qua = s.add("q_chongqua", { x: 38, y: 30, h: 16 });
    const coins = setInterval(() => s.on && s.burst(9, 52, { n: 4, colors: ["#ffd84a", "#ffb000"], up: 16, spread: 6, size: 1.1 }), 700);
    try {
      s.say(mc, "Chào mừng các bạn nhỏ!", 2200);
      const kids = [s.add("be_trai", { x: 108, y: 6, h: 30, flip: true }), s.add("be_gai", { x: 116, y: 6, h: 29, flip: true }), s.add("c_sinhvien", { x: 124, y: 6, h: 34, flip: true })];
      await Promise.all([s.move(kids[0], 60, 2200), s.move(kids[1], 66, 2400), s.move(kids[2], 73, 2600)]);
      await Promise.all([s.move(kids[0], 58, 500, { y: 30 }), s.move(kids[1], 65, 500, { y: 30 })]);
      const tnv = s.add("tnv_nam_omqua", { x: 26, y: 30, h: 36 });
      await s.move(tnv, 46, 1400);
      s.set(tnv, "tnv_nam_traoqua"); await s.wait(600);
      s.set(kids[0], "be_trai_omqua"); s.set(kids[1], "be_gai_lixi");
      s.burst(60, 62, { n: 24 }); s.cls(kids[0], "jump");
      s.say(kids[1], "Tết vui quá!");
      await s.wait(1200);
      // photobooth chấm điểm nụ cười
      await s.move(kids[2], 80, 900);
      s.say(kids[2], "Cười tươi nào!");
      for (let i = 0; i <= 100; i += 4) { score.textContent = "Smile Score: " + Math.min(i, 98); await s.wait(30); }
      fl.classList.remove("on"); void fl.offsetWidth; fl.classList.add("on");
      s.burst(80, 50, { n: 26, colors: ["#ffd84a", "#fff", "#7ee081"] });
      await s.wait(2400);
    } finally { clearInterval(coins); }
  };

  S.p5 = async s => {
    s.label("TT dưỡng lão Thị Nghè · 30/01/2027");
    s.add("q_mai", { x: 8, y: 4, h: 34 });
    const ghe = s.add("b_ghecattoc", { x: 40, y: 4, h: 44 });
    const ct = s.add("c_cattoc", { x: 56, y: 6, h: 35, flip: true });
    const ba = s.add("ba_cu", { x: 100, y: 6, h: 33, flip: true });
    const nu = s.add("tnv_nu", { x: 84, y: 6, h: 34, flip: true });
    await s.move(ba, 44, 2600);
    s.say(ct, "Cụ ngồi đây con hớt tóc nhé!");
    for (let i = 0; i < 5; i++) { s.burst(46, 34, { n: 6, colors: ["#bbb", "#888"], up: 5, spread: 6, size: .8 }); await s.wait(380); }
    s.flip(ba, false); s.say(ba, "Đẹp quá, cảm ơn các cháu!", 2000);
    await s.wait(1200);
    s.set(nu, "tnv_nu_lixi"); s.burst(58, 40, { n: 16 });
    await s.wait(2600);
  };

  S.p6 = async s => {
    s.el.classList.add("live");
    s.label("TT Điều dưỡng Long Đất · 31/01/2027");
    const tb = s.add("c_thuongbinh", { x: 70, y: 6, h: 36, flip: true });
    const nau = s.add("c_naubanh", { x: 24, y: 4, h: 38 });
    const gt = s.add("c_guitar", { x: 88, y: 5, h: 32, flip: true });
    const steam = setInterval(() => s.on && s.burst(22, 30, { n: 3, colors: ["rgba(255,255,255,.9)", "rgba(230,230,230,.8)"], up: 14, spread: 4, size: 1.6, dur: 1600 }), 260);
    const notes = setInterval(() => s.on && s.burst(86, 34, { n: 1, colors: ["#b3131f", "#2a1a12"], up: 12, spread: 6, shape: "♪", dur: 1600 }), 600);
    try {
      const tnv = s.add("tnv_nam_omqua", { x: 36, y: 6, h: 35 });
      await s.move(tnv, 60, 1800);
      s.set(tnv, "tnv_nam_traoqua"); await s.wait(500);
      s.say(tb, "Cảm ơn các cháu!", 2000);
      s.burst(66, 40, { n: 18 });
      await s.wait(1500);
      s.add("q_banhchung", { x: 47, y: 6, h: 12 });
      s.say(nau, "Bánh chưng sắp chín rồi!");
      await s.wait(2600);
    } finally { clearInterval(steam); clearInterval(notes); }
  };

  S.p7 = async s => {
    const cnt = s.label("Quà đã trao: 0 / 1.500", "scene-score");
    s.label("Tổ ấm ngày xuân · Tao Đàn · 01/02/2027");
    const lan = [];
    for (let i = 0; i < 7; i++) lan.push(s.add("q_denlong", { x: 32 + i * 6.3, y: 62, h: 16, z: 5, cls: "sway" }));
    for (const l of lan) { await s.wait(220); l.classList.add("glow"); }
    s.add("c_ongdo", { x: 12, y: 3, h: 34 });
    s.add("b_leu", { x: 88, y: 4, h: 48 });
    const tnv = s.add("tnv_nam_omqua", { x: 36, y: 6, h: 34 });
    const names = ["be_trai", "be_gai", "be_trai", "be_gai", "be_trai"];
    let given = 0;
    for (let i = 0; i < names.length; i++) {
      const k = s.add(names[i], { x: 110, y: 6, h: 29, flip: true });
      await s.move(k, 48, 1100);
      s.set(tnv, "tnv_nam_traoqua"); await s.wait(350);
      s.set(k, names[i] === "be_trai" ? "be_trai_omqua" : "be_gai_lixi");
      given += 300; cnt.textContent = `Quà đã trao: ${given.toLocaleString("vi-VN")} / 1.500`;
      s.burst(48, 38, { n: 12 });
      s.flip(k, false); s.set(tnv, "tnv_nam_omqua");
      s.move(k, 20 + i * 4, 900).then(() => { s.cls(k, "jump"); }).catch(() => {});
      await s.wait(500);
    }
    await s.wait(2600);
  };

  S.outro = async s => {
    s.add("q_mai", { x: 10, y: 4, h: 34 }); s.add("q_dao", { x: 90, y: 4, h: 34 });
    const a = s.add("tnv_nam_traoqua", { x: 36, y: 6, h: 40 });
    const b = s.add("tnv_nu", { x: 62, y: 6, h: 40, flip: true });
    const c = s.add("be_trai_nhay", { x: 50, y: 6, h: 32 }); s.cls(c, "jump");
    s.say(b, "Cùng đồng hành nhé!", 2400);
    await s.wait(2600);
    s.say(a, "Tết trao – Xuân đoàn viên!", 2400);
    s.burst(50, 50, { n: 30 });
    await s.wait(3000);
  };

  // ------------------------- điều phối -------------------------
  function boot(el) {
    const name = el.dataset.scene, script = S[name];
    if (!script) return;
    const st = new Stage(el);
    el._stage = st;
    async function loop() {
      while (st.alive) {
        const run = ++st.run;
        try { await script(st); await st.wait(800); } catch (e) { if (!(e instanceof Stop)) console.error(e); }
        if (run === st.run) st.clear();
      }
    }
    new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting && !st.alive) { st.alive = true; loop(); }
      else if (!e.isIntersecting && st.alive) { st.alive = false; st.run++; st.clear(); el.classList.remove("live"); }
    }), { threshold: .35 }).observe(el);
  }
  window.bootScenes = () => document.querySelectorAll(".scene[data-scene]").forEach(el => {
    if (el.dataset.bg) el.style.backgroundImage = `url(${el.dataset.bg})`;
    boot(el);
  });
})();
