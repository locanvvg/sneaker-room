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
   LỘC AN — HOMEPAGE OPENING v3

   LỘC AN
   PRIVATE COLLECTION

   Runs once per browser tab/session.
========================================================= */
(() => {
  "use strict";

  const INTRO_KEY =
    "locan-home-opening-v3";

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
    reducedMotion ? 20 : 90;

  const revealDelay =
    reducedMotion ? 200 : 1180;

  const finishDelay =
    reducedMotion ? 340 : 2000;

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
    3000
  );
})();

/* =========================================================
   LỘC AN — MUSEUM UI POLISH v5
   2026-10-20

   FINAL DISPLAY RULE
   ------------------
   HOMEPAGE:
     - Under sneaker title: YEAR ONLY.

   SHOE DETAIL:
     - No subtitle at all.
     - ABOUT / GIỚI THIỆU stays top-left.
     - Back to Collection moves to the bottom.
     - Clicking About opens a two-column split view:
       shoe page left, About page right.

   TIMELINE:
     - No sneaker subtitle under artifact title.
     - Year is already communicated by the timeline axis.

   WORLD MAP:
     - No descriptive role/subtitle above sneaker title.
     - Geographic explanation remains available under WHY HERE.

   MUSEUM / SLIDESHOW:
     - No sneaker subtitle under title.
     - Existing Museum year + edition metadata remains.

   TIMELINE / WORLD MAP:
     - Shared content width, heading scale, spacing, summary card,
       intro rhythm, and toolbar rhythm.
========================================================= */
(() => {
  "use strict";

  if (window.__locanMuseumUiPolishV5) {
    return;
  }

  window.__locanMuseumUiPolishV5 = true;

  const path =
    String(
      window.location.pathname || ""
    ).toLowerCase();

  const isHomepage =
    /(?:\/|\/index\.html)$/.test(path);

  const isShoeDetail =
    /\/shoe\.html$/.test(path) ||
    Boolean(
      document.getElementById(
        "shoe-detail"
      )
    );

  const isTimeline =
    /\/timeline\.html$/.test(path) ||
    document.body?.classList
      .contains("timeline-page");

  const isGlobe =
    /\/globe\.html$/.test(path) ||
    document.body?.classList
      .contains("globe-page");

  const isMuseum =
    /\/museum\.html$/.test(path) ||
    Boolean(
      document.getElementById(
        "museum-app"
      )
    );

  let patchScheduled =
    false;


  /* =====================================================
     CATALOG HELPERS
  ===================================================== */

  function catalog() {
    return (
      typeof sneakers !== "undefined" &&
      Array.isArray(sneakers)
    )
      ? sneakers
      : [];
  }

  function yearOf(item) {
    if (!item) return "—";

    const candidates = [
      item.releaseDate,
      item.subtitle,
      item.title
    ];

    for (const value of candidates) {
      const text =
        typeof value === "object" &&
        value !== null
          ? [
              value.vi,
              value.en
            ]
              .filter(Boolean)
              .join(" ")
          : String(
              value ?? ""
            );

      const match =
        text.match(
          /\b(19|20)\d{2}\b/
        );

      if (match) {
        return match[0];
      }
    }

    return "—";
  }

  function itemById(id) {
    const key =
      String(id || "");

    if (!key) return null;

    return (
      catalog().find(
        item =>
          String(
            item?.id || ""
          ) === key
      ) ||
      null
    );
  }

  function itemIdFromNode(node) {
    if (!node) return "";

    const direct =
      node.getAttribute?.(
        "data-sneaker-id"
      ) ||
      node.getAttribute?.(
        "data-artifact-id"
      ) ||
      node.getAttribute?.(
        "data-story-id"
      );

    if (direct) {
      return direct;
    }

    const image =
      node.querySelector?.(
        "[data-sneaker-id]"
      );

    if (
      image?.getAttribute(
        "data-sneaker-id"
      )
    ) {
      return image.getAttribute(
        "data-sneaker-id"
      );
    }

    const link =
      node.closest?.(
        "a[href*='shoe.html?id=']"
      ) ||
      node.querySelector?.(
        "a[href*='shoe.html?id=']"
      );

    if (!link) {
      return "";
    }

    try {
      return (
        new URL(
          link.href,
          window.location.href
        )
          .searchParams
          .get("id") ||
        ""
      );
    } catch (_) {
      return "";
    }
  }


  /* =====================================================
     GLOBAL PRESENTATION STYLES
  ===================================================== */

  function installStyles() {
    if (
      document.getElementById(
        "locan-museum-ui-polish-v2-style"
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "locan-museum-ui-polish-v2-style";

    style.textContent = `
      /* ================================================
         FINAL SUBTITLE RULE BY PAGE
      ================================================= */

      /* Detail page: never show model subtitle/year beneath title. */
      #shoe-subtitle {
        display: none !important;
      }

      /* Timeline: timeline axis already communicates the year. */
      .timeline-artifact-subtitle {
        display: none !important;
      }

      /*
        World Map: remove the short geographic role line from each
        sneaker card. The full explanation remains behind WHY HERE.
      */
      .globe-shoe-role {
        display: none !important;
      }

      /* Museum: retain the native Museum year/edition metadata only. */
      #museum-subtitle {
        display: none !important;
      }


      /* ================================================
         DETAIL PAGE — HEADER / BOTTOM BACK BUTTON
      ================================================= */

      body.locan-detail-archive-ui .site-header {
        position: relative !important;
      }

      body.locan-detail-archive-ui
      .site-header-left {
        justify-self: start !important;
      }

      body.locan-detail-archive-ui
      .site-header-left
      .header-about-link {
        display: inline-flex !important;
        align-items: center;
        min-height: 34px;
      }

      /*
        Back to Collection sits directly below the main header,
        before the shoe detail body begins.
      */
      body.locan-detail-archive-ui
      .detail-under-header-nav {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        margin: -10px 0 24px;
      }

      body.locan-detail-archive-ui
      .detail-under-header-back {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        min-height: 36px;
        padding: 6px 0;

        color: #aaa;
        text-decoration: none;

        font-size: .9rem;
        font-weight: 500;
        letter-spacing: 0;

        transition:
          color .18s ease,
          transform .18s ease;
      }

      body.locan-detail-archive-ui
      .detail-under-header-back:hover,
      body.locan-detail-archive-ui
      .detail-under-header-back:focus-visible {
        color: #fff;
        outline: none;
      }

      body.locan-detail-archive-ui
      .detail-under-header-back:active {
        transform: translateX(-1px);
      }

      body.locan-detail-archive-ui
      #detail-about-link,
      body.locan-detail-archive-ui
      #back-link {
        position: relative;
        z-index: 20;
        pointer-events: auto !important;
      }

      @media (max-width: 650px) {
        body.locan-detail-archive-ui
        .detail-under-header-nav {
          margin:
            -2px
            0
            22px;
        }

        body.locan-detail-archive-ui
        .detail-under-header-back {
          font-size: .84rem;
        }
      }


      /* ================================================
         DETAIL ABOUT SPLIT VIEW
      ================================================= */

      .detail-about-split {
        display: none;

        position: fixed;
        z-index: 100000;

        top: 0;
        right: 0;
        bottom: 0;

        width: 46vw;
        min-width: 420px;

        background: #0d0d0d;

        border-left: 1px solid #2a2a2e;
        box-shadow:
          -24px 0 70px rgba(0,0,0,.44);
      }

      body.detail-about-open
      .detail-about-split {
        display: flex;
        flex-direction: column;
      }

      body.detail-about-open {
        overflow: hidden !important;
        padding: 0 !important;
      }

      body.detail-about-open
      > .container {
        box-sizing: border-box;

        width: 54vw !important;
        max-width: none !important;
        height: 100vh;

        margin: 0 !important;
        padding: 20px !important;

        overflow-y: auto;
        overscroll-behavior: contain;
      }

      .detail-about-split-header {
        flex: 0 0 auto;

        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;

        min-height: 62px;
        padding:
          max(13px, env(safe-area-inset-top))
          18px
          13px;

        border-bottom: 1px solid #252529;
        background: #101012;
      }

      .detail-about-split-title {
        color: #f5f5f7;

        font-size: .72rem;
        font-weight: 900;
        letter-spacing: 1.35px;
        text-transform: uppercase;
      }

      .detail-about-split-close {
        width: 36px;
        height: 36px;

        display: inline-grid;
        place-items: center;

        padding: 0;

        border: 1px solid #333338;
        border-radius: 8px;

        background: #18181b;
        color: #a7a7af;

        font: inherit;
        font-size: 1.1rem;

        cursor: pointer;
      }

      .detail-about-split-close:hover,
      .detail-about-split-close:focus-visible {
        color: #050505;
        border-color: #ffcc00;
        background: #ffcc00;
        outline: none;
      }

      .detail-about-frame {
        display: block;
        flex: 1 1 auto;

        width: 100%;
        min-height: 0;

        border: 0;
        background: #0d0d0d;
      }

      /*
        When the viewport is not extremely wide, stack the shoe's own
        image/spec columns inside the LEFT split pane. The page remains
        one side of the two-column split, but its content stays readable.
      */
      @media (max-width: 1400px) {
        body.detail-about-open
        .shoe-detail-container {
          grid-template-columns:
            minmax(0, 1fr) !important;
        }
      }

      /*
        A phone cannot present two useful reading columns.
        Use an About drawer occupying the full viewport while retaining
        the close control. Desktop + iPad keep the requested split.
      */
      @media (max-width: 720px) {
        .detail-about-split {
          width: 100vw;
          min-width: 0;
          left: 0;
        }

        body.detail-about-open
        > .container {
          width: 100% !important;
          visibility: hidden;
        }
      }


      /* ================================================
         TIMELINE + WORLD MAP — ONE VISUAL SYSTEM
      ================================================= */

      body.timeline-page .timeline-container,
      body.globe-page .globe-container {
        width: 100%;
        max-width: 1480px !important;
      }

      body.timeline-page
      .timeline-site-header,
      body.globe-page
      .globe-site-header {
        margin-bottom: 0 !important;
      }

      body.timeline-page
      .timeline-site-header h1,
      body.globe-page
      .globe-site-header h1 {
        font-size: 2rem !important;
        line-height: 1.2 !important;
        letter-spacing: 2px !important;
      }

      body.timeline-page
      #timeline-brand-subtitle,
      body.globe-page
      #globe-brand-subtitle {
        font-size: .95rem !important;
        line-height: 1.5 !important;
      }

      body.timeline-page
      .archive-feature-nav,
      body.globe-page
      .archive-feature-nav {
        gap: 28px !important;
        margin: 18px 0 0 !important;
      }

      body.timeline-page
      .timeline-main,
      body.globe-page
      .globe-main {
        margin-top: 0 !important;
        padding: 48px 0 24px !important;
      }

      body.timeline-page
      .timeline-intro,
      body.globe-page
      .globe-intro {
        box-sizing: border-box;

        display: grid !important;

        grid-template-columns:
          minmax(0, 1fr)
          auto !important;

        align-items: end !important;
        gap: 32px !important;

        margin: 0 !important;
        padding: 0 4px 28px !important;

        border-bottom:
          1px solid #202023 !important;
      }

      body.timeline-page
      .timeline-intro-copy {
        max-width: 880px !important;
      }

      body.timeline-page
      .timeline-eyebrow,
      body.globe-page
      .globe-eyebrow {
        margin: 0 0 12px !important;

        color: #ffcc00 !important;

        font-size: .74rem !important;
        font-weight: 900 !important;
        line-height: 1.2 !important;
        letter-spacing: 2px !important;
      }

      body.timeline-page
      #timeline-title,
      body.globe-page
      #globe-title {
        max-width: 900px !important;

        margin: 0 !important;

        color: #f5f5f7 !important;

        font-size:
          clamp(
            2.35rem,
            4vw,
            4rem
          ) !important;

        font-weight: 900 !important;
        line-height: .98 !important;
        letter-spacing: -1.2px !important;
      }

      body.timeline-page
      #timeline-description,
      body.globe-page
      #globe-description {
        max-width: 820px !important;

        margin: 18px 0 0 !important;

        color: #aaaab2 !important;

        font-size: 1rem !important;
        line-height: 1.7 !important;
      }

      body.timeline-page
      .timeline-summary,
      body.globe-page
      .globe-summary {
        box-sizing: border-box;

        min-width: 142px !important;

        padding:
          20px
          24px !important;

        border:
          1px solid #28282d !important;

        border-radius:
          14px !important;

        background:
          #121214 !important;

        text-align:
          center !important;
      }

      body.timeline-page
      .timeline-summary strong,
      body.globe-page
      .globe-summary strong {
        display: block !important;

        color: #ffcc00 !important;

        font-size: 2rem !important;
        font-weight: 900 !important;
        line-height: 1 !important;
      }

      body.timeline-page
      .timeline-summary span,
      body.globe-page
      .globe-summary span {
        display: block !important;

        margin-top: 8px !important;

        color: #8c8c93 !important;

        font-size: .65rem !important;
        font-weight: 900 !important;
        line-height: 1.2 !important;
        letter-spacing: 1.4px !important;
      }

      body.timeline-page
      .timeline-toolbar,
      body.globe-page
      .globe-toolbar {
        box-sizing: border-box;

        min-height: 78px;

        margin:
          0
          0
          18px !important;

        padding:
          20px
          0 !important;

        border-top:
          0 !important;

        border-bottom:
          1px solid #202023 !important;
      }

      body.timeline-page
      .timeline-filter,
      body.timeline-page
      .timeline-arrow,
      body.globe-page
      .globe-field select,
      body.globe-page
      .globe-reset {
        min-height: 40px !important;

        border-radius:
          9px !important;

        font-size:
          .72rem !important;

        font-weight:
          800 !important;
      }

      @media (max-width: 760px) {
        body.timeline-page
        .timeline-main,
        body.globe-page
        .globe-main {
          padding-top:
            34px !important;
        }

        body.timeline-page
        .timeline-intro,
        body.globe-page
        .globe-intro {
          grid-template-columns:
            minmax(0, 1fr) !important;

          align-items:
            start !important;

          gap:
            20px !important;
        }

        body.timeline-page
        .timeline-summary,
        body.globe-page
        .globe-summary {
          justify-self:
            start !important;

          min-width:
            122px !important;

          padding:
            16px
            18px !important;
        }

        body.timeline-page
        #timeline-title,
        body.globe-page
        #globe-title {
          font-size:
            clamp(
              2.05rem,
              10vw,
              3.05rem
            ) !important;
        }

        body.timeline-page
        .archive-feature-nav,
        body.globe-page
        .archive-feature-nav {
          gap:
            20px !important;

          margin-top:
            16px !important;
        }
      }
    `;

    document.head
      .appendChild(style);
  }


  /* =====================================================
     HOMEPAGE — YEAR ONLY UNDER EACH SNEAKER
  ===================================================== */

  function patchHomepageYears() {
    if (!isHomepage) return;

    document
      .querySelectorAll(
        "#sneaker-grid .card, " +
        "#sneaker-grid .sneaker-3d-card"
      )
      .forEach(card => {
        const item =
          itemById(
            itemIdFromNode(card)
          );

        if (!item) return;

        const year =
          yearOf(item);

        const line =
          card.matches(".card")
            ? card.querySelector(
                ".card-info .subtitle"
              )
            : card.querySelector(
                ".sneaker-3d-info > p"
              );

        if (
          line &&
          line.textContent !== year
        ) {
          line.textContent =
            year;
        }
      });
  }


  /* =====================================================
     DETAIL PAGE — ABOUT LEFT / BACK UNDER HEADER / SPLIT ABOUT
  ===================================================== */

  function detailLanguage() {
    return (
      document.documentElement.lang ===
      "en"
    )
      ? "en"
      : "vi";
  }

  function splitPanel() {
    return document.getElementById(
      "detail-about-split"
    );
  }

  function splitFrame() {
    return document.getElementById(
      "detail-about-frame"
    );
  }

  function injectEmbeddedAboutStyle() {
    const frame =
      splitFrame();

    if (!frame) return;

    let doc;

    try {
      doc =
        frame.contentDocument;
    } catch (_) {
      return;
    }

    if (
      !doc ||
      !doc.head
    ) {
      return;
    }

    if (
      doc.getElementById(
        "locan-about-embed-style"
      )
    ) {
      return;
    }

    const style =
      doc.createElement(
        "style"
      );

    style.id =
      "locan-about-embed-style";

    style.textContent = `
      body {
        margin: 0 !important;
        padding: 0 !important;
        background: #0d0d0d !important;
      }

      body > .container {
        width: 100% !important;
        max-width: none !important;

        margin: 0 !important;
        padding: 22px !important;

        box-sizing: border-box !important;
      }

      .about-header,
      footer {
        display: none !important;
      }

      .about-page {
        width: 100% !important;
        max-width: none !important;

        margin: 0 !important;
        padding: 2px 0 40px !important;
      }

      .about-topic-heading {
        text-align: left !important;
      }

      .about-topic-heading-main {
        text-align: left !important;
      }

      .about-topic-note {
        text-align: left !important;
      }

      @media (max-width: 650px) {
        body > .container {
          padding: 18px !important;
        }
      }
    `;

    doc.head.appendChild(
      style
    );
  }

  function setAboutFrameLanguage(
    lang
  ) {
    const frame =
      splitFrame();

    if (!frame) return;

    try {
      const win =
        frame.contentWindow;

      if (
        typeof win?.setAboutLanguage ===
        "function"
      ) {
        win.setAboutLanguage(
          lang
        );

        injectEmbeddedAboutStyle();

        return;
      }
    } catch (_) {}

    const desired =
      `about.html?lang=${encodeURIComponent(
        lang
      )}&embed=1`;

    if (
      !frame.src ||
      !frame.src.includes(
        `lang=${lang}`
      )
    ) {
      frame.src =
        desired;
    }
  }

  function syncDetailChrome() {
    if (!isShoeDetail) return;

    const lang =
      detailLanguage();

    const about =
      document.getElementById(
        "detail-about-link"
      ) ||
      document.querySelector(
        ".header-about-link"
      );

    const back =
      document.getElementById(
        "back-link"
      );

    const panelTitle =
      document.getElementById(
        "detail-about-split-title"
      );

    if (about) {
      about.textContent =
        lang === "vi"
          ? "GIỚI THIỆU"
          : "ABOUT";

      about.href =
        `about.html?lang=${encodeURIComponent(
          lang
        )}`;
    }

    if (back) {
      back.textContent =
        lang === "vi"
          ? "← QUAY LẠI BỘ SƯU TẬP"
          : "← BACK TO COLLECTION";

      back.href =
        `index.html?lang=${encodeURIComponent(
          lang
        )}`;
    }

    if (panelTitle) {
      panelTitle.textContent =
        lang === "vi"
          ? "GIỚI THIỆU"
          : "ABOUT";
    }

    if (
      document.body.classList
        .contains(
          "detail-about-open"
        )
    ) {
      setAboutFrameLanguage(
        lang
      );
    }
  }

  function closeAboutSplit() {
    if (!isShoeDetail) return;

    document.body.classList
      .remove(
        "detail-about-open"
      );

    splitPanel()
      ?.setAttribute(
        "aria-hidden",
        "true"
      );

    const about =
      document.getElementById(
        "detail-about-link"
      );

    about?.focus();
  }

  function openAboutSplit() {
    if (!isShoeDetail) return;

    const panel =
      splitPanel();

    const frame =
      splitFrame();

    if (
      !panel ||
      !frame
    ) {
      return;
    }

    document.body.classList
      .add(
        "detail-about-open"
      );

    panel.setAttribute(
      "aria-hidden",
      "false"
    );

    setAboutFrameLanguage(
      detailLanguage()
    );

    document
      .getElementById(
        "detail-about-split-close"
      )
      ?.focus();
  }

  function setupDetailUI() {
    if (!isShoeDetail) return;

    const body =
      document.body;

    if (!body) return;

    body.classList.add(
      "locan-detail-archive-ui"
    );

    /*
      Structural setup is safe to call more than once, but every DOM move
      below is idempotent. Never re-parent a node that is already correct.
    */

    /*
      Remove subtitle semantically as well as visually.
      shoe-page.js may still write into it later, but it remains hidden.
    */
    const subtitle =
      document.getElementById(
        "shoe-subtitle"
      );

    if (subtitle) {
      subtitle.setAttribute(
        "aria-hidden",
        "true"
      );
    }

    const header =
      document.querySelector(
        ".site-header"
      );

    const headerLeft =
      document.querySelector(
        ".site-header-left"
      );

    const about =
      document.querySelector(
        ".header-about-link"
      );

    const back =
      document.getElementById(
        "back-link"
      );

    /*
      ABOUT / GIỚI THIỆU becomes the permanent top-left action.
    */
    if (
      headerLeft &&
      about
    ) {
      about.id =
        "detail-about-link";

      /*
        IMPORTANT:
        appendChild() on an element already inside the same parent still
        mutates the DOM. The v3 observer saw that mutation and ran this
        function again forever, which could make the header links appear
        unresponsive. Move the link only when its parent is actually wrong.
      */
      if (
        about.parentElement !==
        headerLeft
      ) {
        headerLeft.appendChild(
          about
        );
      }
    }

    /*
      Back sits immediately below the header and above the shoe body.
      Do not touch the shoe image section or any image calibration.
    */
    if (back) {
      back.classList.remove(
        "detail-bottom-back"
      );

      back.classList.add(
        "detail-under-header-back"
      );

      let underHeader =
        document.querySelector(
          ".detail-under-header-nav"
        );

      if (!underHeader) {
        underHeader =
          document.createElement(
            "div"
          );

        underHeader.className =
          "detail-under-header-nav";

        if (header) {
          header.insertAdjacentElement(
            "afterend",
            underHeader
          );
        }
      }

      /*
        Same idempotency rule as the About link:
        do not mutate the DOM again once Back is already in place.
      */
      if (
        back.parentElement !==
        underHeader
      ) {
        underHeader.appendChild(
          back
        );
      }

      document
        .querySelector(
          ".detail-bottom-nav"
        )
        ?.remove();
    }

    /*
      Build split About reader once.
    */
    if (
      !splitPanel()
    ) {
      const panel =
        document.createElement(
          "section"
        );

      panel.id =
        "detail-about-split";

      panel.className =
        "detail-about-split";

      panel.setAttribute(
        "aria-hidden",
        "true"
      );

      panel.innerHTML = `
        <div class="detail-about-split-header">
          <strong
            class="detail-about-split-title"
            id="detail-about-split-title"
          >
            GIỚI THIỆU
          </strong>

          <button
            type="button"
            class="detail-about-split-close"
            id="detail-about-split-close"
            aria-label="Close About panel"
          >
            ×
          </button>
        </div>

        <iframe
          class="detail-about-frame"
          id="detail-about-frame"
          title="About Lộc An Sneaker Collection"
          loading="eager"
        ></iframe>
      `;

      body.appendChild(
        panel
      );

      document
        .getElementById(
          "detail-about-split-close"
        )
        ?.addEventListener(
          "click",
          closeAboutSplit
        );

      splitFrame()
        ?.addEventListener(
          "load",
          () => {
            injectEmbeddedAboutStyle();

            /*
              Ensure the embedded About uses the same language
              even if its own stored preference differs.
            */
            try {
              const win =
                splitFrame()
                  ?.contentWindow;

              if (
                typeof win?.setAboutLanguage ===
                "function"
              ) {
                win.setAboutLanguage(
                  detailLanguage()
                );
              }
            } catch (_) {}

            injectEmbeddedAboutStyle();
          }
        );
    }

    /*
      Clicking About on a shoe page no longer navigates away.
    */
    const detailAbout =
      document.getElementById(
        "detail-about-link"
      );

    if (
      detailAbout &&
      detailAbout.dataset
        .splitAboutBound !==
        "true"
    ) {
      detailAbout.dataset
        .splitAboutBound =
          "true";

      detailAbout.addEventListener(
        "click",
        event => {
          event.preventDefault();
          openAboutSplit();
        }
      );
    }

    /*
      Keep VI/EN synchronized after shoe-page.js changes <html lang>.
    */
    if (
      document.documentElement.dataset
        .detailLangObserved !==
        "true"
    ) {
      document.documentElement.dataset
        .detailLangObserved =
          "true";

      const langObserver =
        new MutationObserver(
          mutations => {
            if (
              mutations.some(
                mutation =>
                  mutation.type ===
                    "attributes" &&
                  mutation.attributeName ===
                    "lang"
              )
            ) {
              syncDetailChrome();
            }
          }
        );

      langObserver.observe(
        document.documentElement,
        {
          attributes: true,
          attributeFilter: ["lang"]
        }
      );
    }

    if (
      !body.dataset
        .detailEscapeBound
    ) {
      body.dataset
        .detailEscapeBound =
          "true";

      document.addEventListener(
        "keydown",
        event => {
          if (
            event.key === "Escape" &&
            body.classList.contains(
              "detail-about-open"
            )
          ) {
            closeAboutSplit();
          }
        }
      );
    }

    syncDetailChrome();
  }


  /* =====================================================
     DYNAMIC DISPLAY PATCHES
  ===================================================== */

  function patchVisibleUI() {
    patchHomepageYears();

    /*
      CSS handles subtitle removal on Timeline/Map/Museum/Detail.
      Detail DOM/chrome needs a small synchronization pass.
    */
    setupDetailUI();
    syncDetailChrome();
  }

  function schedulePatch() {
    if (patchScheduled) {
      return;
    }

    patchScheduled =
      true;

    requestAnimationFrame(
      () => {
        patchScheduled =
          false;

        patchVisibleUI();
      }
    );
  }


  /* =====================================================
     INIT
  ===================================================== */

  installStyles();

  /*
    shoe.html markup is already available when the runtime file runs
    because scripts are at the bottom of the page.
  */
  setupDetailUI();

  /*
    Homepage renderers / Timeline / Map / Museum create and replace
    content dynamically. Child-list observation keeps the display rule
    stable after filters, language changes, Grid/3D changes, etc.
  */
  function installObserver() {
    if (
      !document.body ||
      document.body.dataset
        .museumUiPolishObserved ===
        "true"
    ) {
      return;
    }

    document.body.dataset
      .museumUiPolishObserved =
        "true";

    const observer =
      new MutationObserver(
        mutations => {
          const meaningful =
            mutations.some(
              mutation => {
                if (
                  mutation.addedNodes
                    .length === 0
                ) {
                  return false;
                }

                const target =
                  mutation.target;

                /*
                  Ignore changes generated inside the About split reader.
                  They do not affect card/subtitle rules and must not wake
                  the main page patcher.
                */
                if (
                  target instanceof Element &&
                  (
                    target.closest(
                      "#detail-about-split"
                    ) ||
                    target.matches(
                      "#detail-about-split"
                    )
                  )
                ) {
                  return false;
                }

                /*
                  Once the navigation nodes are placed, moving them should
                  never be a trigger for another structural pass.
                */
                const onlyNavigationNodes =
                  Array.from(
                    mutation.addedNodes
                  ).every(
                    node =>
                      node instanceof Element &&
                      (
                        node.id ===
                          "detail-about-link" ||
                        node.id ===
                          "back-link" ||
                        node.classList.contains(
                          "detail-under-header-nav"
                        )
                      )
                  );

                return (
                  !onlyNavigationNodes
                );
              }
            );

          if (meaningful) {
            schedulePatch();
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

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        installObserver();

        /*
          Queue after page-specific DOMContentLoaded renderers.
        */
        queueMicrotask(
          patchVisibleUI
        );

        requestAnimationFrame(
          patchVisibleUI
        );
      },
      { once: true }
    );
  } else {
    installObserver();
    patchVisibleUI();
  }
})();

/* =========================================================
   LỘC AN — MOBILE IMAGE RECOVERY v1
   2026-10-20
========================================================= */
(() => {
  "use strict";

  if (window.__locanMobileImageRecoveryV1) return;
  window.__locanMobileImageRecoveryV1 = true;

  const RETRY_REVISION = "20261020-mobile-image-v1";
  let scanScheduled = false;

  function catalog() {
    return (
      typeof sneakers !== "undefined" &&
      Array.isArray(sneakers)
    ) ? sneakers : [];
  }

  function cleanPath(value) {
    return String(value || "")
      .split("?")[0]
      .split("#")[0]
      .replace(/^\.\//, "")
      .trim();
  }

  function addRetryParam(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";

    try {
      const url = new URL(raw, window.location.href);
      url.searchParams.set("mobile_retry", RETRY_REVISION);

      if (url.origin === window.location.origin) {
        const baseDir = window.location.pathname.replace(/[^/]*$/, "");
        const relative = url.pathname.startsWith(baseDir)
          ? url.pathname.slice(baseDir.length)
          : url.pathname.replace(/^\/+/, "");

        return relative + url.search;
      }

      return url.href;
    } catch (_) {
      return raw;
    }
  }

  function itemForImage(img) {
    if (!img) return null;

    const id =
      img.dataset?.sneakerId ||
      img.dataset?.itemId ||
      img.closest?.("[data-sneaker-id]")?.getAttribute("data-sneaker-id") ||
      "";

    if (id) {
      const match = catalog().find(
        item => String(item?.id || "") === String(id)
      );

      if (match) return match;
    }

    if (img.id === "shoe-image") {
      const shoeId =
        new URLSearchParams(window.location.search).get("id");

      return catalog().find(
        item => String(item?.id || "") === String(shoeId || "")
      ) || null;
    }

    return null;
  }

  function originalImageFor(img) {
    const item = itemForImage(img);
    if (!item) return "";

    const candidates = [
      item.catalogOriginalImage,
      item.originalImage,
      Array.isArray(item.images) ? item.images[0] : "",
      item.image
    ];

    for (const candidate of candidates) {
      const value = String(candidate || "").trim();

      if (
        value &&
        !cleanPath(value).startsWith("pictures/normalized/")
      ) {
        return value;
      }
    }

    return "";
  }

  function currentImageUrl(img) {
    return (
      img.getAttribute("src") ||
      img.dataset?.src ||
      ""
    );
  }

  function isNormalizedUrl(value) {
    return cleanPath(value).includes("pictures/normalized/");
  }

  function recoverImage(img) {
    if (!img) return;
    if (img.dataset.mobileImageRecoveryActive === "true") return;

    img.dataset.mobileImageRecoveryActive = "true";

    const current = currentImageUrl(img);
    const stage = Number(img.dataset.mobileImageRecoveryStage || 0);

    // Stage 0: retry same file once with a fresh query.
    if (stage === 0 && current) {
      img.dataset.mobileImageRecoveryStage = "1";
      img.dataset.mobileImageBroken = "true";

      const retry = addRetryParam(current);

      if (retry) {
        img.src = retry;
        img.dataset.mobileImageRecoveryActive = "false";
        return;
      }
    }

    // Stage 1: normalized derivative failed -> exact original sneaker image.
    if (stage <= 1 && isNormalizedUrl(current)) {
      const original = originalImageFor(img);

      if (
        original &&
        cleanPath(original) !== cleanPath(current)
      ) {
        img.dataset.mobileImageRecoveryStage = "2";
        img.dataset.mobileImageFallback = "original";
        img.src = original;

        if (img.dataset?.src) {
          img.dataset.src = original;
        }

        img.dataset.mobileImageRecoveryActive = "false";
        return;
      }
    }

    img.dataset.mobileImageRecoveryStage = String(Math.max(stage, 2));
    img.dataset.mobileImageBroken = "true";
    img.dataset.mobileImageRecoveryActive = "false";
  }

  function bindImage(img) {
    if (!img || img.dataset.mobileImageRecoveryBound === "true") return;

    img.dataset.mobileImageRecoveryBound = "true";

    img.addEventListener(
      "load",
      () => {
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          img.dataset.mobileImageLoaded = "true";
          img.dataset.mobileImageBroken = "false";

          // Re-use the existing fit engine only; no new sizing logic.
          window.CatalogDisplay?.prepareImage?.(img);
        }
      },
      { passive: true }
    );

    img.addEventListener("error", () => {
      img.dataset.mobileImageRecoveryActive = "false";
      recoverImage(img);
    });

    // Image may already be in failed-complete state before listener binds.
    if (
      img.complete &&
      img.getAttribute("src") &&
      img.naturalWidth === 0
    ) {
      recoverImage(img);
    }
  }

  function eligibleImages(root = document) {
    if (!root?.querySelectorAll) return [];

    return root.querySelectorAll([
      "#sneaker-grid img",
      "#shoe-image",
      ".shoe-detail-thumbnail img",
      ".timeline-artifact img",
      ".globe-shoe-card img",
      "#museum-app img",
      ".sneaker-3d-card img"
    ].join(","));
  }

  function scanImages(root = document) {
    eligibleImages(root).forEach(bindImage);
  }

  function scheduleScan() {
    if (scanScheduled) return;
    scanScheduled = true;

    requestAnimationFrame(() => {
      scanScheduled = false;
      scanImages(document);
    });
  }

  function recheckBrokenImages() {
    eligibleImages(document).forEach(img => {
      bindImage(img);

      if (
        img.complete &&
        img.getAttribute("src") &&
        img.naturalWidth === 0
      ) {
        if (Number(img.dataset.mobileImageRecoveryStage || 0) >= 2) {
          img.dataset.mobileImageRecoveryStage = "0";
        }

        img.dataset.mobileImageRecoveryActive = "false";
        recoverImage(img);
      }
    });
  }

  scanImages(document);

  function installImageObserver() {
    if (
      !document.body ||
      document.body.dataset.mobileImageRecoveryObserved === "true"
    ) {
      return;
    }

    document.body.dataset.mobileImageRecoveryObserved = "true";

    const observer = new MutationObserver(mutations => {
      const hasAddedImages =
        mutations.some(mutation =>
          Array.from(mutation.addedNodes).some(node =>
            node instanceof Element &&
            (
              node.matches?.("img") ||
              node.querySelector?.("img")
            )
          )
        );

      if (hasAddedImages) scheduleScan();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        scanImages(document);
        installImageObserver();
      },
      { once: true }
    );
  } else {
    installImageObserver();
    scanImages(document);
  }

  // Mobile Safari often restores via BFCache after app/tab switching.
  window.addEventListener(
    "pageshow",
    () => {
      window.setTimeout(recheckBrokenImages, 80);
    },
    { passive: true }
  );

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      window.setTimeout(recheckBrokenImages, 120);
    }
  });
})();

/* =========================================================
   LỘC AN — PUMA x ROSÉ FORMERLY IN COLLECTION v1
   2026-10-20

   Requested scope:
   - Move PUMA x ROSÉ Speedcat Leather 'Warm White' to SOLD.
   - Use pictures/puma_rose.png.
   - Shorten story to Formerly-in-Collection style.
   - Auto-fit the new transparent cutout consistently in Grid + 3D.
========================================================= */
(() => {
  "use strict";

  const PUMA_ID =
    "puma-rose-speedcat-leather-warm-white";

  function patchPumaRose() {
    if (
      typeof sneakers === "undefined" ||
      !Array.isArray(sneakers)
    ) {
      return false;
    }

    const puma =
      sneakers.find(
        item =>
          item?.id === PUMA_ID
      );

    if (!puma) {
      return false;
    }

    /*
      Collection state:
      Formerly In Collection / Đã từng trong bộ sưu tập.
    */
    puma.collectionStatus =
      "sold";

    /*
      Same archive behavior used by existing sold pairs.
    */
    puma.archiveFit =
      true;

    /*
      Exact requested website asset filename.
    */
    puma.image =
      "pictures/puma_rose.png";

    /*
      Force the existing catalog auto-fit engine for Grid, 3D and mobile.
      This uses the transparent-pixel bounding box of the new cutout, so
      the shoe is optically normalized without hard-coding a new size.
    */
    puma.schemaVersion =
      2;

    puma.autoFit =
      true;

    puma.display =
      "auto";

    /*
      Short Formerly-in-Collection story.
      Keep metadata out of the story because the detail box already shows it.
    */
    puma.story = {
      vi: `
        <p><b>PUMA x ROSÉ Speedcat Leather 'Warm White'</b> tái diễn giải phom Speedcat lấy cảm hứng từ motorsport bằng bảng màu Warm White, các mảng đen tương phản và hệ dây wraparound đặc trưng. Thiết kế giữ dáng thấp, gọn của Speedcat nhưng đưa nó gần hơn với ngôn ngữ thời trang của ROSÉ.</p>
      `,
      en: `
        <p><b>PUMA x ROSÉ Speedcat Leather 'Warm White'</b> reworks the motorsport-inspired Speedcat through a Warm White palette, contrasting black details, and its distinctive wraparound lacing. The design keeps the model's low-profile racing shape while shifting it toward ROSÉ's fashion language.</p>
      `
    };

    return true;
  }

  patchPumaRose();

  /*
    Defensive re-apply after later catalog metadata scripts load.
    This does not touch DOM, image dimensions, or any other sneaker.
  */
  document.addEventListener(
    "DOMContentLoaded",
    patchPumaRose,
    { once: true }
  );
})();

/* =========================================================
   LỘC AN — COLLECTION RETURN STATE + HOME LABEL v1
   2026-10-20

   1) A SOLD sneaker detail returns to FORMERLY IN COLLECTION.
   2) An OWN sneaker detail returns to IN COLLECTION.
   3) Homepage restores ?collection=sold / own.
   4) Homepage notice becomes:
      VI: BỘ SƯU TẬP CÁ NHÂN
      EN: PRIVATE COLLECTION
========================================================= */
(() => {
  "use strict";

  if (window.__locanCollectionReturnStateV1) return;
  window.__locanCollectionReturnStateV1 = true;

  const params =
    new URLSearchParams(
      window.location.search
    );

  const path =
    String(
      window.location.pathname || ""
    ).toLowerCase();

  const isHomepage =
    /(?:\/|\/index\.html)$/.test(path) &&
    Boolean(
      document.getElementById(
        "sneaker-grid"
      )
    );

  const isShoeDetail =
    /\/shoe\.html$/.test(path) ||
    Boolean(
      document.getElementById(
        "shoe-detail"
      )
    );

  function lang() {
    return (
      document.documentElement.lang === "en"
    )
      ? "en"
      : "vi";
  }

  function catalog() {
    return (
      typeof sneakers !== "undefined" &&
      Array.isArray(sneakers)
    )
      ? sneakers
      : [];
  }

  function detailStatus() {
    const id =
      new URLSearchParams(
        window.location.search
      ).get("id");

    const item =
      catalog().find(
        sneaker =>
          String(
            sneaker?.id || ""
          ) ===
          String(
            id || ""
          )
      );

    return (
      String(
        item?.collectionStatus || "own"
      )
        .trim()
        .toLowerCase() === "sold"
    )
      ? "sold"
      : "own";
  }

  function collectionURL(
    status
  ) {
    const url =
      new URL(
        "./index.html",
        window.location.href
      );

    url.searchParams.set(
      "lang",
      lang()
    );

    url.searchParams.set(
      "collection",
      status === "sold"
        ? "sold"
        : "own"
    );

    return (
      url.pathname
        .split("/")
        .pop()
      +
      url.search
    );
  }


  /* =====================================================
     HOMEPAGE LABEL
  ===================================================== */

  function installHomepageLabel() {
    if (!isHomepage) return;

    if (
      document.getElementById(
        "locan-home-private-collection-label-v1"
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "locan-home-private-collection-label-v1";

    style.textContent = `
      html[lang="vi"] .home-header::after {
        content: "BỘ SƯU TẬP CÁ NHÂN" !important;
      }

      html[lang="en"] .home-header::after {
        content: "PRIVATE COLLECTION" !important;
      }
    `;

    document.head
      .appendChild(style);
  }


  /* =====================================================
     DETAIL BACK TARGET
  ===================================================== */

  function updateDetailBack() {
    if (!isShoeDetail) return;

    const back =
      document.getElementById(
        "back-link"
      );

    if (!back) return;

    const status =
      detailStatus();

    back.href =
      collectionURL(status);

    back.dataset
      .collectionReturnStatus =
        status;

    back.textContent =
      lang() === "vi"
        ? "← QUAY LẠI BỘ SƯU TẬP"
        : "← BACK TO COLLECTION";
  }

  function installDetailBackHandler() {
    if (!isShoeDetail) return;

    const back =
      document.getElementById(
        "back-link"
      );

    if (
      !back ||
      back.dataset
        .collectionReturnBound ===
        "true"
    ) {
      return;
    }

    back.dataset
      .collectionReturnBound =
        "true";

    /*
      Capture the click and calculate the target at click time.
      This guarantees the correct destination even if another older
      localization script has rewritten the href attribute.
    */
    back.addEventListener(
      "click",
      event => {
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        event.preventDefault();

        window.location.href =
          collectionURL(
            detailStatus()
          );
      },
      true
    );
  }


  /* =====================================================
     HOMEPAGE STATUS RESTORE
  ===================================================== */

  let restoreFinished =
    false;

  function desiredHomepageStatus() {
    const value =
      new URLSearchParams(
        window.location.search
      ).get("collection");

    return (
      value === "sold"
    )
      ? "sold"
      : (
          value === "own"
            ? "own"
            : ""
        );
  }

  function homepageMatches(
    status
  ) {
    if (!document.body) {
      return false;
    }

    return status === "sold"
      ? document.body.classList
          .contains(
            "collection-status-sold"
          )
      : document.body.classList
          .contains(
            "collection-status-own"
          );
  }

  function restoreHomepageStatus() {
    if (
      !isHomepage ||
      restoreFinished
    ) {
      return;
    }

    const desired =
      desiredHomepageStatus();

    if (!desired) {
      restoreFinished =
        true;
      return;
    }

    if (
      homepageMatches(desired)
    ) {
      restoreFinished =
        true;
      return;
    }

    const button =
      document.getElementById(
        desired === "sold"
          ? "collection-status-sold"
          : "collection-status-own"
      );

    if (!button) {
      return;
    }

    button.click();

    /*
      The status controller renders synchronously in normal operation,
      but verify before declaring the restore complete.
    */
    if (
      homepageMatches(desired)
    ) {
      restoreFinished =
        true;
    }
  }

  function keepHomepageURLInSync() {
    if (!isHomepage) return;

    document.addEventListener(
      "click",
      event => {
        const button =
          event.target?.closest?.(
            "#collection-status-own, #collection-status-sold"
          );

        if (!button) return;

        const status =
          button.id ===
            "collection-status-sold"
            ? "sold"
            : "own";

        const url =
          new URL(
            window.location.href
          );

        url.searchParams.set(
          "collection",
          status
        );

        window.history
          .replaceState(
            {},
            "",
            url.pathname +
            url.search +
            url.hash
          );
      },
      true
    );
  }


  /* =====================================================
     INIT
  ===================================================== */

  installHomepageLabel();
  installDetailBackHandler();
  updateDetailBack();
  keepHomepageURLInSync();

  if (isHomepage) {
    /*
      Runtime loads before the collection-status controller.
      Multiple tiny attempts let that controller finish installing
      without adding another permanent feedback observer.
    */
    [
      0,
      40,
      120,
      280,
      600,
      1000
    ].forEach(
      delay => {
        window.setTimeout(
          restoreHomepageStatus,
          delay
        );
      }
    );
  }

  if (isShoeDetail) {
    /*
      Existing localization code may update <html lang> after a VI/EN click.
      Recalculate the Back URL after that change.
    */
    const root =
      document.documentElement;

    if (
      root &&
      root.dataset
        .collectionReturnLangObserved !==
        "true"
    ) {
      root.dataset
        .collectionReturnLangObserved =
          "true";

      const observer =
        new MutationObserver(
          mutations => {
            if (
              mutations.some(
                mutation =>
                  mutation.type ===
                    "attributes" &&
                  mutation.attributeName ===
                    "lang"
              )
            ) {
              updateDetailBack();
            }
          }
        );

      observer.observe(
        root,
        {
          attributes: true,
          attributeFilter: ["lang"]
        }
      );
    }

    document.addEventListener(
      "DOMContentLoaded",
      () => {
        installDetailBackHandler();
        updateDetailBack();
      },
      { once: true }
    );
  }
})();

/* =========================================================
   LỘC AN — FORMERLY IN COLLECTION 3D UNIFORM FIT v1
   2026-10-20

   Scope:
   - SOLD / Formerly In Collection
   - 3D mode ONLY
   - Grid / Detail / In Collection remain unchanged

   Strategy:
   - Force every sold pair through CatalogDisplay's same auto-fit target.
   - Keep aspect ratio; no stretching.
   - Remove the old City of Flight 3D size exception so sold pairs share
     one visual sizing rule.
========================================================= */
(() => {
  "use strict";

  if (window.__locanSold3DUniformFitV1) return;
  window.__locanSold3DUniformFitV1 = true;

  function catalog() {
    return (
      typeof sneakers !== "undefined" &&
      Array.isArray(sneakers)
    )
      ? sneakers
      : [];
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

  function forceSold3DAutoFit() {
    catalog().forEach(item => {
      if (!isSold(item)) return;

      /*
        Preserve Grid behavior exactly as it currently is.
        Only override 3D / mobile-3D mode settings.
      */
      if (
        item.display &&
        typeof item.display === "object" &&
        !Array.isArray(item.display)
      ) {
        item.display = {
          ...item.display,
          view3d: "auto",
          view3dMobile: "auto"
        };
      } else if (item.display === "auto") {
        /*
          Already automatic in all modes (e.g. the newly updated PUMA).
          Nothing else is needed.
        */
      } else {
        item.display = {
          view3d: "auto",
          view3dMobile: "auto"
        };
      }
    });
  }

  function installSold3DStyleAuthority() {
    if (
      document.getElementById(
        "locan-sold-3d-uniform-fit-v1"
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "locan-sold-3d-uniform-fit-v1";

    style.textContent = `
      /*
        collection-view.js already applies one common optical multiplier
        to sold 3D cards. Keep that common multiplier but neutralize the
        historical City of Flight exception.
      */
      html body #sneaker-grid.locan-3d-view
      .sneaker-3d-card.is-preowned-3d
      .sneaker-3d-image
      img[data-3d-calibration="jordan-1-city-of-flight"] {
        scale: .82 .82 !important;
      }

      @media (max-width: 650px) {
        html body #sneaker-grid.locan-3d-view
        .sneaker-3d-card.is-preowned-3d
        .sneaker-3d-image
        img[data-3d-calibration="jordan-1-city-of-flight"] {
          scale: .80 .80 !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function refitVisibleSold3D() {
    forceSold3DAutoFit();
    installSold3DStyleAuthority();

    const grid =
      document.getElementById(
        "sneaker-grid"
      );

    if (
      !grid ||
      !grid.classList.contains(
        "locan-3d-view"
      )
    ) {
      return;
    }

    /*
      Re-run the site's existing CatalogDisplay fitter on the current
      3D nodes. It uses one shared target:
        desktop 3D: 80% width / 66% height
        phone 3D:   66% width / 54% height
      No new per-pair scale values are introduced.
    */
    window.CatalogDisplay
      ?.prepareWithin?.(
        grid
      );
  }

  /*
    Runtime file loads before catalog-display.js / collection-view.js.
    Patch the data now, then again at DOMContentLoaded after all later
    catalog adjustment scripts have completed.
  */
  forceSold3DAutoFit();

  document.addEventListener(
    "DOMContentLoaded",
    () => {
      forceSold3DAutoFit();
      installSold3DStyleAuthority();

      requestAnimationFrame(
        refitVisibleSold3D
      );
    },
    { once: true }
  );

  /*
    If the user switches Grid -> 3D or Own -> Sold after page load,
    cards are rebuilt dynamically. Refit only when new 3D cards appear.
  */
  function installObserver() {
    const grid =
      document.getElementById(
        "sneaker-grid"
      );

    if (
      !grid ||
      grid.dataset
        .sold3dUniformObserved ===
        "true"
    ) {
      return;
    }

    grid.dataset
      .sold3dUniformObserved =
        "true";

    let scheduled = false;

    const observer =
      new MutationObserver(
        mutations => {
          const added3D =
            mutations.some(
              mutation =>
                Array.from(
                  mutation.addedNodes
                ).some(
                  node =>
                    node instanceof Element &&
                    (
                      node.matches?.(
                        ".sneaker-3d-card.is-preowned-3d"
                      ) ||
                      node.querySelector?.(
                        ".sneaker-3d-card.is-preowned-3d"
                      )
                    )
                )
            );

          if (
            !added3D ||
            scheduled
          ) {
            return;
          }

          scheduled = true;

          requestAnimationFrame(
            () => {
              scheduled = false;
              refitVisibleSold3D();
            }
          );
        }
      );

    observer.observe(
      grid,
      {
        childList: true,
        subtree: true
      }
    );
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      installObserver,
      { once: true }
    );
  } else {
    installObserver();
    refitVisibleSold3D();
  }
})();
