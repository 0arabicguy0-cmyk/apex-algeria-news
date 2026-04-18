// In-memory mock backend. State persists in localStorage so admin edits survive refresh.
import heroImg from "@/assets/hero-algiers.jpg";
import politicsImg from "@/assets/news-politics.jpg";
import techImg from "@/assets/news-tech.jpg";
import sportsImg from "@/assets/news-sports.jpg";
import economyImg from "@/assets/news-economy.jpg";
import cultureImg from "@/assets/news-culture.jpg";

export interface MockArticle {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  image_url: string | null;
  category: string;
  category_key: string;
  author: string;
  status: "draft" | "published";
  is_breaking: boolean;
  is_featured: boolean;
  tags: string[];
  view_count: number;
  created_at: string;
  published_at: string | null;
}

export interface MockComment {
  id: string;
  article_id: string;
  name: string;
  message: string;
  status: "pending" | "approved" | "hidden";
  created_at: string;
}

export interface MockReaction { id: string; article_id: string; reaction: string; created_at: string; }
export interface MockBreakingItem { id: string; text: string; is_active: boolean; display_order: number; link_article_id: string | null; created_at: string; }
export interface MockSubscriber { id: string; email: string; created_at: string; }
export interface MockFeedback { id: string; name: string; email: string; message: string; is_read: boolean; created_at: string; }

interface State {
  articles: MockArticle[];
  comments: MockComment[];
  reactions: MockReaction[];
  breaking: MockBreakingItem[];
  subscribers: MockSubscriber[];
  feedback: MockFeedback[];
}

const KEY = "mockStore_v1";
const uid = () => Math.random().toString(36).slice(2, 11);
const now = () => new Date().toISOString();
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();

const seed = (): State => ({
  articles: [
    { id: "1", title: "الجزائر تطلق مشروعاً ضخماً للطاقة المتجددة بقدرة ٥ غيغاواط", excerpt: "أعلنت الحكومة الجزائرية عن إطلاق أكبر مشروع للطاقة الشمسية في إفريقيا.", body: "أعلنت الحكومة الجزائرية اليوم عن إطلاق أكبر مشروع للطاقة الشمسية في القارة الإفريقية، بقدرة إنتاجية تبلغ ٥ غيغاواط.\n\n## الأهداف الاستراتيجية\n\nيأتي هذا المشروع في إطار استراتيجية التنويع الاقتصادي للتقليل من الاعتماد على المحروقات.\n\nوأوضح وزير الطاقة أن المشروع سيُنجز على ثلاث مراحل خلال السنوات الخمس المقبلة، وسيوفر أكثر من ٢٠ ألف فرصة عمل.\n\n## الإمكانات الطبيعية\n\nتمتلك الجزائر واحداً من أعلى معدلات الإشعاع الشمسي في العالم، مما يجعلها موقعاً مثالياً.", image_url: heroImg, category: "الجزائر", category_key: "algeria", author: "محمد بن علي", status: "published", is_breaking: true, is_featured: true, tags: ["طاقة", "الجزائر", "اقتصاد"], view_count: 1240, created_at: hoursAgo(2), published_at: hoursAgo(2) },
    { id: "2", title: "البرلمان يصادق على قانون الاستثمار الجديد لجذب رؤوس الأموال الأجنبية", excerpt: "في جلسة تاريخية، صادق البرلمان على قانون الاستثمار المعدّل.", body: "في جلسة تاريخية، صادق البرلمان الجزائري على قانون الاستثمار المعدّل الذي يمنح تسهيلات غير مسبوقة للمستثمرين.", image_url: politicsImg, category: "اقتصاد", category_key: "economy", author: "فاطمة الزهراء", status: "published", is_breaking: false, is_featured: false, tags: ["اقتصاد", "استثمار"], view_count: 870, created_at: hoursAgo(3), published_at: hoursAgo(3) },
    { id: "3", title: "الجزائر تحتضن أكبر مؤتمر تكنولوجي في شمال إفريقيا", excerpt: "تستعد العاصمة لاحتضان مؤتمر التحول الرقمي بمشاركة ٥٠٠ شركة.", body: "تستعد العاصمة الجزائرية لاحتضان مؤتمر التحول الرقمي الذي يجمع أكثر من ٥٠٠ شركة تقنية من حول العالم.", image_url: techImg, category: "تكنولوجيا", category_key: "tech", author: "أحمد كريم", status: "published", is_breaking: false, is_featured: false, tags: ["تكنولوجيا", "رقمنة"], view_count: 540, created_at: hoursAgo(5), published_at: hoursAgo(5) },
    { id: "4", title: "المنتخب الوطني يحقق فوزاً تاريخياً في تصفيات كأس العالم ٢٠٢٦", excerpt: "حقق الخضر فوزاً ساحقاً بثلاثية نظيفة في مباراة مصيرية.", body: "حقق المنتخب الوطني الجزائري فوزاً ساحقاً بثلاثة أهداف مقابل لا شيء في المباراة المصيرية.", image_url: sportsImg, category: "رياضة", category_key: "sports", author: "ياسين حداد", status: "published", is_breaking: false, is_featured: false, tags: ["رياضة", "كرة القدم"], view_count: 2310, created_at: hoursAgo(7), published_at: hoursAgo(7) },
    { id: "5", title: "ارتفاع احتياطي الصرف الأجنبي للجزائر إلى مستويات قياسية", excerpt: "كشف بنك الجزائر عن ارتفاع ملحوظ في احتياطيات النقد الأجنبي.", body: "كشف بنك الجزائر عن ارتفاع ملحوظ في احتياطيات النقد الأجنبي للبلاد، حيث بلغت مستويات لم تشهدها منذ عدة سنوات.", image_url: economyImg, category: "اقتصاد", category_key: "economy", author: "سارة مقراني", status: "published", is_breaking: false, is_featured: false, tags: ["اقتصاد", "بنك"], view_count: 410, created_at: hoursAgo(10), published_at: hoursAgo(10) },
    { id: "6", title: "مهرجان تيمقاد الدولي يعود بنسخته الجديدة بحضور فنانين عالميين", excerpt: "يعود مهرجان تيمقاد الدولي للموسيقى بنسخة استثنائية.", body: "يعود مهرجان تيمقاد الدولي للموسيقى بنسخة استثنائية هذا العام، حيث يستضيف المهرجان فنانين من أكثر من ٢٠ دولة.", image_url: cultureImg, category: "ثقافة", category_key: "culture", author: "نادية بوعزيز", status: "published", is_breaking: false, is_featured: false, tags: ["ثقافة", "موسيقى"], view_count: 290, created_at: hoursAgo(24), published_at: hoursAgo(24) },
  ],
  comments: [
    { id: uid(), article_id: "1", name: "أحمد", message: "خبر رائع، نتمنى التوفيق لهذا المشروع!", status: "approved", created_at: hoursAgo(1) },
    { id: uid(), article_id: "1", name: "ليلى", message: "أخيراً نتجه نحو الطاقة النظيفة.", status: "approved", created_at: hoursAgo(0.5) },
  ],
  reactions: [
    { id: uid(), article_id: "1", reaction: "like", created_at: hoursAgo(1) },
    { id: uid(), article_id: "1", reaction: "love", created_at: hoursAgo(0.5) },
    { id: uid(), article_id: "1", reaction: "insightful", created_at: hoursAgo(0.3) },
  ],
  breaking: [
    { id: uid(), text: "عاجل: الجزائر تطلق مشروعاً ضخماً للطاقة المتجددة بقدرة ٥ غيغاواط", is_active: true, display_order: 0, link_article_id: "1", created_at: now() },
    { id: uid(), text: "البرلمان يصادق على قانون الاستثمار الجديد", is_active: true, display_order: 1, link_article_id: "2", created_at: now() },
  ],
  subscribers: [],
  feedback: [],
});

let state: State = (() => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return seed();
})();

const listeners = new Set<() => void>();
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  listeners.forEach((l) => l());
}
export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}
export function resetMock() {
  state = seed();
  persist();
}

// --- Articles ---
export const articlesApi = {
  list(opts?: { categoryKey?: string; limit?: number; publishedOnly?: boolean }) {
    let arr = [...state.articles];
    if (opts?.publishedOnly !== false) arr = arr.filter((a) => a.status === "published");
    if (opts?.categoryKey && opts.categoryKey !== "all") arr = arr.filter((a) => a.category_key === opts.categoryKey);
    arr.sort((a, b) => (b.published_at ?? b.created_at).localeCompare(a.published_at ?? a.created_at));
    return opts?.limit ? arr.slice(0, opts.limit) : arr;
  },
  all() { return [...state.articles].sort((a, b) => b.created_at.localeCompare(a.created_at)); },
  get(id: string) { return state.articles.find((a) => a.id === id) ?? null; },
  trending(limit = 5) {
    return [...state.articles].filter((a) => a.status === "published").sort((a, b) => b.view_count - a.view_count).slice(0, limit);
  },
  related(article: MockArticle, limit = 4) {
    const others = state.articles.filter((a) => a.id !== article.id && a.status === "published");
    const byTag = others.filter((a) => a.tags.some((t) => article.tags.includes(t)));
    const out = [...byTag];
    for (const a of others) {
      if (out.length >= limit) break;
      if (a.category_key === article.category_key && !out.includes(a)) out.push(a);
    }
    return out.slice(0, limit);
  },
  search(opts: { q?: string; cat?: string; tag?: string; sort?: "newest" | "oldest" | "popular" }) {
    let arr = state.articles.filter((a) => a.status === "published");
    if (opts.q) {
      const q = opts.q.toLowerCase();
      arr = arr.filter((a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.body.toLowerCase().includes(q));
    }
    if (opts.cat && opts.cat !== "all") arr = arr.filter((a) => a.category_key === opts.cat);
    if (opts.tag) arr = arr.filter((a) => a.tags.includes(opts.tag!));
    if (opts.sort === "popular") arr.sort((a, b) => b.view_count - a.view_count);
    else if (opts.sort === "oldest") arr.sort((a, b) => (a.published_at ?? a.created_at).localeCompare(b.published_at ?? b.created_at));
    else arr.sort((a, b) => (b.published_at ?? b.created_at).localeCompare(a.published_at ?? a.created_at));
    return arr;
  },
  byIds(ids: string[]) { return state.articles.filter((a) => ids.includes(a.id)); },
  create(data: Omit<MockArticle, "id" | "created_at" | "view_count">) {
    const a: MockArticle = { ...data, id: uid(), created_at: now(), view_count: 0 };
    state.articles.unshift(a);
    persist();
    return a;
  },
  update(id: string, data: Partial<MockArticle>) {
    const i = state.articles.findIndex((a) => a.id === id);
    if (i >= 0) { state.articles[i] = { ...state.articles[i], ...data }; persist(); }
  },
  remove(id: string) {
    state.articles = state.articles.filter((a) => a.id !== id);
    state.comments = state.comments.filter((c) => c.article_id !== id);
    state.reactions = state.reactions.filter((r) => r.article_id !== id);
    persist();
  },
  incrementView(id: string) {
    const a = state.articles.find((x) => x.id === id);
    if (a) { a.view_count += 1; persist(); }
  },
};

// --- Comments ---
export const commentsApi = {
  forArticle(articleId: string, status?: "approved" | "pending" | "hidden") {
    let arr = state.comments.filter((c) => c.article_id === articleId);
    if (status) arr = arr.filter((c) => c.status === status);
    return arr.sort((a, b) => b.created_at.localeCompare(a.created_at));
  },
  all(filter?: "pending" | "approved" | "hidden") {
    let arr = [...state.comments];
    if (filter) arr = arr.filter((c) => c.status === filter);
    return arr.sort((a, b) => b.created_at.localeCompare(a.created_at));
  },
  add(c: Omit<MockComment, "id" | "created_at" | "status">) {
    state.comments.unshift({ ...c, id: uid(), created_at: now(), status: "pending" });
    persist();
  },
  setStatus(id: string, status: MockComment["status"]) {
    const c = state.comments.find((x) => x.id === id);
    if (c) { c.status = status; persist(); }
  },
  remove(id: string) { state.comments = state.comments.filter((c) => c.id !== id); persist(); },
};

// --- Reactions ---
export const reactionsApi = {
  forArticle(articleId: string) { return state.reactions.filter((r) => r.article_id === articleId); },
  add(articleId: string, reaction: string) {
    state.reactions.push({ id: uid(), article_id: articleId, reaction, created_at: now() });
    persist();
  },
};

// --- Breaking news ---
export const breakingApi = {
  active() {
    return state.breaking.filter((b) => b.is_active).sort((a, b) => a.display_order - b.display_order);
  },
  all() {
    return [...state.breaking].sort((a, b) => a.display_order - b.display_order);
  },
  add(text: string, link_article_id: string | null) {
    state.breaking.push({ id: uid(), text, is_active: true, display_order: state.breaking.length, link_article_id, created_at: now() });
    persist();
  },
  toggle(id: string, value: boolean) {
    const it = state.breaking.find((x) => x.id === id);
    if (it) { it.is_active = value; persist(); }
  },
  remove(id: string) { state.breaking = state.breaking.filter((b) => b.id !== id); persist(); },
};

// --- Newsletter ---
export const subscribersApi = {
  all() { return [...state.subscribers].sort((a, b) => b.created_at.localeCompare(a.created_at)); },
  add(email: string) {
    if (state.subscribers.some((s) => s.email === email)) return;
    state.subscribers.push({ id: uid(), email, created_at: now() });
    persist();
  },
  remove(id: string) { state.subscribers = state.subscribers.filter((s) => s.id !== id); persist(); },
};

// --- Feedback ---
export const feedbackApi = {
  all() { return [...state.feedback].sort((a, b) => b.created_at.localeCompare(a.created_at)); },
  unreadCount() { return state.feedback.filter((f) => !f.is_read).length; },
  add(name: string, email: string, message: string) {
    state.feedback.push({ id: uid(), name, email, message, is_read: false, created_at: now() });
    persist();
  },
  markRead(id: string) {
    const f = state.feedback.find((x) => x.id === id);
    if (f) { f.is_read = true; persist(); }
  },
};

// --- Mock auth (any email + password "admin" works) ---
const AUTH_KEY = "mockAuth_v1";
export const mockAuth = {
  getUser(): { id: string; email: string } | null {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY) ?? "null"); } catch { return null; }
  },
  signIn(email: string, password: string): { error: string | null } {
    if (password !== "admin") return { error: "كلمة المرور غير صحيحة (استخدم: admin)" };
    const user = { id: "mock-admin", email };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("mockauth"));
    return { error: null };
  },
  signOut() {
    localStorage.removeItem(AUTH_KEY);
    window.dispatchEvent(new Event("mockauth"));
  },
};
