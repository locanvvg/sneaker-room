/* =========================================================
   LỘC AN — MUSEUM ENTRANCE / FOYER v28

   - Reuses the existing #museum-launch overlay.
   - Leaves museum.js and the sneaker renderer untouched.
   - Keeps full VI/EN localization.
   - Remembers entry for the current browser tab/session.
   - Add ?entrance=1 to museum.html to force the foyer to show.
========================================================= */
(() => {
  "use strict";

  const SESSION_KEY = "locan_museum_foyer_entered_v28";

  const COPY = {
    vi: {
      eyebrow: "TRIỂN LÃM HIỆN TẠI",
      title: "BỘ SƯU TẬP CÁ NHÂN",
      statement:
        "Một bảo tàng số cá nhân lưu trữ sneaker qua hành trình sở hữu, nguồn gốc, thiết kế và bối cảnh văn hóa.",
      objects: "HIỆN VẬT",
      collection: "BỘ SƯU TẬP CÁ NHÂN",
      enter: "VÀO BẢO TÀNG",
      fullscreen: "VÀO TOÀN MÀN HÌNH",
      home: "TRỞ VỀ BỘ SƯU TẬP",
      notice: "PRIVATE COLLECTION — NOT FOR SALE"
    },
    en: {
      eyebrow: "CURRENT EXHIBITION",
      title: "THE PRIVATE COLLECTION",
      statement:
        "A personal digital museum documenting sneakers through ownership, provenance, design, and cultural context.",
      objects: "OBJECTS",
      collection: "PRIVATE COLLECTION",
      enter: "ENTER MUSEUM",
      fullscreen: "ENTER FULLSCREEN",
      home: "BACK TO COLLECTION",
      notice: "PRIVATE COLLECTION — NOT FOR SALE"
    }
  };

  function currentLanguage() {
    const query = new URLSearchParams(location.search).get("lang");
    if (query === "vi" || query === "en") return query;

    try {
      const stored = localStorage.getItem("locan_lang");
      if (stored === "vi" || stored === "en") return stored;
    } catch (_) {}

    return document.documentElement.lang === "en" ? "en" : "vi";
  }

  function collectionStats() {
    const catalog =
      typeof sneakers !== "undefined" && Array.isArray(sneakers)
        ? sneakers
        : [];

    const own = catalog.filter(item => {
      if (!item) return false;
      if (String(item.collectionStatus || "own").trim().toLowerCase() !== "own") {
        return false;
      }

      // Mirrors the existing Museum safety lock.
      if (String(item.id || "") === "balenciaga-defender-beige") {
        return false;
      }

      return true;
    });

    const years = own
      .map(item => String(item.releaseDate || "").match(/\b(19|20)\d{2}\b/)?.[0])
      .filter(Boolean)
      .map(Number)
      .filter(Number.isFinite);

    return {
      count: own.length,
      minYear: years.length ? Math.min(...years) : 1999,
      maxYear: years.length ? Math.max(...years) : 2026
    };
  }

  function buildFoyer() {
    const card = document.querySelector("#museum-launch .museum-launch-card");
    if (!card || card.dataset.foyerReady === "1") return;

    card.dataset.foyerReady = "1";

    card.innerHTML = `
      <div class="museum-launch-kicker">LỘC AN SNEAKER COLLECTION</div>
      <div class="museum-foyer-rule" aria-hidden="true"></div>

      <div class="museum-foyer-eyebrow" id="museum-foyer-eyebrow"></div>
      <h2 id="museum-launch-title"></h2>
      <div class="museum-foyer-period" id="museum-foyer-period"></div>

      <p id="museum-launch-text"></p>

      <div class="museum-foyer-meta" aria-label="Exhibition information">
        <span id="museum-foyer-count"></span>
        <span class="museum-foyer-meta-dot" aria-hidden="true">•</span>
        <span id="museum-foyer-collection"></span>
      </div>

      <div class="museum-launch-actions">
        <button type="button" class="museum-launch-primary" id="museum-launch-window">
          <span id="museum-launch-window-copy"></span>
        </button>

        <button type="button" class="museum-launch-secondary" id="museum-launch-fullscreen">
          <span aria-hidden="true">⛶</span>
          <span id="museum-launch-fullscreen-copy"></span>
        </button>

        <a class="museum-launch-secondary museum-launch-home" id="museum-launch-home" href="./index.html">
          <span aria-hidden="true">←</span>
          <span id="museum-launch-home-copy"></span>
        </a>
      </div>

      <div class="museum-foyer-notice" id="museum-foyer-notice"></div>
    `;

    ["museum-launch-window", "museum-launch-fullscreen"].forEach(id => {
      document.getElementById(id)?.addEventListener("click", () => {
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch (_) {}
      });
    });

    applyCopy();
  }

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  function applyCopy() {
    const lang = currentLanguage();
    const t = COPY[lang];
    const stats = collectionStats();

    setText("museum-foyer-eyebrow", t.eyebrow);
    setText("museum-launch-title", t.title);
    setText("museum-foyer-period", `${stats.minYear}—${stats.maxYear}`);
    setText("museum-launch-text", t.statement);
    setText("museum-foyer-count", `${stats.count} ${t.objects}`);
    setText("museum-foyer-collection", t.collection);
    setText("museum-launch-window-copy", t.enter);
    setText("museum-launch-fullscreen-copy", t.fullscreen);
    setText("museum-launch-home-copy", t.home);
    setText("museum-foyer-notice", t.notice);

    const home = document.getElementById("museum-launch-home");
    if (home) {
      home.href = `./index.html?lang=${encodeURIComponent(lang)}`;
    }
  }

  function shouldAutoEnter() {
    const params = new URLSearchParams(location.search);

    // Useful when testing the entrance after already entering once.
    if (params.get("entrance") === "1") return false;

    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch (_) {
      return false;
    }
  }

  function boot() {
    buildFoyer();

    /*
      museum.js owns the language buttons. Watch its <html lang> update
      and restore the foyer-specific wording after its generic launch copy.
    */
    const observer = new MutationObserver(() => {
      requestAnimationFrame(applyCopy);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"]
    });

    /*
      museum.js installs its click handlers during DOMContentLoaded.
      Two animation frames guarantee those handlers are ready before
      an automatic same-session re-entry is triggered.
    */
    requestAnimationFrame(() => {
      applyCopy();

      if (shouldAutoEnter()) {
        requestAnimationFrame(() => {
          document.getElementById("museum-launch-window")?.click();
        });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
