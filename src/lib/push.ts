import { supabase } from "@/integrations/supabase/client";

const SW_URL = "/push-sw.js";
const SW_SCOPE = "/push/";
const STORAGE_KEY = "apex_push_endpoint_v1";

const isPreviewHost =
  typeof window !== "undefined" &&
  (window.location.hostname.includes("id-preview--") ||
    window.location.hostname.includes("lovableproject.com"));

function isInIframe() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function pushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window &&
    !isInIframe() &&
    !isPreviewHost
  );
}

export function isPushSubscribedLocally() {
  return typeof localStorage !== "undefined" && !!localStorage.getItem(STORAGE_KEY);
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) out[i] = raw.charCodeAt(i);
  return out;
}

async function getSwReg() {
  // Register a dedicated SW that handles push only (alongside Workbox PWA SW).
  const existing = await navigator.serviceWorker.getRegistration(SW_SCOPE);
  if (existing) return existing;
  return navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE });
}

export async function enablePush(): Promise<{ ok: boolean; reason?: string }> {
  if (!pushSupported()) return { ok: false, reason: "unsupported" };
  const perm = await Notification.requestPermission();
  if (perm !== "granted") return { ok: false, reason: perm };

  const reg = await getSwReg();
  await navigator.serviceWorker.ready;

  const { data, error } = await supabase.functions.invoke("push-vapid-key");
  if (error || !data?.publicKey) return { ok: false, reason: "no_key" };

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(data.publicKey),
    });
  }

  const json = sub.toJSON();
  const { error: subErr } = await supabase.functions.invoke("push-subscribe", {
    body: {
      endpoint: json.endpoint,
      keys: json.keys,
      userAgent: navigator.userAgent,
    },
  });
  if (subErr) return { ok: false, reason: "save_failed" };

  localStorage.setItem(STORAGE_KEY, json.endpoint!);
  return { ok: true };
}

export async function disablePush() {
  if (!pushSupported()) return;
  const reg = await navigator.serviceWorker.getRegistration(SW_SCOPE);
  const sub = await reg?.pushManager.getSubscription();
  if (sub) await sub.unsubscribe();
  localStorage.removeItem(STORAGE_KEY);
}
