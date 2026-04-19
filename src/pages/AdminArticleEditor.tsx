import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { articlesApi, type ArticleStatus, type FactCheckLabel, type MockSource } from "@/lib/mockStore";
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
import { ArrowRight, ArrowLeft, ClipboardCheck, Send, RotateCcw, CheckCircle2, CalendarClock } from "lucide-react";

const categoryOptions = categories.filter((c) => c.key !== "all");

const statusBadgeVariant: Record<ArticleStatus, "outline" | "secondary" | "default"> = {
  draft: "outline",
  in_review: "secondary",
  scheduled: "secondary",
  published: "default",
};

export default function AdminArticleEditor() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();
  const { user, role, isReviewer, isPublisher } = useAuth();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [categoryKey, setCategoryKey] = useState("algeria");
  const [imageUrl, setImageUrl] = useState("");
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [status, setStatus] = useState<ArticleStatus>("draft");
  const [scheduledAt, setScheduledAt] = useState<string>(""); // local datetime-input value
  const [isPremium, setIsPremium] = useState(false);
  const [factCheck, setFactCheck] = useState<FactCheckLabel>("none");
  const [sourcesInput, setSourcesInput] = useState(""); // one per line: "Title|https://url"

  useEffect(() => {
    if (!isNew && id) {
      const a = articlesApi.get(id);
      if (a) {
        setTitle(a.title); setExcerpt(a.excerpt); setBody(a.body); setAuthor(a.author);
        setCategoryKey(a.category_key); setImageUrl(a.image_url ?? "");
        setIsBreaking(a.is_breaking); setIsFeatured(a.is_featured);
        setTagsInput(a.tags.join(", ")); setStatus(a.status);
        if (a.scheduled_at) {
          // ISO -> "YYYY-MM-DDTHH:mm" in local time
          const d = new Date(a.scheduled_at);
          const off = d.getTimezoneOffset();
          const local = new Date(d.getTime() - off * 60_000);
          setScheduledAt(local.toISOString().slice(0, 16));
        }
      }
    }
  }, [id, isNew]);

  const selectedCategory = categoryOptions.find((c) => c.key === categoryKey);

  const baseData = useMemo(() => ({
    title, excerpt, body, author,
    category: selectedCategory?.label ?? "الجزائر",
    category_key: categoryKey,
    image_url: imageUrl || null,
    is_breaking: isBreaking,
    is_featured: isFeatured,
    tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
  }), [title, excerpt, body, author, selectedCategory, categoryKey, imageUrl, isBreaking, isFeatured, tagsInput]);

  const requireTitle = () => {
    if (!title.trim()) {
      toast({ title: isRTL ? "العنوان مطلوب" : "Title is required", variant: "destructive" });
      return false;
    }
    return true;
  };

  const persist = (next: Partial<{
    status: ArticleStatus;
    published_at: string | null;
    scheduled_at: string | null;
    submitted_by: string | null;
    reviewed_by: string | null;
  }>) => {
    const data = { ...baseData, ...next, status: next.status ?? status };
    let savedId = id;
    if (isNew) {
      const created = articlesApi.create({
        ...data,
        published_at: next.published_at ?? null,
        scheduled_at: next.scheduled_at ?? null,
        submitted_by: next.submitted_by ?? null,
        reviewed_by: next.reviewed_by ?? null,
      } as any);
      savedId = created.id;
    } else if (id) {
      articlesApi.update(id, data as any);
    }
    return savedId;
  };

  // ---- Actions per role/status ----
  const saveDraft = () => {
    if (!requireTitle()) return;
    persist({ status: "draft", published_at: null, scheduled_at: null });
    toast({ title: t("saveDraft") });
    navigate("/admin/articles");
  };

  const submitForReview = () => {
    if (!requireTitle()) return;
    persist({ status: "in_review", submitted_by: user?.email ?? null });
    toast({ title: t("submitForReview") });
    navigate("/admin/articles");
  };

  const sendBackToDraft = () => {
    if (!isReviewer) { toast({ title: t("permissionDenied"), variant: "destructive" }); return; }
    persist({ status: "draft" });
    toast({ title: t("sendBackToDraft") });
    navigate("/admin/articles");
  };

  const publishNow = () => {
    if (!isPublisher) { toast({ title: t("permissionDenied"), variant: "destructive" }); return; }
    if (!requireTitle()) return;
    persist({ status: "published", published_at: new Date().toISOString(), scheduled_at: null, reviewed_by: user?.email ?? null });
    toast({ title: t("publishNow") });
    navigate("/admin/articles");
  };

  const schedule = () => {
    if (!isPublisher) { toast({ title: t("permissionDenied"), variant: "destructive" }); return; }
    if (!requireTitle()) return;
    if (!scheduledAt) { toast({ title: t("schedulePublish"), description: t("scheduledFor"), variant: "destructive" }); return; }
    const iso = new Date(scheduledAt).toISOString();
    if (new Date(iso).getTime() <= Date.now()) {
      toast({ title: t("schedulePublish"), description: isRTL ? "اختر وقتاً في المستقبل" : "Pick a future time", variant: "destructive" });
      return;
    }
    persist({ status: "scheduled", scheduled_at: iso, published_at: null, reviewed_by: user?.email ?? null });
    toast({ title: t("schedulePublish") });
    navigate("/admin/articles");
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate("/admin/articles")} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground">
        <BackIcon className="w-4 h-4" /> {isRTL ? "العودة للمقالات" : "Back to articles"}
      </button>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <h1 className="text-2xl font-bold text-foreground">{isNew ? (isRTL ? "مقال جديد" : "New article") : (isRTL ? "تعديل المقال" : "Edit article")}</h1>
        <Badge variant={statusBadgeVariant[status]}>{t(`status${status === "in_review" ? "InReview" : status.charAt(0).toUpperCase() + status.slice(1)}` as any)}</Badge>
        {role && <span className="text-xs text-muted-foreground">· {t("role")}: {t(`role${role.charAt(0).toUpperCase() + role.slice(1)}` as any)}</span>}
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

        {/* Workflow panel */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ClipboardCheck className="w-4 h-4" /> {t("workflow")}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={saveDraft}>{t("saveDraft")}</Button>

            <Button onClick={submitForReview} className="gap-1">
              <Send className="w-4 h-4" /> {t("submitForReview")}
            </Button>

            {isReviewer && status === "in_review" && (
              <Button variant="outline" onClick={sendBackToDraft} className="gap-1">
                <RotateCcw className="w-4 h-4" /> {t("sendBackToDraft")}
              </Button>
            )}

            {isPublisher && (
              <Button onClick={publishNow} className="gap-1">
                <CheckCircle2 className="w-4 h-4" /> {t(status === "in_review" ? "approveAndPublish" : "publishNow")}
              </Button>
            )}
          </div>

          {isPublisher && (
            <div className="pt-3 border-t border-border space-y-2">
              <Label className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarClock className="w-4 h-4" /> {t("schedulePublish")}
              </Label>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="max-w-xs"
                  dir="ltr"
                />
                <Button variant="secondary" onClick={schedule} className="gap-1">
                  <CalendarClock className="w-4 h-4" /> {t("schedulePublish")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
