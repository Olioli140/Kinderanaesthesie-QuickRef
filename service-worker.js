const CACHE='kinderquickref-v07-mobile05';
const ASSETS=['./manifest.webmanifest','./fix-v04.js','./mobile-v05.css','./mobile-v05.js','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

function upgradeHtml(html) {
  let out = html
    .replace(/iPhone v0\.3/g, 'iPhone v0.5')
    .replace(/iPhone v0\.4/g, 'iPhone v0.5')
    .replace(/QuickRef v0\.2/g, 'QuickRef v0.5')
    .replace(/QuickRef v0\.3/g, 'QuickRef v0.5')
    .replace(/QuickRef v0\.4/g, 'QuickRef v0.5');

  if (!out.includes('mobile-v05.css')) {
    out = out.replace('</head>', '<link rel="stylesheet" href="./mobile-v05.css?v=05">\n</head>');
  }
  if (!out.includes('fix-v04.js')) {
    out = out.replace('</body>', '<script src="./fix-v04.js?v=05"></script>\n</body>');
  }
  if (!out.includes('mobile-v05.js')) {
    out = out.replace('</body>', '<script src="./mobile-v05.js?v=05"></script>\n</body>');
  }
  return out;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request, {cache:'no-store'});
        const html = await response.text();
        return new Response(upgradeHtml(html), {
          status: response.status,
          statusText: response.statusText,
          headers: {'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}
        });
      } catch (e) {
        const cached = await caches.match('./index.html');
        if (cached) return cached;
        throw e;
      }
    })());
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
