import { Link } from "react-router-dom";
import { useTrending } from "@/hooks/useArticles";
import { Flame } from "lucide-react";

export default function MostRead() {
  const articles = useTrending(5);

  if (articles.length === 0) {
    return (
      <div className="bg-card rounded-xl p-5 border border-border">
        <h3 className="font-bold text-foreground mb-4 text-lg flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber" />
          الأكثر قراءة
        </h3>
        <p className="text-sm text-muted-foreground">لا توجد مقالات بعد</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-5 border border-border">
      <h3 className="font-bold text-foreground mb-4 text-lg flex items-center gap-2">
        <Flame className="w-4 h-4 text-amber" />
        الأكثر قراءة
      </h3>
      <div className="flex flex-col gap-3">
        {articles.map((article, i) => (
          <Link
            key={article.id}
            to={`/article/${article.id}`}
            className="flex items-start gap-3 group"
          >
            <span className="text-2xl font-bold text-primary/30 leading-none mt-1 w-6 text-center flex-shrink-0">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                {article.title}
              </h4>
              <span className="text-xs text-muted-foreground mt-1 block">
                {article.viewCount} مشاهدة · {article.date}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
