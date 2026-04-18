import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { articlesApi, subscribe, type MockArticle } from "@/lib/mockStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminArticles() {
  const [, force] = useState(0);
  const { toast } = useToast();

  useEffect(() => subscribe(() => force((n) => n + 1)), []);

  const articles: MockArticle[] = articlesApi.all();

  const remove = (id: string) => {
    articlesApi.remove(id);
    toast({ title: "تم حذف المقال" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">المقالات</h1>
        <Link to="/admin/articles/new">
          <Button size="sm" className="gap-1"><Plus className="w-4 h-4" /> مقال جديد</Button>
        </Link>
      </div>
      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>العنوان</TableHead>
              <TableHead>التصنيف</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium max-w-xs truncate">{a.title}</TableCell>
                <TableCell><Badge variant="secondary">{a.category}</Badge></TableCell>
                <TableCell>
                  <Badge variant={a.status === "published" ? "default" : "outline"}>
                    {a.status === "published" ? "منشور" : "مسودة"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(a.created_at).toLocaleDateString("ar-DZ")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Link to={`/admin/articles/${a.id}`}>
                      <Button variant="ghost" size="icon"><Pencil className="w-4 h-4" /></Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => remove(a.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {articles.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">لا توجد مقالات بعد</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
