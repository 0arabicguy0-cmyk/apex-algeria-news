import { useEffect, useRef, useState } from "react";
import { useBreakingNews } from "@/hooks/useBreakingNews";
import { Link } from "react-router-dom";

export default function BreakingTicker() {
  const items = useBreakingNews();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ copies: 2, cycle: 0 });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const group = groupRef.current;
    if (!wrapper || !group) return;

    const measure = () => {
      const cycle = group.getBoundingClientRect().width;
      if (cycle <= 0) return;
      const copies = Math.max(2, Math.ceil(wrapper.clientWidth / cycle) + 2);
      setLayout((prev) => prev.copies === copies && prev.cycle === cycle ? prev : { copies, cycle });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(wrapper);
    observer.observe(group);
    measure();
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="bg-navy text-navy-foreground overflow-hidden sticky top-16 md:top-20 z-40 border-b border-primary">
      <style>{`
        @keyframes apex-ticker {
          0%   { transform: translateX(var(--ticker-cycle)); }
          100% { transform: translateX(0); }
        }
        .apex-ticker-track {
          animation: apex-ticker var(--ticker-duration) linear infinite;
          will-change: transform;
        }
        .apex-ticker-wrapper:hover .apex-ticker-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .apex-ticker-track { animation: none; }
        }
      `}</style>
      <div className="container flex items-stretch h-9 gap-3">
        <span className="flex-shrink-0 self-center bg-primary text-primary-foreground px-3 py-1 rounded-sm text-xs font-extrabold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse-dot" />
          عاجل
        </span>
        <div ref={wrapperRef} dir="rtl" className="apex-ticker-wrapper flex-1 overflow-hidden relative">
          <div
            className="apex-ticker-track flex items-center whitespace-nowrap h-full w-max"
            style={{
              "--ticker-cycle": `${layout.cycle}px`,
              "--ticker-duration": `${Math.max(8, layout.cycle / 60)}s`,
              animationPlayState: layout.cycle ? "running" : "paused",
            } as React.CSSProperties}
          >
            {Array.from({ length: layout.copies }, (_, copy) => (
              <div
                key={copy}
                ref={copy === 0 ? groupRef : undefined}
                dir="rtl"
                aria-hidden={copy > 0 ? true : undefined}
                className="flex shrink-0 items-center gap-12 pe-12"
              >
                {items.map((item) => {
              const content = (
                <span dir="rtl" className="text-sm font-medium inline-flex items-center gap-3">
                  {item.text}
                  <span className="text-primary select-none" aria-hidden>
                    ◆
                  </span>
                </span>
              );
              return (
                <div key={item.id} className="flex-shrink-0">
                  {item.link_article_id ? (
                    <Link
                      to={`/article/${item.link_article_id}`}
                      className="hover:underline"
                      tabIndex={copy > 0 ? -1 : undefined}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
