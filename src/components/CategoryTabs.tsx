import { categories } from "@/lib/data";
import { useLanguage } from "@/hooks/useLanguage";

interface CategoryTabsProps {
  active: string;
  onChange: (key: string) => void;
}

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  const { lang } = useLanguage();
  return (
    <div className="md:hidden border-b border-border bg-background">
      <div className="flex overflow-x-auto scrollbar-hide gap-1 px-4 py-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onChange(cat.key)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              active === cat.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {lang === "en" ? cat.labelEn : cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
