const CACHE_NAME = 'taiwan-japan-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.min.css',
  './script.js',
  './images/24.01.avif',
  './images/24.05.avif',
  './images/25.01.avif',
  './images/25.09.avif',
  './images/25.11.avif',
  './images/25.12.avif',
  './images/favicon.png'
];
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((networkResponse) => {
        if (
          event.request.url.match(/\.(jpg|jpeg|png|gif|avif|webp)$/i) ||
          event.request.url.includes('/images/')
        ) {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});