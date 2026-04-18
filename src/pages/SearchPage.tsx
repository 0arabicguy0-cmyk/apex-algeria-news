import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { articlesApi } from "@/lib/mockStore";
import { mapArticle, type Article } from "@/hooks/useArticles";
import { categories } from "@/lib/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import StoryCard from "@/components/StoryCard";
import { useTheme } from "@/hooks/useTheme";
import { Search as SearchIcon, X } from "lucide-react";

type SortKey = "newest" | "oldest" | "popular";

export default function SearchPage() {
  const { isDark, toggle } = useTheme();
  const [params, setParams] = useSearchParams();

  const [q, setQ] = useState(params.get("q") || "");
  const [cat, setCat] = useState(params.get("cat") || "all");
  const [tag, setTag] = useState(params.get("tag") || "");
  const [sort, setSort] = useState<SortKey>("newest");
  const [results, setResults] = useState<Article[]>([]);

  useEffect(() => {
    const data = articlesApi.search({ q, cat, tag, sort });
    setResults(data.map(mapArticle));
  }, [q, cat, tag, sort]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams();
    if (q.trim()) next.set("q", q.trim());
    if (cat !== "all") next.set("cat", cat);
    if (tag) next.set("tag", tag);
    setParams(next);
  };

  const clear = () => { setQ(""); setCat("all"); setTag(""); setSort("newest"); setParams({}); };

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Header isDark={isDark} onToggleTheme={toggle} />

      <section className="container py-6 md:py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-2">
          <SearchIcon className="w-6 h-6 text-primary" />
          البحث في الأخبار
        </h1>

        <form onSubmit={onSubmit} className="bg-card border border-border rounded-2xl p-4 md:p-5 space-y-3">
          <div className="relative">
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن خبر، موضوع، شخصية..."
              className="w-full pr-10 pl-4 py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary text-foreground"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground">
              {categories.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground">
              <option value="newest">الأحدث</option>
              <option value="oldest">الأقدم</option>
              <option value="popular">الأكثر قراءة</option>
            </select>
            {tag && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                #{tag}
                <button type="button" onClick={() => setTag("")}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button type="submit" className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">بحث</button>
            {(q || cat !== "all" || tag) && (
              <button type="button" onClick={clear} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">إعادة تعيين</button>
            )}
          </div>
        </form>

        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-4">{results.length} نتيجة</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((a) => <StoryCard key={a.id} article={a} />)}
          </div>
          {results.length === 0 && <div className="text-center py-16 text-muted-foreground">لا توجد نتائج مطابقة</div>}
        </div>
      </section>

      <Footer />
      <BottomNav />
    </div>
  );
}
