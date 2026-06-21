import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Check, X, ExternalLink, RefreshCw, Trash2, Eye } from "lucide-react";

type Ad = {
  id: string;
  advertiser_name: string;
  contact_email: string;
  contact_phone: string | null;
  product_title: string;
  product_description: string;
  product_url: string | null;
  product_image_url: string;
  payment_receipt_url: string;
  ccp_reference: string;
  amount_dzd: number;
  duration_days: number;
  status: string;
  admin_note: string | null;
  approved_at: string | null;
  expires_at: string | null;
  created_at: string;
};

type Filter = "pending" | "approved" | "rejected" | "all";

export default function AdminAds() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [filter, setFilter] = useState<Filter>("pending");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});

  async function load() {
    setLoading(true);
    let q = supabase.from("ad_submissions").select("*").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data, error } = await q;
    if (error) toast({ title: "تعذّر التحميل", description: error.message, variant: "destructive" });
    setAds((data ?? []) as Ad[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function signedReceipt(ref: string) {
    if (!ref.startsWith("ad-uploads://")) {
      window.open(ref, "_blank");
      return;
    }
    const path = ref.replace("ad-uploads://", "");
    const { data, error } = await supabase.storage.from("ad-uploads").createSignedUrl(path, 60 * 10);
    if (error || !data) {
      toast({ title: "تعذّر فتح الوصل", variant: "destructive" });
      return;
    }
    window.open(data.signedUrl, "_blank");
  }

  async function approve(ad: Ad) {
    setBusyId(ad.id);
    const now = new Date();
    const expires = new Date(now.getTime() + ad.duration_days * 24 * 60 * 60 * 1000);
    const { error } = await supabase
      .from("ad_submissions")
      .update({
        status: "approved",
        approved_at: now.toISOString(),
        expires_at: expires.toISOString(),
        admin_note: noteDraft[ad.id] ?? ad.admin_note,
      })
      .eq("id", ad.id);
    setBusyId(null);
    if (error) {
      toast({ title: "فشل", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "تمت الموافقة على الإعلان" });
    load();
  }

  async function reject(ad: Ad) {
    setBusyId(ad.id);
    const { error } = await supabase
      .from("ad_submissions")
      .update({ status: "rejected", admin_note: noteDraft[ad.id] ?? ad.admin_note })
      .eq("id", ad.id);
    setBusyId(null);
    if (error) {
      toast({ title: "فشل", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "تم رفض الإعلان" });
    load();
  }

  async function remove(ad: Ad) {
    if (!confirm("حذف هذا الإعلان نهائيًا؟")) return;
    setBusyId(ad.id);
    const { error } = await supabase.from("ad_submissions").delete().eq("id", ad.id);
    setBusyId(null);
    if (error) {
      toast({ title: "فشل الحذف", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "تم الحذف" });
    load();
  }

  const counts: Record<Filter, number | null> = {
    pending: filter === "pending" ? ads.length : null,
    approved: filter === "approved" ? ads.length : null,
    rejected: filter === "rejected" ? ads.length : null,
    all: filter === "all" ? ads.length : null,
  };

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">إدارة الإعلانات</h1>
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw className="w-4 h-4 ms-1" /> تحديث
        </Button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {(["pending", "approved", "rejected", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:text-foreground"
            }`}
          >
            {f === "pending" && "قيد الانتظار"}
            {f === "approved" && "موافق عليها"}
            {f === "rejected" && "مرفوضة"}
            {f === "all" && "الكل"}
            {counts[f] !== null && ` (${counts[f]})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-muted-foreground text-center py-12">جارٍ التحميل...</div>
      ) : ads.length === 0 ? (
        <div className="text-muted-foreground text-center py-12 border border-dashed border-border rounded-xl">
          لا توجد إعلانات في هذه القائمة.
        </div>
      ) : (
        <div className="space-y-4">
          {ads.map((ad) => (
            <div key={ad.id} className="bg-card border border-border rounded-xl p-4 md:p-5">
              <div className="grid md:grid-cols-[160px_1fr] gap-4">
                <img
                  src={ad.product_image_url}
                  alt={ad.product_title}
                  className="w-full md:w-40 h-40 object-cover rounded-lg border border-border"
                />
                <div className="min-w-0">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{ad.product_title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {ad.advertiser_name} · {ad.contact_email}
                        {ad.contact_phone && ` · ${ad.contact_phone}`}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                        ad.status === "pending"
                          ? "bg-amber/15 text-amber"
                          : ad.status === "approved"
                          ? "bg-accent/15 text-accent"
                          : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {ad.status === "pending" && "قيد الانتظار"}
                      {ad.status === "approved" && "موافق عليه"}
                      {ad.status === "rejected" && "مرفوض"}
                      {ad.status === "expired" && "منتهي"}
                    </span>
                  </div>

                  {ad.product_description && (
                    <p className="text-sm text-foreground/80 mt-2 line-clamp-3">{ad.product_description}</p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-xs">
                    <Info label="المبلغ" value={`${ad.amount_dzd.toLocaleString("ar-DZ")} دج`} />
                    <Info label="المدة" value={`${ad.duration_days} يوم`} />
                    <Info label="مرجع CCP" value={ad.ccp_reference} mono />
                    <Info
                      label="ينتهي"
                      value={ad.expires_at ? new Date(ad.expires_at).toLocaleDateString("ar-DZ") : "—"}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={() => signedReceipt(ad.payment_receipt_url)}>
                      <Eye className="w-3.5 h-3.5 ms-1" /> عرض وصل الدفع
                    </Button>
                    {ad.product_url && (
                      <a href={ad.product_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" type="button">
                          <ExternalLink className="w-3.5 h-3.5 ms-1" /> رابط المنتج
                        </Button>
                      </a>
                    )}
                  </div>

                  {(ad.status === "pending" || ad.status === "rejected") && (
                    <div className="mt-4">
                      <Textarea
                        placeholder="ملاحظة (اختيارية)"
                        rows={2}
                        defaultValue={ad.admin_note ?? ""}
                        onChange={(e) => setNoteDraft((d) => ({ ...d, [ad.id]: e.target.value }))}
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-3">
                    {ad.status !== "approved" && (
                      <Button
                        size="sm"
                        onClick={() => approve(ad)}
                        disabled={busyId === ad.id}
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        <Check className="w-4 h-4 ms-1" /> موافقة وتفعيل
                      </Button>
                    )}
                    {ad.status !== "rejected" && (
                      <Button size="sm" variant="outline" onClick={() => reject(ad)} disabled={busyId === ad.id}>
                        <X className="w-4 h-4 ms-1" /> رفض
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => remove(ad)} disabled={busyId === ad.id} className="text-destructive">
                      <Trash2 className="w-4 h-4 ms-1" /> حذف
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-muted-foreground">{label}</div>
      <div className={`text-foreground font-semibold ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}
