import { __exportAll } from "./rolldown-runtime-DDijeYup.mjs";
import { require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { HeadContent, Outlet, Scripts, createFileRoute, createRootRoute, createRouter, lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { TSS_SERVER_FUNCTION, createServerFn, getServerFnById } from "./ssr.mjs";
// node_modules/.nitro/vite/services/ssr/assets/router-Cw5QR3qB.js
var import_jsx_runtime = require_jsx_runtime();
var SITE_TITLE = "MAX NEWS — أخبار الجزائر والعالم";
var SITE_DESCRIPTION$1 = "MAX NEWS — تغطية سريعة وموثوقة لأخبار الجزائر والعالم على مدار الساعة.";
var Route$2 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: SITE_TITLE },
			{
				name: "description",
				content: SITE_DESCRIPTION$1
			},
			{
				name: "author",
				content: "MAX NEWS"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:site_name",
				content: "MAX NEWS"
			},
			{
				property: "og:locale",
				content: "ar_DZ"
			},
			{
				property: "og:title",
				content: SITE_TITLE
			},
			{
				property: "og:description",
				content: SITE_DESCRIPTION$1
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: SITE_TITLE
			},
			{
				name: "twitter:description",
				content: SITE_DESCRIPTION$1
			},
			{
				name: "theme-color",
				content: "#D00035"
			}
		],
		links: [
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/icon-192.png"
			},
			{
				rel: "apple-touch-icon",
				href: "/icon-192.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap"
			}
		]
	}),
	component: RootComponent,
	shellComponent: RootDocument
});
function RootComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
}
function RootDocument({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "ar",
		dir: "rtl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
var $$splitComponentImporter$1 = () => import("./routes-C5Eo8cxG.mjs");
var Route$1 = createFileRoute("/")({
	head: () => ({
		meta: [{
			property: "og:url",
			content: "https://apex-algeria-news.lovable.app/"
		}],
		links: [{
			rel: "canonical",
			href: "https://apex-algeria-news.lovable.app/"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var $$splitComponentImporter = () => import("../_-CizLo0i1.mjs");
var SITE_URL = "https://apex-algeria-news.lovable.app";
var SITE_DESCRIPTION = "MAX NEWS — تغطية سريعة وموثوقة لأخبار الجزائر والعالم على مدار الساعة.";
var getArticlePreview = createServerFn({ method: "GET" }).validator((path) => path).handler(createSsrRpc("b429b12c84c095cf9d147f5904aeabb6fe756a38a71c41d40656d44236cf6c41"));
var Route = createFileRoute("/$")({
	loader: ({ params }) => getArticlePreview({ data: params._splat ?? "" }),
	head: ({ loaderData, params }) => {
		const article = loaderData;
		const path = params._splat ?? "";
		if (!article) return { links: [{
			rel: "canonical",
			href: `${SITE_URL}/${path}`
		}] };
		const title = `${article.title} — MAX NEWS`;
		const description = article.excerpt || article.body?.replace(/\s+/g, " ").slice(0, 180) || SITE_DESCRIPTION;
		const canonical = `${SITE_URL}${article.short_code ? `/${article.short_code}` : `/${path}`}`;
		const image = article.video_thumbnail || article.image_url;
		return {
			meta: [
				{ title },
				{
					name: "description",
					content: description
				},
				{
					name: "author",
					content: article.author || "MAX NEWS"
				},
				{
					property: "og:type",
					content: "article"
				},
				{
					property: "og:site_name",
					content: "MAX NEWS"
				},
				{
					property: "og:locale",
					content: "ar_DZ"
				},
				{
					property: "og:title",
					content: title
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:url",
					content: canonical
				},
				{
					name: "twitter:card",
					content: "summary_large_image"
				},
				{
					name: "twitter:title",
					content: title
				},
				{
					name: "twitter:description",
					content: description
				},
				...image ? [
					{
						property: "og:image",
						content: image
					},
					{
						property: "og:image:secure_url",
						content: image
					},
					{
						property: "og:image:alt",
						content: article.title
					},
					{
						name: "twitter:image",
						content: image
					},
					{
						name: "twitter:image:alt",
						content: article.title
					}
				] : [],
				...article.published_at ? [{
					property: "article:published_time",
					content: article.published_at
				}] : [],
				{
					property: "article:section",
					content: article.category
				}
			],
			links: [{
				rel: "canonical",
				href: canonical
			}],
			scripts: [{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "NewsArticle",
					headline: article.title,
					description,
					image: image ? [image] : void 0,
					datePublished: article.published_at,
					author: {
						"@type": "Organization",
						name: article.author || "MAX NEWS"
					},
					publisher: {
						"@type": "NewsMediaOrganization",
						name: "MAX NEWS"
					},
					mainEntityOfPage: canonical
				})
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$1.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$2
	}),
	SplatRoute: Route.update({
		id: "/$",
		path: "/$",
		getParentRoute: () => Route$2
	})
};
var routeTree = Route$2._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true
	});
}
export { Route, router_exports };
