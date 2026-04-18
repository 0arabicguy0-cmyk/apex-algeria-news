import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";

interface Item {
  id: string;
  text: string;
  is_active: boolean;
  display_order: number;
  link_article_id: string | null;
}

export default function AdminBreakingNews() {
  const [items, setItems] = useState<Item[]>([]);
  const [text, setText] = useState("");
  const [linkId, setLinkId] = useState("");
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase
      .from("breaking_news_items")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    setItems(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const { error } = await supabase.from("breaking_news_items").insert({
      text: text.trim(),
      link_article_id: linkId.trim() || null,
      display_order: items.length,
    });
    if (error) { toast({ title: "خطأ", description: error.message, variant: "destructive" }); return; }
    setText(""); setLinkId("");
    load();
  };

  const toggle = async (id: string, value: boolean) => {
    await supabase.from("breaking_news_items").update({ is_active: value }).eq("id", id);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("breaking_news_items").delete().eq("id", id);
    toast({ title: "تم الحذف" });
    load();
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">شريط الأخبار العاجلة</h1>

      <form onSubmit={add} className="bg-card border border-border rounded-xl p-4 mb-6 space-y-3">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="نص الخبر العاجل..."
          maxLength={280}
        />
        <Input
          value={linkId}
          onChange={(e) => setLinkId(e.target.value)}
          placeholder="معرّف المقال المرتبط (اختياري)"
          dir="ltr"
        />
        <Button type="submit" className="gap-2">
          <Plus className="w-4 h-4" /> إضافة
        </Button>
      </form>

      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="bg-card border border-border rounded-lg p-3 flex items-center gap-3">
            <Switch checked={it.is_active} onCheckedChange={(v) => toggle(it.id, v)} />
            <p className="flex-1 text-sm text-foreground">{it.text}</p>
            <button onClick={() => remove(it.id)} className="text-destructive hover:opacity-70" aria-label="حذف">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-6">لا توجد عناصر بعد</p>
        )}
      </div>
    </div>
  );
}
