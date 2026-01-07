const CACHE_NAME = 'komisi-treatment-orea85-v1';
const urlsToCache = [
  '/',
  '/logo.svg',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('OREA 85 Service Worker: Installing');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('OREA 85 Service Worker: Installation complete');
        self.skipWaiting();
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('OREA 85 Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('OREA 85 Service Worker: Activation complete');
    })
  );
});

// Fetch Event - Network First, Cache Fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Cache successful responses
            if (response.ok && event.request.method === 'GET') {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request.url, response.clone());
                });
            }
            return response;
          })
          .catch((error) => {
            console.error('OREA 85 Service Worker: Fetch failed:', error);
            // Return offline fallback for HTML pages
            if (event.request.destination === 'document') {
              return new Response(`
                <!DOCTYPE html>
                <html>
                  <head>
                    <title>Offline - Catatan Harian Komisi Treatment</title>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                      body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background: linear-gradient(135deg, #f59e0b, #d97706);
                        color: white;
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                      }
                      .offline-container {
                        max-width: 400px;
                        background: white;
                        border-radius: 12px;
                        padding: 40px 20px;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                      }
                      .offline-icon {
                        font-size: 48px;
                        margin-bottom: 20px;
                      }
                      h1 {
                        margin: 0 0 10px 0;
                        font-size: 24px;
                        font-weight: 600;
                        color: #d97706;
                      }
                      p {
                        margin: 0 0 20px 0;
                        font-size: 16px;
                        line-height: 1.5;
                        color: #666;
                      }
                      .retry-btn {
                        background: #d97706;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        margin-top: 20px;
                      }
                      .retry-btn:hover {
                        background: #b45309;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="offline-container">
                      <img src="/logo.svg" alt="OREA 85 Logo" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 20px; border: 3px solid #d97706;">
                      <h1>Tidak Ada Koneksi Internet</h1>
                      <p>Aplikasi Catatan Harian Komisi Treatment OREA 85 memerlukan koneksi internet untuk berfungsi.</p>
                      <p>Silakan periksa koneksi internet Anda dan coba lagi.</p>
                      <button class="retry-btn" onclick="window.location.reload()">
                        Coba Lagi
                      </button>
                    </div>
                  </body>
                </html>
              `, {
                status: 200,
                statusText: 'OK',
                headers: {
                  'Content-Type': 'text/html; charset=utf-8'
                }
              });
            }
            return new Response('Network error', {
              status: 408,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Background Sync for Data Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync data logic here
      Promise.resolve().then(() => {
        console.log('OREA 85 Service Worker: Background sync completed');
      })
    );
  }
});

// Push Notification Handler
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.body : 'Ada pembaruan baru di aplikasi Komisi Treatment OREA 85',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification('Komisi Treatment OREA 85', options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.notification.data && event.notification.data.url) {
    clients.openWindow(event.notification.data.url);
  }
});