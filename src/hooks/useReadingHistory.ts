import { useEffect, useState } from "react";

const KEY = "apex-reading-history";
const MAX = 12;

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event("apex-history"));
  } catch {}
}

export function recordRead(articleId: string) {
  const ids = read().filter((id) => id !== articleId);
  ids.unshift(articleId);
  write(ids.slice(0, MAX));
}

export function clearHistory() {
  write([]);
}

export function useReadingHistory(): string[] {
  const [ids, setIds] = useState<string[]>(() => read());
  useEffect(() => {
    const sync = () => setIds(read());
    window.addEventListener("apex-history", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("apex-history", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return ids;
}
