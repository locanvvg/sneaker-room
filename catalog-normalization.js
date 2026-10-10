/* =========================================================
   LỘC AN — HOMEPAGE CATALOG IMAGE STANDARDIZATION v4

   PURPOSE
   -------
   - Runs ONLY on the sneaker homepage (index.html).
   - Uses build-time derivatives BEFORE first render.
   - Grid and 3D may use different normalized derivatives because their
     visual envelopes are different.
   - Preserves original detail/gallery images unchanged.
   - Applies automatically to every item whose collectionStatus is "own".
   - Contains NO sneaker IDs and NO per-pair sizing constants.
========================================================= */
(() => {
  "use strict";

  const BUILD = "20261010-standard-v4";
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

  function normalizedAssets(value) {
    const source = cleanPath(value);

    if (!source) {
      return null;
    }

    const direct =
      generatedMap[source] ||
      generatedMap[`./${source}`];

    /*
      v4 manifest:
        { grid: ".../grid/foo.png", view3d: ".../foo.png" }
    */
    if (
      direct &&
      typeof direct === "object" &&
      !Array.isArray(direct)
    ) {
      const grid = cleanPath(
        direct.grid ||
        direct.view3d ||
        direct.default ||
        ""
      );

      const view3d = cleanPath(
        direct.view3d ||
        direct.grid ||
        direct.default ||
        ""
      );

      if (grid || view3d) {
        return {
          grid: grid || view3d,
          view3d: view3d || grid
        };
      }
    }

    /*
      v3 compatibility during the short deployment window before the GitHub
      Action regenerates manifest.js.  A string means both modes temporarily
      use the existing v3 derivative; nothing breaks or disappears.
    */
    if (typeof direct === "string" && direct) {
      const normalized = cleanPath(direct);

      return {
        grid: normalized,
        view3d: normalized
      };
    }

    if (!mapHasEntries) {
      const derived = derivedNormalizedPath(source);

      if (derived) {
        return {
          grid: derived,
          view3d: derived
        };
      }
    }

    return null;
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

    const assets = normalizedAssets(original);

    if (!assets?.grid || !assets?.view3d) {
      /* New asset not built yet: preserve the original safely. */
      return false;
    }

    item.catalogOriginalImage = original;
    item.catalogGridImage = assets.grid;
    item.catalog3DImage = assets.view3d;
    item.catalogNormalizedImage = true;
    item.catalogNormalizedBuild = BUILD;

    /* Grid renderer reads sneaker.image. */
    item.image = assets.grid;

    /*
      Normalized derivatives own visual sizing.  Remove legacy per-pair
      homepage calibration.  shoe.html does not load this script, so its
      gallery/detail behavior remains untouched.
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
    normalizedAssets,
    generatedMap
  };

  console.info(
    `[Catalog Images] ${result.standardized} owned item(s) ` +
    `standardized before first render (dual-mode v4).`
  );
})();
