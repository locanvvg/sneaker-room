/* =========================================================
   LỘC AN — FINAL NORMALIZED IMAGE AUTHORITY v7
   2026-11-01

   FINAL HOMEPAGE IMAGE RULE
   -------------------------
   - applies to ALL generated normalized sneaker images,
   - Grid + 3D,
   - In Collection + Formerly In Collection,
   - desktop + mobile,
   - no sneaker IDs,
   - no per-pair scale/transform exceptions.
========================================================= */
(() => {
  "use strict";

  const BUILD = "20261101-global-visual-v7";
  const CACHE_REVISION = "20261101-mobile-normalized-v7";
  const STYLE_ID = "locan-normalized-image-authority-v7";

  const LEGACY_STYLE_IDS = [
    "locan-normalized-image-authority-v3",
    "locan-normalized-image-authority-v4",
    "locan-direct-3d-calibration-v22"
  ];

  function catalog() {
    return (
      typeof sneakers !== "undefined" &&
      Array.isArray(sneakers)
    ) ? sneakers : [];
  }

  function sneakerById(id) {
    const key = String(id || "");
    if (!key) return null;

    return catalog().find(
      item => String(item?.id || "") === key
    ) || null;
  }

  function cleanPath(value) {
    return String(value || "")
      .split("#")[0]
      .replace(/^\.\//, "")
      .trim();
  }

  function isNormalized(value) {
    return cleanPath(value).includes("pictures/normalized/");
  }

  function removeLegacyStyles() {
    LEGACY_STYLE_IDS.forEach(id => {
      document.getElementById(id)?.remove();
    });
  }

  function installStyles() {
    removeLegacyStyles();
    document.getElementById(STYLE_ID)?.remove();

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      html body #sneaker-grid
      .card-img-wrapper
      img[data-catalog-image="true"][src*="pictures/normalized/"],

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
        padding: 0 !important;

        object-fit: contain !important;
        object-position: center center !important;

        scale: 1 1 !important;
        translate: 0 0 !important;
        transform: none !important;
        transform-origin: center center !important;
      }

      @media (max-width: 760px) {
        html body #sneaker-grid
        .card-img-wrapper
        img[data-catalog-image="true"][src*="pictures/normalized/"],

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

          object-fit: contain !important;
          object-position: center center !important;

          scale: 1 1 !important;
          translate: 0 0 !important;
          transform: none !important;
          transform-origin: center center !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function targetFor(img) {
    const item = sneakerById(img?.dataset?.sneakerId || "");
    if (!item) return "";

    return img.closest(".sneaker-3d-image")
      ? cleanPath(item.catalog3DImage || "")
      : cleanPath(item.catalogGridImage || "");
  }

  function syncImageSource(img) {
    const target = targetFor(img);
    if (!target || !isNormalized(target)) return;

    if (img.closest(".sneaker-3d-image")) {
      if (cleanPath(img.dataset.src) !== target) {
        img.dataset.src = target;
      }

      const current = cleanPath(img.getAttribute("src") || "");
      if (current && current !== target) {
        img.setAttribute("src", target);
      }
    } else if (img.closest(".card-img-wrapper")) {
      const current = cleanPath(img.getAttribute("src") || "");
      if (current !== target) {
        img.setAttribute("src", target);
      }
    }
  }

  function neutralize(img) {
    if (!(img instanceof HTMLImageElement)) return;

    syncImageSource(img);

    const source = cleanPath(
      img.getAttribute("src") ||
      img.dataset.src ||
      targetFor(img)
    );

    if (!isNormalized(source) && !isNormalized(targetFor(img))) {
      return;
    }

    const values = {
      width: "100%",
      height: "100%",
      "max-width": "100%",
      "max-height": "100%",
      margin: "0",
      padding: "0",
      "object-fit": "contain",
      "object-position": "center center",
      scale: "1 1",
      translate: "0 0",
      transform: "none",
      "transform-origin": "center center"
    };

    Object.entries(values).forEach(([name, value]) => {
      img.style.setProperty(name, value, "important");
    });

    img.dataset.normalizedStandard = "true";
    img.dataset.normalizedBuild = BUILD;
  }

  function syncWithin(root = document) {
    root.querySelectorAll?.(
      '#sneaker-grid img[data-catalog-image="true"]'
    ).forEach(neutralize);
  }

  function observeCollection() {
    const grid = document.getElementById("sneaker-grid");
    if (!grid || grid.dataset.standardV7Observed === "true") return;

    grid.dataset.standardV7Observed = "true";

    let scheduled = false;

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;

      requestAnimationFrame(() => {
        scheduled = false;
        removeLegacyStyles();
        installStyles();
        syncWithin(grid);
      });
    };

    const observer = new MutationObserver(schedule);
    observer.observe(grid, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "data-src"]
    });
  }

  async function purgeStaleCaches() {
    if (!("caches" in window)) return;

    const marker = `locan-cache-reset-${CACHE_REVISION}`;

    try {
      if (localStorage.getItem(marker) === "done") return;

      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(key => key.startsWith("locan-sneaker-room-"))
          .map(key => caches.delete(key))
      );

      localStorage.setItem(marker, "done");
    } catch (_) {}
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || !window.isSecureContext) return;

    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register(`./sw.js?v=${CACHE_REVISION}`, { updateViaCache: "none" })
        .then(registration => registration.update())
        .catch(() => {});
    }, { once: true });
  }

  function syncAll() {
    removeLegacyStyles();
    installStyles();
    syncWithin();
    observeCollection();
  }

  purgeStaleCaches();
  installStyles();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      window.setTimeout(syncAll, 0);
      window.setTimeout(syncAll, 100);
    }, { once: true });
  } else {
    syncAll();
  }

  window.addEventListener("load", syncAll, { once: true });
  window.addEventListener("pageshow", syncAll);
  window.addEventListener("resize", () => requestAnimationFrame(syncAll), { passive: true });
  window.addEventListener("orientationchange", () => window.setTimeout(syncAll, 120), { passive: true });

  registerServiceWorker();
})();
