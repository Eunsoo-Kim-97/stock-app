// 앱 설치용 서비스 워커
// 항상 인터넷에서 최신 화면과 데이터를 먼저 가져오고, 인터넷이 안 되면 마지막으로 본 화면을 보여줘요.
const CACHE = "stock-app-v2";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => event.waitUntil(
  caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)   // data.json 은 화면 쪽에서 cache: "no-store" 로 요청해요.
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request, { ignoreSearch: true }))
  );
});
