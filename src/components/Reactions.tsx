import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  const [counts, setCounts] = useState<Counts>({});
  const [picked, setPicked] = useState<string | null>(null);
  const { toast } = useToast();
  const storageKey = `reaction:${articleId}`;

  useEffect(() => {
    setPicked(localStorage.getItem(storageKey));
    (async () => {
      const { data } = await supabase
        .from("article_reactions")
        .select("reaction")
        .eq("article_id", articleId);
      const c: Counts = {};
      (data ?? []).forEach((r) => { c[r.reaction] = (c[r.reaction] ?? 0) + 1; });
      setCounts(c);
    })();
  }, [articleId]);

  const react = async (key: string) => {
    if (picked) {
      toast({ title: "لقد قمت بالتفاعل مسبقاً" });
      return;
    }
    const { error } = await supabase.from("article_reactions").insert({
      article_id: articleId,
      reaction: key,
    });
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
      return;
    }
    localStorage.setItem(storageKey, key);
    setPicked(key);
    setCounts((c) => ({ ...c, [key]: (c[key] ?? 0) + 1 }));
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
              picked === r.key
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background hover:border-primary/40 hover:bg-muted"
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
