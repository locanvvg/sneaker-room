/* =========================================================
   LỘC AN — TIMELINE UI FINAL v6

   Lightweight final authority.
   No MutationObserver.
   No repeated animation-frame synchronization.

   Exact scope:
   - active yellow Timeline tab follows the selected filter
   - Timeline VI/EN chrome matches homepage
   - GIỚI THIỆU / ABOUT stays top-left
   - footer is localized
========================================================= */
(() => {
  "use strict";

  const STYLE_ID =
    "locan-timeline-ui-final-v6";

  const COPY = {
    vi: {
      about: "GIỚI THIỆU",
      mainTitle:
        "BỘ SƯU TẬP GIÀY LỘC AN",
      subtitle:
        "Không gian lưu trữ & Bảo tàng Giày Kỹ thuật số",
      sneakers: "GIÀY",
      lego: "LEGO",
      mask: "MẶT NẠ GIÀY",
      footer:
        "© 2026 Bộ sưu tập giày Lộc An. Bảo lưu mọi quyền."
    },

    en: {
      about: "ABOUT",
      mainTitle:
        "LỘC AN SNEAKER COLLECTION",
      subtitle:
        "Digital Sneaker Archive & Museum",
      sneakers: "SNEAKERS",
      lego: "LEGO",
      mask: "SNEAKER MASK",
      footer:
        "© 2026 Lộc An Sneaker Collection. All Rights Reserved."
    }
  };

  function installStyles() {
    if (
      document.getElementById(STYLE_ID)
    ) {
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      STYLE_ID;

    style.textContent = `
      .timeline-site-header {
        position: relative !important;
      }

      .timeline-site-header
      > .about-corner-link {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: auto !important;
        margin: 0 !important;
        z-index: 40 !important;
      }

      .timeline-site-header
      > .header-corner-tools {
        right: 0 !important;
        left: auto !important;
        justify-content: flex-end !important;
      }

      .timeline-filter[data-final-active="true"] {
        background: #ffcc00 !important;
        border-color: #ffcc00 !important;
        color: #050505 !important;
      }

      .timeline-filter[data-final-active="false"] {
        background: #171719 !important;
        border-color: #343438 !important;
        color: #a7a7af !important;
      }
    `;

    document.head.appendChild(style);
  }

  function language(
    forced = null
  ) {
    if (
      forced === "vi" ||
      forced === "en"
    ) {
      return forced;
    }

    const query =
      new URLSearchParams(
        window.location.search
      ).get("lang");

    if (
      query === "vi" ||
      query === "en"
    ) {
      return query;
    }

    try {
      return (
        localStorage.getItem(
          "locan_lang"
        ) === "en"
      )
        ? "en"
        : "vi";
    } catch (_) {
      return "vi";
    }
  }

  function setText(id, value) {
    const element =
      document.getElementById(id);

    if (
      element &&
      element.textContent !== value
    ) {
      element.textContent =
        value;
    }
  }

  function applyChrome(
    forcedLanguage = null
  ) {
    const lang =
      language(forcedLanguage);

    const copy =
      COPY[lang];

    document.documentElement.lang =
      lang;

    setText(
      "timeline-about-link",
      copy.about
    );

    setText(
      "timeline-main-title",
      copy.mainTitle
    );

    setText(
      "timeline-brand-subtitle",
      copy.subtitle
    );

    setText(
      "timeline-nav-sneakers",
      copy.sneakers
    );

    setText(
      "timeline-nav-lego",
      copy.lego
    );

    setText(
      "timeline-nav-mask",
      copy.mask
    );

    setText(
      "timeline-footer-copy",
      copy.footer
    );
  }

  function applyFilterVisual(value) {
    const selected =
      value === "sold"
        ? "sold"
        : "own";

    document
      .querySelectorAll(
        "[data-timeline-filter]"
      )
      .forEach(button => {
        const active =
          button.dataset
            .timelineFilter ===
          selected;

        const state =
          active
            ? "true"
            : "false";

        if (
          button.dataset.finalActive !==
          state
        ) {
          button.dataset.finalActive =
            state;
        }

        if (
          button.getAttribute(
            "aria-pressed"
          ) !== state
        ) {
          button.setAttribute(
            "aria-pressed",
            state
          );
        }

        button.classList.toggle(
          "active",
          active
        );
      });
  }

  function currentFilter() {
    const pressed =
      document.querySelector(
        '[data-timeline-filter][aria-pressed="true"]'
      );

    return (
      pressed?.dataset
        .timelineFilter === "sold"
    )
      ? "sold"
      : "own";
  }

  window.setTimelineVisualState =
    applyFilterVisual;

  function installEvents() {
    /*
      timeline.js handles the real data/filter first on the button.
      This document-level bubble listener then applies only the final
      visual state once.
    */
    document.addEventListener(
      "click",
      event => {
        const filterButton =
          event.target.closest(
            "[data-timeline-filter]"
          );

        if (filterButton) {
          const selected =
            filterButton.dataset
              .timelineFilter;

          if (
            selected === "own" ||
            selected === "sold"
          ) {
            applyFilterVisual(
              selected
            );
          }
        }

        const languageButton =
          event.target.closest(
            "#btn-vi, #btn-en"
          );

        if (languageButton) {
          applyChrome(
            languageButton.id ===
              "btn-en"
              ? "en"
              : "vi"
          );
        }
      },
      false
    );
  }

  function init() {
    installStyles();
    applyChrome();
    applyFilterVisual(
      currentFilter()
    );
    installEvents();

    /*
      One delayed pass only, to follow the existing timeline.js
      initialization without running a continuous observer.
    */
    setTimeout(
      () => {
        applyChrome();
        applyFilterVisual(
          currentFilter()
        );
      },
      120
    );
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();
