var staticCacheName = 'nonoApp-1488522837127';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll(["fonts/ionicons.ttf?v=2.0.1","fonts/ionicons.woff?v=2.0.1","favicon.ico","index.html","sw.controller.js","sw.js","fonts/iconfont.eot","fonts/iconfont.svg","fonts/iconfont.ttf","fonts/iconfont.woff","fonts/ionicons-used.eot","fonts/ionicons-used.otf","fonts/ionicons-used.svg","fonts/ionicons-used.ttf","fonts/ionicons-used.woff","scripts/app-a9f799770c.js","scripts/app-c6c3fdde0f.js","scripts/app-f8ef629fe8.js","scripts/vendor-5a3dedd814.js","styles/app-01d1dcd9d0.css","styles/app-bf55b5f61f.css","styles/app-ce6518f9e6.css","styles/vendor-fabce0b912.css","assets/json/debt.instruction.json","assets/json/intro.json","assets/json/level.json","assets/json/month.up.help.json","assets/json/nb-rules.json","assets/json/news.json","assets/json/team.json","assets/templates/0yjh.instructions.html","assets/templates/0yjh.protocol.html","assets/templates/debt.instructions.html","assets/templates/debt.protocol.html","assets/templates/envoy.rules.html","assets/templates/jh.protocol.html","assets/templates/jxjh.instructions.html","assets/templates/lrjh.instructions.html","assets/templates/nxy.instructions.html","assets/templates/nxy.protocol.html","assets/templates/reg.instructions.html","assets/templates/safeguard.html","assets/templates/txjh.instructions.html","assets/templates/welfare.rules.html","assets/templates/xk.instructions.html","assets/templates/yys.protocol.html"]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('nonoApp') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

