import { Link } from "react-router-dom";
import { Flame, Eye, Play } from "lucide-react";
import { articleUrl, useTrendingWeek, type Article } from "@/hooks/useArticles";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function TrendingCard({ article }: { article: Article }) {
  const { t } = useLanguage();
  const isVideo = article.media_type === "youtube" || article.media_type === "video";
  const image = isVideo ? article.video_thumbnail || article.image : article.image;

  return (
    <Link to={articleUrl(article)} className="group block">
      <div className="rounded-lg overflow-hidden relative">
        <img
          src={image}
          alt={article.title}
          loading="lazy"
          width={400}
          height={256}
          className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 rounded-full p-2 backdrop-blur-sm">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
          </div>
        )}
        <span className="absolute bottom-0 start-0 bg-dz-green text-white text-[11px] font-bold px-2 py-0.5 rounded-se-md">
          {article.category}
        </span>
      </div>
      <h3 className="mt-2 font-bold text-sm md:text-base text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
        {article.title}
      </h3>
      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" />
          {article.viewCount.toLocaleString("ar-DZ")} {t("views")}
        </span>
        <span>·</span>
        <span>{article.date}</span>
      </div>
    </Link>
  );
}

export default function TrendingCarousel() {
  const { t, isRTL } = useLanguage();
  const articles = useTrendingWeek(10);

  if (articles.length === 0) return null;

  return (
    <section className="container py-6">
      <h2 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
        <Flame className="w-5 h-5 text-amber" />
        {t("trendingWeek")}
      </h2>
      <Carousel
        opts={{ align: "start", direction: isRTL ? "rtl" : "ltr" }}
        className="w-full"
      >
        <CarouselContent className="-ms-3">
          {articles.map((article) => (
            <CarouselItem
              key={article.id}
              className="ps-3 basis-[70%] sm:basis-[45%] md:basis-[31%] lg:basis-[23%]"
            >
              <TrendingCard article={article} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
}
