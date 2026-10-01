import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import animatedLogo from "@/assets/max-news-animated.mp4";

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
    const shownThisSession =
      sessionStorage.getItem(SESSION_KEY) === "1";
    const isFirstVisit = !last;
    const inactiveLongEnough =
      last && now - last > INACTIVITY_MS;

    if (
      !shownThisSession &&
      (isFirstVisit || inactiveLongEnough)
    ) {
      setShow(true);
      sessionStorage.setItem(SESSION_KEY, "1");

      const t1 = setTimeout(
        () => setLeaving(true),
        1700,
      );

      const t2 = setTimeout(
        () => setShow(false),
        2100,
      );

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        localStorage.setItem(
          LAST_SEEN_KEY,
          String(Date.now()),
        );
      };
    }

    localStorage.setItem(
      LAST_SEEN_KEY,
      String(now),
    );

    const onUnload = () =>
      localStorage.setItem(
        LAST_SEEN_KEY,
        String(Date.now()),
      );

    window.addEventListener(
      "beforeunload",
      onUnload,
    );

    return () =>
      window.removeEventListener(
        "beforeunload",
        onUnload,
      );
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-background transition-opacity duration-500 ${
        leaving
          ? "pointer-events-none opacity-0"
          : "opacity-100"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
      aria-hidden={leaving}
    >
      <div className="flex flex-col items-center gap-5 animate-scale-in">
        <div className="relative h-52 w-52 overflow-hidden rounded-full border-4 border-primary-foreground shadow-2xl md:h-64 md:w-64">
          <video
            className="h-full w-full object-cover"
            src={animatedLogo}
            autoPlay
            muted
            playsInline
            preload="auto"
            aria-label="MAX NEWS"
          />
        </div>

        <p className="font-heading text-sm font-bold uppercase text-primary-foreground">
          {t("tagline")}
        </p>
      </div>
    </div>
  );
}