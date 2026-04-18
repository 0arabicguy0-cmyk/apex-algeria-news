import { useEffect, useState, useCallback } from "react";

export type Lang = "ar" | "en";
const KEY = "apex-lang";

const dict = {
  ar: {
    siteName: "Apex News",
    siteSub: "الجزائر",
    tagline: "أخبار الجزائر والعالم — لحظة بلحظة",
    menu: "القائمة",
    search: "بحث",
    toggleTheme: "تبديل الوضع",
    home: "الرئيسية",
    sections: "أقسام",
    bookmarks: "محفوظ",
    contact: "تواصل",
    language: "اللغة",
    switchTo: "English",
    facebook: "فيسبوك",
    twitter: "تويتر",
    youtube: "يوتيوب",
    dateLine: "الثلاثاء ١٥ أبريل ٢٠٢٦ — ١٧ شوال ١٤٤٧",
  },
  en: {
    siteName: "Apex News",
    siteSub: "Algeria",
    tagline: "Algeria & world news — moment by moment",
    menu: "Menu",
    search: "Search",
    toggleTheme: "Toggle theme",
    home: "Home",
    sections: "Topics",
    bookmarks: "Saved",
    contact: "Contact",
    language: "Language",
    switchTo: "العربية",
    facebook: "Facebook",
    twitter: "Twitter",
    youtube: "YouTube",
    dateLine: "Tuesday, April 15, 2026",
  },
} as const;

export type TKey = keyof typeof dict["ar"];

let listeners: Array<(l: Lang) => void> = [];
const getInitial = (): Lang => (localStorage.getItem(KEY) as Lang) || "ar";

const apply = (l: Lang) => {
  document.documentElement.lang = l;
  document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
};

if (typeof window !== "undefined") apply(getInitial());

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>(getInitial);

  useEffect(() => {
    const fn = (l: Lang) => setLangState(l);
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((x) => x !== fn);
    };
  }, []);

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem(KEY, l);
    apply(l);
    listeners.forEach((fn) => fn(l));
  }, []);

  const toggle = useCallback(() => setLang(lang === "ar" ? "en" : "ar"), [lang, setLang]);

  const t = useCallback((k: TKey) => dict[lang][k], [lang]);

  return { lang, setLang, toggle, t, isRTL: lang === "ar" };
}
