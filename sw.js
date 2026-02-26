const CACHE_NAME = 'taiwan-japan-v1';
const ONE_DAY = 24 * 60 * 60 * 1000;
const urlsToCache = [
  '/-/',
  '/-/fonts/noto-sans-tc-400.woff2',
  '/-/index.html',
  '/-/style.min.css',
  '/-/script.js',
  '/-/images/home/1.avif',
  '/-/images/home/2.avif',
  '/-/images/home/3.avif',
  '/-/images/home/4.avif',
  '/-/images/24.01.avif',
  '/-/images/favicon.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // 1. 關鍵修正：只處理 http 和 https 協定
  // 避免 chrome-extension:// 或 edge:// 等請求導致快取報錯
  if (!(event.request.url.indexOf('http') === 0)) return;
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(async (networkResponse) => {
        // 2. 檢查 Response 是否有效
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // 3. 關鍵修正：複製串流 (Clone)
        // 因為 Response 是一個 Stream，只能被讀取一次
        const responseToCache = networkResponse.clone();

        // 異步存入快取，不阻塞主線程回傳
        caches.open(CACHE_NAME).then(async (cache) => {
          const timestampedResponse = await createResponseWithTimestamp(responseToCache);
          cache.put(event.request, timestampedResponse);
        });

        return networkResponse;
      })
      .catch(async () => {
        // 網路失敗後的快取備案
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          const fetchedDate = cachedResponse.headers.get('sw-fetched-on');
          if (fetchedDate && (Date.now() - parseInt(fetchedDate) > ONE_DAY)) {
            console.log('快取已過期 (超過24小時):', event.request.url);
          }
          return cachedResponse;
        }

        if (event.request.mode === 'navigate') {
          return caches.match('/-/index.html');
        }
      })
  );
});

// 輔助函式：建立帶有時間戳的新 Response
async function createResponseWithTimestamp(response) {
  // 這裡同樣需要讀取 Response Body (blob)，所以傳入的必須是 clone 過的
  const blob = await response.blob();
  const newHeaders = new Headers(response.headers);
  newHeaders.append('sw-fetched-on', Date.now().toString());

  return new Response(blob, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
