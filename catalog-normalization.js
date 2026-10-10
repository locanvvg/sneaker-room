/* =========================================================
   LỘC AN — UNIFIED CATALOG IMAGE NORMALIZATION v2

   PURPOSE
   -------
   - Applies to IN COLLECTION sneakers only.
   - Grid and 3D use the same generated normalized image.
   - Existing detail-page/gallery images remain untouched.
   - Existing per-pair sizing code can stay in the repo; this layer
     deliberately wins for normalized homepage images.
   - Future IN COLLECTION sneakers are covered automatically.

   INPUT:
     pictures/<image>.png
     (pictures/source/<image>.png is also supported for migration)

   DISPLAY:
     pictures/normalized/<image>.png

   If the generated normalized image is not available yet, the image
   falls back to its original source without breaking the page.
========================================================= */
(() => {
  "use strict";

  const BUILD = "20261010-unified-v2";
  const NORMALIZED_PREFIX = "pictures/normalized/";
  const SOURCE_PREFIX = "pictures/source/";
  const PICTURES_PREFIX = "pictures/";

  let scheduled = false;

  function ownItem(item) {
    return String(item?.collectionStatus || "own")
      .trim()
      .toLowerCase() === "own";
  }

  function cleanPath(value) {
    return String(value || "")
      .split("?")[0]
      .split("#")[0]
      .replace(/^\.\//, "")
      .trim();
  }

  function originalPath(item) {
    const sourceImages =
      Array.isArray(item?.sourceImages)
        ? item.sourceImages.filter(Boolean)
        : [];

    const candidate =
      item?.sourceImage ||
      sourceImages[0] ||
      item?.originalImage ||
      item?.image ||
      "";

    return cleanPath(candidate);
  }

  function normalizedPath(value) {
    const source = cleanPath(value);

    if (!source) return "";

    if (source.startsWith(NORMALIZED_PREFIX)) {
      return source.replace(/\.(png|jpe?g|webp)$/i, ".png");
    }

    if (source.startsWith(SOURCE_PREFIX)) {
      return (
        NORMALIZED_PREFIX +
        source.slice(SOURCE_PREFIX.length)
      ).replace(/\.(png|jpe?g|webp)$/i, ".png");
    }

    if (source.startsWith(PICTURES_PREFIX)) {
      return (
        NORMALIZED_PREFIX +
        source.slice(PICTURES_PREFIX.length)
      ).replace(/\.(png|jpe?g|webp)$/i, ".png");
    }

    return "";
  }

  function fileKey(value) {
    return cleanPath(value)
      .split("/")
      .pop()
      .replace(/\.(png|jpe?g|webp)$/i, "")
      .toLowerCase();
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

  function sneakerByRenderedImage(img) {
    if (
      typeof sneakers === "undefined" ||
      !Array.isArray(sneakers)
    ) {
      return null;
    }

    const id =
      img?.dataset?.sneakerId ||
      img?.closest("[data-sneaker-id]")?.dataset?.sneakerId ||
      "";

    const byId = sneakerById(id);
    if (byId) return byId;

    const link = img?.closest("a[href*='shoe.html?id=']");

    if (link) {
      try {
        const url = new URL(link.href, window.location.href);
        const linked = sneakerById(url.searchParams.get("id"));
        if (linked) return linked;
      } catch (_) {}
    }

    const renderedKey = fileKey(
      img?.getAttribute("src") ||
      img?.currentSrc ||
      ""
    );

    if (!renderedKey) return null;

    return sneakers.find(item => {
      const original = originalPath(item);
      const normalized = normalizedPath(original);

      return (
        fileKey(original) === renderedKey ||
        fileKey(normalized) === renderedKey
      );
    }) || null;
  }

  function clearNeutralSizing(img) {
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

    delete img.dataset.normalizedCatalogImage;
    delete img.dataset.normalizedCatalogBuild;
  }

  function applyNeutralSizing(img) {
    /*
      Inline !important is intentional. It is the final authority for
      generated normalized homepage images and prevents all historical
      per-pair Grid/3D overrides from changing their visual envelope.
    */
    img.style.setProperty("scale", "1 1", "important");
    img.style.setProperty("transform", "none", "important");
    img.style.setProperty("translate", "0 0", "important");
    img.style.setProperty("transform-origin", "center center", "important");
    img.style.setProperty("object-fit", "contain", "important");
    img.style.setProperty("object-position", "center center", "important");

    if (img.closest(".sneaker-3d-image")) {
      img.style.setProperty("width", "100%", "important");
      img.style.setProperty("height", "100%", "important");
      img.style.setProperty("max-width", "100%", "important");
      img.style.setProperty("max-height", "100%", "important");
    }

    img.dataset.normalizedCatalogImage = "true";
    img.dataset.normalizedCatalogBuild = BUILD;
  }

  function switchToNormalized(img, item) {
    if (!img || !item || !ownItem(item)) return;

    const original = originalPath(item);
    const normalized = normalizedPath(original);

    if (!original || !normalized) return;

    const current = cleanPath(
      img.getAttribute("src") ||
      img.currentSrc ||
      ""
    );

    img.dataset.normalizedOriginalSrc = original;
    img.dataset.normalizedTargetSrc = normalized;
    img.dataset.sneakerId = String(item.id || img.dataset.sneakerId || "");

    /* Already on the generated image: only reassert neutral sizing. */
    if (
      current.includes(normalized) ||
      current.endsWith(normalized)
    ) {
      applyNeutralSizing(img);
      return;
    }

    if (img.dataset.normalizedCatalogLoading === "true") {
      return;
    }

    img.dataset.normalizedCatalogLoading = "true";

    const onLoad = () => {
      delete img.dataset.normalizedCatalogLoading;
      delete img.dataset.normalizedCatalogFailed;
      applyNeutralSizing(img);
    };

    const onError = () => {
      delete img.dataset.normalizedCatalogLoading;
      img.dataset.normalizedCatalogFailed = "true";
      clearNeutralSizing(img);

      /*
        Safe deployment fallback: during the short window before the
        GitHub Action has generated normalized files, use the original
        image rather than showing a broken card.
      */
      if (cleanPath(img.getAttribute("src")) !== original) {
        img.src = original;
      }
    };

    img.addEventListener("load", onLoad, { once: true });
    img.addEventListener("error", onError, { once: true });

    applyNeutralSizing(img);
    img.src = normalized;
  }

  function processImage(img) {
    if (!(img instanceof HTMLImageElement)) return;

    if (!img.closest("#sneaker-grid")) return;

    const item = sneakerByRenderedImage(img);

    if (!item || !ownItem(item)) {
      return;
    }

    switchToNormalized(img, item);
  }

  function processAll() {
    scheduled = false;

    document
      .querySelectorAll("#sneaker-grid img")
      .forEach(processImage);
  }

  function schedule() {
    if (scheduled) return;

    scheduled = true;
    requestAnimationFrame(processAll);
  }

  function install() {
    processAll();

    const grid = document.getElementById("sneaker-grid");
    if (!grid) return;

    const observer = new MutationObserver(schedule);

    observer.observe(grid, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "data-sneaker-id"]
    });

    /*
      Reassert after late site-enhancement/style installation.
    */
    [0, 100, 300, 700, 1200, 2200].forEach(delay => {
      window.setTimeout(processAll, delay);
    });

    window.addEventListener("resize", schedule, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install, { once: true });
  } else {
    install();
  }
})();
