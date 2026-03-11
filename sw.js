const CACHE_NAME = 'better-deal-v1';
const urlsToCache = [
  './',
  './index.html',
  './script.js',
  './favicon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request)
          .catch(() => {
            // Ignore fetch errors for simple PWA
          });
      })
  );
});
