import { useParams, Link } from "react-router-dom";
import { useArticles } from "@/hooks/useArticles";
import { categories } from "@/lib/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import StoryCard from "@/components/StoryCard";
import MostRead from "@/components/MostRead";
import HeroSection from "@/components/HeroSection";
import SEO from "@/components/SEO";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

export default function TopicPage() {
  const { key } = useParams<{ key: string }>();
  const { isDark, toggle } = useTheme();
  const { t, lang } = useLanguage();
  const cat = categories.find((c) => c.key === key);
  const catLabel = lang === "en" ? cat?.labelEn : cat?.label;
  const { articles, loading } = useArticles({ categoryKey: key });

  const featured = articles[0];
  const sidebar = articles.slice(1, 4);
  const rest = articles.slice(4);

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <SEO
        title={catLabel ?? (lang === "en" ? "Section" : "قسم")}
        description={lang === "en"
          ? `Latest ${catLabel ?? "news"} stories from Algeria and around the world on Apex News DZ.`
          : `أحدث أخبار ${catLabel ?? ""} من الجزائر والعالم على أبكس نيوز الجزائر.`}
      />
      <Header isDark={isDark} onToggleTheme={toggle} />

      <div className="bg-gradient-to-l from-navy via-navy/95 to-primary text-primary-foreground py-8 md:py-12">
        <div className="container">
          <Link to="/" className="text-xs text-primary-foreground/70 hover:text-primary-foreground">{t("backHome")}</Link>
          <h1 className="text-3xl md:text-5xl font-bold mt-2">{catLabel ?? (lang === "en" ? "Section" : "قسم")}</h1>
          <p className="text-primary-foreground/80 mt-2 text-sm md:text-base">
            {articles.length} {t("topicCount")}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="container py-16 text-center text-muted-foreground">{t("loading")}</div>
      ) : articles.length === 0 ? (
        <div className="container py-16 text-center text-muted-foreground">{t("noArticlesTopic")}</div>
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
                <h2 className="font-bold text-lg text-foreground mb-3">{t("moreFrom")} {catLabel}</h2>
                <div className="md:grid md:grid-cols-2 md:gap-4">
                  {rest.map((a) => <StoryCard key={a.id} article={a} />)}
                </div>
                {rest.length === 0 && (
                  <p className="text-sm text-muted-foreground py-6 text-center">{t("noMoreArticles")}</p>
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
