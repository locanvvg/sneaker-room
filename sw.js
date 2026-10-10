/* =========================================================
   LỘC AN SNEAKER COLLECTION — STABLE RUNTIME CACHE v3

   Design rule:
   - Never rewrite a requested image URL to another format/path.
   - The page chooses its image source explicitly.
   - Service worker only provides network-first caching/fallback.
========================================================= */
const CACHE_VERSION =
  "locan-sneaker-room-20261010-standard-v3";

const SHELL_CACHE =
  `${CACHE_VERSION}-shell`;

const RUNTIME_CACHE =
  `${CACHE_VERSION}-runtime`;

const SHELL = [
  "./",
  "./index.html",
  "./shoe.html",
  "./about.html",
  "./stats.html",
  "./lego.html",
  "./lego-detail.html",
  "./sneaker-mask.html",
  "./sneaker-mask-detail.html",
  "./offline.html",
  "./style.css",
  "./collection-menu.css",
  "./unified-collection-ui.css",
  "./detail-layout.css",
  "./data.js",
  "./catalog-additions.js",
  "./catalog-engine.js",
  "./catalog-normalization.js",
  "./catalog-standardization-final.js",
  "./main.js",
  "./catalog-ui.js",
  "./catalog-display.js",
  "./collection-view.js",
  "./collection-content-final.js",
  "./shoe-page.js",
  "./item-share.js",
  "./site-enhancements.js",
  "./lego-data.js",
  "./sneaker-mask-data.js",
  "./collection-stats.js",
  "./collection-stats.css",
  "./site.webmanifest",
  "./favicon-32.png",
  "./apple-touch-icon.png"
];

self.addEventListener(
  "install",
  event => {
    event.waitUntil(
      caches
        .open(SHELL_CACHE)
        .then(cache =>
          Promise.allSettled(
            SHELL.map(url =>
              cache.add(
                new Request(url, {
                  cache: "reload"
                })
              )
            )
          )
        )
        .then(() =>
          self.skipWaiting()
        )
    );
  }
);

self.addEventListener(
  "activate",
  event => {
    event.waitUntil(
      caches
        .keys()
        .then(keys =>
          Promise.all(
            keys
              .filter(key =>
                key.startsWith(
                  "locan-sneaker-room-"
                ) &&
                !key.startsWith(
                  CACHE_VERSION
                )
              )
              .map(key =>
                caches.delete(key)
              )
          )
        )
        .then(() =>
          self.clients.claim()
        )
    );
  }
);

async function cachedFallback(request) {
  return caches.match(
    request,
    {
      ignoreSearch: true
    }
  );
}

async function networkFirst(request) {
  const runtime =
    await caches.open(RUNTIME_CACHE);

  try {
    const response =
      await fetch(
        new Request(
          request,
          {
            cache: "no-cache"
          }
        )
      );

    if (
      response &&
      response.ok
    ) {
      runtime
        .put(
          request,
          response.clone()
        )
        .catch(() => {});

      return response;
    }

    const cached =
      await cachedFallback(request);

    return cached || response;
  } catch (error) {
    const cached =
      await cachedFallback(request);

    if (cached) {
      return cached;
    }

    if (request.mode === "navigate") {
      return (
        await caches.match("./offline.html") ||
        await caches.match("./index.html")
      );
    }

    throw error;
  }
}

self.addEventListener(
  "fetch",
  event => {
    const request =
      event.request;

    if (request.method !== "GET") {
      return;
    }

    const url =
      new URL(request.url);

    if (url.origin !== self.location.origin) {
      return;
    }

    /*
      IMPORTANT:
      Images are fetched exactly at the URL requested by the page.
      No PNG -> WebP replacement and no original -> normalized rewrite.
    */
    if (
      request.destination === "image" ||
      request.mode === "navigate" ||
      [
        "script",
        "style",
        "manifest"
      ].includes(request.destination)
    ) {
      event.respondWith(
        networkFirst(request)
      );
    }
  }
);
