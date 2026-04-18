import { useEffect, useState } from "react";

const KEY = "apex:bookmarks";

function read(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function useBookmarks() {
  const [ids, setIds] = useState<string[]>(read);

  useEffect(() => {
    const onStorage = () => setIds(read());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = (id: string) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  const has = (id: string) => ids.includes(id);

  return { ids, toggle, has };
}
