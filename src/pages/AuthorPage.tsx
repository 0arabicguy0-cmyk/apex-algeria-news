import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import StoryCard from "@/components/StoryCard";
import AdBanner from "@/components/AdBanner";
import SEO from "@/components/SEO";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { authorsApi } from "@/lib/mockStore";
import { useArticlesByAuthor } from "@/hooks/useArticles";
import { Mail, Twitter, Eye } from "lucide-react";

export default function AuthorPage() {
  const { slug } = useParams();
  const { isDark, toggle } = useTheme();
  const { isRTL, lang } = useLanguage();
  const author = slug ? authorsApi.bySlug(slug) : null;
  const articles = useArticlesByAuthor(author?.name);

  if (!author) {
    return (
      <div className="min-h-screen">
        <Header isDark={isDark} onToggleTheme={toggle} />
        <div className="container max-w-3xl py-20 text-center">
          <p className="text-foreground">{isRTL ? "الكاتب غير موجود" : "Author not found"}</p>
          <Link to="/" className="text-primary hover:underline mt-2 inline-block">
            {isRTL ? "العودة للرئيسية" : "Back to home"}
          </Link>
        </div>
        <Footer />
        <BottomNav />
      </div>
    );
  }

  const totalViews = articles.reduce((s, a) => s + a.viewCount, 0);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <SEO
        title={author.name}
        description={author.bio
          ? author.bio.slice(0, 155)
          : (lang === "en"
            ? `Articles by ${author.name} on Apex News DZ — latest reporting and analysis.`
            : `مقالات ${author.name} على أبكس نيوز الجزائر — أحدث التقارير والتحليلات.`)}
      />
      <Header isDark={isDark} onToggleTheme={toggle} />

      <div className="bg-gradient-to-br from-primary/10 via-background to-background border-b border-border">
        <div className="container max-w-4xl py-10 flex items-center gap-5 flex-wrap">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl md:text-4xl flex-shrink-0">
            {author.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{author.name}</h1>
            {author.bio && <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl leading-relaxed">{author.bio}</p>}
            <div className="flex items-center gap-4 mt-3 text-xs md:text-sm text-muted-foreground flex-wrap">
              <span>{articles.length} {isRTL ? "مقال منشور" : "published articles"}</span>
              <span className="inline-flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {totalViews.toLocaleString()} {isRTL ? "مشاهدة" : "views"}</span>
              {author.twitter && (
                <a href={`https://twitter.com/${author.twitter.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-primary">
                  <Twitter className="w-3.5 h-3.5" /> {author.twitter}
                </a>
              )}
              {author.email && (
                <a href={`mailto:${author.email}`} className="inline-flex items-center gap-1 hover:text-primary">
                  <Mail className="w-3.5 h-3.5" /> {author.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="container max-w-4xl py-8">
        <h2 className="text-lg font-bold text-foreground mb-4">{isRTL ? "أحدث المقالات" : "Latest articles"}</h2>
        {articles.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">{isRTL ? "لا توجد مقالات بعد" : "No articles yet"}</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {articles.map((a) => <StoryCard key={a.id} article={a} />)}
          </div>
        )}

        <AdBanner variant="leaderboard" className="mt-8" />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
