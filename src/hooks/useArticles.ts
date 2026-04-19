import { useEffect, useState } from "react";
import { articlesApi, subscribe, type MockArticle, type MockSource, type FactCheckLabel } from "@/lib/mockStore";

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

export function mapArticle(a: MockArticle): Article {
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
    isFeatured: a.is_featured,
    isPremium: a.is_premium ?? false,
    factCheck: a.fact_check ?? "none",
    sources: a.sources ?? [],
    tags: a.tags ?? [],
    viewCount: a.view_count ?? 0,
    publishedAt: a.published_at,
  };
}

function useStoreSync() {
  const [, setN] = useState(0);
  useEffect(() => subscribe(() => setN((n) => n + 1)), []);
}

export function useArticles(opts?: { categoryKey?: string; limit?: number }) {
  useStoreSync();
  const articles = articlesApi.list({ categoryKey: opts?.categoryKey, limit: opts?.limit }).map(mapArticle);
  return { articles, loading: false };
}

export function useArticle(id: string | undefined) {
  useStoreSync();
  const a = id ? articlesApi.get(id) : null;
  return { article: a ? mapArticle(a) : null, loading: false };
}

export function useTrending(limit = 5) {
  useStoreSync();
  return articlesApi.trending(limit).map(mapArticle);
}

export function useRelated(article: Article | null, limit = 4) {
  useStoreSync();
  if (!article) return [];
  const raw = articlesApi.get(article.id);
  if (!raw) return [];
  return articlesApi.related(raw, limit).map(mapArticle);
}

export async function trackView(articleId: string) {
  // Always record into reading history (per session for view count)
  try {
    const { recordRead } = await import("@/hooks/useReadingHistory");
    recordRead(articleId);
  } catch {}
  const key = `viewed:${articleId}`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");
  articlesApi.incrementView(articleId);
}
