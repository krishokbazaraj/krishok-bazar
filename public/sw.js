const CACHE_NAME = 'krishok-bazar-cache-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install Event - Pre-cache shell assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching application shell...');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.error('[Service Worker] Pre-cache failed (non-blocking):', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean up stale cache versions
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Clearing outdated cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Dynamic Stale-While-Revalidate pattern with bypass policies
self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Bypass cache for POST actions, local API calls, and live communication channels (Firebase/SMTP endpoints)
  if (
    request.method !== 'GET' || 
    url.pathname.startsWith('/api/') || 
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('securetoken.googleapis.com')
  ) {
    return;
  }

  // Handle caching securely using stale-while-revalidate strategy
  e.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Kick off the network charge
      const fetchPromise = fetch(request).then((networkResponse) => {
        // Cache only valid/successful responses
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic' || url.protocol === 'https:') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache).catch((err) => {
              // Fail safe if caching the specific file or CORS image is restricted
            });
          });
        }
        return networkResponse;
      }).catch((err) => {
        console.log('[Service Worker] Retrieve offline failed, using cache fallback:', err);
      });

      // Prefer instant cached response, fallback to network promise
      return cachedResponse || fetchPromise;
    })
  );
});
