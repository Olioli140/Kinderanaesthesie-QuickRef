const CACHE='kinderquickref-v05';
const ASSETS=['./manifest.webmanifest','./fix-v04.js','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function patchedIndex(request) {
  try {
    const response = await fetch(request, { cache: 'no-store' });
    let html = await response.text();
    html = html.replace(/v0\.3/g, 'v0.4');
    if (!html.includes('fix-v04.js')) {
      html = html.replace('</body>', '<script src="./fix-v04.js?v=05"></script></body>');
    }
    const headers = new Headers(response.headers);
    headers.set('content-type','text/html; charset=utf-8');
    headers.set('cache-control','no-store, max-age=0');
    const patched = new Response(html, { status: response.status, statusText: response.statusText, headers });
    const cache = await caches.open(CACHE);
    cache.put('./index.html', patched.clone());
    return patched;
  } catch (e) {
    return (await caches.match('./index.html')) || Response.error();
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.mode === 'navigate') {
    event.respondWith(patchedIndex(request));
    return;
  }
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request, { cache: 'no-store' }).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(request, copy));
      return response;
    }))
  );
});
