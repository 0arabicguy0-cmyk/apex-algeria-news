import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

const LAST_SEEN_KEY = "apex-last-seen";
const SESSION_KEY = "apex-splash-shown";
const INACTIVITY_MS = 30 * 60 * 1000; // 30 minutes

export default function SplashScreen() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    const now = Date.now();
    const last = Number(localStorage.getItem(LAST_SEEN_KEY) || 0);
    const shownThisSession = sessionStorage.getItem(SESSION_KEY) === "1";
    const isFirstVisit = !last;
    const inactiveLongEnough = last && now - last > INACTIVITY_MS;

    if (!shownThisSession && (isFirstVisit || inactiveLongEnough)) {
      setShow(true);
      sessionStorage.setItem(SESSION_KEY, "1");
      const t1 = setTimeout(() => setLeaving(true), 1700);
      const t2 = setTimeout(() => setShow(false), 2100);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        localStorage.setItem(LAST_SEEN_KEY, String(Date.now()));
      };
    }

    localStorage.setItem(LAST_SEEN_KEY, String(now));
    const onUnload = () => localStorage.setItem(LAST_SEEN_KEY, String(Date.now()));
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-background transition-opacity duration-500 ${
        leaving ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
      aria-hidden={leaving}
    >
      <div className="flex flex-col items-center gap-5 animate-scale-in">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-2xl animate-pulse" />
          <div className="relative w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-2xl">
            <span className="text-primary-foreground font-bold text-5xl leading-none">A</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <h1 className="font-bold text-2xl text-foreground tracking-tight">{t("siteName")}</h1>
          <span className="text-xs text-muted-foreground">{t("siteSub")}</span>
        </div>

        <div
          className="text-sm font-medium bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--muted-foreground) / 0.4) 0%, hsl(var(--foreground)) 50%, hsl(var(--muted-foreground) / 0.4) 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.6s linear infinite",
          }}
        >
          {t("tagline")}
        </div>
      </div>
    </div>
  );
}
