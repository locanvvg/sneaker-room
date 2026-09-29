/* =========================================================
   LỘC AN — SITE ENHANCEMENTS
   Non-destructive enhancement layer.

   IMPORTANT:
   - Does not edit sneaker metadata, stories, images arrays,
     display scales, Grid tuning or 3D tuning.
   - Adds only: performance hints, accessibility, PWA,
     collection statistics navigation, and page metadata.
========================================================= */
(() => {
  "use strict";

  const BUILD = "20260929-v2";

  const getLanguage = () => {
    /*
      The visible language switch is the source of truth.
      This keeps enhancement labels synchronized even when the
      page language changes after the enhancement script loads.
    */
    const viButton = document.getElementById("btn-vi");
    const enButton = document.getElementById("btn-en");

    if (viButton?.classList.contains("active")) return "vi";
    if (enButton?.classList.contains("active")) return "en";

    const query = new URLSearchParams(window.location.search).get("lang");
    if (query === "en" || query === "vi") return query;

    const htmlLang = String(document.documentElement.lang || "").toLowerCase();
    if (htmlLang.startsWith("vi")) return "vi";
    if (htmlLang.startsWith("en")) return "en";

    try {
      return localStorage.getItem("locan_lang") === "en" ? "en" : "vi";
    } catch (_) {
      return "vi";
    }
  };

  const whenDOMReady = callback => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  };

  /* =======================================================
     PWA / OFFLINE
  ======================================================= */
  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    if (!window.isSecureContext) return;

    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register(`./sw.js?v=${BUILD}`)
        .catch(() => {
          /* Website remains fully functional without SW. */
        });
    }, { once: true });
  }

  /* =======================================================
     ACCESSIBILITY — no visual redesign
  ======================================================= */
  function installAccessibilityStyles() {
    if (document.getElementById("locan-accessibility-v1")) return;

    const style = document.createElement("style");
    style.id = "locan-accessibility-v1";
    style.textContent = `
      :where(a, button, input, select, [tabindex]):focus-visible {
        outline: 2px solid #ffcc00 !important;
        outline-offset: 3px !important;
      }

      @media (prefers-reduced-motion: reduce) {
        html:focus-within {
          scroll-behavior: auto !important;
        }

        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function syncAccessibilityState() {
    document.querySelectorAll(".filter-chip, .lang-btn").forEach(button => {
      if (!(button instanceof HTMLElement)) return;
      button.setAttribute(
        "aria-pressed",
        button.classList.contains("active") ? "true" : "false"
      );
    });

    const count = document.getElementById("collection-count");
    if (count) {
      count.setAttribute("role", "status");
      count.setAttribute("aria-live", "polite");
      count.setAttribute("aria-atomic", "true");
    }

    const search = document.getElementById("archive-search-input");
    if (search && !search.getAttribute("aria-describedby")) {
      search.setAttribute("aria-autocomplete", "list");
    }
  }

  /* =======================================================
     IMAGE DELIVERY / RENDERING PERFORMANCE
     This intentionally does NOT alter image dimensions,
     CSS transforms, shoe scale, or image files.
  ======================================================= */
  function optimizeRenderedImages() {
    const gridImages = Array.from(
      document.querySelectorAll("#sneaker-grid img")
    );

    gridImages.forEach((image, index) => {
      image.decoding = "async";

      if (index < 6) {
        image.loading = "eager";
        image.setAttribute("fetchpriority", index < 3 ? "high" : "auto");
      } else {
        image.loading = "lazy";
        image.setAttribute("fetchpriority", "low");
      }
    });

    document
      .querySelectorAll(".shoe-detail-thumbnail img")
      .forEach(image => {
        image.loading = "lazy";
        image.decoding = "async";
      });

    const detailImage = document.getElementById("shoe-image");
    if (detailImage) {
      detailImage.decoding = "async";
      detailImage.loading = "eager";
      detailImage.setAttribute("fetchpriority", "high");
    }
  }

  /* =======================================================
     STATS PAGE LINK — subtle footer addition only
  ======================================================= */
  function syncStatsLink() {
    if (window.location.pathname.endsWith("/stats.html")) return;

    const footer = document.querySelector("footer");
    if (!footer) return;

    let link = document.getElementById("locan-stats-footer-link");

    if (!link) {
      link = document.createElement("a");
      link.id = "locan-stats-footer-link";
      link.style.display = "inline-block";
      link.style.marginTop = "10px";
      link.style.fontSize = ".72rem";
      link.style.letterSpacing = ".09em";
      link.style.fontWeight = "700";
      link.style.color = "#8d8d93";
      link.style.textDecoration = "none";
      link.style.textTransform = "uppercase";
      footer.appendChild(link);
    }

    const lang = getLanguage();
    link.href = `./stats.html?lang=${encodeURIComponent(lang)}`;
    link.textContent =
      lang === "vi"
        ? "THỐNG KÊ BỘ SƯU TẬP"
        : "COLLECTION STATISTICS";
    link.setAttribute(
      "aria-label",
      lang === "vi"
        ? "Mở thống kê bộ sưu tập"
        : "Open collection statistics"
    );
  }

  /* =======================================================
     OWN-COLLECTION SIZE FILTER CLEANUP
     Show only sizes that actually exist in IN COLLECTION.
     This does not change any sneaker size or catalog data.
  ======================================================= */
  function syncOwnCollectionSizeFilters() {
    const container = document.getElementById("size-filter-chips");

    if (
      !container ||
      typeof sneakers === "undefined" ||
      !Array.isArray(sneakers) ||
      !window.CatalogEngine
    ) {
      return;
    }

    const ownTokens = new Set();

    sneakers
      .filter(item =>
        String(item?.collectionStatus || "own")
          .trim()
          .toLowerCase() === "own"
      )
      .forEach(item => {
        CatalogEngine
          .getSizeTokens(item)
          .forEach(token => ownTokens.add(String(token)));
      });

    container
      .querySelectorAll('.filter-chip[data-group="size"]')
      .forEach(button => {
        const value = String(button.dataset.value || "").trim();

        if (!ownTokens.has(value)) {
          /*
            If an invalid legacy size happened to be active,
            clear it from the site's filter state before removing
            only that obsolete filter button.
          */
          try {
            activeFilters?.size?.delete(value);
          } catch (_) {}

          button.remove();
        }
      });
  }

  /* =======================================================
     DETAIL-PAGE SEO / SHARE METADATA
  ======================================================= */
  function localized(value, lang) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }
    if (typeof value === "object") {
      return String(value[lang] ?? value.vi ?? value.en ?? "");
    }
    return "";
  }

  function plainText(html) {
    const node = document.createElement("div");
    node.innerHTML = String(html || "");
    return String(node.textContent || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function upsertMeta(selector, attributeName, attributeValue, content) {
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attributeName, attributeValue);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  }

  function upsertCanonical(url) {
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }

  function updateDetailMetadata() {
    if (!window.location.pathname.endsWith("/shoe.html")) return;

    const shoeId = new URLSearchParams(window.location.search).get("id");
    if (!shoeId) return;

    const attempt = () => {
      if (typeof sneakers === "undefined" || !Array.isArray(sneakers)) {
        return false;
      }

      const sneaker = sneakers.find(item => item && item.id === shoeId);
      if (!sneaker) return true;

      const lang = getLanguage();
      const name = localized(sneaker.title, lang);
      const story = plainText(localized(sneaker.story, lang));
      const subtitle = localized(sneaker.subtitle, lang);
      const description = (story || subtitle || name).slice(0, 190);

      const imagePath =
        (Array.isArray(sneaker.images) && sneaker.images[0]) ||
        sneaker.image ||
        "locan-social-preview.png";

      const imageUrl = new URL(imagePath, window.location.href).href;
      const canonical = new URL("./shoe.html", window.location.href);
      canonical.searchParams.set("id", shoeId);
      canonical.searchParams.set("lang", lang);

      document.title = `${name} | Lộc An Sneaker Collection`;
      upsertCanonical(canonical.href);

      upsertMeta('meta[name="description"]', "name", "description", description);
      upsertMeta('meta[property="og:title"]', "property", "og:title", name);
      upsertMeta('meta[property="og:description"]', "property", "og:description", description);
      upsertMeta('meta[property="og:type"]', "property", "og:type", "article");
      upsertMeta('meta[property="og:url"]', "property", "og:url", canonical.href);
      upsertMeta('meta[property="og:image"]', "property", "og:image", imageUrl);
      upsertMeta('meta[property="og:image:alt"]', "property", "og:image:alt", name);
      upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
      upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", name);
      upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
      upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", imageUrl);

      document.getElementById("locan-shoe-jsonld")?.remove();
      const structured = document.createElement("script");
      structured.id = "locan-shoe-jsonld";
      structured.type = "application/ld+json";
      structured.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name,
        description,
        image: imageUrl,
        url: canonical.href,
        identifier: sneaker.sku || shoeId,
        isPartOf: {
          "@type": "CollectionPage",
          name: "Lộc An Sneaker Collection",
          url: new URL("./", window.location.href).href
        }
      });
      document.head.appendChild(structured);

      return true;
    };

    if (attempt()) return;

    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      if (attempt() || tries >= 30) {
        window.clearInterval(timer);
      }
    }, 100);
  }

  /* =======================================================
     RUNTIME OBSERVER
  ======================================================= */
  function installObserver() {
    if (!document.body) return;

    let queued = false;
    const sync = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        syncAccessibilityState();
        optimizeRenderedImages();
        syncStatsLink();
        syncOwnCollectionSizeFilters();
      });
    };

    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"]
    });

    sync();
  }

  registerServiceWorker();
  installAccessibilityStyles();

  whenDOMReady(() => {
    syncAccessibilityState();
    optimizeRenderedImages();
    syncStatsLink();
    syncOwnCollectionSizeFilters();
    updateDetailMetadata();
    installObserver();

    /*
      catalog status/filter controls are finalized on window.load.
      Re-sync once more after all legacy scripts finish.
    */
    window.addEventListener(
      "load",
      () => {
        syncStatsLink();
        syncOwnCollectionSizeFilters();
      },
      { once: true }
    );
  });
})();
