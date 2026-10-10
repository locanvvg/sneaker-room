/* =========================================================
   LỘC AN — FINAL NORMALIZED IMAGE AUTHORITY v3

   PURPOSE
   -------
   - Loaded after collection-view.js.
   - Makes build-time normalized images the single visual-size authority
     for the homepage Grid and 3D views.
   - Neutralizes legacy per-pair scale / transform calibration only when
     the rendered source is under pictures/normalized/.
   - PRE-OWNED items using their legacy/original sources are untouched.
========================================================= */
(() => {
  "use strict";

  const BUILD = "20261010-standard-v3";
  const STYLE_ID = "locan-normalized-image-authority-v3";

  function installStyles() {
    document
      .getElementById(STYLE_ID)
      ?.remove();

    const style =
      document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `
      /* =====================================================
         GRID — normalized owned sneakers
         The PNG itself already contains the standardized canvas and
         subject box, so the browser must not apply any extra per-pair
         visual scale or translation.
      ===================================================== */
      html body #sneaker-grid.grid
      .card-img-wrapper
      img[data-catalog-image="true"][src*="pictures/normalized/"] {
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
        margin: 0 !important;

        object-fit: contain !important;
        object-position: center center !important;

        scale: 1 1 !important;
        translate: 0 0 !important;
        transform: none !important;
        transform-origin: center center !important;
      }

      /* =====================================================
         3D — normalized owned sneakers
         Match both lazy data-src and loaded src states so there is no
         size jump when a nearby 3D card is loaded.
      ===================================================== */
      html body #sneaker-grid
      .sneaker-3d-image
      img[data-catalog-image="true"][data-src*="pictures/normalized/"],

      html body #sneaker-grid
      .sneaker-3d-image
      img[data-catalog-image="true"][src*="pictures/normalized/"] {
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
        margin: 0 !important;

        object-fit: contain !important;
        object-position: center center !important;

        scale: 1 1 !important;
        translate: 0 0 !important;
        transform: none !important;
        transform-origin: center center !important;
      }
    `;

    document.head.appendChild(style);
  }

  function markNormalizedImages() {
    document
      .querySelectorAll(
        '#sneaker-grid img[src*="pictures/normalized/"], ' +
        '#sneaker-grid img[data-src*="pictures/normalized/"]'
      )
      .forEach(img => {
        img.dataset.normalizedStandard = "true";
        img.dataset.normalizedBuild = BUILD;
      });
  }

  function registerStableServiceWorker() {
    if (
      !("serviceWorker" in navigator) ||
      !window.isSecureContext
    ) {
      return;
    }

    window.addEventListener(
      "load",
      () => {
        navigator.serviceWorker
          .register(
            `./sw.js?v=${BUILD}`,
            {
              updateViaCache: "none"
            }
          )
          .then(registration =>
            registration.update()
          )
          .catch(() => {});
      },
      { once: true }
    );
  }

  /*
    Install once during parsing so the rule exists before first paint.
    Install again at DOMContentLoaded. This listener is registered after
    collection-view.js, therefore our style is re-appended after its legacy
    calibration style and wins without a visible resize flash.
  */
  installStyles();

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        installStyles();
        markNormalizedImages();
      },
      { once: true }
    );
  } else {
    installStyles();
    markNormalizedImages();
  }

  window.addEventListener(
    "load",
    () => {
      installStyles();
      markNormalizedImages();
    },
    { once: true }
  );

  registerStableServiceWorker();
})();
