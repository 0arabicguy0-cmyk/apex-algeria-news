import { breakingNews } from "@/lib/data";

export default function BreakingTicker() {
  return (
    <div className="bg-navy text-navy-foreground overflow-hidden">
      <div className="container flex items-center h-9">
        <span className="flex-shrink-0 bg-amber text-amber-foreground px-3 py-0.5 rounded-sm text-xs font-bold flex items-center gap-1.5 ml-4">
          <span className="w-2 h-2 rounded-full bg-destructive animate-pulse-dot" />
          عاجل
        </span>
        <div className="overflow-hidden flex-1">
          <p className="animate-ticker whitespace-nowrap text-sm">{breakingNews}</p>
        </div>
      </div>
    </div>
  );
}
