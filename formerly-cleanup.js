/* =========================================================
   LỘC AN — FORMERLY IN COLLECTION CLEANUP v1

   EXACT SCOPE
   -----------
   1) Remove PRE-OWNED visual badges from Formerly in Collection
      cards in both Grid and 3D.
   2) Remove the injected PRE-OWNED collection-status row from
      sold/formerly detail pages.
   3) Reduce ONLY Balenciaga Defender 'Beige' in 3D.
      Grid remains untouched.

   DOES NOT CHANGE
   ---------------
   - collection filtering / OWN-SOLD separation
   - "FORMERLY IN COLLECTION" filter button
   - sneaker data, stories, metadata, condition, size
   - Grid image sizing
   - IN COLLECTION
   - current v4b normalization assets
========================================================= */
(() => {
  "use strict";

  const STYLE_ID =
    "locan-formerly-cleanup-v1";

  const BALENCIAGA_ID =
    "balenciaga-defender-beige";

  /*
    The current active PRE-OWNED 3D renderer sets former-pair
    image boxes to 62%. Balenciaga reads larger than the other
    archive pairs because its source composition fills more of
    that box. 56% is a small ~9.7% reduction of that existing
    62% box and applies ONLY in 3D.
  */
  const BALENCIAGA_3D_SIZE =
    "56%";

  let scheduled = false;

  function installStyles() {
    document
      .getElementById(STYLE_ID)
      ?.remove();

    const style =
      document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `
      /*
        Hide immediately so a legacy renderer cannot flash the badge
        before the DOM cleanup pass runs.
      */
      .collection-sold-badge,
      .preowned-3d-badge,
      .collection-status-detail-item {
        display: none !important;
      }
    `;

    document.head.appendChild(style);
  }

  function removeGridSoldBadge() {
    document
      .querySelectorAll(
        ".collection-sold-badge"
      )
      .forEach(
        badge => badge.remove()
      );

    /*
      Restore the original Grid meta structure:
      [edition badge] [size]
      instead of keeping the wrapper that existed only to hold
      [edition badge + PRE-OWNED badge].
    */
    document
      .querySelectorAll(
        ".card-edition-status"
      )
      .forEach(wrapper => {
        const meta =
          wrapper.closest(".card-meta");

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
      });
  }

  function remove3DBadges() {
    document
      .querySelectorAll(
        ".preowned-3d-badge"
      )
      .forEach(
        badge => badge.remove()
      );
  }

  function removeDetailStatus() {
    document
      .querySelectorAll(
        ".collection-status-detail-item"
      )
      .forEach(
        item => item.remove()
      );

    /*
      Defensive cleanup in case an older patch created the two
      status nodes without the expected wrapper class.
    */
    const value =
      document.getElementById(
        "shoe-collection-status"
      );

    const label =
      document.getElementById(
        "label-collection-status"
      );

    value
      ?.closest(".spec-item")
      ?.remove();

    if (
      label &&
      document.contains(label)
    ) {
      label
        .closest(".spec-item")
        ?.remove();
    }
  }

  function fineTuneBalenciaga3D() {
    document
      .querySelectorAll(
        '#sneaker-grid .sneaker-3d-image ' +
        `img[data-sneaker-id="${BALENCIAGA_ID}"]`
      )
      .forEach(img => {
        /*
          Width/height are used deliberately because the existing
          former-collection renderer already controls sold-pair
          sizing through the same properties. This changes only
          Balenciaga's 3D box and does not touch Grid transforms.
        */
        const currentWidth =
          img.style.getPropertyValue(
            "width"
          );

        const currentPriority =
          img.style.getPropertyPriority(
            "width"
          );

        if (
          currentWidth !==
            BALENCIAGA_3D_SIZE ||
          currentPriority !==
            "important"
        ) {
          img.style.setProperty(
            "width",
            BALENCIAGA_3D_SIZE,
            "important"
          );

          img.style.setProperty(
            "height",
            BALENCIAGA_3D_SIZE,
            "important"
          );

          img.style.setProperty(
            "max-width",
            BALENCIAGA_3D_SIZE,
            "important"
          );

          img.style.setProperty(
            "max-height",
            BALENCIAGA_3D_SIZE,
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
        }

        img.dataset.formerly3dFineTune =
          "balenciaga-defender";
      });
  }

  function clean() {
    scheduled = false;

    removeGridSoldBadge();
    remove3DBadges();
    removeDetailStatus();
    fineTuneBalenciaga3D();
  }

  function scheduleClean() {
    if (scheduled) {
      return;
    }

    scheduled = true;

    requestAnimationFrame(() => {
      clean();

      /*
        Legacy renderers also perform requestAnimationFrame callbacks.
        One short follow-up catches a badge or inline 62% size written
        immediately after the first cleanup pass.
      */
      setTimeout(
        clean,
        40
      );
    });
  }

  function observe() {
    if (
      !document.body ||
      document.body.dataset
        .formerlyCleanupObserved ===
        "true"
    ) {
      return;
    }

    document.body.dataset
      .formerlyCleanupObserved =
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
              (
                mutation.attributeName ===
                  "style" ||
                mutation.attributeName ===
                  "src"
              )
            ) {
              const target =
                mutation.target;

              if (
                target instanceof
                  HTMLImageElement &&
                target.dataset
                  .sneakerId ===
                  BALENCIAGA_ID
              ) {
                relevant = true;
                break;
              }
            }
          }

          if (relevant) {
            scheduleClean();
          }
        }
      );

    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: [
          "style",
          "src"
        ]
      }
    );
  }

  function init() {
    installStyles();
    clean();
    observe();

    /*
      data.js / collection-view.js finish some renderer wrappers
      on window.load. These final passes keep this file as the
      last presentation authority without replacing any renderer.
    */
    [0, 60, 180, 400]
      .forEach(delay => {
        setTimeout(
          clean,
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
      init,
      { once: true }
    );
  } else {
    init();
  }

  window.addEventListener(
    "load",
    () => {
      [0, 80, 250]
        .forEach(delay =>
          setTimeout(
            clean,
            delay
          )
        );
    },
    { once: true }
  );
})();
