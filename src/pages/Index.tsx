import { useState } from "react";
import { articles } from "@/lib/data";
import Header from "@/components/Header";
import BreakingTicker from "@/components/BreakingTicker";
import CategoryTabs from "@/components/CategoryTabs";
import HeroSection from "@/components/HeroSection";
import StoryCard from "@/components/StoryCard";
import MostRead from "@/components/MostRead";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { useTheme } from "@/hooks/useTheme";

export default function Index() {
  const { isDark, toggle } = useTheme();
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? articles
    : articles.filter((a) => a.categoryKey === activeCategory);

  const featured = filtered[0] || articles[0];
  const sidebar = (filtered.length > 3 ? filtered : articles).slice(1, 4);
  const feed = (filtered.length > 4 ? filtered : articles).slice(4);

  return (
    <div className="min-h-screen pb-16 md:pb-0 transition-colors duration-300">
      <Header isDark={isDark} onToggleTheme={toggle} />
      <BreakingTicker />
      <CategoryTabs active={activeCategory} onChange={setActiveCategory} />

      <HeroSection featured={featured} sidebar={sidebar} />

      <section className="container pb-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Feed */}
          <div className="md:col-span-2">
            <h2 className="font-bold text-lg text-foreground mb-2">آخر الأخبار</h2>
            <div className="md:grid md:grid-cols-2 md:gap-4">
              {feed.map((article) => (
                <StoryCard key={article.id} article={article} />
              ))}
              {filtered.length > 1 &&
                articles
                  .filter((a) => !filtered.includes(a) && !sidebar.includes(a) && a.id !== featured.id)
                  .slice(0, 4)
                  .map((article) => <StoryCard key={article.id} article={article} />)}
            </div>
            <div className="flex justify-center mt-6">
              <button className="px-6 py-2.5 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-colors text-sm">
                تحميل المزيد
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden md:block space-y-6">
            <MostRead />
          </aside>
        </div>
      </section>

      <Footer />
      <BottomNav />
    </div>
  );
}
