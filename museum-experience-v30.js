/* =========================================================
   LỘC AN — MUSEUM EXPERIENCE v30

   Keeps museum.js v27 as the renderer.
   Adds:
   - persistent entrance screen
   - lightweight door-opening transition
   - VI / EN entrance localization
   - Museum Home return from slideshow to entrance
========================================================= */
(() => {
  "use strict";

  const COPY = {
    vi: {
      eyebrow: "TRIỂN LÃM HIỆN TẠI",
      title: "BỘ SƯU TẬP CÁ NHÂN",
      statement:
        "Một bảo tàng số cá nhân lưu trữ sneaker qua hành trình sở hữu, nguồn gốc, thiết kế và bối cảnh văn hóa.",
      objects: "HIỆN VẬT",
      archive: "LƯU TRỮ SNEAKER KỸ THUẬT SỐ",
      enter: "VÀO TRIỂN LÃM",
      fullscreen: "VÀO TOÀN MÀN HÌNH",
      back: "TRỞ VỀ BỘ SƯU TẬP",
      museumHome: "MUSEUM HOME",
      museumHomeAria: "Trở về sảnh Museum"
    },
    en: {
      eyebrow: "CURRENT EXHIBITION",
      title: "THE PRIVATE COLLECTION",
      statement:
        "A personal digital museum documenting sneakers through ownership, provenance, design, and cultural context.",
      objects: "OBJECTS",
      archive: "PRIVATE DIGITAL SNEAKER ARCHIVE",
      enter: "ENTER EXHIBITION",
      fullscreen: "ENTER FULLSCREEN",
      back: "BACK TO COLLECTION",
      museumHome: "MUSEUM HOME",
      museumHomeAria: "Return to Museum entrance"
    }
  };

  const app = document.getElementById("museum-app");
  const launch = document.getElementById("museum-launch");
  const homeButton = document.getElementById("museum-home-fixed");

  let opening = false;

  function currentLanguage() {
    const query = new URLSearchParams(location.search).get("lang");
    if (query === "vi" || query === "en") return query;

    try {
      const stored = localStorage.getItem("locan_lang");
      if (stored === "vi" || stored === "en") return stored;
    } catch (_) {}

    return document.documentElement.lang === "en" ? "en" : "vi";
  }

  function stats() {
    const catalog =
      typeof sneakers !== "undefined" && Array.isArray(sneakers)
        ? sneakers
        : [];

    const own = catalog.filter(item => {
      if (!item) return false;

      const status =
        String(item.collectionStatus || "own")
          .trim()
          .toLowerCase();

      if (status !== "own") return false;

      // Mirrors the current Museum safety lock.
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

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  function syncLanguageButtons(lang) {
    document
      .getElementById("museum-entry-lang-vi")
      ?.classList.toggle("active", lang === "vi");

    document
      .getElementById("museum-entry-lang-en")
      ?.classList.toggle("active", lang === "en");
  }

  function applyEntranceCopy() {
    const lang = currentLanguage();
    const t = COPY[lang];
    const s = stats();

    setText("museum-entry-eyebrow", t.eyebrow);
    setText("museum-entry-title", t.title);
    setText("museum-entry-period", `${s.minYear}—${s.maxYear}`);
    setText("museum-entry-statement", t.statement);
    setText("museum-entry-object-count", `${s.count} ${t.objects}`);
    setText("museum-entry-archive-label", t.archive);
    setText("museum-entry-enter-copy", t.enter);
    setText("museum-entry-fullscreen-copy", t.fullscreen);
    setText("museum-entry-back-copy", t.back);
    setText("museum-home-fixed-copy", t.museumHome);

    syncLanguageButtons(lang);

    const back = document.getElementById("museum-entry-back");
    if (back) {
      back.href = `./index.html?lang=${encodeURIComponent(lang)}`;
    }

    if (homeButton) {
      homeButton.setAttribute("aria-label", t.museumHomeAria);
    }
  }

  function activateLanguage(lang) {
    const button =
      document.getElementById(
        lang === "en" ? "museum-lang-en" : "museum-lang-vi"
      );

    button?.click();

    window.setTimeout(applyEntranceCopy, 0);
  }

  function reducedMotion() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }

  function firstSlideReady() {
    const canvas = document.getElementById("museum-canvas");
    const title = document.getElementById("museum-title");

    if (!canvas || !title) return false;

    return (
      canvas.width > 2 &&
      canvas.height > 2 &&
      (title.textContent || "").trim() !== "" &&
      (title.textContent || "").trim() !== "LỘC AN SNEAKER COLLECTION"
    );
  }

  function waitForFirstSlide(maxMs = 3500) {
    return new Promise(resolve => {
      const start = performance.now();

      function check() {
        if (firstSlideReady()) {
          resolve();
          return;
        }

        if (performance.now() - start >= maxMs) {
          resolve();
          return;
        }

        window.setTimeout(check, 40);
      }

      check();
    });
  }

  async function enterExhibition(fullscreen) {
    if (opening || !launch) return;

    opening = true;

    /*
      museum.js starts rendering the first pair behind the entrance.
      Give it a short chance to finish before the doors fully open,
      so the reveal exposes content rather than a blank canvas.
    */
    await Promise.race([
      waitForFirstSlide(),
      new Promise(resolve => window.setTimeout(resolve, 520))
    ]);

    launch.classList.add("is-opening");

    const animationMs = reducedMotion() ? 70 : 760;

    window.setTimeout(() => {
      const bridge = document.getElementById(
        fullscreen
          ? "museum-launch-fullscreen"
          : "museum-launch-window"
      );

      app?.classList.add("museum-is-started");
      bridge?.click();

      launch.classList.remove("is-opening");
      opening = false;
    }, animationMs);
  }

  async function returnToEntrance() {
    if (!launch || opening) return;

    /*
      Pause the slideshow if it is currently running.
      The existing museum.js play button uses "Ⅱ" while playing.
    */
    const playIcon = document.getElementById("museum-play-icon");
    const playButton = document.getElementById("museum-play");

    if ((playIcon?.textContent || "").trim() === "Ⅱ") {
      playButton?.click();
    }

    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (_) {}
    }

    app?.classList.remove("controls-hidden", "museum-is-started");

    launch.hidden = false;
    launch.classList.remove("is-opening");

    applyEntranceCopy();
  }

  function installEvents() {
    document
      .getElementById("museum-entry-enter")
      ?.addEventListener("click", () => enterExhibition(false));

    document
      .getElementById("museum-entry-fullscreen")
      ?.addEventListener("click", () => enterExhibition(true));

    document
      .getElementById("museum-entry-lang-vi")
      ?.addEventListener("click", () => activateLanguage("vi"));

    document
      .getElementById("museum-entry-lang-en")
      ?.addEventListener("click", () => activateLanguage("en"));

    homeButton?.addEventListener("click", returnToEntrance);

    /*
      Keep entrance copy synchronized if the underlying Museum controls
      change the language while the exhibition is open.
    */
    ["museum-lang-vi", "museum-lang-en"].forEach(id => {
      document.getElementById(id)?.addEventListener("click", () => {
        window.setTimeout(applyEntranceCopy, 0);
      });
    });
  }

  function boot() {
    /*
      v30 always begins at the Museum entrance on a fresh page load.
      No sessionStorage auto-skip.
    */
    if (launch) {
      launch.hidden = false;
      launch.classList.remove("is-opening");
    }

    app?.classList.remove("museum-is-started");

    applyEntranceCopy();
    installEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
