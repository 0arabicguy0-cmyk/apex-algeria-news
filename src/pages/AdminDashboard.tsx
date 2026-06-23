import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { feedbackApi, subscribe } from "@/lib/mockStore";
import { FileText, MessageSquare, LogOut, Megaphone, MessageCircle, Mail, Menu, X, Bell, AlertCircle, Home, BadgeDollarSign, PlusCircle, TrendingUp, Eye, Clock, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const { isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [, force] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [articleStats, setArticleStats] = useState({ total: 0, published: 0, drafts: 0, totalViews: 0 });
  const [pendingAds, setPendingAds] = useState(0);
  const [recentArticles, setRecentArticles] = useState<Array<{ id: string; title: string; status: string; created_at: string; view_count: number | null }>>([]);

  useEffect(() => subscribe(() => force((n) => n + 1)), []);

  useEffect(() => {
    if (loading) return;
    if (!isAdmin) navigate("/admin/login", { replace: true });
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const [{ count: total }, { count: published }, { count: drafts }, viewsRes, adsRes, recentRes] = await Promise.all([
        supabase.from("articles").select("*", { count: "exact", head: true }),
        supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "draft"),
        supabase.from("articles").select("view_count"),
        supabase.from("ad_submissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("articles").select("id, title, status, created_at, view_count").order("created_at", { ascending: false }).limit(5),
      ]);
      const totalViews = (viewsRes.data ?? []).reduce((sum, a: any) => sum + (a.view_count ?? 0), 0);
      setArticleStats({ total: total ?? 0, published: published ?? 0, drafts: drafts ?? 0, totalViews });
      setPendingAds(adsRes.count ?? 0);
      setRecentArticles(recentRes.data ?? []);
    })();
  }, [isAdmin, location.pathname]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">جارٍ التحميل...</div>;
  if (!isAdmin) return null;

  const stats = {
    articles: articleStats.total,
    published: articleStats.published,
    drafts: articleStats.drafts,
    views: articleStats.totalViews,
    feedback: feedbackApi.all().length,
    unread: feedbackApi.unreadCount(),
    pendingAds,
  };

  const isExact = location.pathname === "/admin";
  const navItems = [
    { to: "/admin/articles", icon: FileText, label: "المقالات" },
    { to: "/admin/breaking", icon: Megaphone, label: "الأخبار العاجلة" },
    { to: "/admin/comments", icon: MessageCircle, label: "التعليقات" },
    { to: "/admin/newsletter", icon: Mail, label: "النشرة" },
    { to: "/admin/feedback", icon: MessageSquare, label: "الرسائل" },
    { to: "/admin/push", icon: Bell, label: "الإشعارات الفورية" },
    { to: "/admin/corrections", icon: AlertCircle, label: "سجل التصحيحات" },
    { to: "/admin/ads", icon: BadgeDollarSign, label: "الإعلانات" },
  ];

  const NavList = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="space-y-1 flex-1">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            location.pathname.startsWith(item.to) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  const SidebarInner = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex flex-col h-full p-4">
      <h2 className="font-bold text-lg text-foreground mb-6">لوحة التحكم</h2>
      <NavList onNavigate={onNavigate} />
      
      {/* Go back to homepage */}
      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors mb-2"
      >
        <Home className="w-4 h-4" />
        العودة للموقع
      </Link>
      
      <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate("/admin/login"); }} className="justify-start gap-2 text-muted-foreground">
        <LogOut className="w-4 h-4" />
        خروج
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row" dir="rtl">
      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between p-3 border-b border-border bg-card sticky top-0 z-30">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-muted text-foreground"
          aria-label="فتح القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-foreground">لوحة التحكم</h2>
        <div className="w-9" />
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 border-l border-border bg-card min-h-screen flex-col">
        <SidebarInner />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex" onClick={() => setMobileOpen(false)}>
          <div className="fixed inset-0 bg-black/60" />
          <aside
            className="relative ms-auto w-64 h-full bg-card border-l border-border animate-in slide-in-from-right"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 left-3 p-2 rounded-lg hover:bg-muted text-foreground"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarInner onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <main className="flex-1 p-4 md:p-6 min-w-0">
        {isExact ? (
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">نظرة عامة</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
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
            <p className="text-xs text-muted-foreground mt-6">📡 المقالات والأخبار العاجلة متصلة بقاعدة البيانات الحيّة. (التعليقات والنشرة لا تزال تجريبية في هذه المرحلة.)</p>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}