import { useEffect, useState } from "react";
import { List } from "lucide-react";

interface TocItem { id: string; text: string; }

export default function TableOfContents({ body }: { body: string }) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    // Build TOC from paragraphs that look like headings (## prefix or short bold lines)
    const lines = body.split("\n\n");
    const items: TocItem[] = [];
    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("## ")) {
        const text = trimmed.replace(/^##\s+/, "");
        items.push({ id: `h-${i}`, text });
      }
    });
    setHeadings(items);
  }, [body]);

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className="bg-card border border-border rounded-xl p-4 mb-6">
      <div className="flex items-center gap-2 text-foreground font-bold mb-3 text-sm">
        <List className="w-4 h-4" />
        محتويات المقال
      </div>
      <ul className="space-y-1.5 text-sm">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block py-1 border-r-2 pr-3 transition-colors ${
                active === h.id
                  ? "border-primary text-primary font-medium"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
