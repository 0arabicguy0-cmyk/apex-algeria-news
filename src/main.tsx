import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { supabase } from "@/integrations/supabase/client";

// Force HTTPS: redirect any http:// load to https:// (skip localhost for development).
if (
  typeof window !== "undefined" &&
  window.location.protocol === "http:" &&
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1"
) {
  window.location.replace(
    "https:" + window.location.href.substring(window.location.protocol.length)
  );
}

// Helper: convert VAPID public key (base64url) to Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Register push notification subscription
async function registerPushNotifications() {
  // Check if browser supports it
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Push notifications not supported in this browser");
    return;
  }

  // Only ask in production or if user hasn't been asked yet
  if (Notification.permission === "denied") {
    console.warn("Notification permission denied by user");
    return;
  }

  try {
    // Wait for service worker to be ready
    const registration = await navigator.serviceWorker.ready;

    // If permission not granted, ask
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("Notification permission not granted");
        return;
      }
    }

    const vapidPublicKey = import.meta.env.VAPID_KEY;
    if (!vapidPublicKey) {
      console.warn("VAPID_PUBLIC_KEY is not set");
      return;
    }

    // Subscribe
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    // Store subscription in Supabase
    const { error } = await supabase.from("push_subscriptions").insert({
      endpoint: subscription.endpoint,
      p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("p256dh")))),
      auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey("auth")))),
    });

    if (error) {
      console.error("Failed to store push subscription:", error);
    } else {
      console.log("Push subscription stored successfully");
    }
  } catch (error) {
    console.error("Push subscription failed:", error);
  }
}

// Register service worker for PWA – only in production.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  import("virtual:pwa-register").then(({ registerSW }) => {
    registerSW({ immediate: true });
  });
}

// After React mounts, attempt push subscription (delayed to not block first paint)
createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

// Schedule push registration after the app is fully loaded
if (import.meta.env.PROD) {
  // Wait a couple seconds to let the app settle
  setTimeout(() => {
    registerPushNotifications().catch(console.error);
  }, 2000);
}