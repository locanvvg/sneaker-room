/* Lộc An Sneaker Collection — conservative offline cache */
const CACHE_VERSION = "locan-sneaker-room-20260929-v1";
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const SHELL = [
  "./",
  "./index.html",
  "./shoe.html",
  "./about.html",
  "./stats.html",
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
  "./site-enhancements.js",
  "./collection-stats.js",
  "./collection-stats.css",
  "./site.webmanifest",
  "./favicon-32.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith("locan-sneaker-room-") && !key.startsWith(CACHE_VERSION))
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch (_) {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;

    if (request.mode === "navigate") {
      return (
        await caches.match("./offline.html") ||
        await caches.match("./index.html")
      );
    }

    throw _;
  }
}

async function cacheFirstImage(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (!response || !response.ok) return response;

  const cache = await caches.open(RUNTIME_CACHE);
  cache.put(request, response.clone()).catch(() => {});
  return response;
}

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.destination === "image") {
    event.respondWith(cacheFirstImage(request));
    return;
  }

  if (
    request.mode === "navigate" ||
    ["script", "style", "manifest"].includes(request.destination)
  ) {
    event.respondWith(networkFirst(request));
  }
});
