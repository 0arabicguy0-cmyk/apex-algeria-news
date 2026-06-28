import { Link } from "react-router-dom";
import { Clock, X, Play } from "lucide-react";
import { useReadingHistory, clearHistory } from "@/hooks/useReadingHistory";
import { useArticlesByIds } from "@/hooks/useArticles";
import { useLanguage } from "@/hooks/useLanguage";
import { useMemo } from "react";
import { useVideosByIds } from "@/hooks/useVideos";

export default function ContinueReading() {
  const history = useReadingHistory(); // now returns [{ type: 'article'|'video', id: string }]
  const { t } = useLanguage();

  // Separate IDs by type
  const articleIds = useMemo(
    () => history.filter((item) => item.type === "article").map((item) => item.id),
    [history]
  );
  const videoIds = useMemo(
    () => history.filter((item) => item.type === "video").map((item) => item.id),
    [history]
  );

  // Fetch both types
  const articles = useArticlesByIds(articleIds);
  const videos = useVideosByIds(videoIds);

  // Combine and sort according to the original history order
  const items = useMemo(() => {
    const all = [...articles, ...videos];
    // Build a map for quick lookup
    const map = {};
    all.forEach((item) => {
      // Each item must have a unique key: type+id
      const key = `${item.type}-${item.id}`;
      map[key] = item;
    });
    // Reconstruct in history order
    return history
      .map((h) => {
        const key = `${h.type}-${h.id}`;
        return map[key] || null;
      })
      .filter(Boolean)
      .slice(0, 8);
  }, [history, articles, videos]);

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
        {items.map((item, i) => {
          const isVideo = item.type === "video";
          const linkTo = isVideo ? `/video/${item.id}` : `/article/${item.id}`;
          const thumbnail = item.thumbnail || item.image; // adjust field names as needed
          const category = item.category || (isVideo ? t("video") : t("article"));

          return (
            <Link
              key={`${item.type}-${item.id}`}
              to={linkTo}
              className="flex-shrink-0 w-44 group animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="relative rounded-lg overflow-hidden mb-2 bg-muted">
                <img
                  src={thumbnail}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[10px] font-bold text-dz-green">{category}</span>
              <h3 className="text-xs font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
}