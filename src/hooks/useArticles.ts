import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { FactCheckLabel, MockSource } from "@/lib/mockStore";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  image: string;
  category: string;
  categoryKey: string;
  author: string;
  date: string;
  readTime: string;
  isBreaking?: boolean;
  isFeatured?: boolean;
  isPremium?: boolean;
  factCheck?: FactCheckLabel;
  sources: MockSource[];
  tags: string[];
  viewCount: number;
  publishedAt: string | null;
  // 🆕 New fields for video support
  media_type?: "image" | "youtube" | "video";
  video_url?: string | null;
  video_thumbnail?: string | null;
}

const FALLBACK_IMG = "/placeholder.svg";

function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "الآن";
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`;
  return new Date(iso).toLocaleDateString("ar-DZ");
}

function readTime(body: string): string {
  const words = body.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} دقيقة`;
}

type DbArticle = Tables<"articles">;

export function mapArticle(a: DbArticle): Article {
  return {
    id: a.id,
    title: a.title,
    excerpt: a.excerpt ?? "",
    body: a.body ?? "",
    image: a.image_url || FALLBACK_IMG,
    category: a.category,
    categoryKey: a.category_key,
    author: a.author || "هيئة التحرير",
    date: timeAgo(a.published_at ?? a.created_at),
    readTime: readTime(a.body ?? ""),
    isBreaking: a.is_breaking,
    isFeatured: a.is_featured,
    isPremium: false,
    factCheck: "none",
    sources: [],
    tags: a.tags ?? [],
    viewCount: a.view_count ?? 0,
    publishedAt: a.published_at,
    // 🆕 Map the new columns
    media_type: (a.media_type as Article["media_type"]) || "image",
    video_url: a.video_url ?? null,
    video_thumbnail: a.video_thumbnail ?? null,
  };
}

const PUBLISHED = "published";

export function useArticles(opts?: { categoryKey?: string; limit?: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ["articles", "list", opts?.categoryKey ?? "all", opts?.limit ?? null],
    queryFn: async () => {
      let q = supabase
        .from("articles")
        .select("*")
        .eq("status", PUBLISHED)
        .order("published_at", { ascending: false, nullsFirst: false });
      if (opts?.categoryKey && opts.categoryKey !== "all") {
        q = q.eq("category_key", opts.categoryKey);
      }
      if (opts?.limit) q = q.limit(opts.limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map(mapArticle);
    },
  });
  return { articles: data ?? [], loading: isLoading };
}

export function useArticle(id: string | undefined) {
  const { data, isLoading } = useQuery({
    queryKey: ["articles", "one", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data ? mapArticle(data) : null;
    },
    enabled: !!id,
  });
  return { article: data ?? null, loading: isLoading };
}

export function useTrending(limit = 5) {
  const { data } = useQuery({
    queryKey: ["articles", "trending", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("status", PUBLISHED)
        .order("view_count", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []).map(mapArticle);
    },
  });
  return data ?? [];
}

export function useRelated(article: Article | null, limit = 4) {
  const { data } = useQuery({
    queryKey: ["articles", "related", article?.id, article?.categoryKey, article?.tags?.join(",")],
    queryFn: async () => {
      if (!article) return [];
      // First try by overlapping tags, then fall back to same category
      const tagFilter = article.tags.length > 0 ? article.tags : null;
      let byTag: Article[] = [];
      if (tagFilter) {
        const { data } = await supabase
          .from("articles")
          .select("*")
          .eq("status", PUBLISHED)
          .neq("id", article.id)
          .overlaps("tags", tagFilter)
          .limit(limit);
        byTag = (data ?? []).map(mapArticle);
      }
      if (byTag.length >= limit) return byTag.slice(0, limit);
      const { data: byCat } = await supabase
        .from("articles")
        .select("*")
        .eq("status", PUBLISHED)
        .eq("category_key", article.categoryKey)
        .neq("id", article.id)
        .limit(limit);
      const merged: Article[] = [...byTag];
      for (const a of (byCat ?? []).map(mapArticle)) {
        if (merged.length >= limit) break;
        if (!merged.find((m) => m.id === a.id)) merged.push(a);
      }
      return merged.slice(0, limit);
    },
    enabled: !!article,
  });
  return data ?? [];
}

export function useArticlesByIds(ids: string[]) {
  const { data } = useQuery({
    queryKey: ["articles", "byIds", ids.join(",")],
    queryFn: async () => {
      if (ids.length === 0) return [];
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .in("id", ids);
      if (error) throw error;
      return (data ?? []).map(mapArticle);
    },
    enabled: ids.length > 0,
  });
  return data ?? [];
}

export function useSearchArticles(opts: { q?: string; cat?: string; tag?: string; sort?: "newest" | "oldest" | "popular" }) {
  const { data, isLoading } = useQuery({
    queryKey: ["articles", "search", opts.q ?? "", opts.cat ?? "", opts.tag ?? "", opts.sort ?? "newest"],
    queryFn: async () => {
      let q = supabase.from("articles").select("*").eq("status", PUBLISHED);
      if (opts.q) {
        const term = `%${opts.q}%`;
        q = q.or(`title.ilike.${term},excerpt.ilike.${term},body.ilike.${term}`);
      }
      if (opts.cat && opts.cat !== "all") q = q.eq("category_key", opts.cat);
      if (opts.tag) q = q.contains("tags", [opts.tag]);
      if (opts.sort === "popular") q = q.order("view_count", { ascending: false });
      else if (opts.sort === "oldest") q = q.order("published_at", { ascending: true, nullsFirst: false });
      else q = q.order("published_at", { ascending: false, nullsFirst: false });
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map(mapArticle);
    },
  });
  return { results: data ?? [], loading: isLoading };
}

export function useArticlesByAuthor(authorName: string | undefined) {
  const { data } = useQuery({
    queryKey: ["articles", "byAuthor", authorName],
    queryFn: async () => {
      if (!authorName) return [];
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("status", PUBLISHED)
        .eq("author", authorName)
        .order("published_at", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return (data ?? []).map(mapArticle);
    },
    enabled: !!authorName,
  });
  return data ?? [];
}

export async function trackView(articleId: string) {
  // Record into reading history (per session for view count)
  try {
    const { recordRead } = await import("@/hooks/useReadingHistory");
    recordRead(articleId);
  } catch {}
  const key = `viewed:${articleId}`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");
  // Insert a view row (a DB trigger increments article.view_count)
  await supabase.from("article_views").insert({ article_id: articleId });
}

// Helper to invalidate caches after admin writes.
export function useInvalidateArticles() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["articles"] });
}
