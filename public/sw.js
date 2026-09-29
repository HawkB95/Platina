// Service Worker — Platina PWA
// Strategia: network-first per tutto, cache come fallback offline.
// Il SW serve per abilitare l'installazione come PWA.

var CACHE = "platina-v2";

// Asset statici da precachare per avere la shell offline
var SHELL = [
  "/",
  "/index.html",
  "/css/base.css",
  "/css/buttons.css",
  "/css/topbar.css",
  "/css/controls.css",
  "/css/card.css",
  "/css/modal.css",
  "/css/responsive.css",
  "/js/constants.js",
  "/js/utils.js",
  "/js/state.js",
  "/js/api.js",
  "/js/ui.js",
  "/js/render.js",
  "/js/search.js",
  "/js/form.js",
  "/js/reveal.js",
  "/js/detail.js",
  "/js/tilt.js",
  "/js/menu.js",
  "/js/main.js",
  "/manifest.json"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(SHELL); })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (e) {
  var url = new URL(e.request.url);

  // Le chiamate API vanno sempre in rete (mai in cache)
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/covers/")) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Tutto il resto: network-first, cache come fallback
  e.respondWith(
    fetch(e.request)
      .then(function (res) {
        var clone = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, clone); });
        return res;
      })
      .catch(function () {
        return caches.match(e.request);
      })
  );
});
