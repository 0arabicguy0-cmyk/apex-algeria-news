import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Link } from "react-router-dom";
import { useBreakingNews } from "@/hooks/useBreakingNews";

/** Constant reading speed, independent of how many headlines exist. */
const SPEED_PX_PER_SEC = 60;
const MIN_DURATION_S = 12;

const TICKER_CSS = `
  @keyframes apex-ticker-rtl {
    from { transform: translate3d(0, 0, 0); }
    to   { transform: translate3d(var(--ticker-cycle), 0, 0); }
  }

  .apex-ticker-viewport {
    -webkit-mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
            mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
  }

  .apex-ticker-track {
    animation: apex-ticker-rtl var(--ticker-duration) linear infinite;
    will-change: transform;
  }

  .apex-ticker-viewport:hover .apex-ticker-track,
  .apex-ticker-viewport:focus-within .apex-ticker-track {
    animation-play-state: paused;
  }

  @media (prefers-reduced-motion: reduce) {
    .apex-ticker-track { animation: none; }
    .apex-ticker-viewport { overflow-x: auto; }
  }
`;

type Layout = { copies: number; cycle: number };

export default function BreakingTicker() {
  const items = useBreakingNews();
  const viewportRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLUListElement>(null);
  const [layout, setLayout] = useState<Layout>({ copies: 2, cycle: 0 });

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const group = groupRef.current;
    if (!viewport || !group) return;

    const measure = () => {
      const cycle = Math.round(group.getBoundingClientRect().width);
      if (cycle <= 0) return;

      // The track is anchored to the right and shifts right by one cycle,
      // so it must cover the viewport width + one extra cycle on the left.
      const copies = Math.ceil(viewport.clientWidth / cycle) + 1;

      setLayout((prev) =>
        prev.copies === copies && prev.cycle === cycle
          ? prev
          : { copies, cycle }
      );
    };

    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(group);
    measure();

    // Arabic web fonts change text width after load.
    document.fonts?.ready.then(measure).catch(() => {});

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const duration = Math.max(MIN_DURATION_S, layout.cycle / SPEED_PX_PER_SEC);

  const trackStyle = {
    "--ticker-cycle": `${layout.cycle}px`,
    "--ticker-duration": `${duration}s`,
    animationPlayState: layout.cycle ? "running" : "paused",
  } as CSSProperties;

  return (
    <section
      dir="rtl"
      lang="ar"
      aria-label="الأخبار العاجلة"
      className="sticky top-16 md:top-20 z-40 overflow-hidden border-b border-primary bg-navy text-navy-foreground"
    >
      <style>{TICKER_CSS}</style>

      <div className="container flex h-9 items-stretch gap-3">
        {/* Badge: sits on the right (RTL start) where headlines exit */}
        <span className="flex flex-shrink-0 items-center gap-1.5 self-center rounded-sm bg-primary px-3 py-1 text-xs font-extrabold text-primary-foreground">
          <span
            aria-hidden
            className="h-2 w-2 animate-pulse-dot rounded-full bg-primary-foreground"
          />
          عاجل
        </span>

        <div
          ref={viewportRef}
          className="apex-ticker-viewport relative flex-1 overflow-hidden"
        >
          {/* Anchored to the right edge; extra copies extend to the left */}
          <div
            className="apex-ticker-track absolute inset-y-0 right-0 flex w-max items-center whitespace-nowrap"
            style={trackStyle}
          >
            {Array.from({ length: layout.copies }, (_, copy) => {
              const isClone = copy > 0;
              return (
                <ul
                  key={copy}
                  ref={copy === 0 ? groupRef : undefined}
                  aria-hidden={isClone || undefined}
                  className="flex shrink-0 items-center"
                >
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-shrink-0 items-center px-5"
                    >
                      {item.link_article_id ? (
                        <Link
                          to={`/article/${item.link_article_id}`}
                          tabIndex={isClone ? -1 : undefined}
                          className="text-sm font-medium hover:underline focus-visible:underline"
                        >
                          {item.text}
                        </Link>
                      ) : (
                        <span className="text-sm font-medium">{item.text}</span>
                      )}
                      <span
                        aria-hidden
                        className="select-none ps-10 text-primary"
                      >
                        ◆
                      </span>
                    </li>
                  ))}
                </ul>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}