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
