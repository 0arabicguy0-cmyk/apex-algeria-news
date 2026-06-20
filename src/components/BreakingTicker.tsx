import { useBreakingNews } from "@/hooks/useBreakingNews";
import { Link } from "react-router-dom";

export default function BreakingTicker() {
  const items = useBreakingNews();
  if (items.length === 0) return null;

  // Duplicate the list so the marquee can loop seamlessly.
  const loop = [...items, ...items];

  // Speed: ~60px per second feels natural for news tickers.
  // We can't measure width here, so we pick a duration that scales with item count.
  const duration = Math.max(20, items.length * 12);

  return (
    <div className="bg-navy text-navy-foreground overflow-hidden sticky top-14 z-50">
      <style>{`
        @keyframes apex-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .apex-ticker-track {
          animation: apex-ticker linear infinite;
          will-change: transform;
        }
        .apex-ticker-wrapper:hover .apex-ticker-track {
          animation-play-state: paused;
        }
        /* In RTL pages translateX is visually mirrored, which makes the
           text enter from the left and exit on the right — matching how
           Arabic news channels render their breaking-news bar. */
      `}</style>
      <div className="container flex items-stretch h-9 gap-3">
        <span className="flex-shrink-0 self-center bg-amber text-amber-foreground px-3 py-0.5 rounded-sm text-xs font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-destructive animate-pulse-dot" />
          عاجل
        </span>
        <div className="apex-ticker-wrapper flex-1 overflow-hidden relative">
          <div
            className="apex-ticker-track flex items-center gap-12 whitespace-nowrap h-full w-max"
            style={{ animationDuration: `${duration}s` }}
          >
            {loop.map((item, i) => {
              const content = (
                <span className="text-sm font-medium inline-flex items-center gap-3">
                  {item.text}
                  <span className="text-amber/80 select-none" aria-hidden>
                    ◆
                  </span>
                </span>
              );
              return (
                <div key={`${item.id}-${i}`} className="flex-shrink-0">
                  {item.link_article_id ? (
                    <Link
                      to={`/article/${item.link_article_id}`}
                      className="hover:underline"
                    >
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
