import { Link } from "react-router-dom";
import type { Article } from "@/hooks/useArticles";
import FactCheckBadge from "@/components/FactCheckBadge";
import PremiumBadge from "@/components/PremiumBadge";
import { useLanguage } from "@/hooks/useLanguage";
import { Play } from "lucide-react";

export default function StoryCard({ article, index = 0 }: { article: Article; index?: number }) {
  const { isRTL } = useLanguage();

  // Helper: get the correct image source (video thumbnail if video)
  const getDisplayImage = (article: Article) => {
    if (article.media_type === "youtube" || article.media_type === "video") {
      return article.video_thumbnail || article.image;
    }
    return article.image;
  };

  // Helper: check if article is a video
  const isVideo = (article: Article) => {
    return article.media_type === "youtube" || article.media_type === "video";
  };

  return (
    <Link
      to={`/article/${article.id}`}
      className="group flex gap-4 py-4 border-b border-border last:border-b-0 md:flex-col md:border-b-0 animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
    >
      <div className="w-[40%] md:w-full flex-shrink-0 rounded-lg overflow-hidden relative">
        <img
          src={getDisplayImage(article)}
          alt={article.title}
          loading="lazy"
          width={400}
          height={256}
          className="w-full h-24 md:h-44 object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Video overlay – play button */}
        {isVideo(article) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 rounded-full p-1.5 md:p-2 backdrop-blur-sm">
              <Play className="w-4 h-4 md:w-5 md:h-5 text-white fill-white" />
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 start-2 flex gap-1">
          {article.isPremium && <PremiumBadge size="sm" />}
          {isVideo(article) && (
            <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded-sm text-[10px] font-bold flex items-center gap-0.5">
              <Play className="w-2.5 h-2.5 fill-current" />
              فيديو
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-center flex-1 md:pt-3">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[11px] font-bold text-dz-green">{article.category}</span>
          {article.factCheck && article.factCheck !== "none" && <FactCheckBadge label={article.factCheck} size="sm" />}
        </div>
        <h3 className="font-bold text-foreground leading-snug line-clamp-2 mb-1.5 group-hover:text-primary transition-colors text-sm md:text-base">
          {article.title}
        </h3>
        <p className="hidden md:block text-sm text-muted-foreground line-clamp-2 mb-2">{article.excerpt}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{article.author}</span>
          <span>·</span>
          <span>{article.date}</span>
          <span>·</span>
          <span>{article.readTime} {isRTL ? "قراءة" : "read"}</span>
        </div>
      </div>
    </Link>
  );
}