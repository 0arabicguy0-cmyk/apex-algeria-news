import { Home, Flame, Search, Bookmark, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  { icon: Home, label: "الرئيسية", path: "/" },
  { icon: Flame, label: "عاجل", path: "/?breaking=1" },
  { icon: Search, label: "بحث", path: "/?search=1" },
  { icon: Bookmark, label: "محفوظ", path: "/?saved=1" },
  { icon: MessageCircle, label: "تواصل", path: "/contact" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 right-0 left-0 z-50 bg-background border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path || (tab.path === "/" && location.pathname === "/");
          return (
            <Link
              key={tab.label}
              to={tab.path}
              className={`flex flex-col items-center gap-0.5 text-[11px] transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
