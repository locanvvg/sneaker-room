/* =========================================================
   LỘC AN — HOMEPAGE STATUS LABEL CLEAN FINAL v9

   Goal
   ----
   Make this label use EXACTLY the same typography rule as:
   - TÌNH TRẠNG
   - PHÂN KHÚC
   - KÍCH CỠ

   No custom font is applied here.
   The label simply uses the site's native .filter-group-label class.
========================================================= */
(() => {
  "use strict";

  function language(forced = null) {
    if (forced === "vi" || forced === "en") {
      return forced;
    }

    if (document.documentElement.lang === "en") {
      return "en";
    }

    try {
      return localStorage.getItem("locan_lang") === "en"
        ? "en"
        : "vi";
    } catch (_) {
      return "vi";
    }
  }

  function apply(forcedLanguage = null) {
    const label =
      document.getElementById(
        "collection-status-filter-label"
      );

    if (!label) {
      return;
    }

    /*
      Keep the exact same class used by the approved labels below.
    */
    label.className =
      "filter-group-label";

    /*
      Remove every typography property that an older runtime patch
      may have written inline. After this, style.css owns the font.
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
      "text-rendering",
      "-webkit-font-smoothing"
    ].forEach(property => {
      label.style.removeProperty(property);
    });

    label.textContent =
      language(forcedLanguage) === "en"
        ? "COLLECTION"
        : "BỘ SƯU TẬP";
  }

  function install() {
    /*
      catalog-additions has a few finite delayed wording passes.
      Run after them, but do NOT use MutationObserver.
    */
    [0, 100, 300, 800, 1300, 1700].forEach(delay => {
      setTimeout(apply, delay);
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

        setTimeout(() => apply(lang), 0);
        setTimeout(() => apply(lang), 150);
      }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      install,
      { once: true }
    );
  } else {
    install();
  }

  window.addEventListener(
    "load",
    apply,
    { once: true }
  );
})();
