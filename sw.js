/* =========================================================
   LỘC AN SNEAKER COLLECTION — STABLE RUNTIME CACHE
   2026-10-10

   Image policy:
   - Never rewrite pictures/*.png/jpg to generated WebP paths.
   - Never rewrite original catalog images to pictures/normalized/*.
   - Use the exact URL requested by the page.
   - Prefer the network, then fall back to the same cached request.

   This keeps approved per-pair sizing deterministic and prevents a missing
   optimized derivative from making an otherwise valid original disappear.
========================================================= */

const CACHE_VERSION =
  "locan-sneaker-room-20261010-image-stability-v1";

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
  "./main.js",
  "./catalog-ui.js",
  "./catalog-display.js",
  "./catalog-normalization.js",
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

async function precacheShell() {
  const cache =
    await caches.open(
      SHELL_CACHE
    );

  await Promise.all(
    SHELL.map(
      async url => {
        const request =
          new Request(
            url,
            {
              cache: "reload",
              credentials: "same-origin"
            }
          );

        const response =
          await fetch(request);

        if (!response.ok) {
          throw new Error(
            `Precache failed: ${url} (${response.status})`
          );
        }

        await cache.put(
          url,
          response
        );
      }
    )
  );
}

self.addEventListener(
  "install",
  event => {
    event.waitUntil(
      precacheShell()
        .then(
          () =>
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
        .then(
          keys =>
            Promise.all(
              keys
                .filter(
                  key =>
                    key.startsWith(
                      "locan-sneaker-room-"
                    ) &&
                    !key.startsWith(
                      CACHE_VERSION
                    )
                )
                .map(
                  key =>
                    caches.delete(key)
                )
            )
        )
        .then(
          () =>
            self.clients.claim()
        )
    );
  }
);

async function cachedResponse(
  request
) {
  return caches.match(
    request,
    {
      ignoreSearch: true
    }
  );
}

async function networkFirst(
  request
) {
  const cache =
    await caches.open(
      RUNTIME_CACHE
    );

  try {
    const networkRequest =
      new Request(
        request,
        {
          cache: "no-cache"
        }
      );

    const response =
      await fetch(
        networkRequest
      );

    if (
      response &&
      response.ok
    ) {
      cache
        .put(
          request,
          response.clone()
        )
        .catch(() => {});

      return response;
    }

    /*
      A 404/5xx fetch does not throw. Check the cache before returning the
      failed network response so a transient deployment window does not
      blank an image or script that was already available.
    */
    const cached =
      await cachedResponse(
        request
      );

    if (cached) {
      return cached;
    }

    if (
      request.mode ===
      "navigate"
    ) {
      return (
        await caches.match(
          "./offline.html"
        ) ||
        await caches.match(
          "./index.html"
        ) ||
        response
      );
    }

    return response;
  } catch (error) {
    const cached =
      await cachedResponse(
        request
      );

    if (cached) {
      return cached;
    }

    if (
      request.mode ===
      "navigate"
    ) {
      return (
        await caches.match(
          "./offline.html"
        ) ||
        await caches.match(
          "./index.html"
        )
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

    if (
      request.method !==
      "GET"
    ) {
      return;
    }

    const url =
      new URL(
        request.url
      );

    if (
      url.origin !==
      self.location.origin
    ) {
      return;
    }

    /*
      IMPORTANT: image requests are handled exactly as requested.
      No manifest lookup and no transparent URL substitution.
    */
    if (
      request.destination ===
      "image"
    ) {
      event.respondWith(
        networkFirst(request)
      );
      return;
    }

    if (
      request.mode ===
        "navigate" ||
      [
        "script",
        "style",
        "manifest"
      ].includes(
        request.destination
      )
    ) {
      event.respondWith(
        networkFirst(request)
      );
    }
  }
);
