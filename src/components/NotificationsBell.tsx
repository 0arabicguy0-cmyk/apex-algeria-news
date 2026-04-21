import { Bell, BellOff, Check, Smartphone, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  useNotifications,
  requestNotificationPermission,
  getPermissionState,
} from "@/hooks/useNotifications";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { enablePush, isPushSubscribedLocally, pushSupported, disablePush } from "@/lib/push";

function timeAgo(iso: string, lang: "ar" | "en") {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const m = Math.floor(diff / 60_000);
  if (m < 1) return lang === "ar" ? "الآن" : "now";
  if (m < 60) return lang === "ar" ? `منذ ${m} د` : `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return lang === "ar" ? `منذ ${h} س` : `${h}h ago`;
  const d = Math.floor(h / 24);
  return lang === "ar" ? `منذ ${d} يوم` : `${d}d ago`;
}

export default function NotificationsBell() {
  const { items, unread, markAllRead, markRead, clearAll } = useNotifications();
  const { lang, isRTL } = useLanguage();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [perm, setPerm] = useState<NotificationPermission | "unsupported">(getPermissionState());
  const [pushOn, setPushOn] = useState(isPushSubscribedLocally());
  const [pushBusy, setPushBusy] = useState(false);
  const [lastSeenCount, setLastSeenCount] = useState(items.length);

  // Toast when a new notification arrives
  useEffect(() => {
    if (items.length > lastSeenCount) {
      const latest = items[0];
      toast({ title: latest.title, description: latest.body });
    }
    setLastSeenCount(items.length);
  }, [items.length, lastSeenCount, items, toast]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open]);

  const enable = async () => {
    const result = await requestNotificationPermission();
    setPerm(result);
    if (result === "granted") {
      toast({
        title: lang === "ar" ? "تم تفعيل التنبيهات" : "Notifications enabled",
        description: lang === "ar" ? "ستصلك أبرز الأخبار العاجلة" : "You'll receive breaking news alerts",
      });
    } else if (result === "denied") {
      toast({
        title: lang === "ar" ? "تم رفض التنبيهات" : "Notifications blocked",
        description: lang === "ar" ? "يمكنك تفعيلها من إعدادات المتصفح" : "Enable them from your browser settings",
      });
    }
  };

  const togglePush = async () => {
    setPushBusy(true);
    if (pushOn) {
      await disablePush();
      setPushOn(false);
      toast({ title: lang === "ar" ? "تم إيقاف إشعارات الجهاز" : "Device push disabled" });
    } else {
      const res = await enablePush();
      if (res.ok) {
        setPushOn(true);
        toast({
          title: lang === "ar" ? "تم تفعيل إشعارات الهاتف ✓" : "Phone push enabled ✓",
          description:
            lang === "ar"
              ? "ستصلك الأخبار العاجلة على هاتفك حتى عند إغلاق التطبيق"
              : "Breaking news will arrive even when the app is closed",
        });
      } else {
        toast({
          title: lang === "ar" ? "تعذّر التفعيل" : "Couldn't enable push",
          description:
            res.reason === "unsupported"
              ? lang === "ar"
                ? "غير مدعوم هنا. جرّب بعد نشر التطبيق وتثبيته على الهاتف."
                : "Not supported here. Try after publishing and installing the app."
              : res.reason,
          variant: "destructive",
        });
      }
    }
    setPushBusy(false);
  };

  const labels = {
    title: lang === "ar" ? "التنبيهات" : "Notifications",
    enable: lang === "ar" ? "تفعيل تنبيهات المتصفح" : "Enable browser alerts",
    enabled: lang === "ar" ? "التنبيهات مفعّلة ✓" : "Alerts enabled ✓",
    blocked: lang === "ar" ? "التنبيهات محظورة" : "Alerts blocked",
    unsupported: lang === "ar" ? "غير مدعوم في هذا المتصفح" : "Not supported in this browser",
    pushOn: lang === "ar" ? "إشعارات الهاتف مفعّلة — اضغط للإيقاف" : "Phone push ON — tap to disable",
    pushOff: lang === "ar" ? "تفعيل إشعارات الهاتف (حتى عند إغلاق التطبيق)" : "Enable phone push (works when app is closed)",
    markAll: lang === "ar" ? "تعليم الكل كمقروء" : "Mark all read",
    clear: lang === "ar" ? "مسح الكل" : "Clear all",
    empty: lang === "ar" ? "لا توجد تنبيهات" : "No notifications",
    aria: lang === "ar" ? "التنبيهات" : "Notifications",
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-full hover:bg-muted transition-colors text-foreground"
        aria-label={labels.aria}
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute top-1 -end-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className={`absolute top-full mt-2 ${isRTL ? "left-2" : "right-2"} z-50 w-[92vw] max-w-sm bg-background border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200`}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <span className="font-bold text-foreground">{labels.title}</span>
                {unread > 0 && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                    {unread}
                  </span>
                )}
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground" aria-label="close">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Permission row */}
            <div className="px-4 py-2.5 bg-muted/40 border-b border-border text-xs">
              {perm === "granted" ? (
                <span className="text-accent font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  {labels.enabled}
                </span>
              ) : perm === "denied" ? (
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <BellOff className="w-3.5 h-3.5" />
                  {labels.blocked}
                </span>
              ) : perm === "unsupported" ? (
                <span className="text-muted-foreground">{labels.unsupported}</span>
              ) : (
                <button
                  onClick={enable}
                  className="text-primary font-semibold hover:underline flex items-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  {labels.enable}
                </button>
              )}
            </div>

            {/* Phone push row */}
            {pushSupported() && (
              <div className="px-4 py-2.5 bg-primary/5 border-b border-border text-xs">
                <button
                  onClick={togglePush}
                  disabled={pushBusy}
                  className={`font-semibold flex items-center gap-1.5 ${pushOn ? "text-accent" : "text-primary"} hover:underline disabled:opacity-60`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  {pushOn ? labels.pushOn : labels.pushOff}
                </button>
              </div>
            )}

            {/* List */}
            <div className="max-h-[60vh] overflow-y-auto">
              {items.length === 0 ? (
                <div className="px-4 py-12 text-center text-muted-foreground text-sm">{labels.empty}</div>
              ) : (
                <ul>
                  {items.map((n) => {
                    const inner = (
                      <div className="flex gap-3 px-4 py-3 hover:bg-muted/60 transition-colors border-b border-border/60 last:border-0">
                        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.read ? "bg-transparent" : "bg-primary"}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-semibold text-sm text-foreground truncate">{n.title}</span>
                            <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo(n.createdAt, lang)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                        </div>
                      </div>
                    );
                    return (
                      <li key={n.id}>
                        {n.articleId ? (
                          <Link
                            to={`/article/${n.articleId}`}
                            onClick={() => {
                              markRead(n.id);
                              setOpen(false);
                            }}
                            className="block"
                          >
                            {inner}
                          </Link>
                        ) : (
                          <button onClick={() => markRead(n.id)} className="block w-full text-start">
                            {inner}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer actions */}
            {items.length > 0 && (
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/30">
                <button
                  onClick={markAllRead}
                  className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                  disabled={unread === 0}
                >
                  <Check className="w-3.5 h-3.5" />
                  {labels.markAll}
                </button>
                <button
                  onClick={clearAll}
                  className="text-xs font-medium text-muted-foreground hover:text-destructive flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {labels.clear}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
