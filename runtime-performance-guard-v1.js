/* =========================================================
   LỘC AN — RUNTIME PERFORMANCE GUARD v1

   Purpose
   -------
   Stop three known MutationObserver feedback loops without
   changing any catalog data, filters, rendering, or visuals.

   Suppressed observers:
   1) localization-patch.js -> scheduleApply/applyAll loop
   2) catalog-additions.js -> public status-label sync loop
   3) current-site-adjustments.js archival-note observer on
      pages that are NOT shoe detail pages

   Every other MutationObserver remains native and unchanged.
========================================================= */
(() => {
  "use strict";

  if (
    window.__locanRuntimePerformanceGuardV1 ||
    typeof window.MutationObserver !== "function"
  ) {
    return;
  }

  window.__locanRuntimePerformanceGuardV1 = true;

  const NativeMutationObserver =
    window.MutationObserver;

  function sourceOf(callback) {
    try {
      return Function.prototype.toString.call(callback);
    } catch (_) {
      return "";
    }
  }

  function shouldSuppress(callback) {
    if (typeof callback !== "function") {
      return false;
    }

    const name =
      String(callback.name || "");

    const source =
      sourceOf(callback);

    /*
      localization-patch.js:
      observer -> scheduleApply -> applyAll -> textContent writes
      -> observer again. Initial/load/language-click synchronization
      remains intact, so only the feedback observer is removed.
    */
    if (
      name === "scheduleApply" &&
      source.includes("applyAll")
    ) {
      return true;
    }

    /*
      catalog-additions.js:
      observer -> schedulePublicLabelSync ->
      syncPublicOwnershipLabels -> textContent writes ->
      observer again. Existing timed/load/language hooks remain.
    */
    if (
      name === "schedulePublicLabelSync" &&
      source.includes("syncPublicOwnershipLabels")
    ) {
      return true;
    }

    /*
      The archive-note observer is useful only on shoe detail pages.
      On homepage/timeline it scanned the full page after unrelated
      DOM additions. Preserve it on detail pages.
    */
    const hasShoeDetailGallery =
      Boolean(
        document.querySelector(
          ".shoe-image-section, #shoe-image"
        )
      );

    if (
      !hasShoeDetailGallery &&
      source.includes("patchArchivalNote")
    ) {
      return true;
    }

    return false;
  }

  class GuardedMutationObserver {
    constructor(callback) {
      this.__locanSuppressed =
        shouldSuppress(callback);

      this.__nativeObserver =
        this.__locanSuppressed
          ? null
          : new NativeMutationObserver(callback);
    }

    observe(target, options) {
      if (this.__nativeObserver) {
        return this.__nativeObserver.observe(
          target,
          options
        );
      }
    }

    disconnect() {
      this.__nativeObserver?.disconnect();
    }

    takeRecords() {
      return (
        this.__nativeObserver?.takeRecords() ||
        []
      );
    }
  }

  window.__LOCAN_NATIVE_MUTATION_OBSERVER__ =
    NativeMutationObserver;

  window.MutationObserver =
    GuardedMutationObserver;

  if (
    window.WebKitMutationObserver ===
    NativeMutationObserver
  ) {
    window.WebKitMutationObserver =
      GuardedMutationObserver;
  }
})();


/* =========================================================
   LỘC AN — HOMEPAGE OPENING v1

   LỘC AN
   PRIVATE COLLECTION

   Runs once per browser tab/session.
========================================================= */
(() => {
  "use strict";

  const INTRO_KEY =
    "locan-home-opening-v1";

  const LIVE_RESTORE_KEY =
    "locan-live-restore-v20";

  const LIVE_RESTORE_FRESH =
    "20261013-v20";

  const root =
    document.documentElement;

  const isHomepage =
    Boolean(
      document.getElementById(
        "sneaker-grid"
      )
    );

  if (!isHomepage) {
    return;
  }

  let introAlreadyShown =
    false;

  try {
    introAlreadyShown =
      sessionStorage.getItem(
        INTRO_KEY
      ) === "1";
  } catch (_) {}

  /*
    Repeat visit inside the same tab/session:
    remove the CSS pre-cover immediately and show the homepage.
  */
  if (introAlreadyShown) {
    root.classList.add(
      "locan-home-opening-skip"
    );

    return;
  }

  /*
    index.html's existing LIVE RESTORE performs one fresh reload per tab.
    Do not begin the opening on the throwaway pre-reload document.
    Keep the CSS pre-cover black until that reload happens.
  */
  let liveRestoreStarted =
    false;

  try {
    liveRestoreStarted =
      sessionStorage.getItem(
        LIVE_RESTORE_KEY
      ) === "1";
  } catch (_) {}

  const params =
    new URLSearchParams(
      window.location.search
    );

  const isFreshDocument =
    params.get("fresh") ===
      LIVE_RESTORE_FRESH;

  if (
    liveRestoreStarted &&
    !isFreshDocument
  ) {
    return;
  }

  const reducedMotion =
    Boolean(
      window.matchMedia?.(
        "(prefers-reduced-motion: reduce)"
      )?.matches
    );

  const overlay =
    document.createElement("div");

  overlay.className =
    "locan-home-opening";

  overlay.setAttribute(
    "aria-hidden",
    "true"
  );

  overlay.innerHTML = `
    <div
      class="locan-home-opening-panel left"
    ></div>

    <div
      class="locan-home-opening-panel right"
    ></div>

    <div
      class="locan-home-opening-content"
    >
      <div
        class="locan-home-opening-brand"
      >
        LỘC AN
      </div>

      <div
        class="locan-home-opening-subtitle"
      >
        PRIVATE COLLECTION
      </div>

      <div
        class="locan-home-opening-line"
      ></div>
    </div>
  `;

  document.body.prepend(
    overlay
  );

  /*
    The real overlay is now mounted.
    Remove the temporary CSS pre-cover underneath it.
  */
  root.classList.add(
    "locan-home-opening-mounted"
  );

  try {
    sessionStorage.setItem(
      INTRO_KEY,
      "1"
    );
  } catch (_) {}

  const activateDelay =
    reducedMotion ? 20 : 45;

  const revealDelay =
    reducedMotion ? 170 : 800;

  const finishDelay =
    reducedMotion ? 300 : 1430;

  let finished =
    false;

  function finishOpening() {
    if (finished) return;

    finished = true;

    overlay.remove();

    root.classList.remove(
      "locan-home-opening-mounted"
    );

    root.classList.add(
      "locan-home-opening-skip"
    );
  }

  window.setTimeout(
    () => {
      overlay.classList.add(
        "is-active"
      );
    },
    activateDelay
  );

  window.setTimeout(
    () => {
      overlay.classList.add(
        "is-revealing"
      );
    },
    revealDelay
  );

  window.setTimeout(
    finishOpening,
    finishDelay
  );

  /*
    Safety: if anything delays animation completion,
    never trap the user behind the opening layer.
  */
  window.setTimeout(
    finishOpening,
    2400
  );
})();
