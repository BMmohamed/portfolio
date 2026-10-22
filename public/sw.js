// Service Worker for Ruya Real Estate PWA / Android TWA
const CACHE_NAME = 'ruya-aqar-pwa-v3';

// Aggressive pre-caching assets
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-192.png',
  '/icon-maskable-512.png',
  '/apple-touch-icon.png'
];

// High-fidelity Inline Offline Fallback HTML (Fail-safe for TWA standalone mode)
const INLINE_OFFLINE_HTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
  <meta name="theme-color" content="#0f172a">
  <title>لا يوجد اتصال بالإنترنت | رؤية العقارية</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    body {
      background: radial-gradient(circle at 50% 25%, #1e293b 0%, #0f172a 75%, #020617 100%);
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      text-align: center;
      user-select: none;
      -webkit-user-select: none;
    }
    .card {
      background: rgba(30, 41, 59, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(245, 158, 11, 0.25);
      border-radius: 28px;
      padding: 36px 24px;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .icon-box {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      border-radius: 22px;
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05));
      border: 1px solid rgba(245, 158, 11, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #f59e0b;
    }
    .brand { font-size: 13px; font-weight: 800; color: #f59e0b; letter-spacing: 1px; margin-bottom: 6px; }
    h1 { font-size: 22px; font-weight: 900; color: #ffffff; margin-bottom: 12px; }
    p { font-size: 14px; color: #94a3b8; line-height: 1.6; margin-bottom: 28px; }
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #0f172a;
      font-size: 15px;
      font-weight: 800;
      padding: 14px 20px;
      border-radius: 16px;
      border: none;
      cursor: pointer;
      text-decoration: none;
    }
    .btn:active { transform: scale(0.98); }
    .btn-secondary {
      background: rgba(51, 65, 85, 0.6);
      color: #e2e8f0;
      border: 1px solid rgba(148, 163, 184, 0.2);
      margin-top: 10px;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon-box">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="1" y1="1" x2="23" y2="23"></line>
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
        <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
        <line x1="12" y1="20" x2="12.01" y2="20"></line>
      </svg>
    </div>
    <div class="brand">رؤية العقارية</div>
    <h1>لا يوجد اتصال بالإنترنت</h1>
    <p>يبدو أنك غير متصل بالشبكة حالياً. يرجى التحقق من اتصال الواي فاي أو بيانات الهاتف المحمول ثم إعادة المحاولة.</p>
    <button class="btn" onclick="window.location.reload()">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
        <path d="M3 3v5h5"></path>
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
        <path d="M16 21h5v-5"></path>
      </svg>
      <span>إعادة المحاولة</span>
    </button>
    <a href="/" class="btn btn-secondary">العودة للرئيسية المحفوظة</a>
  </div>
  <script>
    window.addEventListener('online', () => window.location.reload());
  </script>
</body>
</html>`;

// 1. Install Event: Aggressive Pre-caching with error resilience
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Pre-cache inline fallback first so it's always available
      await cache.put(
        new Request('/offline.html'),
        new Response(INLINE_OFFLINE_HTML, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        })
      );

      // Pre-cache individual assets gracefully (one failure doesn't break the rest)
      const cachePromises = PRECACHE_ASSETS.map((asset) =>
        fetch(asset, { cache: 'no-cache' })
          .then((response) => {
            if (response && response.status === 200) {
              return cache.put(asset, response);
            }
          })
          .catch((err) => {
            console.warn(`[SW] Pre-cache non-fatal warning for ${asset}:`, err);
          })
      );

      return Promise.allSettled(cachePromises);
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Clean old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event: Strict Cache-First / Stale-While-Revalidate for navigation requests
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) return;

  // Handle NAVIGATION Requests (request.mode === 'navigate' or document)
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      (async () => {
        try {
          // A. Try cache first for immediate native display
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            // Revalidate in background (Stale-While-Revalidate)
            fetch(event.request)
              .then(async (networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                  const cache = await caches.open(CACHE_NAME);
                  cache.put(event.request, networkResponse);
                }
              })
              .catch(() => {
                // Ignore background revalidation failure
              });
            return cachedResponse;
          }

          // B. Not in cache yet: attempt network fetch with 3.5s timeout for snappy UX
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3500);

          try {
            const networkResponse = await fetch(event.request, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (networkResponse && networkResponse.status === 200) {
              const cache = await caches.open(CACHE_NAME);
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            }
          } catch (netErr) {
            clearTimeout(timeoutId);
          }

          // C. If network fails or times out, fallback to cached root or offline page
          const fallbackRoot = await caches.match('/');
          if (fallbackRoot) return fallbackRoot;

          const fallbackOfflineHtml = await caches.match('/offline.html');
          if (fallbackOfflineHtml) return fallbackOfflineHtml;

          const fallbackOfflineRoute = await caches.match('/offline');
          if (fallbackOfflineRoute) return fallbackOfflineRoute;

          // D. Ultimate fail-safe: synthetic inline HTML response (NEVER show Chrome dinosaur)
          return new Response(INLINE_OFFLINE_HTML, {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        } catch (criticalErr) {
          // Never let navigation request throw error to browser
          return new Response(INLINE_OFFLINE_HTML, {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        }
      })()
    );
    return;
  }

  // Handle static assets & API (Cache-First with Network fallback)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Return empty or fallback if asset missing
          return new Response('', { status: 408, statusText: 'Offline Asset Unavailable' });
        });
    })
  );
});
