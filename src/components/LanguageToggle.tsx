import { Languages } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function LanguageToggle() {
  const { lang, toggle, t } = useLanguage();

  return (
    <button
      onClick={toggle}
      aria-label={t("language")}
      title={t("language")}
      className="relative p-2 rounded-full hover:bg-muted transition-all duration-300 text-foreground flex items-center gap-1.5 group"
    >
      <Languages className="w-5 h-5 transition-transform duration-500 group-hover:rotate-[180deg]" />
      <span className="text-xs font-bold tabular-nums tracking-wide hidden sm:inline">
        {lang === "ar" ? "EN" : "ع"}
      </span>
    </button>
  );
}
