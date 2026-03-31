// BetterLife Service Worker — v1
const CACHE_NAME = 'betterlife-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/js/data.js',
  '/js/store.js',
  '/js/charts.js',
  '/js/coaching.js',
  '/js/tab-today.js',
  '/js/tab-nutrition.js',
  '/js/tab-body.js',
  '/js/tab-routine.js',
  '/js/tab-me.js',
  '/js/app.js'
];

// Install — cache all assets
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(function (name) { return name !== CACHE_NAME; })
          .map(function (name) { return caches.delete(name); })
      );
    })
  );
  self.clients.claim();
});

// Fetch — cache first, fallback to network
self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      return cached || fetch(e.request).then(function (response) {
        // Cache new successful responses
        if (response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(e.request, clone);
          });
        }
        return response;
      });
    }).catch(function () {
      // Offline fallback for navigation
      if (e.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});
