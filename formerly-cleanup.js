/* =========================================================
   LỘC AN — FORMERLY IN COLLECTION CLEANUP v2

   EXACT SCOPE
   -----------
   1) Remove PRE-OWNED visual badges from Formerly in Collection
      cards in both Grid and 3D.
   2) Remove the injected PRE-OWNED collection-status row from
      sold/formerly detail pages.
   3) Balenciaga Defender 'Beige' 3D:
      - keep the approved 56% visual size
      - apply that size BEFORE the 3D card's first paint
      - no post-render resize, so mobile swipe does not jump
        from large -> small.

   DOES NOT CHANGE
   ---------------
   - collection filtering / OWN-SOLD separation
   - "FORMERLY IN COLLECTION" filter button
   - sneaker data, stories, metadata, condition, size
   - Grid image sizing
   - IN COLLECTION
   - current standard-v4b normalization assets
   - any other sneaker's 3D sizing
========================================================= */
(() => {
  "use strict";

  const STYLE_ID =
    "locan-formerly-cleanup-v2";

  const BALENCIAGA_ID =
    "balenciaga-defender-beige";

  const BALENCIAGA_3D_SIZE =
    "56%";

  let scheduled = false;

  function installStyles() {
    document
      .getElementById(
        "locan-formerly-cleanup-v1"
      )
      ?.remove();

    document
      .getElementById(STYLE_ID)
      ?.remove();

    const style =
      document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `
      /*
        Presentation cleanup.
      */
      .collection-sold-badge,
      .preowned-3d-badge,
      .collection-status-detail-item {
        display: none !important;
      }

      /*
        BALENCIAGA 3D — FRAME-ZERO SIZE AUTHORITY
        -----------------------------------------
        This rule exists BEFORE a 3D Balenciaga card is inserted.
        The browser therefore lays the image out at the approved
        size immediately instead of rendering the former 62% box
        and shrinking it afterward.

        Grid is untouched because the selector requires
        .sneaker-3d-image.
      */
      html body #sneaker-grid
      .sneaker-3d-image
      img[data-sneaker-id="${BALENCIAGA_ID}"] {
        width: ${BALENCIAGA_3D_SIZE} !important;
        height: ${BALENCIAGA_3D_SIZE} !important;
        max-width: ${BALENCIAGA_3D_SIZE} !important;
        max-height: ${BALENCIAGA_3D_SIZE} !important;

        object-fit: contain !important;
        object-position: center center !important;
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

  function clean() {
    scheduled = false;

    removeGridSoldBadge();
    remove3DBadges();
    removeDetailStatus();
  }

  function scheduleClean() {
    if (scheduled) {
      return;
    }

    scheduled = true;

    requestAnimationFrame(clean);
  }

  function observe() {
    if (
      !document.body ||
      document.body.dataset
        .formerlyCleanupV2Observed ===
        "true"
    ) {
      return;
    }

    document.body.dataset
      .formerlyCleanupV2Observed =
        "true";

    /*
      Important performance change from v1:
      observe DOM additions only.
      We no longer watch style/src mutations while the 3D carousel
      is moving, so swipe transforms do not cause cleanup work.
    */
    const observer =
      new MutationObserver(
        mutations => {
          if (
            mutations.some(
              mutation =>
                mutation.type ===
                  "childList" &&
                mutation.addedNodes.length > 0
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
    clean();
    observe();

    /*
      Small stabilization passes only for badges/detail status.
      No image resizing occurs here.
    */
    [0, 80, 250]
      .forEach(delay => {
        setTimeout(
          clean,
          delay
        );
      });
  }

  /*
    Install the Balenciaga sizing rule immediately when this file
    is evaluated. Because the script is at the end of the page,
    <head> already exists, and the rule is ready before later
    carousel interactions create/recreate 3D cards.
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
    () => {
      clean();
    },
    { once: true }
  );
})();
