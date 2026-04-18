import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { articlesApi } from "@/lib/mockStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { categories } from "@/lib/data";
import { ArrowRight } from "lucide-react";

const categoryOptions = categories.filter((c) => c.key !== "all");

export default function AdminArticleEditor() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [categoryKey, setCategoryKey] = useState("algeria");
  const [imageUrl, setImageUrl] = useState("");
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  useEffect(() => {
    if (!isNew && id) {
      const a = articlesApi.get(id);
      if (a) {
        setTitle(a.title); setExcerpt(a.excerpt); setBody(a.body); setAuthor(a.author);
        setCategoryKey(a.category_key); setImageUrl(a.image_url ?? "");
        setIsBreaking(a.is_breaking); setIsFeatured(a.is_featured);
        setTagsInput(a.tags.join(", ")); setStatus(a.status);
      }
    }
  }, [id, isNew]);

  const selectedCategory = categoryOptions.find((c) => c.key === categoryKey);

  const handleSave = (publishStatus: "draft" | "published") => {
    if (!title.trim()) { toast({ title: "العنوان مطلوب", variant: "destructive" }); return; }
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const data = {
      title, excerpt, body, author,
      category: selectedCategory?.label ?? "الجزائر",
      category_key: categoryKey,
      image_url: imageUrl || null,
      is_breaking: isBreaking,
      is_featured: isFeatured,
      tags,
      status: publishStatus,
      published_at: publishStatus === "published" ? new Date().toISOString() : null,
    };

    if (isNew) articlesApi.create(data);
    else articlesApi.update(id!, data);

    toast({ title: publishStatus === "published" ? "تم نشر المقال" : "تم حفظ المسودة" });
    navigate("/admin/articles");
  };

  return (
    <div className="max-w-3xl">
      <button onClick={() => navigate("/admin/articles")} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground">
        <ArrowRight className="w-4 h-4" /> العودة للمقالات
      </button>
      <h1 className="text-2xl font-bold text-foreground mb-6">{isNew ? "مقال جديد" : "تعديل المقال"}</h1>

      <div className="space-y-5">
        <div>
          <Label>العنوان</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان المقال" className="mt-1" />
        </div>
        <div>
          <Label>المقتطف</Label>
          <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="ملخص قصير" className="mt-1" rows={2} />
        </div>
        <div>
          <Label>المحتوى</Label>
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="اكتب محتوى المقال هنا..." className="mt-1 min-h-[300px] leading-relaxed" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>الكاتب</Label>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="اسم الكاتب" className="mt-1" />
          </div>
          <div>
            <Label>التصنيف</Label>
            <Select value={categoryKey} onValueChange={setCategoryKey}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {categoryOptions.map((c) => <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>رابط الصورة</Label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="mt-1" dir="ltr" />
        </div>
        <div>
          <Label>الوسوم (مفصولة بفاصلة)</Label>
          <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="الجزائر, طاقة, اقتصاد" className="mt-1" />
        </div>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-3">
            <Switch checked={isBreaking} onCheckedChange={setIsBreaking} />
            <Label>خبر عاجل</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
            <Label>مقال مميّز</Label>
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <Button onClick={() => handleSave("published")}>نشر</Button>
          <Button variant="outline" onClick={() => handleSave("draft")}>حفظ كمسودة</Button>
        </div>
      </div>
    </div>
  );
}
