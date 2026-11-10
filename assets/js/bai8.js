/* ==========================================================
   bai8.js — các hình vẽ và phần tương tác của Bài 8 (hồi quy – tương quan)
   ========================================================== */
document.addEventListener("siteready", () => {
  const X = window.XS;
  const $ = id => document.getElementById(id);
  const f = (v, d = 4, trim = false) => X.fmt(v, d, trim);
  const tf = (v, d = 4, trim = false) => X.tfmt(v, d, trim);

  /* số ngẫu nhiên có hạt giống */
  function rng(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  const gauss = r => { let u = 0; while (u === 0) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); };
  const svgBox = (host, W, H, maxW) => X.el("svg", { viewBox: `0 0 ${W} ${H}`, style: `width:100%;height:auto;display:block;max-width:${maxW || W}px;margin:0 auto` }, host);
  const txt = (svg, x, y, s, attrs = {}) => { const e = X.el("text", Object.assign({ x, y, "text-anchor": "middle", class: "svg-text" }, attrs), svg); e.textContent = s; return e; };
  const math = el => { if (window.renderMath) window.renderMath(el); };
  /* nút chọn (seg): gọi cb(h) khi bấm */
  const seg = (id, cb) => {
    const box = $(id);
    box.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      [...box.querySelectorAll("button")].forEach(x => x.classList.toggle("on", x === b));
      cb(+b.dataset.h);
    });
  };
  /* hồi quy Y theo X */
  const reg = (xs, ys) => {
    const n = xs.length, xb = xs.reduce((s, v) => s + v, 0) / n, yb = ys.reduce((s, v) => s + v, 0) / n;
    let qx = 0, qy = 0, qxy = 0;
    for (let i = 0; i < n; i++) { const dx = xs[i] - xb, dy = ys[i] - yb; qx += dx * dx; qy += dy * dy; qxy += dx * dy; }
    const b = qxy / qx, a = yb - b * xb, r = qxy / Math.sqrt(qx * qy);
    const sse = Math.max(0, qy - b * qxy);
    return { n, xb, yb, qx, qy, qxy, b, a, r, sse, s: n > 2 ? Math.sqrt(sse / (n - 2)) : NaN };
  };
  /* t theo bảng (làm tròn 3 chữ số như Phụ lục 5) */
  const tq = (p, df) => Math.round(X.tInv(p, df) * 1000) / 1000;
  /* chữ có gạch trên (X̄, Ȳ) trong khung đồ thị */
  const barTxt = (c, xv, yv, letter, rest, attrs = {}) => {
    const e = X.el("text", Object.assign({ x: c.x(xv), y: c.y(yv), "text-anchor": "middle", class: "svg-text" }, attrs), c.g);
    const a = X.el("tspan", { style: "text-decoration:overline" }, e); a.textContent = letter;
    const b = X.el("tspan", {}, e); b.textContent = rest;
    return e;
  };
  const seg2 = (c, x1, y1, x2, y2, attrs = {}) => X.el("line", Object.assign({ x1: c.x(x1), y1: c.y(y1), x2: c.x(x2), y2: c.y(y2), stroke: "var(--text-2)", "stroke-width": 1.6 }, attrs), c.g);
  const arrow = (c, x, y1, y2, color) => {
    const px = c.x(x), p1 = c.y(y1), p2 = c.y(y2), dir = p2 < p1 ? 1 : -1;
    X.el("line", { x1: px, y1: p1, x2: px, y2: p2 + dir * 5, stroke: color, "stroke-width": 3 }, c.g);
    X.el("path", { d: `M${px},${p2}L${px - 5},${p2 + dir * 8}L${px + 5},${p2 + dir * 8}Z`, fill: color }, c.g);
  };

  /* ví dụ chính: số năm hút thuốc – CAL */
  const MX = [3, 6, 7, 10, 12, 16], MY = [3.1, 3.4, 4.1, 4.7, 4.9, 5.6];
  const M = reg(MX, MY); // a = 2,5; b = 0,2; r = 0,9798; S_XY = 0,2121
  const mainAxes = (c, xl = "X: số năm hút thuốc", yl = "Y: CAL (mm)") => c.axes({ xlabel: xl, ylabel: yl });
  const mainDots = (c, attrs = {}) => MX.forEach((x, i) => c.dot(x, MY[i], attrs));

  /* ---------------- SƠ ĐỒ TƯ DUY ---------------- */
  if ($("mm8")) X.mindmap($("mm8"), {
    t: "Bài 8<br>Hồi quy – tương quan",
    c: [
      { t: "Đám mây điểm", c: [{ t: "$X$ độc lập, $Y$ phụ thuộc" }, { t: "Hướng · độ chặt · dạng" }, { t: "Phụ thuộc thống kê, không phải hàm số" }] },
      { t: "Phương trình hồi quy", c: [{ t: "$Y=a+bX$, bình phương bé nhất" }, { t: "$b=\\frac{\\sum XY-n\\overline X\\,\\overline Y}{\\sum X^2-n\\overline X^2}$" }, { t: "$a=\\overline Y-b\\overline X$" }] },
      { t: "Hệ số tương quan $r$", c: [{ t: "$r=\\frac{\\sum XY-n\\overline X\\,\\overline Y}{(n-1)S_XS_Y}$" }, { t: "$|r|$: 0,3 / 0,7; dấu = hướng" }, { t: "$b=r\\frac{S_Y}{S_X}$" }] },
      { t: "Phương sai hồi quy", c: [{ t: "$SST=SSR+SSE$" }, { t: "$r^2=\\frac{SSR}{SST}$" }, { t: "$S^2_{XY}=\\frac{n-1}{n-2}(1-r^2)S_Y^2$" }] },
      { t: "Khoảng dự báo", c: [{ t: "$Y_0=a+bX_0$, Student $n-2$" }, { t: "Một người ($Y$): có số 1 trong căn" }, { t: "Trung bình ($\\mu_Y$): không có số 1" }] },
      { t: "Kiểm định", c: [{ t: "$\\rho=0$: $T=\\frac{r\\sqrt{n-2}}{\\sqrt{1-r^2}}$" }, { t: "$\\rho=\\rho_0$: $Z=(Z_r-Z_0)\\sqrt{n-3}$" }, { t: "So $b$ với $b_0$, $a$ với $a_0$" }] },
      { t: "Dạng đặc biệt", c: [{ t: "Đề cho các tổng" }, { t: "Đổi biến: $r$ giữ nguyên" }, { t: "Hồi quy $X$ theo $Y$: $bb'=r^2$" }] }
    ]
  }, { colW: 250 });

  /* ---------------- HÌNH 8.1: ĐÁM MÂY ĐIỂM VÍ DỤ CHÍNH ---------------- */
  if ($("mainFig")) X.responsive($("mainFig"), () => {
    const c = X.chart($("mainFig"), { height: 250, xmin: 0, xmax: 18, ymin: 2, ymax: 6.5 });
    c.axes({ xticks: [0, 3, 6, 9, 12, 15, 18], yticks: [2, 3, 4, 5, 6], xlabel: "X: số năm hút thuốc", ylabel: "Y: CAL (mm)" });
    mainDots(c, { r: 6 });
    MX.forEach((x, i) => c.text(x, MY[i] + 0.22, String(i + 1), { style: "font-size:11.5px" }));
  });

  /* ---------------- HÌNH 8.2: BỐN DẠNG ĐÁM MÂY ---------------- */
  if ($("shapeFig")) {
    const host = $("shapeFig");
    const gen = (kind, seed) => {
      const R = rng(seed), xs = [], ys = [];
      for (let i = 0; i < 40; i++) {
        if (kind === "U") { const x = -2 + 4 * R(); xs.push(x); ys.push(x * x + 0.35 * gauss(R)); }
        else { const x = gauss(R), e = gauss(R); xs.push(x); ys.push(kind * x + Math.sqrt(1 - kind * kind) * e); }
      }
      return { xs, ys, r: reg(xs, ys).r };
    };
    const ok = { 0: d => d.r >= 0.93 && d.r <= 0.97, 1: d => d.r <= -0.45 && d.r >= -0.65, 2: d => Math.abs(d.r) < 0.08, 3: d => Math.abs(d.r) < 0.08 };
    const kinds = [0.95, -0.55, 0, "U"], names = ["(A)", "(B)", "(C)", "(D)"];
    const data = kinds.map((k, j) => { let s = 101 + 37 * j, d; for (let t = 0; t < 400; t++) { d = gen(k, s + t); if (ok[j](d)) break; } return d; });
    const W = 760, H = 560, svg = svgBox(host, W, H, 760);
    data.forEach((d, j) => {
      const ox = (j % 2) * 380 + 20, oy = Math.floor(j / 2) * 280 + 10, w = 340, h = 230;
      X.el("rect", { x: ox, y: oy + 40, width: w, height: h - 40, rx: 10, fill: "none", stroke: "var(--border-strong)", "stroke-width": 1.5 }, svg);
      const xmin = Math.min(...d.xs), xmax = Math.max(...d.xs), ymin = Math.min(...d.ys), ymax = Math.max(...d.ys);
      d.xs.forEach((x, i) => X.el("circle", { cx: ox + 16 + (x - xmin) / (xmax - xmin) * (w - 32), cy: oy + h - 14 - (d.ys[i] - ymin) / (ymax - ymin) * (h - 70), r: 6, fill: "var(--s1)", "fill-opacity": .75 }, svg));
      txt(svg, ox + w / 2, oy + 28, `${names[j]}  r = ${f(d.r, 2).replace("-", "−")}`, { class: "svg-strong", style: "font-size:25px" });
    });
  }

  /* ---------------- TRÒ CHƠI ĐOÁN r ---------------- */
  if ($("guessWidget")) {
    const LIST = [-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9];
    let round = 0, score = 0, played = 0, streak = 0, cur = null, answered = false;
    const make = k => {
      const R = rng(9000 + 17 * k), target = LIST[Math.floor(R() * LIST.length)], xs = [], ys = [];
      for (let i = 0; i < 30; i++) { const x = gauss(R), e = gauss(R); xs.push(x); ys.push(target * x + Math.sqrt(1 - target * target) * e); }
      const r = reg(xs, ys).r;
      const best = LIST.reduce((p, v) => Math.abs(v - r) < Math.abs(p - r) ? v : p, LIST[0]);
      const others = LIST.filter(v => v !== best);
      const pick = [];
      while (pick.length < 3) { const v = others[Math.floor(R() * others.length)]; if (!pick.includes(v)) pick.push(v); }
      return { xs, ys, r, best, opts: [best, ...pick].sort((p, q) => p - q) };
    };
    const draw = () => {
      const c = X.chart($("guessPlot"), { height: 240, xmin: -3, xmax: 3, ymin: -3, ymax: 3 });
      c.axes({ xticks: [], yticks: [], nogrid: true });
      cur.xs.forEach((x, i) => c.dot(Math.max(-2.9, Math.min(2.9, x)), Math.max(-2.9, Math.min(2.9, cur.ys[i])), { r: 4.5, "fill-opacity": .85 }));
    };
    const newRound = () => {
      cur = make(round++); answered = false;
      $("guessOpts").innerHTML = cur.opts.map(v => `<button type="button" data-v="${v}">r ≈ ${f(v, 1, true).replace("-", "−")}</button>`).join("");
      $("guessRead").innerHTML = `<div class="row"><span class="kv">Lượt ${round}: chọn một giá trị.</span><span class="kv">Điểm: <b>${score}/${played}</b> · chuỗi đúng: <b>${streak}</b></span></div>`;
      draw();
    };
    $("guessOpts").addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b || answered) return;
      answered = true; played++;
      const v = +b.dataset.v, right = v === cur.best;
      if (right) { score++; streak++; } else streak = 0;
      [...$("guessOpts").querySelectorAll("button")].forEach(x => { if (+x.dataset.v === cur.best) x.classList.add("on"); });
      const why = cur.r > 0.15 ? "đi lên" : cur.r < -0.15 ? "đi xuống" : "không có hướng rõ";
      $("guessRead").innerHTML = `<div class="row"><span class="kv"><b style="color:${right ? "var(--s3)" : "var(--s8)"}">${right ? "✓ Đúng!" : "✗ Chưa đúng."}</b> $r$ tính được $=${tf(cur.r, 2)}$ (gần $${tf(cur.best, 1, true)}$ nhất) — đám mây ${why}.</span><span class="kv">Điểm: <b>${score}/${played}</b> · chuỗi đúng: <b>${streak}</b></span></div>`;
      math($("guessRead"));
    });
    $("guessNext").addEventListener("click", newRound);
    newRound();
    X.responsive($("guessPlot"), () => { if (cur) draw(); });
  }

  /* ---------------- HÌNH 8.3: ĐƯỜNG THẲNG a, b ---------------- */
  if ($("lineFig")) X.responsive($("lineFig"), () => {
    const c = X.chart($("lineFig"), { height: 240, xmin: 0, xmax: 18, ymin: 0, ymax: 7 });
    c.axes({ xticks: [0, 5, 10, 15], yticks: [0, 2, 4, 6], xlabel: "X (năm)", ylabel: "Y (mm)" });
    c.curve(x => 2.5 + 0.2 * x, 0, 18, { stroke: "var(--s1)", "stroke-width": 2.6 });
    seg2(c, 5, 3.5, 10, 3.5, { stroke: "var(--s2)", "stroke-width": 2.4 });
    seg2(c, 10, 3.5, 10, 4.5, { stroke: "var(--s2)", "stroke-width": 2.4 });
    c.text(7.5, 3.5 - 0.42, "X tăng 5", { style: "fill:var(--s2);font-size:12.5px" });
    c.text(10.4, 3.9, "Y tăng 1", { "text-anchor": "start", style: "fill:var(--s2);font-size:12.5px" });
    c.dot(0, 2.5, { r: 6, fill: "var(--s3)" });
    c.text(0.5, 2.5 + 0.55, "a = 2,5", { "text-anchor": "start", class: "svg-strong", style: "fill:var(--s3)" });
    c.text(14.2, 6.3, "b = 1 : 5 = 0,2", { class: "svg-strong", style: "fill:var(--s1)" });
  });

  /* ---------------- WIDGET 2.2: BÌNH PHƯƠNG BÉ NHẤT ---------------- */
  if ($("lsWidget")) {
    let A = 3.6, B = 0.05;
    const render = () => {
      const c = X.chart($("lsPlot"), { height: 280, xmin: 0, xmax: 18, ymin: 1.5, ymax: 7.5 });
      mainAxes(c);
      c.curve(x => A + B * x, 0, 18, { stroke: "var(--s2)", "stroke-width": 2.6 });
      let sse = 0;
      MX.forEach((x, i) => {
        const yh = A + B * x, e = MY[i] - yh; sse += e * e;
        const p1 = c.y(MY[i]), p2 = c.y(yh), side = Math.abs(p1 - p2);
        if (side > 0.5) X.el("rect", { x: c.x(x), y: Math.min(p1, p2), width: side, height: side, fill: "var(--s8)", "fill-opacity": .18, stroke: "var(--s8)", "stroke-opacity": .5 }, c.g);
        seg2(c, x, MY[i], x, yh, { stroke: "var(--s8)", "stroke-width": 2 });
      });
      mainDots(c, { r: 5.5 });
      const gap = sse - M.sse, done = gap < 0.0005;
      $("lsRead").innerHTML = `<div class="row"><span class="kv">Đường đang chọn: $Y^*=${tf(A, 2, true)}+${tf(B, 3, true)}X$</span><span class="kv">$SSE=\\sum\\varepsilon_i^2=${tf(sse, 4)}$</span></div>` +
        `<div class="row"><span class="kv">${done ? `<b style="color:var(--s3)">✓ Đây chính là đường hồi quy: $SSE$ nhỏ nhất $=0{,}18$ tại $a=2{,}5$, $b=0{,}2$.</b>` : `Còn cách đáy: $SSE-0{,}18=${tf(gap, 4)}$. Thử xoay ($b$) rồi nâng hạ ($a$).`}</span></div>`;
      math($("lsRead"));
    };
    X.bind(["lsA", "lsB"], v => { A = v.lsA; B = v.lsB; render(); }, { lsA: v => X.fmt(v, 2, true), lsB: v => X.fmt(v, 3, true) });
    $("lsBest").addEventListener("click", () => {
      $("lsA").value = 2.5; $("lsB").value = 0.2;
      $("lsA").dispatchEvent(new Event("input")); $("lsB").dispatchEvent(new Event("input"));
    });
    X.responsive($("lsPlot"), render);
  }

  /* ---------------- HÌNH 8.4: SSE THEO b ---------------- */
  if ($("parabFig")) X.responsive($("parabFig"), () => {
    const F = b => 108 * b * b - 43.2 * b + 4.5;
    const c = X.chart($("parabFig"), { height: 240, xmin: -0.05, xmax: 0.45, ymin: 0, ymax: 5 });
    c.axes({ xticks: [0, 0.1, 0.2, 0.3, 0.4], yticks: [0, 1, 2, 3, 4, 5], xlabel: "hệ số góc b", ylabel: "SSE" });
    c.curve(F, -0.05, 0.45, { stroke: "var(--s1)", "stroke-width": 2.6 });
    c.vline(0.2, { stroke: "var(--s3)" }, 0, 1.2);
    c.dot(0.2, 0.18, { r: 6, fill: "var(--s3)" });
    c.text(0.2, 1.45, "đáy: b = 0,2; SSE = 0,18", { class: "svg-strong", style: "fill:var(--s3)" });
    c.dot(0, 4.5, { r: 5, fill: "var(--s2)" });
    c.text(0.012, 4.62, "b = 0: SSE = 4,5", { "text-anchor": "start", style: "fill:var(--s2);font-size:12.5px" });
    c.hover(b => `b = ${f(b, 3)}<br>SSE = ${f(F(b), 3)}`, { snap: v => Math.round(v * 200) / 200 });
  });

  /* ---------------- HÌNH 8.5: BỐN GÓC QUANH ĐIỂM TRUNG BÌNH ---------------- */
  if ($("quadFig")) X.responsive($("quadFig"), () => {
    const c = X.chart($("quadFig"), { height: 270, xmin: 0, xmax: 18, ymin: 2.5, ymax: 6.3 });
    mainAxes(c);
    c.vline(M.xb, { stroke: "var(--s7)" }, 2.5, 6.3);
    c.hline(M.yb, { stroke: "var(--s7)" });
    barTxt(c, M.xb + 0.25, 6.05, "X", " = 9", { "text-anchor": "start", style: "fill:var(--s7)" });
    barTxt(c, 17.8, M.yb + 0.12, "Y", " = 4,3", { "text-anchor": "end", style: "fill:var(--s7)" });
    c.text(14.5, 6.05, "(+)·(+) > 0", { style: "fill:var(--s3);font-size:12px" });
    c.text(3.2, 2.75, "(−)·(−) > 0", { style: "fill:var(--s3);font-size:12px" });
    c.text(3.2, 6.05, "(−)·(+) < 0", { style: "fill:var(--s8);font-size:12px" });
    c.text(14.5, 2.75, "(+)·(−) < 0", { style: "fill:var(--s8);font-size:12px" });
    /* vị trí nhãn từng điểm: [dx, dy, canh] */
    const LAB = [[0.35, 0.22, "start"], [0.35, -0.3, "start"], [0.35, 0.22, "start"], [0.35, -0.3, "start"], [-0.35, 0.22, "end"], [0.35, -0.08, "start"]];
    MX.forEach((x, i) => {
      const p = (x - M.xb) * (MY[i] - M.yb);
      c.dot(x, MY[i], { r: 6, fill: p >= 0 ? "var(--s3)" : "var(--s8)" });
      c.text(x + LAB[i][0], MY[i] + LAB[i][1], (p >= 0 ? "+" : "") + f(p, 1, true), { "text-anchor": LAB[i][2], class: "svg-strong", style: "font-size:12px" });
    });
  });

  /* ---------------- WIDGET 3.6: ĐIỂM BẤT THƯỜNG ---------------- */
  if ($("outWidget")) {
    let px = 18, py = 2;
    const render = () => {
      const R7 = reg([...MX, px], [...MY, py]);
      const c = X.chart($("outPlot"), { height: 270, xmin: 0, xmax: 30, ymin: 1, ymax: 9 });
      mainAxes(c);
      c.curve(x => M.a + M.b * x, 0, 30, { stroke: "var(--s1)", "stroke-width": 2, "stroke-dasharray": "6 5" });
      c.curve(x => R7.a + R7.b * x, 0, 30, { stroke: "var(--s8)", "stroke-width": 2.4 });
      mainDots(c, { r: 5.5 });
      c.dot(px, py, { r: 7.5, fill: "var(--s8)" });
      $("outRead").innerHTML = `<div class="row"><span class="kv">6 điểm gốc: $r=${tf(M.r, 4)}$; $Y=2{,}5+0{,}2X$</span></div>` +
        `<div class="row"><span class="kv">Thêm điểm $(${tf(px, 1, true)};\\ ${tf(py, 1, true)})$: $r=${tf(R7.r, 4)}$; $Y=${tf(R7.a, 3)}${R7.b < 0 ? "-" : "+"}${tf(Math.abs(R7.b), 4)}X$</span></div>`;
      math($("outRead"));
    };
    X.bind(["outX", "outY"], v => { px = v.outX; py = v.outY; render(); }, { outX: v => X.fmt(v, 1, true), outY: v => X.fmt(v, 1, true) });
    X.responsive($("outPlot"), render);
  }

  /* ---------------- HÌNH 8.6: TÁCH ĐỘ LỆCH ---------------- */
  if ($("splitFig")) X.responsive($("splitFig"), () => {
    const c = X.chart($("splitFig"), { height: 320, xmin: 2, xmax: 17, ymin: 2.8, ymax: 6 });
    mainAxes(c);
    c.hline(M.yb, { stroke: "var(--s7)" });
    barTxt(c, 2.3, M.yb + 0.1, "Y", " = 4,3", { "text-anchor": "start", style: "fill:var(--s7)" });
    c.curve(x => M.a + M.b * x, 2, 17, { stroke: "var(--s1)", "stroke-width": 2.4 });
    mainDots(c, { r: 5, "fill-opacity": .5 });
    arrow(c, 10, 4.3, 4.5, "var(--s2)");
    arrow(c, 10, 4.5, 4.7, "var(--s3)");
    c.dot(10, 4.7, { r: 6.5, fill: "var(--s8)" });
    seg2(c, 10.4, 4.38, 11.4, 3.75, { "stroke-width": 1, stroke: "var(--s2)" });
    c.text(11.5, 3.6, "do hồi quy 0,2", { "text-anchor": "start", class: "svg-strong", style: "fill:var(--s2);font-size:12px" });
    seg2(c, 10.4, 4.62, 11.4, 5.35, { "stroke-width": 1, stroke: "var(--s3)" });
    c.text(11.5, 5.45, "phần dư 0,2", { "text-anchor": "start", class: "svg-strong", style: "fill:var(--s3);font-size:12px" });
    c.text(9.6, 4.95, "Y = 4,7", { "text-anchor": "end", class: "svg-strong", style: "fill:var(--s8);font-size:12.5px" });
  });

  /* ---------------- WIDGET 5.4: DẢI DỰ BÁO ---------------- */
  if ($("bandWidget")) {
    let conf = 95, x0 = 14;
    const TT = { 90: 2.132, 95: 2.776, 99: 4.604 };
    const render = () => {
      const t = TT[conf], s = M.s, n = 6;
      const k = x => 1 / n + (x - M.xb) ** 2 / M.qx;
      const c = X.chart($("bandPlot"), { height: 300, xmin: 0, xmax: 25, ymin: 1, ymax: 9.5 });
      [[0, 3], [16, 25]].forEach(([a, b]) => X.el("rect", { x: c.x(a), y: c.y(9.5), width: c.x(b) - c.x(a), height: c.y(1) - c.y(9.5), fill: "var(--text-2)", "fill-opacity": .08 }, c.g));
      mainAxes(c);
      const band = (extra, fill, op) => {
        let d = "";
        for (let i = 0; i <= 100; i++) { const x = 25 * i / 100; d += (i ? "L" : "M") + c.x(x).toFixed(1) + "," + c.y(M.a + M.b * x + t * s * Math.sqrt(extra + k(x))).toFixed(1); }
        for (let i = 100; i >= 0; i--) { const x = 25 * i / 100; d += "L" + c.x(x).toFixed(1) + "," + c.y(M.a + M.b * x - t * s * Math.sqrt(extra + k(x))).toFixed(1); }
        X.el("path", { d: d + "Z", fill, "fill-opacity": op, stroke: "none" }, c.g);
      };
      band(1, "var(--s2)", .2);
      band(0, "var(--s1)", .3);
      c.curve(x => M.a + M.b * x, 0, 25, { stroke: "var(--text)", "stroke-width": 2 });
      mainDots(c, { r: 5 });
      const y0 = M.a + M.b * x0, em = t * s * Math.sqrt(k(x0)), ey = t * s * Math.sqrt(1 + k(x0));
      c.vline(x0, { stroke: "var(--s7)" }, 1, 9.5);
      seg2(c, x0, y0 - ey, x0, y0 + ey, { stroke: "var(--s2)", "stroke-width": 5, "stroke-linecap": "round", opacity: .8 });
      seg2(c, x0, y0 - em, x0, y0 + em, { stroke: "var(--s1)", "stroke-width": 5, "stroke-linecap": "round" });
      c.dot(x0, y0, { r: 5, fill: "var(--s7)" });
      const out = x0 < 3 || x0 > 16;
      const lv = conf === 90 ? "0{,}95" : conf === 95 ? "0{,}975" : "0{,}995";
      $("bandRead").innerHTML = `<div class="row"><span class="kv">$X_0=${tf(x0, 1, true)}$: $Y_0=${tf(y0, 3, true)}$; $t^{\\,4}_{${lv}}=${tf(t, 3)}$</span>${out ? '<span class="kv"><b style="color:var(--s8)">ngoại suy!</b></span>' : ""}</div>` +
        `<div class="row"><span class="kv"><b style="color:var(--s1)">$\\mu_Y$</b>: $\\varepsilon=${tf(em, 4)}$ → $(${tf(y0 - em, 3)};\\ ${tf(y0 + em, 3)})$</span><span class="kv"><b style="color:var(--s2)">$Y$</b>: $\\varepsilon=${tf(ey, 4)}$ → $(${tf(y0 - ey, 3)};\\ ${tf(y0 + ey, 3)})$</span></div>`;
      math($("bandRead"));
    };
    seg("bandConf", h => { conf = h; render(); });
    X.bind(["bandX"], v => { x0 = v.bandX; render(); }, { bandX: v => X.fmt(v, 1, true) });
    X.responsive($("bandPlot"), render);
  }

  /* ---------------- WIDGET 6.2: r TỐI THIỂU ---------------- */
  if ($("rminWidget")) {
    const NS = [...Array(29)].map((_, i) => i + 4).concat([42, 62, 122]);
    let alpha = 5, idx = 8, rr = 0.5;
    const rmin = (n, a) => { const C = tq(1 - a / 200, n - 2); return { C, r: C / Math.sqrt(n - 2 + C * C) }; };
    const render = () => {
      const c = X.chart($("rminPlot"), { height: 250, xmin: -0.8, xmax: NS.length - 0.2, ymin: 0, ymax: 1 });
      c.axes({ xticks: [0, 6, 16, 26, 31], xfmt: i => String(NS[i]), yticks: [0, 0.2, 0.4, 0.6, 0.8, 1], xlabel: "cỡ mẫu n", ylabel: "r tối thiểu" });
      const bars = c.bars(NS.map((n, i) => ({ x: i, y: rmin(n, alpha).r, fill: i === idx ? "var(--s8)" : "var(--s1)" })), { ratio: 0.75 });
      bars.forEach((b, i) => { if (i !== idx) b.setAttribute("fill-opacity", .45); });
      c.hline(rr, { stroke: "var(--s7)", "stroke-width": 2.4, "stroke-dasharray": "" });
      c.text(NS.length - 1, Math.min(0.96, rr + 0.05), "|r| = " + f(rr, 2), { "text-anchor": "end", class: "svg-strong", style: "fill:var(--s7)" });
      const n = NS[idx], m = rmin(n, alpha), T = rr * Math.sqrt(n - 2) / Math.sqrt(Math.max(1e-9, 1 - rr * rr));
      const rej = rr > m.r;
      const lv = alpha === 5 ? "0{,}975" : "0{,}995";
      $("rminRead").innerHTML = `<div class="row"><span class="kv">$n=${n}$; $C=t^{\\,${n - 2}}_{${lv}}=${tf(m.C, 3)}$; $r_{\\min}=${tf(m.r, 4)}$</span></div>` +
        `<div class="row"><span class="kv">$|r|=${tf(rr, 2)}$: $T=${rr >= 1 ? "\\infty" : tf(T, 3)}$ → <b style="color:${rej ? "var(--s8)" : "var(--s3)"}">${rej ? "bác bỏ $H_0$: có tương quan" : "chưa đủ cơ sở bác bỏ $H_0$"}</b></span></div>`;
      math($("rminRead"));
    };
    seg("rminAlpha", h => { alpha = h; render(); });
    X.bind(["rminN", "rminR"], v => { idx = v.rminN; rr = v.rminR; render(); }, { rminN: v => String(NS[v]), rminR: v => X.fmt(v, 2, true) });
    X.responsive($("rminPlot"), render);
  }

  /* ---------------- HÌNH 8.7: BIẾN ĐỔI FISHER ---------------- */
  if ($("fzFig")) X.responsive($("fzFig"), () => {
    const Z = r => 0.5 * Math.log((1 + r) / (1 - r));
    const c = X.chart($("fzFig"), { height: 260, xmin: -1, xmax: 1, ymin: -3, ymax: 3 });
    c.axes({ xticks: [-1, -0.5, 0, 0.5, 1], yticks: [-3, -2, -1, 0, 1, 2, 3], xlabel: "r", ylabel: "Z_r" });
    c.curve(x => x, -1, 1, { stroke: "var(--text-2)", "stroke-width": 1.2, "stroke-dasharray": "5 5" });
    c.curve(Z, -0.995, 0.995, { stroke: "var(--s1)", "stroke-width": 2.6 });
    [[0.6, Z(0.6)], [0.8, Z(0.8)]].forEach(([r, z]) => { c.dot(r, z, { r: 5, fill: "var(--s2)" }); c.text(r - 0.04, z + 0.25, `${f(r, 1)} → ${f(z, 4)}`, { "text-anchor": "end", style: "fill:var(--s2);font-size:12px" }); });
    c.text(-0.95, 1.1, "đường đứt: Z = r", { "text-anchor": "start", style: "font-size:12px" });
    c.hover(r => Math.abs(r) >= 0.999 ? null : `r = ${f(r, 2)}<br>Z<sub>r</sub> = ${f(Z(r), 4)}`, { snap: v => Math.max(-0.99, Math.min(0.99, Math.round(v * 100) / 100)) });
  });

  /* ---------------- WIDGET 8.3: HAI ĐƯỜNG HỒI QUY ---------------- */
  if ($("xyWidget")) {
    let r = 0.6;
    const render = () => {
      const R = rng(4242), xs = [], ys = [];
      for (let i = 0; i < 70; i++) { const x = gauss(R), e = gauss(R); xs.push(x); ys.push(r * x + Math.sqrt(Math.max(0, 1 - r * r)) * e); }
      const c = X.chart($("xyPlot"), { height: 300, xmin: -2.6, xmax: 2.6, ymin: -2.6, ymax: 2.6 });
      c.axes({ xticks: [-2, -1, 0, 1, 2], yticks: [-2, -1, 0, 1, 2], xlabel: "X (chuẩn hoá)", ylabel: "Y" });
      xs.forEach((x, i) => { if (Math.abs(x) < 2.6 && Math.abs(ys[i]) < 2.6) c.dot(x, ys[i], { r: 3.4, fill: "var(--text-2)", "fill-opacity": .45, stroke: "none" }); });
      c.curve(x => x, -2.6, 2.6, { stroke: "var(--text-2)", "stroke-width": 1, "stroke-dasharray": "4 5" });
      c.curve(x => r * x, -2.6, 2.6, { stroke: "var(--s1)", "stroke-width": 2.8 });
      if (Math.abs(r) < 1e-9) seg2(c, 0, -2.6, 0, 2.6, { stroke: "var(--s2)", "stroke-width": 2.8 });
      else { const lo = Math.max(-2.6, -2.6 * Math.abs(r)), hi = -lo; seg2(c, lo, lo / r, hi, hi / r, { stroke: "var(--s2)", "stroke-width": 2.8 }); }
      c.text(2.5, r * 2.5 + (r >= 0 ? -0.25 : 0.35), "Y theo X", { "text-anchor": "end", class: "svg-strong", style: "fill:var(--s1)" });
      const lx = r > 1e-9 ? 2.6 * r - 0.1 : r < -1e-9 ? 2.6 * r + 0.1 : 0.1;
      c.text(lx, 2.3, "X theo Y", { "text-anchor": r > 1e-9 ? "end" : "start", class: "svg-strong", style: "fill:var(--s2)" });
      $("xyRead").innerHTML = `<div class="row"><span class="kv">$Y$ theo $X$: $Y=${tf(r, 2)}X$ (hệ số góc $b=r$)</span><span class="kv">$X$ theo $Y$: $X=${tf(r, 2)}Y$ (hệ số $b'=r$; trên hình là đường dốc $\\frac1r${Math.abs(r) > 1e-9 ? "=" + tf(1 / r, 2) : "=\\infty"}$)</span></div>` +
        `<div class="row"><span class="kv">$b\\,b'=r^2=${tf(r * r, 4)}$${Math.abs(Math.abs(r) - 1) < 1e-9 ? " — hai đường trùng nhau" : ""}</span></div>`;
      math($("xyRead"));
    };
    X.bind(["xyR"], v => { r = Math.round(v.xyR * 100) / 100; render(); }, { xyR: v => X.fmt(v, 2, true) });
    X.responsive($("xyPlot"), render);
  }
});
