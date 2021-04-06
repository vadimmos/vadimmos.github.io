const staticCacheName = 'static-cache-v5';
const dynamicCacheName = 'dynamic-cache-v5';
const staticAssets = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/icons/icon-128x128.png',
  '/images/icons/icon-192x192.png',
  '/style.css',
  '/components/header/header.js',
  '/components/menu/menu.js',
];
self.addEventListener('install', async e => {
  const preCache = async () => {
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