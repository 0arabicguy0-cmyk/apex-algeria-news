import { useEffect, useState } from "react";
import { Bell, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function AdminPushNotifications() {
  const { toast } = useToast();
  const [title, setTitle] = useState("خبر عاجل");
  const [body, setBody] = useState("اضغط لقراءة آخر المستجدات");
  const [url, setUrl] = useState("/");
  const [sending, setSending] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("push_subscriptions")
      .select("id", { count: "exact", head: true })
      .then(({ count }) => setCount(count ?? 0));
  }, []);

  const send = async () => {
    if (!title.trim()) return;
    setSending(true);
    const { data, error } = await supabase.functions.invoke("push-send", {
      body: { title, body, url },
    });
    setSending(false);
    if (error) {
      toast({ title: "فشل الإرسال", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "تم إرسال الإشعار",
      description: `تم إرساله إلى ${data?.sent ?? 0} جهاز${data?.removed ? ` (تم تنظيف ${data.removed})` : ""}`,
    });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-3">
        <Bell className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">الإشعارات الفورية</h1>
          <p className="text-sm text-muted-foreground">
            عدد المشتركين: <span className="font-semibold text-foreground">{count ?? "..."}</span>
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 md:p-6 space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-1.5">العنوان</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">المحتوى</label>
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} maxLength={200} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">الرابط عند الضغط</label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/article/..." />
        </div>
        <Button onClick={send} disabled={sending || !title.trim()} className="gap-2">
          <Send className="w-4 h-4" />
          {sending ? "جارٍ الإرسال..." : "إرسال إلى جميع الأجهزة"}
        </Button>
      </div>

      <div className="bg-muted/40 border border-border rounded-xl p-4 text-sm text-muted-foreground max-w-2xl">
        <p className="mb-2 font-medium text-foreground">ℹ️ ملاحظات هامة:</p>
        <ul className="list-disc pr-5 space-y-1">
          <li>الإشعارات الفورية تعمل فقط بعد نشر التطبيق (Publish) على دومين حقيقي.</li>
          <li>لا تعمل داخل معاينة Lovable لأنها تُحمّل في إطار iframe.</li>
          <li>على iOS، يجب على المستخدم تثبيت التطبيق أولاً (iOS 16.4+).</li>
        </ul>
      </div>
    </div>
  );
}
