import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

interface Comment {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export default function Comments({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("article_comments")
        .select("id, name, message, created_at")
        .eq("article_id", articleId)
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      setComments(data ?? []);
    })();
  }, [articleId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from("article_comments").insert({
      article_id: articleId,
      name: name.trim(),
      message: message.trim(),
      status: "pending",
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
      return;
    }
    setName(""); setMessage("");
    toast({ title: "شكراً لك", description: "سيظهر تعليقك بعد المراجعة" });
  };

  return (
    <section className="mt-10">
      <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        التعليقات ({comments.length})
      </h3>

      <form onSubmit={submit} className="bg-card border border-border rounded-xl p-4 mb-6 space-y-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسمك"
          maxLength={80}
          required
        />
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب تعليقك بأدب..."
          rows={3}
          maxLength={1000}
          required
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">يخضع التعليق للمراجعة قبل النشر</span>
          <Button type="submit" disabled={submitting}>
            {submitting ? "جارٍ الإرسال..." : "إرسال"}
          </Button>
        </div>
      </form>

      <div className="space-y-3">
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">كن أول من يعلّق</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold">
                {c.name[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(c.created_at).toLocaleDateString("ar-DZ")}
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{c.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
