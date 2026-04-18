import { Bookmark } from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useToast } from "@/hooks/use-toast";

export default function BookmarkButton({ articleId, className }: { articleId: string; className?: string }) {
  const { has, toggle } = useBookmarks();
  const { toast } = useToast();
  const saved = has(articleId);

  const onClick = () => {
    toggle(articleId);
    toast({ title: saved ? "أُزيل من المحفوظات" : "تم الحفظ" });
  };

  return (
    <button
      onClick={onClick}
      aria-label="حفظ المقال"
      className={`transition-colors ${saved ? "text-primary" : "text-muted-foreground hover:text-foreground"} ${className ?? ""}`}
    >
      <Bookmark className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
    </button>
  );
}
