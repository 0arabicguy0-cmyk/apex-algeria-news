import { Link } from "react-router-dom";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useArticlesByIds } from "@/hooks/useArticles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import StoryCard from "@/components/StoryCard";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { Bookmark } from "lucide-react";

export default function BookmarksPage() {
  const { isDark, toggle } = useTheme();
  const { t } = useLanguage();
  const { ids } = useBookmarks();
  const items = useArticlesByIds(ids);

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Header isDark={isDark} onToggleTheme={toggle} />

      <section className="container py-6 md:py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-primary fill-primary" />
          {t("bookmarksTitle")}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">{items.length} {t("bookmarksCount")}</p>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <Bookmark className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-foreground font-medium mb-1">{t("noBookmarks")}</p>
            <p className="text-sm text-muted-foreground mb-4">{t("bookmarksHint")}</p>
            <Link to="/" className="inline-block px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">{t("browseNews")}</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((a) => <StoryCard key={a.id} article={a} />)}
          </div>
        )}
      </section>

      <Footer />
      <BottomNav />
    </div>
  );
}
