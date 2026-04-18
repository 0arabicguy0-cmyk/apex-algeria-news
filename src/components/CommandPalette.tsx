import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Newspaper, Bookmark, Mail, Hash, ArrowLeft } from "lucide-react";
import { categories } from "@/lib/data";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    setQ("");
    navigate(path);
  };

  if (!open) return null;

  const items = [
    { label: "الرئيسية", icon: Newspaper, path: "/" },
    { label: "المحفوظات", icon: Bookmark, path: "/bookmarks" },
    { label: "تواصل معنا", icon: Mail, path: "/contact" },
    ...categories.filter((c) => c.key !== "all").map((c) => ({
      label: c.label,
      icon: Hash,
      path: `/topic/${c.key}`,
    })),
  ];
  const filtered = q ? items.filter((i) => i.label.includes(q)) : items;

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center pt-24 px-4" dir="rtl">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg bg-popover rounded-xl shadow-2xl border border-border overflow-hidden animate-float-in">
        <div className="flex items-center gap-2 px-4 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث أو انتقل إلى..."
            className="flex-1 py-3 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            onKeyDown={(e) => {
              if (e.key === "Enter" && q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`);
            }}
          />
          <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto py-1">
          {q.trim() && (
            <button
              onClick={() => go(`/search?q=${encodeURIComponent(q.trim())}`)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <Search className="w-4 h-4 text-primary" />
              <span>بحث عن "<span className="font-bold">{q}</span>"</span>
              <ArrowLeft className="w-3 h-3 mr-auto text-muted-foreground" />
            </button>
          )}
          {filtered.map((it) => (
            <button
              key={it.path}
              onClick={() => go(it.path)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <it.icon className="w-4 h-4 text-muted-foreground" />
              <span>{it.label}</span>
            </button>
          ))}
          {filtered.length === 0 && !q.trim() && (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">لا نتائج</p>
          )}
        </div>
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/40 text-[11px] text-muted-foreground">
          <span>اضغط Enter للبحث</span>
          <span>⌘K للفتح</span>
        </div>
      </div>
    </div>
  );
}
