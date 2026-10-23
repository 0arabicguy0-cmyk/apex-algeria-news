import { TSS_SERVER_FUNCTION, createServerFn } from "./_ssr/ssr.mjs";
// node_modules/.nitro/vite/services/ssr/assets/_-DM5CR6TR.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
var CODE_RE = /^[A-Za-z0-9]{5,7}$/;
var getArticlePreview_createServerFn_handler = createServerRpc({
	id: "b429b12c84c095cf9d147f5904aeabb6fe756a38a71c41d40656d44236cf6c41",
	name: "getArticlePreview",
	filename: "src/routes/$.tsx"
}, (opts) => getArticlePreview.__executeServer(opts));
var getArticlePreview = createServerFn({ method: "GET" }).validator((path) => path).handler(getArticlePreview_createServerFn_handler, async ({ data: path }) => {
	const segments = path.split("/").filter(Boolean);
	const legacy = segments.length === 2 && segments[0] === "article" && UUID_RE.test(segments[1]);
	const short = segments.length === 1 && CODE_RE.test(segments[0]);
	if (!legacy && !short) return null;
	const field = legacy ? "id" : "short_code";
	const value = legacy ? segments[1] : segments[0];
	const baseUrl = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
	const anonKey = process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
	if (!baseUrl || !anonKey) return null;
	const requestArticle = (select) => {
		const query = new URLSearchParams({
			select,
			[field]: `eq.${value}`,
			status: "eq.published",
			limit: "1"
		});
		return fetch(`${baseUrl}/rest/v1/articles?${query}`, { headers: { apikey: anonKey } });
	};
	let response = await requestArticle("title,excerpt,body,image_url,video_thumbnail,short_code,author,published_at,category");
	if (!response.ok && legacy) response = await requestArticle("title,excerpt,body,image_url,author,published_at,category");
	if (!response.ok) return null;
	const article = (await response.json())[0];
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
		category: article.category
	};
});
export { getArticlePreview_createServerFn_handler };
