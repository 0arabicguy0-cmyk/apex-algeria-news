import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, EyeOff, Trash2 } from "lucide-react";

interface Comment {
  id: string;
  article_id: string;
  name: string;
  message: string;
  status: string;
  created_at: string;
  articles?: { title: string } | null;
}

export default function AdminComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "hidden" | "all">("pending");
  const { toast } = useToast();

  const load = async () => {
    let q = supabase
      .from("article_comments")
      .select("*, articles(title)")
      .order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setComments((data ?? []) as Comment[]);
  };

  useEffect(() => { load(); }, [filter]);

  const update = async (id: string, status: string) => {
    await supabase.from("article_comments").update({ status }).eq("id", id);
    toast({ title: "تم التحديث" });
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("article_comments").delete().eq("id", id);
    toast({ title: "تم الحذف" });
    load();
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">إدارة التعليقات</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        {(["pending", "approved", "hidden", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-border"
            }`}
          >
            {f === "pending" ? "بانتظار المراجعة" : f === "approved" ? "موافق عليها" : f === "hidden" ? "مخفية" : "الكل"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-foreground text-sm">{c.name}</span>
                  <Badge variant={c.status === "approved" ? "default" : c.status === "hidden" ? "secondary" : "outline"}>
                    {c.status === "approved" ? "موافق" : c.status === "hidden" ? "مخفي" : "بالمراجعة"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  على: {c.articles?.title ?? "(مقال محذوف)"} · {new Date(c.created_at).toLocaleString("ar-DZ")}
                </p>
              </div>
              <div className="flex gap-1">
                {c.status !== "approved" && (
                  <Button size="sm" variant="outline" onClick={() => update(c.id, "approved")}>
                    <Check className="w-4 h-4" />
                  </Button>
                )}
                {c.status !== "hidden" && (
                  <Button size="sm" variant="outline" onClick={() => update(c.id, "hidden")}>
                    <EyeOff className="w-4 h-4" />
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => remove(c.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap">{c.message}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">لا توجد تعليقات</p>
        )}
      </div>
    </div>
  );
}
