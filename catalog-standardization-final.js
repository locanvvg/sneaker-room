/* =========================================================
   LỘC AN — FINAL NORMALIZED IMAGE AUTHORITY v4

   PURPOSE
   -------
   - Loaded after collection-view.js.
   - Grid uses the perceptual-area normalized Grid derivative.
   - 3D keeps the already-approved v3 derivative.
   - Neutralizes every legacy per-pair Grid/3D transform ONLY for OWN
     normalized images.
   - PRE-OWNED/original-source items remain untouched.
========================================================= */
(() => {
  "use strict";

  const BUILD = "20261010-standard-v4";
  const STYLE_ID = "locan-normalized-image-authority-v4";

  function installStyles() {
    [
      "locan-normalized-image-authority-v3",
      STYLE_ID
    ].forEach(id =>
      document.getElementById(id)?.remove()
    );

    const style =
      document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `
      /* =====================================================
         GRID — normalized OWN sneakers
         Do not require #sneaker-grid.grid: the collection controller may
         change classes while preserving the Grid card DOM.
      ===================================================== */
      html body #sneaker-grid
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
         3D — normalized OWN sneakers
         Covers both lazy data-src and loaded src states.
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

  function sneakerById(id) {
    if (
      typeof sneakers === "undefined" ||
      !Array.isArray(sneakers) ||
      !id
    ) {
      return null;
    }

    return sneakers.find(
      item => String(item?.id || "") === String(id)
    ) || null;
  }

  function cleanPath(value) {
    return String(value || "")
      .split("?")[0]
      .split("#")[0]
      .replace(/^\.\//, "")
      .trim();
  }

  function sync3DImage(img) {
    if (
      !(img instanceof HTMLImageElement) ||
      !img.closest(".sneaker-3d-image")
    ) {
      return;
    }

    const item = sneakerById(
      img.dataset.sneakerId || ""
    );

    const target = cleanPath(
      item?.catalog3DImage || ""
    );

    if (!target) {
      return;
    }

    /*
      collection-view.js creates lazy 3D images with data-src first.
      MutationObserver runs before its requestAnimationFrame lazy load, so
      this replaces the source without a visible image swap.
    */
    if (cleanPath(img.dataset.src) !== target) {
      img.dataset.src = target;
    }

    const currentSrc = cleanPath(
      img.getAttribute("src") || ""
    );

    if (currentSrc && currentSrc !== target) {
      img.src = target;
    }

    neutralizeNormalizedImage(img);
  }

  function sync3DAssets(root = document) {
    root
      .querySelectorAll?.(
        '#sneaker-grid .sneaker-3d-image img[data-catalog-image="true"]'
      )
      .forEach(sync3DImage);
  }

  function neutralizeNormalizedImage(img) {
    if (!(img instanceof HTMLImageElement)) {
      return;
    }

    /*
      Inline !important is deliberate here. Several historical calibration
      selectors are extremely specific. For a generated normalized asset,
      the bitmap itself is the sizing authority, so no old selector should
      be able to shrink/stretch it again.
    */
    img.style.setProperty("width", "100%", "important");
    img.style.setProperty("height", "100%", "important");
    img.style.setProperty("max-width", "100%", "important");
    img.style.setProperty("max-height", "100%", "important");
    img.style.setProperty("margin", "0", "important");
    img.style.setProperty("object-fit", "contain", "important");
    img.style.setProperty("object-position", "center center", "important");
    img.style.setProperty("scale", "1 1", "important");
    img.style.setProperty("translate", "0 0", "important");
    img.style.setProperty("transform", "none", "important");
    img.style.setProperty("transform-origin", "center center", "important");

    img.dataset.normalizedStandard = "true";
    img.dataset.normalizedBuild = BUILD;
  }

  function markNormalizedImages() {
    document
      .querySelectorAll(
        '#sneaker-grid img[src*="pictures/normalized/"], ' +
        '#sneaker-grid img[data-src*="pictures/normalized/"]'
      )
      .forEach(neutralizeNormalizedImage);
  }

  function observeCollection() {
    const grid =
      document.getElementById("sneaker-grid");

    if (!grid || grid.dataset.standardV4Observed === "true") {
      return;
    }

    grid.dataset.standardV4Observed = "true";

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return;

          if (
            node.matches?.(
              '.sneaker-3d-image img[data-catalog-image="true"]'
            )
          ) {
            sync3DImage(node);
          }

          sync3DAssets(node);
        });
      }

      markNormalizedImages();
    });

    observer.observe(grid, {
      childList: true,
      subtree: true
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

  function syncAll() {
    installStyles();
    sync3DAssets();
    markNormalizedImages();
    observeCollection();
  }

  /* Last-loaded authority: beat legacy per-pair rules without touching data. */
  installStyles();

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      syncAll,
      { once: true }
    );
  } else {
    syncAll();
  }

  window.addEventListener(
    "load",
    syncAll,
    { once: true }
  );

  registerStableServiceWorker();
})();
