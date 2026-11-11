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
    `<li><a href="#${p.id}">${p.querySelector(".prog-no").textContent} · ${p.querySelector("h3").textContent.split("·")[0].replace(/"/g, "").trim()}</a></li>`).join("");

  // ---------- NGŨ HÀNH ----------
  $("#nguHanh").innerHTML = D.nguHanh.map((n, i) => `
    <div class="nh${i === 0 ? " on" : ""}" style="--c:${n.mau}" tabindex="0">
      <b>${n.ten}</b><span>${n.khu}</span><ul>${n.hd.map(h => `<li>${h}</li>`).join("")}</ul></div>`).join("");
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

  // ---------- PHÁO HOA PIXEL ----------
  function fireworks(cv, { rate = 0.03, palette = ["#ffd84a", "#ff5a4a", "#fff", "#7ee0ff", "#ff9ad1"] } = {}) {
    const g = cv.getContext("2d"); let W, H, parts = [], rockets = [], on = false;
    const PX = 4;
    const size = () => { W = cv.width = cv.clientWidth / 2; H = cv.height = cv.clientHeight / 2; g.imageSmoothingEnabled = false; };
    size(); addEventListener("resize", size);
    function tick() {
      if (!on) return;
      g.clearRect(0, 0, W, H);
      if (Math.random() < rate) rockets.push({ x: W * (.1 + Math.random() * .8), y: H, vy: -(H / 70) * (1 + Math.random() * .4), ty: H * (.12 + Math.random() * .3), c: palette[Math.random() * palette.length | 0] });
      rockets = rockets.filter(r => {
        r.y += r.vy; g.fillStyle = "#fff"; g.fillRect(r.x | 0, r.y | 0, 2, 3);
        if (r.y <= r.ty) { for (let i = 0; i < 40; i++) { const a = Math.random() * 6.28, s = Math.random() * 2.2 + .6; parts.push({ x: r.x, y: r.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, l: 60 + Math.random() * 30, c: r.c }); } return false; }
        return true;
      });
      parts = parts.filter(p => { p.x += p.vx; p.y += p.vy; p.vy += .03; p.vx *= .98; p.l--; g.globalAlpha = Math.max(0, p.l / 80); g.fillStyle = p.c; g.fillRect(p.x | 0, p.y | 0, 2, 2); return p.l > 0; });
      g.globalAlpha = 1;
      requestAnimationFrame(tick);
    }
    new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !on) { on = true; tick(); } else if (!e.isIntersecting) on = false; })).observe(cv.parentElement);
  }
  fireworks($("#heroFx"), { rate: .05 });
  fireworks(document.querySelector(".fw-canvas"), { rate: .035 });

  // ---------- CÁNH MAI RƠI ----------
  (function petals(cv) {
    const g = cv.getContext("2d"); let W, H, ps = [], on = false;
    const size = () => { W = cv.width = cv.clientWidth / 3; H = cv.height = cv.clientHeight / 3; };
    size(); addEventListener("resize", size);
    for (let i = 0; i < 60; i++) ps.push({ x: Math.random(), y: Math.random(), s: .3 + Math.random() * .7, p: Math.random() * 6 });
    function tick() {
      if (!on) return; g.clearRect(0, 0, W, H);
      ps.forEach(p => {
        p.y += .0012 * p.s; p.p += .03; if (p.y > 1.02) { p.y = -.02; p.x = Math.random(); }
        const x = (p.x + Math.sin(p.p) * .01) * W, y = p.y * H;
        g.fillStyle = p.s > .6 ? "#f6c02e" : "#ffd75e"; g.fillRect(x | 0, y | 0, 3, 3); g.fillStyle = "#e09a10"; g.fillRect((x | 0) + 1, (y | 0) + 1, 1, 1);
      });
      requestAnimationFrame(tick);
    }
    new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !on) { on = true; tick(); } else if (!e.isIntersecting) on = false; })).observe(cv.parentElement);
  })(document.querySelector(".petal-canvas"));

  window.bootScenes();
})();
