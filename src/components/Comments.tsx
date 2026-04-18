import { useEffect, useState } from "react";
import { commentsApi, subscribe } from "@/lib/mockStore";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

export default function Comments({ articleId }: { articleId: string }) {
  const [, force] = useState(0);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => subscribe(() => force((n) => n + 1)), []);

  const comments = commentsApi.forArticle(articleId, "approved");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    commentsApi.add({ article_id: articleId, name: name.trim(), message: message.trim() });
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
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك" maxLength={80} required />
        <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="اكتب تعليقك بأدب..." rows={3} maxLength={1000} required />
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">يخضع التعليق للمراجعة قبل النشر</span>
          <Button type="submit">إرسال</Button>
        </div>
      </form>

      <div className="space-y-3">
        {comments.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">كن أول من يعلّق</p>}
        {comments.map((c) => (
          <div key={c.id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold">
                {c.name[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <p className="text-[10px] text-muted-foreground">{new Date(c.created_at).toLocaleDateString("ar-DZ")}</p>
              </div>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{c.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
