import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { feedbackApi, subscribe } from "@/lib/mockStore";
import { FileText, MessageSquare, LogOut, Megaphone, MessageCircle, Mail, Menu, X, Bell, AlertCircle, Home, BadgeDollarSign, PlusCircle, TrendingUp, Eye, Clock, ArrowUpRight, Settings } from "lucide-react";
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
    { to: "/admin/feedback", icon: MessageSquare, label: "الرسائل", badge: stats.unread },
    { to: "/admin/push", icon: Bell, label: "الإشعارات الفورية" },
    { to: "/admin/corrections", icon: AlertCircle, label: "سجل التصحيحات" },
    { to: "/admin/ads", icon: BadgeDollarSign, label: "الإعلانات", badge: stats.pendingAds },
    {
      to: "/admin/settings",
      icon: Settings,
      label: "الإعدادات",
    }
  ];

  const NavList = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="space-y-1 flex-1">
      {navItems.map((item) => {
        const active = location.pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
              active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <item.icon className="w-4 h-4" />
              {item.label}
            </span>
            {item.badge ? (
              <Badge variant={active ? "secondary" : "destructive"} className="h-5 min-w-5 px-1.5 text-[10px]">
                {item.badge}
              </Badge>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );

  const SidebarInner = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex flex-col h-full p-4">
      <div className="mb-6">
        <h2 className="font-bold text-lg text-foreground">لوحة التحكم</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Apex News DZ</p>
      </div>
      <NavList onNavigate={onNavigate} />

      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors mb-2"
      >
        <Home className="w-4 h-4" />
        العودة للموقع
      </Link>

      <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate("/admin/login"); }} className="justify-start gap-2 text-muted-foreground hover:text-destructive">
        <LogOut className="w-4 h-4" />
        خروج
      </Button>
    </div>
  );

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "الآن";
    if (mins < 60) return `منذ ${mins} د`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `منذ ${hrs} س`;
    const days = Math.floor(hrs / 24);
    return `منذ ${days} يوم`;
  };

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
          <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">مرحبًا بك 👋</h1>
                <p className="text-sm text-muted-foreground mt-1">نظرة سريعة على حالة الموقع اليوم</p>
              </div>
              <Link to="/admin/articles/new">
                <Button className="gap-2"><PlusCircle className="w-4 h-4" /> مقال جديد</Button>
              </Link>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {[
                { label: "إجمالي المقالات", value: stats.articles, icon: FileText, gradient: "from-blue-500/15 to-blue-500/5", color: "text-blue-600 dark:text-blue-400" },
                { label: "منشورة", value: stats.published, icon: TrendingUp, gradient: "from-green-500/15 to-green-500/5", color: "text-green-600 dark:text-green-400" },
                { label: "إجمالي المشاهدات", value: stats.views.toLocaleString("ar"), icon: Eye, gradient: "from-amber-500/15 to-amber-500/5", color: "text-amber-600 dark:text-amber-400" },
                { label: "إعلانات بانتظار الموافقة", value: stats.pendingAds, icon: BadgeDollarSign, gradient: "from-rose-500/15 to-rose-500/5", color: "text-rose-600 dark:text-rose-400" },
              ].map((s) => (
                <div key={s.label} className={`relative overflow-hidden bg-gradient-to-br ${s.gradient} border border-border rounded-xl p-4 hover:shadow-md transition-shadow`}>
                  <div className={`w-9 h-9 rounded-lg bg-background/80 flex items-center justify-center mb-3 ${s.color}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
              {/* Quick actions */}
              <div className="bg-card border border-border rounded-xl p-4 lg:col-span-1">
                <h3 className="font-bold text-foreground mb-3 text-sm">إجراءات سريعة</h3>
                <div className="space-y-2">
                  {[
                    { to: "/admin/articles/new", icon: PlusCircle, label: "نشر مقال" },
                    { to: "/admin/breaking", icon: Megaphone, label: "خبر عاجل" },
                    { to: "/admin/push", icon: Bell, label: "إرسال إشعار" },
                    { to: "/admin/ads", icon: BadgeDollarSign, label: "مراجعة الإعلانات", badge: stats.pendingAds },
                  ].map((a) => (
                    <Link key={a.to} to={a.to} className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors group">
                      <span className="flex items-center gap-2 text-sm text-foreground">
                        <a.icon className="w-4 h-4 text-primary" />
                        {a.label}
                      </span>
                      <span className="flex items-center gap-1.5">
                        {a.badge ? <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">{a.badge}</Badge> : null}
                        <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent articles */}
              <div className="bg-card border border-border rounded-xl p-4 lg:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-foreground text-sm">أحدث المقالات</h3>
                  <Link to="/admin/articles" className="text-xs text-primary hover:underline">عرض الكل</Link>
                </div>
                {recentArticles.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">لا توجد مقالات بعد</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {recentArticles.map((a) => (
                      <li key={a.id}>
                        <Link to={`/admin/articles/${a.id}`} className="flex items-center justify-between gap-3 py-3 group">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{a.title}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>{timeAgo(a.created_at)}</span>
                              <span>·</span>
                              <Eye className="w-3 h-3" />
                              <span>{a.view_count ?? 0}</span>
                            </div>
                          </div>
                          <Badge variant={a.status === "published" ? "default" : "outline"} className="text-[10px] flex-shrink-0">
                            {a.status === "published" ? "منشور" : "مسودة"}
                          </Badge>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Secondary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "مسودات", value: stats.drafts },
                { label: "إجمالي الرسائل", value: stats.feedback },
                { label: "رسائل غير مقروءة", value: stats.unread },
                { label: "إعلانات معلّقة", value: stats.pendingAds },
              ].map((s) => (
                <div key={s.label} className="bg-muted/40 border border-border rounded-lg p-3">
                  <p className="text-lg font-bold text-foreground">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
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