import { Link } from "react-router-dom";
import { Clock, X } from "lucide-react";
import { useReadingHistory, clearHistory } from "@/hooks/useReadingHistory";
import { articlesApi } from "@/lib/mockStore";
import { mapArticle } from "@/hooks/useArticles";
import { useLanguage } from "@/hooks/useLanguage";

export default function ContinueReading() {
  const ids = useReadingHistory();
  const { t } = useLanguage();
  if (ids.length === 0) return null;

  const items = articlesApi
    .byIds(ids)
    .map(mapArticle)
    .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
    .slice(0, 8);

  if (items.length === 0) return null;

  return (
    <section className="container py-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <h2 className="font-bold text-base text-foreground">{t("continueReading")}</h2>
        </div>
        <button
          onClick={clearHistory}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
          aria-label={t("clearHistory")}
        >
          <X className="w-3 h-3" />
          {t("clear")}
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {items.map((a, i) => (
          <Link
            key={a.id}
            to={`/article/${a.id}`}
            className="flex-shrink-0 w-44 group animate-fade-in-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="rounded-lg overflow-hidden mb-2 bg-muted">
              <img
                src={a.image}
                alt={a.title}
                loading="lazy"
                className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="text-[10px] font-bold text-dz-green">{a.category}</span>
            <h3 className="text-xs font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {a.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
