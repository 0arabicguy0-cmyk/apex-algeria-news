import { Menu, Moon, Sun, Search, X } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categories } from "@/lib/data";
import LanguageToggle from "@/components/LanguageToggle";
import NotificationsBell from "@/components/NotificationsBell";
import { useLanguage } from "@/hooks/useLanguage";

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Header({ isDark, onToggleTheme }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const tapsRef = useRef<number[]>([]);
  const timeoutRef = useRef<number | undefined>();

  const handleLogoTap = () => {
    const now = Date.now();
    // Keep only taps within the last 3 seconds
    tapsRef.current = [...tapsRef.current.filter((t) => now - t < 3000), now];

    // Clear any pending navigation
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Wait a short moment to allow multiple taps to accumulate
    timeoutRef.current = window.setTimeout(() => {
      const recent = tapsRef.current.filter((t) => Date.now() - t < 3000);
      if (recent.length >= 5) {
        // Five taps → admin login
        tapsRef.current = [];
        navigate("/admin/login");
      } else {
        // Single (or few) taps → home page
        navigate("/");
      }
      timeoutRef.current = undefined;
    }, 250);
  };

  return (
    <>
      {/* Top navy bar — desktop only */}
      <div className="hidden md:block bg-navy text-navy-foreground">
        <div className="container flex items-center justify-between py-1.5 text-sm opacity-80">
          <span>{t("dateLine")}</span>
          <div className="flex gap-4">
            <a href="#" aria-label={`Apex News DZ on ${t("facebook")}`} className="hover:text-primary transition-colors">{t("facebook")}</a>
            <a href="#" aria-label={`Apex News DZ on ${t("twitter")}`} className="hover:text-primary transition-colors">{t("twitter")}</a>
            <a href="#" aria-label={`Apex News DZ on ${t("youtube")}`} className="hover:text-primary transition-colors">{t("youtube")}</a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container flex items-center justify-between h-14 md:h-16">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2 -mr-2 text-foreground"
            aria-label="القائمة"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <button
            type="button"
            onClick={handleLogoTap}
            aria-label="Apex News DZ — الصفحة الرئيسية"
            className="flex items-center gap-2 select-none bg-transparent border-0 p-0"
          >
            <span className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-primary-foreground font-bold text-lg leading-none" aria-hidden="true">A</span>
            <span className="flex flex-col leading-tight text-start">
              <span className="font-bold text-lg text-foreground tracking-tight">Apex News</span>
              <span className="text-[10px] text-muted-foreground -mt-1">الجزائر</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                to={cat.key === "all" ? "/" : `/topic/${cat.key}`}
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors relative group"
              >
                {cat.label}
                <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-right" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="relative flex items-center gap-1 md:gap-2">
            <NotificationsBell />
            <LanguageToggle />
            <Link
              to="/search"
              className="p-2 rounded-full hover:bg-muted transition-colors text-foreground"
              aria-label={t("search")}
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={onToggleTheme}
              className="relative p-2 rounded-full hover:bg-muted transition-colors text-foreground overflow-hidden"
              aria-label={t("toggleTheme")}
            >
              <Sun
                className={`w-5 h-5 transition-all duration-500 ${
                  isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0 absolute inset-0 m-auto"
                }`}
              />
              <Moon
                className={`w-5 h-5 transition-all duration-500 ${
                  isDark ? "rotate-90 scale-0 opacity-0 absolute inset-0 m-auto" : "rotate-0 scale-100 opacity-100"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-72 bg-background shadow-xl p-6 animate-in slide-in-from-right">
            <div className="flex items-center justify-between mb-8">
              <span className="font-bold text-lg text-foreground">القائمة</span>
              <button onClick={() => setMenuOpen(false)} className="text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {categories.map((cat) => (
                <Link
                  key={cat.key}
                  to={cat.key === "all" ? "/" : `/topic/${cat.key}`}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-foreground hover:bg-muted font-medium transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-6 right-6 left-6">
              <Link
                to="/admin/login"
                onClick={() => setMenuOpen(false)}
                className="block text-center text-[11px] text-muted-foreground/60 hover:text-primary transition-colors py-2"
              >
                ·
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}