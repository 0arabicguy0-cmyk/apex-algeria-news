import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import App from "../App";

const SITE_URL = "https://apex-algeria-news.lovable.app";
const SITE_DESCRIPTION = "MAX NEWS — تغطية سريعة وموثوقة لأخبار الجزائر والعالم على مدار الساعة.";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CODE_RE = /^[A-Za-z0-9]{5,7}$/;

type ArticlePreview = {
  title: string;
  excerpt: string | null;
  body: string | null;
  image_url: string | null;
  video_thumbnail: string | null;
  short_code: string | null;
  author: string | null;
  published_at: string | null;
  category: string;
};

const getArticlePreview = createServerFn({ method: "GET" })
  .validator((path: string) => path)
  .handler(async ({ data: path }) => {
    const segments = path.split("/").filter(Boolean);
    const legacy = segments.length === 2 && segments[0] === "article" && UUID_RE.test(segments[1]);
    const short = segments.length === 1 && CODE_RE.test(segments[0]);
    if (!legacy && !short) return null;

    const field = legacy ? "id" : "short_code";
    const value = legacy ? segments[1] : segments[0];
    const baseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!baseUrl || !anonKey) return null;

    const query = new URLSearchParams({
      select: "title,excerpt,body,image_url,video_thumbnail,short_code,author,published_at,category",
      [field]: `eq.${value}`,
      status: "eq.published",
      limit: "1",
    });
    const response = await fetch(`${baseUrl}/rest/v1/articles?${query}`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    });
    if (!response.ok) return null;
    const rows = (await response.json()) as ArticlePreview[];
    return rows[0] ?? null;
  });

export const Route = createFileRoute("/$")({
  loader: ({ params }) => getArticlePreview({ data: params._splat ?? "" }),
  head: ({ loaderData, params }) => {
    const article = loaderData;
    const path = params._splat ?? "";
    if (!article) {
      return {
        links: [{ rel: "canonical", href: `${SITE_URL}/${path}` }],
      };
    }

    const title = `${article.title} — MAX NEWS`;
    const description = article.excerpt || article.body?.replace(/\s+/g, " ").slice(0, 180) || SITE_DESCRIPTION;
    const canonicalPath = article.short_code ? `/${article.short_code}` : `/${path}`;
    const canonical = `${SITE_URL}${canonicalPath}`;
    const image = article.video_thumbnail || article.image_url;
    const meta = [
      { title },
      { name: "description", content: description },
      { name: "author", content: article.author || "MAX NEWS" },
      { property: "og:type", content: "article" },
      { property: "og:site_name", content: "MAX NEWS" },
      { property: "og:locale", content: "ar_DZ" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      ...(image
        ? [
            { property: "og:image", content: image },
            { property: "og:image:secure_url", content: image },
            { property: "og:image:alt", content: article.title },
            { name: "twitter:image", content: image },
            { name: "twitter:image:alt", content: article.title },
          ]
        : []),
      ...(article.published_at ? [{ property: "article:published_time", content: article.published_at }] : []),
      { property: "article:section", content: article.category },
    ];
    return { meta, links: [{ rel: "canonical", href: canonical }] };
  },
  component: App,
});