import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { categories } from "@/lib/data";

export default function Footer() {
  const { t, lang } = useLanguage();

  const legalLinks = [
    { to: "/about", ar: "من نحن", en: "About us" },
    { to: "/imprint", ar: "البيانات القانونية", en: "Legal notice" },
    { to: "/editorial-policy", ar: "الميثاق التحريري", en: "Editorial charter" },
    { to: "/corrections", ar: "التصحيحات وحق الرد", en: "Corrections & reply" },
    { to: "/corrections-log", ar: "سجل التصحيحات", en: "Corrections log" },
    { to: "/privacy", ar: "سياسة الخصوصية", en: "Privacy policy" },
    { to: "/cookies", ar: "ملفات تعريف الارتباط", en: "Cookies" },
    { to: "/terms", ar: "شروط الاستخدام", en: "Terms of use" },
    { to: "/copyright", ar: "سياسة حقوق النشر", en: "Copyright policy" },
    { to: "/disclaimer", ar: "إخلاء مسؤولية المحتوى", en: "Content disclaimer" },
    { to: "/contact", ar: "اتصل بنا", en: "Contact" },
  ];

  return (
    <footer className="hidden md:block bg-navy text-navy-foreground mt-12">
      <div className="container py-10">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg leading-none">A</span>
              </div>
              <span className="font-bold text-lg">Apex News DZ</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">{t("siteDescription")}</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t("siteSections")}</h4>
            <div className="grid grid-cols-2 gap-2 text-sm opacity-70">
              {categories.map((c) => (
                <Link
                  key={c.key}
                  to={c.key === "all" ? "/" : `/?cat=${c.key}`}
                  className="hover:opacity-100 transition-opacity"
                >
                  {lang === "en" ? c.labelEn : c.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">{lang === "ar" ? "معلومات قانونية" : "Legal & Editorial"}</h4>
            <ul className="space-y-2 text-sm opacity-70">
              {legalLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:opacity-100 transition-opacity">
                    {lang === "ar" ? l.ar : l.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">{t("followUs")}</h4>
            <div className="flex flex-wrap gap-4 text-sm opacity-70">
              <a href="#" aria-label={`Apex News DZ on ${t("facebook")}`} className="hover:opacity-100 transition-opacity">{t("facebook")}</a>
              <a href="#" aria-label={`Apex News DZ on ${t("twitter")}`} className="hover:opacity-100 transition-opacity">{t("twitter")}</a>
              <a href="#" aria-label={`Apex News DZ on ${t("youtube")}`} className="hover:opacity-100 transition-opacity">{t("youtube")}</a>
              <a href="#" aria-label={`Apex News DZ on ${t("instagram")}`} className="hover:opacity-100 transition-opacity">{t("instagram")}</a>
            </div>
          </div>
        </div>
        <div className="border-t border-navy-foreground/20 mt-8 pt-6 text-center text-sm opacity-50">
          {t("rights")}
        </div>
      </div>
    </footer>
  );
}
