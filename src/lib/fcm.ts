import { getToken, deleteToken, onMessage } from "firebase/messaging";
import { getMessagingSafe } from "@/firebase";
import { supabase } from "@/integrations/supabase/client";

const SW_URL = "/firebase-messaging-sw.js";
const TOKEN_KEY = "apex_fcm_token_v1";
const OPTIN_KEY = "apex_fcm_optin_v1";

function isInIframe() {
  try { return window.self !== window.top; } catch { return true; }
}

export function fcmSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "Notification" in window &&
    !isInIframe()
  );
}

export function isOptedIn() {
  return typeof localStorage !== "undefined" && localStorage.getItem(OPTIN_KEY) === "1";
}

export function getPermissionState(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}

let vapidKeyCache: string | null = null;
async function fetchVapidKey(): Promise<string | null> {
  if (vapidKeyCache) return vapidKeyCache;
  try {
    const { data, error } = await supabase.functions.invoke("fcm-config");
    if (error || !data?.vapidKey) return null;
    vapidKeyCache = data.vapidKey;
    return vapidKeyCache;
  } catch {
    return null;
  }
}

async function registerSW(): Promise<ServiceWorkerRegistration | null> {
  try {
    const existing = await navigator.serviceWorker.getRegistration(SW_URL);
    if (existing) return existing;
    return await navigator.serviceWorker.register(SW_URL);
  } catch {
    return null;
  }
}

export type EnableResult =
  | { ok: true; token: string }
  | { ok: false; reason: "unsupported" | "denied" | "no-vapid" | "no-token" | "error"; message?: string };

export async function enableFcm(): Promise<EnableResult> {
  if (!fcmSupported()) return { ok: false, reason: "unsupported" };

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return { ok: false, reason: "denied" };

  const [messaging, vapidKey, swReg] = await Promise.all([
    getMessagingSafe(),
    fetchVapidKey(),
    registerSW(),
  ]);
  if (!messaging) return { ok: false, reason: "unsupported" };
  if (!vapidKey) return { ok: false, reason: "no-vapid" };
  if (!swReg) return { ok: false, reason: "unsupported" };

  let token: string | null = null;
  try {
    token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: swReg });
  } catch (e) {
    return { ok: false, reason: "error", message: (e as Error).message };
  }
  if (!token) return { ok: false, reason: "no-token" };

  const { error } = await supabase.functions.invoke("fcm-register-token", {
    body: { token, user_agent: navigator.userAgent, enabled: true },
  });
  if (error) return { ok: false, reason: "error", message: error.message };

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(OPTIN_KEY, "1");

  // Foreground messages — show via the SW so styling matches background.
  onMessage(messaging, (payload) => {
    const d = payload.data || {};
    const isBreaking = d.is_breaking === "true";
    const prefix = isBreaking ? "🚨 BREAKING NEWS" : "📰 New Article";
    const title = `${prefix} — ${d.title || "Apex News"}`;
    swReg.showNotification(title, {
      body: d.body || "",
      icon: isBreaking ? "/icon-512.png" : "/icon-192.png",
      badge: "/icon-192.png",
      tag: d.tag || (isBreaking ? "apex-breaking" : "apex-news"),
      data: { url: d.url || "/" },
      dir: "rtl",
      lang: "ar",
      requireInteraction: isBreaking,
      ...(isBreaking ? { renotify: true } : {}),
    } as NotificationOptions);
  });

  return { ok: true, token };
}

export async function disableFcm(): Promise<void> {
  const token = localStorage.getItem(TOKEN_KEY);
  localStorage.removeItem(OPTIN_KEY);
  localStorage.removeItem(TOKEN_KEY);
  try {
    const messaging = await getMessagingSafe();
    if (messaging) await deleteToken(messaging);
  } catch {}
  if (token) {
    try {
      await supabase.functions.invoke("fcm-unregister-token", { body: { token } });
    } catch {}
  }
}

/** Silent re-registration if the user previously opted in. Call on app start. */
export async function autoReregister(): Promise<void> {
  if (!isOptedIn() || !fcmSupported()) return;
  if (getPermissionState() !== "granted") return;
  await enableFcm();
}
