/* =========================================================
   LỘC AN — CURRENT SITE ADJUSTMENTS v2
   2026-10-11

   EXACT REQUESTED SCOPE
   ---------------------
   1) Yuto Matcha detail image #2:
      - slightly smaller only on detail page
      - image #1 unchanged
      - applies to hero + thumbnail
      - all viewport sizes

   2) Black Bloodline:
      - metadata becomes F&F PE Sample
      - story designation is synchronized to F&F PE Sample

   3) New Balance 2002R:
      - retail price becomes N/A

   4) Language:
      - when the site is opened WITHOUT an explicit ?lang=vi/en,
        start in Vietnamese
      - explicit ?lang=en remains respected
      - choosing EN normally still works

   DOES NOT CHANGE
   ---------------
   - homepage image normalization / standard-v4b
   - Grid / 3D sizing
   - Formerly in Collection cleanup
   - any other sneaker metadata/story/image
   - Yuto image #1
========================================================= */
(() => {
  "use strict";

  const BUILD =
    "20261011-current-site-adjustments-v2";

  const YUTO_SECOND_IMAGE =
    "sbdunk_yutohorigome_matcha1.png";

  /*
    "Slightly too large" correction:
    4% reduction only, centered.
  */
  const YUTO_SECOND_SCALE =
    "0.96";

  /* =====================================================
     1. DEFAULT LANGUAGE = VI WHEN URL HAS NO EXPLICIT LANG
     This runs immediately, before main.js / shoe-page.js read
     localStorage, so mobile does not start in a stale stored EN.
  ===================================================== */

  function applyVietnameseDefault() {
    const lang =
      new URLSearchParams(
        window.location.search
      ).get("lang");

    if (
      lang === "vi" ||
      lang === "en"
    ) {
      return;
    }

    try {
      localStorage.setItem(
        "locan_lang",
        "vi"
      );
    } catch (_) {}

    document.documentElement.lang =
      "vi";
  }

  applyVietnameseDefault();

  /* =====================================================
     2. REQUESTED METADATA ONLY
     Applied before Catalog Engine / renderers consume the data.
  ===================================================== */

  function patchRequestedMetadata() {
    if (
      typeof sneakers === "undefined" ||
      !Array.isArray(sneakers)
    ) {
      return;
    }

    const bloodline =
      sneakers.find(
        item =>
          item?.id ===
          "air-jordan-1-black-bloodline-pe"
      );

    if (bloodline) {
      bloodline.title = {
        vi:
          "Jordan 1 Retro High OG 'Black Bloodline' F&F PE Sample",
        en:
          "Jordan 1 Retro High OG 'Black Bloodline' F&F PE Sample"
      };

      bloodline.subtitle = {
        vi:
          "F&F PE Sample (2019)",
        en:
          "F&F PE Sample (2019)"
      };

      bloodline.editionType = {
        vi:
          "F&F PE Sample",
        en:
          "F&F PE Sample"
      };
    }

    const newBalance =
      sneakers.find(
        item =>
          item?.id ===
          "new-balance-2002r-custom"
      );

    if (newBalance) {
      newBalance.retailPrice =
        "N/A";
    }
  }

  patchRequestedMetadata();

  /*
    collection-content-final.js loads after this file and restores the
    approved canonical Bloodline story. We therefore update ONLY the
    designation at DOMContentLoaded, after that canonical story has been
    installed but before shoe-page.js renders the detail content.
  */
  function patchBloodlineStoryDesignation() {
    if (
      typeof sneakers === "undefined" ||
      !Array.isArray(sneakers)
    ) {
      return;
    }

    const bloodline =
      sneakers.find(
        item =>
          item?.id ===
          "air-jordan-1-black-bloodline-pe"
      );

    if (
      !bloodline ||
      !bloodline.story ||
      typeof bloodline.story !== "object"
    ) {
      return;
    }

    ["vi", "en"].forEach(lang => {
      const story =
        bloodline.story[lang];

      if (typeof story !== "string") {
        return;
      }

      bloodline.story[lang] =
        story
          .replaceAll(
            "Black Bloodline PE Sample",
            "Black Bloodline F&F PE Sample"
          )
          .replaceAll(
            "Black Bloodline PE,",
            "Black Bloodline F&F PE Sample,"
          )
          .replaceAll(
            "<b>PE Sample</b>",
            "<b>F&F PE Sample</b>"
          );
    });
  }

  /* =====================================================
     3. YUTO DETAIL IMAGE #2 — HERO + THUMBNAIL ONLY
  ===================================================== */

  function cleanPath(value) {
    return String(value || "")
      .split("#")[0]
      .split("?")[0]
      .replace(/^\.\//, "")
      .trim();
  }

  function isYutoSecond(img) {
    if (
      !(img instanceof HTMLImageElement)
    ) {
      return false;
    }

    const sources = [
      img.dataset.detailOriginalSrc,
      img.getAttribute("src"),
      img.dataset.src
    ]
      .map(cleanPath)
      .filter(Boolean);

    return sources.some(
      source =>
        source.endsWith(
          YUTO_SECOND_IMAGE
        )
    );
  }

  function isDetailGalleryImage(img) {
    if (
      !(img instanceof HTMLImageElement)
    ) {
      return false;
    }

    return (
      img.id === "shoe-image" ||
      Boolean(
        img.closest(
          ".shoe-detail-thumbnail"
        )
      )
    );
  }

  function applyYutoFineTune() {
    const images =
      document.querySelectorAll(
        "#shoe-image, .shoe-detail-thumbnail img"
      );

    images.forEach(img => {
      if (!isDetailGalleryImage(img)) {
        return;
      }

      if (isYutoSecond(img)) {
        img.style.setProperty(
          "transform",
          `scale(${YUTO_SECOND_SCALE})`,
          "important"
        );

        img.style.setProperty(
          "transform-origin",
          "center center",
          "important"
        );

        img.dataset.yutoSecondFineTune =
          BUILD;
      } else if (
        img.dataset.yutoSecondFineTune
      ) {
        /*
          When the hero switches back from image #2 to image #1,
          restore only the adjustment created by this file.
        */
        img.style.setProperty(
          "transform",
          "none",
          "important"
        );

        img.style.setProperty(
          "transform-origin",
          "center center",
          "important"
        );

        delete img.dataset
          .yutoSecondFineTune;
      }
    });
  }

  let fineTuneScheduled =
    false;

  function scheduleYutoFineTune() {
    if (fineTuneScheduled) {
      return;
    }

    fineTuneScheduled = true;

    requestAnimationFrame(() => {
      /*
        detail-image-standardizer.js may still be swapping the raw
        source to the approved v4b normalized source in the same frame.
        The zero-delay pass makes this the final detail-only transform.
      */
      setTimeout(() => {
        fineTuneScheduled =
          false;

        applyYutoFineTune();
      }, 0);
    });
  }

  function installYutoObserver() {
    const section =
      document.querySelector(
        ".shoe-image-section"
      );

    if (
      !section ||
      section.dataset
        .yutoFineTuneObserved ===
        "true"
    ) {
      return;
    }

    section.dataset
      .yutoFineTuneObserved =
        "true";

    const observer =
      new MutationObserver(
        mutations => {
          const relevant =
            mutations.some(
              mutation =>
                mutation.type ===
                  "childList" ||
                (
                  mutation.type ===
                    "attributes" &&
                  mutation.attributeName ===
                    "src"
                )
            );

          if (relevant) {
            scheduleYutoFineTune();
          }
        }
      );

    observer.observe(
      section,
      {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src"]
      }
    );

    scheduleYutoFineTune();
  }

  function initDetailFineTune() {
    patchRequestedMetadata();
    patchBloodlineStoryDesignation();

    installYutoObserver();

    [
      0,
      40,
      120,
      300
    ].forEach(delay => {
      setTimeout(
        applyYutoFineTune,
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
      initDetailFineTune,
      { once: true }
    );
  } else {
    initDetailFineTune();
  }
})();
