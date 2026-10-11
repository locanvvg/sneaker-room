/* =========================================================
   LỘC AN — TIMELINE UI FINAL v7

   Lightweight only:
   - VI/EN page chrome
   - GIỚI THIỆU / ABOUT stays top-left
   - VI/EN stays top-right
   - localized footer

   IMPORTANT:
   This file does NOT style or synchronize Timeline filter buttons.
   The two status buttons intentionally have no yellow active state.
========================================================= */
(() => {
  "use strict";

  const STYLE_ID =
    "locan-timeline-ui-final-v7";

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

  function init() {
    installStyles();
    applyChrome();

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

        applyChrome(
          button.id === "btn-en"
            ? "en"
            : "vi"
        );
      }
    );

    setTimeout(
      applyChrome,
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
