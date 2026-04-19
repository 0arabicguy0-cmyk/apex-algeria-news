import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { articlesApi, subscribe, type MockArticle, type ArticleStatus } from "@/lib/mockStore";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, CalendarClock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusVariant: Record<ArticleStatus, "outline" | "secondary" | "default"> = {
  draft: "outline",
  in_review: "secondary",
  scheduled: "secondary",
  published: "default",
};

export default function AdminArticles() {
  const [, force] = useState(0);
  const { toast } = useToast();
  const { t, isRTL, lang } = useLanguage();
  const { isPublisher } = useAuth();

  useEffect(() => subscribe(() => force((n) => n + 1)), []);

  const articles: MockArticle[] = articlesApi.all();

  const remove = (id: string) => {
    if (!isPublisher) {
      toast({ title: t("permissionDenied"), variant: "destructive" });
      return;
    }
    articlesApi.remove(id);
    toast({ title: isRTL ? "تم حذف المقال" : "Article deleted" });
  };

  const statusKey = (s: ArticleStatus) =>
    s === "in_review" ? "statusInReview" :
    s === "scheduled" ? "statusScheduled" :
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
                  <div className="flex flex-col gap-1">
                    <Badge variant={statusVariant[a.status]}>
                      {t(statusKey(a.status) as any)}
                    </Badge>
                    {a.status === "scheduled" && a.scheduled_at && (
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1" dir="ltr">
                        <CalendarClock className="w-3 h-3" />
                        {new Date(a.scheduled_at).toLocaleString(lang === "ar" ? "ar-DZ" : "en-GB")}
                      </span>
                    )}
                  </div>
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
            {articles.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">{isRTL ? "لا توجد مقالات بعد" : "No articles yet"}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
