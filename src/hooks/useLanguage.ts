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
    instagram: "إنستغرام",
    dateLine: "الثلاثاء ١٥ أبريل ٢٠٢٦ — ١٧ شوال ١٤٤٧",
    nlBadge: "نشرة Apex News اليومية",
    nlTitle: "أبرز ما يحدث في الجزائر والعالم — في صندوق بريدك كل صباح",
    nlSub: "انضم إلى آلاف القراء. اشتراك مجاني، إلغاء في أي وقت.",
    nlPlaceholder: "بريدك الإلكتروني",
    nlSubscribe: "اشترك",
    nlToastTitle: "تم الاشتراك",
    nlToastDesc: "ستصلك أبرز الأخبار يومياً",
    mostRead: "الأكثر قراءة",
    noArticles: "لا توجد مقالات بعد",
    views: "مشاهدة",
    continueReading: "واصل القراءة",
    clear: "مسح",
    clearHistory: "مسح السجل",
    siteSections: "أقسام الموقع",
    followUs: "تابعونا",
    siteDescription: "مصدرك الأول للأخبار الجزائرية والعربية والدولية. تغطية شاملة وموضوعية على مدار الساعة.",
    rights: "© ٢٠٢٦ Apex News DZ — جميع الحقوق محفوظة",
    city: "الجزائر العاصمة",
    weatherDesc: "غائم جزئياً · رطوبة 64%",
    weatherUnit: "م",
    weekDays: ["الأربعاء", "الخميس", "الجمعة", "السبت"] as readonly string[],
    prayerTimes: "مواقيت الصلاة",
    hijriDate: "١٧ شوال ١٤٤٧",
    prayers: ["الفجر", "الظهر", "العصر", "المغرب", "العشاء"] as readonly string[],
    nextPrayer: "القادمة:",
    inHrsMins: "بعد ٢ ساعة و ١٤ دقيقة",
    latestNews: "آخر الأخبار",
    viewSection: "عرض القسم كاملاً ←",
    noMoreArticles: "لا توجد مقالات إضافية",
    noArticlesInCat: "لا توجد مقالات منشورة في هذا التصنيف بعد",
    // Search
    searchTitle: "البحث في الأخبار",
    searchPlaceholder: "ابحث عن خبر، موضوع، شخصية...",
    sortNewest: "الأحدث",
    sortOldest: "الأقدم",
    sortPopular: "الأكثر قراءة",
    searchBtn: "بحث",
    reset: "إعادة تعيين",
    resultsCount: "نتيجة",
    noResults: "لا توجد نتائج مطابقة",
    // Bookmarks
    bookmarksTitle: "المقالات المحفوظة",
    bookmarksCount: "مقال محفوظ على جهازك",
    noBookmarks: "لا توجد مقالات محفوظة",
    bookmarksHint: "احفظ مقالات لقراءتها لاحقاً بضغطة زر",
    browseNews: "تصفح الأخبار",
    // Contact
    contactTitle: "تواصل معنا",
    contactSub: "نسعد بتلقي ملاحظاتكم واقتراحاتكم",
    contactSuccess: "شكراً، تم إرسال رسالتك",
    contactSuccessSub: "سنعود إليك في أقرب وقت",
    fName: "الاسم",
    fNamePh: "اسمك الكامل",
    fEmail: "البريد الإلكتروني",
    fMessage: "الرسالة",
    fMessagePh: "اكتب رسالتك هنا...",
    send: "إرسال",
    // Topic
    backHome: "← الرئيسية",
    topicCount: "مقال في هذا القسم",
    loading: "جارٍ التحميل...",
    noArticlesTopic: "لا توجد مقالات في هذا القسم بعد",
    moreFrom: "المزيد من",
    // Article
    articleNotFound: "المقال غير موجود",
    backToHome: "العودة للرئيسية",
    readDuration: "قراءة",
    relatedArticles: "مقالات ذات صلة",
    // Admin
    adminPanel: "لوحة التحكم",
    adminDemoMode: "Apex News DZ — وضع تجريبي",
    password: "كلمة المرور",
    signingIn: "جارٍ الدخول...",
    signIn: "دخول",
    signInError: "خطأ في الدخول",
    adminHint: "أي بريد + كلمة المرور:",
    role: "الدور",
    roleJournalist: "صحفي",
    roleEditor: "محرر",
    roleAdmin: "مدير",
    statusDraft: "مسودة",
    statusInReview: "قيد المراجعة",
    statusScheduled: "مجدول",
    statusPublished: "منشور",
    submitForReview: "إرسال للمراجعة",
    approveAndPublish: "اعتماد ونشر",
    sendBackToDraft: "إرجاع كمسودة",
    schedulePublish: "جدولة النشر",
    scheduledFor: "مجدول لـ",
    saveDraft: "حفظ كمسودة",
    publishNow: "نشر الآن",
    permissionDenied: "ليست لديك صلاحية لهذا الإجراء",
    workflow: "سير العمل",
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
    instagram: "Instagram",
    dateLine: "Tuesday, April 15, 2026",
    nlBadge: "Apex News Daily Briefing",
    nlTitle: "Top stories from Algeria & the world — in your inbox every morning",
    nlSub: "Join thousands of readers. Free, unsubscribe anytime.",
    nlPlaceholder: "Your email address",
    nlSubscribe: "Subscribe",
    nlToastTitle: "Subscribed",
    nlToastDesc: "You'll receive top stories daily",
    mostRead: "Most Read",
    noArticles: "No articles yet",
    views: "views",
    continueReading: "Continue reading",
    clear: "Clear",
    clearHistory: "Clear history",
    siteSections: "Sections",
    followUs: "Follow us",
    siteDescription: "Your primary source for Algerian, Arab, and international news. Comprehensive 24/7 coverage.",
    rights: "© 2026 Apex News DZ — All rights reserved",
    city: "Algiers",
    weatherDesc: "Partly cloudy · 64% humidity",
    weatherUnit: "C",
    weekDays: ["Wed", "Thu", "Fri", "Sat"] as readonly string[],
    prayerTimes: "Prayer Times",
    hijriDate: "17 Shawwal 1447",
    prayers: ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as readonly string[],
    nextPrayer: "Next:",
    inHrsMins: "in 2h 14m",
    latestNews: "Latest news",
    viewSection: "View full section →",
    noMoreArticles: "No additional articles",
    noArticlesInCat: "No articles published in this category yet",
    searchTitle: "Search the news",
    searchPlaceholder: "Search for a story, topic, person...",
    sortNewest: "Newest",
    sortOldest: "Oldest",
    sortPopular: "Most read",
    searchBtn: "Search",
    reset: "Reset",
    resultsCount: "results",
    noResults: "No matching results",
    bookmarksTitle: "Saved articles",
    bookmarksCount: "saved on your device",
    noBookmarks: "No saved articles",
    bookmarksHint: "Save articles to read later with one tap",
    browseNews: "Browse the news",
    contactTitle: "Contact us",
    contactSub: "We'd love to hear your feedback and suggestions",
    contactSuccess: "Thanks, your message has been sent",
    contactSuccessSub: "We'll get back to you shortly",
    fName: "Name",
    fNamePh: "Your full name",
    fEmail: "Email",
    fMessage: "Message",
    fMessagePh: "Write your message here...",
    send: "Send",
    backHome: "← Home",
    topicCount: "articles in this section",
    loading: "Loading...",
    noArticlesTopic: "No articles in this section yet",
    moreFrom: "More from",
    articleNotFound: "Article not found",
    backToHome: "Back to home",
    readDuration: "read",
    relatedArticles: "Related articles",
    adminPanel: "Admin panel",
    adminDemoMode: "Apex News DZ — demo mode",
    password: "Password",
    signingIn: "Signing in...",
    signIn: "Sign in",
    signInError: "Sign-in error",
    adminHint: "Any email + password:",
  },
} as const;

type Dict = typeof dict["ar"];
type StringKeys = { [K in keyof Dict]: Dict[K] extends string ? K : never }[keyof Dict];
type ArrayKeys = { [K in keyof Dict]: Dict[K] extends readonly string[] ? K : never }[keyof Dict];
export type TKey = StringKeys;

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

  const t = useCallback((k: TKey): string => dict[lang][k] as string, [lang]);
  const tArr = useCallback((k: ArrayKeys): readonly string[] => dict[lang][k] as readonly string[], [lang]);

  return { lang, setLang, toggle, t, tArr, isRTL: lang === "ar" };
}
