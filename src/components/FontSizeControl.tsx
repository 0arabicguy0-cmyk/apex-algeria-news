import { useEffect, useState } from "react";
import { Minus, Plus, Type } from "lucide-react";

const KEY = "apex-font-size";
const SIZES = [16, 18, 20, 22] as const;

export default function FontSizeControl({ targetSelector = ".prose-article" }: { targetSelector?: string }) {
  const [idx, setIdx] = useState<number>(() => {
    const stored = Number(localStorage.getItem(KEY));
    const i = SIZES.indexOf(stored as any);
    return i >= 0 ? i : 1;
  });

  useEffect(() => {
    const el = document.querySelector(targetSelector) as HTMLElement | null;
    if (el) el.style.fontSize = `${SIZES[idx]}px`;
    localStorage.setItem(KEY, String(SIZES[idx]));
  }, [idx, targetSelector]);

  return (
    <div className="inline-flex items-center gap-1 bg-muted rounded-full px-1 py-1">
      <button
        onClick={() => setIdx((i) => Math.max(0, i - 1))}
        disabled={idx === 0}
        aria-label="تصغير الخط"
        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-background transition-colors disabled:opacity-40 text-foreground"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <Type className="w-3.5 h-3.5 text-muted-foreground" />
      <button
        onClick={() => setIdx((i) => Math.min(SIZES.length - 1, i + 1))}
        disabled={idx === SIZES.length - 1}
        aria-label="تكبير الخط"
        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-background transition-colors disabled:opacity-40 text-foreground"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
