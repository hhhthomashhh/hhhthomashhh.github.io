const VERSION='merge-army-v2.0.0';
const FILES=['./','./index.html','./style-v2.css','./manifest.webmanifest','./assets/army-atlas.webp','./assets/greenwood.webp','./assets/icon-192.png','./assets/icon-512.png','./assets/icon-maskable.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(FILES)))});
self.addEventListener('activate',e=>{e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('merge-army-')&&k!==VERSION).map(k=>caches.delete(k)))),self.clients.claim()]))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url),scope=new URL(self.registration.scope);
  if(url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
  e.respondWith(fetch(e.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(VERSION).then(c=>c.put(e.request,copy)).catch(()=>{})}return response}).catch(async()=>{const cache=await caches.open(VERSION),cached=await cache.match(e.request);if(cached)return cached;if(e.request.mode==='navigate')return cache.match('./index.html');return Response.error()}));
});
