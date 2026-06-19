/* eslint-disable no-undef */
// Firebase Cloud Messaging service worker — background notifications.
// MUST be served from the site root so its scope covers the whole app.

importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAKX7VcsNdevIBMpv0baWHnH4r17l19bdM",
  authDomain: "apex-c5262.firebaseapp.com",
  projectId: "apex-c5262",
  storageBucket: "apex-c5262.firebasestorage.app",
  messagingSenderId: "609645507794",
  appId: "1:609645507794:web:28e89e924dd7445211e90b",
});

const messaging = firebase.messaging();

// Background handler — fired when the tab is closed or not focused.
// We send our payload as `data` (not `notification`) so that this handler
// runs and we can fully control title/body/icon/requireInteraction.
messaging.onBackgroundMessage((payload) => {
  const d = payload.data || {};
  const isBreaking = d.is_breaking === "true";

  const prefix = isBreaking ? "🚨 BREAKING NEWS" : "📰 New Article";
  const title = `${prefix} — ${d.title || "Apex News"}`;

  const options = {
    body: d.body || "",
    icon: isBreaking ? "/icon-512.png" : "/icon-192.png",
    badge: "/icon-192.png",
    tag: d.tag || (isBreaking ? "apex-breaking" : "apex-news"),
    data: { url: d.url || "/", articleId: d.article_id || null },
    dir: "rtl",
    lang: "ar",
    requireInteraction: isBreaking,
    renotify: isBreaking,
  };

  if (d.image) options.image = d.image;

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        try {
          const u = new URL(client.url);
          if (u.origin === self.location.origin && "focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        } catch {}
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    }),
  );
});
