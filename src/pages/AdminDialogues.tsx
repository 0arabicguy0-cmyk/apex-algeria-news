import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type DialogueRow = Tables<"dialogues">;

export default function AdminDialogues() {
  const [rows, setRows] = useState<DialogueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all");
  const { toast } = useToast();
  const { isPublisher } = useAuth();

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("dialogues")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "خطأ", description: error.message, variant: "destructive" });
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        (r.guest_name ?? "").toLowerCase().includes(q) ||
        (r.interviewer ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, query, statusFilter]);

  const remove = async (id: string) => {
    if (!isPublisher) return;
    if (!confirm("هل أنت متأكد من حذف هذا الحوار؟")) return;
    const { error } = await supabase.from("dialogues").delete().eq("id", id);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "تم حذف الحوار" });
    load();
  };

  const toggleStatus = async (row: DialogueRow) => {
    if (!isPublisher) return;
    const next = row.status === "published" ? "draft" : "published";
    const { error } = await supabase
      .from("dialogues")
      .update({
        status: next,
        published_at: next === "published" ? row.published_at ?? new Date().toISOString() : null,
      })
      .eq("id", row.id);
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: next === "published" ? "تم نشر الحوار" : "تم تحويل الحوار إلى مسودة" });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold text-foreground">الحوارات</h1>
        <Link to="/admin/dialogues/new">
          <Button size="sm" className="gap-1"><Plus className="w-4 h-4" /> حوار جديد</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث بالعنوان أو الضيف..."
            className="ps-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الحالات</SelectItem>
            <SelectItem value="published">منشور</SelectItem>
            <SelectItem value="draft">مسودة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>العنوان</TableHead>
              <TableHead>الضيف</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium max-w-xs truncate">{d.title}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{d.guest_name || "—"}</TableCell>
                <TableCell>
                  <Badge variant={d.status === "published" ? "default" : "outline"}>
                    {d.status === "published" ? "منشور" : "مسودة"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(d.created_at).toLocaleDateString("ar-DZ")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleStatus(d)}
                      disabled={!isPublisher}
                      title={d.status === "published" ? "إلغاء النشر" : "نشر"}
                    >
                      {d.status === "published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Link to={`/admin/dialogues/${d.id}`}>
                      <Button variant="ghost" size="icon"><Pencil className="w-4 h-4" /></Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => remove(d.id)} disabled={!isPublisher}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">لا توجد حوارات</TableCell>
              </TableRow>
            )}
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">جارٍ التحميل...</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
