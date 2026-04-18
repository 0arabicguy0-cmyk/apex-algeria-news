import { useEffect, useState, useCallback } from "react";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  category: string;
  articleId: string | null;
  createdAt: string; // ISO
  read: boolean;
}

const KEY = "apex-notifications";
const PERM_KEY = "apex-notif-permission"; // mock subscribe state ("granted" | "denied" | "default")

const uid = () => Math.random().toString(36).slice(2, 11);
const now = () => new Date().toISOString();

const seed = (): AppNotification[] => [
  {
    id: uid(),
    title: "عاجل: مشروع الطاقة المتجددة",
    body: "الجزائر تطلق أكبر مشروع للطاقة الشمسية في إفريقيا بقدرة ٥ غيغاواط.",
    category: "breaking",
    articleId: "1",
    createdAt: new Date(Date.now() - 5 * 60_000).toISOString(),
    read: false,
  },
  {
    id: uid(),
    title: "اقتصاد",
    body: "البرلمان يصادق على قانون الاستثمار الجديد.",
    category: "economy",
    articleId: "2",
    createdAt: new Date(Date.now() - 45 * 60_000).toISOString(),
    read: false,
  },
  {
    id: uid(),
    title: "رياضة",
    body: "المنتخب الوطني يحقق فوزاً تاريخياً في تصفيات كأس العالم.",
    category: "sports",
    articleId: "4",
    createdAt: new Date(Date.now() - 3 * 3600_000).toISOString(),
    read: true,
  },
];

const load = (): AppNotification[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const s = seed();
  localStorage.setItem(KEY, JSON.stringify(s));
  return s;
};

let state: AppNotification[] = typeof window !== "undefined" ? load() : [];
const listeners = new Set<() => void>();

const persist = () => {
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
};

export const notificationsApi = {
  all: () => [...state].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  unreadCount: () => state.filter((n) => !n.read).length,
  markAllRead: () => {
    state = state.map((n) => ({ ...n, read: true }));
    persist();
  },
  markRead: (id: string) => {
    state = state.map((n) => (n.id === id ? { ...n, read: true } : n));
    persist();
  },
  clearAll: () => {
    state = [];
    persist();
  },
  push: (n: Omit<AppNotification, "id" | "createdAt" | "read">) => {
    const item: AppNotification = { ...n, id: uid(), createdAt: now(), read: false };
    state = [item, ...state];
    persist();
    // Fire native browser notification if permission granted
    try {
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification(item.title, { body: item.body, icon: "/favicon.ico" });
      }
    } catch {}
    return item;
  },
};

export function getPermissionState(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  const result = await Notification.requestPermission();
  localStorage.setItem(PERM_KEY, result);
  return result;
}

export function useNotifications() {
  const [items, setItems] = useState<AppNotification[]>(notificationsApi.all());

  useEffect(() => {
    const fn = () => setItems(notificationsApi.all());
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);

  // Demo: simulate a fresh push notification 20s after first mount (once per session)
  useEffect(() => {
    const FLAG = "apex-notif-demo-fired";
    if (sessionStorage.getItem(FLAG)) return;
    const t = setTimeout(() => {
      notificationsApi.push({
        title: "تنبيه: تكنولوجيا",
        body: "الجزائر تحتضن أكبر مؤتمر تكنولوجي في شمال إفريقيا.",
        category: "tech",
        articleId: "3",
      });
      sessionStorage.setItem(FLAG, "1");
    }, 20_000);
    return () => clearTimeout(t);
  }, []);

  const unread = items.filter((n) => !n.read).length;

  const markAllRead = useCallback(() => notificationsApi.markAllRead(), []);
  const markRead = useCallback((id: string) => notificationsApi.markRead(id), []);
  const clearAll = useCallback(() => notificationsApi.clearAll(), []);

  return { items, unread, markAllRead, markRead, clearAll };
}
