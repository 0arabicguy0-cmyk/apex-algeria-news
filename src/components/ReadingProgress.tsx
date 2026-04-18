import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? (h.scrollTop / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 right-0 left-0 h-1 z-[60] bg-transparent">
      <div
        className="h-full bg-gradient-to-l from-primary to-dz-green transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
