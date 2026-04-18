import { Cloud, Sun, MapPin, Moon } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const times = ["05:12", "12:48", "16:22", "19:05", "20:31"];

export default function WeatherPrayerWidget() {
  const { t, tArr } = useLanguage();
  const nextIdx = 2;
  const prayers = tArr("prayers");
  const days = tArr("weekDays");

  return (
    <section className="container py-4">
      <div className="grid sm:grid-cols-2 gap-3 animate-float-in">
        {/* Weather */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/90 to-primary text-primary-foreground p-4 shadow-md">
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 text-xs opacity-80">
                <MapPin className="w-3 h-3" />
                <span>{t("city")}</span>
              </div>
              <div className="text-3xl font-bold mt-1">
                22°<span className="text-base font-normal opacity-80">{t("weatherUnit")}</span>
              </div>
              <div className="text-xs opacity-90">{t("weatherDesc")}</div>
            </div>
            <div className="relative">
              <Sun className="w-12 h-12 opacity-90" />
              <Cloud className="w-8 h-8 absolute -bottom-1 -right-2 text-white/80" />
            </div>
          </div>
          <div className="relative mt-3 grid grid-cols-4 gap-2 text-center text-xs">
            {days.map((d, i) => (
              <div key={d} className="bg-white/10 rounded-lg py-1.5">
                <div className="opacity-80">{d}</div>
                <div className="font-bold">{[24, 23, 26, 25][i]}°</div>
              </div>
            ))}
          </div>
        </div>

        {/* Prayer times */}
        <div className="rounded-xl bg-card border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-accent" />
              <span className="font-bold text-foreground text-sm">{t("prayerTimes")}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">{t("hijriDate")}</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {prayers.map((p, i) => (
              <div
                key={p}
                className={`text-center rounded-lg py-2 transition-all ${
                  i === nextIdx
                    ? "bg-accent text-accent-foreground shadow-sm scale-[1.05]"
                    : "bg-muted text-foreground"
                }`}
              >
                <div className="text-[11px] font-medium">{p}</div>
                <div className="text-xs font-bold mt-0.5 tabular-nums">{times[i]}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground text-center">
            {t("nextPrayer")} <span className="font-bold text-accent">{prayers[nextIdx]}</span> {t("inHrsMins")}
          </div>
        </div>
      </div>
    </section>
  );
}
