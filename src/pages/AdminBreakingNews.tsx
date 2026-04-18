import { useEffect, useState } from "react";
import { breakingApi, subscribe } from "@/lib/mockStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";

export default function AdminBreakingNews() {
  const [, force] = useState(0);
  const [text, setText] = useState("");
  const [linkId, setLinkId] = useState("");
  const { toast } = useToast();

  useEffect(() => subscribe(() => force((n) => n + 1)), []);
  const items = breakingApi.all();

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    breakingApi.add(text.trim(), linkId.trim() || null);
    setText(""); setLinkId("");
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">شريط الأخبار العاجلة</h1>

      <form onSubmit={add} className="bg-card border border-border rounded-xl p-4 mb-6 space-y-3">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="نص الخبر العاجل..." maxLength={280} />
        <Input value={linkId} onChange={(e) => setLinkId(e.target.value)} placeholder="معرّف المقال المرتبط (اختياري)" dir="ltr" />
        <Button type="submit" className="gap-2"><Plus className="w-4 h-4" /> إضافة</Button>
      </form>

      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="bg-card border border-border rounded-lg p-3 flex items-center gap-3">
            <Switch checked={it.is_active} onCheckedChange={(v) => breakingApi.toggle(it.id, v)} />
            <p className="flex-1 text-sm text-foreground">{it.text}</p>
            <button onClick={() => { breakingApi.remove(it.id); toast({ title: "تم الحذف" }); }} className="text-destructive hover:opacity-70" aria-label="حذف">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-sm text-muted-foreground py-6">لا توجد عناصر بعد</p>}
      </div>
    </div>
  );
}
