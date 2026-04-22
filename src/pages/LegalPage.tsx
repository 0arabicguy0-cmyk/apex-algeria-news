import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { ArrowLeft, ArrowRight } from "lucide-react";

export interface LegalSection {
  heading: { ar: string; en: string };
  body: { ar: string; en: string };
}

export interface LegalContent {
  title: { ar: string; en: string };
  intro?: { ar: string; en: string };
  sections: LegalSection[];
}

export default function LegalPage({ content }: { content: LegalContent }) {
  const { isDark, toggle } = useTheme();
  const { lang, isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen pb-16 md:pb-0 bg-background">
      <Header isDark={isDark} onToggleTheme={toggle} />
      <main className="container max-w-3xl py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-6"
        >
          <Arrow className="w-4 h-4" />
          {lang === "ar" ? "العودة للرئيسية" : "Back to home"}
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          {content.title[lang]}
        </h1>
        {content.intro && (
          <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
            {content.intro[lang]}
          </p>
        )}
        <div className="space-y-8">
          {content.sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-xl font-bold mb-3 text-foreground">
                {s.heading[lang]}
              </h2>
              <div className="text-foreground/80 leading-relaxed whitespace-pre-line">
                {s.body[lang]}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
