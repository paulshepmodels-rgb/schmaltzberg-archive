var CACHE_NAME = "tw-schmaltzberg-v1";
var ASSETS = [
  "./",
  "./index.html",
  "./casanunda.jpg",
  "./stronginthearm.jpg",
  "./imperial1988.jpg",
  "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return Promise.all(
        ASSETS.map(function (url) {
          return fetch(url).then(function (resp) {
            if (resp && (resp.ok || resp.type === "opaque")) {
              return cache.put(url, resp);
            }
          }).catch(function () {});
        })
      );
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(function (cached) {
      return cached || fetch(event.request).catch(function () {
        return caches.match("./index.html");
      });
    })
  );
});