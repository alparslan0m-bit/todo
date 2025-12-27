/**
 * TODODO PWA Showcase Service Worker
 * Optimized for React SPAs with Navigation Fallback
 * Features: Stale-While-Revalidate, Cache-First for static, Navigation Catch-all
 */

const CACHE_NAME = 'tododo-v2-showcase';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  // Assets are usually hashed in build, we use navigation fallback for them
];

// 1. Install Event: Pre-cache core shell
self.addEventListener('install', (event) => {
  console.log('[SW] Install event triggered');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching App Shell');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Don't skip waiting here - let the SW sit in "waiting" state
  // User will be notified via UpdateToast and can choose when to update
});

// Added: Listen for SKIP_WAITING message from UI (when user clicks update button)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING message');
    self.skipWaiting();
  }
});

// 2. Activate Event: Cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event triggered');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event: Strategy Orchestration
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Strategy A: Navigation Fallback (CRITICAL FOR SPA)
  // Ensures that refreshing on /add or /settings works while offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/index.html');
      })
    );
    return;
  }

  // Strategy B: Cache-First for Fonts and Images (They rarely change)
  if (request.destination === 'font' || request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return cachedResponse || fetch(request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Strategy C: Stale-While-Revalidate for JS/CSS/Static
  // Serves from cache for speed, updates cache in background
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});
