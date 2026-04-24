import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ArticleRow = Tables<"articles">;

const statusVariant: Record<string, "outline" | "secondary" | "default"> = {
  draft: "outline",
  published: "default",
};

export default function AdminArticles() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t, isRTL, lang } = useLanguage();
  const { isPublisher } = useAuth();

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setArticles(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!isPublisher) {
      toast({ title: t("permissionDenied"), variant: "destructive" });
      return;
    }
    if (!confirm(isRTL ? "هل أنت متأكد؟" : "Are you sure?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: isRTL ? "تم حذف المقال" : "Article deleted" });
    load();
  };

  const statusKey = (s: string) =>
    s === "published" ? "statusPublished" : "statusDraft";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">{isRTL ? "المقالات" : "Articles"}</h1>
        <Link to="/admin/articles/new">
          <Button size="sm" className="gap-1"><Plus className="w-4 h-4" /> {isRTL ? "مقال جديد" : "New article"}</Button>
        </Link>
      </div>
      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{isRTL ? "العنوان" : "Title"}</TableHead>
              <TableHead>{isRTL ? "التصنيف" : "Category"}</TableHead>
              <TableHead>{isRTL ? "الحالة" : "Status"}</TableHead>
              <TableHead>{isRTL ? "التاريخ" : "Date"}</TableHead>
              <TableHead>{isRTL ? "إجراءات" : "Actions"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium max-w-xs truncate">{a.title}</TableCell>
                <TableCell><Badge variant="secondary">{a.category}</Badge></TableCell>
                <TableCell>
                  <Badge variant={statusVariant[a.status] ?? "outline"}>
                    {t(statusKey(a.status) as any)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(a.created_at).toLocaleDateString(lang === "ar" ? "ar-DZ" : "en-GB")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Link to={`/admin/articles/${a.id}`}>
                      <Button variant="ghost" size="icon"><Pencil className="w-4 h-4" /></Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => remove(a.id)} disabled={!isPublisher} title={isPublisher ? "" : t("permissionDenied")}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!loading && articles.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">{isRTL ? "لا توجد مقالات بعد" : "No articles yet"}</TableCell>
              </TableRow>
            )}
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">{isRTL ? "جارٍ التحميل..." : "Loading..."}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
