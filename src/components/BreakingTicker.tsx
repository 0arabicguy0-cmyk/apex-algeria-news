import { useEffect, useState } from "react";
import { useBreakingNews } from "@/hooks/useBreakingNews";
import { Link } from "react-router-dom";

export default function BreakingTicker() {
  const items = useBreakingNews();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);

  if (items.length === 0) return null;
  const current = items[idx];

  const content = (
    <p className="text-sm font-medium truncate animate-in fade-in" key={current.id}>
      {current.text}
    </p>
  );

  return (
    <div className="bg-navy text-navy-foreground overflow-hidden sticky top-14 z-50">
      <div className="container flex items-center h-9 gap-3">
        <span className="flex-shrink-0 bg-amber text-amber-foreground px-3 py-0.5 rounded-sm text-xs font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-destructive animate-pulse-dot" />
          عاجل
        </span>
        <div className="flex-1 overflow-hidden">
          {current.link_article_id ? (
            <Link to={`/article/${current.link_article_id}`} className="hover:underline">
              {content}
            </Link>
          ) : content}
        </div>
        {items.length > 1 && (
          <div className="hidden md:flex gap-1 flex-shrink-0">
            {items.map((_, i) => (
              <span key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? "bg-amber" : "bg-white/30"}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
