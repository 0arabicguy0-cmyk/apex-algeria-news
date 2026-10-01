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
            className={`whitespace-nowrap px-4 py-1.5 rounded-sm text-sm font-bold transition-all border-b-2 ${
              active === cat.key
                ? "bg-primary text-primary-foreground border-primary"
                : "text-muted-foreground border-transparent hover:text-primary"
            }`}
          >
            {lang === "en" ? cat.labelEn : cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
