import { ShieldCheck, MessageSquareQuote, Hourglass, BarChart3, Drama } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { FactCheckLabel } from "@/lib/mockStore";
import { cn } from "@/lib/utils";

interface Props { label?: FactCheckLabel; className?: string; size?: "sm" | "md"; }

const config: Record<Exclude<FactCheckLabel, "none">, { ar: string; en: string; icon: any; cls: string }> = {
  verified:   { ar: "تم التحقق",  en: "Verified",   icon: ShieldCheck,        cls: "bg-dz-green/15 text-dz-green border-dz-green/30" },
  opinion:    { ar: "رأي",        en: "Opinion",    icon: MessageSquareQuote, cls: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400" },
  developing: { ar: "خبر متطوّر", en: "Developing", icon: Hourglass,          cls: "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400" },
  analysis:   { ar: "تحليل",      en: "Analysis",   icon: BarChart3,          cls: "bg-purple-500/15 text-purple-600 border-purple-500/30 dark:text-purple-400" },
  satire:     { ar: "ساخر",       en: "Satire",     icon: Drama,              cls: "bg-pink-500/15 text-pink-600 border-pink-500/30 dark:text-pink-400" },
};

export default function FactCheckBadge({ label, className, size = "md" }: Props) {
  const { isRTL } = useLanguage();
  if (!label || label === "none") return null;
  const c = config[label];
  const Icon = c.icon;
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full border font-medium",
      size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1",
      c.cls,
      className,
    )}>
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {isRTL ? c.ar : c.en}
    </span>
  );
}
