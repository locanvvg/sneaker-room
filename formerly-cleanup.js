/* =========================================================
   LỘC AN — FORMERLY IN COLLECTION CLEANUP v3

   EXACT SCOPE
   -----------
   1) Remove PRE-OWNED visual badges.
   2) Remove the sold-status row from sold detail pages.
   3) FORMERLY 3D:
      - normalized derivatives use the common normalized authority.
      - source-only sold assets use one shared alpha-bounds auto-fit.
   4) Remove the old Balenciaga 56% 3D exception.

   DOES NOT CHANGE
   ---------------
   - Grid image sizing
   - IN COLLECTION sizing
   - detail-page image sizing
   - stories / metadata
========================================================= */
(() => {
  "use strict";

  const STYLE_ID =
    "locan-formerly-cleanup-v3";

  const SOURCE_TARGET = {
    desktop: {
      width: 0.80,
      height: 0.66
    },
    mobile: {
      width: 0.66,
      height: 0.54
    },
    alphaThreshold: 18,
    sampleMax: 300,
    minScale: 0.40,
    maxScale: 1.45
  };

  let scheduled = false;

  function sneakerById(id) {
    if (
      typeof sneakers ===
        "undefined" ||
      !Array.isArray(sneakers)
    ) {
      return null;
    }

    return sneakers.find(
      item =>
        String(item?.id || "") ===
        String(id || "")
    ) || null;
  }

  function isSold(item) {
    return (
      String(
        item?.collectionStatus || "own"
      )
        .trim()
        .toLowerCase() === "sold"
    );
  }

  function cleanPath(value) {
    return String(value || "")
      .split("?")[0]
      .split("#")[0]
      .replace(/^\.\//, "")
      .trim();
  }

  function installStyles() {
    [
      "locan-formerly-cleanup-v1",
      "locan-formerly-cleanup-v2",
      STYLE_ID
    ].forEach(
      id =>
        document
          .getElementById(id)
          ?.remove()
    );

    const style =
      document.createElement(
        "style"
      );

    style.id =
      STYLE_ID;

    style.textContent = `
      .collection-sold-badge,
      .preowned-3d-badge,
      .collection-status-detail-item {
        display: none !important;
      }

      /*
        IMPORTANT:
        v2's Balenciaga width:56% rule is intentionally gone.
        No sold pair gets a fixed pair-specific box here.
      */
    `;

    document.head
      .appendChild(style);
  }

  function removeGridSoldBadge() {
    document
      .querySelectorAll(
        ".collection-sold-badge"
      )
      .forEach(
        badge =>
          badge.remove()
      );

    document
      .querySelectorAll(
        ".card-edition-status"
      )
      .forEach(
        wrapper => {
          const meta =
            wrapper.closest(
              ".card-meta"
            );

          const editionBadge =
            wrapper.querySelector(
              ".badge:not(.collection-sold-badge)"
            );

          if (
            meta &&
            editionBadge
          ) {
            meta.insertBefore(
              editionBadge,
              wrapper
            );
          }

          wrapper.remove();
        }
      );
  }

  function remove3DBadges() {
    document
      .querySelectorAll(
        ".preowned-3d-badge"
      )
      .forEach(
        badge =>
          badge.remove()
      );
  }

  function removeDetailStatus() {
    document
      .querySelectorAll(
        ".collection-status-detail-item"
      )
      .forEach(
        item =>
          item.remove()
      );

    const value =
      document.getElementById(
        "shoe-collection-status"
      );

    const label =
      document.getElementById(
        "label-collection-status"
      );

    value
      ?.closest(
        ".spec-item"
      )
      ?.remove();

    if (
      label &&
      document.contains(label)
    ) {
      label
        .closest(
          ".spec-item"
        )
        ?.remove();
    }
  }

  function alphaBounds(img) {
    if (
      !img?.naturalWidth ||
      !img?.naturalHeight
    ) {
      return null;
    }

    const sampleScale =
      Math.min(
        1,
        SOURCE_TARGET.sampleMax /
        Math.max(
          img.naturalWidth,
          img.naturalHeight
        )
      );

    const width =
      Math.max(
        1,
        Math.round(
          img.naturalWidth *
          sampleScale
        )
      );

    const height =
      Math.max(
        1,
        Math.round(
          img.naturalHeight *
          sampleScale
        )
      );

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width =
      width;

    canvas.height =
      height;

    const context =
      canvas.getContext(
        "2d",
        {
          willReadFrequently:
            true
        }
      );

    if (!context) {
      return null;
    }

    try {
      context.clearRect(
        0,
        0,
        width,
        height
      );

      context.drawImage(
        img,
        0,
        0,
        width,
        height
      );

      const data =
        context.getImageData(
          0,
          0,
          width,
          height
        ).data;

      let minX = width;
      let minY = height;
      let maxX = -1;
      let maxY = -1;

      for (
        let y = 0;
        y < height;
        y += 1
      ) {
        for (
          let x = 0;
          x < width;
          x += 1
        ) {
          const alpha =
            data[
              (
                y * width +
                x
              ) * 4 + 3
            ];

          if (
            alpha <=
            SOURCE_TARGET.alphaThreshold
          ) {
            continue;
          }

          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }

      if (
        maxX < minX ||
        maxY < minY
      ) {
        return null;
      }

      return {
        left:
          minX / width,
        top:
          minY / height,
        right:
          (maxX + 1) / width,
        bottom:
          (maxY + 1) / height
      };
    } catch (_) {
      return null;
    }
  }

  function isNormalizedImage(img) {
    const source =
      cleanPath(
        img?.getAttribute(
          "src"
        ) ||
        img?.dataset?.src ||
        ""
      );

    return source.includes(
      "pictures/normalized/"
    );
  }

  function fitSourceSold3D(img) {
    if (
      !(img instanceof
        HTMLImageElement)
    ) {
      return;
    }

    const item =
      sneakerById(
        img.dataset
          .sneakerId
      );

    if (
      !item ||
      !isSold(item) ||
      isNormalizedImage(img)
    ) {
      return;
    }

    if (
      !img.complete ||
      !img.naturalWidth ||
      !img.naturalHeight
    ) {
      return;
    }

    const frame =
      img.closest(
        ".sneaker-3d-image"
      );

    if (!frame) {
      return;
    }

    const rect =
      frame.getBoundingClientRect();

    const elementWidth =
      rect.width;

    const elementHeight =
      rect.height;

    if (
      !elementWidth ||
      !elementHeight
    ) {
      return;
    }

    const bounds =
      alphaBounds(img);

    if (!bounds) {
      return;
    }

    /*
      Use the exact same target geometry as CatalogDisplay.
      Inline !important is intentional: it is the FINAL authority for
      source-only SOLD 3D and defeats historical per-pair transforms.
    */
    const target =
      window.matchMedia(
        "(max-width: 650px)"
      ).matches
        ? SOURCE_TARGET.mobile
        : SOURCE_TARGET.desktop;

    const baseScale =
      Math.min(
        elementWidth /
          img.naturalWidth,
        elementHeight /
          img.naturalHeight
      );

    const renderedWidth =
      img.naturalWidth *
      baseScale;

    const renderedHeight =
      img.naturalHeight *
      baseScale;

    const offsetX =
      (
        elementWidth -
        renderedWidth
      ) / 2;

    const offsetY =
      (
        elementHeight -
        renderedHeight
      ) / 2;

    const bboxWidth =
      (
        bounds.right -
        bounds.left
      ) *
      renderedWidth;

    const bboxHeight =
      (
        bounds.bottom -
        bounds.top
      ) *
      renderedHeight;

    let fitScale =
      Math.min(
        (
          elementWidth *
          target.width
        ) /
        Math.max(
          bboxWidth,
          1
        ),
        (
          elementHeight *
          target.height
        ) /
        Math.max(
          bboxHeight,
          1
        )
      );

    fitScale =
      Math.max(
        SOURCE_TARGET.minScale,
        Math.min(
          SOURCE_TARGET.maxScale,
          fitScale
        )
      );

    const centerX =
      offsetX +
      (
        (
          bounds.left +
          bounds.right
        ) / 2
      ) *
      renderedWidth;

    const centerY =
      offsetY +
      (
        (
          bounds.top +
          bounds.bottom
        ) / 2
      ) *
      renderedHeight;

    const dxPercent =
      (
        (
          elementWidth / 2 -
          centerX
        ) /
        elementWidth
      ) * 100;

    const dyPercent =
      (
        (
          elementHeight / 2 -
          centerY
        ) /
        elementHeight
      ) * 100;

    img.style.setProperty(
      "width",
      "100%",
      "important"
    );

    img.style.setProperty(
      "height",
      "100%",
      "important"
    );

    img.style.setProperty(
      "max-width",
      "100%",
      "important"
    );

    img.style.setProperty(
      "max-height",
      "100%",
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

    img.style.setProperty(
      "transform",
      "none",
      "important"
    );

    img.style.setProperty(
      "scale",
      `${fitScale} ${fitScale}`,
      "important"
    );

    img.style.setProperty(
      "translate",
      `${dxPercent}% ${dyPercent}%`,
      "important"
    );

    img.style.setProperty(
      "transform-origin",
      "center center",
      "important"
    );

    img.dataset
      .sold3dSourceFit =
        "true";

    img.dataset
      .sold3dAutoScale =
        fitScale.toFixed(4);
  }

  function bindSourceFit(img) {
    if (
      !(img instanceof
        HTMLImageElement)
    ) {
      return;
    }

    if (
      img.dataset
        .sold3dFitBound !==
        "true"
    ) {
      img.dataset
        .sold3dFitBound =
          "true";

      img.addEventListener(
        "load",
        () => {
          requestAnimationFrame(
            () =>
              fitSourceSold3D(
                img
              )
          );
        },
        {
          passive: true
        }
      );
    }

    fitSourceSold3D(
      img
    );
  }

  function fitSold3D() {
    document
      .querySelectorAll(
        "#sneaker-grid " +
        ".sneaker-3d-card.is-preowned-3d " +
        ".sneaker-3d-image img[data-sneaker-id]"
      )
      .forEach(
        bindSourceFit
      );
  }

  function clean() {
    scheduled =
      false;

    removeGridSoldBadge();
    remove3DBadges();
    removeDetailStatus();
    fitSold3D();
  }

  function scheduleClean() {
    if (scheduled) {
      return;
    }

    scheduled =
      true;

    requestAnimationFrame(
      clean
    );
  }

  function observe() {
    if (
      !document.body ||
      document.body.dataset
        .formerlyCleanupV3Observed ===
        "true"
    ) {
      return;
    }

    document.body.dataset
      .formerlyCleanupV3Observed =
        "true";

    const observer =
      new MutationObserver(
        mutations => {
          if (
            mutations.some(
              mutation =>
                mutation.type ===
                  "childList" &&
                mutation
                  .addedNodes
                  .length > 0
            )
          ) {
            scheduleClean();
          }
        }
      );

    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );
  }

  function init() {
    installStyles();
    clean();
    observe();

    [
      0,
      80,
      250,
      600
    ].forEach(
      delay => {
        setTimeout(
          clean,
          delay
        );
      }
    );
  }

  /*
    Install immediately so the old v2 Balenciaga rule is removed before
    later interactions create/recreate cards.
  */
  installStyles();

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

  window.addEventListener(
    "load",
    clean,
    { once: true }
  );

  window.addEventListener(
    "resize",
    () => {
      window.setTimeout(
        fitSold3D,
        80
      );
    },
    {
      passive: true
    }
  );
})();
