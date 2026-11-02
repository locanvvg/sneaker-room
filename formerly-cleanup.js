/* =========================================================
   LỘC AN — FORMERLY IN COLLECTION CLEANUP v4
   2026-11-01

   PRESENTATION ONLY.
   No image width, height, scale, transform, auto-fit, or sneaker-specific
   sizing logic exists in this file.
========================================================= */
(() => {
  "use strict";

  const STYLE_ID =
    "locan-formerly-cleanup-v4";

  let scheduled =
    false;

  function installStyles() {
    [
      "locan-formerly-cleanup-v1",
      "locan-formerly-cleanup-v2",
      "locan-formerly-cleanup-v3",
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
    `;

    document.head
      .appendChild(
        style
      );
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

    document
      .getElementById(
        "shoe-collection-status"
      )
      ?.closest(
        ".spec-item"
      )
      ?.remove();

    document
      .getElementById(
        "label-collection-status"
      )
      ?.closest(
        ".spec-item"
      )
      ?.remove();
  }

  function clean() {
    scheduled =
      false;

    removeGridSoldBadge();
    remove3DBadges();
    removeDetailStatus();
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
        .formerlyCleanupV4Observed ===
        "true"
    ) {
      return;
    }

    document.body.dataset
      .formerlyCleanupV4Observed =
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
        childList:
          true,
        subtree:
          true
      }
    );
  }

  function init() {
    installStyles();
    clean();
    observe();
  }

  installStyles();

  if (
    document.readyState ===
      "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once:
          true
      }
    );
  } else {
    init();
  }

  window.addEventListener(
    "load",
    clean,
    {
      once:
        true
    }
  );
})();
