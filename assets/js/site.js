/* ==========================================================
   site.js — phần dùng chung cho mọi trang
   - Danh sách bài học (thêm bài mới: thêm 1 dòng vào LESSONS)
   - Đổi giao diện sáng/tối, mục lục tự động, thanh tiến độ
   - Gọi KaTeX để hiển thị công thức
   ========================================================== */

/* Muốn thêm Bài 3, Bài 4…: tạo file bai-3.html (copy từ bai-2.html),
   rồi thêm một dòng vào mảng này. Trang chủ và nút chuyển bài tự cập nhật. */
const LESSONS = [
  {
    id: "bai-1", href: "bai-1.html", no: "Bài 1", title: "Xác suất",
    desc: "Xác suất có điều kiện, công thức nhân – cộng, xác suất toàn phần, Bayes, độ nhạy – độ đặc hiệu – giá trị tiên đoán, công thức Bernoulli.",
    chips: ["De Morgan", "Bayes", "Xét nghiệm", "Bernoulli"]
  },
  {
    id: "bai-2", href: "bai-2.html", no: "Bài 2", title: "Phân phối xác suất của biến ngẫu nhiên",
    desc: "Biến ngẫu nhiên rời rạc – liên tục, tích phân từ con số 0, kỳ vọng – phương sai, nhị thức, chuẩn, chuẩn tắc, χ², Student, Fisher, cách tra bảng.",
    chips: ["Tích phân", "E(X), D(X)", "Phân phối chuẩn", "Tra bảng"]
  },
  {
    id: "bai-3", href: "bai-3.html", no: "Bài 3", title: "Thống kê mô tả và phân bố của các tham số trên mẫu",
    desc: "Tổng thể – mẫu, thang đo, cách chọn mẫu, bảng tần số, phân lớp, biểu đồ, trung bình – trung vị – mod, tứ phân vị, phương sai mẫu, phân phối của trung bình mẫu và tỉ lệ mẫu.",
    chips: ["Thang đo", "Chọn mẫu", "x̄, s, Mₑ", "σ/√n"]
  },
  {
    id: "bai-4", href: "bai-4.html", no: "Bài 4", title: "Ước lượng tham số tổng thể",
    desc: "Ước lượng điểm và khoảng tin cậy cho trung bình, tỉ lệ, phương sai; cỡ mẫu tối thiểu; bài toán ngược; hiệu hai trung bình, hiệu hai tỉ lệ.",
    chips: ["z, t, χ²", "Khoảng tin cậy", "Cỡ mẫu", "Hai nhóm"]
  },
  {
    id: "bai-5", href: "bai-5.html", no: "Bài 5", title: "Kiểm định giả thuyết thống kê",
    desc: "Logic kiểm định, hai loại sai lầm, miền bác bỏ, p-value; kiểm định trung bình, tỉ lệ, phương sai một mẫu; so sánh hai phương sai, hai trung bình (độc lập, ghép cặp), hai tỉ lệ; bài toán ngược.",
    chips: ["H₀ và H", "z, t, χ², F", "p-value", "Hai nhóm"]
  },
  {
    id: "bai-6", href: "bai-6.html", no: "Bài 6", title: "Phép kiểm phi tham số",
    desc: "Phép kiểm χ²: tính độc lập, so sánh nhiều tỉ lệ, sự phù hợp; xếp hạng; Wilcoxon dấu và hạng (một mẫu, ghép cặp), tổng hạng (hai mẫu); Kruskal–Wallis cho nhiều nhóm.",
    chips: ["χ² độc lập", "Phù hợp", "Wilcoxon", "Kruskal–Wallis"]
  },
  {
    id: "bai-7", href: "bai-7.html", no: "Bài 7", title: "Phân tích phương sai (ANOVA)",
    desc: "So sánh nhiều trung bình cùng lúc: chia độ biến thiên SS = SSB + SSW, phép kiểm F và bảng ANOVA; số liệu thô và số liệu tóm tắt, bài toán ngược, nối với phép kiểm T và Kruskal–Wallis, ANOVA hai yếu tố.",
    chips: ["SSB, SSW", "Phép kiểm F", "Bảng ANOVA", "Hai yếu tố"]
  },
  {
    id: "bai-8", href: "bai-8.html", no: "Bài 8", title: "Hồi quy và tương quan",
    desc: "Hai số đo trên cùng một người: đường hồi quy Y = a + bX bằng bình phương bé nhất, hệ số tương quan r, phương sai hồi quy, khoảng dự báo cho Y và μY, kiểm định ρ = 0 và ρ = ρ0 (Fisher), so sánh phương trình hồi quy, đổi biến, hồi quy X theo Y.",
    chips: ["Y = a + bX", "Hệ số r", "Khoảng dự báo", "Kiểm định ρ"]
  }
];

/* Trang phụ (không phải bài học): hiện ở thanh điều hướng, sau các bài. */
const EXTRA_PAGES = [
  { id: "phu-luc", href: "phu-luc.html", no: "Bảng phụ lục" },
  { id: "may-tinh", href: "may-tinh.html", no: "Bấm máy" }
];

/* Các bài sắp học (hiện mờ trên trang chủ). Khi làm xong bài nào thì chuyển nó lên LESSONS. */
const COMING = [];

(function () {
  const root = document.documentElement;

  /* ---------- giao diện sáng / tối ---------- */
  function currentTheme() {
    const t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("xstk-theme", t); } catch (e) { /* bỏ qua */ }
    const b = document.getElementById("themeBtn");
    if (b) b.textContent = t === "dark" ? "☀" : "☾";
    document.dispatchEvent(new CustomEvent("themechange"));
  }

  /* ---------- tạo slug cho tiêu đề ---------- */
  function slug(s) {
    return s.toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
      .slice(0, 60);
  }

  function buildTopnav() {
    const nav = document.getElementById("topnav");
    if (!nav) return;
    const cur = document.body.dataset.lesson;
    nav.innerHTML = [...LESSONS, ...EXTRA_PAGES].map(l =>
      `<a href="${l.href}" class="${l.id === cur ? "active" : ""}">${l.no}</a>`).join("");
  }

  function buildPager() {
    const el = document.getElementById("pager");
    if (!el) return;
    const cur = document.body.dataset.lesson;
    const i = LESSONS.findIndex(l => l.id === cur);
    if (i < 0) return;
    const prev = LESSONS[i - 1], next = LESSONS[i + 1];
    let h = "";
    h += prev
      ? `<a class="prev" href="${prev.href}"><div class="dir">← Bài trước</div><div class="ttl">${prev.no}. ${prev.title}</div></a>`
      : `<a class="prev" href="index.html"><div class="dir">← Về</div><div class="ttl">Trang chủ</div></a>`;
    if (next) h += `<a class="next" href="${next.href}"><div class="dir">Bài tiếp →</div><div class="ttl">${next.no}. ${next.title}</div></a>`;
    el.innerHTML = h;
  }

  function buildHome() {
    const el = document.getElementById("lessonList");
    if (!el) return;
    let h = LESSONS.map(l => `
      <a class="lesson-card" href="${l.href}">
        <span class="go">→</span>
        <span class="no">${l.no}</span>
        <h3>${l.title}</h3>
        <p>${l.desc}</p>
        <div class="chips">${(l.chips || []).map(c => `<span class="chip">${c}</span>`).join("")}</div>
      </a>`).join("");
    h += COMING.map(c => `
      <div class="lesson-card soon" aria-disabled="true">
        <span class="no">${c.no} · sắp có</span>
        <h3>${c.title}</h3>
      </div>`).join("");
    el.innerHTML = h;
  }

  /* ---------- mục lục tự động ---------- */
  function buildToc() {
    const toc = document.getElementById("tocList");
    const content = document.querySelector(".content");
    if (!toc || !content) return [];
    const heads = [...content.querySelectorAll("h2, h3")].filter(h => !h.closest(".ex, .box, .widget, details"));
    const used = new Set();
    toc.innerHTML = heads.map(h => {
      if (!h.id) {
        let s = slug(h.textContent) || "muc";
        while (used.has(s)) s += "-x";
        h.id = s;
      }
      used.add(h.id);
      const label = h.dataset.toc || h.textContent.trim();
      return `<li class="${h.tagName === "H3" ? "lv3" : "lv2"}"><a href="#${h.id}">${label}</a></li>`;
    }).join("");
    toc.addEventListener("click", e => {
      if (e.target.closest("a")) setToc(false);
    });
    return heads;
  }

  /* ---------- mở / đóng mục lục (điện thoại, máy tính bảng) ---------- */
  function setToc(open) {
    document.body.classList.toggle("toc-open", open);
    const b = document.getElementById("tocBtn");
    if (b) b.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) revealActive(true);
  }
  /* cuộn khung mục lục sao cho mục đang đọc nằm trong tầm nhìn */
  function revealActive(force) {
    const nav = document.querySelector(".toc");
    const a = nav && nav.querySelector("a.active");
    if (!a) return;
    const top = a.offsetTop, h = nav.clientHeight;
    if (force || top < nav.scrollTop + 40 || top > nav.scrollTop + h - 60) {
      nav.scrollTop = Math.max(0, top - h / 3);
    }
  }

  function scrollSpy(heads) {
    const links = new Map();
    document.querySelectorAll("#tocList a").forEach(a => links.set(a.getAttribute("href").slice(1), a));
    const bar = document.getElementById("progress");
    let ticking = false, last;
    function update() {
      ticking = false;
      const y = window.scrollY + 120;
      let cur = null;
      for (const h of heads) { if (h.offsetTop <= y) cur = h; else break; }
      const next = cur ? links.get(cur.id) : null;
      if (next !== last) {
        links.forEach(a => a.classList.remove("active"));
        if (next) next.classList.add("active");
        last = next;
        revealActive(false);
      }
      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? Math.min(100, window.scrollY / max * 100) : 0) + "%";
      }
    }
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- KaTeX ---------- */
  function renderMath(el) {
    if (window.renderMathInElement) {
      window.renderMathInElement(el || document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "\\[", right: "\\]", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false }
        ],
        ignoredClasses: ["no-math"],
        throwOnError: false
      });
    }
  }
  window.renderMath = renderMath;

  /* ---------- Câu hỏi chấm ngay (.qc) ----------
     Trắc nghiệm: <div class="qc" data-ans="b"> … <div class="qc-opts"><button data-k="a">…</button>…</div>
                  <div class="qc-fb" data-k="a">giải thích khi chọn a</div> …
     Điền số:     <div class="qc" data-num="0,098" data-tol="0,0005"> … <div class="qc-num"><input><button class="qc-check">Kiểm tra</button></div>
                  <div class="qc-fb" data-k="ok">…</div><div class="qc-fb" data-k="no">…</div>          */
  const num = s => parseFloat(String(s).trim().replace(/\s/g, "").replace(",", "."));
  function initQuiz(root) {
    root.querySelectorAll(".qc").forEach(q => {
      if (q.dataset.ready) return;
      q.dataset.ready = "1";
      const show = k => {
        q.querySelectorAll(".qc-fb").forEach(fb => fb.classList.toggle("show", fb.dataset.k === k));
      };
      q.querySelectorAll(".qc-opts button").forEach(b => {
        b.type = "button";
        b.addEventListener("click", () => {
          if (q.classList.contains("solved")) return;
          const ok = b.dataset.k === q.dataset.ans;
          b.classList.add(ok ? "right" : "wrong");
          show(b.dataset.k);
          if (ok) {
            q.classList.add("solved");
            q.querySelectorAll(".qc-opts button").forEach(o => { o.disabled = o !== b; });
          }
        });
      });
      const inp = q.querySelector(".qc-num input"), chk = q.querySelector(".qc-check");
      if (inp && chk) {
        const check = () => {
          if (q.classList.contains("solved")) return;
          const v = num(inp.value);
          if (isNaN(v)) { inp.focus(); return; }
          const ok = Math.abs(v - num(q.dataset.num)) <= num(q.dataset.tol || "0.0005") + 1e-12;
          inp.classList.toggle("right", ok); inp.classList.toggle("wrong", !ok);
          show(ok ? "ok" : "no");
          if (ok) { q.classList.add("solved"); inp.readOnly = true; chk.disabled = true; }
        };
        chk.type = "button";
        chk.addEventListener("click", check);
        inp.addEventListener("keydown", e => { if (e.key === "Enter") check(); });
      }
    });
  }
  window.initQuiz = initQuiz;

  document.addEventListener("DOMContentLoaded", () => {
    const b = document.getElementById("themeBtn");
    if (b) {
      b.textContent = currentTheme() === "dark" ? "☀" : "☾";
      b.addEventListener("click", () => setTheme(currentTheme() === "dark" ? "light" : "dark"));
    }
    const tb = document.getElementById("tocBtn");
    if (tb) {
      tb.addEventListener("click", () => setToc(!document.body.classList.contains("toc-open")));
      /* chạm ra ngoài mục lục (vào nền mờ) hoặc nhấn Esc thì đóng */
      document.addEventListener("click", e => {
        if (document.body.classList.contains("toc-open") && !e.target.closest(".toc, #tocBtn")) setToc(false);
      });
      document.addEventListener("keydown", e => { if (e.key === "Escape") setToc(false); });
    }

    buildTopnav();
    buildPager();
    buildHome();
    const heads = buildToc();          /* lấy chữ tiêu đề trước khi KaTeX đổi công thức */
    renderMath(document.body);
    initQuiz(document.body);
    if (heads.length) scrollSpy(heads);
    document.dispatchEvent(new CustomEvent("siteready"));

    /* In ra giấy: mở hết lời giải */
    window.addEventListener("beforeprint", () => document.querySelectorAll("details").forEach(d => d.setAttribute("open", "")));
  });
})();
