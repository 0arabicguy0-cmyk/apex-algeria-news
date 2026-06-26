import { useMemo } from "react";
import { useArticles } from "@/hooks/useArticles";
import { categories } from "@/lib/data";
import Header from "@/components/Header";
import BreakingTicker from "@/components/BreakingTicker";
import CategoryTabs from "@/components/CategoryTabs";
import HeroSection from "@/components/HeroSection";
import StoryCard from "@/components/StoryCard";
import AdBanner from "@/components/AdBanner";
import MostRead from "@/components/MostRead";
import NewsletterSignup from "@/components/NewsletterSignup";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import BottomNav from "@/components/BottomNav";
import ContinueReading from "@/components/ContinueReading";
import PageTransition from "@/components/PageTransition";
import WeatherPrayerWidget from "@/components/WeatherPrayerWidget";
import { HeroSkeleton, StoryCardSkeleton } from "@/components/Skeletons";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { Link, useSearchParams } from "react-router-dom";
import { Fragment } from "react";
import type { Article } from "@/hooks/useArticles";

function FeedItem({ article, index }: { article: Article; index: number }) {
  return (
    <Fragment>
      <StoryCard article={article} index={index} />
      {index === 3 && (
        <div className="md:col-span-2">
          <AdBanner variant="inline" />
        </div>
      )}
    </Fragment>
  );
}

export default function Index() {
  const { isDark, toggle } = useTheme();
  const { t, lang } = useLanguage();
  const isRTL = lang === "ar";
  const [params, setParams] = useSearchParams();
  const activeCategory = params.get("cat") || "all";
  const { articles, loading } = useArticles();

  const setActive = (key: string) => {
    if (key === "all") setParams({});
    else setParams({ cat: key });
  };

  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? articles
        : articles.filter((a) => a.categoryKey === activeCategory),
    [articles, activeCategory]
  );

  const featured = filtered.find((a) => a.isFeatured) || filtered[0];
  const sidebar = filtered.filter((a) => a.id !== featured?.id).slice(0, 3);
  const feedItems = filtered.filter(
    (a) => a.id !== featured?.id && !sidebar.some((s) => s.id === a.id)
  );

  const hasArticles = filtered.length > 0;
  const isLoading = loading;

  // Helper to render skeleton cards for the feed (with optional count)
  const renderSkeletonFeed = (count = 4) => (
    <div className="md:grid md:grid-cols-2 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <StoryCardSkeleton key={i} />
      ))}
    </div>
  );

  // Helper to render skeleton sidebar
  const renderSkeletonSidebar = () => (
    <aside className="hidden md:block space-y-6">
      <div className="bg-muted/20 rounded-lg p-4">
        <h3 className="font-bold text-lg mb-4">{t("mostRead")}</h3>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <StoryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <SEO
        title={
          activeCategory === "all"
            ? undefined
            : lang === "en"
            ? categories.find((c) => c.key === activeCategory)?.labelEn
            : categories.find((c) => c.key === activeCategory)?.label
        }
        keywords={
          lang === "en"
            ? "Algeria news, Arab news, world news, politics, sports, economy"
            : "أخبار الجزائر, أخبار عربية, أخبار دولية, سياسة, رياضة, اقتصاد"
        }
      />
      <Header isDark={isDark} onToggleTheme={toggle} />
      <BreakingTicker />
      <CategoryTabs active={activeCategory} onChange={setActive} />

      <main id="main-content" className="flex-1 pb-16 md:pb-0">
        <h1 className="sr-only">
          {lang === "en"
            ? "Apex News DZ — Latest news from Algeria and the world"
            : "أبكس نيوز الجزائر — آخر الأخبار من الجزائر والعالم"}
        </h1>
        <PageTransition>
          {/* Hero Section – show skeleton if loading or no articles */}
          {isLoading ? (
            <HeroSkeleton />
          ) : hasArticles ? (
            <HeroSection featured={featured} sidebar={sidebar} />
          ) : (
            <section className="container py-16">
              <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
                <div className="text-5xl mb-4">📰</div>
                <h2 className="text-2xl font-bold">
                  {isRTL ? "لا توجد مقالات بعد" : "No articles yet"}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {isRTL
                    ? "سيتم نشر أول الأخبار قريبًا، تابعنا لاحقًا."
                    : "We'll publish our first stories soon. Please check back later."}
                </p>
              </div>
            </section>
          )}

          <div className="container">
            <AdBanner variant="leaderboard" />
          </div>

          {/* Weather & Prayer – always visible */}
          <WeatherPrayerWidget />

          <ContinueReading />

          <section className="container pb-8">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Left column – feed */}
              <div className="md:col-span-2">
                <div className="flex items-baseline justify-between mb-2">
                  <h2 className="font-bold text-lg text-foreground">
                    {activeCategory === "all"
                      ? t("latestNews")
                      : (() => {
                          const cat = categories.find(
                            (c) => c.key === activeCategory
                          );
                          return lang === "en" ? cat?.labelEn : cat?.label;
                        })()}
                  </h2>
                  {activeCategory !== "all" && !isLoading && hasArticles && (
                    <Link
                      to={`/topic/${activeCategory}`}
                      className="text-xs text-primary hover:underline"
                    >
                      {t("viewSection")}
                    </Link>
                  )}
                </div>

                {/* Feed content */}
                {isLoading ? (
                  renderSkeletonFeed(4)
                ) : !hasArticles ? (
                  <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
                    <div className="text-4xl mb-3">📰</div>
                    <h3 className="font-semibold text-lg">
                      {isRTL
                        ? "لا توجد أخبار منشورة بعد"
                        : "No published articles yet"}
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {isRTL
                        ? "سيظهر المحتوى هنا بمجرد نشر أول مقال."
                        : "Articles will appear here once the first story is published."}
                    </p>
                  </div>
                ) : feedItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    {t("noMoreArticles")}
                  </p>
                ) : (
                  <div className="md:grid md:grid-cols-2 md:gap-4">
                    {feedItems.map((article, i) => (
                      <FeedItem key={article.id} article={article} index={i} />
                    ))}
                  </div>
                )}
              </div>

              {/* Right column – MostRead (skeleton if loading or empty) */}
              {isLoading ? (
                renderSkeletonSidebar()
              ) : hasArticles ? (
                <aside className="hidden md:block space-y-6">
                  <MostRead />
                </aside>
              ) : (
                <aside className="hidden md:block">
                  <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-muted-foreground">
                    {isRTL
                      ? "لا توجد مقالات لعرض الأكثر قراءة."
                      : "No articles available yet."}
                  </div>
                </aside>
              )}
            </div>

            <NewsletterSignup />
          </section>
        </PageTransition>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
