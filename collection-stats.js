/* Lộc An Sneaker Collection — statistics derived from catalog data only. */
(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const lang = params.get("lang") === "en" ? "en" : "vi";

  const text = {
    vi: {
      back: "← Quay lại Bộ sưu tập",
      kicker: "DIGITAL ARCHIVE",
      title: "Thống kê Bộ sưu tập",
      intro: "Các số liệu dưới đây được tính trực tiếp từ catalog hiện tại. Trang này không thay đổi dữ liệu, câu chuyện hoặc cách hiển thị của bất kỳ đôi giày nào.",
      total: "Tổng hiện vật",
      inCollection: "Đang trong bộ sưu tập",
      former: "Đã từng trong bộ sưu tập",
      years: "Khoảng năm phát hành",
      brands: "Theo thương hiệu",
      status: "Theo trạng thái",
      condition: "Theo tình trạng",
      editions: "Theo phân khúc",
      sizes: "Theo kích cỡ",
      decades: "Theo thập niên phát hành",
      unknown: "Khác / Chưa xác định",
      note: "Số liệu được tạo tự động từ dữ liệu website tại thời điểm mở trang.",
      footer: "Lộc An Sneaker Collection — Private Digital Archive"
    },
    en: {
      back: "← Back to Collection",
      kicker: "DIGITAL ARCHIVE",
      title: "Collection Statistics",
      intro: "The figures below are calculated directly from the current catalog. This page does not modify the metadata, stories, or display settings of any sneaker.",
      total: "Total archive",
      inCollection: "In collection",
      former: "Formerly in collection",
      years: "Release-year span",
      brands: "By brand",
      status: "By collection status",
      condition: "By condition",
      editions: "By edition",
      sizes: "By size",
      decades: "By release decade",
      unknown: "Other / Unknown",
      note: "Statistics are generated automatically from the live catalog when this page opens.",
      footer: "Lộc An Sneaker Collection — Private Digital Archive"
    }
  }[lang];

  document.documentElement.lang = lang;

  function localized(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    return String(value[lang] ?? value.vi ?? value.en ?? "");
  }

  function normalizeStatus(item) {
    const raw = String(
      item?.collectionStatus ??
      item?.status ??
      item?.ownershipStatus ??
      "own"
    ).trim().toLowerCase();

    return ["sold", "former", "formerly", "pre-owned", "preowned"].includes(raw)
      ? "former"
      : "in";
  }

  function normalizeCondition(item) {
    const value = localized(item?.condition).trim().toLowerCase();
    if (value === "deadstock") return "Deadstock";
    if (value === "used") return "Used";
    return text.unknown;
  }

  function getEdition(item) {
    const direct = String(item?.edition || "").trim();
    if (direct) return direct;

    const corpus = [
      localized(item?.title),
      localized(item?.subtitle),
      localized(item?.editionType)
    ].join(" ").toUpperCase();

    if (corpus.includes("SIGNATURE") && corpus.includes("SIGNED")) return "Signature Signed";
    if (corpus.includes("CUSTOM 1/1") || corpus.includes("CUSTOM 1 OF 1")) return "Custom 1/1";
    if (corpus.includes("F&F") || corpus.includes("FRIENDS & FAMILY")) return "F&F";
    if (/\bPE\b/.test(corpus) || corpus.includes("PLAYER EXCLUSIVE")) return "PE";
    if (corpus.includes("SAMPLE")) return "Sample";
    return "GR";
  }

  function getBrand(item) {
    const title = localized(item?.title).trim();
    const upper = title.toUpperCase();

    const rules = [
      ["NEW BALANCE", "New Balance"],
      ["BALENCIAGA", "Balenciaga"],
      ["CONVERSE", "Converse"],
      ["ADIDAS", "adidas"],
      ["VANS", "Vans"],
      ["BAPE", "BAPE"],
      ["NIKE", "Nike"],
      ["JORDAN", "Jordan"]
    ];

    for (const [needle, label] of rules) {
      if (upper.includes(needle)) return label;
    }

    return title.split(/\s+/)[0] || text.unknown;
  }

  function getReleaseYear(item) {
    const match = String(item?.releaseDate || "").match(/^(\d{4})/);
    return match ? Number(match[1]) : null;
  }

  function getSize(item) {
    const match = String(item?.size || "").match(/\d+(?:\.\d+)?/);
    return match ? `${Number(match[0])} US` : text.unknown;
  }

  function countBy(items, getter) {
    const map = new Map();
    items.forEach(item => {
      const key = getter(item) || text.unknown;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
  }

  function renderBars(targetId, entries) {
    const target = document.getElementById(targetId);
    if (!target) return;

    const max = Math.max(1, ...entries.map(([, value]) => value));
    target.innerHTML = entries.map(([label, value]) => `
      <div class="stats-bar-row">
        <div class="stats-bar-label" title="${String(label).replaceAll('"', '&quot;')}">${label}</div>
        <div class="stats-bar-track" aria-hidden="true">
          <span class="stats-bar-fill" style="width:${Math.max(4, (value / max) * 100)}%"></span>
        </div>
        <div class="stats-bar-value">${value}</div>
      </div>
    `).join("");
  }

  function render(items) {
    const total = items.length;
    const inCount = items.filter(item => normalizeStatus(item) === "in").length;
    const formerCount = total - inCount;
    const years = items.map(getReleaseYear).filter(Number.isFinite).sort((a, b) => a - b);
    const yearSpan = years.length ? `${years[0]}–${years[years.length - 1]}` : "—";

    const summary = [
      [text.total, total, true],
      [text.inCollection, inCount, false],
      [text.former, formerCount, false],
      [text.years, yearSpan, false]
    ];

    document.getElementById("stats-summary").innerHTML = summary.map(([label, value, highlight]) => `
      <article class="stats-card${highlight ? " stats-card-highlight" : ""}">
        <div class="stats-card-label">${label}</div>
        <span class="stats-card-value">${value}</span>
      </article>
    `).join("");

    renderBars("stats-brands", countBy(items, getBrand));
    renderBars("stats-status", [
      [lang === "vi" ? "Trong bộ sưu tập" : "In collection", inCount],
      [lang === "vi" ? "Đã từng trong bộ sưu tập" : "Formerly in collection", formerCount]
    ]);
    renderBars("stats-condition", countBy(items, normalizeCondition));
    renderBars("stats-editions", countBy(items, getEdition));
    renderBars("stats-sizes", countBy(items, getSize));
    renderBars(
      "stats-decades",
      countBy(
        items.filter(item => Number.isFinite(getReleaseYear(item))),
        item => `${Math.floor(getReleaseYear(item) / 10) * 10}s`
      )
    );
  }

  function initialize() {
    document.getElementById("stats-back").textContent = text.back;
    document.getElementById("stats-back").href = `./index.html?lang=${lang}`;
    document.getElementById("stats-kicker").textContent = text.kicker;
    document.getElementById("stats-title").textContent = text.title;
    document.getElementById("stats-intro-text").textContent = text.intro;
    document.getElementById("stats-note").textContent = text.note;
    document.getElementById("stats-footer-text").textContent = text.footer;

    const sectionTitles = {
      "stats-brands-title": text.brands,
      "stats-status-title": text.status,
      "stats-condition-title": text.condition,
      "stats-editions-title": text.editions,
      "stats-sizes-title": text.sizes,
      "stats-decades-title": text.decades
    };

    Object.entries(sectionTitles).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });

    document.querySelectorAll(".stats-lang a").forEach(link => {
      link.classList.toggle("active", link.dataset.lang === lang);
      link.setAttribute("aria-current", link.dataset.lang === lang ? "page" : "false");
    });

    if (typeof sneakers !== "undefined" && Array.isArray(sneakers)) {
      render(sneakers);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
