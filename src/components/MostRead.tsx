import { Link } from "react-router-dom";
import { articles } from "@/lib/data";

export default function MostRead() {
  return (
    <div className="bg-card rounded-xl p-5 border border-border">
      <h3 className="font-bold text-foreground mb-4 text-lg">الأكثر قراءة</h3>
      <div className="flex flex-col gap-3">
        {articles.slice(0, 5).map((article, i) => (
          <Link
            key={article.id}
            to={`/article/${article.id}`}
            className="flex items-start gap-3 group"
          >
            <span className="text-2xl font-bold text-primary/30 leading-none mt-1 w-6 text-center flex-shrink-0">
              {i + 1}
            </span>
            <div>
              <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                {article.title}
              </h4>
              <span className="text-xs text-muted-foreground mt-1 block">{article.date}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
