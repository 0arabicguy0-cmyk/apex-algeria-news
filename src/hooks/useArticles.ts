import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type DbArticle = Tables<"articles">;

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
  tags: string[];
  viewCount: number;
  publishedAt: string | null;
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

export function mapArticle(a: DbArticle): Article {
  return {
    id: a.id,
    title: a.title,
    excerpt: a.excerpt,
    body: a.body,
    image: a.image_url || FALLBACK_IMG,
    category: a.category,
    categoryKey: a.category_key,
    author: a.author || "هيئة التحرير",
    date: timeAgo(a.published_at ?? a.created_at),
    readTime: readTime(a.body),
    isBreaking: a.is_breaking,
    isFeatured: (a as any).is_featured ?? false,
    tags: (a as any).tags ?? [],
    viewCount: (a as any).view_count ?? 0,
    publishedAt: a.published_at,
  };
}

export function useArticles(opts?: { categoryKey?: string; limit?: number }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      let q = supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false, nullsFirst: false });
      if (opts?.categoryKey && opts.categoryKey !== "all") {
        q = q.eq("category_key", opts.categoryKey);
      }
      if (opts?.limit) q = q.limit(opts.limit);
      const { data } = await q;
      if (active) {
        setArticles((data ?? []).map(mapArticle));
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [opts?.categoryKey, opts?.limit]);

  return { articles, loading };
}

export function useArticle(id: string | undefined) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    let active = true;
    (async () => {
      const { data } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
      if (active) {
        setArticle(data ? mapArticle(data) : null);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  return { article, loading };
}

export function useTrending(limit = 5) {
  const [articles, setArticles] = useState<Article[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .order("view_count", { ascending: false })
        .limit(limit);
      setArticles((data ?? []).map(mapArticle));
    })();
  }, [limit]);
  return articles;
}

export function useRelated(article: Article | null, limit = 4) {
  const [related, setRelated] = useState<Article[]>([]);
  useEffect(() => {
    if (!article) return;
    (async () => {
      // Try by overlapping tags first
      let data: DbArticle[] | null = null;
      if (article.tags.length > 0) {
        const r = await supabase
          .from("articles")
          .select("*")
          .eq("status", "published")
          .neq("id", article.id)
          .overlaps("tags", article.tags)
          .limit(limit);
        data = r.data;
      }
      if (!data || data.length < limit) {
        const r = await supabase
          .from("articles")
          .select("*")
          .eq("status", "published")
          .eq("category_key", article.categoryKey)
          .neq("id", article.id)
          .limit(limit);
        data = r.data;
      }
      setRelated((data ?? []).map(mapArticle));
    })();
  }, [article?.id]);
  return related;
}

export async function trackView(articleId: string) {
  const key = `viewed:${articleId}`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");
  await supabase.from("article_views").insert({ article_id: articleId });
}
