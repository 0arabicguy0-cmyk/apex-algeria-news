import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useArticle, useRelated, trackView } from "@/hooks/useArticles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ReadingProgress from "@/components/ReadingProgress";
import TableOfContents from "@/components/TableOfContents";
import Reactions from "@/components/Reactions";
import Comments from "@/components/Comments";
import BookmarkButton from "@/components/BookmarkButton";
import AudioPlayer from "@/components/AudioPlayer";
import TranslateButton from "@/components/TranslateButton";
import ShareMenu from "@/components/ShareMenu";
import PageTransition from "@/components/PageTransition";
import { ArticleSkeleton } from "@/components/Skeletons";
import { useTheme } from "@/hooks/useTheme";
import { ArrowUp, Eye } from "lucide-react";

export default function ArticlePage() {
  const { id } = useParams();
  const { isDark, toggle } = useTheme();
  const { article, loading } = useArticle(id);
  const related = useRelated(article);

  useEffect(() => {
    if (article) trackView(article.id);
  }, [article?.id]);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header isDark={isDark} onToggleTheme={toggle} />
        <ArticleSkeleton />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-foreground">المقال غير موجود</p>
        <Link to="/" className="text-primary hover:underline">العودة للرئيسية</Link>
      </div>
    );
  }


  const paragraphs = article.body.split("\n\n");
  const renderParagraph = (p: string, i: number) => {
    const trimmed = p.trim();
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={i} id={`h-${i}`} className="text-xl md:text-2xl font-bold text-foreground mt-8 mb-4 scroll-mt-20">
          {trimmed.replace(/^##\s+/, "")}
        </h2>
      );
    }
    return (
      <p key={i} className={i === 0 ? "first-letter:text-4xl first-letter:font-bold first-letter:text-primary first-letter:float-right first-letter:ml-2 first-letter:mt-1" : ""}>
        {p}
      </p>
    );
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 transition-colors duration-300">
      <ReadingProgress />
      <Header isDark={isDark} onToggleTheme={toggle} />

      <div className="w-full h-56 md:h-96 overflow-hidden">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
      </div>

      <article className="container max-w-3xl py-6">
        <Link to={`/topic/${article.categoryKey}`} className="bg-dz-green text-accent-foreground px-3 py-1 rounded-sm text-xs font-bold hover:opacity-90">
          {article.category}
        </Link>

        <h1 className="text-2xl md:text-4xl font-bold text-foreground mt-4 mb-4 leading-snug">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">
              {article.author[0]}
            </div>
            <div>
              <span className="font-medium text-foreground">{article.author}</span>
              <div className="text-xs flex items-center gap-2">
                <span>{article.date}</span>
                <span>·</span>
                <span>{article.readTime} قراءة</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {article.viewCount}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AudioPlayer text={`${article.title}. ${article.body}`} />
            <TranslateButton title={article.title} body={article.body} />
            <ShareMenu title={article.title} />
            <BookmarkButton articleId={article.id} />
          </div>
        </div>

        <div className="mb-8 pb-4 border-b border-border" />

        <TableOfContents body={article.body} />

        <div className="prose-article text-foreground text-lg leading-[1.8] space-y-6">
          {paragraphs.map(renderParagraph)}
        </div>

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-4 border-t border-border">
            {article.tags.map((t) => (
              <Link key={t} to={`/search?tag=${encodeURIComponent(t)}`} className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs hover:bg-primary/10 hover:text-primary transition-colors">
                #{t}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Reactions articleId={article.id} />
        </div>

        {related.length > 0 && (
          <div className="mt-10">
            <h3 className="font-bold text-lg text-foreground mb-4">مقالات ذات صلة</h3>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {related.map((r) => (
                <Link key={r.id} to={`/article/${r.id}`} className="flex-shrink-0 w-56 group">
                  <div className="rounded-lg overflow-hidden mb-2">
                    <img src={r.image} alt={r.title} loading="lazy" className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <span className="text-[11px] font-bold text-dz-green">{r.category}</span>
                  <h4 className="text-sm font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">{r.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Comments articleId={article.id} />
      </article>

      <div className="md:hidden fixed bottom-14 right-0 left-0 bg-background/95 backdrop-blur-md border-t border-border flex items-center justify-around h-12 z-40">
        <ShareMenu title={article.title} />
        <BookmarkButton articleId={article.id} />
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-muted-foreground" aria-label="أعلى الصفحة">
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
}
