import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { categories } from "@/lib/data";
import { ArrowRight, ArrowLeft, ClipboardCheck, CheckCircle2 } from "lucide-react";

const categoryOptions = categories.filter((c) => c.key !== "all");

type Status = "draft" | "published";

const statusBadgeVariant: Record<Status, "outline" | "default"> = {
  draft: "outline",
  published: "default",
};

export default function AdminArticleEditor() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();
  const { isPublisher } = useAuth();

  const [loading, setLoading] = useState(!isNew);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [categoryKey, setCategoryKey] = useState("algeria");
  const [imageUrl, setImageUrl] = useState("");
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [status, setStatus] = useState<Status>("draft");

  useEffect(() => {
    if (isNew || !id) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
      if (cancelled) return;
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }
      if (data) {
        setTitle(data.title);
        setExcerpt(data.excerpt ?? "");
        setBody(data.body ?? "");
        setAuthor(data.author ?? "");
        setCategoryKey(data.category_key);
        setImageUrl(data.image_url ?? "");
        setIsBreaking(data.is_breaking);
        setIsFeatured(data.is_featured);
        setTagsInput((data.tags ?? []).join(", "));
        setStatus((data.status as Status) ?? "draft");
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [id, isNew, toast]);

  const selectedCategory = categoryOptions.find((c) => c.key === categoryKey);

  const requireTitle = () => {
    if (!title.trim()) {
      toast({ title: isRTL ? "العنوان مطلوب" : "Title is required", variant: "destructive" });
      return false;
    }
    return true;
  };

  const buildPayload = (nextStatus: Status) => ({
    title: title.trim(),
    excerpt: excerpt.trim(),
    body,
    author: author.trim(),
    category: selectedCategory?.label ?? "الجزائر",
    category_key: categoryKey,
    image_url: imageUrl.trim() || null,
    is_breaking: isBreaking,
    is_featured: isFeatured,
    tags: tagsInput.split(",").map((s) => s.trim()).filter(Boolean),
    status: nextStatus,
    published_at: nextStatus === "published" ? new Date().toISOString() : null,
  });

  const save = async (nextStatus: Status) => {
    if (!requireTitle()) return;
    const wasPublished = status === "published";
    const payload = buildPayload(nextStatus);
    let articleId = id && id !== "new" ? id : null;
    if (isNew) {
      const { data, error } = await supabase.from("articles").insert(payload).select("id").single();
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      articleId = data?.id ?? null;
    } else if (id) {
      const { error } = await supabase.from("articles").update(payload).eq("id", id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
    }
    toast({
      title: nextStatus === "published"
        ? (isRTL ? "تم النشر" : "Published")
        : (isRTL ? "تم حفظ المسودة" : "Draft saved"),
    });

    // Fire-and-forget FCM push when an article transitions to published.
    if (nextStatus === "published" && !wasPublished && articleId) {
      supabase.functions
        .invoke("fcm-send-article", { body: { article_id: articleId } })
        .then(({ data, error }) => {
          if (error) {
            toast({
              title: isRTL ? "تعذّر إرسال الإشعار" : "Push notification failed",
              description: error.message,
              variant: "destructive",
            });
          } else if (data?.sent != null) {
            toast({
              title: isRTL ? "تم إرسال الإشعارات" : "Notifications sent",
              description: isRTL
                ? `أُرسل إلى ${data.sent} مشترك`
                : `Sent to ${data.sent} subscribers`,
            });
          }
        });
    }

    navigate("/admin/articles");
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  if (loading) {
    return <div className="text-muted-foreground">{isRTL ? "جارٍ التحميل..." : "Loading..."}</div>;
  }

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate("/admin/articles")} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground">
        <BackIcon className="w-4 h-4" /> {isRTL ? "العودة للمقالات" : "Back to articles"}
      </button>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <h1 className="text-2xl font-bold text-foreground">
          {isNew ? (isRTL ? "مقال جديد" : "New article") : (isRTL ? "تعديل المقال" : "Edit article")}
        </h1>
        <Badge variant={statusBadgeVariant[status]}>
          {status === "published" ? t("statusPublished") : t("statusDraft")}
        </Badge>
      </div>

      <div className="space-y-5">
        <div>
          <Label>{isRTL ? "العنوان" : "Title"}</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label>{isRTL ? "المقتطف" : "Excerpt"}</Label>
          <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="mt-1" rows={2} />
        </div>
        <div>
          <Label>{isRTL ? "المحتوى" : "Content"}</Label>
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} className="mt-1 min-h-[300px] leading-relaxed" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>{isRTL ? "الكاتب" : "Author"}</Label>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>{isRTL ? "التصنيف" : "Category"}</Label>
            <Select value={categoryKey} onValueChange={setCategoryKey}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {categoryOptions.map((c) => <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>{isRTL ? "رابط الصورة" : "Image URL"}</Label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="mt-1" dir="ltr" />
        </div>
        <div>
          <Label>{isRTL ? "الوسوم (مفصولة بفاصلة)" : "Tags (comma separated)"}</Label>
          <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="mt-1" />
        </div>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-3">
            <Switch checked={isBreaking} onCheckedChange={setIsBreaking} />
            <Label>{isRTL ? "خبر عاجل" : "Breaking"}</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
            <Label>{isRTL ? "مقال مميّز" : "Featured"}</Label>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ClipboardCheck className="w-4 h-4" /> {isRTL ? "النشر" : "Publish"}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => save("draft")}>
              {isRTL ? "حفظ كمسودة" : "Save as draft"}
            </Button>
            {isPublisher && (
              <Button onClick={() => save("published")} className="gap-1">
                <CheckCircle2 className="w-4 h-4" /> {isRTL ? "نشر الآن" : "Publish now"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
