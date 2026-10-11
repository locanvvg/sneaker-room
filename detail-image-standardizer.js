/* =========================================================
   LỘC AN — IN-COLLECTION DETAIL IMAGE STANDARDIZER v1

   SCOPE
   -----
   - shoe.html only
   - IN COLLECTION ("own") sneaker detail pages only
   - current standard-v4b generated assets only
   - hero image + gallery thumbnails
   - desktop, tablet, mobile and other viewport sizes

   NON-GOALS
   ---------
   - does not change homepage Grid / 3D
   - does not change sneaker data, stories, metadata or image order
   - does not change Formerly in Collection
   - does not generate or use v5 assets
========================================================= */
(() => {
  "use strict";

  const DETAIL_BUILD = "20261011-detail-v1";
  const NORMALIZED_ROOT = "pictures/normalized/v4b/";

  function cleanPath(value) {
    let path = String(value || "")
      .trim()
      .split("#")[0]
      .split("?")[0]
      .replace(/^\.\//, "");

    if (!path) {
      return "";
    }

    /*
      getAttribute("src") is normally relative, but keep this safe if a
      browser or future renderer supplies an absolute same-site URL.
    */
    if (/^https?:\/\//i.test(path)) {
      try {
        const url = new URL(path);
        const marker = "/pictures/";
        const index = url.pathname.indexOf(marker);

        if (index >= 0) {
          path = url.pathname.slice(index + 1);
        }
      } catch (_) {
        return "";
      }
    }

    return path;
  }

  function currentSneaker() {
    if (
      typeof sneakers === "undefined" ||
      !Array.isArray(sneakers)
    ) {
      return null;
    }

    const id =
      new URLSearchParams(
        window.location.search
      ).get("id");

    if (!id) {
      return null;
    }

    return (
      sneakers.find(
        item =>
          String(item?.id || "") ===
          String(id)
      ) || null
    );
  }

  function isInCollection(item) {
    return String(
      item?.collectionStatus || "own"
    )
      .trim()
      .toLowerCase() === "own";
  }

  function normalizedV4bPath(source) {
    let path = cleanPath(source);

    if (!path) {
      return "";
    }

    /*
      Already standardized: keep it exactly as-is.
    */
    if (
      path.startsWith(
        NORMALIZED_ROOT
      )
    ) {
      return path;
    }

    if (
      !path.startsWith(
        "pictures/"
      )
    ) {
      return "";
    }

    let relative =
      path.slice(
        "pictures/".length
      );

    /*
      The current v4b build treats pictures/source/foo.* as the master
      for pictures/foo.* and removes the "source/" prefix in output.
    */
    if (
      relative.startsWith(
        "source/"
      )
    ) {
      relative =
        relative.slice(
          "source/".length
        );
    }

    relative =
      relative.replace(
        /\.(png|jpe?g|webp)$/i,
        ".png"
      );

    return (
      NORMALIZED_ROOT +
      relative
    );
  }

  function resetVisualCalibration(img) {
    /*
      Some legacy detail rules manually scale specific second images.
      v4b already standardizes the bitmap canvas, so those old transforms
      must not be applied again.
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

    img.style.setProperty(
      "object-fit",
      "contain",
      "important"
    );

    img.style.setProperty(
      "object-position",
      "center center",
      "important"
    );

    img.dataset.detailStandardized =
      "true";

    img.dataset.detailStandardBuild =
      DETAIL_BUILD;
  }

  function standardizeImage(img) {
    if (
      !(img instanceof HTMLImageElement)
    ) {
      return;
    }

    const isHero =
      img.id === "shoe-image";

    const isThumbnail =
      Boolean(
        img.closest(
          ".shoe-detail-thumbnail"
        )
      );

    if (
      !isHero &&
      !isThumbnail
    ) {
      return;
    }

    /*
      If the detail renderer switches a gallery image, it writes the
      original source back to #shoe-image. Preserve that source so the
      click behavior and gallery order remain unchanged.
    */
    const raw =
      cleanPath(
        img.getAttribute("src") || ""
      );

    if (!raw) {
      return;
    }

    if (
      raw.startsWith(
        NORMALIZED_ROOT
      )
    ) {
      resetVisualCalibration(img);
      return;
    }

    if (
      img.dataset.detailNormalizedFailed ===
      raw
    ) {
      return;
    }

    const normalized =
      normalizedV4bPath(raw);

    if (!normalized) {
      return;
    }

    img.dataset.detailOriginalSrc =
      raw;

    /*
      Preload before swapping. This prevents a broken thumbnail if an
      asset has not yet been generated for a future upload.
    */
    const probe =
      new Image();

    probe.decoding =
      "async";

    probe.onload =
      () => {
        /*
          The renderer may have changed the image while this preload was
          running. Only replace it if it still represents the same source.
        */
        const current =
          cleanPath(
            img.getAttribute("src") || ""
          );

        if (
          current !== raw &&
          current !== normalized
        ) {
          return;
        }

        img.setAttribute(
          "src",
          normalized
        );

        resetVisualCalibration(
          img
        );
      };

    probe.onerror =
      () => {
        img.dataset.detailNormalizedFailed =
          raw;

        /*
          Keep the original image untouched if a future derivative does
          not exist yet.
        */
        resetVisualCalibration(
          img
        );
      };

    probe.src =
      normalized;
  }

  function standardizeAll() {
    const sneaker =
      currentSneaker();

    if (
      !sneaker ||
      !isInCollection(sneaker)
    ) {
      return;
    }

    const hero =
      document.getElementById(
        "shoe-image"
      );

    if (hero) {
      standardizeImage(hero);
    }

    document
      .querySelectorAll(
        ".shoe-detail-thumbnail img"
      )
      .forEach(
        standardizeImage
      );
  }

  function installObserver() {
    const section =
      document.querySelector(
        ".shoe-image-section"
      );

    if (
      !section ||
      section.dataset.detailStandardObserver ===
        "true"
    ) {
      return;
    }

    section.dataset.detailStandardObserver =
      "true";

    const observer =
      new MutationObserver(
        mutations => {
          let relevant = false;

          for (
            const mutation
            of mutations
          ) {
            if (
              mutation.type ===
              "childList"
            ) {
              relevant = true;
              break;
            }

            if (
              mutation.type ===
                "attributes" &&
              mutation.attributeName ===
                "src"
            ) {
              relevant = true;
              break;
            }
          }

          if (relevant) {
            standardizeAll();
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
  }

  function init() {
    const sneaker =
      currentSneaker();

    /*
      Explicitly leave Formerly in Collection and any other detail page
      exactly as the current repo renders them.
    */
    if (
      !sneaker ||
      !isInCollection(sneaker)
    ) {
      return;
    }

    standardizeAll();
    installObserver();

    /*
      A second pass covers images inserted by the existing gallery
      renderer on the same DOMContentLoaded cycle.
    */
    requestAnimationFrame(
      standardizeAll
    );
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
