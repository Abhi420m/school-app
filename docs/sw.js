// Service Worker for VidyaSetu School Parent App PWA
const CACHE_NAME = 'vidyasetu-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let the browser handle standard requests with fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
