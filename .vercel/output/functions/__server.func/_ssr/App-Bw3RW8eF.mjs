import { __toESM } from "../_runtime.mjs";
import { __exportAll } from "./rolldown-runtime-DDijeYup.mjs";
import { require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { Slot, require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { QueryClientProvider, useQuery } from "../_libs/tanstack__react-query.mjs";
import { QueryClient } from "../_libs/tanstack__query-core.mjs";
import { MemoryRouter, Outlet, Route, Routes, useLocation, useNavigate, useParams } from "../_libs/react-router.mjs";
import { BrowserRouter, Link, useSearchParams } from "../_libs/react-router-dom.mjs";
import { j } from "../_libs/next-themes.mjs";
import { $e, ue } from "../_libs/sonner.mjs";
import { Popover as Popover$1, PopoverContent as PopoverContent$1, PopoverPortal, PopoverTrigger as PopoverTrigger$1 } from "../_libs/@radix-ui/react-popover+[...].mjs";
import { Select as Select$1, SelectContent as SelectContent$1, SelectIcon, SelectItem as SelectItem$1, SelectItemIndicator, SelectItemText, SelectLabel as SelectLabel$1, SelectPortal, SelectScrollDownButton as SelectScrollDownButton$1, SelectScrollUpButton as SelectScrollUpButton$1, SelectSeparator as SelectSeparator$1, SelectTrigger as SelectTrigger$1, SelectValue as SelectValue$1, SelectViewport } from "../_libs/@radix-ui/react-select+[...].mjs";
import { Toast as Toast$1, ToastAction as ToastAction$1, ToastClose as ToastClose$1, ToastDescription as ToastDescription$1, ToastProvider as ToastProvider$1, ToastTitle as ToastTitle$1, ToastViewport as ToastViewport$1 } from "../_libs/radix-ui__react-toast.mjs";
import { clsx, cva } from "../_libs/class-variance-authority+clsx.mjs";
import { ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, BadgeDollarSign, Bell, BellOff, BookOpen, Bookmark, ChartColumn, Check, ChevronDown, ChevronUp, CircleAlert, CircleCheck, CircleCheckBig, CirclePlus, ClipboardCheck, Clock, Cloud, CloudLightning, CloudRain, CloudSnow, Cookie, Copy, Copyright, Crown, Download, Drama, ExternalLink, Eye, EyeOff, Facebook, FileText, FileWarning, Flame, Hash, History, Hourglass, House, Image, Info, KeyRound, Languages, Link2, List, LoaderCircle, Lock, LogOut, Mail, MailOpen, MapPin, Megaphone, Menu, MessageCircle, MessageSquare, MessageSquareQuote, Mic, Minus, Moon, Newspaper, Pause, Pencil, Play, Plus, Receipt, RefreshCw, Scale, Search, Send, Settings, Share2, Shield, ShieldCheck, Smartphone, Square, Sun, Tag, Trash2, TrendingUp, Twitter, Type, Upload, User, UserCog, Video, Wrench, X } from "../_libs/lucide-react.mjs";
import { twMerge } from "../_libs/tailwind-merge.mjs";
import { TooltipContent as TooltipContent$1, TooltipProvider as TooltipProvider$1 } from "../_libs/radix-ui__react-tooltip.mjs";
import { createClient } from "../_libs/supabase__supabase-js.mjs";
import { initializeApp } from "../_libs/@firebase/app+[...].mjs";
import { deleteToken, getMessagingInWindow, getToken, isWindowSupported, onMessage } from "../_libs/firebase__messaging.mjs";
import "../_libs/firebase.mjs";
import { Helmet } from "../_libs/react-helmet-async+[...].mjs";
import { Label as Label$1 } from "../_libs/radix-ui__react-label.mjs";
import { Switch as Switch$1, SwitchThumb } from "../_libs/radix-ui__react-switch.mjs";
import { literalType, objectType, stringType } from "../_libs/zod.mjs";
// node_modules/.nitro/vite/services/ssr/assets/App-Bw3RW8eF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var useReadingHistory_exports = /* @__PURE__ */ __exportAll({
	clearHistory: () => clearHistory,
	recordRead: () => recordRead,
	useReadingHistory: () => useReadingHistory
});
var KEY$4 = "max-reading-history";
var MAX = 12;
function read$1() {
	try {
		if (typeof window === "undefined") return [];
		const raw = localStorage.getItem(KEY$4);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}
function write(ids) {
	try {
		localStorage.setItem(KEY$4, JSON.stringify(ids));
		window.dispatchEvent(new Event("max-history"));
	} catch {}
}
function recordRead(articleId) {
	const ids = read$1().filter((id) => id !== articleId);
	ids.unshift(articleId);
	write(ids.slice(0, MAX));
}
function clearHistory() {
	write([]);
}
function useReadingHistory() {
	const [ids, setIds] = (0, import_react.useState)(() => read$1());
	(0, import_react.useEffect)(() => {
		const sync = () => setIds(read$1());
		window.addEventListener("max-history", sync);
		window.addEventListener("storage", sync);
		return () => {
			window.removeEventListener("max-history", sync);
			window.removeEventListener("storage", sync);
		};
	}, []);
	return ids;
}
var Toaster$2 = ({ ...props }) => {
	const { theme = "system" } = j();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)($e, {
		theme,
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var TOAST_LIMIT = 1;
var TOAST_REMOVE_DELAY = 1e6;
var count = 0;
function genId() {
	count = (count + 1) % Number.MAX_SAFE_INTEGER;
	return count.toString();
}
var toastTimeouts = /* @__PURE__ */ new Map();
var addToRemoveQueue = (toastId) => {
	if (toastTimeouts.has(toastId)) return;
	const timeout = setTimeout(() => {
		toastTimeouts.delete(toastId);
		dispatch({
			type: "REMOVE_TOAST",
			toastId
		});
	}, TOAST_REMOVE_DELAY);
	toastTimeouts.set(toastId, timeout);
};
var reducer = (state, action) => {
	switch (action.type) {
		case "ADD_TOAST": return {
			...state,
			toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
		};
		case "UPDATE_TOAST": return {
			...state,
			toasts: state.toasts.map((t) => t.id === action.toast.id ? {
				...t,
				...action.toast
			} : t)
		};
		case "DISMISS_TOAST": {
			const { toastId } = action;
			if (toastId) addToRemoveQueue(toastId);
			else state.toasts.forEach((toast) => {
				addToRemoveQueue(toast.id);
			});
			return {
				...state,
				toasts: state.toasts.map((t) => t.id === toastId || toastId === void 0 ? {
					...t,
					open: false
				} : t)
			};
		}
		case "REMOVE_TOAST":
			if (action.toastId === void 0) return {
				...state,
				toasts: []
			};
			return {
				...state,
				toasts: state.toasts.filter((t) => t.id !== action.toastId)
			};
	}
};
var listeners$2 = [];
var memoryState = { toasts: [] };
function dispatch(action) {
	memoryState = reducer(memoryState, action);
	listeners$2.forEach((listener) => {
		listener(memoryState);
	});
}
function toast$1({ ...props }) {
	const id = genId();
	const update = (props) => dispatch({
		type: "UPDATE_TOAST",
		toast: {
			...props,
			id
		}
	});
	const dismiss = () => dispatch({
		type: "DISMISS_TOAST",
		toastId: id
	});
	dispatch({
		type: "ADD_TOAST",
		toast: {
			...props,
			id,
			open: true,
			onOpenChange: (open) => {
				if (!open) dismiss();
			}
		}
	});
	return {
		id,
		dismiss,
		update
	};
}
function useToast() {
	const [state, setState] = import_react.useState(memoryState);
	import_react.useEffect(() => {
		listeners$2.push(setState);
		return () => {
			const index = listeners$2.indexOf(setState);
			if (index > -1) listeners$2.splice(index, 1);
		};
	}, [state]);
	return {
		...state,
		toast: toast$1,
		dismiss: (toastId) => dispatch({
			type: "DISMISS_TOAST",
			toastId
		})
	};
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var ToastProvider = ToastProvider$1;
var ToastViewport = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastViewport$1, {
	ref,
	className: cn("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]", className),
	...props
}));
ToastViewport.displayName = ToastViewport$1.displayName;
var toastVariants = cva("group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full", {
	variants: { variant: {
		default: "border bg-background text-foreground",
		destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
	} },
	defaultVariants: { variant: "default" }
});
var Toast = import_react.forwardRef(({ className, variant, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toast$1, {
		ref,
		className: cn(toastVariants({ variant }), className),
		...props
	});
});
Toast.displayName = Toast$1.displayName;
var ToastAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastAction$1, {
	ref,
	className: cn("inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors group-[.destructive]:border-muted/40 hover:bg-secondary group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group-[.destructive]:focus:ring-destructive disabled:pointer-events-none disabled:opacity-50", className),
	...props
}));
ToastAction.displayName = ToastAction$1.displayName;
var ToastClose = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastClose$1, {
	ref,
	className: cn("absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 hover:text-foreground group-[.destructive]:hover:text-red-50 focus:opacity-100 focus:outline-none focus:ring-2 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600", className),
	"toast-close": "",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
}));
ToastClose.displayName = ToastClose$1.displayName;
var ToastTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastTitle$1, {
	ref,
	className: cn("text-sm font-semibold", className),
	...props
}));
ToastTitle.displayName = ToastTitle$1.displayName;
var ToastDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastDescription$1, {
	ref,
	className: cn("text-sm opacity-90", className),
	...props
}));
ToastDescription.displayName = ToastDescription$1.displayName;
function Toaster$1() {
	const { toasts } = useToast();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToastProvider, { children: [toasts.map(function({ id, title, description, action, ...props }) {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Toast, {
			...props,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1",
					children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastTitle, { children: title }), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastDescription, { children: description })]
				}),
				action,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastClose, {})
			]
		}, id);
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastViewport, {})] });
}
var TooltipProvider = TooltipProvider$1;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent$1, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
	...props
}));
TooltipContent.displayName = TooltipContent$1.displayName;
function brokeredPreviewStorage() {
	if (typeof window === "undefined") return void 0;
	const host = location.hostname;
	const onPreviewZone = [
		"lovableproject.com",
		"lovableproject-dev.com",
		"lovable.app",
		"gpt-eng.com",
		"gptengineer.run"
	].some((z) => host === z || host.endsWith("." + z));
	const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";
	const projectId = onPreviewZone ? host.match(new RegExp("^(?:id-preview(?:-[a-z0-9]+)?|project)--(" + UUID + ")(?:-dev)?(?=\\.|$)", "i"))?.[1] ?? host.match(new RegExp("^(" + UUID + ")(?=[.-])", "i"))?.[1] : void 0;
	const framed = window.parent && window.parent !== window;
	if (!projectId || !framed) return localStorage;
	const dev = host.endsWith(".lovableproject-dev.com") || host.endsWith(".gpt-eng.com");
	const EDITOR = dev ? /^https:\/\/([a-z0-9-]+\.)*(lovable\.dev|gptengineer\.app)$|^http:\/\/localhost:3000$/ : /^https:\/\/([a-z0-9-]+\.)*(lovable\.dev|gptengineer\.app)$/;
	const ancestor = location.ancestorOrigins && location.ancestorOrigins[0] || (document.referrer ? new URL(document.referrer).origin : "");
	const editorOrigins = ancestor && EDITOR.test(ancestor) ? [ancestor] : dev ? ["https://lovable.dev", "http://localhost:3000"] : ["https://lovable.dev"];
	const RESULT = "lovable-preview-auth:result";
	const TIMEOUT = 2e3;
	const newId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
	const request = (type, key, value) => new Promise((resolve) => {
		const requestId = newId();
		let done = false;
		let timer;
		const finish = (r) => {
			if (done) return;
			done = true;
			clearTimeout(timer);
			window.removeEventListener("message", onMessage);
			resolve(r);
		};
		const onMessage = (e) => {
			if (editorOrigins.indexOf(e.origin) < 0) return;
			const d = e.data;
			if (d && d.type === RESULT && d.requestId === requestId) finish(d);
		};
		window.addEventListener("message", onMessage);
		const msg = {
			type,
			requestId,
			projectId,
			key
		};
		if (value !== void 0) msg["value"] = value;
		for (const origin of editorOrigins) window.parent.postMessage(msg, origin);
		timer = setTimeout(() => finish(null), TIMEOUT);
	});
	let firstGet = true;
	const RETRY_DELAY = 250;
	const readLocal = (key) => {
		try {
			return localStorage.getItem(key);
		} catch {
			return;
		}
	};
	return {
		getItem: async (key) => {
			const local = readLocal(key);
			let res = await request("lovable-preview-auth:get", key, local ?? void 0);
			if (!res && firstGet) {
				await new Promise((r) => setTimeout(r, RETRY_DELAY));
				res = await request("lovable-preview-auth:get", key, local ?? void 0);
			}
			firstGet = false;
			if (res && res.ok && typeof res.value === "string") {
				if (res.value === "") {
					if (local !== void 0 && readLocal(key) === local) localStorage.removeItem(key);
					return null;
				}
				if (local === null && readLocal(key) === null) try {
					localStorage.setItem(key, res.value);
				} catch {}
				return res.value;
			}
			return localStorage.getItem(key);
		},
		setItem: (key, value) => {
			localStorage.setItem(key, value);
			return request("lovable-preview-auth:set", key, value).then((res) => {
				if (res && res.ok && typeof res.value === "string" && localStorage.getItem(key) === value) {
					if (res.value === "") localStorage.removeItem(key);
					else localStorage.setItem(key, res.value);
				}
			});
		},
		removeItem: (key) => {
			const local = readLocal(key);
			localStorage.removeItem(key);
			return request("lovable-preview-auth:remove", key, local ?? void 0).then(() => void 0);
		}
	};
}
var supabase = createClient("https://vkhowfpfqzecghjciyel.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZraG93ZnBmcXplY2doamNpeWVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMjA0MDcsImV4cCI6MjA5NzY5NjQwN30.hXavmYRdkqIRhuMpFkAbCIZzteg6JVq5CUzGIxEjABA", { auth: {
	storage: brokeredPreviewStorage(),
	persistSession: true,
	autoRefreshToken: true
} });
var FALLBACK_IMG = "/placeholder.svg";
function timeAgo$1(iso) {
	if (!iso) return "";
	const diff = (Date.now() - new Date(iso).getTime()) / 1e3;
	if (diff < 60) return "الآن";
	if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
	if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
	if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`;
	return new Date(iso).toLocaleDateString("ar-DZ");
}
function readTime(body) {
	const words = body.trim().split(/\s+/).length;
	return `${Math.max(1, Math.round(words / 200))} دقيقة`;
}
function mapArticle(a) {
	return {
		id: a.id,
		title: a.title,
		excerpt: a.excerpt ?? "",
		body: a.body ?? "",
		image: a.image_url || FALLBACK_IMG,
		category: a.category,
		categoryKey: a.category_key,
		author: a.author || "هيئة التحرير",
		date: timeAgo$1(a.published_at ?? a.created_at),
		readTime: readTime(a.body ?? ""),
		isBreaking: a.is_breaking,
		isFeatured: a.is_featured,
		isPremium: false,
		factCheck: "none",
		sources: [],
		tags: a.tags ?? [],
		viewCount: a.view_count ?? 0,
		publishedAt: a.published_at,
		media_type: a.media_type || "image",
		video_url: a.video_url ?? null,
		video_thumbnail: a.video_thumbnail ?? null,
		shortCode: a.short_code ?? null
	};
}
var PUBLISHED = "published";
function useArticles(opts) {
	const { data, isLoading } = useQuery({
		queryKey: [
			"articles",
			"list",
			opts?.categoryKey ?? "all",
			opts?.limit ?? null
		],
		queryFn: async () => {
			let q = supabase.from("articles").select("*").eq("status", PUBLISHED).order("published_at", {
				ascending: false,
				nullsFirst: false
			});
			if (opts?.categoryKey && opts.categoryKey !== "all") q = q.eq("category_key", opts.categoryKey);
			if (opts?.limit) q = q.limit(opts.limit);
			const { data, error } = await q;
			if (error) throw error;
			return (data ?? []).map(mapArticle);
		}
	});
	return {
		articles: data ?? [],
		loading: isLoading
	};
}
var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** Accepts either a UUID or a short_code. */
function useArticle(id) {
	const { data, isLoading } = useQuery({
		queryKey: [
			"articles",
			"one",
			id
		],
		queryFn: async () => {
			if (!id) return null;
			const isUuid = UUID_RE.test(id);
			if (!isUuid && !/^[A-Za-z0-9]{5,7}$/.test(id)) return null;
			const { data, error } = await supabase.from("articles").select("*").eq(isUuid ? "id" : "short_code", id).maybeSingle();
			if (error) throw error;
			return data ? mapArticle(data) : null;
		},
		enabled: !!id
	});
	return {
		article: data ?? null,
		loading: isLoading
	};
}
function useTrending(limit = 5) {
	const { data } = useQuery({
		queryKey: [
			"articles",
			"trending",
			limit
		],
		queryFn: async () => {
			const { data, error } = await supabase.from("articles").select("*").eq("status", PUBLISHED).order("view_count", { ascending: false }).limit(limit);
			if (error) throw error;
			return (data ?? []).map(mapArticle);
		}
	});
	return data ?? [];
}
function useRelated(article, limit = 4) {
	const { data } = useQuery({
		queryKey: [
			"articles",
			"related",
			article?.id,
			article?.categoryKey,
			article?.tags?.join(",")
		],
		queryFn: async () => {
			if (!article) return [];
			const tagFilter = article.tags.length > 0 ? article.tags : null;
			let byTag = [];
			if (tagFilter) {
				const { data } = await supabase.from("articles").select("*").eq("status", PUBLISHED).neq("id", article.id).overlaps("tags", tagFilter).limit(limit);
				byTag = (data ?? []).map(mapArticle);
			}
			if (byTag.length >= limit) return byTag.slice(0, limit);
			const { data: byCat } = await supabase.from("articles").select("*").eq("status", PUBLISHED).eq("category_key", article.categoryKey).neq("id", article.id).limit(limit);
			const merged = [...byTag];
			for (const a of (byCat ?? []).map(mapArticle)) {
				if (merged.length >= limit) break;
				if (!merged.find((m) => m.id === a.id)) merged.push(a);
			}
			return merged.slice(0, limit);
		},
		enabled: !!article
	});
	return data ?? [];
}
function useArticlesByIds(ids) {
	const { data } = useQuery({
		queryKey: [
			"articles",
			"byIds",
			ids.join(",")
		],
		queryFn: async () => {
			if (ids.length === 0) return [];
			const { data, error } = await supabase.from("articles").select("*").in("id", ids);
			if (error) throw error;
			return (data ?? []).map(mapArticle);
		},
		enabled: ids.length > 0
	});
	return data ?? [];
}
function useSearchArticles(opts) {
	const { data, isLoading } = useQuery({
		queryKey: [
			"articles",
			"search",
			opts.q ?? "",
			opts.cat ?? "",
			opts.tag ?? "",
			opts.sort ?? "newest"
		],
		queryFn: async () => {
			let q = supabase.from("articles").select("*").eq("status", PUBLISHED);
			if (opts.q) {
				const term = `%${opts.q}%`;
				q = q.or(`title.ilike.${term},excerpt.ilike.${term},body.ilike.${term}`);
			}
			if (opts.cat && opts.cat !== "all") q = q.eq("category_key", opts.cat);
			if (opts.tag) q = q.contains("tags", [opts.tag]);
			if (opts.sort === "popular") q = q.order("view_count", { ascending: false });
			else if (opts.sort === "oldest") q = q.order("published_at", {
				ascending: true,
				nullsFirst: false
			});
			else q = q.order("published_at", {
				ascending: false,
				nullsFirst: false
			});
			const { data, error } = await q;
			if (error) throw error;
			return (data ?? []).map(mapArticle);
		}
	});
	return {
		results: data ?? [],
		loading: isLoading
	};
}
function useArticlesByAuthor(authorName) {
	const { data } = useQuery({
		queryKey: [
			"articles",
			"byAuthor",
			authorName
		],
		queryFn: async () => {
			if (!authorName) return [];
			const { data, error } = await supabase.from("articles").select("*").eq("status", PUBLISHED).eq("author", authorName).order("published_at", {
				ascending: false,
				nullsFirst: false
			});
			if (error) throw error;
			return (data ?? []).map(mapArticle);
		},
		enabled: !!authorName
	});
	return data ?? [];
}
async function trackView(articleId) {
	try {
		const { recordRead } = await Promise.resolve().then(() => useReadingHistory_exports);
		recordRead(articleId);
	} catch {}
	const key = `viewed:${articleId}`;
	if (sessionStorage.getItem(key)) return;
	sessionStorage.setItem(key, "1");
	await supabase.from("article_views").insert({ article_id: articleId });
}
var hero_algiers_default = "/assets/hero-algiers-iiDG3iIB.jpg";
var news_politics_default = "/assets/news-politics-DfyDZaeH.jpg";
var news_tech_default = "/assets/news-tech-CRlt3jyW.jpg";
var news_sports_default = "/assets/news-sports-D4uojib6.jpg";
var news_economy_default = "/assets/news-economy-CvTCyIi0.jpg";
var news_culture_default = "/assets/news-culture-3JLoNusS.jpg";
var categories = [
	{
		key: "all",
		label: "الرئيسية",
		labelEn: "Home"
	},
	{
		key: "algeria",
		label: "الجزائر",
		labelEn: "Algeria"
	},
	{
		key: "politics",
		label: "سياسة",
		labelEn: "Politics"
	},
	{
		key: "economy",
		label: "اقتصاد",
		labelEn: "Economy"
	},
	{
		key: "society",
		label: "مجتمع",
		labelEn: "Society"
	},
	{
		key: "regions",
		label: "جهات",
		labelEn: "Regions"
	},
	{
		key: "world",
		label: "دولي",
		labelEn: "International"
	},
	{
		key: "sports",
		label: "رياضة",
		labelEn: "Sports"
	},
	{
		key: "culture",
		label: "ثقافة وفن",
		labelEn: "Culture & Arts"
	},
	{
		key: "tech",
		label: "تكنولوجيا",
		labelEn: "Tech"
	},
	{
		key: "dialogues",
		label: "حوارات",
		labelEn: "Interviews"
	},
	{
		key: "misc",
		label: "منوعات",
		labelEn: "Miscellaneous"
	}
];
function getDynamicDateLine(language) {
	const now = /* @__PURE__ */ new Date();
	if (language === "ar") return `${new Intl.DateTimeFormat("ar-DZ", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric"
	}).format(now)} — ${new Intl.DateTimeFormat("ar-DZ-u-ca-islamic", {
		day: "numeric",
		month: "long",
		year: "numeric"
	}).format(now)}`;
	return new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric"
	}).format(now);
}
var KEY$3 = "max-lang";
var dict = {
	ar: {
		siteName: "MAX NEWS",
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
		dateLine: "",
		dateline: "",
		nlBadge: "نشرة MAX NEWS اليومية",
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
		rights: "© ٢٠٢٦ MAX NEWS — جميع الحقوق محفوظة",
		city: "الجزائر العاصمة",
		weatherDesc: "غائم جزئياً · رطوبة 64%",
		weatherUnit: "م",
		weekDays: [
			"الأربعاء",
			"الخميس",
			"الجمعة",
			"السبت"
		],
		prayerTimes: "مواقيت الصلاة",
		hijriDate: "١٧ شوال ١٤٤٧",
		prayers: [
			"الفجر",
			"الظهر",
			"العصر",
			"المغرب",
			"العشاء"
		],
		nextPrayer: "القادمة:",
		inHrsMins: "بعد ٢ ساعة و ١٤ دقيقة",
		latestNews: "آخر الأخبار",
		viewSection: "عرض القسم كاملاً ←",
		noMoreArticles: "لا توجد مقالات إضافية",
		noArticlesInCat: "لا توجد مقالات منشورة في هذا التصنيف بعد",
		searchTitle: "البحث في الأخبار",
		searchPlaceholder: "ابحث عن خبر، موضوع، شخصية...",
		sortNewest: "الأحدث",
		sortOldest: "الأقدم",
		sortPopular: "الأكثر قراءة",
		searchBtn: "بحث",
		reset: "إعادة تعيين",
		resultsCount: "نتيجة",
		noResults: "لا توجد نتائج مطابقة",
		bookmarksTitle: "المقالات المحفوظة",
		bookmarksCount: "مقال محفوظ على جهازك",
		noBookmarks: "لا توجد مقالات محفوظة",
		bookmarksHint: "احفظ مقالات لقراءتها لاحقاً بضغطة زر",
		browseNews: "تصفح الأخبار",
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
		backHome: "← الرئيسية",
		topicCount: "مقال في هذا القسم",
		loading: "جارٍ التحميل...",
		noArticlesTopic: "لا توجد مقالات في هذا القسم بعد",
		moreFrom: "المزيد من",
		articleNotFound: "المقال غير موجود",
		backToHome: "العودة للرئيسية",
		readDuration: "قراءة",
		relatedArticles: "مقالات ذات صلة",
		adminPanel: "لوحة التحكم",
		adminDemoMode: "MAX NEWS — وضع تجريبي",
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
		workflow: "سير العمل"
	},
	en: {
		siteName: "MAX NEWS",
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
		dateLine: "",
		dateline: "",
		nlBadge: "MAX NEWS Daily Briefing",
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
		rights: "© 2026 MAX NEWS — All rights reserved",
		city: "Algiers",
		weatherDesc: "Partly cloudy · 64% humidity",
		weatherUnit: "C",
		weekDays: [
			"Wed",
			"Thu",
			"Fri",
			"Sat"
		],
		prayerTimes: "Prayer Times",
		hijriDate: "17 Shawwal 1447",
		prayers: [
			"Fajr",
			"Dhuhr",
			"Asr",
			"Maghrib",
			"Isha"
		],
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
		adminDemoMode: "MAX NEWS — demo mode",
		password: "Password",
		signingIn: "Signing in...",
		signIn: "Sign in",
		signInError: "Sign-in error",
		adminHint: "Any email + password:",
		role: "Role",
		roleJournalist: "Journalist",
		roleEditor: "Editor",
		roleAdmin: "Admin",
		statusDraft: "Draft",
		statusInReview: "In review",
		statusScheduled: "Scheduled",
		statusPublished: "Published",
		submitForReview: "Submit for review",
		approveAndPublish: "Approve & publish",
		sendBackToDraft: "Send back to draft",
		schedulePublish: "Schedule publish",
		scheduledFor: "Scheduled for",
		saveDraft: "Save draft",
		publishNow: "Publish now",
		permissionDenied: "You don't have permission for this action",
		workflow: "Workflow"
	}
};
var listeners$1 = [];
var getInitial = () => {
	if (typeof window === "undefined") return "ar";
	return localStorage.getItem(KEY$3) || "ar";
};
var apply = (l) => {
	document.documentElement.lang = l;
	document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
};
if (typeof window !== "undefined") apply(getInitial());
function useLanguage() {
	const [lang, setLangState] = (0, import_react.useState)(getInitial);
	(0, import_react.useEffect)(() => {
		const fn = (l) => setLangState(l);
		listeners$1.push(fn);
		return () => {
			listeners$1 = listeners$1.filter((x) => x !== fn);
		};
	}, []);
	const setLang = (0, import_react.useCallback)((l) => {
		localStorage.setItem(KEY$3, l);
		apply(l);
		listeners$1.forEach((fn) => fn(l));
	}, []);
	return {
		lang,
		setLang,
		toggle: (0, import_react.useCallback)(() => setLang(lang === "ar" ? "en" : "ar"), [lang, setLang]),
		t: (0, import_react.useCallback)((k) => {
			if (k === "dateLine") return getDynamicDateLine(lang);
			return dict[lang][k];
		}, [lang]),
		tArr: (0, import_react.useCallback)((k) => dict[lang][k], [lang]),
		isRTL: lang === "ar"
	};
}
function LanguageToggle() {
	const { lang, toggle, t } = useLanguage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: toggle,
		"aria-label": t("language"),
		title: t("language"),
		className: "relative p-2 rounded-full hover:bg-muted transition-all duration-300 text-foreground flex items-center gap-1.5 group",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, { className: "w-5 h-5 transition-transform duration-500 group-hover:rotate-[180deg]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-bold tabular-nums tracking-wide hidden sm:inline",
			children: lang === "ar" ? "EN" : "ع"
		})]
	});
}
var PERM_KEY = "max-notif-permission";
var READ_IDS_KEY = "max-notif-read-ids-v1";
var LAST_READ_KEY = "max-notif-last-read-v1";
var CLEARED_AT_KEY = "max-notif-cleared-at-v1";
var MAX_ITEMS = 30;
function readSet(key) {
	try {
		if (typeof window === "undefined") return /* @__PURE__ */ new Set();
		const raw = localStorage.getItem(key);
		if (!raw) return /* @__PURE__ */ new Set();
		return new Set(JSON.parse(raw));
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
function writeSet(key, set) {
	localStorage.setItem(key, JSON.stringify([...set]));
}
function toNotification(a, readIds, lastReadAt) {
	const createdAt = a.published_at ?? a.created_at;
	const read = readIds.has(a.id) || lastReadAt !== null && createdAt <= lastReadAt;
	return {
		id: a.id,
		title: a.is_breaking ? `🚨 ${a.title}` : a.title,
		body: a.excerpt ?? "",
		category: a.category ?? "news",
		articleId: a.id,
		createdAt,
		read
	};
}
function getPermissionState$1() {
	if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
	return Notification.permission;
}
async function requestNotificationPermission() {
	if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
	const result = await Notification.requestPermission();
	localStorage.setItem(PERM_KEY, result);
	return result;
}
function useNotifications() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [readIds, setReadIds] = (0, import_react.useState)(() => readSet(READ_IDS_KEY));
	const [lastReadAt, setLastReadAt] = (0, import_react.useState)(() => typeof window === "undefined" ? null : localStorage.getItem(LAST_READ_KEY));
	const [clearedAt, setClearedAt] = (0, import_react.useState)(() => typeof window === "undefined" ? null : localStorage.getItem(CLEARED_AT_KEY));
	(0, import_react.useEffect)(() => {
		let active = true;
		(async () => {
			const { data, error } = await supabase.from("articles").select("id, title, excerpt, category, is_breaking, published_at, created_at").eq("status", "published").order("published_at", {
				ascending: false,
				nullsFirst: false
			}).limit(MAX_ITEMS);
			if (!active || error || !data) return;
			setRows(data);
		})();
		return () => {
			active = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const channel = supabase.channel("notif-articles").on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "articles"
		}, (payload) => {
			const a = payload.new;
			if (a.status !== "published") return;
			setRows((prev) => [a, ...prev.filter((r) => r.id !== a.id)].slice(0, MAX_ITEMS));
		}).on("postgres_changes", {
			event: "UPDATE",
			schema: "public",
			table: "articles"
		}, (payload) => {
			const a = payload.new;
			if (a.status !== "published") {
				setRows((prev) => prev.filter((r) => r.id !== a.id));
				return;
			}
			setRows((prev) => {
				return (prev.some((r) => r.id === a.id) ? prev.map((r) => r.id === a.id ? a : r) : [a, ...prev]).sort((x, y) => (y.published_at ?? y.created_at).localeCompare(x.published_at ?? x.created_at)).slice(0, MAX_ITEMS);
			});
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, []);
	const items = rows.filter((a) => {
		const t = a.published_at ?? a.created_at;
		return !clearedAt || t > clearedAt;
	}).sort((a, b) => (b.published_at ?? b.created_at).localeCompare(a.published_at ?? a.created_at)).map((a) => toNotification(a, readIds, lastReadAt));
	return {
		items,
		unread: items.filter((n) => !n.read).length,
		markAllRead: (0, import_react.useCallback)(() => {
			const now = (/* @__PURE__ */ new Date()).toISOString();
			localStorage.setItem(LAST_READ_KEY, now);
			setLastReadAt(now);
		}, []),
		markRead: (0, import_react.useCallback)((id) => {
			setReadIds((prev) => {
				if (prev.has(id)) return prev;
				const next = new Set(prev);
				next.add(id);
				writeSet(READ_IDS_KEY, next);
				return next;
			});
		}, []),
		clearAll: (0, import_react.useCallback)(() => {
			const now = (/* @__PURE__ */ new Date()).toISOString();
			localStorage.setItem(CLEARED_AT_KEY, now);
			setClearedAt(now);
		}, [])
	};
}
var firebaseApp = initializeApp({
	apiKey: "AIzaSyAKX7VcsNdevIBMpv0baWHnH4r17l19bdM",
	authDomain: "max-c5262.firebaseapp.com",
	projectId: "max-c5262",
	storageBucket: "max-c5262.firebasestorage.app",
	messagingSenderId: "609645507794",
	appId: "1:609645507794:web:28e89e924dd7445211e90b"
});
var _messaging = null;
async function getMessagingSafe() {
	if (_messaging) return _messaging;
	try {
		if (!await isWindowSupported()) return null;
		_messaging = getMessagingInWindow(firebaseApp);
		return _messaging;
	} catch {
		return null;
	}
}
var SW_URL = "/firebase-messaging-sw.js";
var TOKEN_KEY = "max_fcm_token_v1";
var OPTIN_KEY = "max_fcm_optin_v1";
function isInIframe() {
	try {
		return window.self !== window.top;
	} catch {
		return true;
	}
}
function fcmSupported() {
	return typeof window !== "undefined" && "serviceWorker" in navigator && "Notification" in window && !isInIframe();
}
function isOptedIn() {
	return typeof localStorage !== "undefined" && localStorage.getItem(OPTIN_KEY) === "1";
}
function getPermissionState() {
	if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
	return Notification.permission;
}
var vapidKeyCache = null;
async function fetchVapidKey() {
	if (vapidKeyCache) return vapidKeyCache;
	try {
		const { data, error } = await supabase.functions.invoke("fcm-config");
		if (error || !data?.vapidKey) return null;
		vapidKeyCache = data.vapidKey;
		return vapidKeyCache;
	} catch {
		return null;
	}
}
async function registerSW() {
	try {
		const existing = await navigator.serviceWorker.getRegistration(SW_URL);
		if (existing) return existing;
		return await navigator.serviceWorker.register(SW_URL);
	} catch {
		return null;
	}
}
async function enableFcm() {
	if (!fcmSupported()) return {
		ok: false,
		reason: "unsupported"
	};
	if (await Notification.requestPermission() !== "granted") return {
		ok: false,
		reason: "denied"
	};
	const [messaging, vapidKey, swReg] = await Promise.all([
		getMessagingSafe(),
		fetchVapidKey(),
		registerSW()
	]);
	if (!messaging) return {
		ok: false,
		reason: "unsupported"
	};
	if (!vapidKey) return {
		ok: false,
		reason: "no-vapid"
	};
	if (!swReg) return {
		ok: false,
		reason: "unsupported"
	};
	let token = null;
	try {
		token = await getToken(messaging, {
			vapidKey,
			serviceWorkerRegistration: swReg
		});
	} catch (e) {
		return {
			ok: false,
			reason: "error",
			message: e.message
		};
	}
	if (!token) return {
		ok: false,
		reason: "no-token"
	};
	const { error } = await supabase.functions.invoke("fcm-register-token", { body: {
		token,
		user_agent: navigator.userAgent,
		enabled: true
	} });
	if (error) return {
		ok: false,
		reason: "error",
		message: error.message
	};
	localStorage.setItem(TOKEN_KEY, token);
	localStorage.setItem(OPTIN_KEY, "1");
	onMessage(messaging, (payload) => {
		console.log("🔥 onMessage fired", payload);
		const d = payload.data || {};
		const isBreaking = d.is_breaking === "true";
		const title = `${isBreaking ? "🚨 عاجل" : "📰 خبر جديد"} — ${d.title || "Max News"}`;
		const url = d.url || "/";
		if (typeof document !== "undefined" && document.visibilityState !== "visible") {
			swReg.showNotification(title, {
				body: d.body || "",
				icon: isBreaking ? "/icon-512.png" : "/icon-192.png",
				badge: "/icon-192.png",
				tag: d.tag || (isBreaking ? "max-breaking" : "max-news"),
				data: { url },
				dir: "rtl",
				lang: "ar",
				requireInteraction: isBreaking,
				...isBreaking ? { renotify: true } : {}
			});
			return;
		}
		const openArticle = () => {
			try {
				ue.dismiss();
				if (url.startsWith("/")) {
					window.history.pushState({}, "", url);
					window.dispatchEvent(new PopStateEvent("popstate"));
				} else window.open(url, "_self");
			} catch {
				window.location.href = url;
			}
		};
		const opts = {
			description: d.body || void 0,
			duration: isBreaking ? 15e3 : 8e3,
			action: {
				label: "فتح",
				onClick: openArticle
			},
			onAutoClose: () => {}
		};
		if (isBreaking) ue.error(title, opts);
		else {
			console.log("TOAST CREATED", (/* @__PURE__ */ new Date()).toISOString());
			console.trace();
			ue(title, opts);
		}
	});
	return {
		ok: true,
		token
	};
}
async function disableFcm() {
	const token = localStorage.getItem(TOKEN_KEY);
	localStorage.removeItem(OPTIN_KEY);
	localStorage.removeItem(TOKEN_KEY);
	try {
		const messaging = await getMessagingSafe();
		if (messaging) await deleteToken(messaging);
	} catch {}
	if (token) try {
		await supabase.functions.invoke("fcm-unregister-token", { body: { token } });
	} catch {}
}
/** Silent re-registration if the user previously opted in. Call on app start. */
async function autoReregister() {
	if (!isOptedIn() || !fcmSupported()) return;
	if (getPermissionState() !== "granted") return;
	await enableFcm();
}
function timeAgo(iso, lang) {
	const diff = Math.max(0, Date.now() - new Date(iso).getTime());
	const m = Math.floor(diff / 6e4);
	if (m < 1) return lang === "ar" ? "الآن" : "now";
	if (m < 60) return lang === "ar" ? `منذ ${m} د` : `${m}m ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return lang === "ar" ? `منذ ${h} س` : `${h}h ago`;
	const d = Math.floor(h / 24);
	return lang === "ar" ? `منذ ${d} يوم` : `${d}d ago`;
}
function NotificationsBell() {
	const { items, unread, markAllRead, markRead, clearAll } = useNotifications();
	const { lang, isRTL } = useLanguage();
	const { toast } = useToast();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [perm, setPerm] = (0, import_react.useState)(getPermissionState$1());
	const [pushOn, setPushOn] = (0, import_react.useState)(isOptedIn());
	const [pushBusy, setPushBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const fn = (e) => e.key === "Escape" && setOpen(false);
		window.addEventListener("keydown", fn);
		return () => window.removeEventListener("keydown", fn);
	}, [open]);
	const enable = async () => {
		const result = await requestNotificationPermission();
		setPerm(result);
		if (result === "granted") toast({
			title: lang === "ar" ? "تم تفعيل التنبيهات" : "Notifications enabled",
			description: lang === "ar" ? "ستصلك أبرز الأخبار العاجلة" : "You'll receive breaking news alerts"
		});
		else if (result === "denied") toast({
			title: lang === "ar" ? "تم رفض التنبيهات" : "Notifications blocked",
			description: lang === "ar" ? "يمكنك تفعيلها من إعدادات المتصفح" : "Enable them from your browser settings"
		});
	};
	const togglePush = async () => {
		setPushBusy(true);
		if (pushOn) {
			await disableFcm();
			setPushOn(false);
			toast({ title: lang === "ar" ? "تم إيقاف إشعارات الجهاز" : "Device push disabled" });
		} else {
			const res = await enableFcm();
			if (res.ok) {
				setPushOn(true);
				toast({
					title: lang === "ar" ? "تم تفعيل إشعارات الهاتف ✓" : "Phone push enabled ✓",
					description: lang === "ar" ? "ستصلك الأخبار العاجلة على هاتفك حتى عند إغلاق التطبيق" : "Breaking news will arrive even when the app is closed"
				});
			} else {
				const fail = res;
				const reasonText = {
					unsupported: {
						ar: "غير مدعوم في هذا المتصفح.",
						en: "Not supported in this browser."
					},
					denied: {
						ar: "تم رفض الإذن.",
						en: "Permission denied."
					},
					"no-vapid": {
						ar: "إعدادات Firebase ناقصة.",
						en: "Firebase VAPID key missing."
					},
					"no-token": {
						ar: "تعذّر إنشاء رمز الإشعار.",
						en: "Could not obtain push token."
					},
					error: {
						ar: fail.message ?? "خطأ غير معروف.",
						en: fail.message ?? "Unknown error."
					}
				};
				const r = reasonText[fail.reason] ?? reasonText.error;
				toast({
					title: lang === "ar" ? "تعذّر التفعيل" : "Couldn't enable push",
					description: lang === "ar" ? r.ar : r.en,
					variant: "destructive"
				});
			}
		}
		setPushBusy(false);
	};
	const labels = {
		title: lang === "ar" ? "التنبيهات" : "Notifications",
		enable: lang === "ar" ? "تفعيل تنبيهات المتصفح" : "Enable browser alerts",
		enabled: lang === "ar" ? "التنبيهات مفعّلة ✓" : "Alerts enabled ✓",
		blocked: lang === "ar" ? "التنبيهات محظورة" : "Alerts blocked",
		unsupported: lang === "ar" ? "غير مدعوم في هذا المتصفح" : "Not supported in this browser",
		pushOn: lang === "ar" ? "إشعارات الهاتف مفعّلة — اضغط للإيقاف" : "Phone push ON — tap to disable",
		pushOff: lang === "ar" ? "تفعيل إشعارات الهاتف (حتى عند إغلاق التطبيق)" : "Enable phone push (works when app is closed)",
		markAll: lang === "ar" ? "تعليم الكل كمقروء" : "Mark all read",
		clear: lang === "ar" ? "مسح الكل" : "Clear all",
		empty: lang === "ar" ? "لا توجد تنبيهات" : "No notifications",
		aria: lang === "ar" ? "التنبيهات" : "Notifications"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: () => setOpen((v) => !v),
		className: "relative p-2 rounded-full hover:bg-muted transition-colors text-foreground",
		"aria-label": labels.aria,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-5 h-5" }), unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute top-1 -end-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center leading-none",
			children: unread > 9 ? "9+" : unread
		})]
	}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40",
		onClick: () => setOpen(false)
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `absolute top-full mt-2 ${isRTL ? "left-2" : "right-2"} z-50 w-[92vw] max-w-sm bg-background border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-4 py-3 border-b border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-4 h-4 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-foreground",
							children: labels.title
						}),
						unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold",
							children: unread
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setOpen(false),
					className: "text-muted-foreground hover:text-foreground",
					"aria-label": "close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 py-2.5 bg-muted/40 border-b border-border text-xs",
				children: perm === "granted" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-accent font-medium flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5" }), labels.enabled]
				}) : perm === "denied" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted-foreground flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellOff, { className: "w-3.5 h-3.5" }), labels.blocked]
				}) : perm === "unsupported" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: labels.unsupported
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: enable,
					className: "text-primary font-semibold hover:underline flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-3.5 h-3.5" }), labels.enable]
				})
			}),
			fcmSupported() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 py-2.5 bg-primary/5 border-b border-border text-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: togglePush,
					disabled: pushBusy,
					className: `font-semibold flex items-center gap-1.5 ${pushOn ? "text-accent" : "text-primary"} hover:underline disabled:opacity-60`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-3.5 h-3.5" }), pushOn ? labels.pushOn : labels.pushOff]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[60vh] overflow-y-auto",
				children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-4 py-12 text-center text-muted-foreground text-sm",
					children: labels.empty
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: items.map((n) => {
					const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3 px-4 py-3 hover:bg-muted/60 transition-colors border-b border-border/60 last:border-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.read ? "bg-transparent" : "bg-primary"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-sm text-foreground truncate",
									children: n.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground shrink-0",
									children: timeAgo(n.createdAt, lang)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-0.5 line-clamp-2",
								children: n.body
							})]
						})]
					});
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: n.articleId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: `/article/${n.articleId}`,
						onClick: () => {
							markRead(n.id);
							setOpen(false);
						},
						className: "block",
						children: inner
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => markRead(n.id),
						className: "block w-full text-start",
						children: inner
					}) }, n.id);
				}) })
			}),
			items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/30",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: markAllRead,
					className: "text-xs font-medium text-primary hover:underline flex items-center gap-1",
					disabled: unread === 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5" }), labels.markAll]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: clearAll,
					className: "text-xs font-medium text-muted-foreground hover:text-destructive flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), labels.clear]
				})]
			})
		]
	})] })] });
}
var max_news_logo_default = "/assets/max-news-logo-DKQDIc1d.jpg";
function BrandLogo({ className = "", imageClassName = "", priority = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `brand-logo ${className}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: max_news_logo_default,
			alt: "MAX NEWS",
			className: `h-full w-full object-cover ${imageClassName}`,
			loading: priority ? "eager" : "lazy",
			fetchPriority: priority ? "high" : "auto"
		})
	});
}
function Header({ isDark, onToggleTheme }) {
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const { t } = useLanguage();
	const navigate = useNavigate();
	const tapsRef = (0, import_react.useRef)([]);
	const timeoutRef = (0, import_react.useRef)();
	const handleLogoTap = () => {
		const now = Date.now();
		tapsRef.current = [...tapsRef.current.filter((t) => now - t < 3e3), now];
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = window.setTimeout(() => {
			if (tapsRef.current.filter((t) => Date.now() - t < 3e3).length >= 5) {
				tapsRef.current = [];
				navigate("/admin/login");
			} else navigate("/");
			timeoutRef.current = void 0;
		}, 250);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden md:block bg-navy text-navy-foreground border-b border-primary/50",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container flex items-center justify-between py-1.5 text-sm opacity-80",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("dateLine") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							"aria-label": `MAX NEWS on ${t("facebook")}`,
							className: "hover:text-primary transition-colors",
							children: t("facebook")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							"aria-label": `MAX NEWS on ${t("twitter")}`,
							className: "hover:text-primary transition-colors",
							children: t("twitter")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#",
							"aria-label": `MAX NEWS on ${t("youtube")}`,
							className: "hover:text-primary transition-colors",
							children: t("youtube")
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b-2 border-primary shadow-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container flex items-center justify-between h-16 md:h-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMenuOpen(true),
						className: "md:hidden p-2 -mr-2 text-foreground",
						"aria-label": "القائمة",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "w-6 h-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleLogoTap,
						"aria-label": "MAX NEWS — الصفحة الرئيسية",
						className: "flex items-center gap-2 select-none bg-transparent border-0 p-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogo, {
							className: "h-12 w-12 md:h-14 md:w-14",
							priority: true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex flex-col leading-tight text-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-heading font-extrabold text-xl text-foreground",
								children: "MAX NEWS"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-semibold text-primary",
								children: "الجزائر · الخبر بأقصى سرعة"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "hidden md:flex items-center gap-1",
						children: categories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: cat.key === "all" ? "/" : `/topic/${cat.key}`,
							className: "px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors relative group",
							children: [cat.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 right-0 left-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-right" })]
						}, cat.key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex items-center gap-1 md:gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsBell, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageToggle, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/search",
								className: "p-2 rounded-sm hover:bg-muted transition-colors text-foreground",
								"aria-label": t("search"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-5 h-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: onToggleTheme,
								className: "relative p-2 rounded-sm hover:bg-muted transition-colors text-foreground overflow-hidden",
								"aria-label": t("toggleTheme"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: `w-5 h-5 transition-all duration-500 ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0 absolute inset-0 m-auto"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: `w-5 h-5 transition-all duration-500 ${isDark ? "rotate-90 scale-0 opacity-0 absolute inset-0 m-auto" : "rotate-0 scale-100 opacity-100"}` })]
							})
						]
					})
				]
			})
		}),
		menuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-[60] md:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 bg-foreground/40",
				onClick: () => setMenuOpen(false)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-0 right-0 h-full w-72 bg-background shadow-xl p-6 animate-in slide-in-from-right",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-lg text-foreground",
							children: "القائمة"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMenuOpen(false),
							className: "text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-6 h-6" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex flex-col gap-1",
						children: categories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: cat.key === "all" ? "/" : `/topic/${cat.key}`,
							onClick: () => setMenuOpen(false),
							className: "px-4 py-3 rounded-lg text-foreground hover:bg-muted font-medium transition-colors",
							children: cat.label
						}, cat.key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute bottom-6 right-6 left-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/login",
							onClick: () => setMenuOpen(false),
							className: "block text-center text-[11px] text-muted-foreground/60 hover:text-primary transition-colors py-2",
							children: "·"
						})
					})
				]
			})]
		})
	] });
}
function useBreakingNews() {
	const [items, setItems] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function load() {
			const { data } = await supabase.from("breaking_news_items").select("id, text, link_article_id, display_order").eq("is_active", true).order("display_order", { ascending: true });
			if (!cancelled) setItems((data ?? []).map((r) => ({
				id: r.id,
				text: r.text,
				link_article_id: r.link_article_id
			})));
		}
		load();
		const channel = supabase.channel("breaking_news_items-public").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "breaking_news_items"
		}, () => load()).subscribe();
		return () => {
			cancelled = true;
			supabase.removeChannel(channel);
		};
	}, []);
	return items;
}
/** Constant reading speed, independent of how many headlines exist. */
var SPEED_PX_PER_SEC = 60;
var MIN_DURATION_S = 12;
var TICKER_CSS = `
  @keyframes max-ticker-rtl {
    from { transform: translate3d(0, 0, 0); }
    to   { transform: translate3d(var(--ticker-cycle), 0, 0); }
  }

  .max-ticker-viewport {
    -webkit-mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
            mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
  }

  .max-ticker-track {
    animation: max-ticker-rtl var(--ticker-duration) linear infinite;
    will-change: transform;
  }

  .max-ticker-viewport:hover .max-ticker-track,
  .max-ticker-viewport:focus-within .max-ticker-track {
    animation-play-state: paused;
  }

  @media (prefers-reduced-motion: reduce) {
    .max-ticker-track { animation: none; }
    .max-ticker-viewport { overflow-x: auto; }
  }
`;
function BreakingTicker() {
	const items = useBreakingNews();
	const viewportRef = (0, import_react.useRef)(null);
	const groupRef = (0, import_react.useRef)(null);
	const [layout, setLayout] = (0, import_react.useState)({
		copies: 2,
		cycle: 0
	});
	(0, import_react.useLayoutEffect)(() => {
		const viewport = viewportRef.current;
		const group = groupRef.current;
		if (!viewport || !group) return;
		const measure = () => {
			const cycle = Math.round(group.getBoundingClientRect().width);
			if (cycle <= 0) return;
			const copies = Math.ceil(viewport.clientWidth / cycle) + 1;
			setLayout((prev) => prev.copies === copies && prev.cycle === cycle ? prev : {
				copies,
				cycle
			});
		};
		const observer = new ResizeObserver(measure);
		observer.observe(viewport);
		observer.observe(group);
		measure();
		document.fonts?.ready.then(measure).catch(() => {});
		return () => observer.disconnect();
	}, [items]);
	if (items.length === 0) return null;
	const duration = Math.max(MIN_DURATION_S, layout.cycle / SPEED_PX_PER_SEC);
	const trackStyle = {
		"--ticker-cycle": `${layout.cycle}px`,
		"--ticker-duration": `${duration}s`,
		animationPlayState: layout.cycle ? "running" : "paused"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		dir: "rtl",
		lang: "ar",
		"aria-label": "الأخبار العاجلة",
		className: "sticky top-16 md:top-20 z-40 overflow-hidden border-b border-primary bg-navy text-navy-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: TICKER_CSS }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container flex h-9 items-stretch gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex flex-shrink-0 items-center gap-1.5 self-center rounded-sm bg-primary px-3 py-1 text-xs font-extrabold text-primary-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": true,
					className: "h-2 w-2 animate-pulse-dot rounded-full bg-primary-foreground"
				}), "عاجل"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: viewportRef,
				className: "max-ticker-viewport relative flex-1 overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-ticker-track absolute inset-y-0 right-0 flex w-max items-center whitespace-nowrap",
					style: trackStyle,
					children: Array.from({ length: layout.copies }, (_, copy) => {
						const isClone = copy > 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							ref: copy === 0 ? groupRef : void 0,
							"aria-hidden": isClone || void 0,
							className: "flex shrink-0 items-center",
							children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex flex-shrink-0 items-center px-5",
								children: [item.link_article_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: `/article/${item.link_article_id}`,
									tabIndex: isClone ? -1 : void 0,
									className: "text-sm font-medium hover:underline focus-visible:underline",
									children: item.text
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: item.text
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": true,
									className: "select-none ps-10 text-primary",
									children: "◆"
								})]
							}, item.id))
						}, copy);
					})
				})
			})]
		})]
	});
}
function CategoryTabs({ active, onChange }) {
	const { lang } = useLanguage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "md:hidden border-b border-border bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex overflow-x-auto scrollbar-hide gap-1 px-4 py-2",
			children: categories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => onChange(cat.key),
				className: `whitespace-nowrap px-4 py-1.5 rounded-sm text-sm font-bold transition-all border-b-2 ${active === cat.key ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground border-transparent hover:text-primary"}`,
				children: lang === "en" ? cat.labelEn : cat.label
			}, cat.key))
		})
	});
}
var config = {
	verified: {
		ar: "تم التحقق",
		en: "Verified",
		icon: ShieldCheck,
		cls: "bg-dz-green/15 text-dz-green border-dz-green/30"
	},
	opinion: {
		ar: "رأي",
		en: "Opinion",
		icon: MessageSquareQuote,
		cls: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400"
	},
	developing: {
		ar: "خبر متطوّر",
		en: "Developing",
		icon: Hourglass,
		cls: "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400"
	},
	analysis: {
		ar: "تحليل",
		en: "Analysis",
		icon: ChartColumn,
		cls: "bg-purple-500/15 text-purple-600 border-purple-500/30 dark:text-purple-400"
	},
	satire: {
		ar: "ساخر",
		en: "Satire",
		icon: Drama,
		cls: "bg-pink-500/15 text-pink-600 border-pink-500/30 dark:text-pink-400"
	}
};
function FactCheckBadge({ label, className, size = "md" }) {
	const { isRTL } = useLanguage();
	if (!label || label === "none") return null;
	const c = config[label];
	const Icon = c.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 rounded-full border font-medium", size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1", c.cls, className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5" }), isRTL ? c.ar : c.en]
	});
}
function PremiumBadge({ className, size = "md" }) {
	const { isRTL } = useLanguage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 rounded-sm bg-amber-500/95 text-white font-bold", size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3" }), isRTL ? "بريميوم" : "Premium"]
	});
}
function HeroSection({ featured, sidebar }) {
	const getDisplayImage = (article) => {
		let imageUrl;
		if (article.media_type === "youtube" || article.media_type === "video") imageUrl = article.video_thumbnail || article.image;
		else imageUrl = article.image;
		if (!imageUrl) imageUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E";
		console.log(`[HeroSection] Image for article ${article.id}:`, imageUrl);
		return imageUrl;
	};
	const isVideo = (article) => {
		return article.media_type === "youtube" || article.media_type === "video";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "container py-4 md:py-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid md:grid-cols-5 gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: `/article/${featured.id}`,
				className: "md:col-span-3 relative overflow-hidden rounded-xl group min-h-[350px] md:min-h-[520px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: getDisplayImage(featured),
						alt: featured.title,
						className: "absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					}),
					isVideo(featured) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 flex items-center justify-center z-10 pointer-events-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-black/60 rounded-full p-4 md:p-5 backdrop-blur-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-8 h-8 md:w-12 md:h-12 text-white fill-white" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute top-4 right-4 flex gap-2 flex-wrap z-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-dz-green text-accent-foreground px-3 py-1 rounded-sm text-xs font-bold",
								children: featured.category
							}),
							featured.isBreaking && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "bg-amber text-amber-foreground px-3 py-1 rounded-sm text-xs font-bold flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-destructive animate-pulse-dot" }), "عاجل"]
							}),
							isVideo(featured) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "bg-blue-600 text-white px-3 py-1 rounded-sm text-xs font-bold flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-3 h-3 fill-current" }), "فيديو"]
							}),
							featured.isPremium && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PremiumBadge, {}),
							featured.factCheck && featured.factCheck !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FactCheckBadge, {
								label: featured.factCheck,
								size: "sm"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl md:text-3xl font-bold text-primary-foreground leading-snug mb-2 line-clamp-3",
							children: featured.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-primary-foreground/70 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: featured.author }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: featured.date })
							]
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "md:col-span-2 flex flex-col gap-4",
				children: sidebar.map((article) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: `/article/${article.id}`,
					className: "group relative rounded-xl overflow-hidden flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: getDisplayImage(article),
							alt: article.title,
							loading: "lazy",
							className: "w-full h-32 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
						}),
						isVideo(article) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 flex items-center justify-center z-10 pointer-events-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-black/50 rounded-full p-2 backdrop-blur-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-5 h-5 text-white fill-white" })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute top-3 right-3 flex gap-1.5 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-dz-green text-accent-foreground px-2 py-0.5 rounded-sm text-[11px] font-bold",
									children: article.category
								}),
								isVideo(article) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-blue-600 text-white px-1.5 py-0.5 rounded-sm text-[10px] font-bold flex items-center gap-0.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-2.5 h-2.5 fill-current" })
								}),
								article.isPremium && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PremiumBadge, { size: "sm" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute bottom-0 right-0 left-0 p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm md:text-base font-bold text-primary-foreground leading-snug line-clamp-2",
								children: article.title
							})
						})
					]
				}, article.id))
			})]
		})
	});
}
function StoryCard({ article, index = 0 }) {
	const { isRTL } = useLanguage();
	const getDisplayImage = (article) => {
		if (article.media_type === "youtube" || article.media_type === "video") return article.video_thumbnail || article.image;
		return article.image;
	};
	const isVideo = (article) => {
		return article.media_type === "youtube" || article.media_type === "video";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: `/article/${article.id}`,
		className: "group block mb-5 rounded-xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-shadow animate-fade-in-up",
		style: { animationDelay: `${Math.min(index, 8) * 50}ms` },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: getDisplayImage(article),
					alt: article.title,
					loading: "lazy",
					width: 800,
					height: 450,
					className: "w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
				}),
				isVideo(article) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 flex items-center justify-center pointer-events-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-background/60 rounded-full p-3 backdrop-blur-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-6 h-6 text-foreground fill-current" })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-2 start-2 flex gap-1",
					children: article.isPremium && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PremiumBadge, { size: "sm" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute -bottom-3 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground px-3 py-1 rounded-md text-xs font-bold shadow",
					children: article.category
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-4 pt-6 pb-4 text-center",
			children: [
				article.factCheck && article.factCheck !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center mb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FactCheckBadge, {
						label: article.factCheck,
						size: "sm"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-extrabold text-foreground leading-snug line-clamp-3 mb-3 group-hover:text-primary transition-colors text-xl md:text-2xl",
					children: article.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hidden md:block text-sm text-muted-foreground line-clamp-2 mb-3",
					children: article.excerpt
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-center gap-2 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: article.author
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: article.date }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "•"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hidden sm:inline",
							children: [
								article.readTime,
								" ",
								isRTL ? "قراءة" : "read"
							]
						})
					]
				})
			]
		})]
	});
}
var KEY$2 = "mockStore_v2";
var uid = () => Math.random().toString(36).slice(2, 11);
var now = () => (/* @__PURE__ */ new Date()).toISOString();
var hoursAgo = (h) => (/* @__PURE__ */ new Date(Date.now() - h * 36e5)).toISOString();
var seed = () => ({
	articles: [
		{
			id: "1",
			title: "الجزائر تطلق مشروعاً ضخماً للطاقة المتجددة بقدرة ٥ غيغاواط",
			excerpt: "أعلنت الحكومة الجزائرية عن إطلاق أكبر مشروع للطاقة الشمسية في إفريقيا.",
			body: "أعلنت الحكومة الجزائرية اليوم عن إطلاق أكبر مشروع للطاقة الشمسية في القارة الإفريقية، بقدرة إنتاجية تبلغ ٥ غيغاواط.\n\n## الأهداف الاستراتيجية\n\nيأتي هذا المشروع في إطار استراتيجية التنويع الاقتصادي للتقليل من الاعتماد على المحروقات.\n\nوأوضح وزير الطاقة أن المشروع سيُنجز على ثلاث مراحل خلال السنوات الخمس المقبلة، وسيوفر أكثر من ٢٠ ألف فرصة عمل.\n\n## الإمكانات الطبيعية\n\nتمتلك الجزائر واحداً من أعلى معدلات الإشعاع الشمسي في العالم، مما يجعلها موقعاً مثالياً.",
			image_url: hero_algiers_default,
			category: "الجزائر",
			category_key: "algeria",
			author: "محمد بن علي",
			status: "published",
			is_breaking: true,
			is_featured: true,
			is_premium: false,
			fact_check: "verified",
			sources: [{
				title: "وزارة الطاقة الجزائرية",
				url: "https://www.energy.gov.dz"
			}, {
				title: "Reuters — Algeria solar push",
				url: "https://www.reuters.com"
			}],
			tags: [
				"طاقة",
				"الجزائر",
				"اقتصاد"
			],
			view_count: 1240,
			created_at: hoursAgo(2),
			published_at: hoursAgo(2)
		},
		{
			id: "2",
			title: "البرلمان يصادق على قانون الاستثمار الجديد لجذب رؤوس الأموال الأجنبية",
			excerpt: "في جلسة تاريخية، صادق البرلمان على قانون الاستثمار المعدّل.",
			body: "في جلسة تاريخية، صادق البرلمان الجزائري على قانون الاستثمار المعدّل الذي يمنح تسهيلات غير مسبوقة للمستثمرين.\n\nويتضمن القانون الجديد مزايا ضريبية واسعة وتبسيط الإجراءات الإدارية للمستثمرين الأجانب.\n\n## النقاط الأساسية\n\nأبرز ما جاء في القانون هو إلغاء قاعدة 51/49 في عدد من القطاعات غير الاستراتيجية، وإنشاء وكالة وطنية للاستثمار بصلاحيات موسّعة.",
			image_url: news_politics_default,
			category: "اقتصاد",
			category_key: "economy",
			author: "فاطمة الزهراء",
			status: "published",
			is_breaking: false,
			is_featured: false,
			is_premium: true,
			fact_check: "analysis",
			sources: [{
				title: "الجريدة الرسمية",
				url: "https://www.joradp.dz"
			}],
			tags: ["اقتصاد", "استثمار"],
			view_count: 870,
			created_at: hoursAgo(3),
			published_at: hoursAgo(3)
		},
		{
			id: "3",
			title: "الجزائر تحتضن أكبر مؤتمر تكنولوجي في شمال إفريقيا",
			excerpt: "تستعد العاصمة لاحتضان مؤتمر التحول الرقمي بمشاركة ٥٠٠ شركة.",
			body: "تستعد العاصمة الجزائرية لاحتضان مؤتمر التحول الرقمي الذي يجمع أكثر من ٥٠٠ شركة تقنية من حول العالم.",
			image_url: news_tech_default,
			category: "تكنولوجيا",
			category_key: "tech",
			author: "أحمد كريم",
			status: "published",
			is_breaking: false,
			is_featured: false,
			is_premium: false,
			fact_check: "none",
			sources: [],
			tags: ["تكنولوجيا", "رقمنة"],
			view_count: 540,
			created_at: hoursAgo(5),
			published_at: hoursAgo(5)
		},
		{
			id: "4",
			title: "المنتخب الوطني يحقق فوزاً تاريخياً في تصفيات كأس العالم ٢٠٢٦",
			excerpt: "حقق الخضر فوزاً ساحقاً بثلاثية نظيفة في مباراة مصيرية.",
			body: "حقق المنتخب الوطني الجزائري فوزاً ساحقاً بثلاثة أهداف مقابل لا شيء في المباراة المصيرية.",
			image_url: news_sports_default,
			category: "رياضة",
			category_key: "sports",
			author: "ياسين حداد",
			status: "published",
			is_breaking: false,
			is_featured: false,
			is_premium: false,
			fact_check: "verified",
			sources: [{
				title: "FAF — Fédération Algérienne de Football",
				url: "https://www.faf.dz"
			}],
			tags: ["رياضة", "كرة القدم"],
			view_count: 2310,
			created_at: hoursAgo(7),
			published_at: hoursAgo(7)
		},
		{
			id: "5",
			title: "ارتفاع احتياطي الصرف الأجنبي للجزائر إلى مستويات قياسية",
			excerpt: "كشف بنك الجزائر عن ارتفاع ملحوظ في احتياطيات النقد الأجنبي.",
			body: "كشف بنك الجزائر عن ارتفاع ملحوظ في احتياطيات النقد الأجنبي للبلاد، حيث بلغت مستويات لم تشهدها منذ عدة سنوات.\n\n## القراءة الاقتصادية\n\nيُعزى هذا الارتفاع إلى تحسّن أسعار المحروقات وانضباط ميزان المدفوعات.",
			image_url: news_economy_default,
			category: "اقتصاد",
			category_key: "economy",
			author: "فاطمة الزهراء",
			status: "published",
			is_breaking: false,
			is_featured: false,
			is_premium: true,
			fact_check: "verified",
			sources: [{
				title: "بنك الجزائر — تقرير الاحتياطيات",
				url: "https://www.bank-of-algeria.dz"
			}],
			tags: ["اقتصاد", "بنك"],
			view_count: 410,
			created_at: hoursAgo(10),
			published_at: hoursAgo(10)
		},
		{
			id: "6",
			title: "مهرجان تيمقاد الدولي يعود بنسخته الجديدة بحضور فنانين عالميين",
			excerpt: "يعود مهرجان تيمقاد الدولي للموسيقى بنسخة استثنائية.",
			body: "يعود مهرجان تيمقاد الدولي للموسيقى بنسخة استثنائية هذا العام، حيث يستضيف المهرجان فنانين من أكثر من ٢٠ دولة.",
			image_url: news_culture_default,
			category: "ثقافة",
			category_key: "culture",
			author: "نادية بوعزيز",
			status: "published",
			is_breaking: false,
			is_featured: false,
			is_premium: false,
			fact_check: "opinion",
			sources: [],
			tags: ["ثقافة", "موسيقى"],
			view_count: 290,
			created_at: hoursAgo(24),
			published_at: hoursAgo(24)
		}
	],
	comments: [{
		id: uid(),
		article_id: "1",
		name: "أحمد",
		message: "خبر رائع، نتمنى التوفيق لهذا المشروع!",
		status: "approved",
		created_at: hoursAgo(1)
	}, {
		id: uid(),
		article_id: "1",
		name: "ليلى",
		message: "أخيراً نتجه نحو الطاقة النظيفة.",
		status: "approved",
		created_at: hoursAgo(.5)
	}],
	reactions: [
		{
			id: uid(),
			article_id: "1",
			reaction: "like",
			created_at: hoursAgo(1)
		},
		{
			id: uid(),
			article_id: "1",
			reaction: "love",
			created_at: hoursAgo(.5)
		},
		{
			id: uid(),
			article_id: "1",
			reaction: "insightful",
			created_at: hoursAgo(.3)
		}
	],
	breaking: [{
		id: uid(),
		text: "عاجل: الجزائر تطلق مشروعاً ضخماً للطاقة المتجددة بقدرة ٥ غيغاواط",
		is_active: true,
		display_order: 0,
		link_article_id: "1",
		created_at: now()
	}, {
		id: uid(),
		text: "البرلمان يصادق على قانون الاستثمار الجديد",
		is_active: true,
		display_order: 1,
		link_article_id: "2",
		created_at: now()
	}],
	subscribers: [],
	feedback: [],
	authors: [
		{
			slug: "mohamed-benali",
			name: "محمد بن علي",
			bio: "صحفي متخصص في شؤون الطاقة والبيئة، يكتب لـ Max News منذ ٢٠٢٠.",
			avatar_url: null,
			twitter: "@mbenali",
			email: "m.benali@max.dz"
		},
		{
			slug: "fatima-zahra",
			name: "فاطمة الزهراء",
			bio: "محررة الاقتصاد، خريجة مدرسة الصحافة بالجزائر، شغوفة بقصص التنمية.",
			avatar_url: null,
			twitter: "@fzahra",
			email: "f.zahra@max.dz"
		},
		{
			slug: "ahmed-karim",
			name: "أحمد كريم",
			bio: "كاتب تقني يغطي رقمنة الإدارة والشركات الناشئة في شمال إفريقيا.",
			avatar_url: null,
			twitter: "@akarim",
			email: "a.karim@max.dz"
		},
		{
			slug: "yassine-haddad",
			name: "ياسين حداد",
			bio: "مراسل رياضي يتابع المنتخب الوطني والدوريات الإفريقية.",
			avatar_url: null,
			twitter: "@yhaddad",
			email: "y.haddad@max.dz"
		},
		{
			slug: "sara-megrani",
			name: "سارة مقراني",
			bio: "محللة اقتصادية تركز على المالية العامة والبنوك.",
			avatar_url: null,
			twitter: "@smegrani",
			email: "s.megrani@max.dz"
		},
		{
			slug: "nadia-bouaziz",
			name: "نادية بوعزيز",
			bio: "ناقدة ثقافية، تغطي السينما والمهرجانات الفنية.",
			avatar_url: null,
			twitter: "@nbouaziz",
			email: "n.bouaziz@max.dz"
		}
	]
});
var state = (() => {
	try {
		if (typeof window === "undefined") return seed();
		const raw = localStorage.getItem(KEY$2);
		if (raw) return JSON.parse(raw);
	} catch {}
	return seed();
})();
var listeners = /* @__PURE__ */ new Set();
function persist() {
	try {
		localStorage.setItem(KEY$2, JSON.stringify(state));
	} catch {}
	listeners.forEach((l) => l());
}
function subscribe(fn) {
	listeners.add(fn);
	return () => {
		listeners.delete(fn);
	};
}
var articlesApi = {
	list(opts) {
		let arr = [...state.articles];
		if (opts?.publishedOnly !== false) arr = arr.filter((a) => a.status === "published");
		if (opts?.categoryKey && opts.categoryKey !== "all") arr = arr.filter((a) => a.category_key === opts.categoryKey);
		arr.sort((a, b) => (b.published_at ?? b.created_at).localeCompare(a.published_at ?? a.created_at));
		return opts?.limit ? arr.slice(0, opts.limit) : arr;
	},
	all() {
		return [...state.articles].sort((a, b) => b.created_at.localeCompare(a.created_at));
	},
	get(id) {
		return state.articles.find((a) => a.id === id) ?? null;
	},
	trending(limit = 5) {
		return [...state.articles].filter((a) => a.status === "published").sort((a, b) => b.view_count - a.view_count).slice(0, limit);
	},
	related(article, limit = 4) {
		const others = state.articles.filter((a) => a.id !== article.id && a.status === "published");
		const out = [...others.filter((a) => a.tags.some((t) => article.tags.includes(t)))];
		for (const a of others) {
			if (out.length >= limit) break;
			if (a.category_key === article.category_key && !out.includes(a)) out.push(a);
		}
		return out.slice(0, limit);
	},
	search(opts) {
		let arr = state.articles.filter((a) => a.status === "published");
		if (opts.q) {
			const q = opts.q.toLowerCase();
			arr = arr.filter((a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.body.toLowerCase().includes(q));
		}
		if (opts.cat && opts.cat !== "all") arr = arr.filter((a) => a.category_key === opts.cat);
		if (opts.tag) arr = arr.filter((a) => a.tags.includes(opts.tag));
		if (opts.sort === "popular") arr.sort((a, b) => b.view_count - a.view_count);
		else if (opts.sort === "oldest") arr.sort((a, b) => (a.published_at ?? a.created_at).localeCompare(b.published_at ?? b.created_at));
		else arr.sort((a, b) => (b.published_at ?? b.created_at).localeCompare(a.published_at ?? a.created_at));
		return arr;
	},
	byIds(ids) {
		return state.articles.filter((a) => ids.includes(a.id));
	},
	create(data) {
		const a = {
			...data,
			id: uid(),
			created_at: now(),
			view_count: 0
		};
		state.articles.unshift(a);
		persist();
		return a;
	},
	update(id, data) {
		const i = state.articles.findIndex((a) => a.id === id);
		if (i >= 0) {
			state.articles[i] = {
				...state.articles[i],
				...data
			};
			persist();
		}
	},
	remove(id) {
		state.articles = state.articles.filter((a) => a.id !== id);
		state.comments = state.comments.filter((c) => c.article_id !== id);
		state.reactions = state.reactions.filter((r) => r.article_id !== id);
		persist();
	},
	incrementView(id) {
		const a = state.articles.find((x) => x.id === id);
		if (a) {
			a.view_count += 1;
			persist();
		}
	}
};
var commentsApi = {
	forArticle(articleId, status) {
		let arr = state.comments.filter((c) => c.article_id === articleId);
		if (status) arr = arr.filter((c) => c.status === status);
		return arr.sort((a, b) => b.created_at.localeCompare(a.created_at));
	},
	all(filter) {
		let arr = [...state.comments];
		if (filter) arr = arr.filter((c) => c.status === filter);
		return arr.sort((a, b) => b.created_at.localeCompare(a.created_at));
	},
	add(c) {
		state.comments.unshift({
			...c,
			id: uid(),
			created_at: now(),
			status: "pending"
		});
		persist();
	},
	setStatus(id, status) {
		const c = state.comments.find((x) => x.id === id);
		if (c) {
			c.status = status;
			persist();
		}
	},
	remove(id) {
		state.comments = state.comments.filter((c) => c.id !== id);
		persist();
	}
};
var reactionsApi = {
	forArticle(articleId) {
		return state.reactions.filter((r) => r.article_id === articleId);
	},
	add(articleId, reaction) {
		state.reactions.push({
			id: uid(),
			article_id: articleId,
			reaction,
			created_at: now()
		});
		persist();
	}
};
var subscribersApi = {
	all() {
		return [...state.subscribers].sort((a, b) => b.created_at.localeCompare(a.created_at));
	},
	add(email) {
		if (state.subscribers.some((s) => s.email === email)) return;
		state.subscribers.push({
			id: uid(),
			email,
			created_at: now()
		});
		persist();
	},
	remove(id) {
		state.subscribers = state.subscribers.filter((s) => s.id !== id);
		persist();
	}
};
var feedbackApi = {
	all() {
		return [...state.feedback].sort((a, b) => b.created_at.localeCompare(a.created_at));
	},
	unreadCount() {
		return state.feedback.filter((f) => !f.is_read).length;
	},
	add(name, email, message) {
		state.feedback.push({
			id: uid(),
			name,
			email,
			message,
			is_read: false,
			created_at: now()
		});
		persist();
	},
	markRead(id) {
		const f = state.feedback.find((x) => x.id === id);
		if (f) {
			f.is_read = true;
			persist();
		}
	}
};
function authorSlug(name) {
	const exact = state.authors.find((a) => a.name === name);
	if (exact) return exact.slug;
	return name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}
var authorsApi = {
	all() {
		return [...state.authors];
	},
	bySlug(slug) {
		const found = state.authors.find((a) => a.slug === slug);
		if (found) return found;
		const a = state.articles.find((x) => authorSlug(x.author) === slug);
		if (a) return {
			slug,
			name: a.author,
			bio: "",
			avatar_url: null
		};
		return null;
	},
	byName(name) {
		return state.authors.find((a) => a.name === name) ?? null;
	},
	articlesBy(name) {
		return state.articles.filter((a) => a.author === name && a.status === "published").sort((a, b) => (b.published_at ?? b.created_at).localeCompare(a.published_at ?? a.created_at));
	}
};
var SUB_KEY = "max_subscription_v1";
var subscriptionApi = {
	isActive() {
		try {
			return localStorage.getItem(SUB_KEY) === "active";
		} catch {
			return false;
		}
	},
	subscribe() {
		try {
			localStorage.setItem(SUB_KEY, "active");
		} catch {}
		window.dispatchEvent(new Event("max-subscription"));
	},
	cancel() {
		try {
			localStorage.removeItem(SUB_KEY);
		} catch {}
		window.dispatchEvent(new Event("max-subscription"));
	}
};
function runScheduledPublish() {
	const t = Date.now();
	let changed = false;
	for (const a of state.articles) if (a.status === "scheduled" && a.scheduled_at && new Date(a.scheduled_at).getTime() <= t) {
		a.status = "published";
		a.published_at = a.scheduled_at;
		changed = true;
	}
	if (changed) persist();
}
if (typeof window !== "undefined") {
	runScheduledPublish();
	setInterval(runScheduledPublish, 3e4);
}
function useSubscription() {
	const [active, setActive] = (0, import_react.useState)(subscriptionApi.isActive());
	(0, import_react.useEffect)(() => {
		const sync = () => setActive(subscriptionApi.isActive());
		window.addEventListener("max-subscription", sync);
		window.addEventListener("storage", sync);
		return () => {
			window.removeEventListener("max-subscription", sync);
			window.removeEventListener("storage", sync);
		};
	}, []);
	return {
		active,
		subscribe: () => subscriptionApi.subscribe(),
		cancel: () => subscriptionApi.cancel()
	};
}
var sizes = {
	leaderboard: "h-40 md:h-48",
	inline: "h-32 md:h-40",
	square: "h-64",
	skyscraper: "h-[600px]"
};
var cachedAds = null;
var cachePromise = null;
var globalRotationIndex = 0;
async function loadAds() {
	if (cachedAds) return cachedAds;
	if (cachePromise) return cachePromise;
	cachePromise = (async () => {
		const { data, error } = await supabase.from("ad_submissions").select("id, product_title, product_description, product_image_url, product_url, advertiser_name").eq("status", "approved").or(`expires_at.is.null,expires_at.gt.${(/* @__PURE__ */ new Date()).toISOString()}`).order("approved_at", { ascending: false }).limit(40);
		if (error) {
			console.warn("[AdBanner] failed to load ads", error);
			cachedAds = [];
			return [];
		}
		const ads = data ?? [];
		cachedAds = (await Promise.all(ads.map(async (ad) => {
			if (ad.product_image_url.startsWith("ad-uploads://")) {
				const path = ad.product_image_url.replace("ad-uploads://", "");
				const { data: signedData, error: signedError } = await supabase.storage.from("ad-uploads").createSignedUrl(path, 3600);
				console.log("[AdBanner] image path:", path);
				console.log("[AdBanner] signed URL:", signedData?.signedUrl);
				console.log("[AdBanner] signed error:", signedError);
				if (signedError || !signedData?.signedUrl) {
					console.warn("[AdBanner] failed to create signed URL:", ad.id, signedError);
					return null;
				}
				return {
					...ad,
					product_image_url: signedData.signedUrl
				};
			}
			return ad;
		}))).filter((ad) => ad !== null);
		return cachedAds;
	})();
	return cachePromise;
}
function AdBanner({ variant = "leaderboard", label, className }) {
	const { isRTL } = useLanguage();
	const { active } = useSubscription();
	const [ads, setAds] = (0, import_react.useState)([]);
	const [index, setIndex] = (0, import_react.useState)(() => globalRotationIndex);
	(0, import_react.useEffect)(() => {
		let mounted = true;
		loadAds().then((a) => {
			if (mounted) setAds(a);
		});
		return () => {
			mounted = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (ads.length <= 1) return;
		const id = window.setInterval(() => {
			globalRotationIndex = (globalRotationIndex + 1) % ads.length;
			setIndex(globalRotationIndex);
		}, 6e3);
		return () => clearInterval(id);
	}, [ads.length]);
	if (active) return null;
	const adLabel = label ?? (isRTL ? "إعلان" : "Advertisement");
	if (ads.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		role: "complementary",
		"aria-label": adLabel,
		className: cn("relative w-full rounded-lg border border-dashed border-border bg-gradient-to-br from-muted/40 to-muted/10 flex items-center justify-center overflow-hidden my-4", sizes[variant], className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute top-1.5 start-2 text-[10px] uppercase tracking-wider text-muted-foreground/70 bg-background/60 px-1.5 py-0.5 rounded",
			children: adLabel
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/advertise",
			className: "text-center px-4 hover:opacity-90 transition-opacity",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-bold text-foreground/80",
				children: isRTL ? "مساحتك الإعلانية هنا" : "Your ad could be here"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground mt-1",
				children: isRTL ? "اضغط للإعلان على MAX NEWS" : "Click to advertise on MAX NEWS"
			})]
		})]
	});
	const ad = ads[index % ads.length];
	const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-full h-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: ad.product_image_url,
				alt: ad.product_title,
				loading: "eager",
				className: "block w-full h-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute top-1.5 start-2 z-10 text-[10px] uppercase tracking-wider text-white/90 bg-black/50 px-1.5 py-0.5 rounded",
				children: adLabel
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-0 bottom-0 z-10 p-3 text-white",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm md:text-base font-bold line-clamp-1",
						children: ad.product_title
					}),
					ad.product_description && variant !== "leaderboard" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs opacity-90 line-clamp-2 mt-0.5",
						children: ad.product_description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[10px] opacity-70 mt-1",
						children: [
							isRTL ? "بواسطة" : "by",
							" ",
							ad.advertiser_name
						]
					})
				]
			})
		]
	});
	const baseClass = cn("relative w-full rounded-lg border border-border overflow-hidden my-4 group transition-transform hover:scale-[1.005]", sizes[variant], className);
	if (ad.product_url) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: ad.product_url,
		target: "_blank",
		rel: "noopener sponsored nofollow",
		"aria-label": `${adLabel}: ${ad.product_title}`,
		className: baseClass,
		children: inner
	}, ad.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		role: "complementary",
		"aria-label": adLabel,
		className: baseClass,
		children: inner
	}, ad.id);
}
function MostRead() {
	const articles = useTrending(5);
	const { t } = useLanguage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-card rounded-xl p-5 border border-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
			className: "font-bold text-foreground mb-4 text-lg flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "w-4 h-4 text-amber" }), t("mostRead")]
		}), articles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: t("noArticles")
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-3",
			children: articles.map((article, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: `/article/${article.id}`,
				className: "flex items-start gap-3 group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-2xl font-bold text-primary/30 leading-none mt-1 w-6 text-center flex-shrink-0",
					children: i + 1
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug",
						children: article.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground mt-1 block",
						children: [
							article.viewCount,
							" ",
							t("views"),
							" · ",
							article.date
						]
					})]
				})]
			}, article.id))
		})]
	});
}
function NewsletterSignup() {
	const [email, setEmail] = (0, import_react.useState)("");
	const { toast } = useToast();
	const { t } = useLanguage();
	const submit = (e) => {
		e.preventDefault();
		if (!email.includes("@")) return;
		subscribersApi.add(email.trim().toLowerCase());
		setEmail("");
		toast({
			title: t("nlToastTitle"),
			description: t("nlToastDesc")
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-2xl bg-gradient-to-l from-navy via-navy to-primary text-primary-foreground p-6 md:p-8 my-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-medium mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-3.5 h-3.5" }), t("nlBadge")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xl md:text-2xl font-bold mb-2 leading-snug",
						children: t("nlTitle")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-primary-foreground/80 text-sm mb-4",
						children: t("nlSub")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "flex flex-col sm:flex-row gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: t("nlPlaceholder"),
							required: true,
							dir: "ltr",
							className: "flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur border border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-white/40 text-sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "px-6 py-3 bg-white text-navy font-bold rounded-lg hover:bg-white/90 transition-colors text-sm",
							children: t("nlSubscribe")
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-white/5" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -left-20 -top-20 w-56 h-56 rounded-full bg-white/5" })
		]
	});
}
function Footer() {
	const { t, lang } = useLanguage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "hidden md:block bg-navy text-navy-foreground mt-12 border-t-4 border-primary",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container py-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-4 gap-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogo, { className: "h-12 w-12" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-heading font-extrabold text-xl",
							children: "MAX NEWS"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm opacity-70 leading-relaxed",
						children: t("siteDescription")
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-bold mb-4",
						children: t("siteSections")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2 text-sm opacity-70",
						children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: c.key === "all" ? "/" : `/?cat=${c.key}`,
							className: "hover:opacity-100 transition-opacity",
							children: lang === "en" ? c.labelEn : c.label
						}, c.key))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-bold mb-4",
						children: lang === "ar" ? "معلومات قانونية" : "Legal & Editorial"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2 text-sm opacity-70",
						children: [
							{
								to: "/about",
								ar: "من نحن",
								en: "About us"
							},
							{
								to: "/imprint",
								ar: "البيانات القانونية",
								en: "Legal notice"
							},
							{
								to: "/editorial-policy",
								ar: "الميثاق التحريري",
								en: "Editorial charter"
							},
							{
								to: "/corrections",
								ar: "التصحيحات وحق الرد",
								en: "Corrections & reply"
							},
							{
								to: "/corrections-log",
								ar: "سجل التصحيحات",
								en: "Corrections log"
							},
							{
								to: "/privacy",
								ar: "سياسة الخصوصية",
								en: "Privacy policy"
							},
							{
								to: "/cookies",
								ar: "ملفات تعريف الارتباط",
								en: "Cookies"
							},
							{
								to: "/terms",
								ar: "شروط الاستخدام",
								en: "Terms of use"
							},
							{
								to: "/copyright",
								ar: "سياسة حقوق النشر",
								en: "Copyright policy"
							},
							{
								to: "/disclaimer",
								ar: "إخلاء مسؤولية المحتوى",
								en: "Content disclaimer"
							},
							{
								to: "/contact",
								ar: "اتصل بنا",
								en: "Contact"
							},
							{
								to: "/advertise",
								ar: "أعلن معنا",
								en: "Advertise with us"
							}
						].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: l.to,
							className: "hover:opacity-100 transition-opacity",
							children: lang === "ar" ? l.ar : l.en
						}) }, l.to))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-bold mb-4",
						children: t("followUs")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-4 text-sm opacity-70",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#",
								"aria-label": `MAX NEWS on ${t("facebook")}`,
								className: "hover:opacity-100 transition-opacity",
								children: t("facebook")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#",
								"aria-label": `MAX NEWS on ${t("twitter")}`,
								className: "hover:opacity-100 transition-opacity",
								children: t("twitter")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#",
								"aria-label": `MAX NEWS on ${t("youtube")}`,
								className: "hover:opacity-100 transition-opacity",
								children: t("youtube")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#",
								"aria-label": `MAX NEWS on ${t("instagram")}`,
								className: "hover:opacity-100 transition-opacity",
								children: t("instagram")
							})
						]
					})] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-navy-foreground/20 mt-8 pt-6 text-center text-sm opacity-50",
				children: t("rights")
			})]
		})
	});
}
var SITE_NAME = "MAX NEWS";
var DEFAULT_DESC_AR = "MAX NEWS — تغطية سريعة وموثوقة لأخبار الجزائر والعالم على مدار الساعة.";
var DEFAULT_DESC_EN = "MAX NEWS — fast, reliable coverage of Algeria and the world around the clock.";
function SEO({ title, description, keywords, author = SITE_NAME, image, type = "website", canonical }) {
	const { lang, isRTL } = useLanguage();
	const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
	const desc = description || (lang === "en" ? DEFAULT_DESC_EN : DEFAULT_DESC_AR);
	const url = canonical || (typeof window !== "undefined" ? window.location.href : "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Helmet, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("html", {
			lang,
			dir: isRTL ? "rtl" : "ltr"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: fullTitle }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			name: "description",
			content: desc
		}),
		keywords && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			name: "keywords",
			content: keywords
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			name: "author",
			content: author
		}),
		url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("link", {
			rel: "canonical",
			href: url
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			property: "og:site_name",
			content: SITE_NAME
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			property: "og:type",
			content: type
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			property: "og:title",
			content: fullTitle
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			property: "og:description",
			content: desc
		}),
		image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			property: "og:image",
			content: image
		}),
		url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			property: "og:url",
			content: url
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			name: "twitter:card",
			content: "summary_large_image"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			name: "twitter:title",
			content: fullTitle
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			name: "twitter:description",
			content: desc
		}),
		image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			name: "twitter:image",
			content: image
		})
	] });
}
var tabs = [
	{
		icon: House,
		key: "home",
		path: "/"
	},
	{
		icon: Search,
		key: "search",
		path: "/search"
	},
	{
		icon: Tag,
		key: "sections",
		path: "/topic/algeria"
	},
	{
		icon: Bookmark,
		key: "bookmarks",
		path: "/bookmarks"
	},
	{
		icon: MessageCircle,
		key: "contact",
		path: "/contact"
	}
];
function BottomNav() {
	const location = useLocation();
	const { t } = useLanguage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "md:hidden fixed bottom-0 right-0 left-0 z-50 bg-background border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.05)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-around h-14",
			children: tabs.map((tab) => {
				const isActive = tab.path === "/" ? location.pathname === "/" : location.pathname.startsWith(tab.path.split("?")[0]);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: tab.path,
					className: `flex flex-col items-center gap-0.5 text-[11px] transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(tab.icon, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t(tab.key) })]
				}, tab.key);
			})
		})
	});
}
function useVideosByIds(ids) {
	const [videos, setVideos] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!ids || ids.length === 0) {
			setVideos([]);
			return;
		}
		let cancelled = false;
		const fetchVideos = async () => {
			const { data, error } = await supabase.from("videos").select("*").in("id", ids);
			if (cancelled) return;
			if (error) {
				console.error("Error fetching videos:", error);
				setVideos([]);
				return;
			}
			const typedVideos = (data || []).map((video) => ({
				...video,
				type: "video",
				thumbnail: video.thumbnail || video.image || ""
			}));
			setVideos(typedVideos);
		};
		fetchVideos();
		return () => {
			cancelled = true;
		};
	}, [ids.join(",")]);
	return videos;
}
function ContinueReading() {
	const rawHistory = useReadingHistory();
	const history = (0, import_react.useMemo)(() => rawHistory.map((h) => typeof h === "string" ? {
		type: "article",
		id: h
	} : h), [rawHistory]);
	const { t } = useLanguage();
	const articleIds = (0, import_react.useMemo)(() => history.filter((item) => item.type === "article").map((item) => item.id), [history]);
	const videoIds = (0, import_react.useMemo)(() => history.filter((item) => item.type === "video").map((item) => item.id), [history]);
	const articles = useArticlesByIds(articleIds);
	const videos = useVideosByIds(videoIds);
	const items = (0, import_react.useMemo)(() => {
		const all = [...articles, ...videos];
		const map = {};
		all.forEach((item) => {
			const key = `${item.type}-${item.id}`;
			map[key] = item;
		});
		return history.map((h) => {
			const key = `${h.type}-${h.id}`;
			return map[key] || null;
		}).filter(Boolean).slice(0, 8);
	}, [
		history,
		articles,
		videos
	]);
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "container py-4 animate-fade-in",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-4 h-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold text-base text-foreground",
					children: t("continueReading")
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: clearHistory,
				className: "text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1",
				"aria-label": t("clearHistory"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3 h-3" }), t("clear")]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-3 overflow-x-auto scrollbar-hide pb-2",
			children: items.map((item, i) => {
				const isVideo = item.type === "video";
				const linkTo = isVideo ? `/video/${item.id}` : `/article/${item.id}`;
				const thumbnail = item.thumbnail || item.image;
				const category = item.category || (isVideo ? "فيديو" : "مقال");
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: linkTo,
					className: "flex-shrink-0 w-44 group animate-fade-in-up",
					style: { animationDelay: `${i * 60}ms` },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative rounded-lg overflow-hidden mb-2 bg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: thumbnail,
								alt: item.title,
								loading: "lazy",
								className: "w-full h-24 object-cover group-hover:scale-105 transition-transform duration-500"
							}), isVideo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-5 h-5 text-white fill-white" })
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-bold text-dz-green",
							children: category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors",
							children: item.title
						})
					]
				}, `${item.type}-${item.id}`);
			})
		})]
	});
}
function PageTransition({ children }) {
	const location = useLocation();
	const [key, setKey] = (0, import_react.useState)(location.pathname + location.search);
	(0, import_react.useEffect)(() => {
		setKey(location.pathname + location.search);
	}, [location.pathname, location.search]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "animate-fade-in",
		children
	}, key);
}
var ALGIERS = {
	lat: 36.7538,
	lon: 3.0588,
	city: "الجزائر"
};
var PRAYER_KEYS = [
	"Fajr",
	"Dhuhr",
	"Asr",
	"Maghrib",
	"Isha"
];
function weatherIcon(code, className = "w-12 h-12 opacity-90") {
	if ([0, 1].includes(code)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className });
	if ([
		2,
		3,
		45,
		48
	].includes(code)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className });
	if ([
		51,
		53,
		55,
		61,
		63,
		65,
		80,
		81,
		82
	].includes(code)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudRain, { className });
	if ([
		71,
		73,
		75,
		77,
		85,
		86
	].includes(code)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudSnow, { className });
	if ([
		95,
		96,
		99
	].includes(code)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudLightning, { className });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className });
}
function weatherDescAr(code) {
	if ([0].includes(code)) return "صافي";
	if ([1, 2].includes(code)) return "غائم جزئياً";
	if ([3].includes(code)) return "غائم";
	if ([45, 48].includes(code)) return "ضباب";
	if ([
		51,
		53,
		55
	].includes(code)) return "رذاذ";
	if ([
		61,
		63,
		65,
		80,
		81,
		82
	].includes(code)) return "أمطار";
	if ([
		71,
		73,
		75,
		85,
		86
	].includes(code)) return "ثلوج";
	if ([
		95,
		96,
		99
	].includes(code)) return "عواصف رعدية";
	return "—";
}
function toMinutes(hhmm) {
	const [h, m] = hhmm.split(":").map(Number);
	return h * 60 + m;
}
function getCoords() {
	return new Promise((resolve) => {
		if (typeof navigator === "undefined" || !navigator.geolocation) return resolve(ALGIERS);
		const timer = setTimeout(() => resolve(ALGIERS), 4e3);
		navigator.geolocation.getCurrentPosition((pos) => {
			clearTimeout(timer);
			resolve({
				lat: pos.coords.latitude,
				lon: pos.coords.longitude
			});
		}, () => {
			clearTimeout(timer);
			resolve(ALGIERS);
		}, {
			maximumAge: 6e5,
			timeout: 4e3
		});
	});
}
async function reverseCity(lat, lon) {
	try {
		const r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=ar`);
		if (!r.ok) return;
		const j = await r.json();
		return j.city || j.locality || j.principalSubdivision;
	} catch {
		return;
	}
}
function WeatherPrayerWidget() {
	const { t, tArr, lang } = useLanguage();
	const prayers = tArr("prayers");
	const days = tArr("weekDays");
	const [coords, setCoords] = (0, import_react.useState)(null);
	const [weather, setWeather] = (0, import_react.useState)(null);
	const [prayer, setPrayer] = (0, import_react.useState)(null);
	const [now, setNow] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), 6e4);
		return () => clearInterval(id);
	}, []);
	(0, import_react.useEffect)(() => {
		let active = true;
		(async () => {
			const c = await getCoords();
			if (!active) return;
			if (!c.city) {
				const city = await reverseCity(c.lat, c.lon);
				if (!active) return;
				setCoords({
					...c,
					city
				});
			} else setCoords(c);
		})();
		return () => {
			active = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!coords) return;
		let active = true;
		(async () => {
			try {
				const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&daily=temperature_2m_max,weathercode&timezone=auto&forecast_days=4`);
				if (!r.ok) return;
				const j = await r.json();
				if (!active) return;
				const daily = (j.daily?.time).map((iso, i) => {
					const d = new Date(iso);
					return {
						day: days[d.getDay() % days.length] ?? "",
						max: Math.round(j.daily.temperature_2m_max[i]),
						code: j.daily.weathercode[i]
					};
				});
				setWeather({
					tempC: Math.round(j.current_weather.temperature),
					code: j.current_weather.weathercode,
					daily
				});
			} catch {}
		})();
		return () => {
			active = false;
		};
	}, [coords, days]);
	const dateKey = now.toDateString();
	(0, import_react.useEffect)(() => {
		if (!coords) return;
		let active = true;
		(async () => {
			try {
				const today = /* @__PURE__ */ new Date();
				const dd = String(today.getDate()).padStart(2, "0");
				const mm = String(today.getMonth() + 1).padStart(2, "0");
				const yyyy = today.getFullYear();
				const r = await fetch(`https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${coords.lat}&longitude=${coords.lon}&method=3`);
				if (!r.ok) return;
				const j = await r.json();
				if (!active) return;
				const t = j.data.timings;
				const cleaned = {};
				PRAYER_KEYS.forEach((k) => {
					cleaned[k] = (t[k] || "").slice(0, 5);
				});
				const h = j.data.date.hijri;
				setPrayer({
					timings: cleaned,
					hijri: `${h.day} ${h.month.ar || h.month.en} ${h.year}هـ`
				});
			} catch {}
		})();
		return () => {
			active = false;
		};
	}, [coords, dateKey]);
	const { nextIdx, countdown } = (0, import_react.useMemo)(() => {
		if (!prayer) return {
			nextIdx: -1,
			countdown: ""
		};
		const nowMin = now.getHours() * 60 + now.getMinutes();
		const mins = PRAYER_KEYS.map((k) => toMinutes(prayer.timings[k] || "00:00"));
		let idx = mins.findIndex((m) => m > nowMin);
		let diff;
		if (idx === -1) {
			idx = 0;
			diff = 1440 - nowMin + mins[0];
		} else diff = mins[idx] - nowMin;
		const h = Math.floor(diff / 60);
		const m = diff % 60;
		const cd = lang === "ar" ? `${h > 0 ? `${h} س ` : ""}${m} د` : `${h > 0 ? `${h}h ` : ""}${m}m`;
		return {
			nextIdx: idx,
			countdown: cd
		};
	}, [
		prayer,
		now,
		lang
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "container py-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid sm:grid-cols-2 gap-3 animate-float-in",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/90 to-primary text-primary-foreground p-4 shadow-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 text-xs opacity-80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-3 h-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: coords?.city || t("city") })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-3xl font-bold mt-1",
								children: [weather ? `${weather.tempC}°` : "—", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-base font-normal opacity-80",
									children: t("weatherUnit")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs opacity-90",
								children: weather ? weatherDescAr(weather.code) : t("weatherDesc")
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative",
							children: weather ? weatherIcon(weather.code) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-10 h-10 animate-spin opacity-80" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative mt-3 grid grid-cols-4 gap-2 text-center text-xs",
						children: (weather?.daily ?? Array.from({ length: 4 }).map((_, i) => ({
							day: days[i] ?? "",
							max: 0,
							code: 0
						}))).slice(0, 4).map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white/10 rounded-lg py-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "opacity-80",
								children: d.day
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold",
								children: weather ? `${d.max}°` : "—"
							})]
						}, i))
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-card border border-border p-4 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "w-4 h-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-foreground text-sm",
								children: t("prayerTimes")
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground",
							children: prayer?.hijri ?? t("hijriDate")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-5 gap-1.5",
						children: prayers.map((p, i) => {
							const time = prayer?.timings[PRAYER_KEYS[i]] ?? "—";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `text-center rounded-lg py-2 transition-all ${i === nextIdx ? "bg-accent text-accent-foreground shadow-sm scale-[1.05]" : "bg-muted text-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] font-medium",
									children: p
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-bold mt-0.5 tabular-nums",
									children: time
								})]
							}, p);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 text-[11px] text-muted-foreground text-center",
						children: prayer && nextIdx >= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							t("nextPrayer"),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-accent",
								children: prayers[nextIdx]
							}),
							" ",
							lang === "ar" ? `بعد ${countdown}` : `in ${countdown}`
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "opacity-70",
							children: "…"
						})
					})
				]
			})]
		})
	});
}
function StoryCardSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-4 py-4 border-b border-border md:flex-col md:border-b-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-[40%] md:w-full flex-shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton w-full h-24 md:h-44" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col justify-center flex-1 md:pt-3 gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-3 w-16" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-4 w-full" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-4 w-3/4" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-3 w-1/2 mt-1" })
			]
		})]
	});
}
function HeroSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "container py-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid md:grid-cols-3 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton w-full h-56 md:h-96 rounded-xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-6 w-3/4 mt-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-4 w-1/2 mt-2" })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden md:block space-y-4",
				children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-4 w-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-3 w-2/3" })]
				}, i))
			})]
		})
	});
}
function ArticleSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton w-full h-56 md:h-96" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container max-w-3xl py-6 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-5 w-20" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-8 w-full" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-8 w-3/4" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-4 w-1/2 mt-4" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3 mt-6",
					children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-4 w-full" }, i))
				})
			]
		})]
	});
}
function useTheme$1() {
	const [isDark, setIsDark] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") return localStorage.getItem("max-theme") === "dark";
		return false;
	});
	(0, import_react.useEffect)(() => {
		const root = document.documentElement;
		if (isDark) {
			root.classList.add("dark");
			localStorage.setItem("max-theme", "dark");
		} else {
			root.classList.remove("dark");
			localStorage.setItem("max-theme", "light");
		}
	}, [isDark]);
	return {
		isDark,
		toggle: () => setIsDark((d) => !d)
	};
}
function FeedItem({ article, index }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryCard, {
		article,
		index
	}), index === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "md:col-span-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdBanner, { variant: "inline" })
	})] });
}
function Index() {
	const { isDark, toggle } = useTheme$1();
	const { t, lang } = useLanguage();
	const isRTL = lang === "ar";
	const [params, setParams] = useSearchParams();
	const activeCategory = params.get("cat") || "all";
	const { articles, loading } = useArticles();
	const setActive = (key) => {
		if (key === "all") setParams({});
		else setParams({ cat: key });
	};
	const filtered = (0, import_react.useMemo)(() => activeCategory === "all" ? articles : articles.filter((a) => a.categoryKey === activeCategory), [articles, activeCategory]);
	const featured = filtered.find((a) => a.isFeatured) || filtered[0];
	const sidebar = filtered.filter((a) => a.id !== featured?.id).slice(0, 3);
	const feedItems = filtered.filter((a) => a.id !== featured?.id && !sidebar.some((s) => s.id === a.id));
	const hasArticles = filtered.length > 0;
	const isLoading = loading;
	const renderSkeletonFeed = (count = 4) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "md:grid md:grid-cols-2 md:gap-4",
		children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryCardSkeleton, {}, i))
	});
	const renderSkeletonSidebar = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "hidden md:block space-y-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-muted/20 rounded-lg p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-bold text-lg mb-4",
				children: t("mostRead")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryCardSkeleton, {}, i))
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col transition-colors duration-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SEO, {
				title: activeCategory === "all" ? void 0 : lang === "en" ? categories.find((c) => c.key === activeCategory)?.labelEn : categories.find((c) => c.key === activeCategory)?.label,
				keywords: lang === "en" ? "Algeria news, Arab news, world news, politics, sports, economy" : "أخبار الجزائر, أخبار عربية, أخبار دولية, سياسة, رياضة, اقتصاد"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
				isDark,
				onToggleTheme: toggle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreakingTicker, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryTabs, {
				active: activeCategory,
				onChange: setActive
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "main-content",
				className: "flex-1 pb-16 md:pb-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "sr-only",
					children: lang === "en" ? "MAX NEWS — Latest news from Algeria and the world" : "MAX NEWS — آخر الأخبار من الجزائر والعالم"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageTransition, { children: [
					isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroSkeleton, {}) : hasArticles ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroSection, {
						featured,
						sidebar
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "container py-16",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-dashed border-border bg-card p-10 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-5xl mb-4",
									children: "📰"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-bold",
									children: isRTL ? "لا توجد مقالات بعد" : "No articles yet"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-muted-foreground",
									children: isRTL ? "سيتم نشر أول الأخبار قريبًا، تابعنا لاحقًا." : "We'll publish our first stories soon. Please check back later."
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "container",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdBanner, { variant: "leaderboard" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeatherPrayerWidget, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContinueReading, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "container pb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid md:grid-cols-3 gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline justify-between mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-bold text-lg text-foreground",
										children: activeCategory === "all" ? t("latestNews") : (() => {
											const cat = categories.find((c) => c.key === activeCategory);
											return lang === "en" ? cat?.labelEn : cat?.label;
										})()
									}), activeCategory !== "all" && !isLoading && hasArticles && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: `/topic/${activeCategory}`,
										className: "text-xs text-primary hover:underline",
										children: t("viewSection")
									})]
								}), isLoading ? renderSkeletonFeed(4) : !hasArticles ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-dashed border-border bg-card p-8 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-4xl mb-3",
											children: "📰"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-semibold text-lg",
											children: isRTL ? "لا توجد أخبار منشورة بعد" : "No published articles yet"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-muted-foreground",
											children: isRTL ? "سيظهر المحتوى هنا بمجرد نشر أول مقال." : "Articles will appear here once the first story is published."
										})
									]
								}) : feedItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground py-6 text-center",
									children: t("noMoreArticles")
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "md:grid md:grid-cols-2 md:gap-4",
									children: feedItems.map((article, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedItem, {
										article,
										index: i
									}, article.id))
								})]
							}), isLoading ? renderSkeletonSidebar() : hasArticles ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
								className: "hidden md:block space-y-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MostRead, {})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
								className: "hidden md:block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-xl border border-dashed border-border bg-card p-6 text-center text-muted-foreground",
									children: isRTL ? "لا توجد مقالات لعرض الأكثر قراءة." : "No articles available yet."
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsletterSignup, {})]
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {})
		]
	});
}
function ReadingProgress() {
	const [progress, setProgress] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const onScroll = () => {
			const h = document.documentElement;
			const total = h.scrollHeight - h.clientHeight;
			setProgress(total > 0 ? h.scrollTop / total * 100 : 0);
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed top-0 right-0 left-0 h-1 z-[60] bg-transparent",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full bg-gradient-to-l from-primary to-dz-green transition-[width] duration-150",
			style: { width: `${progress}%` }
		})
	});
}
function TableOfContents({ body }) {
	const [headings, setHeadings] = (0, import_react.useState)([]);
	const [active, setActive] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const lines = body.split("\n\n");
		const items = [];
		lines.forEach((line, i) => {
			const trimmed = line.trim();
			if (trimmed.startsWith("## ")) {
				const text = trimmed.replace(/^##\s+/, "");
				items.push({
					id: `h-${i}`,
					text
				});
			}
		});
		setHeadings(items);
	}, [body]);
	(0, import_react.useEffect)(() => {
		if (headings.length === 0) return;
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) setActive(e.target.id);
			});
		}, { rootMargin: "-30% 0px -60% 0px" });
		headings.forEach((h) => {
			const el = document.getElementById(h.id);
			if (el) observer.observe(el);
		});
		return () => observer.disconnect();
	}, [headings]);
	if (headings.length < 2) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "bg-card border border-border rounded-xl p-4 mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-foreground font-bold mb-3 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "w-4 h-4" }), "محتويات المقال"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-1.5 text-sm",
			children: headings.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: `#${h.id}`,
				className: `block py-1 border-r-2 pr-3 transition-colors ${active === h.id ? "border-primary text-primary font-medium" : "border-border text-muted-foreground hover:text-foreground"}`,
				children: h.text
			}) }, h.id))
		})]
	});
}
var REACTIONS = [
	{
		key: "like",
		emoji: "👍",
		label: "أعجبني"
	},
	{
		key: "love",
		emoji: "❤️",
		label: "أحببته"
	},
	{
		key: "insightful",
		emoji: "💡",
		label: "مفيد"
	},
	{
		key: "sad",
		emoji: "😢",
		label: "حزين"
	},
	{
		key: "angry",
		emoji: "😠",
		label: "غاضب"
	}
];
function Reactions({ articleId }) {
	const [, force] = (0, import_react.useState)(0);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const { toast } = useToast();
	const storageKey = `reaction:${articleId}`;
	(0, import_react.useEffect)(() => {
		setPicked(localStorage.getItem(storageKey));
		return subscribe(() => force((n) => n + 1));
	}, [articleId]);
	const counts = {};
	reactionsApi.forArticle(articleId).forEach((r) => {
		counts[r.reaction] = (counts[r.reaction] ?? 0) + 1;
	});
	const react = (key) => {
		if (picked) {
			toast({ title: "لقد قمت بالتفاعل مسبقاً" });
			return;
		}
		reactionsApi.add(articleId, key);
		localStorage.setItem(storageKey, key);
		setPicked(key);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-card border border-border rounded-xl p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium text-foreground mb-3",
			children: "ما رأيك في هذا المقال؟"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: REACTIONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => react(r.key),
				disabled: !!picked,
				className: `flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-sm ${picked === r.key ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:border-primary/40 hover:bg-muted"} ${picked && picked !== r.key ? "opacity-60" : ""}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg leading-none",
						children: r.emoji
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs",
						children: r.label
					}),
					counts[r.key] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold text-muted-foreground",
						children: counts[r.key]
					}) : null
				]
			}, r.key))
		})]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
			outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-10 px-4 py-2",
			sm: "h-9 rounded-md px-3",
			lg: "h-11 rounded-md px-8",
			icon: "h-10 w-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function Comments({ articleId }) {
	const [, force] = (0, import_react.useState)(0);
	const [name, setName] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const { toast } = useToast();
	(0, import_react.useEffect)(() => subscribe(() => force((n) => n + 1)), []);
	const comments = commentsApi.forArticle(articleId, "approved");
	const submit = (e) => {
		e.preventDefault();
		if (!name.trim() || !message.trim()) return;
		commentsApi.add({
			article_id: articleId,
			name: name.trim(),
			message: message.trim()
		});
		setName("");
		setMessage("");
		toast({
			title: "شكراً لك",
			description: "سيظهر تعليقك بعد المراجعة"
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "font-bold text-lg text-foreground mb-4 flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-5 h-5" }),
					"التعليقات (",
					comments.length,
					")"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "bg-card border border-border rounded-xl p-4 mb-6 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "اسمك",
						maxLength: 80,
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: message,
						onChange: (e) => setMessage(e.target.value),
						placeholder: "اكتب تعليقك بأدب...",
						rows: 3,
						maxLength: 1e3,
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "يخضع التعليق للمراجعة قبل النشر"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "إرسال"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [comments.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground text-center py-6",
					children: "كن أول من يعلّق"
				}), comments.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border border-border rounded-xl p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold",
							children: c.name[0]?.toUpperCase()
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-foreground",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted-foreground",
							children: new Date(c.created_at).toLocaleDateString("ar-DZ")
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap",
						children: c.message
					})]
				}, c.id))]
			})
		]
	});
}
var KEY$1 = "max:bookmarks";
function read() {
	try {
		return JSON.parse(localStorage.getItem(KEY$1) || "[]");
	} catch {
		return [];
	}
}
function useBookmarks() {
	const [ids, setIds] = (0, import_react.useState)(read);
	(0, import_react.useEffect)(() => {
		const onStorage = () => setIds(read());
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);
	const toggle = (id) => {
		setIds((prev) => {
			const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
			localStorage.setItem(KEY$1, JSON.stringify(next));
			return next;
		});
	};
	const has = (id) => ids.includes(id);
	return {
		ids,
		toggle,
		has
	};
}
function BookmarkButton({ articleId, className }) {
	const { has, toggle } = useBookmarks();
	const { toast } = useToast();
	const saved = has(articleId);
	const onClick = () => {
		toggle(articleId);
		toast({ title: saved ? "أُزيل من المحفوظات" : "تم الحفظ" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick,
		"aria-label": "حفظ المقال",
		className: `transition-colors ${saved ? "text-primary" : "text-muted-foreground hover:text-foreground"} ${className ?? ""}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: `w-5 h-5 ${saved ? "fill-current" : ""}` })
	});
}
function AudioPlayer({ text }) {
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [supported, setSupported] = (0, import_react.useState)(true);
	const utterRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined" || !("speechSynthesis" in window)) setSupported(false);
		return () => {
			if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
		};
	}, []);
	const start = () => {
		if (!supported) return;
		window.speechSynthesis.cancel();
		const u = new SpeechSynthesisUtterance(text);
		u.lang = "ar-SA";
		u.rate = .95;
		u.onend = () => setPlaying(false);
		u.onerror = () => setPlaying(false);
		utterRef.current = u;
		window.speechSynthesis.speak(u);
		setPlaying(true);
	};
	const pause = () => {
		window.speechSynthesis.pause();
		setPlaying(false);
	};
	const stop = () => {
		window.speechSynthesis.cancel();
		setPlaying(false);
	};
	if (!supported) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center gap-2 bg-muted/60 rounded-full px-3 py-1.5 text-xs",
		children: !playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: start,
			className: "flex items-center gap-1.5 text-foreground hover:text-primary transition-colors",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-3.5 h-3.5 fill-current" }), "استمع للمقال"]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: pause,
			className: "flex items-center gap-1 text-primary",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "w-3.5 h-3.5 fill-current" }), "إيقاف مؤقت"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: stop,
			className: "flex items-center gap-1 text-muted-foreground hover:text-foreground",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "w-3.5 h-3.5 fill-current" })
		})] })
	});
}
function TranslateButton({ title: _title, body: _body }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const { toast } = useToast();
	const translate = (label) => {
		setOpen(false);
		toast({
			title: "الترجمة معطّلة",
			description: `الترجمة إلى ${label} تتطلب الاتصال بالخادم.`
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setOpen((o) => !o),
			className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 hover:bg-muted text-xs text-foreground transition-colors",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, { className: "w-3.5 h-3.5" }), "ترجمة"]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute top-full mt-2 right-0 bg-popover border border-border rounded-lg shadow-lg z-30 min-w-[140px] overflow-hidden",
			children: [{
				code: "fr",
				label: "Français"
			}, {
				code: "en",
				label: "English"
			}].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => translate(l.label),
				className: "block w-full text-right px-4 py-2 text-sm text-popover-foreground hover:bg-muted",
				children: l.label
			}, l.code))
		})]
	});
}
var Popover = Popover$1;
var PopoverTrigger = PopoverTrigger$1;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent$1, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
	...props
}) }));
PopoverContent.displayName = PopoverContent$1.displayName;
function ShareMenu({ title, url, className }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
	const links = {
		whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + shareUrl)}`,
		facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
		twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`
	};
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl);
			setCopied(true);
			ue.success("تم نسخ الرابط");
			setTimeout(() => setCopied(false), 1800);
		} catch {
			ue.error("تعذر نسخ الرابط");
		}
	};
	const handleNative = async () => {
		if (typeof navigator !== "undefined" && navigator.share) try {
			await navigator.share({
				title,
				url: shareUrl
			});
			setOpen(false);
			return true;
		} catch {}
		return false;
	};
	const items = [
		{
			key: "whatsapp",
			label: "واتساب",
			icon: MessageCircle,
			color: "text-[#25D366]",
			onClick: () => window.open(links.whatsapp, "_blank")
		},
		{
			key: "facebook",
			label: "فيسبوك",
			icon: Facebook,
			color: "text-[#1877F2]",
			onClick: () => window.open(links.facebook, "_blank")
		},
		{
			key: "twitter",
			label: "X / تويتر",
			icon: Share2,
			color: "text-foreground",
			onClick: () => window.open(links.twitter, "_blank")
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: async (e) => {
					if (await handleNative()) e.preventDefault();
				},
				className: `p-2 rounded-full hover:bg-muted text-foreground transition-all hover:scale-110 ${className ?? ""}`,
				"aria-label": "مشاركة",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-5 h-5" })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
			align: "end",
			className: "w-56 p-2 animate-scale-in",
			dir: "rtl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						it.onClick();
						setOpen(false);
					},
					className: "w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(it.icon, { className: `w-4 h-4 ${it.color}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: it.label })]
				}, it.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleCopy,
					className: "w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm text-foreground border-t border-border mt-1 pt-2",
					children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4 text-dz-green" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "w-4 h-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copied ? "تم النسخ" : "نسخ الرابط" })]
				})]
			})
		})]
	});
}
var KEY = "max-font-size";
var SIZES = [
	16,
	18,
	20,
	22
];
function FontSizeControl({ targetSelector = ".prose-article" }) {
	const [idx, setIdx] = (0, import_react.useState)(() => {
		const stored = Number(localStorage.getItem(KEY));
		const i = SIZES.indexOf(stored);
		return i >= 0 ? i : 1;
	});
	(0, import_react.useEffect)(() => {
		const el = document.querySelector(targetSelector);
		if (el) el.style.fontSize = `${SIZES[idx]}px`;
		localStorage.setItem(KEY, String(SIZES[idx]));
	}, [idx, targetSelector]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex items-center gap-1 bg-muted rounded-full px-1 py-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setIdx((i) => Math.max(0, i - 1)),
				disabled: idx === 0,
				"aria-label": "تصغير الخط",
				className: "w-7 h-7 flex items-center justify-center rounded-full hover:bg-background transition-colors disabled:opacity-40 text-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "w-3.5 h-3.5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Type, { className: "w-3.5 h-3.5 text-muted-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setIdx((i) => Math.min(SIZES.length - 1, i + 1)),
				disabled: idx === SIZES.length - 1,
				"aria-label": "تكبير الخط",
				className: "w-7 h-7 flex items-center justify-center rounded-full hover:bg-background transition-colors disabled:opacity-40 text-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" })
			})
		]
	});
}
function SourceCitations({ sources }) {
	const { isRTL } = useLanguage();
	if (!sources?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-8 rounded-xl border border-border bg-muted/30 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
			className: "flex items-center gap-2 font-bold text-foreground mb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-4 h-4 text-primary" }), isRTL ? "المصادر" : "Sources"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "space-y-2 list-decimal list-inside marker:text-muted-foreground",
			children: sources.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: s.url,
					target: "_blank",
					rel: "noopener noreferrer nofollow",
					className: "inline-flex items-center gap-1 text-primary hover:underline break-all",
					children: [s.title || s.url, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3 h-3 flex-shrink-0" })]
				})
			}, i))
		})]
	});
}
function AuthorCard({ name }) {
	const { isRTL } = useLanguage();
	const slug = authorSlug(name);
	const author = authorsApi.byName(name) ?? {
		slug,
		name,
		bio: "",
		avatar_url: null
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-8 rounded-xl border border-border bg-card p-5 flex gap-4 items-start",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: `/author/${slug}`,
			className: "flex-shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-xl",
				children: author.name[0]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: `/author/${slug}`,
						className: "font-bold text-foreground hover:text-primary transition-colors",
						children: author.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: `/author/${slug}`,
						className: "text-xs text-primary hover:underline",
						children: isRTL ? "كل مقالات الكاتب ←" : "All articles →"
					})]
				}),
				author.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1 leading-relaxed",
					children: author.bio
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 mt-2 text-xs text-muted-foreground",
					children: [author.twitter && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `https://twitter.com/${author.twitter.replace("@", "")}`,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "inline-flex items-center gap-1 hover:text-primary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Twitter, { className: "w-3 h-3" }),
							" ",
							author.twitter
						]
					}), author.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `mailto:${author.email}`,
						className: "inline-flex items-center gap-1 hover:text-primary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-3 h-3" }),
							" ",
							author.email
						]
					})]
				})
			]
		})]
	});
}
function Paywall() {
	const { isRTL } = useLanguage();
	const { subscribe } = useSubscription();
	const { toast } = useToast();
	const handle = () => {
		subscribe();
		toast({
			title: isRTL ? "تم تفعيل اشتراكك" : "Subscription activated",
			description: isRTL ? "استمتع بمحتوى MAX NEWS بريميوم" : "Enjoy MAX NEWS Premium content"
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative -mt-24 pt-24 pb-2 pointer-events-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent to-background pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/5 via-card to-card p-6 md:p-8 shadow-elegant",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/15 mx-auto mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "w-7 h-7 text-amber-500" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-xl md:text-2xl font-bold text-foreground text-center",
					children: isRTL ? "تابع القراءة مع MAX NEWS بريميوم" : "Continue reading with MAX NEWS Premium"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground text-center mt-2 max-w-md mx-auto",
					children: isRTL ? "هذا المقال محتوى حصري للمشتركين. اشترك لقراءته كاملاً." : "This article is exclusive to subscribers. Subscribe to read the full story."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 space-y-2 max-w-sm mx-auto",
					children: (isRTL ? [
						"وصول كامل للمقالات الحصرية",
						"تجربة قراءة بدون إعلانات",
						"تحليلات معمّقة من أبرز محرّرينا",
						"دعم الصحافة المستقلة في الجزائر"
					] : [
						"Full access to exclusive articles",
						"Ad-free reading experience",
						"In-depth analysis from top editors",
						"Support independent journalism in Algeria"
					]).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-2 text-sm text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4 text-dz-green mt-0.5 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: b })]
					}, b))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: handle,
						size: "lg",
						className: "bg-amber-500 hover:bg-amber-600 text-white gap-2 w-full max-w-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "w-4 h-4" }), isRTL ? "اشترك الآن — ٤٩٩ دج/شهر" : "Subscribe now — 499 DZD/month"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground",
						children: isRTL ? "تجربة مجانية ٧ أيام · إلغاء في أي وقت" : "7-day free trial · cancel anytime"
					})]
				})
			]
		})]
	});
}
function getYoutubeId$1(url) {
	for (const pattern of [
		/youtu\.be\/([^?&/]+)/,
		/youtube\.com\/watch\?v=([^?&/]+)/,
		/youtube\.com\/shorts\/([^?&/]+)/,
		/youtube\.com\/embed\/([^?&/]+)/
	]) {
		const match = url.match(pattern);
		if (match) return match[1];
	}
	return null;
}
function getYoutubeEmbedUrl(url) {
	const id = getYoutubeId$1(url);
	return id ? `https://www.youtube.com/embed/${id}` : null;
}
function ArticlePage() {
	const { id: uuidParam, code } = useParams();
	const id = uuidParam ?? code;
	const navigate = useNavigate();
	const { isDark, toggle } = useTheme$1();
	const { t, isRTL } = useLanguage();
	const { article, loading } = useArticle(id);
	(0, import_react.useEffect)(() => {
		if (uuidParam && article?.shortCode) navigate(`/${article.shortCode}`, { replace: true });
	}, [
		uuidParam,
		article?.shortCode,
		navigate
	]);
	const related = useRelated(article);
	const { active: isSubscribed } = useSubscription();
	const [showYoutubeEmbed, setShowYoutubeEmbed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (article) trackView(article.id);
	}, [article?.id]);
	(0, import_react.useEffect)(() => {
		window.scrollTo(0, 0);
	}, [id]);
	const isVideo = (art) => art?.media_type === "youtube" || art?.media_type === "video";
	const getDisplayImage = (art) => {
		if (!art) return "";
		if (isVideo(art)) return art.video_thumbnail || art.image || "";
		return art.image || "";
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
			isDark,
			onToggleTheme: toggle
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleSkeleton, {})]
	});
	if (!article) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col items-center justify-center gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-foreground",
			children: t("articleNotFound")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "text-primary hover:underline",
			children: t("backToHome")
		})]
	});
	const paragraphs = article.body.split("\n\n");
	const renderParagraph = (p, i) => {
		const trimmed = p.trim();
		if (trimmed.startsWith("## ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			id: `h-${i}`,
			className: "text-xl md:text-2xl font-bold text-foreground mt-8 mb-4 scroll-mt-20",
			children: trimmed.replace(/^##\s+/, "")
		}, i);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: i === 0 ? "border-r-4 border-primary pr-4 font-medium" : "",
			children: p
		}, i);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen pb-20 md:pb-0 transition-colors duration-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadingProgress, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
				isDark,
				onToggleTheme: toggle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				id: "main-content",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageTransition, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full h-56 md:h-96 overflow-hidden relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-full text-sm font-medium hover:bg-background transition-colors flex items-center gap-1.5 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "w-4 h-4 rotate-45" }), t("backToHome")]
					}), isVideo(article) && article.media_type === "youtube" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full h-full bg-black",
						children: showYoutubeEmbed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							src: getYoutubeEmbedUrl(article.video_url || "") + "?autoplay=1",
							title: "YouTube video",
							className: "w-full h-full",
							allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
							allowFullScreen: true
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full h-full cursor-pointer group",
							onClick: () => setShowYoutubeEmbed(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: getDisplayImage(article),
								alt: article.title,
								className: "w-full h-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-red-600/90 rounded-full p-4 md:p-6 shadow-lg group-hover:scale-110 transition",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-8 h-8 md:w-12 md:h-12 text-white fill-white" })
								})
							})]
						})
					}) : isVideo(article) && article.media_type === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full h-full bg-black",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							src: article.video_url || void 0,
							poster: article.video_thumbnail || article.image,
							controls: true,
							className: "w-full h-full object-cover",
							playsInline: true
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full h-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: getDisplayImage(article),
							alt: article.title,
							className: "w-full h-full object-cover"
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "container max-w-3xl py-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: `/topic/${article.categoryKey}`,
									className: "bg-dz-green text-accent-foreground px-3 py-1 rounded-sm text-xs font-bold hover:opacity-90",
									children: article.category
								}),
								article.isPremium && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PremiumBadge, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FactCheckBadge, { label: article.factCheck }),
								isVideo(article) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "bg-blue-600 text-white px-2 py-0.5 rounded-sm text-xs font-bold flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-3 h-3 fill-current" }), "فيديو"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl md:text-4xl font-bold text-foreground mt-4 mb-4 leading-snug",
							children: article.title
						}),
						article.excerpt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base md:text-lg text-muted-foreground mb-4 leading-relaxed",
							children: article.excerpt
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between flex-wrap gap-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: `/author/${authorSlug(article.author)}`,
								className: "flex items-center gap-3 text-sm text-muted-foreground group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm group-hover:bg-primary/30 transition-colors",
									children: article.author[0]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground group-hover:text-primary transition-colors",
									children: article.author
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: article.date }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											article.readTime,
											" ",
											t("readDuration")
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3 h-3" }),
												" ",
												article.viewCount
											]
										})
									]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontSizeControl, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioPlayer, { text: `${article.title}. ${article.body}` }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TranslateButton, {
										title: article.title,
										body: article.body
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareMenu, { title: article.title }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkButton, { articleId: article.id })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mb-8 pb-4 border-b border-border" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableOfContents, { body: article.body }),
						article.isPremium && !isSubscribed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "prose-article text-foreground text-lg leading-[1.8] space-y-6 max-h-[420px] overflow-hidden relative",
							children: paragraphs.slice(0, 2).map(renderParagraph)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paywall, {})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "prose-article text-foreground text-lg leading-[1.8] space-y-6",
							children: paragraphs.flatMap((p, i) => {
								const node = renderParagraph(p, i);
								return i === 1 ? [node, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdBanner, { variant: "inline" }, `ad-${i}`)] : [node];
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceCitations, { sources: article.sources })] }),
						article.tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2 mt-8 pt-4 border-t border-border",
							children: article.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: `/search?tag=${encodeURIComponent(tag)}`,
								className: "px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs hover:bg-primary/10 hover:text-primary transition-colors",
								children: ["#", tag]
							}, tag))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthorCard, { name: article.author }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reactions, { articleId: article.id })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdBanner, { variant: "leaderboard" }),
						related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-lg text-foreground mb-4",
								children: t("relatedArticles")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-4 overflow-x-auto scrollbar-hide pb-2",
								children: related.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: r.shortCode ? `/${r.shortCode}` : `/article/${r.id}`,
									className: "flex-shrink-0 w-56 group",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-lg overflow-hidden mb-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: r.image,
												alt: r.title,
												loading: "lazy",
												className: "w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-bold text-dz-green",
											children: r.category
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-sm font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors",
											children: r.title
										})
									]
								}, r.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comments, { articleId: article.id })
					]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:hidden fixed bottom-14 right-0 left-0 bg-background/95 backdrop-blur-md border-t border-border flex items-center justify-around h-12 z-40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareMenu, { title: article.title }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkButton, { articleId: article.id }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => window.scrollTo({
							top: 0,
							behavior: "smooth"
						}),
						className: "text-muted-foreground",
						"aria-label": "أعلى الصفحة",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "w-5 h-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {})
		]
	});
}
function ContactPage() {
	const { isDark, toggle } = useTheme$1();
	const { t } = useLanguage();
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const handleSubmit = (e) => {
		e.preventDefault();
		feedbackApi.add(name, email, message);
		setSubmitted(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen pb-16 md:pb-0 transition-colors duration-300",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
				isDark,
				onToggleTheme: toggle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container max-w-lg py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold text-foreground mb-2",
						children: t("contactTitle")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground mb-8",
						children: t("contactSub")
					}),
					submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center py-16",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "w-16 h-16 text-dz-green mx-auto mb-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xl font-bold text-foreground",
								children: t("contactSuccess")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground mt-2",
								children: t("contactSuccessSub")
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-foreground mb-1.5",
								children: t("fName")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "text",
								maxLength: 100,
								value: name,
								onChange: (e) => setName(e.target.value),
								className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
								placeholder: t("fNamePh")
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-foreground mb-1.5",
								children: t("fEmail")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "email",
								maxLength: 255,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
								placeholder: "example@email.com",
								dir: "ltr"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-sm font-medium text-foreground mb-1.5",
									children: t("fMessage")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									required: true,
									rows: 5,
									maxLength: 500,
									value: message,
									onChange: (e) => setMessage(e.target.value),
									className: "w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none",
									placeholder: t("fMessagePh")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [message.length, "/500"]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-opacity",
								children: t("send")
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {})
		]
	});
}
function SearchPage() {
	const { isDark, toggle } = useTheme$1();
	const { t, lang } = useLanguage();
	const [params, setParams] = useSearchParams();
	const [q, setQ] = (0, import_react.useState)(params.get("q") || "");
	const [cat, setCat] = (0, import_react.useState)(params.get("cat") || "all");
	const [tag, setTag] = (0, import_react.useState)(params.get("tag") || "");
	const [sort, setSort] = (0, import_react.useState)("newest");
	const { results } = useSearchArticles({
		q,
		cat,
		tag,
		sort
	});
	const onSubmit = (e) => {
		e.preventDefault();
		const next = new URLSearchParams();
		if (q.trim()) next.set("q", q.trim());
		if (cat !== "all") next.set("cat", cat);
		if (tag) next.set("tag", tag);
		setParams(next);
	};
	const clear = () => {
		setQ("");
		setCat("all");
		setTag("");
		setSort("newest");
		setParams({});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SEO, {
				title: lang === "en" ? "Search" : "بحث",
				description: lang === "en" ? "Search MAX NEWS for the latest Algerian, Arab and international news, by keyword, category or tag." : "ابحث في MAX NEWS عن آخر الأخبار الجزائرية والعربية والدولية حسب الكلمة أو القسم أو الوسم."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
				isDark,
				onToggleTheme: toggle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "main-content",
				className: "flex-1 container py-6 md:py-10 pb-16 md:pb-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-6 h-6 text-primary" }), t("searchTitle")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit,
						className: "bg-card border border-border rounded-2xl p-4 md:p-5 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: `absolute ${lang === "ar" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: t("searchPlaceholder"),
								"aria-label": t("searchPlaceholder"),
								className: `w-full ${lang === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary text-foreground`
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2 items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: cat,
									onChange: (e) => setCat(e.target.value),
									"aria-label": lang === "en" ? "Category" : "القسم",
									className: "px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground",
									children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c.key,
										children: lang === "en" ? c.labelEn : c.label
									}, c.key))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: sort,
									onChange: (e) => setSort(e.target.value),
									"aria-label": lang === "en" ? "Sort" : "الترتيب",
									className: "px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "newest",
											children: t("sortNewest")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "oldest",
											children: t("sortOldest")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "popular",
											children: t("sortPopular")
										})
									]
								}),
								tag && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium",
									children: [
										"#",
										tag,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setTag(""),
											"aria-label": lang === "en" ? "Remove tag" : "إزالة الوسم",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3 h-3" })
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90",
									children: t("searchBtn")
								}),
								(q || cat !== "all" || tag) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: clear,
									className: "px-3 py-2 text-sm text-muted-foreground hover:text-foreground",
									children: t("reset")
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground mb-4",
								children: [
									results.length,
									" ",
									t("resultsCount")
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4",
								children: results.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryCard, { article: a }, a.id))
							}),
							results.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-center py-16 text-muted-foreground",
								children: t("noResults")
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {})
		]
	});
}
function TopicPage() {
	const { key } = useParams();
	const { isDark, toggle } = useTheme$1();
	const { t, lang } = useLanguage();
	const cat = categories.find((c) => c.key === key);
	const catLabel = lang === "en" ? cat?.labelEn : cat?.label;
	const { articles, loading } = useArticles({ categoryKey: key });
	const featured = articles[0];
	const sidebar = articles.slice(1, 4);
	const rest = articles.slice(4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SEO, {
				title: catLabel ?? (lang === "en" ? "Section" : "قسم"),
				description: lang === "en" ? `Latest ${catLabel ?? "news"} stories from Algeria and around the world on MAX NEWS.` : `أحدث أخبار ${catLabel ?? ""} من الجزائر والعالم على MAX NEWS.`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
				isDark,
				onToggleTheme: toggle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-navy text-primary-foreground py-8 md:py-12 border-b-4 border-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "text-xs text-primary-foreground/70 hover:text-primary-foreground",
							children: t("backHome")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl md:text-5xl font-bold mt-2",
							children: catLabel ?? (lang === "en" ? "Section" : "قسم")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-primary-foreground/80 mt-2 text-sm md:text-base",
							children: [
								articles.length,
								" ",
								t("topicCount")
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				id: "main-content",
				className: "flex-1 pb-16 md:pb-0",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "container py-16 text-center text-muted-foreground",
					children: t("loading")
				}) : articles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "container py-16 text-center text-muted-foreground",
					children: t("noArticlesTopic")
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [featured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "container py-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroSection, {
						featured,
						sidebar
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "container pb-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-3 gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "font-bold text-lg text-foreground mb-3",
									children: [
										t("moreFrom"),
										" ",
										catLabel
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "md:grid md:grid-cols-2 md:gap-4",
									children: rest.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryCard, { article: a }, a.id))
								}),
								rest.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground py-6 text-center",
									children: t("noMoreArticles")
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
							className: "hidden md:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MostRead, {})
						})]
					})
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {})
		]
	});
}
function BookmarksPage() {
	const { isDark, toggle } = useTheme$1();
	const { t, lang } = useLanguage();
	const { ids } = useBookmarks();
	const items = useArticlesByIds(ids);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen pb-16 md:pb-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SEO, {
				title: lang === "en" ? "Bookmarks" : "المحفوظات",
				description: lang === "en" ? "Your saved articles on MAX NEWS — revisit your bookmarked Algerian, Arab and world news anytime." : "مقالاتك المحفوظة على MAX NEWS — عُد إلى الأخبار التي حفظتها في أي وقت."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
				isDark,
				onToggleTheme: toggle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "main-content",
				className: "container py-6 md:py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "w-6 h-6 text-primary fill-primary" }), t("bookmarksTitle")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground mb-6",
						children: [
							items.length,
							" ",
							t("bookmarksCount")
						]
					}),
					items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center py-16 bg-card border border-border rounded-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "w-12 h-12 mx-auto text-muted-foreground/50 mb-3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-foreground font-medium mb-1",
								children: t("noBookmarks")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground mb-4",
								children: t("bookmarksHint")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "inline-block px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium",
								children: t("browseNews")
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4",
						children: items.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryCard, { article: a }, a.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {})
		]
	});
}
var NotFound = () => {
	const location = useLocation();
	(0, import_react.useEffect)(() => {
		console.error("404 Error: User attempted to access non-existent route:", location.pathname);
	}, [location.pathname]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-muted",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mb-4 text-4xl font-bold",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 text-xl text-muted-foreground",
					children: "Oops! Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/",
					className: "text-primary underline hover:text-primary/90",
					children: "Return to Home"
				})
			]
		})
	});
};
function AuthorPage() {
	const { slug } = useParams();
	const { isDark, toggle } = useTheme$1();
	const { isRTL, lang } = useLanguage();
	const author = slug ? authorsApi.bySlug(slug) : null;
	const articles = useArticlesByAuthor(author?.name);
	if (!author) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
				isDark,
				onToggleTheme: toggle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container max-w-3xl py-20 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-foreground",
					children: isRTL ? "الكاتب غير موجود" : "Author not found"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "text-primary hover:underline mt-2 inline-block",
					children: isRTL ? "العودة للرئيسية" : "Back to home"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {})
		]
	});
	const totalViews = articles.reduce((s, a) => s + a.viewCount, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen pb-20 md:pb-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SEO, {
				title: author.name,
				description: author.bio ? author.bio.slice(0, 155) : lang === "en" ? `Articles by ${author.name} on MAX NEWS — latest reporting and analysis.` : `مقالات ${author.name} على MAX NEWS — أحدث التقارير والتحليلات.`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
				isDark,
				onToggleTheme: toggle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-gradient-to-br from-primary/10 via-background to-background border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container max-w-4xl py-10 flex items-center gap-5 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl md:text-4xl flex-shrink-0",
						children: author.name[0]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl md:text-3xl font-bold text-foreground",
								children: author.name
							}),
							author.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm md:text-base text-muted-foreground mt-2 max-w-2xl leading-relaxed",
								children: author.bio
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4 mt-3 text-xs md:text-sm text-muted-foreground flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										articles.length,
										" ",
										isRTL ? "مقال منشور" : "published articles"
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3.5 h-3.5" }),
											" ",
											totalViews.toLocaleString(),
											" ",
											isRTL ? "مشاهدة" : "views"
										]
									}),
									author.twitter && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: `https://twitter.com/${author.twitter.replace("@", "")}`,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "inline-flex items-center gap-1 hover:text-primary",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Twitter, { className: "w-3.5 h-3.5" }),
											" ",
											author.twitter
										]
									}),
									author.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: `mailto:${author.email}`,
										className: "inline-flex items-center gap-1 hover:text-primary",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-3.5 h-3.5" }),
											" ",
											author.email
										]
									})
								]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container max-w-4xl py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold text-foreground mb-4",
						children: isRTL ? "أحدث المقالات" : "Latest articles"
					}),
					articles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground text-center py-12",
						children: isRTL ? "لا توجد مقالات بعد" : "No articles yet"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid sm:grid-cols-2 gap-4",
						children: articles.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryCard, { article: a }, a.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdBanner, {
						variant: "leaderboard",
						className: "mt-8"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {})
		]
	});
}
/** Returns true when the given user holds the `admin` role. */
async function checkAdminRole(userId) {
	const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
	if (error) {
		error.code, error.message;
		return false;
	}
	return data?.role === "admin";
}
function useAuth() {
	const [user, setUser] = (0, import_react.useState)(null);
	const [session, setSession] = (0, import_react.useState)(null);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	const [username, setUsername] = (0, import_react.useState)(null);
	const [adminExists, setAdminExists] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	/** Guards the listener from racing with an in-flight signIn/signOut. */
	const authInFlight = (0, import_react.useRef)(false);
	const mounted = (0, import_react.useRef)(true);
	const loadUsername = (0, import_react.useCallback)(async (userId) => {
		const { data } = await supabase.from("admin_accounts").select("username").eq("user_id", userId).maybeSingle();
		const name = data?.username ?? null;
		if (mounted.current) setUsername(name);
		return name;
	}, []);
	const refreshAdminExists = (0, import_react.useCallback)(async () => {
		const { data, error } = await supabase.rpc("admin_exists");
		const exists = error ? false : Boolean(data);
		if (mounted.current) setAdminExists(exists);
		return exists;
	}, []);
	(0, import_react.useEffect)(() => {
		refreshAdminExists();
	}, [refreshAdminExists]);
	(0, import_react.useEffect)(() => {
		mounted.current = true;
		const applySession = async (nextSession) => {
			if (!mounted.current) return;
			setSession(nextSession);
			setUser(nextSession?.user ?? null);
			if (nextSession?.user) {
				const admin = await checkAdminRole(nextSession.user.id);
				if (!mounted.current) return;
				setIsAdmin(admin);
				if (admin) await loadUsername(nextSession.user.id);
				else setUsername(null);
			} else {
				setIsAdmin(false);
				setUsername(null);
			}
			if (mounted.current) setLoading(false);
		};
		supabase.auth.getSession().then(({ data }) => {
			if (authInFlight.current) return;
			applySession(data.session);
		});
		const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
			setTimeout(() => {
				if (authInFlight.current) return;
				applySession(nextSession);
			}, 0);
		});
		return () => {
			mounted.current = false;
			subscription.unsubscribe();
		};
	}, [loadUsername]);
	/** Sign in with an application username (mapped to a Supabase Auth account). */
	const signIn = async (usernameInput, password) => {
		const cleaned = usernameInput.trim();
		if (!cleaned) return { error: { message: "Username is required." } };
		authInFlight.current = true;
		try {
			const { data: authEmail, error: resolveError } = await supabase.rpc("resolve_admin_login", { _username: cleaned });
			resolveError?.message;
			if (resolveError || !authEmail) return { error: { message: "Invalid username or password." } };
			const { data, error } = await supabase.auth.signInWithPassword({
				email: authEmail,
				password
			});
			if (error || !data.session || !data.user) {
				error?.status, error?.message;
				return { error: { message: "Invalid username or password." } };
			}
			const admin = await checkAdminRole(data.user.id);
			data.user.id;
			if (!admin) {
				await supabase.auth.signOut();
				setUser(null);
				setSession(null);
				setIsAdmin(false);
				setUsername(null);
				return { error: { message: "You are not authorized to access the admin panel." } };
			}
			setSession(data.session);
			setUser(data.user);
			setIsAdmin(true);
			setLoading(false);
			await loadUsername(data.user.id);
			return { error: null };
		} finally {
			authInFlight.current = false;
		}
	};
	const signOut = async () => {
		authInFlight.current = true;
		try {
			await supabase.auth.signOut();
		} finally {
			authInFlight.current = false;
		}
		setUser(null);
		setSession(null);
		setIsAdmin(false);
		setUsername(null);
	};
	/** Change the admin-facing username. Does not touch the Auth email or session. */
	const updateUsername = async (newUsername) => {
		const cleaned = newUsername.trim();
		if (cleaned.length < 3 || cleaned.length > 32) return { error: { message: "Username must be between 3 and 32 characters." } };
		if (!/^[A-Za-z0-9._-]+$/.test(cleaned)) return { error: { message: "Username may only contain letters, numbers, dot, dash and underscore." } };
		if (!user) return { error: { message: "Not authenticated." } };
		const { error } = await supabase.from("admin_accounts").update({ username: cleaned }).eq("user_id", user.id);
		if (error) return { error: { message: error.code === "23505" ? "This username is already taken." : error.message } };
		setUsername(cleaned);
		return { error: null };
	};
	/**
	* Change the password through the existing `update-admin-password` Edge
	* Function. Never re-authenticates on the client, so the session survives.
	*/
	const updatePassword = async (currentPassword, newPassword) => {
		if (!user) return { error: { message: "Not authenticated." } };
		try {
			const { data, error } = await supabase.functions.invoke("update-admin-password", { body: {
				currentPassword,
				newPassword
			} });
			if (error) {
				let message = error.message || "Unable to update the password.";
				const ctx = error.context;
				if (ctx && typeof ctx.json === "function") try {
					const body = await ctx.json();
					if (body?.error) message = String(body.error);
				} catch {}
				return { error: { message } };
			}
			if (data && typeof data === "object" && "error" in data && data.error) return { error: { message: String(data.error) } };
			return { error: null };
		} catch (e) {
			return { error: { message: e instanceof Error ? e.message : "Network error. Please try again." } };
		}
	};
	return {
		user,
		session,
		isAdmin,
		username,
		adminExists,
		refreshAdminExists,
		isPublisher: isAdmin,
		isReviewer: isAdmin,
		isJournalist: isAdmin,
		role: isAdmin ? "admin" : null,
		loading,
		signIn,
		signOut,
		updateUsername,
		updatePassword
	};
}
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Label$1.displayName;
function AdminLogin() {
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const { signIn, isAdmin, loading } = useAuth();
	const navigate = useNavigate();
	const { toast } = useToast();
	const { t, isRTL } = useLanguage();
	(0, import_react.useEffect)(() => {
		if (loading) return;
		if (isAdmin) navigate("/admin", { replace: true });
	}, [
		isAdmin,
		loading,
		navigate
	]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		const { error } = await signIn(username, password);
		setSubmitting(false);
		if (error) {
			toast({
				title: t("signInError"),
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		toast({ title: isRTL ? "مرحباً بعودتك" : "Welcome back" });
		navigate("/admin", { replace: true });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-background p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm p-8 rounded-xl border border-border bg-card shadow-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground text-center mb-1",
					children: t("adminPanel")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground text-center text-sm mb-6",
					children: isRTL ? "وصول مسؤولي التحرير فقط" : "Editors access only"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "username",
							className: "text-xs text-muted-foreground",
							children: isRTL ? "اسم المستخدم" : "Username"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "username",
							type: "text",
							autoComplete: "username",
							value: username,
							onChange: (e) => setUsername(e.target.value),
							required: true,
							dir: "ltr",
							className: "mt-1"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "password",
							className: "text-xs text-muted-foreground",
							children: t("password")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "password",
							type: "password",
							autoComplete: "current-password",
							placeholder: "••••••••",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							required: true,
							dir: "ltr",
							className: "mt-1"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							disabled: submitting,
							children: submitting ? t("signingIn") : t("signIn")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						className: "w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							children: isRTL ? "← العودة إلى الصفحة الرئيسية" : "← Back to Home"
						})
					})
				})
			]
		})
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function AdminDashboard() {
	const { isAdmin, loading, signOut } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [, force] = (0, import_react.useState)(0);
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const [articleStats, setArticleStats] = (0, import_react.useState)({
		total: 0,
		published: 0,
		drafts: 0,
		totalViews: 0
	});
	const [pendingAds, setPendingAds] = (0, import_react.useState)(0);
	const [dialogueStats, setDialogueStats] = (0, import_react.useState)({
		total: 0,
		published: 0,
		drafts: 0
	});
	const [recentArticles, setRecentArticles] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => subscribe(() => force((n) => n + 1)), []);
	(0, import_react.useEffect)(() => {
		if (loading) return;
		if (!isAdmin) navigate("/admin/login", { replace: true });
	}, [
		isAdmin,
		loading,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (!isAdmin) return;
		(async () => {
			const [{ count: total }, { count: published }, { count: drafts }, viewsRes, adsRes, recentRes, dTotalRes, dPubRes] = await Promise.all([
				supabase.from("articles").select("*", {
					count: "exact",
					head: true
				}),
				supabase.from("articles").select("*", {
					count: "exact",
					head: true
				}).eq("status", "published"),
				supabase.from("articles").select("*", {
					count: "exact",
					head: true
				}).eq("status", "draft"),
				supabase.from("articles").select("view_count"),
				supabase.from("ad_submissions").select("*", {
					count: "exact",
					head: true
				}).eq("status", "pending"),
				supabase.from("articles").select("id, title, status, created_at, view_count").order("created_at", { ascending: false }).limit(5),
				supabase.from("dialogues").select("*", {
					count: "exact",
					head: true
				}),
				supabase.from("dialogues").select("*", {
					count: "exact",
					head: true
				}).eq("status", "published")
			]);
			const totalViews = (viewsRes.data ?? []).reduce((sum, a) => sum + (a.view_count ?? 0), 0);
			setArticleStats({
				total: total ?? 0,
				published: published ?? 0,
				drafts: drafts ?? 0,
				totalViews
			});
			setPendingAds(adsRes.count ?? 0);
			setRecentArticles(recentRes.data ?? []);
			const dTotal = dTotalRes.count ?? 0;
			const dPub = dPubRes.count ?? 0;
			setDialogueStats({
				total: dTotal,
				published: dPub,
				drafts: Math.max(dTotal - dPub, 0)
			});
		})();
	}, [isAdmin, location.pathname]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center text-muted-foreground",
		children: "جارٍ التحميل..."
	});
	if (!isAdmin) return null;
	const stats = {
		articles: articleStats.total,
		published: articleStats.published,
		drafts: articleStats.drafts,
		views: articleStats.totalViews,
		feedback: feedbackApi.all().length,
		unread: feedbackApi.unreadCount(),
		pendingAds
	};
	const isExact = location.pathname === "/admin";
	const navGroups = [
		{
			title: "إدارة المحتوى",
			items: [
				{
					to: "/admin/articles",
					icon: FileText,
					label: "المقالات"
				},
				{
					to: "/admin/dialogues",
					icon: Mic,
					label: "الحوارات"
				},
				{
					to: "/admin/breaking",
					icon: Megaphone,
					label: "الأخبار العاجلة"
				},
				{
					to: "/admin/comments",
					icon: MessageCircle,
					label: "التعليقات"
				}
			]
		},
		{
			title: "التواصل",
			items: [
				{
					to: "/admin/feedback",
					icon: MessageSquare,
					label: "الرسائل",
					badge: stats.unread
				},
				{
					to: "/admin/newsletter",
					icon: Mail,
					label: "النشرة"
				},
				{
					to: "/admin/push",
					icon: Bell,
					label: "الإشعارات الفورية"
				}
			]
		},
		{
			title: "الإعلانات",
			items: [{
				to: "/admin/ads",
				icon: BadgeDollarSign,
				label: "الإعلانات",
				badge: stats.pendingAds
			}]
		},
		{
			title: "الصفحات",
			items: [{
				to: "/about",
				icon: Info,
				label: "من نحن",
				external: true
			}]
		},
		{
			title: "الصفحات القانونية",
			items: [
				{
					to: "/privacy",
					icon: Shield,
					label: "الخصوصية",
					external: true
				},
				{
					to: "/cookies",
					icon: Cookie,
					label: "ملفات تعريف الارتباط",
					external: true
				},
				{
					to: "/terms",
					icon: Scale,
					label: "الشروط والأحكام",
					external: true
				},
				{
					to: "/copyright",
					icon: Copyright,
					label: "حقوق النشر",
					external: true
				},
				{
					to: "/disclaimer",
					icon: FileWarning,
					label: "إخلاء المسؤولية",
					external: true
				},
				{
					to: "/editorial-policy",
					icon: BookOpen,
					label: "سياسة التحرير",
					external: true
				},
				{
					to: "/corrections",
					icon: Wrench,
					label: "التصحيحات",
					external: true
				},
				{
					to: "/corrections-log",
					icon: History,
					label: "سجل التصحيحات",
					external: true
				}
			]
		},
		{
			title: "النظام",
			items: [{
				to: "/admin/settings",
				icon: Settings,
				label: "الإعدادات"
			}]
		}
	];
	const NavList = ({ onNavigate }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "space-y-4 flex-1 overflow-y-auto",
		children: navGroups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-3 mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70",
			children: group.title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-1",
			children: group.items.map((item) => {
				const active = !item.external && location.pathname.startsWith(item.to);
				const className = `flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-all ${active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`;
				const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "w-4 h-4" }), item.label]
				}), item.badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: active ? "secondary" : "destructive",
					className: "h-5 min-w-5 px-1.5 text-[10px]",
					children: item.badge
				}) : null] });
				return item.external ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: item.to,
					target: "_blank",
					rel: "noreferrer",
					onClick: onNavigate,
					className,
					children: inner
				}, item.to) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					onClick: onNavigate,
					className,
					children: inner
				}, item.to);
			})
		})] }, group.title))
	});
	const SidebarInner = ({ onNavigate }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col h-full p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold text-lg text-foreground",
					children: "لوحة التحكم"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold text-primary mt-0.5",
					children: "MAX NEWS"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavList, { onNavigate }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				onClick: onNavigate,
				className: "flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors mb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-4 h-4" }), "العودة للموقع"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: async () => {
					await signOut();
					navigate("/admin/login");
				},
				className: "justify-start gap-2 text-muted-foreground hover:text-destructive",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-4 h-4" }), "خروج"]
			})
		]
	});
	const timeAgo = (iso) => {
		const diff = Date.now() - new Date(iso).getTime();
		const mins = Math.floor(diff / 6e4);
		if (mins < 1) return "الآن";
		if (mins < 60) return `منذ ${mins} د`;
		const hrs = Math.floor(mins / 60);
		if (hrs < 24) return `منذ ${hrs} س`;
		return `منذ ${Math.floor(hrs / 24)} يوم`;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background flex flex-col md:flex-row",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "md:hidden flex items-center justify-between p-3 border-b border-border bg-card sticky top-0 z-30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMobileOpen(true),
						className: "p-2 rounded-lg hover:bg-muted text-foreground",
						"aria-label": "فتح القائمة",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "w-5 h-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-bold text-foreground",
						children: "لوحة التحكم"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-9" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "hidden md:flex w-56 border-l border-border bg-card max-h-screen flex-col",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarInner, {})
			}),
			mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:hidden fixed inset-0 z-50 flex",
				onClick: () => setMobileOpen(false),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fixed inset-0 bg-black/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "relative ms-auto w-64 h-full bg-card border-l border-border animate-in slide-in-from-right",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMobileOpen(false),
						className: "absolute top-3 left-3 p-2 rounded-lg hover:bg-muted text-foreground",
						"aria-label": "إغلاق",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarInner, { onNavigate: () => setMobileOpen(false) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 p-4 md:p-6 min-w-0",
				children: isExact ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-end justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl md:text-3xl font-bold text-foreground",
								children: "مرحبًا بك 👋"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground mt-1",
								children: "نظرة سريعة على حالة الموقع اليوم"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/articles/new",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "w-4 h-4" }), " مقال جديد"]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4",
							children: [
								{
									label: "إجمالي المقالات",
									value: stats.articles,
									icon: FileText,
									gradient: "from-blue-500/15 to-blue-500/5",
									color: "text-blue-600 dark:text-blue-400"
								},
								{
									label: "منشورة",
									value: stats.published,
									icon: TrendingUp,
									gradient: "from-green-500/15 to-green-500/5",
									color: "text-green-600 dark:text-green-400"
								},
								{
									label: "إجمالي الحوارات",
									value: dialogueStats.total,
									icon: Mic,
									gradient: "from-purple-500/15 to-purple-500/5",
									color: "text-purple-600 dark:text-purple-400"
								},
								{
									label: "إجمالي المشاهدات",
									value: stats.views.toLocaleString("ar"),
									icon: Eye,
									gradient: "from-amber-500/15 to-amber-500/5",
									color: "text-amber-600 dark:text-amber-400"
								},
								{
									label: "إعلانات بانتظار الموافقة",
									value: stats.pendingAds,
									icon: BadgeDollarSign,
									gradient: "from-rose-500/15 to-rose-500/5",
									color: "text-rose-600 dark:text-rose-400"
								}
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `relative overflow-hidden bg-gradient-to-br ${s.gradient} border border-border rounded-xl p-4 hover:shadow-md transition-shadow`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `w-9 h-9 rounded-lg bg-background/80 flex items-center justify-center mb-3 ${s.color}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "w-5 h-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-2xl md:text-3xl font-bold text-foreground",
										children: s.value
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-1",
										children: s.label
									})
								]
							}, s.label))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid lg:grid-cols-3 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-card border border-border rounded-xl p-4 lg:col-span-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-foreground mb-3 text-sm",
									children: "إجراءات سريعة"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2",
									children: [
										{
											to: "/admin/articles/new",
											icon: CirclePlus,
											label: "نشر مقال"
										},
										{
											to: "/admin/dialogues/new",
											icon: Mic,
											label: "إضافة حوار"
										},
										{
											to: "/admin/breaking",
											icon: Megaphone,
											label: "خبر عاجل"
										},
										{
											to: "/admin/push",
											icon: Bell,
											label: "إرسال إشعار"
										},
										{
											to: "/admin/ads",
											icon: BadgeDollarSign,
											label: "مراجعة الإعلانات",
											badge: stats.pendingAds
										}
									].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: a.to,
										className: "flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors group",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-2 text-sm text-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(a.icon, { className: "w-4 h-4 text-primary" }), a.label]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5",
											children: [a.badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "destructive",
												className: "h-5 px-1.5 text-[10px]",
												children: a.badge
											}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" })]
										})]
									}, a.to))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-card border border-border rounded-xl p-4 lg:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-foreground text-sm",
										children: "أحدث المقالات"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/admin/articles",
										className: "text-xs text-primary hover:underline",
										children: "عرض الكل"
									})]
								}), recentArticles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground py-6 text-center",
									children: "لا توجد مقالات بعد"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "divide-y divide-border",
									children: recentArticles.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: `/admin/articles/${a.id}`,
										className: "flex items-center justify-between gap-3 py-3 group",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors",
												children: a.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 mt-1 text-xs text-muted-foreground",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: timeAgo(a.created_at) }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3 h-3" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a.view_count ?? 0 })
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: a.status === "published" ? "default" : "outline",
											className: "text-[10px] flex-shrink-0",
											children: a.status === "published" ? "منشور" : "مسودة"
										})]
									}) }, a.id))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 md:grid-cols-4 gap-3",
							children: [
								{
									label: "مسودات المقالات",
									value: stats.drafts
								},
								{
									label: "حوارات منشورة",
									value: dialogueStats.published
								},
								{
									label: "مسودات الحوارات",
									value: dialogueStats.drafts
								},
								{
									label: "إجمالي الرسائل",
									value: stats.feedback
								},
								{
									label: "رسائل غير مقروءة",
									value: stats.unread
								},
								{
									label: "إعلانات معلّقة",
									value: stats.pendingAds
								}
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-muted/40 border border-border rounded-lg p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg font-bold text-foreground",
									children: s.value
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: s.label
								})]
							}, s.label))
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			})
		]
	});
}
var Table = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "relative w-full overflow-auto",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
		ref,
		className: cn("w-full caption-bottom text-sm", className),
		...props
	})
}));
Table.displayName = "Table";
var TableHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
	ref,
	className: cn("[&_tr]:border-b", className),
	...props
}));
TableHeader.displayName = "TableHeader";
var TableBody = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
	ref,
	className: cn("[&_tr:last-child]:border-0", className),
	...props
}));
TableBody.displayName = "TableBody";
var TableFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", {
	ref,
	className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
	...props
}));
TableFooter.displayName = "TableFooter";
var TableRow = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
	ref,
	className: cn("border-b transition-colors data-[state=selected]:bg-muted hover:bg-muted/50", className),
	...props
}));
TableRow.displayName = "TableRow";
var TableHead = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
	ref,
	className: cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className),
	...props
}));
TableHead.displayName = "TableHead";
var TableCell = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
	ref,
	className: cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className),
	...props
}));
TableCell.displayName = "TableCell";
var TableCaption = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
	ref,
	className: cn("mt-4 text-sm text-muted-foreground", className),
	...props
}));
TableCaption.displayName = "TableCaption";
var statusVariant = {
	draft: "outline",
	published: "default"
};
function AdminArticles() {
	const [articles, setArticles] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const { toast } = useToast();
	const { t, isRTL, lang } = useLanguage();
	const { isPublisher } = useAuth();
	const load = async () => {
		setLoading(true);
		const { data, error } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
		if (error) toast({
			title: "Error",
			description: error.message,
			variant: "destructive"
		});
		setArticles(data ?? []);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const remove = async (id) => {
		if (!isPublisher) {
			toast({
				title: t("permissionDenied"),
				variant: "destructive"
			});
			return;
		}
		if (!confirm(isRTL ? "هل أنت متأكد؟" : "Are you sure?")) return;
		const { error } = await supabase.from("articles").delete().eq("id", id);
		if (error) {
			toast({
				title: "Error",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		toast({ title: isRTL ? "تم حذف المقال" : "Article deleted" });
		load();
	};
	const statusKey = (s) => s === "published" ? "statusPublished" : "statusDraft";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold text-foreground",
			children: isRTL ? "المقالات" : "Articles"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/admin/articles/new",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				className: "gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }),
					" ",
					isRTL ? "مقال جديد" : "New article"
				]
			})
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border border-border rounded-xl overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: isRTL ? "العنوان" : "Title" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: isRTL ? "التصنيف" : "Category" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: isRTL ? "الحالة" : "Status" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: isRTL ? "التاريخ" : "Date" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: isRTL ? "إجراءات" : "Actions" })
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
			articles.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "font-medium max-w-xs truncate",
					children: a.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "secondary",
					children: a.category
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: statusVariant[a.status] ?? "outline",
					children: t(statusKey(a.status))
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-sm text-muted-foreground",
					children: new Date(a.created_at).toLocaleDateString(lang === "ar" ? "ar-DZ" : "en-GB")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: `/admin/articles/${a.id}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "w-4 h-4" })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => remove(a.id),
						disabled: !isPublisher,
						title: isPublisher ? "" : t("permissionDenied"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 text-destructive" })
					})]
				}) })
			] }, a.id)),
			!loading && articles.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 5,
				className: "text-center text-muted-foreground py-8",
				children: isRTL ? "لا توجد مقالات بعد" : "No articles yet"
			}) }),
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 5,
				className: "text-center text-muted-foreground py-8",
				children: isRTL ? "جارٍ التحميل..." : "Loading..."
			}) })
		] })] })
	})] });
}
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 rtl:data-[state=checked]:-translate-x-5 rtl:data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
var categoryOptions = categories.filter((c) => c.key !== "all");
var statusBadgeVariant = {
	draft: "outline",
	published: "default"
};
function getYoutubeId(url) {
	for (const pattern of [
		/youtu\.be\/([^?&/]+)/,
		/youtube\.com\/watch\?v=([^?&/]+)/,
		/youtube\.com\/shorts\/([^?&/]+)/,
		/youtube\.com\/embed\/([^?&/]+)/
	]) {
		const match = url.match(pattern);
		if (match) return match[1];
	}
	return null;
}
function getYoutubeThumbnail(url) {
	const id = getYoutubeId(url);
	if (!id) return "";
	return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}
function AdminArticleEditor() {
	const { id } = useParams();
	const isNew = id === "new";
	const navigate = useNavigate();
	const { toast } = useToast();
	const { t, isRTL } = useLanguage();
	const { isPublisher } = useAuth();
	const [loading, setLoading] = (0, import_react.useState)(!isNew);
	const [title, setTitle] = (0, import_react.useState)("");
	const [excerpt, setExcerpt] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [author, setAuthor] = (0, import_react.useState)("");
	const [categoryKey, setCategoryKey] = (0, import_react.useState)("algeria");
	const [imageUrl, setImageUrl] = (0, import_react.useState)("");
	const [mediaType, setMediaType] = (0, import_react.useState)("image");
	const [videoUrl, setVideoUrl] = (0, import_react.useState)("");
	const [videoThumbnail, setVideoThumbnail] = (0, import_react.useState)("");
	const [isBreaking, setIsBreaking] = (0, import_react.useState)(false);
	const [isFeatured, setIsFeatured] = (0, import_react.useState)(false);
	const [tagsInput, setTagsInput] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("draft");
	const [autoGeneratingThumbnail, setAutoGeneratingThumbnail] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [uploadingVideo, setUploadingVideo] = (0, import_react.useState)(false);
	const [uploadingThumbnail, setUploadingThumbnail] = (0, import_react.useState)(false);
	const [imageProgress, setImageProgress] = (0, import_react.useState)(0);
	const [videoProgress, setVideoProgress] = (0, import_react.useState)(0);
	const [thumbnailProgress, setThumbnailProgress] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (mediaType === "youtube" && videoUrl) {
			const thumb = getYoutubeThumbnail(videoUrl);
			setVideoThumbnail(thumb || "");
		}
	}, [videoUrl, mediaType]);
	const generateThumbnailFromVideo = (videoUrl) => {
		return new Promise((resolve, reject) => {
			const video = document.createElement("video");
			video.crossOrigin = "anonymous";
			video.src = videoUrl;
			video.preload = "metadata";
			video.muted = true;
			video.playsInline = true;
			const handleLoaded = () => {
				video.currentTime = .1;
			};
			const handleSeeked = () => {
				try {
					const canvas = document.createElement("canvas");
					canvas.width = video.videoWidth;
					canvas.height = video.videoHeight;
					const ctx = canvas.getContext("2d");
					if (!ctx) {
						reject(/* @__PURE__ */ new Error("Canvas is not available"));
						return;
					}
					ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
					canvas.toBlob((blob) => {
						if (blob) resolve(blob);
						else reject(/* @__PURE__ */ new Error("Failed to create blob from canvas"));
					}, "image/jpeg", .8);
				} catch (err) {
					reject(err);
				} finally {
					video.removeEventListener("loadedmetadata", handleLoaded);
					video.removeEventListener("seeked", handleSeeked);
					video.removeEventListener("error", handleError);
					video.src = "";
					video.load();
				}
			};
			const handleError = () => {
				video.removeEventListener("loadedmetadata", handleLoaded);
				video.removeEventListener("seeked", handleSeeked);
				video.removeEventListener("error", handleError);
				reject(/* @__PURE__ */ new Error("Video failed to load"));
			};
			video.addEventListener("loadedmetadata", handleLoaded);
			video.addEventListener("seeked", handleSeeked);
			video.addEventListener("error", handleError);
		});
	};
	const uploadThumbnailBlob = async (blob) => {
		const file = new File([blob], `thumbnail-${Date.now()}.jpg`, { type: "image/jpeg" });
		setUploadingThumbnail(true);
		setThumbnailProgress(0);
		const path = `thumbnails/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
		const { error: upErr } = await supabase.storage.from("article-images").upload(path, file, {
			cacheControl: "3600",
			upsert: false
		});
		if (upErr) throw upErr;
		const { data } = supabase.storage.from("article-images").getPublicUrl(path);
		return data.publicUrl;
	};
	const handleImageUpload = async (file) => {
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast({
				title: isRTL ? "ملف غير صالح" : "Invalid file",
				description: isRTL ? "يرجى اختيار صورة" : "Please choose an image",
				variant: "destructive"
			});
			return;
		}
		if (file.size > 5242880) {
			toast({
				title: isRTL ? "حجم الصورة كبير" : "File too large",
				description: isRTL ? "الحد الأقصى 5 ميغابايت" : "Max 5MB",
				variant: "destructive"
			});
			return;
		}
		setUploading(true);
		setImageProgress(0);
		const ext = file.name.split(".").pop() || "jpg";
		const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
		const { error: upErr } = await supabase.storage.from("article-images").upload(path, file, {
			cacheControl: "3600",
			upsert: false
		});
		if (upErr) {
			toast({
				title: "Error",
				description: upErr.message,
				variant: "destructive"
			});
			setUploading(false);
			setImageProgress(0);
			return;
		}
		const { data } = supabase.storage.from("article-images").getPublicUrl(path);
		setImageUrl(data.publicUrl);
		setUploading(false);
		setImageProgress(100);
		toast({ title: isRTL ? "تم رفع الصورة" : "Image uploaded" });
		setTimeout(() => setImageProgress(0), 2e3);
	};
	const handleThumbnailUpload = async (file) => {
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast({
				title: isRTL ? "ملف غير صالح" : "Invalid file",
				description: isRTL ? "يرجى اختيار صورة مصغرة" : "Please choose an image for thumbnail",
				variant: "destructive"
			});
			return;
		}
		if (file.size > 2097152) {
			toast({
				title: isRTL ? "حجم الصورة كبير" : "File too large",
				description: isRTL ? "الحد الأقصى 2 ميغابايت" : "Max 2MB",
				variant: "destructive"
			});
			return;
		}
		setUploadingThumbnail(true);
		setThumbnailProgress(0);
		const ext = file.name.split(".").pop() || "jpg";
		const path = `thumbnails/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
		const { error: upErr } = await supabase.storage.from("article-images").upload(path, file, {
			cacheControl: "3600",
			upsert: false
		});
		if (upErr) {
			toast({
				title: "Error",
				description: upErr.message,
				variant: "destructive"
			});
			setUploadingThumbnail(false);
			setThumbnailProgress(0);
			return;
		}
		const { data } = supabase.storage.from("article-images").getPublicUrl(path);
		setVideoThumbnail(data.publicUrl);
		setUploadingThumbnail(false);
		setThumbnailProgress(100);
		toast({ title: isRTL ? "تم رفع الصورة المصغرة" : "Thumbnail uploaded" });
		setTimeout(() => setThumbnailProgress(0), 2e3);
	};
	const handleVideoUpload = async (file) => {
		if (!file) return;
		if (!file.type.startsWith("video/")) {
			toast({
				title: isRTL ? "ملف غير صالح" : "Invalid file",
				description: isRTL ? "يرجى اختيار فيديو" : "Please choose a video",
				variant: "destructive"
			});
			return;
		}
		if (file.size > 52428800) {
			toast({
				title: isRTL ? "حجم الفيديو كبير" : "File too large",
				description: isRTL ? "الحد الأقصى 50 ميغابايت" : "Max 50MB – please upload a smaller file.",
				variant: "destructive"
			});
			return;
		}
		setUploadingVideo(true);
		setVideoProgress(0);
		const ext = file.name.split(".").pop() || "mp4";
		const path = `videos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
		const { error: upErr } = await supabase.storage.from("article-images").upload(path, file, {
			cacheControl: "3600",
			upsert: false
		});
		if (upErr) {
			let errorMsg = upErr.message;
			if (upErr.message?.toLowerCase().includes("exceeded")) errorMsg = isRTL ? "حجم الملف يتجاوز الحد المسموح به في التخزين. يرجى زيادة الحد الأقصى في لوحة تحكم Supabase." : "File exceeds the storage limit. Please increase the bucket file size limit in Supabase Dashboard.";
			toast({
				title: "Error",
				description: errorMsg,
				variant: "destructive"
			});
			setUploadingVideo(false);
			setVideoProgress(0);
			return;
		}
		const { data } = supabase.storage.from("article-images").getPublicUrl(path);
		const publicUrl = data.publicUrl;
		setVideoUrl(publicUrl);
		setUploadingVideo(false);
		setVideoProgress(100);
		toast({ title: isRTL ? "تم رفع الفيديو" : "Video uploaded" });
		setTimeout(() => setVideoProgress(0), 2e3);
		if (!videoThumbnail) {
			setAutoGeneratingThumbnail(true);
			try {
				const blob = await generateThumbnailFromVideo(publicUrl);
				const thumbnailUrl = await uploadThumbnailBlob(blob);
				setVideoThumbnail(thumbnailUrl);
				toast({
					title: isRTL ? "تم إنشاء الصورة المصغرة" : "Thumbnail generated",
					description: isRTL ? "تم استخراج أول إطار من الفيديو" : "First frame extracted from video"
				});
			} catch (err) {
				console.error("Thumbnail generation failed:", err);
				toast({
					title: isRTL ? "فشل إنشاء الصورة المصغرة" : "Thumbnail generation failed",
					description: isRTL ? "يرجى رفع صورة يدوياً" : "Please upload a thumbnail manually",
					variant: "destructive"
				});
			} finally {
				setAutoGeneratingThumbnail(false);
				setUploadingThumbnail(false);
				setThumbnailProgress(0);
			}
		}
	};
	(0, import_react.useEffect)(() => {
		if (isNew || !id) return;
		let cancelled = false;
		(async () => {
			const { data, error } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
			if (cancelled) return;
			if (error) {
				toast({
					title: "Error",
					description: error.message,
					variant: "destructive"
				});
				setLoading(false);
				return;
			}
			if (data) {
				setTitle(data.title);
				setExcerpt(data.excerpt ?? "");
				setBody(data.body ?? "");
				setAuthor(data.author ?? "");
				setCategoryKey(data.category_key);
				setImageUrl(data.image_url ?? "");
				setMediaType(data.media_type ?? "image");
				setVideoUrl(data.video_url ?? "");
				setVideoThumbnail(data.video_thumbnail ?? "");
				setIsBreaking(data.is_breaking);
				setIsFeatured(data.is_featured);
				setTagsInput((data.tags ?? []).join(", "));
				setStatus(data.status ?? "draft");
			}
			setLoading(false);
		})();
		return () => {
			cancelled = true;
		};
	}, [
		id,
		isNew,
		toast
	]);
	const selectedCategory = categoryOptions.find((c) => c.key === categoryKey);
	const requireTitle = () => {
		if (!title.trim()) {
			toast({
				title: isRTL ? "العنوان مطلوب" : "Title is required",
				variant: "destructive"
			});
			return false;
		}
		return true;
	};
	const buildPayload = (nextStatus) => ({
		title: title.trim(),
		excerpt: excerpt.trim(),
		body,
		author: author.trim(),
		category: selectedCategory?.label ?? "الجزائر",
		category_key: categoryKey,
		media_type: mediaType,
		image_url: mediaType === "image" ? imageUrl.trim() || null : null,
		video_url: mediaType === "youtube" || mediaType === "video" ? videoUrl.trim() : null,
		video_thumbnail: mediaType === "youtube" || mediaType === "video" ? videoThumbnail.trim() : null,
		is_breaking: isBreaking,
		is_featured: isFeatured,
		tags: tagsInput.split(",").map((s) => s.trim()).filter(Boolean),
		status: nextStatus,
		published_at: nextStatus === "published" ? (/* @__PURE__ */ new Date()).toISOString() : null
	});
	const save = async (nextStatus) => {
		if (!requireTitle()) return;
		const wasPublished = status === "published";
		const payload = buildPayload(nextStatus);
		let articleId = id && id !== "new" ? id : null;
		try {
			if (isNew) {
				const { data, error } = await supabase.from("articles").insert(payload).select("id").single();
				if (error) throw error;
				articleId = data.id;
			} else if (id) {
				const { error } = await supabase.from("articles").update(payload).eq("id", id);
				if (error) throw error;
				articleId = id;
			}
			toast({ title: nextStatus === "published" ? isRTL ? "تم النشر" : "Published" : isRTL ? "تم حفظ المسودة" : "Draft saved" });
			if (nextStatus === "published" && !wasPublished && articleId) try {
				const { data, error } = await supabase.functions.invoke("fcm-send-article", { body: { article_id: articleId } });
				if (error) throw error;
				if (data?.sent != null) toast({
					title: isRTL ? "تم إرسال الإشعارات" : "Notifications sent",
					description: isRTL ? `تم الإرسال إلى ${data.sent} مشترك` : `Sent to ${data.sent} subscribers`
				});
			} catch (notifErr) {
				console.error("FCM notification failed:", notifErr);
			}
			navigate("/admin/articles");
		} catch (err) {
			toast({
				title: "Error",
				description: err.message,
				variant: "destructive"
			});
			console.error(err);
		}
	};
	const BackIcon = isRTL ? ArrowRight : ArrowLeft;
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-muted-foreground",
		children: isRTL ? "جارٍ التحميل..." : "Loading..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => navigate("/admin/articles"),
				className: "flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackIcon, { className: "w-4 h-4" }),
					" ",
					isRTL ? "العودة للمقالات" : "Back to articles"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 mb-6 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground",
					children: isNew ? isRTL ? "مقال جديد" : "New article" : isRTL ? "تعديل المقال" : "Edit article"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: statusBadgeVariant[status],
					children: status === "published" ? t("statusPublished") : t("statusDraft")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: isRTL ? "العنوان" : "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						className: "mt-1"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: isRTL ? "المقتطف" : "Excerpt" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: excerpt,
						onChange: (e) => setExcerpt(e.target.value),
						className: "mt-1",
						rows: 2
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: isRTL ? "المحتوى" : "Content" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: body,
						onChange: (e) => setBody(e.target.value),
						className: "mt-1 min-h-[300px] leading-relaxed"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: isRTL ? "الكاتب" : "Author" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: author,
							onChange: (e) => setAuthor(e.target.value),
							className: "mt-1"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: isRTL ? "التصنيف" : "Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: categoryKey,
							onValueChange: setCategoryKey,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "mt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: categoryOptions.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: c.key,
								children: c.label
							}, c.key)) })]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "radio",
										checked: mediaType === "image",
										onChange: () => {
											setMediaType("image");
											setVideoUrl("");
											setVideoThumbnail("");
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "w-4 h-4" }),
									" Image"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "radio",
										checked: mediaType === "youtube",
										onChange: () => {
											setMediaType("youtube");
											setImageUrl("");
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "w-4 h-4" }),
									" YouTube"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "radio",
										checked: mediaType === "video",
										onChange: () => {
											setMediaType("video");
											setImageUrl("");
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-4 h-4" }),
									" Short Video"
								]
							})
						]
					}),
					mediaType === "image" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: isRTL ? "صورة المقال" : "Article image" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 space-y-2",
						children: [imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full max-w-md rounded-lg overflow-hidden border border-border group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: imageUrl,
								alt: "preview",
								className: "w-full h-48 object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setImageUrl(""),
								className: "absolute top-2 left-2 bg-background/90 hover:bg-background rounded-full p-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex flex-col items-center justify-center w-full max-w-md h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/40",
							children: [uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center gap-2 w-full px-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin w-6 h-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "w-full max-w-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-full bg-muted rounded-full h-2.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "bg-primary h-2.5 rounded-full transition-all",
											style: { width: `${imageProgress}%` }
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground mt-1 block text-center",
										children: [imageProgress, "%"]
									})]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-6 h-6 mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isRTL ? "اضغط لرفع صورة" : "Upload image" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "image/*",
								hidden: true,
								disabled: uploading,
								onChange: (e) => {
									if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
								}
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: isRTL ? "أو استخدم رابطاً" : "Or use URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: imageUrl,
							onChange: (e) => setImageUrl(e.target.value),
							placeholder: "https://..."
						})] })]
					})] }),
					mediaType === "youtube" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: isRTL ? "رابط يوتيوب" : "YouTube URL" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: videoUrl,
							onChange: (e) => setVideoUrl(e.target.value),
							placeholder: "https://youtube.com/watch?v=...",
							className: "mt-1"
						}),
						videoThumbnail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 relative w-full max-w-md rounded-lg overflow-hidden border border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: videoThumbnail,
								alt: "YouTube thumbnail",
								className: "w-full h-48 object-cover"
							})
						})
					] }),
					mediaType === "video" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: isRTL ? "فيديو (أقل من 60 ثانية)" : "Video (under 60 sec)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1",
							children: [videoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full max-w-md rounded-lg overflow-hidden border border-border group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
									src: videoUrl,
									controls: true,
									className: "w-full h-48 object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setVideoUrl(""),
									className: "absolute top-2 left-2 bg-background/90 hover:bg-background rounded-full p-1.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col items-center justify-center w-full max-w-md h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/40",
								children: [uploadingVideo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-2 w-full px-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin w-6 h-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "w-full max-w-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-full bg-muted rounded-full h-2.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "bg-primary h-2.5 rounded-full transition-all",
												style: { width: `${videoProgress}%` }
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground mt-1 block text-center",
											children: [videoProgress, "%"]
										})]
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "w-6 h-6 mb-2" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isRTL ? "اضغط لرفع فيديو" : "Upload video" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground mt-1",
										children: "MP4, MOV, WebM · max 50MB"
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "video/*",
									hidden: true,
									disabled: uploadingVideo,
									onChange: (e) => {
										if (e.target.files?.[0]) handleVideoUpload(e.target.files[0]);
									}
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: isRTL ? "أو استخدم رابطاً" : "Or use URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: videoUrl,
								onChange: (e) => setVideoUrl(e.target.value),
								placeholder: "https://...",
								className: "mt-1"
							})] })]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: isRTL ? "صورة مصغرة للفيديو" : "Video thumbnail" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1",
							children: [videoThumbnail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full max-w-md rounded-lg overflow-hidden border border-border group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: videoThumbnail,
									alt: "thumbnail",
									className: "w-full h-32 object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setVideoThumbnail(""),
									className: "absolute top-2 left-2 bg-background/90 hover:bg-background rounded-full p-1.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col items-center justify-center w-full max-w-md h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/40",
								children: [uploadingThumbnail || autoGeneratingThumbnail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center gap-2 w-full px-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "w-full max-w-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-full bg-muted rounded-full h-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "bg-primary h-2 rounded-full transition-all",
												style: { width: `${autoGeneratingThumbnail ? 100 : thumbnailProgress}%` }
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground mt-1 block text-center",
											children: autoGeneratingThumbnail ? isRTL ? "جارٍ إنشاء الصورة المصغرة..." : "Generating thumbnail..." : `${thumbnailProgress}%`
										})]
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "w-5 h-5 mb-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: isRTL ? "رفع صورة مصغرة" : "Upload thumbnail"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*",
									hidden: true,
									disabled: uploadingThumbnail || autoGeneratingThumbnail,
									onChange: (e) => {
										if (e.target.files?.[0]) handleThumbnailUpload(e.target.files[0]);
									}
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: isRTL ? "أو استخدم رابطاً" : "Or use URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: videoThumbnail,
								onChange: (e) => setVideoThumbnail(e.target.value),
								placeholder: "https://...",
								className: "mt-1"
							})] })]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: isRTL ? "الوسوم (مفصولة بفاصلة)" : "Tags (comma separated)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: tagsInput,
						onChange: (e) => setTagsInput(e.target.value),
						className: "mt-1"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-6 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: isBreaking,
								onCheckedChange: setIsBreaking
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: isRTL ? "خبر عاجل" : "Breaking" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: isFeatured,
								onCheckedChange: setIsFeatured
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: isRTL ? "مقال مميّز" : "Featured" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-4 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-medium text-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "w-4 h-4" }),
								" ",
								isRTL ? "النشر" : "Publish"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => save("draft"),
								children: isRTL ? "حفظ كمسودة" : "Save as draft"
							}), isPublisher && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => save("published"),
								className: "gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4" }),
									" ",
									isRTL ? "نشر الآن" : "Publish now"
								]
							})]
						})]
					})
				]
			})
		]
	});
}
function AdminDialogues() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [query, setQuery] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const { toast } = useToast();
	const { isPublisher } = useAuth();
	const load = async () => {
		setLoading(true);
		const { data, error } = await supabase.from("dialogues").select("*").order("created_at", { ascending: false });
		if (error) toast({
			title: "خطأ",
			description: error.message,
			variant: "destructive"
		});
		setRows(data ?? []);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return rows.filter((r) => {
			if (statusFilter !== "all" && r.status !== statusFilter) return false;
			if (!q) return true;
			return r.title.toLowerCase().includes(q) || (r.guest_name ?? "").toLowerCase().includes(q) || (r.interviewer ?? "").toLowerCase().includes(q);
		});
	}, [
		rows,
		query,
		statusFilter
	]);
	const remove = async (id) => {
		if (!isPublisher) return;
		if (!confirm("هل أنت متأكد من حذف هذا الحوار؟")) return;
		const { error } = await supabase.from("dialogues").delete().eq("id", id);
		if (error) {
			toast({
				title: "خطأ",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		toast({ title: "تم حذف الحوار" });
		load();
	};
	const toggleStatus = async (row) => {
		if (!isPublisher) return;
		const next = row.status === "published" ? "draft" : "published";
		const { error } = await supabase.from("dialogues").update({
			status: next,
			published_at: next === "published" ? row.published_at ?? (/* @__PURE__ */ new Date()).toISOString() : null
		}).eq("id", row.id);
		if (error) {
			toast({
				title: "خطأ",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		toast({ title: next === "published" ? "تم نشر الحوار" : "تم تحويل الحوار إلى مسودة" });
		load();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-6 gap-3 flex-wrap",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold text-foreground",
				children: "الحوارات"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/dialogues/new",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					className: "gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " حوار جديد"]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-3 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1 min-w-[200px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "ابحث بالعنوان أو الضيف...",
					className: "ps-9"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: statusFilter,
				onValueChange: (v) => setStatusFilter(v),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
					className: "w-40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "all",
						children: "كل الحالات"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "published",
						children: "منشور"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "draft",
						children: "مسودة"
					})
				] })]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border border-border rounded-xl overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "العنوان" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "الضيف" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "الحالة" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "التاريخ" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "إجراءات" })
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
				filtered.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium max-w-xs truncate",
						children: d.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-sm text-muted-foreground",
						children: d.guest_name || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: d.status === "published" ? "default" : "outline",
						children: d.status === "published" ? "منشور" : "مسودة"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-sm text-muted-foreground",
						children: new Date(d.created_at).toLocaleDateString("ar-DZ")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: () => toggleStatus(d),
								disabled: !isPublisher,
								title: d.status === "published" ? "إلغاء النشر" : "نشر",
								children: d.status === "published" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-4 h-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: `/admin/dialogues/${d.id}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "w-4 h-4" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: () => remove(d.id),
								disabled: !isPublisher,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 text-destructive" })
							})
						]
					}) })
				] }, d.id)),
				!loading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 5,
					className: "text-center text-muted-foreground py-8",
					children: "لا توجد حوارات"
				}) }),
				loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 5,
					className: "text-center text-muted-foreground py-8",
					children: "جارٍ التحميل..."
				}) })
			] })] })
		})
	] });
}
function AdminDialogueEditor() {
	const { id } = useParams();
	const isNew = !id || id === "new";
	const navigate = useNavigate();
	const { toast } = useToast();
	const { isPublisher } = useAuth();
	const [loading, setLoading] = (0, import_react.useState)(!isNew);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const [guestName, setGuestName] = (0, import_react.useState)("");
	const [guestTitle, setGuestTitle] = (0, import_react.useState)("");
	const [interviewer, setInterviewer] = (0, import_react.useState)("");
	const [excerpt, setExcerpt] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [imageUrl, setImageUrl] = (0, import_react.useState)("");
	const [tagsInput, setTagsInput] = (0, import_react.useState)("");
	const [isFeatured, setIsFeatured] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)("draft");
	const [publishedAt, setPublishedAt] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (isNew) return;
		(async () => {
			const { data, error } = await supabase.from("dialogues").select("*").eq("id", id).maybeSingle();
			if (error || !data) {
				toast({
					title: "تعذر تحميل الحوار",
					variant: "destructive"
				});
				navigate("/admin/dialogues");
				return;
			}
			setTitle(data.title);
			setGuestName(data.guest_name ?? "");
			setGuestTitle(data.guest_title ?? "");
			setInterviewer(data.interviewer ?? "");
			setExcerpt(data.excerpt ?? "");
			setBody(data.body ?? "");
			setImageUrl(data.image_url ?? "");
			setTagsInput((data.tags ?? []).join("، "));
			setIsFeatured(!!data.is_featured);
			setStatus(data.status ?? "draft");
			setPublishedAt(data.published_at);
			setLoading(false);
		})();
	}, [
		id,
		isNew,
		navigate,
		toast
	]);
	const uploadImage = async (file) => {
		setUploading(true);
		const ext = file.name.split(".").pop() ?? "jpg";
		const path = `dialogues/${crypto.randomUUID()}.${ext}`;
		const { error } = await supabase.storage.from("article-images").upload(path, file, { upsert: true });
		setUploading(false);
		if (error) {
			toast({
				title: "فشل رفع الصورة",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		const { data } = supabase.storage.from("article-images").getPublicUrl(path);
		setImageUrl(data.publicUrl);
	};
	const save = async (nextStatus) => {
		if (!isPublisher) return;
		if (!title.trim()) {
			toast({
				title: "العنوان مطلوب",
				variant: "destructive"
			});
			return;
		}
		setSaving(true);
		const payload = {
			title: title.trim(),
			guest_name: guestName.trim(),
			guest_title: guestTitle.trim(),
			interviewer: interviewer.trim(),
			excerpt: excerpt.trim(),
			body,
			image_url: imageUrl || null,
			tags: tagsInput.split(/[،,]/).map((t) => t.trim()).filter(Boolean),
			is_featured: isFeatured,
			status: nextStatus,
			published_at: nextStatus === "published" ? publishedAt ?? (/* @__PURE__ */ new Date()).toISOString() : null
		};
		const res = isNew ? await supabase.from("dialogues").insert(payload) : await supabase.from("dialogues").update(payload).eq("id", id);
		setSaving(false);
		if (res.error) {
			toast({
				title: "خطأ",
				description: res.error.message,
				variant: "destructive"
			});
			return;
		}
		toast({ title: nextStatus === "published" ? "تم نشر الحوار" : "تم حفظ المسودة" });
		navigate("/admin/dialogues");
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-muted-foreground",
		children: "جارٍ التحميل..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => navigate("/admin/dialogues"),
				className: "flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" }), " العودة للحوارات"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 mb-6 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground",
					children: isNew ? "حوار جديد" : "تعديل الحوار"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: status === "published" ? "default" : "outline",
					children: status === "published" ? "منشور" : "مسودة"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "العنوان" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						className: "mt-1"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "اسم الضيف" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: guestName,
							onChange: (e) => setGuestName(e.target.value),
							className: "mt-1"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "صفة الضيف" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: guestTitle,
							onChange: (e) => setGuestTitle(e.target.value),
							className: "mt-1"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "المحاور" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: interviewer,
						onChange: (e) => setInterviewer(e.target.value),
						className: "mt-1"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "المقتطف" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: excerpt,
						onChange: (e) => setExcerpt(e.target.value),
						className: "mt-1",
						rows: 2
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "نص الحوار" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: body,
						onChange: (e) => setBody(e.target.value),
						className: "mt-1 min-h-[300px] leading-relaxed"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "صورة الحوار" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 space-y-2",
						children: imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full max-w-md rounded-lg overflow-hidden border border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: imageUrl,
								alt: "معاينة صورة الحوار",
								className: "w-full h-48 object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setImageUrl(""),
								className: "absolute top-2 left-2 bg-background/90 hover:bg-background rounded-full p-1.5",
								"aria-label": "إزالة الصورة",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex flex-col items-center justify-center w-full max-w-md h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/40",
							children: [uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "animate-spin w-6 h-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-6 h-6 mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground",
								children: "اضغط لرفع صورة"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "image/*",
								className: "hidden",
								onChange: (e) => {
									const f = e.target.files?.[0];
									if (f) uploadImage(f);
								}
							})]
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "الوسوم (افصل بينها بفاصلة)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: tagsInput,
						onChange: (e) => setTagsInput(e.target.value),
						className: "mt-1"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border border-border rounded-lg px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "cursor-pointer",
							children: "حوار مميّز"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: "يظهر في المقدمة ضمن قسم الحوارات"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: isFeatured,
							onCheckedChange: setIsFeatured
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => save("published"),
							disabled: saving || !isPublisher,
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4" }), " نشر"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => save("draft"),
							disabled: saving || !isPublisher,
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "w-4 h-4" }), " حفظ كمسودة"]
						})]
					})
				]
			})
		]
	});
}
function AdminFeedback() {
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [, force] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => subscribe(() => force((n) => n + 1)), []);
	const messages = feedbackApi.all();
	const open = (msg) => {
		if (!msg.is_read) feedbackApi.markRead(msg.id);
		setSelected(msg);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "text-2xl font-bold text-foreground mb-6",
		children: "صندوق الرسائل"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid md:grid-cols-3 gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "md:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto",
			children: [messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => open(m),
				className: `w-full text-right p-3 rounded-lg border transition-colors ${selected?.id === m.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-1",
					children: [
						m.is_read ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailOpen, { className: "w-3.5 h-3.5 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "w-3.5 h-3.5 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-sm font-medium ${m.is_read ? "text-muted-foreground" : "text-foreground"}`,
							children: m.name
						}),
						!m.is_read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "text-[10px] h-4 px-1.5",
							children: "جديد"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground truncate",
					children: m.message
				})]
			}, m.id)), messages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-muted-foreground py-8",
				children: "لا توجد رسائل"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "md:col-span-2 border border-border rounded-xl p-6",
			children: selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold text-foreground",
						children: selected.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: new Date(selected.created_at).toLocaleDateString("ar-DZ")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mb-2",
					dir: "ltr",
					children: selected.email
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "my-4 border-border" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-foreground leading-relaxed whitespace-pre-wrap",
					children: selected.message
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground text-center py-16",
				children: "اختر رسالة لعرضها"
			})
		})]
	})] });
}
function AdminBreakingNews() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [text, setText] = (0, import_react.useState)("");
	const [linkId, setLinkId] = (0, import_react.useState)("");
	const { toast } = useToast();
	const load = async () => {
		const { data } = await supabase.from("breaking_news_items").select("*").order("display_order", { ascending: true });
		setItems(data ?? []);
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const add = async (e) => {
		e.preventDefault();
		if (!text.trim()) return;
		const { error } = await supabase.from("breaking_news_items").insert({
			text: text.trim(),
			link_article_id: linkId.trim() || null,
			is_active: true,
			display_order: items.length
		});
		if (error) {
			toast({
				title: "خطأ",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		setText("");
		setLinkId("");
		load();
	};
	const toggle = async (id, value) => {
		const { error } = await supabase.from("breaking_news_items").update({ is_active: value }).eq("id", id);
		if (error) {
			toast({
				title: "خطأ",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		load();
	};
	const remove = async (id) => {
		const { error } = await supabase.from("breaking_news_items").delete().eq("id", id);
		if (error) {
			toast({
				title: "خطأ",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		toast({ title: "تم الحذف" });
		load();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold text-foreground mb-6",
				children: "شريط الأخبار العاجلة"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: add,
				className: "bg-card border border-border rounded-xl p-4 mb-6 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: text,
						onChange: (e) => setText(e.target.value),
						placeholder: "نص الخبر العاجل...",
						maxLength: 280
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: linkId,
						onChange: (e) => setLinkId(e.target.value),
						placeholder: "معرّف المقال المرتبط (اختياري)",
						dir: "ltr"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						className: "gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), " إضافة"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border border-border rounded-lg p-3 flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: it.is_active,
							onCheckedChange: (v) => toggle(it.id, v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-foreground truncate",
								children: it.text
							}), it.link_article_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: `/article/${it.link_article_id}`,
								className: "text-xs text-primary hover:underline truncate block",
								dir: "ltr",
								children: ["/article/", it.link_article_id]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => remove(it.id),
							className: "text-destructive hover:opacity-70",
							"aria-label": "حذف",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
						})
					]
				}, it.id)), items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-sm text-muted-foreground py-6",
					children: "لا توجد عناصر بعد"
				})]
			})
		]
	});
}
function AdminComments() {
	const [filter, setFilter] = (0, import_react.useState)("pending");
	const [, force] = (0, import_react.useState)(0);
	const { toast } = useToast();
	(0, import_react.useEffect)(() => subscribe(() => force((n) => n + 1)), []);
	const comments = commentsApi.all(filter === "all" ? void 0 : filter);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-4xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold text-foreground mb-6",
				children: "إدارة التعليقات"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 mb-4 flex-wrap",
				children: [
					"pending",
					"approved",
					"hidden",
					"all"
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setFilter(f),
					className: `px-3 py-1.5 rounded-full text-sm transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-border"}`,
					children: f === "pending" ? "بانتظار المراجعة" : f === "approved" ? "موافق عليها" : f === "hidden" ? "مخفية" : "الكل"
				}, f))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [comments.map((c) => {
					const article = articlesApi.get(c.article_id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card border border-border rounded-xl p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3 mb-2 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 flex-wrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-foreground text-sm",
									children: c.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: c.status === "approved" ? "default" : c.status === "hidden" ? "secondary" : "outline",
									children: c.status === "approved" ? "موافق" : c.status === "hidden" ? "مخفي" : "بالمراجعة"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: [
									"على: ",
									article?.title ?? "(مقال محذوف)",
									" · ",
									new Date(c.created_at).toLocaleString("ar-DZ")
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-1",
								children: [
									c.status !== "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => {
											commentsApi.setStatus(c.id, "approved");
											toast({ title: "تم التحديث" });
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4" })
									}),
									c.status !== "hidden" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => {
											commentsApi.setStatus(c.id, "hidden");
											toast({ title: "تم التحديث" });
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-4 h-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => {
											commentsApi.remove(c.id);
											toast({ title: "تم الحذف" });
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 text-destructive" })
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-foreground whitespace-pre-wrap",
							children: c.message
						})]
					}, c.id);
				}), comments.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-sm text-muted-foreground py-8",
					children: "لا توجد تعليقات"
				})]
			})
		]
	});
}
function AdminNewsletter() {
	const [, force] = (0, import_react.useState)(0);
	const { toast } = useToast();
	(0, import_react.useEffect)(() => subscribe(() => force((n) => n + 1)), []);
	const subs = subscribersApi.all();
	const exportCsv = () => {
		const csv = "email,date\n" + subs.map((s) => `${s.email},${s.created_at}`).join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "newsletter-subscribers.csv";
		a.click();
		URL.revokeObjectURL(url);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-6 flex-wrap gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold text-foreground",
				children: "مشتركو النشرة"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: [subs.length, " مشترك"]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: exportCsv,
				variant: "outline",
				className: "gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }), "تصدير CSV"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-card border border-border rounded-xl divide-y divide-border",
			children: [subs.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-foreground",
					dir: "ltr",
					children: s.email
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: new Date(s.created_at).toLocaleString("ar-DZ")
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						subscribersApi.remove(s.id);
						toast({ title: "تم الحذف" });
					},
					className: "text-destructive hover:opacity-70 p-2",
					"aria-label": "حذف",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
				})]
			}, s.id)), subs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-sm text-muted-foreground py-8",
				children: "لا يوجد مشتركون بعد"
			})]
		})]
	});
}
function AdminPushNotifications() {
	const { toast } = useToast();
	const [title, setTitle] = (0, import_react.useState)("خبر عاجل");
	const [body, setBody] = (0, import_react.useState)("اضغط لقراءة آخر المستجدات");
	const [url, setUrl] = (0, import_react.useState)("/");
	const [sending, setSending] = (0, import_react.useState)(false);
	const [count, setCount] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		supabase.from("push_subscriptions").select("id", {
			count: "exact",
			head: true
		}).then(({ count }) => setCount(count ?? 0));
	}, []);
	const send = async () => {
		if (!title.trim()) return;
		setSending(true);
		const { data, error } = await supabase.functions.invoke("push-send", { body: {
			title,
			body,
			url
		} });
		setSending(false);
		if (error) {
			toast({
				title: "فشل الإرسال",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		toast({
			title: "تم إرسال الإشعار",
			description: `تم إرساله إلى ${data?.sent ?? 0} جهاز${data?.removed ? ` (تم تنظيف ${data.removed})` : ""}`
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 p-4 md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-6 h-6 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold text-foreground",
					children: "الإشعارات الفورية"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: ["عدد المشتركين: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: count ?? "..."
					})]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-card border border-border rounded-xl p-4 md:p-6 space-y-4 max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-sm font-medium mb-1.5",
						children: "العنوان"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						maxLength: 80
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-sm font-medium mb-1.5",
						children: "المحتوى"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: body,
						onChange: (e) => setBody(e.target.value),
						rows: 3,
						maxLength: 200
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-sm font-medium mb-1.5",
						children: "الرابط عند الضغط"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: url,
						onChange: (e) => setUrl(e.target.value),
						placeholder: "/article/..."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: send,
						disabled: sending || !title.trim(),
						className: "gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "w-4 h-4" }), sending ? "جارٍ الإرسال..." : "إرسال إلى جميع الأجهزة"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-muted/40 border border-border rounded-xl p-4 text-sm text-muted-foreground max-w-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 font-medium text-foreground",
					children: "ℹ️ ملاحظات هامة:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "list-disc pr-5 space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "الإشعارات الفورية تعمل فقط بعد نشر التطبيق على دومين حقيقي (HTTPS)." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "يجب على المستخدم تثبيت التطبيق (PWA) وقبول الإشعارات أولاً." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "على iOS، يحتاج المستخدم إلى iOS 16.4+ وإضافة التطبيق إلى الشاشة الرئيسية." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "تأكد من تعيين مفاتيح VAPID في إعدادات Edge Function." })
					]
				})]
			})
		]
	});
}
function AdminCorrections() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [title, setTitle] = (0, import_react.useState)("");
	const [articleId, setArticleId] = (0, import_react.useState)("");
	const [original, setOriginal] = (0, import_react.useState)("");
	const [correction, setCorrection] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const load = async () => {
		const { data } = await supabase.from("corrections_log").select("*").order("corrected_at", { ascending: false });
		setRows(data ?? []);
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const submit = async (e) => {
		e.preventDefault();
		if (!title.trim() || !correction.trim()) return;
		setSaving(true);
		const { error } = await supabase.from("corrections_log").insert({
			article_id: articleId.trim() || null,
			article_title: title.trim(),
			correction: correction.trim(),
			original_text: original.trim() || null
		});
		setSaving(false);
		if (error) {
			ue.error(error.message);
			return;
		}
		ue.success("تم نشر التصحيح");
		setTitle("");
		setArticleId("");
		setOriginal("");
		setCorrection("");
		load();
	};
	const remove = async (id) => {
		const { error } = await supabase.from("corrections_log").delete().eq("id", id);
		if (error) return ue.error(error.message);
		ue.success("تم الحذف");
		load();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-xl md:text-2xl font-bold text-foreground mb-4",
			children: "سجل التصحيحات"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "bg-card border border-border rounded-xl p-4 space-y-3 mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "عنوان المقال",
					value: title,
					onChange: (e) => setTitle(e.target.value),
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "معرّف المقال (UUID — اختياري)",
					value: articleId,
					onChange: (e) => setArticleId(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					placeholder: "النص الأصلي الخاطئ (اختياري)",
					value: original,
					onChange: (e) => setOriginal(e.target.value),
					rows: 2
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					placeholder: "نص التصحيح",
					value: correction,
					onChange: (e) => setCorrection(e.target.value),
					rows: 3,
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: saving,
					children: saving ? "جارٍ الحفظ..." : "نشر التصحيح"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground text-sm",
				children: "لا توجد تصحيحات بعد."
			}), rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold text-foreground",
							children: r.article_title
						}),
						r.original_text && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground line-through mt-1",
							children: r.original_text
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-foreground/90 mt-1",
							children: r.correction
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-2",
							children: new Date(r.corrected_at).toLocaleString("ar-DZ")
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: () => remove(r.id),
					"aria-label": "حذف",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
				})]
			}, r.id))]
		})
	] });
}
function AdminAds() {
	const [ads, setAds] = (0, import_react.useState)([]);
	const [filter, setFilter] = (0, import_react.useState)("pending");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [busyId, setBusyId] = (0, import_react.useState)(null);
	const [noteDraft, setNoteDraft] = (0, import_react.useState)({});
	async function load() {
		setLoading(true);
		let q = supabase.from("ad_submissions").select("*").order("created_at", { ascending: false });
		if (filter !== "all") q = q.eq("status", filter);
		const { data, error } = await q;
		if (error) toast$1({
			title: "تعذّر التحميل",
			description: error.message,
			variant: "destructive"
		});
		setAds(data ?? []);
		setLoading(false);
	}
	(0, import_react.useEffect)(() => {
		load();
	}, [filter]);
	async function signedReceipt(ref) {
		if (!ref.startsWith("ad-uploads://")) {
			window.open(ref, "_blank");
			return;
		}
		const path = ref.replace("ad-uploads://", "");
		const { data, error } = await supabase.storage.from("ad-uploads").createSignedUrl(path, 600);
		if (error || !data) {
			toast$1({
				title: "تعذّر فتح الوصل",
				variant: "destructive"
			});
			return;
		}
		window.open(data.signedUrl, "_blank");
	}
	async function approve(ad) {
		setBusyId(ad.id);
		const now = /* @__PURE__ */ new Date();
		const expires = new Date(now.getTime() + ad.duration_days * 24 * 60 * 60 * 1e3);
		const { error } = await supabase.from("ad_submissions").update({
			status: "approved",
			approved_at: now.toISOString(),
			expires_at: expires.toISOString(),
			admin_note: noteDraft[ad.id] ?? ad.admin_note
		}).eq("id", ad.id);
		setBusyId(null);
		if (error) {
			toast$1({
				title: "فشل",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		toast$1({ title: "تمت الموافقة على الإعلان" });
		load();
	}
	async function reject(ad) {
		setBusyId(ad.id);
		const { error } = await supabase.from("ad_submissions").update({
			status: "rejected",
			admin_note: noteDraft[ad.id] ?? ad.admin_note
		}).eq("id", ad.id);
		setBusyId(null);
		if (error) {
			toast$1({
				title: "فشل",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		toast$1({ title: "تم رفض الإعلان" });
		load();
	}
	async function remove(ad) {
		if (!confirm("حذف هذا الإعلان نهائيًا؟")) return;
		setBusyId(ad.id);
		const { error } = await supabase.from("ad_submissions").delete().eq("id", ad.id);
		setBusyId(null);
		if (error) {
			toast$1({
				title: "فشل الحذف",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		toast$1({ title: "تم الحذف" });
		load();
	}
	const counts = {
		pending: filter === "pending" ? ads.length : null,
		approved: filter === "approved" ? ads.length : null,
		rejected: filter === "rejected" ? ads.length : null,
		all: filter === "all" ? ads.length : null
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4 flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl md:text-2xl font-bold text-foreground",
					children: "إدارة الإعلانات"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: load,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 ms-1" }), " تحديث"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 mb-4 flex-wrap",
				children: [
					"pending",
					"approved",
					"rejected",
					"all"
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setFilter(f),
					className: `px-3 py-1.5 rounded-lg text-sm border transition-colors ${filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:text-foreground"}`,
					children: [
						f === "pending" && "قيد الانتظار",
						f === "approved" && "موافق عليها",
						f === "rejected" && "مرفوضة",
						f === "all" && "الكل",
						counts[f] !== null && ` (${counts[f]})`
					]
				}, f))
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-muted-foreground text-center py-12",
				children: "جارٍ التحميل..."
			}) : ads.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-muted-foreground text-center py-12 border border-dashed border-border rounded-xl",
				children: "لا توجد إعلانات في هذه القائمة."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: ads.map((ad) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-card border border-border rounded-xl p-4 md:p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-[160px_1fr] gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: ad.product_image_url,
							alt: ad.product_title,
							className: "w-full md:w-40 h-40 object-cover rounded-lg border border-border"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between flex-wrap gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-foreground text-lg",
										children: ad.product_title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											ad.advertiser_name,
											" · ",
											ad.contact_email,
											ad.contact_phone && ` · ${ad.contact_phone}`
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `text-[10px] px-2 py-1 rounded-full font-bold ${ad.status === "pending" ? "bg-amber/15 text-amber" : ad.status === "approved" ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"}`,
										children: [
											ad.status === "pending" && "قيد الانتظار",
											ad.status === "approved" && "موافق عليه",
											ad.status === "rejected" && "مرفوض",
											ad.status === "expired" && "منتهي"
										]
									})]
								}),
								ad.product_description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-foreground/80 mt-2 line-clamp-3",
									children: ad.product_description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info$1, {
											label: "المبلغ",
											value: `${ad.amount_dzd.toLocaleString("ar-DZ")} دج`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info$1, {
											label: "المدة",
											value: `${ad.duration_days} يوم`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info$1, {
											label: "مرجع CCP",
											value: ad.ccp_reference,
											mono: true
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info$1, {
											label: "ينتهي",
											value: ad.expires_at ? new Date(ad.expires_at).toLocaleDateString("ar-DZ") : "—"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2 mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => signedReceipt(ad.payment_receipt_url),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-3.5 h-3.5 ms-1" }), " عرض وصل الدفع"]
									}), ad.product_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: ad.product_url,
										target: "_blank",
										rel: "noopener noreferrer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											type: "button",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3.5 h-3.5 ms-1" }), " رابط المنتج"]
										})
									})]
								}),
								(ad.status === "pending" || ad.status === "rejected") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										placeholder: "ملاحظة (اختيارية)",
										rows: 2,
										defaultValue: ad.admin_note ?? "",
										onChange: (e) => setNoteDraft((d) => ({
											...d,
											[ad.id]: e.target.value
										}))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2 mt-3",
									children: [
										ad.status !== "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											onClick: () => approve(ad),
											disabled: busyId === ad.id,
											className: "bg-accent text-accent-foreground hover:bg-accent/90",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4 ms-1" }), " موافقة وتفعيل"]
										}),
										ad.status !== "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => reject(ad),
											disabled: busyId === ad.id,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4 ms-1" }), " رفض"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => remove(ad),
											disabled: busyId === ad.id,
											className: "text-destructive",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 ms-1" }), " حذف"]
										})
									]
								})
							]
						})]
					})
				}, ad.id))
			})
		]
	});
}
function Info$1({ label, value, mono }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `text-foreground font-semibold ${mono ? "font-mono" : ""}`,
		children: value
	})] });
}
var CCP_CODE = "123456789";
var PACKAGES = [
	{
		days: 7,
		price: 1500,
		labelAr: "أسبوع",
		labelEn: "1 week"
	},
	{
		days: 30,
		price: 5e3,
		labelAr: "شهر",
		labelEn: "1 month"
	},
	{
		days: 90,
		price: 12e3,
		labelAr: "3 أشهر",
		labelEn: "3 months"
	}
];
var schema = objectType({
	advertiser_name: stringType().trim().min(2).max(120),
	contact_email: stringType().trim().email().max(255),
	contact_phone: stringType().trim().max(40).optional().or(literalType("")),
	product_title: stringType().trim().min(2).max(200),
	product_description: stringType().trim().max(2e3),
	product_url: stringType().trim().url().max(500).optional().or(literalType("")),
	ccp_reference: stringType().trim().min(3).max(64)
});
function AdvertisePage() {
	const navigate = useNavigate();
	const { isDark, toggle } = useTheme$1();
	const [pkg, setPkg] = (0, import_react.useState)(PACKAGES[0]);
	const [productFile, setProductFile] = (0, import_react.useState)(null);
	const [receiptFile, setReceiptFile] = (0, import_react.useState)(null);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const copyCcp = async () => {
		try {
			await navigator.clipboard.writeText(CCP_CODE);
			toast$1({
				title: "تم النسخ",
				description: `رمز CCP: ${CCP_CODE}`
			});
		} catch {
			toast$1({
				title: "تعذّر النسخ",
				variant: "destructive"
			});
		}
	};
	async function uploadFile(bucket, file, prefix) {
		const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
		const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
		const { error } = await supabase.storage.from(bucket).upload(path, file, {
			contentType: file.type || void 0,
			upsert: false
		});
		if (error) {
			console.error(`Upload failed: ${bucket}/${path}`, error);
			return null;
		}
		return `${bucket}://${path}`;
	}
	const onSubmit = async (e) => {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const raw = {
			advertiser_name: String(form.get("advertiser_name") || ""),
			contact_email: String(form.get("contact_email") || ""),
			contact_phone: String(form.get("contact_phone") || ""),
			product_title: String(form.get("product_title") || ""),
			product_description: String(form.get("product_description") || ""),
			product_url: String(form.get("product_url") || ""),
			ccp_reference: String(form.get("ccp_reference") || "")
		};
		const parsed = schema.safeParse(raw);
		if (!parsed.success) {
			toast$1({
				title: "الرجاء التحقق من الحقول",
				description: parsed.error.issues[0]?.message,
				variant: "destructive"
			});
			return;
		}
		if (!productFile) {
			toast$1({
				title: "صورة المنتج مطلوبة",
				variant: "destructive"
			});
			return;
		}
		if (!receiptFile) {
			toast$1({
				title: "وصل الدفع مطلوب",
				variant: "destructive"
			});
			return;
		}
		if (productFile.size > 5242880 || receiptFile.size > 5242880) {
			toast$1({
				title: "حجم الملف كبير جدًا (الحد 5MB)",
				variant: "destructive"
			});
			return;
		}
		setSubmitting(true);
		try {
			const [productUrl, receiptRef] = await Promise.all([uploadFile("ad-uploads", productFile, "products"), uploadFile("ad-uploads", receiptFile, "receipts")]);
			if (!productUrl || !receiptRef) {
				toast$1({
					title: "فشل رفع الملفات",
					variant: "destructive"
				});
				setSubmitting(false);
				return;
			}
			const { error } = await supabase.from("ad_submissions").insert({
				advertiser_name: parsed.data.advertiser_name,
				contact_email: parsed.data.contact_email,
				contact_phone: parsed.data.contact_phone || null,
				product_title: parsed.data.product_title,
				product_description: parsed.data.product_description,
				product_url: parsed.data.product_url || null,
				product_image_url: productUrl,
				payment_receipt_url: receiptRef,
				ccp_reference: parsed.data.ccp_reference,
				amount_dzd: pkg.price,
				duration_days: pkg.days,
				status: "pending"
			});
			if (error) {
				console.error(error);
				toast$1({
					title: "تعذّر إرسال الطلب",
					description: error.message,
					variant: "destructive"
				});
				setSubmitting(false);
				return;
			}
			setDone(true);
			toast$1({
				title: "تم استلام طلبك",
				description: "سيقوم الفريق بمراجعة الدفع والموافقة قريبًا."
			});
		} catch (err) {
			console.error(err);
			toast$1({
				title: "خطأ غير متوقع",
				variant: "destructive"
			});
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background flex flex-col",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SEO, {
				title: "أعلن معنا — MAX NEWS",
				description: "أعلن عن منتجك أو خدمتك على MAX NEWS — ادفع عبر CCP وستظهر إعلاناتك بعد التحقق."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
				isDark,
				onToggleTheme: toggle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 container py-6 md:py-10 max-w-3xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl md:text-3xl font-bold text-foreground mb-2",
						children: "أعلن معنا"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground mb-6",
						children: "اعرض منتجك أو خدمتك على آلاف القراء يوميًا. ادفع عبر CCP، أرفق الوصل، وسيتم تفعيل الإعلان بعد التحقق."
					}),
					done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-8 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-14 h-14 text-accent mx-auto mb-3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-bold text-foreground mb-2",
								children: "تم استلام طلبك بنجاح"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground mb-6",
								children: "سيتم التحقق من الدفع خلال 24 ساعة. ستصلك رسالة تأكيد على بريدك الإلكتروني عند الموافقة."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => navigate("/"),
								children: "العودة للرئيسية"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-xl border border-border bg-card p-4 md:p-5 mb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-bold text-foreground mb-3",
								children: "اختر الباقة"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2 md:gap-3",
								children: PACKAGES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setPkg(p),
									className: `text-center rounded-lg border p-3 transition-all ${pkg.days === p.days ? "border-primary bg-primary/10 ring-2 ring-primary/30" : "border-border bg-background hover:border-primary/50"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: p.labelAr
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-lg md:text-xl font-bold text-foreground mt-1",
											children: p.price.toLocaleString("ar-DZ")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: "دج"
										})
									]
								}, p.days))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-xl border border-amber/40 bg-amber/5 p-4 md:p-5 mb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-bold text-foreground mb-2 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "w-5 h-5 text-amber" }), "خطوات الدفع"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
								className: "text-sm text-muted-foreground space-y-2 list-decimal list-inside",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"حوّل مبلغ ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-foreground",
											children: [pkg.price.toLocaleString("ar-DZ"), " دج"]
										}),
										" إلى حساب CCP التالي:"
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "bg-background border border-border rounded px-3 py-1 font-mono text-base text-foreground",
											children: CCP_CODE
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											size: "sm",
											variant: "outline",
											onClick: copyCcp,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3.5 h-3.5 ms-1" }), " نسخ"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "التقط صورة واضحة لوصل التحويل وارفعها أدناه مع رقم العملية المرجعي." })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit,
							className: "rounded-xl border border-border bg-card p-4 md:p-5 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid md:grid-cols-2 gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "advertiser_name",
											children: "الاسم الكامل / اسم الشركة *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "advertiser_name",
											name: "advertiser_name",
											required: true,
											maxLength: 120
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "contact_email",
											children: "البريد الإلكتروني *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "contact_email",
											name: "contact_email",
											type: "email",
											required: true,
											maxLength: 255
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "contact_phone",
											children: "رقم الهاتف"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "contact_phone",
											name: "contact_phone",
											type: "tel",
											maxLength: 40
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "ccp_reference",
											children: "رقم العملية / المرجع *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "ccp_reference",
											name: "ccp_reference",
											required: true,
											maxLength: 64,
											placeholder: "مثال: 20260621-XX1234"
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "product_title",
									children: "عنوان الإعلان *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "product_title",
									name: "product_title",
									required: true,
									maxLength: 200
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "product_description",
									children: "وصف قصير"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "product_description",
									name: "product_description",
									rows: 3,
									maxLength: 2e3
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "product_url",
									children: "رابط المنتج (اختياري)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "product_url",
									name: "product_url",
									type: "url",
									maxLength: 500,
									placeholder: "https://"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid md:grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileField, {
										label: "صورة المنتج *",
										icon: Image,
										file: productFile,
										onChange: setProductFile,
										accept: "image/*"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileField, {
										label: "وصل الدفع *",
										icon: Receipt,
										file: receiptFile,
										onChange: setReceiptFile,
										accept: "image/*,application/pdf"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: submitting,
									className: "w-full",
									children: submitting ? "جارٍ الإرسال..." : "إرسال الطلب"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground text-center",
									children: "* بإرسال الطلب فإنك توافق على شروط الإعلان. سيتم مراجعة الدفع يدويًا."
								})
							]
						})
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
function FileField({ label, icon: Icon, file, onChange, accept }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors min-h-[120px] bg-background",
		children: [file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-8 h-8 text-accent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm text-foreground text-center break-all",
				children: file.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs text-muted-foreground",
				children: [(file.size / 1024).toFixed(0), " KB"]
			})
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-8 h-8 text-muted-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-sm text-muted-foreground flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-3.5 h-3.5" }), " اختر ملفًا"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] text-muted-foreground",
				children: "الحد الأقصى 5MB"
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "file",
			accept,
			className: "hidden",
			onChange: (e) => onChange(e.target.files?.[0] ?? null)
		})]
	})] });
}
function CorrectionsLogPage() {
	const { isDark, toggle } = useTheme$1();
	const { lang, isRTL } = useLanguage();
	const Arrow = isRTL ? ArrowRight : ArrowLeft;
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data } = await supabase.from("corrections_log").select("id, article_id, article_title, correction, original_text, corrected_at").eq("is_published", true).order("corrected_at", { ascending: false });
			setRows(data ?? []);
			setLoading(false);
		})();
	}, []);
	const fmt = (d) => new Date(d).toLocaleDateString(lang === "ar" ? "ar-DZ" : "en-GB", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
				isDark,
				onToggleTheme: toggle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 container max-w-3xl py-8 pb-16 md:pb-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "inline-flex items-center gap-2 text-sm text-primary hover:underline mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, { className: "w-4 h-4" }), lang === "ar" ? "العودة للرئيسية" : "Back to home"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl md:text-4xl font-bold mb-3 text-foreground",
						children: lang === "ar" ? "سجل التصحيحات" : "Corrections Log"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground leading-relaxed mb-8",
						children: lang === "ar" ? "نلتزم بالشفافية. كل تصحيح أُجري على مقالاتنا المنشورة يُسجَّل هنا علناً، طبقاً لميثاقنا التحريري وحق التصحيح." : "We are committed to transparency. Every correction made to our published articles is logged here publicly, in accordance with our editorial charter and the right of rectification."
					}),
					loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: lang === "ar" ? "جارٍ التحميل..." : "Loading..."
					}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border border-border bg-muted/30 p-6 text-center text-muted-foreground",
						children: lang === "ar" ? "لا توجد تصحيحات منشورة حتى الآن." : "No published corrections yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "space-y-4",
						children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-xl border border-border bg-card p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-5 h-5 text-amber shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between flex-wrap gap-2 mb-2",
											children: [r.article_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: `/article/${r.article_id}`,
												className: "font-bold text-foreground hover:text-primary transition-colors",
												children: r.article_title
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-foreground",
												children: r.article_title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-muted-foreground",
												children: fmt(r.corrected_at)
											})]
										}),
										r.original_text && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground line-through mb-1",
											children: r.original_text
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-foreground/90 leading-relaxed",
											children: r.correction
										})
									]
								})]
							})
						}, r.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {})
		]
	});
}
function LegalPage({ content }) {
	const { isDark, toggle } = useTheme$1();
	const { lang, isRTL } = useLanguage();
	const Arrow = isRTL ? ArrowRight : ArrowLeft;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen pb-16 md:pb-0 bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SEO, {
				title: content.title[lang],
				description: content.intro?.[lang]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
				isDark,
				onToggleTheme: toggle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "main-content",
				className: "container max-w-3xl py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "inline-flex items-center gap-2 text-sm text-primary hover:underline mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, { className: "w-4 h-4" }), lang === "ar" ? "العودة للرئيسية" : "Back to home"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl md:text-4xl font-bold mb-4 text-foreground",
						children: content.title[lang]
					}),
					content.intro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground leading-relaxed mb-8 text-lg",
						children: content.intro[lang]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-8",
						children: content.sections.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-bold mb-3 text-foreground",
							children: s.heading[lang]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-foreground/80 leading-relaxed whitespace-pre-line",
							children: s.body[lang]
						})] }, i))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {})
		]
	});
}
var aboutContent = {
	title: {
		ar: "من نحن",
		en: "About us"
	},
	intro: {
		ar: "MAX NEWS موقع إخباري جزائري مستقل يهتم بنقل الأخبار ومتابعة الأحداث بمختلف مجالاتها داخل الجزائر وخارجها.\n\nنقدم للقارئ الأخبار السياسية والاقتصادية والاجتماعية والرياضية والثقافية والتكنولوجية وغيرها من الملفات التي تشكل صلب المشهد الوطني والدولي.\n\nنعتمد في عملنا على التحقق من المعلومات والرجوع إلى المصادر الموثوقة وتقديم الخبر بوضوح ودقة وسرعة مع الحفاظ على المضمون الحقيقي للحدث.",
		en: "MAX NEWS is an independent Algerian news website covering news and events across all fields inside Algeria and abroad.\n\nWe bring readers political, economic, social, sports, cultural and technology news, and the other files at the heart of the national and international scene.\n\nOur work relies on verifying information, referring to reliable sources, and presenting news clearly, accurately and quickly while preserving the true substance of events."
	},
	sections: [
		{
			heading: {
				ar: "مبادئ MAX NEWS",
				en: "MAX NEWS principles"
			},
			body: {
				ar: "",
				en: ""
			}
		},
		{
			heading: {
				ar: "الحقيقة",
				en: "Truth"
			},
			body: {
				ar: "نضع صحة المعلومة في مقدمة أولويات العمل الصحفي.",
				en: "We put the accuracy of information first in our journalism."
			}
		},
		{
			heading: {
				ar: "التحقق",
				en: "Verification"
			},
			body: {
				ar: "لا نعتمد أي معلومة قبل التأكد منها ومراجعة مصادرها.",
				en: "We adopt no information before confirming it and reviewing its sources."
			}
		},
		{
			heading: {
				ar: "الدقة",
				en: "Accuracy"
			},
			body: {
				ar: "نحرص على نقل التفاصيل كما وردت دون تحريف أو اجتزاء يغير معنى الخبر.",
				en: "We report details as they are, without distortion or selective cuts that change the meaning."
			}
		},
		{
			heading: {
				ar: "السرعة",
				en: "Speed"
			},
			body: {
				ar: "نواكب الأحداث في وقتها مع الحفاظ على جودة المعلومة.",
				en: "We follow events as they happen while keeping information quality."
			}
		},
		{
			heading: {
				ar: "الموضوعية",
				en: "Objectivity"
			},
			body: {
				ar: "نفصل بين نقل الخبر والتعبير عن الرأي ونبتعد عن التهويل والإثارة غير المبررة.",
				en: "We separate news from opinion and avoid exaggeration and unjustified sensationalism."
			}
		},
		{
			heading: {
				ar: "المصادر الموثوقة",
				en: "Reliable sources"
			},
			body: {
				ar: "نعتمد على المصادر الرسمية والجهات المختصة والمصادر المهنية الموثوقة بحسب طبيعة كل موضوع.",
				en: "We rely on official, specialized and trusted professional sources depending on each topic."
			}
		},
		{
			heading: {
				ar: "وضوح الخبر",
				en: "Clarity"
			},
			body: {
				ar: "نقدم المعلومة بلغة واضحة ومباشرة تجعل القارئ أمام صورة مفهومة عن الحدث.",
				en: "We present information in clear, direct language that gives readers an understandable picture."
			}
		},
		{
			heading: {
				ar: "مواجهة التضليل",
				en: "Countering misinformation"
			},
			body: {
				ar: "نتعامل بحذر مع الأخبار والمعلومات المتداولة عبر المنصات الرقمية ولا نعتمدها قبل التحقق منها.",
				en: "We treat information circulating on digital platforms with caution and do not adopt it before verification."
			}
		},
		{
			heading: {
				ar: "الملكية الفكرية",
				en: "Intellectual property"
			},
			body: {
				ar: "نحترم حقوق المؤلف والمحتوى الصحفي وننسب المواد إلى مصادرها.",
				en: "We respect copyright and journalistic content and credit materials to their sources."
			}
		},
		{
			heading: {
				ar: "الالتزام المهني",
				en: "Professional commitment"
			},
			body: {
				ar: "نلتزم بالقواعد المهنية للعمل الصحفي وبالقوانين الجزائرية المنظمة للإعلام.",
				en: "We abide by professional journalism rules and Algerian media laws."
			}
		},
		{
			heading: {
				ar: "MAX NEWS",
				en: "MAX NEWS"
			},
			body: {
				ar: "نبض الحدث",
				en: "The pulse of events"
			}
		}
	]
};
var imprintContent = {
	title: {
		ar: "البيانات القانونية",
		en: "Legal Notice / Mentions Légales"
	},
	sections: [
		{
			heading: {
				ar: "هوية الناشر",
				en: "Publisher Identity"
			},
			body: {
				ar: "اسم الشركة: Max News DZ SARL\nالشكل القانوني: شركة ذات مسؤولية محدودة (SARL)\nرأس المال الاجتماعي: 1.000.000 دج\nرقم السجل التجاري: 16/00-1234567 B 24\nرقم التعريف الجبائي (NIF): 002416123456789\nالعنوان: شارع ديدوش مراد، 16000 الجزائر العاصمة، الجزائر",
				en: "Company name: Max News DZ SARL\nLegal form: Limited Liability Company (SARL)\nShare capital: 1,000,000 DZD\nCommercial registry: 16/00-1234567 B 24\nTax ID (NIF): 002416123456789\nAddress: Didouche Mourad Street, 16000 Algiers, Algeria"
			}
		},
		{
			heading: {
				ar: "مدير النشر",
				en: "Director of Publication"
			},
			body: {
				ar: "السيد أحمد بن عمر، المسؤول مدنياً وجزائياً عن جميع المحتويات المنشورة على الموقع، طبقاً للقانون العضوي رقم 12-05 المؤرخ في 12 جانفي 2012 المتعلق بالإعلام.",
				en: "Mr. Ahmed Benamar, civilly and criminally responsible for all content published on the site, in accordance with Organic Law No. 12-05 of January 12, 2012 on Information."
			}
		},
		{
			heading: {
				ar: "الاتصال",
				en: "Contact"
			},
			body: {
				ar: "البريد الإلكتروني: contact@maxnews.dz\nالهاتف: +213 (0) 21 00 00 00\nالاستفسارات التحريرية: redaction@maxnews.dz",
				en: "Email: contact@maxnews.dz\nPhone: +213 (0) 21 00 00 00\nEditorial inquiries: redaction@maxnews.dz"
			}
		},
		{
			heading: {
				ar: "الاستضافة",
				en: "Hosting Provider"
			},
			body: {
				ar: "يستضاف الموقع لدى مزود خدمات سحابية متوافق مع المعايير الدولية للأمن وحماية البيانات.",
				en: "The site is hosted by a cloud services provider compliant with international security and data protection standards."
			}
		}
	]
};
var editorialContent = {
	title: {
		ar: "الميثاق التحريري",
		en: "Editorial Charter"
	},
	intro: {
		ar: "يلتزم Max News DZ بمعايير مهنية عالية في ممارسة الصحافة، مع الاحترام التام للدستور الجزائري وقانون الإعلام والقيم الوطنية.",
		en: "Max News DZ commits to high professional standards in journalism, with full respect for the Algerian constitution, the Information Law, and national values."
	},
	sections: [
		{
			heading: {
				ar: "رسالتنا",
				en: "Our Mission"
			},
			body: {
				ar: "تقديم معلومة دقيقة، موثوقة، ومتعددة الزوايا للقارئ الجزائري والعربي، وخدمة الحق في الإعلام المنصوص عليه في الدستور.",
				en: "To deliver accurate, verified, and pluralistic information to Algerian and Arab readers, serving the constitutional right to information."
			}
		},
		{
			heading: {
				ar: "قيمنا الصحفية",
				en: "Journalistic Values"
			},
			body: {
				ar: "• الحياد والموضوعية: نفصل بين الخبر والرأي بوضوح.\n• التعددية: نعرض وجهات النظر المختلفة بإنصاف.\n• التحقق من المصادر: لا ننشر خبراً دون التأكد من صحته من مصدرين مستقلين على الأقل.\n• احترام الكرامة الإنسانية وحقوق الأفراد.\n• الاستقلالية عن أي ضغط سياسي أو اقتصادي.",
				en: "• Impartiality & objectivity: We clearly separate news from opinion.\n• Pluralism: We present diverse viewpoints fairly.\n• Source verification: We do not publish without confirmation from at least two independent sources.\n• Respect for human dignity and individual rights.\n• Independence from any political or economic pressure."
			}
		},
		{
			heading: {
				ar: "الالتزامات الوطنية",
				en: "National Obligations"
			},
			body: {
				ar: "نلتزم باحترام أحكام الدستور الجزائري، الدين الإسلامي، الوحدة الوطنية، السلامة الترابية، والثوابت الوطنية، طبقاً لأحكام القانون العضوي 12-05 المتعلق بالإعلام.",
				en: "We respect the provisions of the Algerian constitution, the Islamic religion, national unity, territorial integrity, and national constants, in accordance with Organic Law 12-05 on Information."
			}
		},
		{
			heading: {
				ar: "التحقق من المعلومات",
				en: "Fact-Checking"
			},
			body: {
				ar: "نتحقق ونتقاطع كل معلومة قبل نشرها (Nous vérifions et recoupons chaque info). لا نعتمد على مصدر واحد في الأخبار الحساسة، ونميّز بوضوح بين المعلومة المؤكدة، والمعلومة قيد التحقق، والشائعة. كل خبر منقول من وكالة أو وسيلة إعلام أخرى يُنسب صراحةً إلى مصدره.",
				en: "We verify and cross-check every piece of information before publication (Nous vérifions et recoupons chaque info). We never rely on a single source for sensitive stories, and we clearly distinguish confirmed information, information being verified, and rumors. Every story sourced from an agency or another outlet is explicitly credited."
			}
		},
		{
			heading: {
				ar: "الإسناد والمصادر (Bylines)",
				en: "Bylines & Attribution"
			},
			body: {
				ar: "كل مقال يحمل اسم كاتبه أو مصدره وتاريخ النشر. لا ننسخ محتوى من وسائل إعلام أخرى دون ذكر المصدر، طبقاً لقانون الإعلام الجزائري وحقوق الملكية الفكرية.",
				en: "Every article displays its author or source and publication date. We do not copy content from other outlets without credit, in accordance with Algerian press law and intellectual property rights."
			}
		},
		{
			heading: {
				ar: "الحياد ورفض الإثارة",
				en: "Neutrality & No Sensationalism"
			},
			body: {
				ar: "نلتزم صراحةً بعدم الانحياز السياسي أو الحزبي أو الطائفي، ونرفض العناوين المضلِّلة (clickbait) والإثارة على حساب الدقة. الافتتاحيات والآراء تُنشر في قسم منفصل وموسومة بوضوح كرأي.",
				en: "We explicitly commit to no political, partisan, or sectarian bias, and reject misleading headlines (clickbait) and sensationalism at the expense of accuracy. Editorials and opinions are published in a separate section and clearly labeled as opinion."
			}
		},
		{
			heading: {
				ar: "اللغة والمحتوى الوطني",
				en: "Language & National Content"
			},
			body: {
				ar: "تُنشر محتوياتنا أساساً باللغة العربية واللغة الأمازيغية، احتراماً للقانون 23-20 وأحكام الدستور المتعلقة باللغات الوطنية. اللغتان الفرنسية والإنجليزية تُستعملان كلغتَي تكميل فقط. نولي الأولوية للتغطية المحلية الجزائرية والسياق الوطني، تماشياً مع روح حصة المحتوى الوطني (60%) المعتمدة في الإعلام الجزائري.",
				en: "Our content is primarily published in Arabic and Tamazight, in respect of Law 23-20 and constitutional provisions on national languages. French and English are used only as supplementary languages. We prioritize local Algerian reporting and national context, in line with the spirit of the 60% national content quota applied in Algerian media."
			}
		},
		{
			heading: {
				ar: "التصحيحات والاعتذار",
				en: "Corrections & Apology"
			},
			body: {
				ar: "نعترف بأن الخطأ وارد في العمل الصحفي. عند ثبوت أي خطأ نلتزم بنشر تصحيح واضح في موقع بارز خلال 48 ساعة، وإخطار الأشخاص المعنيين (حق التصحيح). يُحفظ سجل علني للتصحيحات يمكن الاطلاع عليه عبر صفحة سجل التصحيحات.",
				en: "We acknowledge that errors can occur in journalism. When proven, we commit to publishing a clear correction in a prominent location within 48 hours and notifying the persons concerned (right of rectification). A public corrections log is maintained and accessible via the Corrections Log page."
			}
		}
	]
};
var correctionsContent = {
	title: {
		ar: "سياسة التصحيحات وحق الرد",
		en: "Corrections & Right of Reply"
	},
	intro: {
		ar: "نأخذ دقة معلوماتنا على محمل الجد. إذا لاحظت خطأً، أو إذا ذُكر اسمك في مقال وترغب في ممارسة حق الرد، يرجى التواصل معنا.",
		en: "We take the accuracy of our information seriously. If you spot an error, or if you are named in an article and wish to exercise your right of reply, please contact us."
	},
	sections: [
		{
			heading: {
				ar: "كيفية تقديم تصحيح",
				en: "How to Submit a Correction"
			},
			body: {
				ar: "أرسل بريداً إلكترونياً إلى corrections@maxnews.dz مع:\n• رابط المقال المعني\n• وصف الخطأ بدقة\n• المصدر أو الدليل الذي يثبت الصحيح\nسنرد خلال 72 ساعة كحد أقصى، وننشر التصحيح في حالة ثبوت الخطأ.",
				en: "Email corrections@maxnews.dz with:\n• Link to the article concerned\n• Precise description of the error\n• Source or evidence supporting the correct version\nWe respond within a maximum of 72 hours, and publish the correction when the error is confirmed."
			}
		},
		{
			heading: {
				ar: "حق الرد",
				en: "Right of Reply"
			},
			body: {
				ar: "طبقاً للمواد 100 إلى 105 من القانون العضوي 12-05، لكل شخص طبيعي أو معنوي ذُكر في مقال الحق في الرد. أرسل طلبك المكتوب إلى droit-de-reponse@maxnews.dz خلال 30 يوماً من تاريخ النشر، وسننشر ردك ضمن نفس الشروط (الموقع والحجم) خلال 3 أيام.",
				en: "Under Articles 100 to 105 of Organic Law 12-05, any natural or legal person named in an article has the right of reply. Send your written request to droit-de-reponse@maxnews.dz within 30 days of publication. We will publish your reply under the same conditions (location and size) within 3 days."
			}
		},
		{
			heading: {
				ar: "الشكاوى",
				en: "Complaints"
			},
			body: {
				ar: "للشكاوى المتعلقة بالأخلاقيات المهنية، يمكن التواصل مع رئيس التحرير على redacteur-chef@maxnews.dz أو مع سلطة ضبط الصحافة المكتوبة.",
				en: "For complaints related to professional ethics, contact the Editor-in-Chief at redacteur-chef@maxnews.dz or the Press Regulatory Authority."
			}
		}
	]
};
var privacyContent = {
	title: {
		ar: "سياسة الخصوصية",
		en: "Privacy Policy"
	},
	intro: {
		ar: "تحترم Max News DZ خصوصية مستخدميها وتلتزم بأحكام القانون 18-07 المؤرخ في 10 جوان 2018 المتعلق بحماية الأشخاص الطبيعيين في مجال معالجة المعطيات ذات الطابع الشخصي.",
		en: "Max News DZ respects user privacy and complies with Law 18-07 of June 10, 2018 on the protection of natural persons regarding personal data processing."
	},
	sections: [
		{
			heading: {
				ar: "البيانات التي نجمعها",
				en: "Data We Collect"
			},
			body: {
				ar: "• البريد الإلكتروني: عند الاشتراك في النشرة الإخبارية، طبقاً للقانون 18-07.\n• الاسم والرسالة: عند إرسال تعليق أو رسالة اتصال.\n• ملفات تعريف الارتباط (Cookies): لتحسين تجربة التصفح.\n• بيانات الاستخدام المجمعة وغير الاسمية (إحصائيات الزوار).",
				en: "• Email: When subscribing to the newsletter, in accordance with Law 18-07.\n• Name & message: When submitting a comment or contact form.\n• Cookies: To improve browsing experience.\n• Aggregated, non-nominative usage data (visitor statistics)."
			}
		},
		{
			heading: {
				ar: "أغراض المعالجة",
				en: "Purposes of Processing"
			},
			body: {
				ar: "تُستعمل بياناتك حصراً لـ: إرسال النشرة الإخبارية، الرد على رسائلك، الإشراف على التعليقات، تحسين أداء الموقع. لا نبيع بياناتك ولا نشاركها مع أطراف ثالثة لأغراض تجارية.",
				en: "Your data is used exclusively to: send the newsletter, respond to your messages, moderate comments, and improve site performance. We do not sell your data or share it with third parties for commercial purposes."
			}
		},
		{
			heading: {
				ar: "حقوقك",
				en: "Your Rights"
			},
			body: {
				ar: "طبقاً للقانون 18-07، لك الحق في: الوصول إلى بياناتك، تصحيحها، حذفها، الاعتراض على معالجتها، وإلغاء الاشتراك في النشرة في أي وقت. للممارسة، اتصل بـ: privacy@maxnews.dz",
				en: "Under Law 18-07, you have the right to: access your data, correct it, delete it, object to its processing, and unsubscribe from the newsletter at any time. To exercise these rights, contact: privacy@maxnews.dz"
			}
		},
		{
			heading: {
				ar: "مدة الحفظ",
				en: "Retention Period"
			},
			body: {
				ar: "نحتفظ بالبيانات للمدة الضرورية لتحقيق الغرض من جمعها، أو حتى طلب الحذف من قبل المستخدم.",
				en: "We retain data for the period necessary to achieve the purpose of collection, or until deletion request by the user."
			}
		},
		{
			heading: {
				ar: "السلطة المختصة",
				en: "Competent Authority"
			},
			body: {
				ar: "في حال نزاع، يمكنك تقديم شكوى لدى السلطة الوطنية لحماية المعطيات ذات الطابع الشخصي (ANPDP).",
				en: "In case of dispute, you may file a complaint with the National Authority for the Protection of Personal Data (ANPDP)."
			}
		}
	]
};
var cookiesContent = {
	title: {
		ar: "إشعار ملفات تعريف الارتباط",
		en: "Cookie Notice"
	},
	intro: {
		ar: "يستخدم هذا الموقع ملفات تعريف الارتباط (Cookies) لتحسين تجربتك. يمكنك التحكم فيها أو رفضها من إعدادات متصفحك.",
		en: "This site uses cookies to improve your experience. You can manage or reject them through your browser settings."
	},
	sections: [{
		heading: {
			ar: "أنواع الكوكيز المستخدمة",
			en: "Types of Cookies Used"
		},
		body: {
			ar: "• كوكيز ضرورية: تشغيل الموقع وتذكر تفضيلاتك (اللغة، الوضع الداكن).\n• كوكيز أداء: قياس أداء الموقع وعدد الزوار (مجمعة ومجهولة).\n• كوكيز التخزين المحلي: لحفظ المقالات والإشارات المرجعية على جهازك.",
			en: "• Essential cookies: Operating the site and remembering preferences (language, dark mode).\n• Performance cookies: Measuring site performance and visitors (aggregated, anonymous).\n• Local storage: Saving articles and bookmarks on your device."
		}
	}, {
		heading: {
			ar: "موافقتك",
			en: "Your Consent"
		},
		body: {
			ar: "بمواصلة استخدام الموقع، فإنك توافق على استخدامنا للكوكيز كما هو موضح. يمكنك سحب موافقتك في أي وقت بحذف الكوكيز من متصفحك.",
			en: "By continuing to use the site, you agree to our use of cookies as described. You can withdraw consent at any time by clearing cookies from your browser."
		}
	}]
};
var termsContent = {
	title: {
		ar: "شروط الاستخدام",
		en: "Terms of Use"
	},
	intro: {
		ar: "يخضع استخدامك لموقع Max News DZ للشروط التالية. باستخدام الموقع، فإنك تقبل هذه الشروط.",
		en: "Your use of Max News DZ is subject to the following terms. By using the site, you accept these terms."
	},
	sections: [
		{
			heading: {
				ar: "الملكية الفكرية",
				en: "Intellectual Property"
			},
			body: {
				ar: "جميع المحتويات المنشورة (نصوص، صور، فيديو) محمية بحقوق المؤلف وهي ملك لـ Max News DZ أو لأصحابها. يُمنع إعادة النشر دون إذن مكتوب مسبق.",
				en: "All published content (text, images, video) is protected by copyright and belongs to Max News DZ or its rightful owners. Reproduction is prohibited without prior written consent."
			}
		},
		{
			heading: {
				ar: "سلوك المستخدم",
				en: "User Conduct"
			},
			body: {
				ar: "يلتزم المستخدم بـ: عدم نشر محتوى مسيء، تشهيري، عنصري، أو مخالف للقانون في التعليقات. نحتفظ بالحق في حذف أي محتوى يخالف هذه الشروط.",
				en: "Users agree not to post offensive, defamatory, racist, or unlawful content in comments. We reserve the right to remove any content violating these terms."
			}
		},
		{
			heading: {
				ar: "إخلاء المسؤولية",
				en: "Disclaimer"
			},
			body: {
				ar: "نسعى لتقديم معلومات دقيقة، لكن لا نضمن خلوها التام من الأخطاء. لا نتحمل المسؤولية عن المحتوى الخارجي المرتبط من الموقع.",
				en: "We strive for accurate information but do not guarantee it is entirely error-free. We are not liable for external content linked from the site."
			}
		},
		{
			heading: {
				ar: "روابط مفيدة",
				en: "Useful Links"
			},
			body: {
				ar: "اطلع كذلك على: سياسة الخصوصية، إشعار الكوكيز، الميثاق التحريري.",
				en: "See also: Privacy Policy, Cookie Notice, Editorial Charter."
			}
		}
	]
};
var copyrightContent = {
	title: {
		ar: "سياسة حقوق النشر",
		en: "Copyright Policy"
	},
	intro: {
		ar: "جميع المحتويات المنشورة على Max News DZ محمية بموجب قوانين حقوق المؤلف الجزائرية والدولية، لا سيما الأمر رقم 03-05 المتعلق بحقوق المؤلف والحقوق المجاورة.",
		en: "All content published on Max News DZ is protected under Algerian and international copyright laws, in particular Ordinance 03-05 on copyright and related rights."
	},
	sections: [
		{
			heading: {
				ar: "ملكية المحتوى",
				en: "Ownership of Content"
			},
			body: {
				ar: "النصوص والصور ومقاطع الفيديو والرسوم التوضيحية والشعارات المنشورة على الموقع هي ملك حصري لـ Max News DZ أو لأصحاب الحقوق الذين منحونا ترخيصاً للنشر. يُحظر إعادة الإنتاج أو النسخ أو التوزيع أو التعديل دون إذن خطي مسبق.",
				en: "Texts, images, videos, illustrations and logos published on the site are the exclusive property of Max News DZ or of rights holders who have granted us a publishing license. Reproduction, copying, distribution or modification without prior written authorization is prohibited."
			}
		},
		{
			heading: {
				ar: "الاقتباس المسموح به",
				en: "Permitted Citation"
			},
			body: {
				ar: "يُسمح بالاقتباس القصير لأغراض النقد أو المراجعة أو التعليم أو الصحافة، بشرط ذكر المصدر بوضوح (Max News DZ) ووضع رابط مباشر للمقال الأصلي.",
				en: "Short quotations are permitted for criticism, review, education or journalism, provided that the source (Max News DZ) is clearly cited and a direct link to the original article is included."
			}
		},
		{
			heading: {
				ar: "محتوى الأطراف الثالثة",
				en: "Third-Party Content"
			},
			body: {
				ar: "بعض الصور أو المقاطع تنتمي إلى وكالات أنباء (AFP, AP, Reuters) أو إلى مؤلفيها الأصليين. يُشار إلى المصدر بجانب كل عنصر. يُمنع إعادة استخدامها دون الرجوع إلى صاحب الحق المعني.",
				en: "Some images or clips belong to news agencies (AFP, AP, Reuters) or to their original authors. The source is indicated next to each element. They may not be reused without referring to the relevant rights holder."
			}
		},
		{
			heading: {
				ar: "الإبلاغ عن انتهاك",
				en: "Reporting Infringement"
			},
			body: {
				ar: "إذا كنت تعتقد أن أحد محتوياتك المحمية قد نُشر دون إذن، يُرجى مراسلتنا عبر صفحة \"اتصل بنا\" مع تقديم: تحديد العمل المحمي، رابط النشر المخالف، وإثبات ملكيتك. سنتعامل مع طلبك خلال 7 أيام عمل.",
				en: "If you believe that one of your protected works has been published without authorization, please contact us via the \"Contact\" page providing: identification of the protected work, link to the infringing publication, and proof of your ownership. We will process your request within 7 business days."
			}
		},
		{
			heading: {
				ar: "العقوبات",
				en: "Sanctions"
			},
			body: {
				ar: "أي انتهاك لحقوق النشر يُعرّض صاحبه للملاحقة القضائية وفقاً للمواد 151 إلى 160 من الأمر 03-05، والتي تنص على عقوبات مالية وسجنية.",
				en: "Any copyright infringement exposes the offender to legal proceedings under articles 151 to 160 of Ordinance 03-05, which provide for financial and custodial penalties."
			}
		}
	]
};
var disclaimerContent = {
	title: {
		ar: "إخلاء مسؤولية المحتوى",
		en: "Content Responsibility Disclaimer"
	},
	intro: {
		ar: "يحرص فريق Max News DZ على تقديم معلومات دقيقة ومحققة، لكن استخدام محتوى الموقع يخضع للشروط والتنبيهات التالية.",
		en: "The Max News DZ team strives to provide accurate and verified information, but use of the site's content is subject to the following terms and warnings."
	},
	sections: [
		{
			heading: {
				ar: "طبيعة المعلومات",
				en: "Nature of Information"
			},
			body: {
				ar: "المعلومات المنشورة ذات طابع إخباري وعام. لا تُشكّل استشارة قانونية أو طبية أو مالية أو مهنية. يُنصح القارئ بالرجوع إلى مختص قبل اتخاذ أي قرار يستند إلى محتوى الموقع.",
				en: "The information published is of a journalistic and general nature. It does not constitute legal, medical, financial or professional advice. Readers are advised to consult a specialist before making any decision based on the site's content."
			}
		},
		{
			heading: {
				ar: "دقة المحتوى",
				en: "Accuracy of Content"
			},
			body: {
				ar: "رغم تحققنا من كل خبر قبل النشر، قد تتغير المعطيات بمرور الوقت أو تظهر معلومات جديدة. لا نضمن الدقة المطلقة أو اكتمال المحتوى في جميع الأوقات. التصحيحات تُنشر في سجل التصحيحات.",
				en: "Although we verify every story before publication, data may change over time or new information may emerge. We do not guarantee absolute accuracy or completeness of content at all times. Corrections are published in the corrections log."
			}
		},
		{
			heading: {
				ar: "آراء الكتّاب والمعلقين",
				en: "Opinions of Authors and Commenters"
			},
			body: {
				ar: "آراء الكتّاب في أعمدة الرأي والتحليل تُعبّر عن أصحابها ولا تُلزم بالضرورة هيئة تحرير Max News DZ. التعليقات المنشورة من القراء هي مسؤولية أصحابها وحدهم.",
				en: "Opinions expressed by authors in opinion and analysis columns reflect their own views and do not necessarily commit the Max News DZ editorial board. Comments posted by readers are the sole responsibility of their authors."
			}
		},
		{
			heading: {
				ar: "الروابط الخارجية",
				en: "External Links"
			},
			body: {
				ar: "قد يحتوي الموقع على روابط لمواقع خارجية. لا نتحكم في محتوى هذه المواقع ولا نتحمل أي مسؤولية عن دقتها أو سياساتها أو ممارساتها.",
				en: "The site may contain links to external websites. We do not control the content of these sites and accept no responsibility for their accuracy, policies or practices."
			}
		},
		{
			heading: {
				ar: "حدود المسؤولية",
				en: "Limitation of Liability"
			},
			body: {
				ar: "لا يتحمل Max News DZ أي مسؤولية عن الأضرار المباشرة أو غير المباشرة الناتجة عن استخدام الموقع أو عدم القدرة على الوصول إليه، أو عن أي قرار يتخذه القارئ بناءً على المحتوى المنشور.",
				en: "Max News DZ accepts no liability for direct or indirect damages arising from use of the site or inability to access it, or from any decision taken by the reader based on the published content."
			}
		},
		{
			heading: {
				ar: "التواصل والتصحيح",
				en: "Contact & Correction"
			},
			body: {
				ar: "لأي ملاحظة أو طلب تصحيح، استخدم صفحة \"التصحيحات وحق الرد\" أو \"اتصل بنا\". نلتزم بالرد خلال 48 ساعة عمل.",
				en: "For any remark or correction request, use the \"Corrections & Right of Reply\" or \"Contact\" page. We commit to respond within 48 business hours."
			}
		}
	]
};
function AboutPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegalPage, { content: aboutContent });
}
function ImprintPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegalPage, { content: imprintContent });
}
function EditorialPolicyPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegalPage, { content: editorialContent });
}
function CorrectionsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegalPage, { content: correctionsContent });
}
function PrivacyPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegalPage, { content: privacyContent });
}
function CookiesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegalPage, { content: cookiesContent });
}
function TermsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegalPage, { content: termsContent });
}
function CopyrightPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegalPage, { content: copyrightContent });
}
function DisclaimerPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegalPage, { content: disclaimerContent });
}
var max_news_animated_default = "/assets/max-news-animated-ByomPuoY.mp4";
var LAST_SEEN_KEY = "max-last-seen";
var SESSION_KEY = "max-splash-shown";
var INACTIVITY_MS = 18e5;
function SplashScreen() {
	const [show, setShow] = (0, import_react.useState)(false);
	const [leaving, setLeaving] = (0, import_react.useState)(false);
	const { t, isRTL } = useLanguage();
	(0, import_react.useEffect)(() => {
		const now = Date.now();
		const last = Number(localStorage.getItem(LAST_SEEN_KEY) || 0);
		const shownThisSession = sessionStorage.getItem(SESSION_KEY) === "1";
		const isFirstVisit = !last;
		const inactiveLongEnough = last && now - last > INACTIVITY_MS;
		if (!shownThisSession && (isFirstVisit || inactiveLongEnough)) {
			setShow(true);
			sessionStorage.setItem(SESSION_KEY, "1");
			const t1 = setTimeout(() => setLeaving(true), 1700);
			const t2 = setTimeout(() => setShow(false), 2100);
			return () => {
				clearTimeout(t1);
				clearTimeout(t2);
				localStorage.setItem(LAST_SEEN_KEY, String(Date.now()));
			};
		}
		localStorage.setItem(LAST_SEEN_KEY, String(now));
		const onUnload = () => localStorage.setItem(LAST_SEEN_KEY, String(Date.now()));
		window.addEventListener("beforeunload", onUnload);
		return () => window.removeEventListener("beforeunload", onUnload);
	}, []);
	if (!show) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `fixed inset-0 z-[200] flex items-center justify-center bg-background transition-opacity duration-500 ${leaving ? "pointer-events-none opacity-0" : "opacity-100"}`,
		dir: isRTL ? "rtl" : "ltr",
		"aria-hidden": leaving,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-5 animate-scale-in",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative h-52 w-52 overflow-hidden rounded-full border-4 border-primary-foreground shadow-2xl md:h-64 md:w-64",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					className: "h-full w-full object-cover",
					src: max_news_animated_default,
					autoPlay: true,
					muted: true,
					playsInline: true,
					preload: "auto",
					"aria-label": "MAX NEWS"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-heading text-sm font-bold uppercase text-primary-foreground",
				children: t("tagline")
			})]
		})
	});
}
function CommandPalette() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [q, setQ] = (0, import_react.useState)("");
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setOpen((v) => !v);
			}
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	const go = (path) => {
		setOpen(false);
		setQ("");
		navigate(path);
	};
	if (!open) return null;
	const items = [
		{
			label: "الرئيسية",
			icon: Newspaper,
			path: "/"
		},
		{
			label: "المحفوظات",
			icon: Bookmark,
			path: "/bookmarks"
		},
		{
			label: "تواصل معنا",
			icon: Mail,
			path: "/contact"
		},
		...categories.filter((c) => c.key !== "all").map((c) => ({
			label: c.label,
			icon: Hash,
			path: `/topic/${c.key}`
		}))
	];
	const filtered = q ? items.filter((i) => i.label.includes(q)) : items;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[150] flex items-start justify-center pt-24 px-4",
		dir: "rtl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-foreground/40 backdrop-blur-sm",
			onClick: () => setOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-lg bg-popover rounded-xl shadow-2xl border border-border overflow-hidden animate-float-in",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 px-4 border-b border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							autoFocus: true,
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "ابحث أو انتقل إلى...",
							className: "flex-1 py-3 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground",
							onKeyDown: (e) => {
								if (e.key === "Enter" && q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`);
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5",
							children: "ESC"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-80 overflow-y-auto py-1",
					children: [
						q.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => go(`/search?q=${encodeURIComponent(q.trim())}`),
							className: "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"بحث عن \"",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold",
										children: q
									}),
									"\""
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-3 h-3 mr-auto text-muted-foreground" })
							]
						}),
						filtered.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => go(it.path),
							className: "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(it.icon, { className: "w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: it.label })]
						}, it.path)),
						filtered.length === 0 && !q.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-4 py-6 text-center text-sm text-muted-foreground",
							children: "لا نتائج"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-4 py-2 border-t border-border bg-muted/40 text-[11px] text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "اضغط Enter للبحث" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "⌘K للفتح" })]
				})
			]
		})]
	});
}
function BackToTop() {
	const [show, setShow] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setShow(window.scrollY > 600);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: () => window.scrollTo({
			top: 0,
			behavior: "smooth"
		}),
		"aria-label": "عودة للأعلى",
		className: `hidden md:flex fixed bottom-6 left-6 z-40 w-11 h-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-all duration-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "w-5 h-5" })
	});
}
var Card = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("rounded-lg border bg-card text-card-foreground shadow-sm", className),
	...props
}));
Card.displayName = "Card";
var CardHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex flex-col space-y-1.5 p-6", className),
	...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
	ref,
	className: cn("text-2xl font-semibold leading-none tracking-tight", className),
	...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("p-6 pt-0", className),
	...props
}));
CardContent.displayName = "CardContent";
var CardFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex items-center p-6 pt-0", className),
	...props
}));
CardFooter.displayName = "CardFooter";
function AdminSettings() {
	const { toast } = useToast();
	const { username, updateUsername, updatePassword, loading } = useAuth();
	const [newUsername, setNewUsername] = (0, import_react.useState)("");
	const [currentPassword, setCurrentPassword] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [savingUsername, setSavingUsername] = (0, import_react.useState)(false);
	const [savingPassword, setSavingPassword] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (username) setNewUsername(username);
	}, [username]);
	const handleUsername = async () => {
		const cleanedUsername = newUsername.trim();
		if (!cleanedUsername) {
			toast({
				title: "خطأ",
				description: "يرجى إدخال اسم المستخدم.",
				variant: "destructive"
			});
			return;
		}
		setSavingUsername(true);
		const { error } = await updateUsername(cleanedUsername);
		setSavingUsername(false);
		if (error) {
			toast({
				title: "تعذر تحديث اسم المستخدم",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		toast({
			title: "تم تحديث اسم المستخدم",
			description: "سيتم استخدام اسم المستخدم الجديد عند تسجيل الدخول القادم."
		});
	};
	const handlePassword = async () => {
		if (!currentPassword) {
			toast({
				title: "خطأ",
				description: "يرجى إدخال كلمة المرور الحالية.",
				variant: "destructive"
			});
			return;
		}
		if (newPassword.length < 6) {
			toast({
				title: "كلمة المرور قصيرة",
				description: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.",
				variant: "destructive"
			});
			return;
		}
		if (newPassword !== confirmPassword) {
			toast({
				title: "كلمتا المرور غير متطابقتين",
				description: "تأكد من أن كلمة المرور الجديدة وتأكيدها متطابقان.",
				variant: "destructive"
			});
			return;
		}
		if (newPassword === currentPassword) {
			toast({
				title: "كلمة المرور الجديدة مطابقة للحالية",
				description: "اختر كلمة مرور مختلفة عن كلمة المرور الحالية.",
				variant: "destructive"
			});
			return;
		}
		setSavingPassword(true);
		const { error } = await updatePassword(currentPassword, newPassword);
		setSavingPassword(false);
		if (error) {
			toast({
				title: "تعذر تحديث كلمة المرور",
				description: error.message,
				variant: "destructive"
			});
			return;
		}
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
		toast({
			title: "تم تحديث كلمة المرور",
			description: "تم تغيير كلمة مرور حساب المسؤول بنجاح."
		});
	};
	const usernameChanged = newUsername.trim() !== "" && newUsername.trim() !== username;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full max-w-5xl space-y-6 pb-10",
		dir: "rtl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "h-6 w-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold tracking-tight text-foreground sm:text-3xl",
						children: "إعدادات الحساب"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "إدارة اسم المستخدم وكلمة المرور الخاصة بحساب المسؤول."
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "overflow-hidden border-border/60 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-6 w-6 text-muted-foreground" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "الحساب الحالي"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-lg font-semibold text-foreground",
								dir: "ltr",
								children: username ?? "—"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex w-fit items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium",
								children: "مسؤول النظام"
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/60 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "border-b border-border/50 pb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-3 text-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "اسم المستخدم" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs font-normal text-muted-foreground",
							children: "اسم المستخدم الذي تستخدمه للدخول إلى لوحة الإدارة."
						})] })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-5 p-5 sm:p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "current-username",
								children: "اسم المستخدم الحالي"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "current-username",
								value: username ?? "",
								readOnly: true,
								dir: "ltr",
								className: "h-11 bg-muted/50"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "new-username",
									children: "اسم المستخدم الجديد"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "new-username",
									value: newUsername,
									onChange: (e) => setNewUsername(e.target.value),
									placeholder: "أدخل اسم مستخدم جديد",
									dir: "ltr",
									className: "h-11",
									disabled: savingUsername || loading
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "يجب أن يتكون اسم المستخدم من 3 إلى 32 حرفًا، ويمكن استخدام الأحرف والأرقام و . _ -"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-start pt-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handleUsername,
								disabled: savingUsername || loading || !usernameChanged,
								className: "min-w-[180px]",
								children: savingUsername ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "me-2 h-4 w-4 animate-spin" }), "جاري الحفظ..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "me-2 h-4 w-4" }), "تحديث اسم المستخدم"] })
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/60 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "border-b border-border/50 pb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-3 text-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "تغيير كلمة المرور" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs font-normal text-muted-foreground",
							children: "قم بتحديث كلمة المرور للحفاظ على أمان حساب المسؤول."
						})] })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-5 p-5 sm:p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "current-password",
								children: "كلمة المرور الحالية"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "current-password",
									type: "password",
									autoComplete: "current-password",
									value: currentPassword,
									onChange: (e) => setCurrentPassword(e.target.value),
									placeholder: "أدخل كلمة المرور الحالية",
									dir: "ltr",
									className: "h-11 ps-10",
									disabled: savingPassword
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "new-password",
									children: "كلمة المرور الجديدة"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "new-password",
										type: "password",
										autoComplete: "new-password",
										value: newPassword,
										onChange: (e) => setNewPassword(e.target.value),
										placeholder: "أدخل كلمة المرور الجديدة",
										dir: "ltr",
										className: "h-11 ps-10",
										disabled: savingPassword
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "confirm-password",
								children: "تأكيد كلمة المرور"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "confirm-password",
									type: "password",
									autoComplete: "new-password",
									value: confirmPassword,
									onChange: (e) => setConfirmPassword(e.target.value),
									placeholder: "أعد إدخال كلمة المرور الجديدة",
									dir: "ltr",
									className: "h-11 ps-10",
									disabled: savingPassword
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-start pt-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handlePassword,
								disabled: savingPassword || !currentPassword || !newPassword || !confirmPassword,
								className: "min-w-[180px]",
								children: savingPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "me-2 h-4 w-4 animate-spin" }), "جاري التحديث..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "me-2 h-4 w-4" }), "تحديث كلمة المرور"] })
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/60 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "border-b border-border/50 pb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-3 text-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-5 w-5" })
						}), "معلومات الحساب"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-5 sm:p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "divide-y divide-border rounded-xl border border-border/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: "اسم المستخدم"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "معرف تسجيل الدخول الخاص بك"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-fit rounded-md bg-muted px-3 py-1.5 text-sm font-medium",
								dir: "ltr",
								children: username ?? "—"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: "الصلاحية"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "مستوى الوصول إلى لوحة الإدارة"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3.5 w-3.5" }), "مسؤول"]
							})]
						})]
					})
				})]
			})
		]
	});
}
var queryClient = new QueryClient();
var LegacyRouter = ({ children, initialPath }) => {
	if (typeof window === "undefined") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemoryRouter, {
		initialEntries: [initialPath],
		children
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrowserRouter, { children });
};
var App = ({ initialPath = "/" }) => {
	(0, import_react.useEffect)(() => {
		autoReregister();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SplashScreen, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$2, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LegacyRouter, {
				initialPath,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#main-content",
						className: "skip-link",
						children: "Skip to content / تخطّى إلى المحتوى"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandPalette, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackToTop, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Routes, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Index, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/article/:id",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticlePage, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/topic/:key",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopicPage, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/search",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchPage, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/bookmarks",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarksPage, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/contact",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactPage, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/author/:slug",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthorPage, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/about",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AboutPage, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/imprint",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImprintPage, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/editorial-policy",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorialPolicyPage, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/corrections",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CorrectionsPage, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/corrections-log",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CorrectionsLogPage, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/privacy",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrivacyPage, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/cookies",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CookiesPage, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/terms",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TermsPage, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/copyright",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyrightPage, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/disclaimer",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DisclaimerPage, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/advertise",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdvertisePage, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/admin/login",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLogin, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Route, {
							path: "/admin",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDashboard, {}),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
									path: "articles",
									element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminArticles, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
									path: "articles/:id",
									element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminArticleEditor, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
									path: "dialogues",
									element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDialogues, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
									path: "dialogues/new",
									element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDialogueEditor, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
									path: "dialogues/:id",
									element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDialogueEditor, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
									path: "feedback",
									element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminFeedback, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
									path: "breaking",
									element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminBreakingNews, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
									path: "comments",
									element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminComments, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
									path: "newsletter",
									element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminNewsletter, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
									path: "push",
									element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPushNotifications, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
									path: "corrections",
									element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCorrections, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
									path: "/admin/settings",
									element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSettings, {})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
									path: "ads",
									element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminAds, {})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/:code",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticlePage, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "*",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotFound, {})
						})
					] })
				]
			})
		] })
	});
};
export { App };
