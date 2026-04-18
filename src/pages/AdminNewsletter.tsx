import { useEffect, useState } from "react";
import { subscribersApi, subscribe } from "@/lib/mockStore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Download } from "lucide-react";

export default function AdminNewsletter() {
  const [, force] = useState(0);
  const { toast } = useToast();

  useEffect(() => subscribe(() => force((n) => n + 1)), []);
  const subs = subscribersApi.all();

  const exportCsv = () => {
    const csv = "email,date\n" + subs.map((s) => `${s.email},${s.created_at}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "newsletter-subscribers.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">مشتركو النشرة</h1>
          <p className="text-sm text-muted-foreground mt-1">{subs.length} مشترك</p>
        </div>
        <Button onClick={exportCsv} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          تصدير CSV
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl divide-y divide-border">
        {subs.map((s) => (
          <div key={s.id} className="flex items-center justify-between p-3">
            <div>
              <p className="text-sm font-medium text-foreground" dir="ltr">{s.email}</p>
              <p className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleString("ar-DZ")}</p>
            </div>
            <button onClick={() => { subscribersApi.remove(s.id); toast({ title: "تم الحذف" }); }} className="text-destructive hover:opacity-70 p-2" aria-label="حذف">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {subs.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">لا يوجد مشتركون بعد</p>}
      </div>
    </div>
  );
}
