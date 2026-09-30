import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Upload, Loader2, X, ClipboardCheck, CheckCircle2 } from "lucide-react";

type Status = "draft" | "published";

export default function AdminDialogueEditor() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isPublisher } = useAuth();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestTitle, setGuestTitle] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<Status>("draft");
  const [publishedAt, setPublishedAt] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data, error } = await supabase.from("dialogues").select("*").eq("id", id!).maybeSingle();
      if (error || !data) {
        toast({ title: "تعذر تحميل الحوار", variant: "destructive" });
        navigate("/admin/dialogues");
        return;
      }
      setTitle(data.title);
      setGuestName(data.guest_name ?? "");
      setGuestTitle(data.guest_title ?? "");
      setInterviewer(data.interviewer ?? "");
      setExcerpt(data.excerpt ?? "");
      setBody(data.body ?? "");
      setImageUrl(data.image_url ?? "");
      setTagsInput((data.tags ?? []).join("، "));
      setIsFeatured(!!data.is_featured);
      setStatus((data.status as Status) ?? "draft");
      setPublishedAt(data.published_at);
      setLoading(false);
    })();
  }, [id, isNew, navigate, toast]);

  const uploadImage = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `dialogues/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("article-images").upload(path, file, { upsert: true });
    setUploading(false);
    if (error) {
      toast({ title: "فشل رفع الصورة", description: error.message, variant: "destructive" });
      return;
    }
    const { data } = supabase.storage.from("article-images").getPublicUrl(path);
    setImageUrl(data.publicUrl);
  };

  const save = async (nextStatus: Status) => {
    if (!isPublisher) return;
    if (!title.trim()) {
      toast({ title: "العنوان مطلوب", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      title: title.trim(),
      guest_name: guestName.trim(),
      guest_title: guestTitle.trim(),
      interviewer: interviewer.trim(),
      excerpt: excerpt.trim(),
      body,
      image_url: imageUrl || null,
      tags: tagsInput
        .split(/[،,]/)
        .map((t) => t.trim())
        .filter(Boolean),
      is_featured: isFeatured,
      status: nextStatus,
      published_at:
        nextStatus === "published" ? publishedAt ?? new Date().toISOString() : null,
    };

    const res = isNew
      ? await supabase.from("dialogues").insert(payload)
      : await supabase.from("dialogues").update(payload).eq("id", id!);
    setSaving(false);

    if (res.error) {
      toast({ title: "خطأ", description: res.error.message, variant: "destructive" });
      return;
    }
    toast({ title: nextStatus === "published" ? "تم نشر الحوار" : "تم حفظ المسودة" });
    navigate("/admin/dialogues");
  };

  if (loading) return <div className="text-muted-foreground">جارٍ التحميل...</div>;

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate("/admin/dialogues")}
        className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground"
      >
        <ArrowRight className="w-4 h-4" /> العودة للحوارات
      </button>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <h1 className="text-2xl font-bold text-foreground">{isNew ? "حوار جديد" : "تعديل الحوار"}</h1>
        <Badge variant={status === "published" ? "default" : "outline"}>
          {status === "published" ? "منشور" : "مسودة"}
        </Badge>
      </div>

      <div className="space-y-5">
        <div>
          <Label>العنوان</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>اسم الضيف</Label>
            <Input value={guestName} onChange={(e) => setGuestName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>صفة الضيف</Label>
            <Input value={guestTitle} onChange={(e) => setGuestTitle(e.target.value)} className="mt-1" />
          </div>
        </div>

        <div>
          <Label>المحاور</Label>
          <Input value={interviewer} onChange={(e) => setInterviewer(e.target.value)} className="mt-1" />
        </div>

        <div>
          <Label>المقتطف</Label>
          <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="mt-1" rows={2} />
        </div>

        <div>
          <Label>نص الحوار</Label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-1 min-h-[300px] leading-relaxed"
          />
        </div>

        <div>
          <Label>صورة الحوار</Label>
          <div className="mt-1 space-y-2">
            {imageUrl ? (
              <div className="relative w-full max-w-md rounded-lg overflow-hidden border border-border">
                <img src={imageUrl} alt="معاينة صورة الحوار" className="w-full h-48 object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute top-2 left-2 bg-background/90 hover:bg-background rounded-full p-1.5"
                  aria-label="إزالة الصورة"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full max-w-md h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/40">
                {uploading ? (
                  <Loader2 className="animate-spin w-6 h-6" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 mb-2" />
                    <span className="text-sm text-muted-foreground">اضغط لرفع صورة</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadImage(f);
                  }}
                />
              </label>
            )}
          </div>
        </div>

        <div>
          <Label>الوسوم (افصل بينها بفاصلة)</Label>
          <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="mt-1" />
        </div>

        <div className="flex items-center justify-between border border-border rounded-lg px-4 py-3">
          <div>
            <Label className="cursor-pointer">حوار مميّز</Label>
            <p className="text-xs text-muted-foreground mt-0.5">يظهر في المقدمة ضمن قسم الحوارات</p>
          </div>
          <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button onClick={() => save("published")} disabled={saving || !isPublisher} className="gap-2">
            <CheckCircle2 className="w-4 h-4" /> نشر
          </Button>
          <Button variant="outline" onClick={() => save("draft")} disabled={saving || !isPublisher} className="gap-2">
            <ClipboardCheck className="w-4 h-4" /> حفظ كمسودة
          </Button>
        </div>
      </div>
    </div>
  );
}
