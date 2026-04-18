import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Languages, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LANGS = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
];

export default function TranslateButton({ title, body }: { title: string; body: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ title: string; body: string; lang: string } | null>(null);
  const { toast } = useToast();

  const translate = async (lang: string) => {
    setOpen(false);
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("translate-article", {
      body: { title, body, target: lang },
    });
    setLoading(false);
    if (error || !data?.translation) {
      toast({ title: "تعذّر الترجمة", description: error?.message ?? "حاول مرة أخرى", variant: "destructive" });
      return;
    }
    setResult({ title: data.translation.title, body: data.translation.body, lang });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 hover:bg-muted text-xs text-foreground transition-colors"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Languages className="w-3.5 h-3.5" />}
        ترجمة
      </button>
      {open && (
        <div className="absolute top-full mt-2 right-0 bg-popover border border-border rounded-lg shadow-lg z-30 min-w-[140px] overflow-hidden">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => translate(l.code)}
              className="block w-full text-right px-4 py-2 text-sm text-popover-foreground hover:bg-muted"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}

      {result && (
        <div
          dir={result.lang === "fr" || result.lang === "en" ? "ltr" : "rtl"}
          className="fixed inset-0 z-[80] bg-background/95 backdrop-blur overflow-y-auto"
        >
          <div className="container max-w-3xl py-8">
            <button
              onClick={() => setResult(null)}
              className="mb-4 px-3 py-1.5 rounded-md bg-muted text-sm text-foreground hover:bg-border"
              dir="rtl"
            >
              ✕ إغلاق
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{result.title}</h1>
            <div className="prose-article text-foreground text-base md:text-lg leading-[1.8] space-y-5">
              {result.body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
