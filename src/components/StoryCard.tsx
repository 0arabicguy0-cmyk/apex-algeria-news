import { Link } from "react-router-dom";
import type { Article } from "@/lib/data";

export default function StoryCard({ article, index = 0 }: { article: Article; index?: number }) {
  return (
    <Link
      to={`/article/${article.id}`}
      className="group flex gap-4 py-4 border-b border-border last:border-b-0 md:flex-col md:border-b-0 animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
    >
      <div className="w-[40%] md:w-full flex-shrink-0 rounded-lg overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          width={400}
          height={256}
          className="w-full h-24 md:h-44 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="flex flex-col justify-center flex-1 md:pt-3">
        <span className="text-[11px] font-bold text-dz-green mb-1">{article.category}</span>
        <h3 className="font-bold text-foreground leading-snug line-clamp-2 mb-1.5 group-hover:text-primary transition-colors text-sm md:text-base">
          {article.title}
        </h3>
        <p className="hidden md:block text-sm text-muted-foreground line-clamp-2 mb-2">{article.excerpt}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{article.author}</span>
          <span>·</span>
          <span>{article.date}</span>
          <span>·</span>
          <span>{article.readTime} قراءة</span>
        </div>
      </div>
    </Link>
  );
}
