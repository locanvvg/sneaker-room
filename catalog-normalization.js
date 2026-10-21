/* =========================================================
   LỘC AN — HOMEPAGE CATALOG IMAGE STANDARDIZATION v5

   PURPOSE
   -------
   - IN COLLECTION:
       Grid + 3D keep using the existing normalized derivatives.
   - FORMERLY IN COLLECTION:
       Grid keeps the original archive image.
       3D uses the normalized 3D derivative when one exists.
   - Detail/gallery images remain untouched.
   - A newly replaced source asset can opt out of an older normalized
     derivative until that derivative is regenerated.
========================================================= */
(() => {
  "use strict";

  const BUILD = "20261020-standard-v5";
  const ASSET_REVISION = "v5-sold-3d-20261020";
  const NORMALIZED_PREFIX = "pictures/normalized/";
  const SOURCE_PREFIX = "pictures/source/";
  const PICTURES_PREFIX = "pictures/";

  /*
    The PUMA source image was replaced after the existing normalized
    derivative was generated. Keep using the newly supplied source image
    in sold 3D until a new normalized derivative is built from that source.
  */
  const SOLD_3D_SOURCE_ONLY_IDS = new Set([
    "puma-rose-speedcat-leather-warm-white"
  ]);

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

  function revisionedAsset(value) {
    const path = cleanPath(value);

    if (!path) {
      return "";
    }

    return `${path}?asset=${encodeURIComponent(ASSET_REVISION)}`;
  }

  function statusOf(item) {
    return String(
      item?.collectionStatus || "own"
    )
      .trim()
      .toLowerCase() === "sold"
        ? "sold"
        : "own";
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

    if (
      typeof direct === "string" &&
      direct
    ) {
      const normalized =
        cleanPath(direct);

      return {
        grid: normalized,
        view3d: normalized
      };
    }

    if (!mapHasEntries) {
      const derived =
        derivedNormalizedPath(
          source
        );

      if (derived) {
        return {
          grid: derived,
          view3d: derived
        };
      }
    }

    return null;
  }

  function originalImage(item) {
    return cleanPath(
      item?.catalogOriginalImage ||
      item?.originalImage ||
      item?.image ||
      (
        Array.isArray(item?.images)
          ? item.images[0]
          : ""
      )
    );
  }

  function standardizeOwned(
    item,
    original,
    assets
  ) {
    if (
      !assets?.grid ||
      !assets?.view3d
    ) {
      return false;
    }

    item.catalogOriginalImage =
      original;

    item.catalogGridImage =
      revisionedAsset(
        assets.grid
      );

    item.catalog3DImage =
      revisionedAsset(
        assets.view3d
      );

    item.catalogNormalizedImage =
      true;

    item.catalogNormalizedBuild =
      BUILD;

    /*
      Grid renderer reads sneaker.image.
    */
    item.image =
      item.catalogGridImage;

    /*
      Normalized bitmap is the sizing authority on the homepage.
    */
    item.autoFit =
      false;

    delete item.display;

    return true;
  }

  function standardizeSold3D(
    item,
    original,
    assets
  ) {
    /*
      Never change the sold Grid source here.
      Formerly Grid remains exactly as it was.
    */
    item.catalogOriginalImage =
      original;

    if (
      SOLD_3D_SOURCE_ONLY_IDS.has(
        String(item?.id || "")
      )
    ) {
      /*
        Explicitly remove any stale normalized target inherited from a
        prior runtime so catalog-standardization-final.js cannot swap in
        the old bitmap.
      */
      delete item.catalog3DImage;
      item.catalogSold3DSourceOnly =
        true;

      return true;
    }

    if (!assets?.view3d) {
      return false;
    }

    item.catalog3DImage =
      revisionedAsset(
        assets.view3d
      );

    item.catalogNormalized3DOnly =
      true;

    item.catalogNormalizedBuild =
      BUILD;

    /*
      DO NOT:
      - change item.image
      - delete item.display
      - touch Grid calibration
    */
    return true;
  }

  function standardizeItem(item) {
    if (
      !item ||
      typeof item !== "object"
    ) {
      return false;
    }

    const original =
      originalImage(item);

    if (!original) {
      return false;
    }

    const assets =
      normalizedAssets(
        original
      );

    return (
      statusOf(item) === "sold"
        ? standardizeSold3D(
            item,
            original,
            assets
          )
        : standardizeOwned(
            item,
            original,
            assets
          )
    );
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

  const result =
    standardizeCollection();

  window.CatalogImageNormalization = {
    build: BUILD,
    assetRevision: ASSET_REVISION,
    standardizeCollection,
    standardizeItem,
    derivedNormalizedPath,
    normalizedAssets,
    generatedMap
  };

  console.info(
    `[Catalog Images] ${result.standardized} item(s) prepared ` +
    `for Grid/3D normalization (v5).`
  );
})();
