self.addEventListener('install', (event) => {
  console.log('SW 安裝中...');
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  console.log('SW 已啟動！');
});
