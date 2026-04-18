import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { categories } from "@/lib/data";

export default function Footer() {
  const { t, lang } = useLanguage();
  return (
    <footer className="hidden md:block bg-navy text-navy-foreground mt-12">
      <div className="container py-10">
        <div className="grid md:grid-cols-3 gap-8">
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
            <h4 className="font-bold mb-4">{t("followUs")}</h4>
            <div className="flex gap-4 text-sm opacity-70">
              <a href="#" className="hover:opacity-100 transition-opacity">{t("facebook")}</a>
              <a href="#" className="hover:opacity-100 transition-opacity">{t("twitter")}</a>
              <a href="#" className="hover:opacity-100 transition-opacity">{t("youtube")}</a>
              <a href="#" className="hover:opacity-100 transition-opacity">{t("instagram")}</a>
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
