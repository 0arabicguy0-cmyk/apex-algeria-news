import { useMemo, useState } from "react";
import { useArticles } from "@/hooks/useArticles";
import { categories } from "@/lib/data";
import Header from "@/components/Header";
import BreakingTicker from "@/components/BreakingTicker";
import CategoryTabs from "@/components/CategoryTabs";
import HeroSection from "@/components/HeroSection";
import StoryCard from "@/components/StoryCard";
import MostRead from "@/components/MostRead";
import NewsletterSignup from "@/components/NewsletterSignup";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ContinueReading from "@/components/ContinueReading";
import PageTransition from "@/components/PageTransition";
import { HeroSkeleton, StoryCardSkeleton } from "@/components/Skeletons";
import { useTheme } from "@/hooks/useTheme";
import { Link, useSearchParams } from "react-router-dom";

export default function Index() {
  const { isDark, toggle } = useTheme();
  const [params, setParams] = useSearchParams();
  const activeCategory = params.get("cat") || "all";
  const { articles, loading } = useArticles();

  const setActive = (key: string) => {
    if (key === "all") setParams({}); else setParams({ cat: key });
  };

  const filtered = useMemo(
    () => activeCategory === "all" ? articles : articles.filter((a) => a.categoryKey === activeCategory),
    [articles, activeCategory]
  );

  const featured = filtered.find((a) => a.isFeatured) || filtered[0];
  const sidebar = filtered.filter((a) => a.id !== featured?.id).slice(0, 3);
  const feedItems = filtered.filter((a) => a.id !== featured?.id && !sidebar.some((s) => s.id === a.id));

  if (loading) {
    return (
      <div className="min-h-screen pb-16 md:pb-0">
        <Header isDark={isDark} onToggleTheme={toggle} />
        <HeroSkeleton />
        <div className="container grid md:grid-cols-2 gap-4 pb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <StoryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!featured) {
    return (
      <div className="min-h-screen pb-16 md:pb-0">
        <Header isDark={isDark} onToggleTheme={toggle} />
        <BreakingTicker />
        <CategoryTabs active={activeCategory} onChange={setActive} />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">لا توجد مقالات منشورة في هذا التصنيف بعد</p>
        </div>
        <Footer />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 md:pb-0 transition-colors duration-300">
      <Header isDark={isDark} onToggleTheme={toggle} />
      <BreakingTicker />
      <CategoryTabs active={activeCategory} onChange={setActive} />

      <PageTransition>
        <HeroSection featured={featured} sidebar={sidebar} />

        <ContinueReading />

        <section className="container pb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="flex items-baseline justify-between mb-2">
                <h2 className="font-bold text-lg text-foreground">
                  {activeCategory === "all" ? "آخر الأخبار" : categories.find((c) => c.key === activeCategory)?.label}
                </h2>
                {activeCategory !== "all" && (
                  <Link to={`/topic/${activeCategory}`} className="text-xs text-primary hover:underline">
                    عرض القسم كاملاً ←
                  </Link>
                )}
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-4">
                {feedItems.map((article, i) => (
                  <StoryCard key={article.id} article={article} index={i} />
                ))}
              </div>
              {feedItems.length === 0 && (
                <p className="text-sm text-muted-foreground py-6 text-center">لا توجد مقالات إضافية</p>
              )}
            </div>

            <aside className="hidden md:block space-y-6">
              <MostRead />
            </aside>
          </div>

          <NewsletterSignup />
        </section>
      </PageTransition>

      <Footer />
      <BottomNav />
    </div>
  );
}
