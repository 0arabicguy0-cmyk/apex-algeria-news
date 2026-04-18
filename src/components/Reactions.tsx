import { useEffect, useState } from "react";
import { reactionsApi, subscribe } from "@/lib/mockStore";
import { useToast } from "@/hooks/use-toast";

const REACTIONS = [
  { key: "like", emoji: "👍", label: "أعجبني" },
  { key: "love", emoji: "❤️", label: "أحببته" },
  { key: "insightful", emoji: "💡", label: "مفيد" },
  { key: "sad", emoji: "😢", label: "حزين" },
  { key: "angry", emoji: "😠", label: "غاضب" },
] as const;

type Counts = Record<string, number>;

export default function Reactions({ articleId }: { articleId: string }) {
  const [, force] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const { toast } = useToast();
  const storageKey = `reaction:${articleId}`;

  useEffect(() => {
    setPicked(localStorage.getItem(storageKey));
    return subscribe(() => force((n) => n + 1));
  }, [articleId]);

  const counts: Counts = {};
  reactionsApi.forArticle(articleId).forEach((r) => { counts[r.reaction] = (counts[r.reaction] ?? 0) + 1; });

  const react = (key: string) => {
    if (picked) { toast({ title: "لقد قمت بالتفاعل مسبقاً" }); return; }
    reactionsApi.add(articleId, key);
    localStorage.setItem(storageKey, key);
    setPicked(key);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-sm font-medium text-foreground mb-3">ما رأيك في هذا المقال؟</p>
      <div className="flex flex-wrap gap-2">
        {REACTIONS.map((r) => (
          <button
            key={r.key}
            onClick={() => react(r.key)}
            disabled={!!picked}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-sm ${
              picked === r.key ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:border-primary/40 hover:bg-muted"
            } ${picked && picked !== r.key ? "opacity-60" : ""}`}
          >
            <span className="text-lg leading-none">{r.emoji}</span>
            <span className="text-xs">{r.label}</span>
            {counts[r.key] ? <span className="text-xs font-bold text-muted-foreground">{counts[r.key]}</span> : null}
          </button>
        ))}
      </div>
    </div>
  );
}
