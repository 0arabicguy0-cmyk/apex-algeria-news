import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { categories } from "@/lib/data";
import {
  ArrowRight,
  ArrowLeft,
  ClipboardCheck,
  CheckCircle2,
  Upload,
  Loader2,
  X,
} from "lucide-react";

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
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: isRTL ? "ملف غير صالح" : "Invalid file",
        description: isRTL ? "يرجى اختيار صورة" : "Please choose an image",
        variant: "destructive",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: isRTL ? "حجم الصورة كبير" : "File too large",
        description: isRTL ? "الحد الأقصى 5 ميغابايت" : "Max 5MB",
        variant: "destructive",
      });
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("article-images")
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (upErr) {
      toast({
        title: "Error",
        description: upErr.message,
        variant: "destructive",
      });
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("article-images").getPublicUrl(path);
    setImageUrl(data.publicUrl);
    setUploading(false);
    toast({ title: isRTL ? "تم رفع الصورة" : "Image uploaded" });
  };

  useEffect(() => {
    if (isNew || !id) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
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
    return () => {
      cancelled = true;
    };
  }, [id, isNew, toast]);

  const selectedCategory = categoryOptions.find((c) => c.key === categoryKey);

  const requireTitle = () => {
    if (!title.trim()) {
      toast({
        title: isRTL ? "العنوان مطلوب" : "Title is required",
        variant: "destructive",
      });
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
    tags: tagsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    status: nextStatus,
    published_at: nextStatus === "published" ? new Date().toISOString() : null,
  });

  const save = async (nextStatus: Status) => {
    if (!requireTitle()) return;
  
    const wasPublished = status === "published";
    const payload = buildPayload(nextStatus);
    let articleId = id && id !== "new" ? id : null;
  
    try {
      // Save article
      if (isNew) {
        const { data, error } = await supabase
          .from("articles")
          .insert(payload)
          .select("id")
          .single();
  
        if (error) throw error;
        articleId = data.id;
      } else if (id) {
        const { error } = await supabase
          .from("articles")
          .update(payload)
          .eq("id", id);
  
        if (error) throw error;
      }
  
      toast({
        title:
          nextStatus === "published"
            ? isRTL
              ? "تم النشر"
              : "Published"
            : isRTL
            ? "تم حفظ المسودة"
            : "Draft saved",
      });
  
      // Send push notification only when publishing for the first time
      if (nextStatus === "published" && !wasPublished && articleId) {
        try {
          const { data, error } = await supabase.functions.invoke(
            "fcm-send-article",
            {
              body: {
                article_id: articleId,
              },
            }
          );
  
          if (error) {
            console.error("FCM invoke error:", error);
  
            if ("context" in error && error.context) {
              console.error(await error.context.text());
            }
  
            throw error;
          }
  
          console.log("FCM response:", data);
  
          if (data?.sent != null) {
            toast({
              title: isRTL ? "تم إرسال الإشعارات" : "Notifications sent",
              description: isRTL
                ? `تم الإرسال إلى ${data.sent} مشترك`
                : `Sent to ${data.sent} subscribers`,
            });
          }
        } catch (notifErr: any) {
          console.error("FCM notification failed:", notifErr);
  
          if ("context" in notifErr && notifErr.context) {
            console.error(await notifErr.context.text());
          }
  
          // Don't prevent navigation if notifications fail.
        }
      }
  
      navigate("/admin/articles");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
  
      console.error(err);
    }
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  if (loading) {
    return (
      <div className="text-muted-foreground">
        {isRTL ? "جارٍ التحميل..." : "Loading..."}
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate("/admin/articles")}
        className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground"
      >
        <BackIcon className="w-4 h-4" />{" "}
        {isRTL ? "العودة للمقالات" : "Back to articles"}
      </button>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <h1 className="text-2xl font-bold text-foreground">
          {isNew
            ? isRTL
              ? "مقال جديد"
              : "New article"
            : isRTL
            ? "تعديل المقال"
            : "Edit article"}
        </h1>
        <Badge variant={statusBadgeVariant[status]}>
          {status === "published" ? t("statusPublished") : t("statusDraft")}
        </Badge>
      </div>

      <div className="space-y-5">
        <div>
          <Label>{isRTL ? "العنوان" : "Title"}</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label>{isRTL ? "المقتطف" : "Excerpt"}</Label>
          <Textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="mt-1"
            rows={2}
          />
        </div>
        <div>
          <Label>{isRTL ? "المحتوى" : "Content"}</Label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-1 min-h-[300px] leading-relaxed"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>{isRTL ? "الكاتب" : "Author"}</Label>
            <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>{isRTL ? "التصنيف" : "Category"}</Label>
            <Select value={categoryKey} onValueChange={setCategoryKey}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((c) => (
                  <SelectItem key={c.key} value={c.key}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>{isRTL ? "صورة المقال" : "Article image"}</Label>
          <div className="mt-1 space-y-2">
            {imageUrl ? (
              <div className="relative w-full max-w-md rounded-lg overflow-hidden border border-border group">
                <img
                  src={imageUrl}
                  alt="preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute top-2 left-2 bg-background/90 hover:bg-background text-foreground rounded-full p-1.5 shadow-md"
                  aria-label="remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full max-w-md h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/40 transition-colors">
                {uploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      {isRTL
                        ? "اضغط لرفع صورة (حد أقصى 5 ميغا)"
                        : "Click to upload (max 5MB)"}
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && handleImageUpload(e.target.files[0])
                  }
                  disabled={uploading}
                />
              </label>
            )}
            <details className="text-xs text-muted-foreground">
              <summary className="cursor-pointer">
                {isRTL ? "أو استخدم رابطًا خارجيًا" : "Or use an external URL"}
              </summary>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="mt-2"
                dir="ltr"
                placeholder="https://..."
              />
            </details>
          </div>
        </div>
        <div>
          <Label>
            {isRTL ? "الوسوم (مفصولة بفاصلة)" : "Tags (comma separated)"}
          </Label>
          <Input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="mt-1"
          />
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
                <CheckCircle2 className="w-4 h-4" />{" "}
                {isRTL ? "نشر الآن" : "Publish now"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
