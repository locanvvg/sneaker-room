/* =========================================================
   LỘC AN — HOMEPAGE STATUS LABEL FINAL v8

   Exact scope:
   - VI: BỘ SƯU TẬP
   - EN: COLLECTION
   - no custom font rule
   - label inherits the exact same .filter-group-label styling
     as TÌNH TRẠNG / PHÂN KHÚC / KÍCH CỠ
========================================================= */
(() => {
  "use strict";

  function currentLanguage() {
    if (
      document.documentElement.lang === "en"
    ) {
      return "en";
    }

    try {
      return (
        localStorage.getItem("locan_lang") === "en"
      )
        ? "en"
        : "vi";
    } catch (_) {
      return "vi";
    }
  }

  function syncLabel(forcedLanguage = null) {
    const label =
      document.getElementById(
        "collection-status-filter-label"
      );

    if (!label) {
      return;
    }

    const lang =
      forcedLanguage === "en"
        ? "en"
        : forcedLanguage === "vi"
          ? "vi"
          : currentLanguage();

    const text =
      lang === "en"
        ? "COLLECTION"
        : "BỘ SƯU TẬP";

    if (label.textContent !== text) {
      label.textContent = text;
    }

    /*
      Remove only old inline typography overrides, if a prior
      cached helper ever wrote them. The label then falls back
      to the normal .filter-group-label CSS used by the rows below.
    */
    [
      "font-family",
      "font-size",
      "font-weight",
      "font-style",
      "font-stretch",
      "line-height",
      "letter-spacing",
      "text-transform",
      "font-variant",
      "font-kerning",
      "text-rendering"
    ].forEach(property => {
      label.style.removeProperty(property);
    });
  }

  function init() {
    syncLabel();

    /*
      catalog-additions has delayed label passes.
      A few finite follow-ups keep this final label authoritative
      without any MutationObserver or continuous loop.
    */
    [0, 80, 250, 700, 1400].forEach(delay => {
      setTimeout(
        syncLabel,
        delay
      );
    });

    document.addEventListener(
      "click",
      event => {
        const button =
          event.target.closest(
            "#btn-vi, #btn-en"
          );

        if (!button) {
          return;
        }

        const lang =
          button.id === "btn-en"
            ? "en"
            : "vi";

        setTimeout(
          () => syncLabel(lang),
          0
        );

        setTimeout(
          () => syncLabel(lang),
          100
        );
      }
    );
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

  window.addEventListener(
    "load",
    syncLabel,
    { once: true }
  );
})();
