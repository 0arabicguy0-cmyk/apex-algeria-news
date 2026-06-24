import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchArticles } from "@/hooks/useArticles";
import { categories } from "@/lib/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import StoryCard from "@/components/StoryCard";
import SEO from "@/components/SEO";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { Search as SearchIcon, X } from "lucide-react";

type SortKey = "newest" | "oldest" | "popular";

export default function SearchPage() {
  const { isDark, toggle } = useTheme();
  const { t, lang } = useLanguage();
  const [params, setParams] = useSearchParams();

  const [q, setQ] = useState(params.get("q") || "");
  const [cat, setCat] = useState(params.get("cat") || "all");
  const [tag, setTag] = useState(params.get("tag") || "");
  const [sort, setSort] = useState<SortKey>("newest");

  const { results } = useSearchArticles({ q, cat, tag, sort });

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
    <div className="flex flex-col min-h-screen">
      <SEO
        title={lang === "en" ? "Search" : "بحث"}
        description={lang === "en"
          ? "Search Apex News DZ for the latest Algerian, Arab and international news, by keyword, category or tag."
          : "ابحث في أبكس نيوز الجزائر عن آخر الأخبار الجزائرية والعربية والدولية حسب الكلمة أو القسم أو الوسم."}
      />
      <Header isDark={isDark} onToggleTheme={toggle} />

      <main id="main-content" className="flex-1 container py-6 md:py-10 pb-16 md:pb-0">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-2">
          <SearchIcon className="w-6 h-6 text-primary" />
          {t("searchTitle")}
        </h1>

        <form onSubmit={onSubmit} className="bg-card border border-border rounded-2xl p-4 md:p-5 space-y-3">
          <div className="relative">
            <SearchIcon className={`absolute ${lang === "ar" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchPlaceholder")}
              className={`w-full ${lang === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary text-foreground`}
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label={lang === "en" ? "Category" : "القسم"} className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground">
              {categories.map((c) => <option key={c.key} value={c.key}>{lang === "en" ? c.labelEn : c.label}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label={lang === "en" ? "Sort" : "الترتيب"} className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground">
              <option value="newest">{t("sortNewest")}</option>
              <option value="oldest">{t("sortOldest")}</option>
              <option value="popular">{t("sortPopular")}</option>
            </select>
            {tag && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                #{tag}
                <button type="button" onClick={() => setTag("")} aria-label={lang === "en" ? "Remove tag" : "إزالة الوسم"}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button type="submit" className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">{t("searchBtn")}</button>
            {(q || cat !== "all" || tag) && (
              <button type="button" onClick={clear} className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">{t("reset")}</button>
            )}
          </div>
        </form>

        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-4">{results.length} {t("resultsCount")}</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((a) => <StoryCard key={a.id} article={a} />)}
          </div>
          {results.length === 0 && <div className="text-center py-16 text-muted-foreground">{t("noResults")}</div>}
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}