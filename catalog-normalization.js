/* =========================================================
   LỘC AN — HOMEPAGE CATALOG IMAGE STANDARDIZATION v3

   PURPOSE
   -------
   - Runs ONLY on the sneaker homepage (index.html).
   - Replaces the homepage card/3D source with a build-time normalized
     asset BEFORE the first render.
   - Preserves the original gallery/detail images unchanged.
   - Applies automatically to every item whose collectionStatus is "own".
   - Does not hard-code sneaker IDs or per-pair scale numbers.

   INPUT CATALOG IMAGE:
     pictures/<file>.png

   HOMEPAGE DISPLAY IMAGE:
     pictures/normalized/<file>.png

   The generated map is written by:
     tools/normalize-sneaker-images.mjs
========================================================= */
(() => {
  "use strict";

  const BUILD = "20261010-standard-v3";
  const NORMALIZED_PREFIX = "pictures/normalized/";
  const SOURCE_PREFIX = "pictures/source/";
  const PICTURES_PREFIX = "pictures/";

  const generatedMap =
    window.CATALOG_NORMALIZED_IMAGE_MAP &&
    typeof window.CATALOG_NORMALIZED_IMAGE_MAP === "object"
      ? window.CATALOG_NORMALIZED_IMAGE_MAP
      : {};

  const mapHasEntries =
    Object.keys(generatedMap).length > 0;

  function cleanPath(value) {
    return String(value || "")
      .split("?")[0]
      .split("#")[0]
      .replace(/^\.\//, "")
      .trim();
  }

  function isOwned(item) {
    return String(
      item?.collectionStatus || "own"
    )
      .trim()
      .toLowerCase() === "own";
  }

  function derivedNormalizedPath(value) {
    const source = cleanPath(value);

    if (!source) {
      return "";
    }

    if (source.startsWith(NORMALIZED_PREFIX)) {
      return source.replace(
        /\.(png|jpe?g|webp)$/i,
        ".png"
      );
    }

    if (source.startsWith(SOURCE_PREFIX)) {
      return (
        NORMALIZED_PREFIX +
        source.slice(SOURCE_PREFIX.length)
      ).replace(
        /\.(png|jpe?g|webp)$/i,
        ".png"
      );
    }

    if (source.startsWith(PICTURES_PREFIX)) {
      return (
        NORMALIZED_PREFIX +
        source.slice(PICTURES_PREFIX.length)
      ).replace(
        /\.(png|jpe?g|webp)$/i,
        ".png"
      );
    }

    return "";
  }

  function mappedNormalizedPath(value) {
    const source = cleanPath(value);

    if (!source) {
      return "";
    }

    const direct =
      generatedMap[source] ||
      generatedMap[`./${source}`];

    if (direct) {
      return cleanPath(direct);
    }

    /*
      First migration safety:
      current generated normalized files already exist in the repository,
      but manifest.js may be created by the first workflow run slightly
      after index.html is deployed. During that one migration window only,
      derive the deterministic normalized path.

      Once manifest.js exists, a future brand-new image that has not yet
      been processed is intentionally left on its original source rather
      than showing a broken normalized URL.
    */
    if (!mapHasEntries) {
      return derivedNormalizedPath(source);
    }

    return "";
  }

  function standardizeItem(item) {
    if (!item || typeof item !== "object" || !isOwned(item)) {
      return false;
    }

    const original = cleanPath(
      item.catalogOriginalImage ||
      item.originalImage ||
      item.image ||
      (
        Array.isArray(item.images)
          ? item.images[0]
          : ""
      )
    );

    if (!original) {
      return false;
    }

    const normalized =
      mappedNormalizedPath(original);

    if (!normalized) {
      /*
        No generated asset yet. Keep the original image. This makes adding
        a new pair deployment-safe while GitHub Actions is still building.
      */
      return false;
    }

    item.catalogOriginalImage = original;
    item.catalogNormalizedImage = true;
    item.catalogNormalizedBuild = BUILD;

    /* Homepage-only source. Gallery/detail arrays stay untouched. */
    item.image = normalized;

    /*
      The normalized bitmap already owns visual sizing. Remove legacy
      per-pair homepage calibration so no manual number can participate.
      This script is not loaded on shoe.html, so detail galleries are safe.
    */
    item.autoFit = false;
    delete item.display;

    return true;
  }

  function standardizeCollection() {
    if (
      typeof sneakers === "undefined" ||
      !Array.isArray(sneakers)
    ) {
      return {
        standardized: 0,
        total: 0
      };
    }

    let standardized = 0;

    sneakers.forEach(item => {
      if (standardizeItem(item)) {
        standardized += 1;
      }
    });

    return {
      standardized,
      total: sneakers.length
    };
  }

  const result = standardizeCollection();

  window.CatalogImageNormalization = {
    build: BUILD,
    standardizeCollection,
    standardizeItem,
    derivedNormalizedPath,
    generatedMap
  };

  console.info(
    `[Catalog Images] ${result.standardized} owned item(s) ` +
    `standardized before first render.`
  );
})();
