import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Copy, Upload, CheckCircle2, ImageIcon, Receipt } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useTheme } from "@/hooks/useTheme";

const CCP_CODE = "123456789";

const PACKAGES = [
  { days: 7, price: 1500, labelAr: "أسبوع", labelEn: "1 week" },
  { days: 30, price: 5000, labelAr: "شهر", labelEn: "1 month" },
  { days: 90, price: 12000, labelAr: "3 أشهر", labelEn: "3 months" },
];

const schema = z.object({
  advertiser_name: z.string().trim().min(2).max(120),
  contact_email: z.string().trim().email().max(255),
  contact_phone: z.string().trim().max(40).optional().or(z.literal("")),
  product_title: z.string().trim().min(2).max(200),
  product_description: z.string().trim().max(2000),
  product_url: z.string().trim().url().max(500).optional().or(z.literal("")),
  ccp_reference: z.string().trim().min(3).max(64),
});

export default function AdvertisePage() {
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();
  const [pkg, setPkg] = useState(PACKAGES[0]);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const copyCcp = async () => {
    try {
      await navigator.clipboard.writeText(CCP_CODE);
      toast({ title: "تم النسخ", description: `رمز CCP: ${CCP_CODE}` });
    } catch {
      toast({ title: "تعذّر النسخ", variant: "destructive" });
    }
  };

  async function uploadFile(bucket: string, file: File, prefix: string): Promise<string | null> {
    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      contentType: file.type || undefined,
      upsert: false,
    });
    if (error) {
      console.error("upload error", error);
      return null;
    }
    if (bucket === "ad-uploads") {
      // Private bucket — store the storage path so admin can sign a URL
      return `ad-uploads://${path}`;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const raw = {
      advertiser_name: String(form.get("advertiser_name") || ""),
      contact_email: String(form.get("contact_email") || ""),
      contact_phone: String(form.get("contact_phone") || ""),
      product_title: String(form.get("product_title") || ""),
      product_description: String(form.get("product_description") || ""),
      product_url: String(form.get("product_url") || ""),
      ccp_reference: String(form.get("ccp_reference") || ""),
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast({ title: "الرجاء التحقق من الحقول", description: parsed.error.issues[0]?.message, variant: "destructive" });
      return;
    }
    if (!productFile) {
      toast({ title: "صورة المنتج مطلوبة", variant: "destructive" });
      return;
    }
    if (!receiptFile) {
      toast({ title: "وصل الدفع مطلوب", variant: "destructive" });
      return;
    }
    if (productFile.size > 5 * 1024 * 1024 || receiptFile.size > 5 * 1024 * 1024) {
      toast({ title: "حجم الملف كبير جدًا (الحد 5MB)", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const [productUrl, receiptRef] = await Promise.all([
        uploadFile("article-images", productFile, "ads/products"),
        uploadFile("ad-uploads", receiptFile, "receipts"),
      ]);
      if (!productUrl || !receiptRef) {
        toast({ title: "فشل رفع الملفات", variant: "destructive" });
        setSubmitting(false);
        return;
      }
      const { error } = await supabase.from("ad_submissions").insert({
        advertiser_name: parsed.data.advertiser_name,
        contact_email: parsed.data.contact_email,
        contact_phone: parsed.data.contact_phone || null,
        product_title: parsed.data.product_title,
        product_description: parsed.data.product_description,
        product_url: parsed.data.product_url || null,
        product_image_url: productUrl,
        payment_receipt_url: receiptRef,
        ccp_reference: parsed.data.ccp_reference,
        amount_dzd: pkg.price,
        duration_days: pkg.days,
        status: "pending",
      });
      if (error) {
        console.error(error);
        toast({ title: "تعذّر إرسال الطلب", description: error.message, variant: "destructive" });
        setSubmitting(false);
        return;
      }
      setDone(true);
      toast({ title: "تم استلام طلبك", description: "سيقوم الفريق بمراجعة الدفع والموافقة قريبًا." });
    } catch (err) {
      console.error(err);
      toast({ title: "خطأ غير متوقع", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <SEO title="أعلن معنا — Apex News DZ" description="أعلن عن منتجك أو خدمتك على Apex News DZ — ادفع عبر CCP وستظهر إعلاناتك بعد التحقق." />
      <Header isDark={isDark} onToggleTheme={toggle} />
      <main className="flex-1 container py-6 md:py-10 max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">أعلن معنا</h1>
        <p className="text-muted-foreground mb-6">
          اعرض منتجك أو خدمتك على آلاف القراء يوميًا. ادفع عبر CCP، أرفق الوصل، وسيتم تفعيل الإعلان بعد التحقق.
        </p>

        {done ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <CheckCircle2 className="w-14 h-14 text-accent mx-auto mb-3" />
            <h2 className="text-xl font-bold text-foreground mb-2">تم استلام طلبك بنجاح</h2>
            <p className="text-muted-foreground mb-6">
              سيتم التحقق من الدفع خلال 24 ساعة. ستصلك رسالة تأكيد على بريدك الإلكتروني عند الموافقة.
            </p>
            <Button onClick={() => navigate("/")}>العودة للرئيسية</Button>
          </div>
        ) : (
          <>
            {/* Package picker */}
            <section className="rounded-xl border border-border bg-card p-4 md:p-5 mb-5">
              <h2 className="font-bold text-foreground mb-3">اختر الباقة</h2>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {PACKAGES.map((p) => (
                  <button
                    key={p.days}
                    type="button"
                    onClick={() => setPkg(p)}
                    className={`text-center rounded-lg border p-3 transition-all ${
                      pkg.days === p.days
                        ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                        : "border-border bg-background hover:border-primary/50"
                    }`}
                  >
                    <div className="text-xs text-muted-foreground">{p.labelAr}</div>
                    <div className="text-lg md:text-xl font-bold text-foreground mt-1">{p.price.toLocaleString("ar-DZ")}</div>
                    <div className="text-[10px] text-muted-foreground">دج</div>
                  </button>
                ))}
              </div>
            </section>

            {/* CCP info */}
            <section className="rounded-xl border border-amber/40 bg-amber/5 p-4 md:p-5 mb-5">
              <h2 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber" />
                خطوات الدفع
              </h2>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>
                  حوّل مبلغ <span className="font-bold text-foreground">{pkg.price.toLocaleString("ar-DZ")} دج</span> إلى حساب CCP التالي:
                </li>
                <li className="flex items-center gap-2">
                  <code className="bg-background border border-border rounded px-3 py-1 font-mono text-base text-foreground">{CCP_CODE}</code>
                  <Button type="button" size="sm" variant="outline" onClick={copyCcp}>
                    <Copy className="w-3.5 h-3.5 ms-1" /> نسخ
                  </Button>
                </li>
                <li>التقط صورة واضحة لوصل التحويل وارفعها أدناه مع رقم العملية المرجعي.</li>
              </ol>
            </section>

            {/* Form */}
            <form onSubmit={onSubmit} className="rounded-xl border border-border bg-card p-4 md:p-5 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="advertiser_name">الاسم الكامل / اسم الشركة *</Label>
                  <Input id="advertiser_name" name="advertiser_name" required maxLength={120} />
                </div>
                <div>
                  <Label htmlFor="contact_email">البريد الإلكتروني *</Label>
                  <Input id="contact_email" name="contact_email" type="email" required maxLength={255} />
                </div>
                <div>
                  <Label htmlFor="contact_phone">رقم الهاتف</Label>
                  <Input id="contact_phone" name="contact_phone" type="tel" maxLength={40} />
                </div>
                <div>
                  <Label htmlFor="ccp_reference">رقم العملية / المرجع *</Label>
                  <Input id="ccp_reference" name="ccp_reference" required maxLength={64} placeholder="مثال: 20260621-XX1234" />
                </div>
              </div>

              <div>
                <Label htmlFor="product_title">عنوان الإعلان *</Label>
                <Input id="product_title" name="product_title" required maxLength={200} />
              </div>

              <div>
                <Label htmlFor="product_description">وصف قصير</Label>
                <Textarea id="product_description" name="product_description" rows={3} maxLength={2000} />
              </div>

              <div>
                <Label htmlFor="product_url">رابط المنتج (اختياري)</Label>
                <Input id="product_url" name="product_url" type="url" maxLength={500} placeholder="https://" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FileField
                  label="صورة المنتج *"
                  icon={ImageIcon}
                  file={productFile}
                  onChange={setProductFile}
                  accept="image/*"
                />
                <FileField
                  label="وصل الدفع *"
                  icon={Receipt}
                  file={receiptFile}
                  onChange={setReceiptFile}
                  accept="image/*,application/pdf"
                />
              </div>

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "جارٍ الإرسال..." : "إرسال الطلب"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                * بإرسال الطلب فإنك توافق على شروط الإعلان. سيتم مراجعة الدفع يدويًا.
              </p>
            </form>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function FileField({
  label,
  icon: Icon,
  file,
  onChange,
  accept,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  file: File | null;
  onChange: (f: File | null) => void;
  accept: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors min-h-[120px] bg-background">
        {file ? (
          <>
            <CheckCircle2 className="w-8 h-8 text-accent" />
            <div className="text-sm text-foreground text-center break-all">{file.name}</div>
            <div className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</div>
          </>
        ) : (
          <>
            <Icon className="w-8 h-8 text-muted-foreground" />
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" /> اختر ملفًا
            </div>
            <div className="text-[10px] text-muted-foreground">الحد الأقصى 5MB</div>
          </>
        )}
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  );
}
