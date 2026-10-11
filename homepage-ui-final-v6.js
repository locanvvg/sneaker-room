/* =========================================================
   LỘC AN — HOMEPAGE UI FINAL v6

   Lightweight replacement for v5.
   No MutationObserver.

   Exact scope:
   Make "TRẠNG THÁI BỘ SƯU TẬP" use the exact rendered
   typography of the approved "TÌNH TRẠNG" label.
========================================================= */
(() => {
  "use strict";

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
      window.getComputedStyle(reference);

    const properties = [
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
    ];

    properties.forEach(property => {
      const value =
        style.getPropertyValue(property);

      if (
        value &&
        target.style.getPropertyValue(property) !== value
      ) {
        target.style.setProperty(
          property,
          value,
          "important"
        );
      }
    });
  }

  function schedulePasses() {
    [0, 80, 250, 700, 1400]
      .forEach(delay => {
        setTimeout(
          syncStatusHeadingTypography,
          delay
        );
      });
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      schedulePasses,
      { once: true }
    );
  } else {
    schedulePasses();
  }

  window.addEventListener(
    "load",
    syncStatusHeadingTypography,
    { once: true }
  );

  document.addEventListener(
    "click",
    event => {
      if (
        event.target.closest(
          "#btn-vi, #btn-en, .lang-btn"
        )
      ) {
        setTimeout(
          syncStatusHeadingTypography,
          0
        );
      }
    }
  );
})();
