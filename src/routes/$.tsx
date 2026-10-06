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
    const baseUrl = process.env['SUPABASE_URL'] || process.env['VITE_SUPABASE_URL'];
    const anonKey = process.env['SUPABASE_PUBLISHABLE_KEY'] || process.env['VITE_SUPABASE_PUBLISHABLE_KEY'];
    if (!baseUrl || !anonKey) return null;

    const requestArticle = (select: string) => {
      const query = new URLSearchParams({
        select,
        [field]: `eq.${value}`,
        status: "eq.published",
        limit: "1",
      });
      return fetch(`${baseUrl}/rest/v1/articles?${query}`, { headers: { apikey: anonKey } });
    };
    let response = await requestArticle(
      "title,excerpt,body,image_url,video_thumbnail,short_code,author,published_at,category",
    );
    if (!response.ok && legacy) {
      response = await requestArticle("title,excerpt,body,image_url,author,published_at,category");
    }
    if (!response.ok) return null;
    const rows = (await response.json()) as Array<Partial<ArticlePreview> & Pick<ArticlePreview, "title" | "category">>;
    const article = rows[0];
    if (!article) return null;
    return {
      title: article.title,
      excerpt: article.excerpt ?? null,
      body: article.body ?? null,
      image_url: article.image_url ?? null,
      video_thumbnail: article.video_thumbnail ?? null,
      short_code: article.short_code ?? null,
      author: article.author ?? null,
      published_at: article.published_at ?? null,
      category: article.category,
    } satisfies ArticlePreview;
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
    return {
      meta,
      links: [{ rel: "canonical", href: canonical }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: article.title,
          description,
          image: image ? [image] : undefined,
          datePublished: article.published_at,
          author: { "@type": "Organization", name: article.author || "MAX NEWS" },
          publisher: { "@type": "NewsMediaOrganization", name: "MAX NEWS" },
          mainEntityOfPage: canonical,
        }),
      }],
    };
  },
  component: LegacyPage,
});

function LegacyPage() {
  const { _splat } = Route.useParams();
  return <App initialPath={`/${_splat ?? ""}`} />;
}