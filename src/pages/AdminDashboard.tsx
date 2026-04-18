import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { FileText, MessageSquare, LogOut, Megaphone, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({ articles: 0, published: 0, feedback: 0, unread: 0 });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchStats = async () => {
      const [{ count: articles }, { count: published }, { count: feedback }, { count: unread }] = await Promise.all([
        supabase.from("articles").select("*", { count: "exact", head: true }),
        supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("feedback_messages").select("*", { count: "exact", head: true }),
        supabase.from("feedback_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
      ]);
      setStats({
        articles: articles ?? 0,
        published: published ?? 0,
        feedback: feedback ?? 0,
        unread: unread ?? 0,
      });
    };
    fetchStats();
  }, [isAdmin]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">جارٍ التحميل...</div>;
  if (!isAdmin) return null;

  const isExact = location.pathname === "/admin";
  const navItems = [
    { to: "/admin/articles", icon: FileText, label: "المقالات" },
    { to: "/admin/breaking", icon: Megaphone, label: "الأخبار العاجلة" },
    { to: "/admin/comments", icon: MessageCircle, label: "التعليقات" },
    { to: "/admin/newsletter", icon: Mail, label: "النشرة" },
    { to: "/admin/feedback", icon: MessageSquare, label: "الرسائل" },
  ];

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-56 border-l border-border bg-card min-h-screen p-4 flex flex-col">
        <h2 className="font-bold text-lg text-foreground mb-6">لوحة التحكم</h2>
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname.startsWith(item.to)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/admin/login"); }} className="justify-start gap-2 text-muted-foreground">
          <LogOut className="w-4 h-4" />
          خروج
        </Button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        {isExact ? (
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-6">نظرة عامة</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "إجمالي المقالات", value: stats.articles, icon: FileText },
                { label: "منشورة", value: stats.published, icon: FileText },
                { label: "إجمالي الرسائل", value: stats.feedback, icon: MessageSquare },
                { label: "غير مقروءة", value: stats.unread, icon: MessageSquare },
              ].map((s) => (
                <div key={s.label} className="bg-card border border-border rounded-xl p-4">
                  <s.icon className="w-5 h-5 text-primary mb-2" />
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}
