const CACHE = "life-calculators-v1.3";
const APP_SHELL = [
  "/life-calculators/",
  "/life-calculators/index.html",
  "/life-calculators/app.css",
  "/life-calculators/js/core.js",
  "/life-calculators/js/money-a.js",
  "/life-calculators/js/money-b.js",
  "/life-calculators/js/retirement.js",
  "/life-calculators/js/dates.js",
  "/life-calculators/js/everyday.js",
  "/life-calculators/js/travel.js",
  "/life-calculators/js/currency.js",
  "/life-calculators/js/pace.js",
  "/life-calculators/js/boot.js",
  "/life-calculators/manifest.webmanifest",
  "/life-calculators/icons/icon-192.png",
  "/life-calculators/icons/icon-512.png"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k.startsWith("life-calculators-")).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith("/life-calculators/")) return;
  if (req.mode === "navigate") {
    event.respondWith(fetch(req).catch(() => caches.match("/life-calculators/index.html")));
    return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(resp => {
    if (resp && resp.ok) caches.open(CACHE).then(cache => cache.put(req, resp.clone()));
    return resp;
  })));
});
