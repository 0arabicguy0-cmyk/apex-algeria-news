import { useState } from "react";
import { Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TranslateButton({ title: _title, body: _body }: { title: string; body: string }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const translate = (label: string) => {
    setOpen(false);
    toast({ title: "الترجمة معطّلة", description: `الترجمة إلى ${label} تتطلب الاتصال بالخادم.` });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 hover:bg-muted text-xs text-foreground transition-colors"
      >
        <Languages className="w-3.5 h-3.5" />
        ترجمة
      </button>
      {open && (
        <div className="absolute top-full mt-2 right-0 bg-popover border border-border rounded-lg shadow-lg z-30 min-w-[140px] overflow-hidden">
          {[{ code: "fr", label: "Français" }, { code: "en", label: "English" }].map((l) => (
            <button
              key={l.code}
              onClick={() => translate(l.label)}
              className="block w-full text-right px-4 py-2 text-sm text-popover-foreground hover:bg-muted"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
