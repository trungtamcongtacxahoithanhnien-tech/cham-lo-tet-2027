(function () {
  const D = window.SITE, $ = s => document.querySelector(s);
  const fmt = n => n.toLocaleString("vi-VN");

  // ---------- NAV ----------
  const nav = $("#nav");
  addEventListener("scroll", () => nav.classList.toggle("solid", scrollY > 60), { passive: true });
  $("#navToggle").onclick = () => $(".nav-links").classList.toggle("open");
  document.querySelectorAll(".nav-links a").forEach(a => a.onclick = () => $(".nav-links").classList.remove("open"));

  // ---------- CHỈ TIÊU ----------
  $("#statGrid").innerHTML = D.chiTieu.map(c => `
    <div class="stat reveal"><img src="assets/sprites/${c.icon}.png" alt="">
      <div><b data-to="${c.so}" data-suf="${c.hau}">0</b><span>${c.nhan}</span></div></div>`).join("");

  // ---------- MỤC LỤC CHƯƠNG TRÌNH ----------
  $("#progIndex").innerHTML = [...document.querySelectorAll(".prog")].map(p =>
    `<li><a href="#${p.id}"><b>${p.querySelector(".prog-no").textContent}</b><span>${p.querySelector("h3").textContent.split("·")[0].replace(/"/g, "").trim()}</span></a></li>`).join("");

  // ---------- NGŨ HÀNH ----------
  // Hình động pixel cho từng khu – mỗi hoạt động một cảnh (sprite vẽ bằng Gemini)
  // [tên sprite, trái%, cao%, hiệu ứng, đáy%]
  const NH_ANIM = [
    [ // MỘC
      [["q_mai", 25, 70, "sway"], ["q_dao", 75, 70, "sway d2"], ["fx_mai", 50, 14, "float"], ["fx_dao", 60, 12, "float d2"]],
      [["nh_tohe", 20, 58, "bob"], ["nh_camhoa", 52, 62, "none"], ["nh_longden", 83, 60, "bob d2"]],
      [["b_taiche", 30, 64, "none"], ["nh_caynon", 74, 56, "grow"], ["fx_lapLanh", 56, 14, "twinkle", 52]],
      [["b_photobooth", 30, 72, "none"], ["b_cayled", 74, 74, "glowpx"], ["fx_xu", 52, 13, "rise", 40]]
    ],
    [ // HỎA
      [["c_vetranh", 18, 58, "bob"], ["nh_lacxam", 50, 60, "jump"], ["nh_kinhlup", 82, 58, "bob d2"]],
      [["nh_goibanh", 50, 64, "bob"], ["fx_lapLanh", 82, 14, "twinkle", 60]],
      [["c_naubanh", 30, 70, "bob"], ["c_guitar", 76, 62, "sway"], ["fx_khoi", 22, 20, "rise", 42], ["fx_notnhac", 84, 14, "rise d2", 52]],
      [["b_oanquan", 32, 46, "none"], ["c_dacau", 74, 64, "jump"]]
    ],
    [ // THỔ
      [["nh_tnv_qua", 25, 68, "walk"], ["be_gai_lixi", 76, 62, "jump"], ["fx_lapLanh", 58, 14, "twinkle", 58]],
      [["c_sinhvien", 28, 66, "bob"], ["tnv_nu_lixi", 72, 66, "bob d2"], ["fx_xu", 50, 13, "rise", 40]]
    ],
    [ // KIM
      [["c_ongdo", 45, 66, "bob"], ["fx_lapLanh", 80, 14, "twinkle", 50]],
      [["nh_giancho", 30, 72, "none"], ["nh_xelan", 76, 64, "bob"], ["fx_xu", 54, 12, "rise", 44]],
      [["nh_vungsau", 50, 66, "bob"], ["fx_lapLanh", 86, 13, "twinkle", 56]]
    ],
    [ // THỦY
      [["nh_hienmau", 30, 70, "bob"], ["b_hienmau", 74, 66, "none"], ["fx_tim", 50, 14, "rise", 50]],
      [["bac_si", 30, 66, "bob"], ["q_thuoc", 72, 50, "none"]],
      [["nh_tra", 18, 30, "none"], ["nh_massage", 50, 62, "bob"], ["nh_ngamchan", 84, 52, "sway"], ["fx_khoi", 18, 16, "rise", 34]]
    ]
  ];
  const nhAnim = (i, hd) => `<div class="nh-anim" aria-hidden="true">${(NH_ANIM[i] || []).map((sc, k) =>
    `<div class="nh-slide${k ? "" : " show"}">${sc.map(([n, x, h, fx, y]) =>
      `<img class="nh-sp ${fx}" src="assets/sprites/${n}.png" alt="" loading="lazy" style="left:${x}%;height:${h}%;bottom:${y ?? 15}%">`).join("")}
      <span class="nh-cap">${(hd[k] || "").split(":")[0].replace(/"/g, "").trim()}</span></div>`).join("")}</div>`;
  $("#nguHanh").innerHTML = D.nguHanh.map((n, i) => `
    <div class="nh${i === 0 ? " on" : ""}" style="--c:${n.mau}" tabindex="0">
      ${nhAnim(i, n.hd)}
      <b>${n.ten}</b><span>${n.khu}</span><ul>${n.hd.map(h => `<li>${h}</li>`).join("")}</ul></div>`).join("");
  setInterval(() => document.querySelectorAll(".nh-anim").forEach(a => {
    const sl = [...a.children]; if (sl.length < 2) return;
    const k = sl.findIndex(x => x.classList.contains("show"));
    sl[k].classList.remove("show"); sl[(k + 1) % sl.length].classList.add("show");
  }), 3200);
  document.querySelectorAll(".nh").forEach(el => el.onclick = el.onkeydown = e => {
    if (e.type === "keydown" && e.key !== "Enter") return;
    document.querySelectorAll(".nh").forEach(x => x.classList.toggle("on", x === el));
  });

  // ---------- MÁY TÍNH ĐÓNG GÓP (Tổ ấm) ----------
  const calc = $("#calcN"), out = $("#calcOut");
  const upd = () => out.textContent = `${calc.value} phần quà = ${fmt(calc.value * 1000000)} đồng`;
  calc.oninput = upd; upd();

  // ---------- GÓI TÀI TRỢ ----------
  $("#tierGrid").innerHTML = D.goi.map(g => `
    <div class="tier reveal${g.noiBat ? " hot" : ""}" style="--c:${g.mau}">
      <div class="gem"></div><h4>${g.ten}</h4><div class="muc">${g.muc}</div><p>${g.mo}</p></div>`).join("");
  const cols = ["Quyền lợi", "Kim Cương", "Vàng", "Bạc", "Đồng hành", "Góc xuân"];
  $("#benefits").innerHTML = `<thead><tr>${cols.map(c => `<th>${c}</th>`).join("")}</tr></thead>
    <tbody>${D.quyenLoi.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>`;

  // ---------- LỘ TRÌNH ----------
  $("#timeline").innerHTML = D.loTrinh.map(t => `<div class="tl reveal"><b>${t.ngay}</b><span>${t.viec}</span></div>`).join("");

  // ---------- ẢNH ----------
  $("#masonry").innerHTML = D.anh.map(([f, c]) => `<figure class="reveal"><img src="assets/img/${f}" alt="${c}" loading="lazy"><figcaption>${c}</figcaption></figure>`).join("");

  // ---------- LIÊN HỆ ----------
  const L = D.lienHe;
  $("#contactCard").innerHTML = `
    <p><b>${L.hoTen}</b> – ${L.chucVu}</p>
    <p>📞 <a href="tel:${L.dienThoai.replace(/\s/g, "")}">${L.dienThoai}</a></p>
    <p>✉️ <a href="mailto:${L.email}">${L.email}</a></p>
    <p>🏠 ${L.diaChi}</p>
    <p>📘 <a href="${L.fanpage}" target="_blank" rel="noopener">Fanpage Trung tâm CTXH Thanh niên TP.HCM</a></p>`;

  // ---------- TRƯỚC / SAU (Phố Tết) ----------
  const views = [
    ["Toàn cảnh", "goc_toancanh", "pt_toancanh"], ["Cổng chính", "goc_cong", "pt_cong"],
    ["Góc trái", "goc_goctrai", "pt_goctrai"], ["Góc phải", "goc_gocphai", "pt_gocphai"]];
  const ba = $("#ba"), bw = ba.querySelector(".ba-before-wrap"), bimg = ba.querySelector(".ba-before"),
    aimg = ba.querySelector(".ba-after"), handle = ba.querySelector(".ba-handle");
  $("#baTabs").innerHTML = views.map((v, i) => `<button class="${i ? "" : "on"}" data-i="${i}">${v[0]}</button>`).join("");
  $("#baTabs").onclick = e => {
    const b = e.target.closest("button"); if (!b) return;
    document.querySelectorAll("#baTabs button").forEach(x => x.classList.toggle("on", x === b));
    const v = views[b.dataset.i];
    aimg.src = `assets/img/${v[2]}.jpg`; bimg.src = `assets/img/${v[1]}.jpg`; setPos(50);
  };
  function setPos(p) {
    p = Math.max(0, Math.min(100, p));
    bw.style.width = p + "%"; handle.style.left = p + "%";
    bimg.style.width = ba.clientWidth + "px"; bimg.style.height = ba.clientHeight + "px";
  }
  let drag = false;
  const at = e => { const r = ba.getBoundingClientRect(); setPos(((e.touches ? e.touches[0].clientX : e.clientX) - r.left) / r.width * 100); };
  ba.addEventListener("pointerdown", e => { drag = true; at(e); });
  addEventListener("pointermove", e => drag && at(e));
  addEventListener("pointerup", () => drag = false);
  aimg.onload = () => setPos(parseFloat(bw.style.width) || 50);
  addEventListener("resize", () => setPos(parseFloat(bw.style.width) || 50));
  // tự gợi ý kéo khi lần đầu thấy
  new IntersectionObserver((es, o) => es.forEach(e => {
    if (!e.isIntersecting) return; o.disconnect();
    let t = 0; const id = setInterval(() => { t += .05; setPos(50 + Math.sin(t * 2) * 25); if (t > 3.14) { clearInterval(id); setPos(50); } }, 30);
  }), { threshold: .5 }).observe(ba);

  // ---------- REVEAL + ĐẾM SỐ ----------
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in"); io.unobserve(e.target);
    const b = e.target.querySelector("b[data-to]");
    if (b) {
      const to = +b.dataset.to, suf = b.dataset.suf, t0 = performance.now();
      const step = t => { const k = Math.min(1, (t - t0) / 1600), v = to * (1 - Math.pow(1 - k, 3));
        b.textContent = (to % 1 ? v.toFixed(1).replace(".", ",") : fmt(Math.round(v))) + suf; if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }
  }), { threshold: .15 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  // ---------- PHÁO HOA & HOA MAI RƠI (sprite vẽ bằng Gemini) ----------
  const loadImg = n => { const i = new Image(); i.src = `assets/sprites/${n}.png`; return i; };
  const FW = ["fx_phaohoa_vang", "fx_phaohoa_do", "fx_phaohoa_xanh"].map(loadImg);
  const SPARK = loadImg("fx_lapLanh");
  function fireworks(cv, { rate = 0.03 } = {}) {
    const g = cv.getContext("2d"); let W, H, rockets = [], booms = [], on = false;
    const size = () => { W = cv.width = cv.clientWidth; H = cv.height = cv.clientHeight; g.imageSmoothingEnabled = false; };
    size(); addEventListener("resize", size);
    function tick() {
      if (!on) return;
      g.clearRect(0, 0, W, H);
      if (Math.random() < rate) rockets.push({ x: W * (.1 + Math.random() * .8), y: H, vy: -(H / 70) * (1 + Math.random() * .4), ty: H * (.12 + Math.random() * .3), im: FW[Math.random() * FW.length | 0] });
      rockets = rockets.filter(r => {
        r.y += r.vy;
        if (SPARK.complete) g.drawImage(SPARK, r.x - 8, r.y - 8, 16, 16);
        if (r.y <= r.ty) { booms.push({ x: r.x, y: r.y, t: 0, s: Math.min(W, H) * (.09 + Math.random() * .07), im: r.im }); return false; }
        return true;
      });
      booms = booms.filter(b => {
        b.t++; const k = b.t / 70, sc = b.s * (.3 + Math.min(1, k * 2.2) * .7);
        g.globalAlpha = Math.max(0, 1 - k * k);
        if (b.im.complete) g.drawImage(b.im, b.x - sc / 2, b.y - sc / 2 + k * 10, sc, sc);
        g.globalAlpha = 1; return k < 1;
      });
      requestAnimationFrame(tick);
    }
    new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !on) { on = true; tick(); } else if (!e.isIntersecting) on = false; })).observe(cv.parentElement);
  }
  fireworks($("#heroFx"), { rate: .03 });
  fireworks(document.querySelector(".fw-canvas"), { rate: .025 });

  (function petals(cv) {
    const g = cv.getContext("2d"); let W, H, ps = [], on = false;
    const IM = [loadImg("fx_mai"), loadImg("fx_mai"), loadImg("fx_dao")];
    const size = () => { W = cv.width = cv.clientWidth; H = cv.height = cv.clientHeight; g.imageSmoothingEnabled = false; };
    size(); addEventListener("resize", size);
    for (let i = 0; i < 18; i++) ps.push({ x: Math.random(), y: Math.random(), s: .4 + Math.random() * .6, p: Math.random() * 6, im: IM[i % 3] });
    function tick() {
      if (!on) return; g.clearRect(0, 0, W, H);
      ps.forEach(p => {
        p.y += .0012 * p.s; p.p += .03; if (p.y > 1.02) { p.y = -.02; p.x = Math.random(); }
        const x = (p.x + Math.sin(p.p) * .01) * W, y = p.y * H, z = 9 + p.s * 9;
        if (p.im.complete) { g.save(); g.translate(x, y); g.rotate(Math.sin(p.p) * .6); g.drawImage(p.im, -z / 2, -z / 2, z, z); g.restore(); }
      });
      requestAnimationFrame(tick);
    }
    new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !on) { on = true; tick(); } else if (!e.isIntersecting) on = false; })).observe(cv.parentElement);
  })(document.querySelector(".petal-canvas"));

  window.bootScenes();
})();
