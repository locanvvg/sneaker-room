/* =========================================================
   LỘC AN — HOMEPAGE UI FINAL v5

   EXACT SCOPE:
   Make "TRẠNG THÁI BỘ SƯU TẬP" use the exact same
   typography as the approved "TÌNH TRẠNG" label below it.

   Nothing else is changed.
========================================================= */
(() => {
  "use strict";

  let scheduled = false;

  function syncStatusHeadingTypography() {
    const target =
      document.getElementById(
        "collection-status-filter-label"
      );

    const reference =
      document.getElementById(
        "condition-filter-label"
      );

    if (!target || !reference) {
      return;
    }

    const style =
      window.getComputedStyle(
        reference
      );

    /*
      Copy the ACTUAL rendered typography from the good label.
      This avoids guessing a font family/weight and guarantees
      both labels use the same browser-resolved font.
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
      const value =
        style.getPropertyValue(
          property
        );

      if (value) {
        target.style.setProperty(
          property,
          value,
          "important"
        );
      }
    });

    target.dataset
      .typographySynced =
        "condition-label";
  }

  function scheduleSync() {
    if (scheduled) {
      return;
    }

    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      syncStatusHeadingTypography();
    });
  }

  function install() {
    syncStatusHeadingTypography();

    const panel =
      document.querySelector(
        ".filter-panel"
      );

    if (panel) {
      const observer =
        new MutationObserver(
          scheduleSync
        );

      observer.observe(
        panel,
        {
          childList: true,
          subtree: true,
          characterData: true
        }
      );
    }

    [
      0,
      50,
      150,
      400,
      900,
      1500
    ].forEach(delay => {
      setTimeout(
        syncStatusHeadingTypography,
        delay
      );
    });
  }

  if (
    document.readyState ===
    "loading"
  ) {
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
    syncStatusHeadingTypography,
    { once: true }
  );
})();
