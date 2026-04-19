import { ExternalLink, BookOpen } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { MockSource } from "@/lib/mockStore";

export default function SourceCitations({ sources }: { sources: MockSource[] }) {
  const { isRTL } = useLanguage();
  if (!sources?.length) return null;

  return (
    <section className="mt-8 rounded-xl border border-border bg-muted/30 p-4">
      <h3 className="flex items-center gap-2 font-bold text-foreground mb-3">
        <BookOpen className="w-4 h-4 text-primary" />
        {isRTL ? "المصادر" : "Sources"}
      </h3>
      <ol className="space-y-2 list-decimal list-inside marker:text-muted-foreground">
        {sources.map((s, i) => (
          <li key={i} className="text-sm">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-1 text-primary hover:underline break-all"
            >
              {s.title || s.url}
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
