import { useParams, Link } from "react-router-dom";
import { useArticles } from "@/hooks/useArticles";
import { categories } from "@/lib/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import StoryCard from "@/components/StoryCard";
import MostRead from "@/components/MostRead";
import HeroSection from "@/components/HeroSection";
import { useTheme } from "@/hooks/useTheme";

export default function TopicPage() {
  const { key } = useParams<{ key: string }>();
  const { isDark, toggle } = useTheme();
  const cat = categories.find((c) => c.key === key);
  const { articles, loading } = useArticles({ categoryKey: key });

  const featured = articles[0];
  const sidebar = articles.slice(1, 4);
  const rest = articles.slice(4);

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Header isDark={isDark} onToggleTheme={toggle} />

      <div className="bg-gradient-to-l from-navy via-navy/95 to-primary text-primary-foreground py-8 md:py-12">
        <div className="container">
          <Link to="/" className="text-xs text-primary-foreground/70 hover:text-primary-foreground">← الرئيسية</Link>
          <h1 className="text-3xl md:text-5xl font-bold mt-2">{cat?.label ?? "قسم"}</h1>
          <p className="text-primary-foreground/80 mt-2 text-sm md:text-base">
            {articles.length} مقال في هذا القسم
          </p>
        </div>
      </div>

      {loading ? (
        <div className="container py-16 text-center text-muted-foreground">جارٍ التحميل...</div>
      ) : articles.length === 0 ? (
        <div className="container py-16 text-center text-muted-foreground">لا توجد مقالات في هذا القسم بعد</div>
      ) : (
        <>
          {featured && (
            <div className="container py-6">
              <HeroSection featured={featured} sidebar={sidebar} />
            </div>
          )}

          <section className="container pb-10">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h2 className="font-bold text-lg text-foreground mb-3">المزيد من {cat?.label}</h2>
                <div className="md:grid md:grid-cols-2 md:gap-4">
                  {rest.map((a) => <StoryCard key={a.id} article={a} />)}
                </div>
                {rest.length === 0 && (
                  <p className="text-sm text-muted-foreground py-6 text-center">لا توجد مقالات إضافية</p>
                )}
              </div>
              <aside className="hidden md:block">
                <MostRead />
              </aside>
            </div>
          </section>
        </>
      )}

      <Footer />
      <BottomNav />
    </div>
  );
}
