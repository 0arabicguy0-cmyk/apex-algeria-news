/// <reference lib="webworker" />
// Custom service worker — merged into the PWA SW by Workbox via injectManifest fallback,
// but here we use the simpler approach: vite-plugin-pwa (generateSW) lets us inject custom
// code via importScripts. We register THIS file separately so push works alongside Workbox.

self.addEventListener("push", (event) => {
  let data = { title: "Apex News", body: "", url: "/", icon: "/icon-192.png", tag: "apex-news" };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {
    if (event.data) data.body = event.data.text();
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: "/icon-192.png",
      tag: data.tag,
      data: { url: data.url },
      dir: "rtl",
      lang: "ar",
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    }),
  );
});
