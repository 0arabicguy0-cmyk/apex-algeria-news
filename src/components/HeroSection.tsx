import { Link } from "react-router-dom";
import type { Article } from "@/hooks/useArticles";
import FactCheckBadge from "@/components/FactCheckBadge";
import PremiumBadge from "@/components/PremiumBadge";

interface HeroSectionProps {
  featured: Article;
  sidebar: Article[];
}

export default function HeroSection({ featured, sidebar }: HeroSectionProps) {
  return (
    <section className="container py-4 md:py-6">
      <div className="grid md:grid-cols-5 gap-4">
        {/* Main hero */}
        {/* Main hero */}
        <Link
          to={`/article/${featured.id}`}
          className="md:col-span-3 relative overflow-hidden rounded-xl group min-h-[350px] md:min-h-[520px]"
        >
          {/* Image fills the entire card */}
          <img
            src={featured.image}
            alt={featured.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Overlay */}
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
                src={article.image}
                alt={article.title}
                loading="lazy"
                className="w-full h-32 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
              <div className="absolute top-3 right-3 flex gap-1.5 flex-wrap">
                <span className="bg-dz-green text-accent-foreground px-2 py-0.5 rounded-sm text-[11px] font-bold">
                  {article.category}
                </span>
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
