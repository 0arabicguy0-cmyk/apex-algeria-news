import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, MapPin, Moon, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

type Coords = { lat: number; lon: number; city?: string };

type WeatherState = {
  tempC: number;
  code: number;
  daily: { day: string; max: number; code: number }[];
} | null;

type PrayerState = {
  timings: Record<string, string>; // HH:mm
  hijri: string;
} | null;

const ALGIERS: Coords = { lat: 36.7538, lon: 3.0588, city: "الجزائر" };

const PRAYER_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

function weatherIcon(code: number, className = "w-12 h-12 opacity-90") {
  if ([0, 1].includes(code)) return <Sun className={className} />;
  if ([2, 3, 45, 48].includes(code)) return <Cloud className={className} />;
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain className={className} />;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow className={className} />;
  if ([95, 96, 99].includes(code)) return <CloudLightning className={className} />;
  return <Cloud className={className} />;
}

function weatherDescAr(code: number) {
  if ([0].includes(code)) return "صافي";
  if ([1, 2].includes(code)) return "غائم جزئياً";
  if ([3].includes(code)) return "غائم";
  if ([45, 48].includes(code)) return "ضباب";
  if ([51, 53, 55].includes(code)) return "رذاذ";
  if ([61, 63, 65, 80, 81, 82].includes(code)) return "أمطار";
  if ([71, 73, 75, 85, 86].includes(code)) return "ثلوج";
  if ([95, 96, 99].includes(code)) return "عواصف رعدية";
  return "—";
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function getCoords(): Promise<Coords> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return resolve(ALGIERS);
    const timer = setTimeout(() => resolve(ALGIERS), 4000);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      () => {
        clearTimeout(timer);
        resolve(ALGIERS);
      },
      { maximumAge: 600_000, timeout: 4000 },
    );
  });
}

async function reverseCity(lat: number, lon: number): Promise<string | undefined> {
  try {
    const r = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=ar`,
    );
    if (!r.ok) return;
    const j = await r.json();
    return j.city || j.locality || j.principalSubdivision;
  } catch {
    return;
  }
}

export default function WeatherPrayerWidget() {
  const { t, tArr, lang } = useLanguage();
  const prayers = tArr("prayers");
  const days = tArr("weekDays");

  const [coords, setCoords] = useState<Coords | null>(null);
  const [weather, setWeather] = useState<WeatherState>(null);
  const [prayer, setPrayer] = useState<PrayerState>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Resolve location
  useEffect(() => {
    let active = true;
    (async () => {
      const c = await getCoords();
      if (!active) return;
      if (!c.city) {
        const city = await reverseCity(c.lat, c.lon);
        if (!active) return;
        setCoords({ ...c, city });
      } else {
        setCoords(c);
      }
    })();
    return () => { active = false; };
  }, []);

  // Weather
  useEffect(() => {
    if (!coords) return;
    let active = true;
    (async () => {
      try {
        const r = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}` +
            `&current_weather=true&daily=temperature_2m_max,weathercode&timezone=auto&forecast_days=4`,
        );
        if (!r.ok) return;
        const j = await r.json();
        if (!active) return;
        const daily = (j.daily?.time as string[]).map((iso, i) => {
          const d = new Date(iso);
          return {
            day: days[d.getDay() % days.length] ?? "",
            max: Math.round(j.daily.temperature_2m_max[i]),
            code: j.daily.weathercode[i] as number,
          };
        });
        setWeather({
          tempC: Math.round(j.current_weather.temperature),
          code: j.current_weather.weathercode as number,
          daily,
        });
      } catch {}
    })();
    return () => { active = false; };
  }, [coords, days]);

  // Prayer times — refetch when local date changes
  const dateKey = now.toDateString();
  useEffect(() => {
    if (!coords) return;
    let active = true;
    (async () => {
      try {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();
        const r = await fetch(
          `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}` +
            `?latitude=${coords.lat}&longitude=${coords.lon}&method=3`,
        );
        if (!r.ok) return;
        const j = await r.json();
        if (!active) return;
        const t = j.data.timings as Record<string, string>;
        const cleaned: Record<string, string> = {};
        PRAYER_KEYS.forEach((k) => {
          cleaned[k] = (t[k] || "").slice(0, 5);
        });
        const h = j.data.date.hijri;
        setPrayer({
          timings: cleaned,
          hijri: `${h.day} ${h.month.ar || h.month.en} ${h.year}هـ`,
        });
      } catch {}
    })();
    return () => { active = false; };
  }, [coords, dateKey]);

  // Next prayer index + countdown
  const { nextIdx, countdown } = useMemo(() => {
    if (!prayer) return { nextIdx: -1, countdown: "" };
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const mins = PRAYER_KEYS.map((k) => toMinutes(prayer.timings[k] || "00:00"));
    let idx = mins.findIndex((m) => m > nowMin);
    let diff: number;
    if (idx === -1) {
      idx = 0;
      diff = 24 * 60 - nowMin + mins[0];
    } else {
      diff = mins[idx] - nowMin;
    }
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    const cd = lang === "ar"
      ? `${h > 0 ? `${h} س ` : ""}${m} د`
      : `${h > 0 ? `${h}h ` : ""}${m}m`;
    return { nextIdx: idx, countdown: cd };
  }, [prayer, now, lang]);

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
                <span>{coords?.city || t("city")}</span>
              </div>
              <div className="text-3xl font-bold mt-1">
                {weather ? `${weather.tempC}°` : "—"}
                <span className="text-base font-normal opacity-80">{t("weatherUnit")}</span>
              </div>
              <div className="text-xs opacity-90">
                {weather ? weatherDescAr(weather.code) : t("weatherDesc")}
              </div>
            </div>
            <div className="relative">
              {weather ? weatherIcon(weather.code) : <Loader2 className="w-10 h-10 animate-spin opacity-80" />}
            </div>
          </div>
          <div className="relative mt-3 grid grid-cols-4 gap-2 text-center text-xs">
            {(weather?.daily ?? Array.from({ length: 4 }).map((_, i) => ({ day: days[i] ?? "", max: 0, code: 0 }))).slice(0, 4).map((d, i) => (
              <div key={i} className="bg-white/10 rounded-lg py-1.5">
                <div className="opacity-80">{d.day}</div>
                <div className="font-bold">{weather ? `${d.max}°` : "—"}</div>
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
            <span className="text-[10px] text-muted-foreground">{prayer?.hijri ?? t("hijriDate")}</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {prayers.map((p, i) => {
              const time = prayer?.timings[PRAYER_KEYS[i]] ?? "—";
              const isNext = i === nextIdx;
              return (
                <div
                  key={p}
                  className={`text-center rounded-lg py-2 transition-all ${
                    isNext
                      ? "bg-accent text-accent-foreground shadow-sm scale-[1.05]"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <div className="text-[11px] font-medium">{p}</div>
                  <div className="text-xs font-bold mt-0.5 tabular-nums">{time}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground text-center">
            {prayer && nextIdx >= 0 ? (
              <>
                {t("nextPrayer")} <span className="font-bold text-accent">{prayers[nextIdx]}</span>{" "}
                {lang === "ar" ? `بعد ${countdown}` : `in ${countdown}`}
              </>
            ) : (
              <span className="opacity-70">…</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
