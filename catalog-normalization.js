/* =========================================================
   LỘC AN — CATALOG IMAGE STABILITY GUARD
   2026-10-10

   PURPOSE
   -------
   This file intentionally DOES NOT replace catalog images with
   pictures/normalized/* and DOES NOT override approved per-pair sizing.

   It exists as a compatibility guard because older homepage builds may
   still load catalog-normalization.js dynamically. If legacy normalized
   state is found, it is removed and the original pictures/* source is
   restored.

   It also registers the current service worker so browsers that already
   have an older worker/cache are upgraded without requiring a hard reload.
========================================================= */
(() => {
  "use strict";

  const BUILD = "20261010-image-stability-v1";
  const NORMALIZED_PREFIX = "pictures/normalized/";
  const PICTURES_PREFIX = "pictures/";

  let scheduled = false;

  function cleanPath(value) {
    return String(value || "")
      .split("?")[0]
      .split("#")[0]
      .replace(/^\.\//, "")
      .trim();
  }

  function originalFromNormalized(value) {
    const path = cleanPath(value);

    if (!path.startsWith(NORMALIZED_PREFIX)) {
      return "";
    }

    return (
      PICTURES_PREFIX +
      path.slice(NORMALIZED_PREFIX.length)
    );
  }

  function clearLegacyNormalizationStyles(img) {
    if (
      img.dataset.normalizedCatalogImage !== "true" &&
      !img.dataset.normalizedCatalogBuild
    ) {
      return;
    }

    [
      "scale",
      "transform",
      "translate",
      "transform-origin",
      "object-fit",
      "object-position",
      "width",
      "height",
      "max-width",
      "max-height"
    ].forEach(property => {
      img.style.removeProperty(property);
    });
  }

  function clearLegacyDataset(img) {
    [
      "normalizedCatalogImage",
      "normalizedCatalogBuild",
      "normalizedCatalogLoading",
      "normalizedCatalogFailed",
      "normalizedOriginalSrc",
      "normalizedTargetSrc"
    ].forEach(key => {
      delete img.dataset[key];
    });
  }

  function restoreImage(img) {
    if (!(img instanceof HTMLImageElement)) {
      return;
    }

    if (!img.closest("#sneaker-grid")) {
      return;
    }

    const current = cleanPath(
      img.getAttribute("src") ||
      img.currentSrc ||
      ""
    );

    const savedOriginal = cleanPath(
      img.dataset.normalizedOriginalSrc ||
      ""
    );

    const derivedOriginal =
      originalFromNormalized(current);

    const original =
      savedOriginal ||
      derivedOriginal;

    clearLegacyNormalizationStyles(img);
    clearLegacyDataset(img);

    if (
      original &&
      current.startsWith(NORMALIZED_PREFIX) &&
      current !== original
    ) {
      img.src = original;
    }
  }

  function restoreAll() {
    scheduled = false;

    document
      .querySelectorAll("#sneaker-grid img")
      .forEach(restoreImage);
  }

  function scheduleRestore() {
    if (scheduled) {
      return;
    }

    scheduled = true;
    requestAnimationFrame(restoreAll);
  }

  function retryBrokenOriginalImages() {
    document
      .querySelectorAll("#sneaker-grid img")
      .forEach(img => {
        if (!(img instanceof HTMLImageElement)) {
          return;
        }

        if (
          !img.complete ||
          img.naturalWidth !== 0 ||
          img.dataset.imageStabilityRetried === BUILD
        ) {
          return;
        }

        const src = cleanPath(
          img.getAttribute("src") ||
          ""
        );

        if (
          !src.startsWith(PICTURES_PREFIX) ||
          src.startsWith(NORMALIZED_PREFIX)
        ) {
          return;
        }

        img.dataset.imageStabilityRetried = BUILD;
        img.src =
          `./${src}?v=${encodeURIComponent(BUILD)}`;
      });
  }

  async function registerStableServiceWorker() {
    if (
      !("serviceWorker" in navigator) ||
      !window.isSecureContext
    ) {
      return;
    }

    try {
      const registration =
        await navigator.serviceWorker.register(
          `./sw.js?v=${BUILD}`,
          { scope: "./" }
        );

      /* Force an update check even when an older worker controls the page. */
      registration.update().catch(() => {});
    } catch (_) {
      /* The website must remain fully usable even if SW registration fails. */
    }
  }

  function install() {
    restoreAll();

    const grid =
      document.getElementById(
        "sneaker-grid"
      );

    if (grid) {
      const observer =
        new MutationObserver(
          scheduleRestore
        );

      observer.observe(
        grid,
        {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: [
            "src",
            "data-normalized-catalog-image",
            "data-normalized-catalog-build"
          ]
        }
      );
    }

    /*
      When the new worker takes control, retry only images that are actually
      broken. No page reload is forced, so there is no reload loop or visual
      jump for images that already loaded correctly.
    */
    if (
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker.addEventListener(
        "controllerchange",
        () => {
          restoreAll();
          window.setTimeout(
            retryBrokenOriginalImages,
            50
          );
        }
      );
    }

    registerStableServiceWorker();

    [
      100,
      400,
      1000
    ].forEach(delay => {
      window.setTimeout(
        () => {
          restoreAll();
          retryBrokenOriginalImages();
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
      install,
      { once: true }
    );
  } else {
    install();
  }
})();
