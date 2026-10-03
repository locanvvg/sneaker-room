/* Lộc An Sneaker Collection — optimized offline/runtime cache */
const CACHE_VERSION =
  "locan-sneaker-room-20261003-performance-v1";

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
  "./data.js",
  "./catalog-additions.js",
  "./catalog-engine.js",
  "./main.js",
  "./catalog-ui.js",
  "./catalog-display.js",
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

let optimizedManifest = null;
let optimizedManifestCheckedAt = 0;

self.addEventListener(
  "install",
  event => {
    event.waitUntil(
      caches
        .open(SHELL_CACHE)
        .then(
          cache =>
            cache.addAll(SHELL)
        )
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

async function networkFirst(
  request
) {
  const cache =
    await caches.open(
      RUNTIME_CACHE
    );

  try {
    const response =
      await fetch(request);

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
    }

    return response;
  } catch (error) {
    const cached =
      await caches.match(
        request,
        {
          ignoreSearch: true
        }
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

async function getOptimizedManifest() {
  const now = Date.now();

  if (
    optimizedManifest &&
    now -
      optimizedManifestCheckedAt <
      5 * 60 * 1000
  ) {
    return optimizedManifest;
  }

  optimizedManifestCheckedAt =
    now;

  try {
    const manifestURL =
      new URL(
        "./pictures/optimized/manifest.json",
        self.registration.scope
      );

    const response =
      await fetch(
        manifestURL.href,
        { cache: "no-store" }
      );

    if (!response.ok) {
      optimizedManifest = {};
      return optimizedManifest;
    }

    optimizedManifest =
      await response.json();

    return optimizedManifest;
  } catch (_) {
    optimizedManifest = {};
    return optimizedManifest;
  }
}

function relativeToScope(url) {
  const scopePath =
    new URL(
      self.registration.scope
    ).pathname;

  const pathname =
    new URL(url).pathname;

  if (
    pathname.startsWith(
      scopePath
    )
  ) {
    return decodeURIComponent(
      pathname.slice(
        scopePath.length
      )
    );
  }

  return "";
}

async function cacheFirst(
  request
) {
  const cache =
    await caches.open(
      RUNTIME_CACHE
    );

  const cached =
    await cache.match(request);

  if (cached) {
    return cached;
  }

  const response =
    await fetch(request);

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
  }

  return response;
}

async function optimizedImage(
  request
) {
  const acceptsWebP =
    String(
      request.headers.get(
        "accept"
      ) || ""
    )
      .toLowerCase()
      .includes("image/webp");

  if (acceptsWebP) {
    const relative =
      relativeToScope(
        request.url
      );

    const manifest =
      await getOptimizedManifest();

    const optimized =
      manifest[
        relative
      ];

    if (optimized) {
      try {
        const optimizedURL =
          new URL(
            `./${optimized}`,
            self.registration.scope
          );

        return await cacheFirst(
          new Request(
            optimizedURL.href,
            {
              mode: "same-origin",
              credentials:
                "same-origin"
            }
          )
        );
      } catch (_) {
        // Fall through to original image.
      }
    }
  }

  return cacheFirst(request);
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

    if (
      request.destination ===
      "image"
    ) {
      event.respondWith(
        optimizedImage(request)
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
