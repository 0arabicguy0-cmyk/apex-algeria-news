import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  category: string;
  articleId: string | null;
  createdAt: string; // ISO
  read: boolean;
}

const PERM_KEY = "apex-notif-permission";
const READ_IDS_KEY = "apex-notif-read-ids-v1";
const LAST_READ_KEY = "apex-notif-last-read-v1";
const CLEARED_AT_KEY = "apex-notif-cleared-at-v1";
const MAX_ITEMS = 30;

type ArticleRow = {
  id: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  is_breaking: boolean | null;
  published_at: string | null;
  created_at: string;
};

function readSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}
function writeSet(key: string, set: Set<string>) {
  localStorage.setItem(key, JSON.stringify([...set]));
}

function toNotification(a: ArticleRow, readIds: Set<string>, lastReadAt: string | null): AppNotification {
  const createdAt = a.published_at ?? a.created_at;
  const read = readIds.has(a.id) || (lastReadAt !== null && createdAt <= lastReadAt);
  return {
    id: a.id,
    title: a.is_breaking ? `🚨 ${a.title}` : a.title,
    body: a.excerpt ?? "",
    category: a.category ?? "news",
    articleId: a.id,
    createdAt,
    read,
  };
}

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
  const [rows, setRows] = useState<ArticleRow[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(() => readSet(READ_IDS_KEY));
  const [lastReadAt, setLastReadAt] = useState<string | null>(() => localStorage.getItem(LAST_READ_KEY));
  const [clearedAt, setClearedAt] = useState<string | null>(() => localStorage.getItem(CLEARED_AT_KEY));

  // Initial fetch
  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, excerpt, category, is_breaking, published_at, created_at")
        .eq("status", "published")
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(MAX_ITEMS);
      if (!active || error || !data) return;
      setRows(data as ArticleRow[]);
    })();
    return () => { active = false; };
  }, []);

  // Realtime — new/updated published articles
  useEffect(() => {
    const channel = supabase
      .channel("notif-articles")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "articles" },
        (payload) => {
          const a = payload.new as ArticleRow & { status: string };
          if (a.status !== "published") return;
          setRows((prev) => [a, ...prev.filter((r) => r.id !== a.id)].slice(0, MAX_ITEMS));
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "articles" },
        (payload) => {
          const a = payload.new as ArticleRow & { status: string };
          if (a.status !== "published") {
            setRows((prev) => prev.filter((r) => r.id !== a.id));
            return;
          }
          setRows((prev) => {
            const exists = prev.some((r) => r.id === a.id);
            const next = exists ? prev.map((r) => (r.id === a.id ? a : r)) : [a, ...prev];
            return next
              .sort((x, y) => (y.published_at ?? y.created_at).localeCompare(x.published_at ?? x.created_at))
              .slice(0, MAX_ITEMS);
          });
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const items: AppNotification[] = rows
    .filter((a) => {
      const t = a.published_at ?? a.created_at;
      return !clearedAt || t > clearedAt;
    })
    .sort((a, b) =>
      (b.published_at ?? b.created_at).localeCompare(a.published_at ?? a.created_at),
    )
    .map((a) => toNotification(a, readIds, lastReadAt));

  const unread = items.filter((n) => !n.read).length;

  const markAllRead = useCallback(() => {
    const now = new Date().toISOString();
    localStorage.setItem(LAST_READ_KEY, now);
    setLastReadAt(now);
  }, []);

  const markRead = useCallback((id: string) => {
    setReadIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      writeSet(READ_IDS_KEY, next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    const now = new Date().toISOString();
    localStorage.setItem(CLEARED_AT_KEY, now);
    setClearedAt(now);
  }, []);

  return { items, unread, markAllRead, markRead, clearAll };
}
