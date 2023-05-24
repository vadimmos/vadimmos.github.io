const staticCacheName = 'static-cache-v13';
const dynamicCacheName = 'dynamic-cache-v13';
const staticAssets = [
  '/',
  '/radio-utils/index.html',
  '/radio-utils/favicon.ico',
  '/radio-utils/manifest.json',
  '/radio-utils/icons/icon-128x128.png',
  '/radio-utils/icons/icon-192x192.png',
  '/style.css',
  '/components/header/header.js',
  '/components/menu/menu.js',
];
self.addEventListener('install', async e => {
  const preCache = async () => {
    await caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => !([staticCacheName, dynamicCacheName].includes(cacheName))).map((cacheName) => caches.delete(cacheName))
      );
    });
    const cache = await caches.open(staticCacheName);
    return await cache.addAll(staticAssets);
  };
  e.waitUntil(preCache());

});
self.addEventListener('activate', async e => {
  const cacheKeys = await caches.keys();
  const checkKeys = cacheKeys.map(async key => {
    if (staticCacheName !== key) {
      await caches.delete(key);
    }
  })
  await Promise.all(checkKeys);
});
self.addEventListener('fetch', e => {
  e.respondWith(checkCache(e.request));
});
/**
 * @param {Request} req
 */
async function checkCache(req) {
  const url = new URL(req.url);
  if (url.pathname === '/') {
    req = new Request(`${url.origin}/`);
  }
  const cachedResponse = await caches.match(req);
  const online = await checkOnline(req);
  return online ?? cachedResponse;
}
async function checkOnline(req) {
  const cache = await caches.open(dynamicCacheName);
  try {
    const res = await fetch(req);
    await cache.put(req, res.clone());
    return res;
  } catch (err) {
    return await cache.match(req);
  }
}