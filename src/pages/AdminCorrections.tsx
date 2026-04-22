import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface CorrectionRow {
  id: string;
  article_id: string | null;
  article_title: string;
  correction: string;
  original_text: string | null;
  corrected_at: string;
  is_published: boolean;
}

export default function AdminCorrections() {
  const [rows, setRows] = useState<CorrectionRow[]>([]);
  const [title, setTitle] = useState("");
  const [articleId, setArticleId] = useState("");
  const [original, setOriginal] = useState("");
  const [correction, setCorrection] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("corrections_log")
      .select("*")
      .order("corrected_at", { ascending: false });
    setRows(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !correction.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("corrections_log").insert({
      article_id: articleId.trim() || null,
      article_title: title.trim(),
      correction: correction.trim(),
      original_text: original.trim() || null,
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("تم نشر التصحيح");
    setTitle(""); setArticleId(""); setOriginal(""); setCorrection("");
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("corrections_log").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("تم الحذف");
    load();
  };

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-foreground mb-4">سجل التصحيحات</h1>

      <form onSubmit={submit} className="bg-card border border-border rounded-xl p-4 space-y-3 mb-6">
        <Input
          placeholder="عنوان المقال"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          placeholder="معرّف المقال (UUID — اختياري)"
          value={articleId}
          onChange={(e) => setArticleId(e.target.value)}
        />
        <Textarea
          placeholder="النص الأصلي الخاطئ (اختياري)"
          value={original}
          onChange={(e) => setOriginal(e.target.value)}
          rows={2}
        />
        <Textarea
          placeholder="نص التصحيح"
          value={correction}
          onChange={(e) => setCorrection(e.target.value)}
          rows={3}
          required
        />
        <Button type="submit" disabled={saving}>
          {saving ? "جارٍ الحفظ..." : "نشر التصحيح"}
        </Button>
      </form>

      <div className="space-y-3">
        {rows.length === 0 && (
          <p className="text-muted-foreground text-sm">لا توجد تصحيحات بعد.</p>
        )}
        {rows.map((r) => (
          <div key={r.id} className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground">{r.article_title}</p>
              {r.original_text && (
                <p className="text-sm text-muted-foreground line-through mt-1">{r.original_text}</p>
              )}
              <p className="text-sm text-foreground/90 mt-1">{r.correction}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(r.corrected_at).toLocaleString("ar-DZ")}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => remove(r.id)} aria-label="حذف">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
