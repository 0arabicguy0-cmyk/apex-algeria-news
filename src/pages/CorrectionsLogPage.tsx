import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";

interface CorrectionRow {
  id: string;
  article_id: string | null;
  article_title: string;
  correction: string;
  original_text: string | null;
  corrected_at: string;
}

export default function CorrectionsLogPage() {
  const { isDark, toggle } = useTheme();
  const { lang, isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowRight : ArrowLeft;
  const [rows, setRows] = useState<CorrectionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("corrections_log")
        .select("id, article_id, article_title, correction, original_text, corrected_at")
        .eq("is_published", true)
        .order("corrected_at", { ascending: false });
      setRows(data ?? []);
      setLoading(false);
    })();
  }, []);

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(lang === "ar" ? "ar-DZ" : "en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isDark={isDark} onToggleTheme={toggle} />
      <main className="flex-1 container max-w-3xl py-8 pb-16 md:pb-0">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-6">
          <Arrow className="w-4 h-4" />
          {lang === "ar" ? "العودة للرئيسية" : "Back to home"}
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
          {lang === "ar" ? "سجل التصحيحات" : "Corrections Log"}
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          {lang === "ar"
            ? "نلتزم بالشفافية. كل تصحيح أُجري على مقالاتنا المنشورة يُسجَّل هنا علناً، طبقاً لميثاقنا التحريري وحق التصحيح."
            : "We are committed to transparency. Every correction made to our published articles is logged here publicly, in accordance with our editorial charter and the right of rectification."}
        </p>

        {loading ? (
          <p className="text-muted-foreground">{lang === "ar" ? "جارٍ التحميل..." : "Loading..."}</p>
        ) : rows.length === 0 ? (
          <div className="rounded-xl border border-border bg-muted/30 p-6 text-center text-muted-foreground">
            {lang === "ar" ? "لا توجد تصحيحات منشورة حتى الآن." : "No published corrections yet."}
          </div>
        ) : (
          <ol className="space-y-4">
            {rows.map((r) => (
              <li key={r.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                      {r.article_id ? (
                        <Link
                          to={`/article/${r.article_id}`}
                          className="font-bold text-foreground hover:text-primary transition-colors"
                        >
                          {r.article_title}
                        </Link>
                      ) : (
                        <span className="font-bold text-foreground">{r.article_title}</span>
                      )}
                      <span className="text-xs text-muted-foreground">{fmt(r.corrected_at)}</span>
                    </div>
                    {r.original_text && (
                      <p className="text-sm text-muted-foreground line-through mb-1">
                        {r.original_text}
                      </p>
                    )}
                    <p className="text-sm text-foreground/90 leading-relaxed">{r.correction}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}