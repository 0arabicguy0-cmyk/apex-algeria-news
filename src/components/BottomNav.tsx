import { Home, Search, Bookmark, MessageCircle, Tag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage, type TKey } from "@/hooks/useLanguage";

const tabs: { icon: typeof Home; key: TKey; path: string }[] = [
  { icon: Home, key: "home", path: "/" },
  { icon: Search, key: "search", path: "/search" },
  { icon: Tag, key: "sections", path: "/topic/algeria" },
  { icon: Bookmark, key: "bookmarks", path: "/bookmarks" },
  { icon: MessageCircle, key: "contact", path: "/contact" },
];

export default function BottomNav() {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <nav className="md:hidden fixed bottom-0 right-0 left-0 z-50 bg-background border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const isActive =
            tab.path === "/" ? location.pathname === "/" : location.pathname.startsWith(tab.path.split("?")[0]);
          return (
            <Link
              key={tab.key}
              to={tab.path}
              className={`flex flex-col items-center gap-0.5 text-[11px] transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{t(tab.key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
