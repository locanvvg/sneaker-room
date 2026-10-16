/* =========================================================
   LỘC AN — MUSEUM DIRECT MODE v29

   Purpose
   -------
   - No entrance / foyer screen.
   - Do NOT compete with the first sneaker image load.
   - Start Museum only after the first slide is actually rendered.
   - Keep an always-visible Back to Collection link.
   - Preserve existing museum.js renderer and slideshow behavior.
========================================================= */
(() => {
  "use strict";

  const OLD_FOYER_KEY = "locan_museum_foyer_entered_v28";
  const DEFAULT_TITLE = "LỘC AN SNEAKER COLLECTION";

  function currentLanguage() {
    const query = new URLSearchParams(location.search).get("lang");
    if (query === "vi" || query === "en") return query;

    try {
      const stored = localStorage.getItem("locan_lang");
      if (stored === "vi" || stored === "en") return stored;
    } catch (_) {}

    return document.documentElement.lang === "en" ? "en" : "vi";
  }

  function syncBackControl() {
    const lang = currentLanguage();
    const link = document.getElementById("museum-back-fixed");
    const copy = document.getElementById("museum-back-fixed-copy");

    if (copy) {
      copy.textContent = lang === "en" ? "COLLECTION" : "BỘ SƯU TẬP";
    }

    if (link) {
      link.href = `./index.html?lang=${encodeURIComponent(lang)}`;
      link.setAttribute(
        "aria-label",
        lang === "en" ? "Back to collection" : "Trở về bộ sưu tập"
      );
    }
  }

  function firstSlideIsRendered() {
    const canvas = document.getElementById("museum-canvas");
    const title = document.getElementById("museum-title");

    if (!canvas || !title) return false;

    const hasCanvas =
      canvas.width > 2 &&
      canvas.height > 2;

    const text = (title.textContent || "").trim();
    const hasRealTitle =
      text.length > 0 &&
      text !== DEFAULT_TITLE;

    return hasCanvas && hasRealTitle;
  }

  function enterDirectModeWhenReady() {
    const launch = document.getElementById("museum-launch");
    const startButton = document.getElementById("museum-launch-window");

    // Absolutely no launch/entrance overlay is allowed to become visible.
    if (launch) launch.hidden = true;

    let finished = false;
    const startedAt = performance.now();

    function tryStart() {
      if (finished) return;

      /*
        Wait for museum.js to finish the FIRST render before invoking its
        normal start handler. This avoids preloading adjacent images while
        the first sneaker is still decoding/alpha-measuring.
      */
      if (firstSlideIsRendered()) {
        finished = true;
        startButton?.click();
        return;
      }

      /*
        Safety fallback: if a pair image fails completely, do not trap the
        user in an unstarted Museum forever. The existing renderer handles
        its own image failure state.
      */
      if (performance.now() - startedAt > 8000) {
        finished = true;
        startButton?.click();
        return;
      }

      window.setTimeout(tryStart, 50);
    }

    tryStart();
  }

  function installLanguageSync() {
    ["museum-lang-vi", "museum-lang-en"].forEach(id => {
      document.getElementById(id)?.addEventListener("click", () => {
        window.setTimeout(syncBackControl, 0);
      });
    });
  }

  function boot() {
    // Remove stale v28 session state; v29 never uses a foyer.
    try {
      sessionStorage.removeItem(OLD_FOYER_KEY);
    } catch (_) {}

    syncBackControl();
    installLanguageSync();
    enterDirectModeWhenReady();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
