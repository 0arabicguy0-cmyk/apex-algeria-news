import { Link } from "react-router-dom";
import type { Article } from "@/hooks/useArticles";
import FactCheckBadge from "@/components/FactCheckBadge";
import PremiumBadge from "@/components/PremiumBadge";
import { Play } from "lucide-react";

interface HeroSectionProps {
  featured: Article;
  sidebar: Article[];
}

export default function HeroSection({ featured, sidebar }: HeroSectionProps) {
  // Helper to get the display image (thumbnail for videos, main image for images)
  const getDisplayImage = (article: Article) => {
    let imageUrl: string;

    // If it's a video, use video_thumbnail if available, else fallback to image_url or image
    if (article.media_type === "youtube" || article.media_type === "video") {
      imageUrl = article.video_thumbnail || article.image_url || article.image;
    } else {
      // For images: prefer image_url, fallback to image
      imageUrl = article.image_url || article.image;
    }

    // If still empty, use a transparent placeholder to avoid broken images
    if (!imageUrl) {
      imageUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E";
    }

    console.log(`[HeroSection] Image for article ${article.id}:`, imageUrl);
    return imageUrl;
  };

  // Helper to check if article is a video
  const isVideo = (article: Article) => {
    return article.media_type === "youtube" || article.media_type === "video";
  };

  return (
    <section className="container py-4 md:py-6">
      <div className="grid md:grid-cols-5 gap-4">
        {/* Main hero */}
        <Link
          to={`/article/${featured.id}`}
          className="md:col-span-3 relative overflow-hidden rounded-xl group min-h-[350px] md:min-h-[520px]"
        >
          {/* Image / Video Thumbnail */}
          <img
            src={getDisplayImage(featured)}
            alt={featured.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Video overlay – play button */}
          {isVideo(featured) && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="bg-black/60 rounded-full p-4 md:p-5 backdrop-blur-sm">
                <Play className="w-8 h-8 md:w-12 md:h-12 text-white fill-white" />
              </div>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 right-4 flex gap-2 flex-wrap z-10">
            <span className="bg-dz-green text-accent-foreground px-3 py-1 rounded-sm text-xs font-bold">
              {featured.category}
            </span>

            {featured.isBreaking && (
              <span className="bg-amber text-amber-foreground px-3 py-1 rounded-sm text-xs font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse-dot" />
                عاجل
              </span>
            )}

            {isVideo(featured) && (
              <span className="bg-blue-600 text-white px-3 py-1 rounded-sm text-xs font-bold flex items-center gap-1">
                <Play className="w-3 h-3 fill-current" />
                فيديو
              </span>
            )}

            {featured.isPremium && <PremiumBadge />}

            {featured.factCheck && featured.factCheck !== "none" && (
              <FactCheckBadge label={featured.factCheck} size="sm" />
            )}
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
            <h2 className="text-xl md:text-3xl font-bold text-primary-foreground leading-snug mb-2 line-clamp-3">
              {featured.title}
            </h2>

            <div className="flex items-center gap-3 text-primary-foreground/70 text-sm">
              <span>{featured.author}</span>
              <span>·</span>
              <span>{featured.date}</span>
            </div>
          </div>
        </Link>

        {/* Sidebar stories */}
        <div className="md:col-span-2 flex flex-col gap-4">
          {sidebar.map((article) => (
            <Link
              key={article.id}
              to={`/article/${article.id}`}
              className="group relative rounded-xl overflow-hidden flex-1"
            >
              <img
                src={getDisplayImage(article)}
                alt={article.title}
                loading="lazy"
                className="w-full h-32 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Video overlay – small play button */}
              {isVideo(article) && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="bg-black/50 rounded-full p-2 backdrop-blur-sm">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
              <div className="absolute top-3 right-3 flex gap-1.5 flex-wrap">
                <span className="bg-dz-green text-accent-foreground px-2 py-0.5 rounded-sm text-[11px] font-bold">
                  {article.category}
                </span>
                {isVideo(article) && (
                  <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded-sm text-[10px] font-bold flex items-center gap-0.5">
                    <Play className="w-2.5 h-2.5 fill-current" />
                  </span>
                )}
                {article.isPremium && <PremiumBadge size="sm" />}
              </div>
              <div className="absolute bottom-0 right-0 left-0 p-3">
                <h3 className="text-sm md:text-base font-bold text-primary-foreground leading-snug line-clamp-2">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}