import { useParams, Link } from "react-router-dom";
import { articles } from "@/lib/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { useTheme } from "@/hooks/useTheme";
import { ArrowRight, Share2, Bookmark, ArrowUp, MessageCircle } from "lucide-react";

export default function ArticlePage() {
  const { id } = useParams();
  const { isDark, toggle } = useTheme();
  const article = articles.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-foreground">المقال غير موجود</p>
      </div>
    );
  }

  const related = articles.filter((a) => a.id !== id).slice(0, 4);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = article.title;
    const links: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    };
    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      return;
    }
    window.open(links[platform], "_blank");
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 transition-colors duration-300">
      <Header isDark={isDark} onToggleTheme={toggle} />

      {/* Hero image */}
      <div className="w-full h-56 md:h-96 overflow-hidden">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
      </div>

      <article className="container max-w-3xl py-6">
        <span className="bg-dz-green text-accent-foreground px-3 py-1 rounded-sm text-xs font-bold">
          {article.category}
        </span>

        <h1 className="text-2xl md:text-4xl font-bold text-foreground mt-4 mb-4 leading-snug">
          {article.title}
        </h1>

        {/* Author info */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
          <div className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">
            {article.author[0]}
          </div>
          <div>
            <span className="font-medium text-foreground">{article.author}</span>
            <div className="text-xs">{article.date} · {article.readTime} قراءة</div>
          </div>
        </div>

        {/* Share row */}
        <div className="flex items-center gap-2 mb-8 pb-4 border-b border-border">
          <button onClick={() => handleShare("whatsapp")} className="px-3 py-1.5 bg-[#25D366] text-primary-foreground rounded-md text-xs font-medium">واتساب</button>
          <button onClick={() => handleShare("facebook")} className="px-3 py-1.5 bg-[#1877F2] text-primary-foreground rounded-md text-xs font-medium">فيسبوك</button>
          <button onClick={() => handleShare("twitter")} className="px-3 py-1.5 bg-foreground text-background rounded-md text-xs font-medium">𝕏</button>
          <button onClick={() => handleShare("copy")} className="px-3 py-1.5 bg-muted text-muted-foreground rounded-md text-xs font-medium">نسخ الرابط</button>
        </div>

        {/* Body */}
        <div className="prose-article text-foreground text-lg leading-[1.8] space-y-6">
          {article.body.split("\n\n").map((p, i) => (
            <p key={i} className={i === 0 ? "first-letter:text-4xl first-letter:font-bold first-letter:text-primary first-letter:float-right first-letter:ml-2 first-letter:mt-1" : ""}>
              {p}
            </p>
          ))}

          {/* Pull quote */}
          <blockquote className="border-r-4 border-primary pr-4 py-2 text-xl font-medium text-primary/90 my-8 italic">
            "الجزائر تمتلك واحداً من أعلى معدلات الإشعاع الشمسي في العالم"
          </blockquote>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-8 pt-4 border-t border-border">
          <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs">#الجزائر</span>
          <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs">#طاقة</span>
          <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs">#اقتصاد</span>
        </div>

        {/* Feedback */}
        <div className="mt-8 p-4 bg-card rounded-xl border border-border text-center">
          <p className="text-foreground font-medium mb-3">هل وجدت هذا المقال مفيداً؟</p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">👍 نعم</button>
            <button className="px-6 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-border transition-colors">👎 لا</button>
          </div>
        </div>

        {/* Related */}
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
      </article>

      {/* Fixed bottom bar — mobile */}
      <div className="md:hidden fixed bottom-14 right-0 left-0 bg-background/95 backdrop-blur-md border-t border-border flex items-center justify-around h-12 z-40">
        <button onClick={() => handleShare("whatsapp")} className="text-muted-foreground">
          <Share2 className="w-5 h-5" />
        </button>
        <button className="text-muted-foreground">
          <Bookmark className="w-5 h-5" />
        </button>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-muted-foreground">
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
}
