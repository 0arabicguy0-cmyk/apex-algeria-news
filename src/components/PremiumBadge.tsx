import { Crown } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export default function PremiumBadge({ className, size = "md" }: { className?: string; size?: "sm" | "md" }) {
  const { isRTL } = useLanguage();
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-sm bg-amber-500/95 text-white font-bold",
      size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5",
      className,
    )}>
      <Crown className={size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} />
      {isRTL ? "بريميوم" : "Premium"}
    </span>
  );
}
