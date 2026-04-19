import { useLanguage } from "@/hooks/useLanguage";
import { useSubscription } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";

type Variant = "leaderboard" | "inline" | "square" | "skyscraper";

interface Props {
  variant?: Variant;
  label?: string;
  className?: string;
}

const sizes: Record<Variant, string> = {
  leaderboard: "h-24 md:h-28",
  inline:      "h-32 md:h-40",
  square:      "h-64",
  skyscraper:  "h-[600px]",
};

export default function AdBanner({ variant = "leaderboard", label, className }: Props) {
  const { isRTL } = useLanguage();
  const { active } = useSubscription();
  if (active) return null; // Ad-free for premium subscribers

  const adLabel = label ?? (isRTL ? "إعلان" : "Advertisement");

  return (
    <aside
      role="complementary"
      aria-label={adLabel}
      className={cn(
        "relative w-full rounded-lg border border-dashed border-border bg-gradient-to-br from-muted/40 to-muted/10 flex items-center justify-center overflow-hidden my-4",
        sizes[variant],
        className,
      )}
    >
      <span className="absolute top-1.5 start-2 text-[10px] uppercase tracking-wider text-muted-foreground/70 bg-background/60 px-1.5 py-0.5 rounded">
        {adLabel}
      </span>
      <div className="text-center px-4">
        <div className="text-sm font-bold text-foreground/80">
          {isRTL ? "مساحتك الإعلانية هنا" : "Your ad could be here"}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {isRTL ? "تواصل معنا للإعلان على Apex News" : "Contact us to advertise on Apex News"}
        </div>
      </div>
    </aside>
  );
}
