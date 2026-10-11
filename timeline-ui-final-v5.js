/* =========================================================
   LỘC AN — TIMELINE UI FINAL v5

   EXACT SCOPE
   -----------
   1) Timeline filter yellow state always follows the selected tab.
   2) Timeline page chrome follows the same VI/EN wording as homepage.
   3) GIỚI THIỆU stays top-left; VI/EN controls stay top-right.
   4) Footer copyright is localized.

   Timeline data/range/card rendering is NOT changed.
========================================================= */
(() => {
  "use strict";

  const STYLE_ID =
    "locan-timeline-ui-final-v5";

  const VI = {
    about: "GIỚI THIỆU",
    mainTitle: "BỘ SƯU TẬP GIÀY LỘC AN",
    subtitle:
      "Không gian lưu trữ & Bảo tàng Giày Kỹ thuật số",
    sneakers: "GIÀY",
    lego: "LEGO",
    mask: "MẶT NẠ GIÀY",
    footer:
      "© 2026 Bộ sưu tập giày Lộc An. Bảo lưu mọi quyền."
  };

  const EN = {
    about: "ABOUT",
    mainTitle: "LỘC AN SNEAKER COLLECTION",
    subtitle:
      "Digital Sneaker Archive & Museum",
    sneakers: "SNEAKERS",
    lego: "LEGO",
    mask: "SNEAKER MASK",
    footer:
      "© 2026 Lộc An Sneaker Collection. All Rights Reserved."
  };

  let applyingVisual =
    false;

  function installStyles() {
    document
      .getElementById(STYLE_ID)
      ?.remove();

    const style =
      document.createElement(
        "style"
      );

    style.id =
      STYLE_ID;

    style.textContent = `
      /*
        Match the homepage's approved header arrangement:
        About/Giới thiệu = top-left.
        VI/EN = top-right.
      */
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

      /*
        Final authority for the two Timeline status buttons.
        Inline styles are also set by JS below for maximum
        resistance to older cached presentation rules.
      */
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

      @media (max-width: 700px) {
        .timeline-site-header
        > .about-corner-link {
          top: 0 !important;
          left: 0 !important;
          right: auto !important;
        }

        .timeline-site-header
        > .header-corner-tools {
          justify-content: flex-end !important;
        }
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function language() {
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

    if (
      document.documentElement
        .lang === "en"
    ) {
      return "en";
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

    if (element) {
      element.textContent =
        value;
    }
  }

  function applyChrome(
    forcedLanguage = null
  ) {
    const lang =
      forcedLanguage === "en"
        ? "en"
        : forcedLanguage === "vi"
          ? "vi"
          : language();

    const copy =
      lang === "en"
        ? EN
        : VI;

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

  function applyVisualState(
    value
  ) {
    if (applyingVisual) {
      return;
    }

    applyingVisual = true;

    const selected =
      value === "sold"
        ? "sold"
        : "own";

    document.body.dataset
      .timelineFinalFilter =
        selected;

    document
      .querySelectorAll(
        "[data-timeline-filter]"
      )
      .forEach(button => {
        const active =
          button.dataset
            .timelineFilter ===
          selected;

        button.dataset.finalActive =
          active
            ? "true"
            : "false";

        button.classList.toggle(
          "active",
          active
        );

        button.setAttribute(
          "aria-pressed",
          active
            ? "true"
            : "false"
        );

        button.style.setProperty(
          "background",
          active
            ? "#ffcc00"
            : "#171719",
          "important"
        );

        button.style.setProperty(
          "border-color",
          active
            ? "#ffcc00"
            : "#343438",
          "important"
        );

        button.style.setProperty(
          "color",
          active
            ? "#050505"
            : "#a7a7af",
          "important"
        );
      });

    applyingVisual = false;
  }

  window.setTimelineVisualState =
    applyVisualState;

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

  function installInteractionHooks() {
    /*
      Bubble phase deliberately runs AFTER the existing
      timeline.js button handler. The visual state here is
      therefore the final state of the click.
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
            applyVisualState(
              selected
            );

            setTimeout(
              () =>
                applyVisualState(
                  selected
                ),
              0
            );

            setTimeout(
              () =>
                applyVisualState(
                  selected
                ),
              80
            );
          }
        }

        const languageButton =
          event.target.closest(
            "#btn-vi, #btn-en"
          );

        if (languageButton) {
          const nextLang =
            languageButton.id ===
              "btn-en"
              ? "en"
              : "vi";

          setTimeout(
            () =>
              applyChrome(
                nextLang
              ),
            0
          );

          setTimeout(
            () =>
              applyChrome(
                nextLang
              ),
            80
          );
        }
      },
      false
    );
  }

  function installObserver() {
    const buttons =
      document.querySelector(
        ".timeline-status-filters"
      );

    if (!buttons) {
      return;
    }

    const observer =
      new MutationObserver(
        mutations => {
          if (applyingVisual) {
            return;
          }

          const relevant =
            mutations.some(
              mutation =>
                mutation.type ===
                "attributes"
            );

          if (relevant) {
            applyVisualState(
              currentFilter()
            );
          }
        }
      );

    observer.observe(
      buttons,
      {
        subtree: true,
        attributes: true,
        attributeFilter: [
          "class",
          "aria-pressed"
        ]
      }
    );
  }

  function init() {
    installStyles();
    applyChrome();
    applyVisualState(
      currentFilter()
    );
    installInteractionHooks();
    installObserver();

    [
      0,
      80,
      250,
      700
    ].forEach(delay => {
      setTimeout(
        () => {
          applyChrome();
          applyVisualState(
            currentFilter()
          );
        },
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
      init,
      { once: true }
    );
  } else {
    init();
  }
})();
