import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type Variant = "leaderboard" | "inline" | "square" | "skyscraper";

interface Props {
  variant?: Variant;
  label?: string;
  className?: string;
}

const sizes: Record<Variant, string> = {
  leaderboard: "h-24 md:h-28",
  inline: "h-32 md:h-40",
  square: "h-64",
  skyscraper: "h-[600px]",
};

type Ad = {
  id: string;
  product_title: string;
  product_description: string;
  product_image_url: string;
  product_url: string | null;
  advertiser_name: string;
};

// Module-level cache so every <AdBanner /> shares the same rotating pool.
let cachedAds: Ad[] | null = null;
let cachePromise: Promise<Ad[]> | null = null;
let globalRotationIndex = 0;

async function loadAds(): Promise<Ad[]> {
  if (cachedAds) return cachedAds;
  if (cachePromise) return cachePromise;
  cachePromise = (async () => {
    const { data, error } = await supabase
      .from("ad_submissions")
      .select("id, product_title, product_description, product_image_url, product_url, advertiser_name")
      .eq("status", "approved")
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .order("approved_at", { ascending: false })
      .limit(40);
    if (error) {
      console.warn("[AdBanner] failed to load ads", error);
      cachedAds = [];
      return [];
    }
    cachedAds = (data ?? []) as Ad[];
    return cachedAds;
  })();
  return cachePromise;
}

export default function AdBanner({ variant = "leaderboard", label, className }: Props) {
  const { isRTL } = useLanguage();
  const { active } = useSubscription();
  const [ads, setAds] = useState<Ad[]>([]);
  const [index, setIndex] = useState(() => globalRotationIndex);

  useEffect(() => {
    let mounted = true;
    loadAds().then((a) => {
      if (mounted) setAds(a);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Rotate every 6s — staggered per mount so multiple banners don't all flip at once
  useEffect(() => {
    if (ads.length <= 1) return;
    const id = window.setInterval(() => {
      globalRotationIndex = (globalRotationIndex + 1) % ads.length;
      setIndex(globalRotationIndex);
    }, 6000);
    return () => clearInterval(id);
  }, [ads.length]);

  if (active) return null; // Ad-free for premium subscribers

  const adLabel = label ?? (isRTL ? "إعلان" : "Advertisement");

  // No approved ads → show "your ad here" placeholder linking to the submission page.
  if (ads.length === 0) {
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
        <Link to="/advertise" className="text-center px-4 hover:opacity-90 transition-opacity">
          <div className="text-sm font-bold text-foreground/80">
            {isRTL ? "مساحتك الإعلانية هنا" : "Your ad could be here"}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {isRTL ? "اضغط للإعلان على Apex News" : "Click to advertise on Apex News"}
          </div>
        </Link>
      </aside>
    );
  }

  const ad = ads[index % ads.length];
  const inner = (
    <>
      <span className="absolute top-1.5 start-2 z-10 text-[10px] uppercase tracking-wider text-white/90 bg-black/50 px-1.5 py-0.5 rounded">
        {adLabel}
      </span>
      <img
        src={ad.product_image_url}
        alt={ad.product_title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white">
        <div className="text-sm md:text-base font-bold line-clamp-1">{ad.product_title}</div>
        {ad.product_description && variant !== "leaderboard" && (
          <div className="text-xs opacity-90 line-clamp-2 mt-0.5">{ad.product_description}</div>
        )}
        <div className="text-[10px] opacity-70 mt-1">
          {isRTL ? "بواسطة" : "by"} {ad.advertiser_name}
        </div>
      </div>
    </>
  );

  const baseClass = cn(
    "relative w-full rounded-lg border border-border overflow-hidden my-4 group transition-transform hover:scale-[1.005]",
    sizes[variant],
    className,
  );

  if (ad.product_url) {
    return (
      <a
        key={ad.id}
        href={ad.product_url}
        target="_blank"
        rel="noopener sponsored nofollow"
        aria-label={`${adLabel}: ${ad.product_title}`}
        className={baseClass}
      >
        {inner}
      </a>
    );
  }

  return (
    <aside key={ad.id} role="complementary" aria-label={adLabel} className={baseClass}>
      {inner}
    </aside>
  );
}
