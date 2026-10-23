import { __commonJSMin, __require, __toESM } from "../../_runtime.mjs";
import { require_react } from "../@floating-ui/react-dom+[...].mjs";
import { require_jsx_runtime } from "../@radix-ui/react-collection+[...].mjs";
import { normalizeProtocolRelative, parseHref } from "../tanstack__history.mjs";
import { PassThrough, Readable } from "node:stream";
// node_modules/@tanstack/router-core/dist/esm/not-found.js
/** Determine if a value is a TanStack Router not-found error. */
function isNotFound(obj) {
	return obj?.isNotFound === true;
}
// node_modules/@tanstack/router-core/dist/esm/root.js
/** Stable identifier used for the root route in a route tree. */
var rootRouteId = "__root__";
// node_modules/@tanstack/router-core/dist/esm/redirect.js
/**
* Create a redirect Response understood by TanStack Router.
*
* Use from route `loader`/`beforeLoad` or server functions to trigger a
* navigation. If `throw: true` is set, the redirect is thrown instead of
* returned. External `href` values are classified as full-document
* navigations when the router resolves the redirect.
*
* @param opts Options for the redirect. Common fields:
* - `href`: absolute URL for external redirects.
* - `statusCode`: HTTP status code to use (defaults to 307).
* - `headers`: additional headers to include on the Response.
* - Standard navigation options like `to`, `params`, `search`, `replace`,
*   and `reloadDocument` for internal redirects.
* @returns A Response augmented with router navigation options.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/redirectFunction
*/
function redirect(opts) {
	opts.statusCode = opts.statusCode || opts.code || 307;
	const headers = new Headers(opts.headers);
	if (opts.href && headers.get("Location") === null) headers.set("Location", opts.href);
	const response = new Response(null, {
		status: opts.statusCode,
		headers
	});
	response.options = opts;
	if (opts.throw) throw response;
	return response;
}
/** Check whether a value is a TanStack Router redirect Response. */
function isRedirect(obj) {
	return obj instanceof Response && !!obj.options;
}
/** Parse a serialized redirect object back into a redirect Response. */
function parseRedirect(obj) {
	if (obj !== null && typeof obj === "object" && obj.isSerializedRedirect) return redirect(obj);
}
// node_modules/@tanstack/router-core/dist/esm/ssr/ssr-match-id.js
function dehydrateSsrMatchId(id) {
	return id.replaceAll("/", "#");
}
// node_modules/@tanstack/router-core/dist/esm/utils.js
/**
* Return the last element of an array.
* Intended for non-empty arrays used within router internals.
*/
function last(arr) {
	return arr[arr.length - 1];
}
/**
* Apply a value-or-updater to a previous value.
* Accepts either a literal value or a function of the previous value.
*/
function functionalUpdate(updater, previous) {
	if (typeof updater === "function") return updater(previous);
	return updater;
}
var hasOwn = Object.prototype.hasOwnProperty;
function hasKeys(obj) {
	for (const key in obj) if (hasOwn.call(obj, key)) return true;
	return false;
}
var createNull = () => Object.create(null);
var nullReplaceEqualDeep = (prev, next) => replaceEqualDeep(prev, next, true);
function replaceEqualDeep(prev, next, _nullProto, _depth = 0) {
	return next;
}
function isPlainObject(o) {
	if (!o || typeof o !== "object") return false;
	return (Object.getPrototypeOf(o)?.constructor ?? Object) === Object;
}
/**
* Perform a deep equality check optimized for router state comparisons.
*
* - `partial`: `b` may omit keys that `a` has (arrays stay length-exact).
* - `explicitUndefined`: keys holding `undefined` take part in the comparison
*   instead of being ignored.
*
* Internal: the flags are positional so hot callers pass no options object.
*/
function deepEqual(a, b, partial, explicitUndefined) {
	if (a === b) return true;
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		for (let i = 0, l = a.length; i < l; i++) {
			const av = a[i];
			const bv = b[i];
			if (av !== bv && !deepEqual(av, bv, partial, explicitUndefined)) return false;
		}
		return true;
	}
	if (isPlainObject(a) && isPlainObject(b)) {
		if (partial) {
			for (const k in b) if (explicitUndefined || b[k] !== void 0) {
				if (!deepEqual(a[k], b[k], partial, explicitUndefined)) return false;
			}
			return true;
		}
		let aCount = 0;
		if (explicitUndefined) aCount = Object.keys(a).length;
		else for (const k in a) if (a[k] !== void 0) aCount++;
		for (const k in b) if (explicitUndefined || b[k] !== void 0) {
			if (aCount-- === 0 || !deepEqual(a[k], b[k], partial, explicitUndefined)) return false;
		}
		return aCount === 0;
	}
	return false;
}
/**
* Heuristically detect dynamic import "module not found" errors
* across major browsers for lazy route component handling.
*/
function isModuleNotFoundError(error) {
	if (typeof error?.message !== "string") return false;
	return error.message.startsWith("Failed to fetch dynamically imported module") || error.message.startsWith("error loading dynamically imported module") || error.message.startsWith("Importing a module script failed");
}
function isPromise(value) {
	return Boolean(value && typeof value === "object" && typeof value.then === "function");
}
/**
* Re-encode characters that are unsafe in URL paths.
* Includes ASCII control characters (0x00-0x1F, 0x7F) and a subset of the
* WHATWG URL "path percent-encode set" (", <, >, `, {, }).
*
* Space (0x20) is intentionally excluded — decodeURI decodes %20 to space
* and the router stores decoded spaces in location.pathname. The existing
* encodePathLikeUrl already handles re-encoding spaces for outgoing URLs.
*
* These characters are decoded by decodeURI but must remain percent-encoded
* in paths to match how upstream layers (CDNs, edge middleware, browsers)
* interpret the URL, preventing infinite redirect loops and path mismatches.
*/
var PATH_UNSAFE_RE = /[\x00-\x1f\x7f"<>`{}]/g;
function sanitizePathSegment(segment) {
	return segment.replace(PATH_UNSAFE_RE, (ch) => "%" + ch.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0"));
}
function decodeSegment(segment) {
	let decoded;
	try {
		decoded = decodeURI(segment);
	} catch {
		decoded = segment.replaceAll(/%[0-9A-F]{2}/gi, (match) => {
			try {
				return decodeURI(match);
			} catch {
				return match;
			}
		});
	}
	return sanitizePathSegment(decoded);
}
/**
* Default list of URL protocols to allow in links, redirects, and navigation.
* Any absolute URL protocol not in this list is treated as dangerous by default.
*/
var DEFAULT_PROTOCOL_ALLOWLIST = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
/**
* Extract the explicit URL scheme, including its colon, using WHATWG
* normalization rules. This does not validate the rest of the URL.
*
* Returning `undefined` means "no explicit scheme", not "safe URL";
* protocol-relative URLs such as "//evil.example" require a separate check.
*/
function getUrlScheme(url) {
	if (url[0] === "/") return;
	if (!url.includes(":")) return;
	return /^[\x00-\x20]*([a-z][a-z\d+.\t\n\r-]*:)/i.exec(url)?.[1]?.replace(/[\t\n\r]/g, "").toLowerCase();
}
var protocolRelativePrefixRegex = /^[\x00-\x20]*[\\/][\t\n\r]*[\\/]/;
/**
* Check if a URL string uses a protocol that is not in the allowlist or is
* protocol-relative (e.g. "//evil.example"), which can navigate to another host.
* Returns true for blocked protocols like javascript:, blob:, and data:, as
* well as slash/backslash variants of protocol-relative URLs.
*
* Scheme parsing normalizes:
* - Mixed case (JavaScript: → javascript:)
* - Whitespace/control characters (java\nscript: → javascript:)
* - Leading whitespace
*
* For relative URLs without a protocol-relative prefix, returns false.
*
* @param url - The URL string to check
* @param allowlist - Set of protocols to allow
* @returns true if the URL uses a protocol that is not allowed or can escape
* the current origin through a protocol-relative URL
*/
function isDangerousProtocol(url, allowlist) {
	if (!url) return false;
	if (protocolRelativePrefixRegex.test(url)) return true;
	const scheme = getUrlScheme(url);
	return scheme ? !allowlist.has(scheme) : false;
}
var HTML_ESCAPE_LOOKUP = {
	"&": "\\u0026",
	">": "\\u003e",
	"<": "\\u003c",
	"\u2028": "\\u2028",
	"\u2029": "\\u2029"
};
var HTML_ESCAPE_REGEX = /[&><\u2028\u2029]/g;
/**
* Escape HTML special characters in a string to prevent XSS attacks
* when embedding strings in script tags during SSR.
*
* This is essential for preventing XSS vulnerabilities when user-controlled
* content is embedded in inline scripts.
*/
function escapeHtml(str) {
	return str.replace(HTML_ESCAPE_REGEX, (match) => HTML_ESCAPE_LOOKUP[match]);
}
function decodePath(path) {
	if (!path) return path;
	let result = path;
	if (/[%\\\x00-\x1f\x7f]/.test(path)) {
		const re = /%25|%5C/gi;
		let cursor = 0;
		let match;
		result = "";
		while (null !== (match = re.exec(path))) {
			result += decodeSegment(path.slice(cursor, match.index)) + match[0];
			cursor = re.lastIndex;
		}
		result += decodeSegment(cursor ? path.slice(cursor) : path);
	}
	return result;
}
/**
* Encodes a path the same way `new URL()` would, but without the overhead of full URL parsing.
*
* This function encodes:
* - Whitespace characters (spaces → %20, tabs → %09, etc.)
* - Non-ASCII/Unicode characters (emojis, accented characters, etc.)
*
* It preserves:
* - Already percent-encoded sequences (won't double-encode %2F, %25, etc.)
* - ASCII special characters valid in URL paths (@, $, &, +, etc.)
* - Forward slashes as path separators
*
* Used to generate proper href values for SSR without constructing URL objects.
*
* @example
* encodePathLikeUrl('/path/file name.pdf') // '/path/file%20name.pdf'
* encodePathLikeUrl('/path/日本語') // '/path/%E6%97%A5%E6%9C%AC%E8%AA%9E'
* encodePathLikeUrl('/path/already%20encoded') // '/path/already%20encoded' (preserved)
*/
function encodePathLikeUrl(path) {
	if (!/[\s\u0080-\uFFFF]/.test(path)) return path;
	return path.replace(/\s|[^\u0000-\u007F]/gu, encodeURIComponent);
}
function arraysEqual(a, b) {
	if (a === b) return true;
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
	return true;
}
// node_modules/@tanstack/router-core/dist/esm/path.js
/** Remove repeated slashes from a path string. */
function cleanPath(path) {
	return path.replace(/\/{2,}/g, "/");
}
/** Trim leading slashes (except preserving root '/'). */
function trimPathLeft(path) {
	return path === "/" ? path : path.replace(/^\/+/, "");
}
/** Trim trailing slashes (except preserving root '/'). */
function trimPathRight(path) {
	const len = path.length;
	return len > 1 && path[len - 1] === "/" ? path.replace(/\/+$/, "") : path;
}
/** Trim both leading and trailing slashes. */
function trimPath(path) {
	return trimPathRight(trimPathLeft(path));
}
/** Remove a trailing slash from value when appropriate for comparisons. */
function removeTrailingSlash(value, basepath) {
	if (value?.endsWith("/") && value !== "/" && value !== `${basepath}/`) return value.slice(0, -1);
	return value;
}
/**
* Resolve a destination path against a base, honoring trailing-slash policy
* and supporting relative segments (`.`/`..`) and absolute `to` values.
*
* Internal: parameters are positional so the router's hot callers pass no
* options object.
*/
function resolvePath(base, to, trailingSlash = "never", cache) {
	if (to.includes("//")) to = cleanPath(to);
	if (to.startsWith("/")) {
		if (to.length === 1 || trailingSlash === "preserve") return to;
		if (trailingSlash === "always") return to.endsWith("/") ? to : `${to}/`;
		return to.endsWith("/") ? to.slice(0, -1) : to;
	}
	const isBase = to === ".";
	let key;
	if (cache) {
		key = isBase ? base : base + "\0" + to;
		const cached = cache.get(key);
		if (cached) return cached;
	}
	let baseSegments;
	if (isBase) baseSegments = base.split("/");
	else {
		if (base.includes("//")) base = cleanPath(base);
		baseSegments = base.split("/");
		while (baseSegments.length > 1 && last(baseSegments) === "") baseSegments.pop();
		const toSegments = to.split("/");
		for (let index = 0, length = toSegments.length; index < length; index++) {
			const value = toSegments[index];
			if (value === "") {
				if (!index) baseSegments = [value];
				else if (index === length - 1) baseSegments.push(value);
			} else if (value === "..") {
				if (baseSegments.length > 1) baseSegments.pop();
				else baseSegments = [""];
			} else if (value === ".") {} else baseSegments.push(value);
		}
	}
	if (baseSegments.length > 1) {
		if (last(baseSegments) === "") {
			if (trailingSlash === "never") baseSegments.pop();
		} else if (trailingSlash === "always") baseSegments.push("");
	}
	const joined = baseSegments.join("/");
	const result = (isBase ? cleanPath(joined) : joined) || "/";
	if (key && cache) cache.set(key, result);
	return result;
}
/**
* Create a pre-compiled decode config from allowed characters.
* Created once for the router's fixed encoding configuration.
*/
function compileDecodeCharMap(pathParamsAllowedCharacters) {
	const charMap = new Map(pathParamsAllowedCharacters.map((char) => [encodeURIComponent(char), char]));
	const regex = new RegExp([...charMap.keys()].join("|").replace(/[.*()]/g, "\\$&"), "g");
	return (encoded) => encoded.replace(regex, (match) => charMap.get(match) ?? match);
}
/** A splat is missing when it has no value; `0` and `false` are stringified like any other param. */
function isMissingSplat(value) {
	return value == null || value === "";
}
function encodeParam(key, value, decoder) {
	if (typeof value !== "string") return "" + (value ?? void 0);
	const splat = key === "_splat";
	if (splat && (!value || /^[a-zA-Z0-9\-._~!/]*$/.test(value))) return value;
	let encoded = encodeURIComponent(value);
	if (splat) encoded = encoded.replaceAll("%2F", "/");
	return decoder ? decoder(encoded) : encoded;
}
/** Substitute current values into parsed segments, optionally collecting raw params. */
function interpolatePath(path, segments, params, decoder, usedParams) {
	const trailingSlash = path.endsWith("/") ? "/" : "";
	let joined = "";
	for (const part of segments) {
		if (typeof part === "string") {
			joined += part;
			continue;
		}
		const [kind, key, prefix, rawSuffix] = part;
		const splat = kind === 2;
		const suffix = splat && rawSuffix !== void 0 ? rawSuffix + trailingSlash : rawSuffix;
		let paramValue = params[key];
		if (kind === 3 && paramValue == null) continue;
		if (usedParams) {
			usedParams[key] = paramValue;
			if (splat) usedParams["*"] = paramValue;
		}
		if (splat && isMissingSplat(paramValue)) {
			if (prefix === "/" && !suffix) continue;
			paramValue = "";
		}
		joined += prefix + encodeParam(key, paramValue, decoder) + (suffix || "");
	}
	return joined + trailingSlash || "/";
}
// node_modules/@tanstack/router-core/dist/esm/sieve-cache.js
/**
* A fixed-capacity cache using the SIEVE eviction algorithm
* (https://cachemon.github.io/SIEVE-website/).
*
* Entries live in the Map's FIFO insertion order; a hit only flips a `visited`
* bit instead of relinking the entry, which makes `get` (by far the hottest
* operation here) one `Map.get` plus a boolean store. Eviction sweeps a `hand`
* from the oldest entry towards the newest, clearing `visited` bits until it
* finds an unvisited entry to drop, so entries touched since the last sweep
* survive one more round. This keeps LRU-like hit ratios while being
* scan-resistant.
*/
function createSieveCache(max) {
	const cache = /* @__PURE__ */ new Map();
	let hand;
	let newest;
	return {
		get(key) {
			const entry = cache.get(key);
			if (!entry) return;
			entry.visited = true;
			return entry.value;
		},
		set(key, value) {
			const existing = cache.get(key);
			if (existing) {
				existing.value = value;
				return;
			}
			if (cache.size >= max) {
				let node = hand?.next().value;
				while (!node || node.visited) {
					if (node) node.visited = false;
					else hand = cache.values();
					node = hand.next().value;
				}
				if (node === newest) hand = void 0;
				cache.delete(node.key);
			}
			const entry = {
				key,
				value,
				visited: false
			};
			newest = entry;
			cache.set(key, entry);
		},
		clear() {
			cache.clear();
			hand = void 0;
			newest = void 0;
		}
	};
}
// node_modules/@tanstack/router-core/dist/esm/invariant.js
function invariant() {
	throw new Error("Invariant failed");
}
// node_modules/@tanstack/router-core/dist/esm/new-process-route-tree.js
var SEGMENT_TYPE_INDEX = 4;
var SEGMENT_TYPE_PATHLESS = 5;
function getParamNames(data) {
	const cached = data.names;
	if (cached) return cached;
	const keys = [];
	for (const segment of data) if (typeof segment !== "string") keys.push(segment[1]);
	return data.names = keys;
}
/** Parse one segment for matching and retain the same record for interpolation. */
function parseSegment(path, start, end) {
	const part = path.slice(start, end);
	if (part.charCodeAt(0) === 36) return part.length === 1 ? [
		2,
		"_splat",
		"",
		void 0
	] : [
		1,
		part.slice(1),
		"",
		""
	];
	const open = part.indexOf("{");
	if (open >= 0) {
		const close = part.indexOf("}", open);
		const optional = part.charCodeAt(open + 1) === 45;
		const nameStart = open + (optional ? 3 : 2);
		if (close >= 0 && part.charCodeAt(nameStart - 1) === 36 && (!optional || nameStart < close)) {
			const key = part.slice(nameStart, close);
			return [
				optional ? 3 : key ? 1 : 2,
				key || "_splat",
				part.slice(0, open),
				path.slice(start + close + 1, key ? end : path.length)
			];
		}
	}
	return part;
}
function parseSegments(defaultCaseSensitive, route, start, node, dynamicListsToSort, parentInterpolation) {
	let cursor = start;
	const path = route.fullPath ?? route.from;
	const options = route.options;
	const length = path.length;
	const literalEnd = path.endsWith("/") ? length - 1 : length;
	const caseSensitive = options?.caseSensitive ?? defaultCaseSensitive;
	const parseParams = options?.params?.parse ?? options?.parseParams;
	let interpolation;
	let literalStart = parentInterpolation ? start - 1 : 0;
	if (!node || path.includes("$")) {
		interpolation = parentInterpolation?.slice() ?? [];
		const tail = last(interpolation);
		if (tail && typeof tail !== "string" && tail[0] === 2) {
			interpolation[interpolation.length - 1] = [
				tail[0],
				tail[1],
				tail[2],
				tail[3] === void 0 ? void 0 : tail[3] + path.substring(start - (path[start - 2] === "/" ? 2 : 1), literalEnd)
			];
			literalStart = length;
		}
	}
	while (cursor < length) {
		const start = cursor;
		const next = path.indexOf("/", start);
		let end = next === -1 ? length : next;
		const segment = parseSegment(path, start, end);
		cursor = end + 1;
		let nextNode;
		if (typeof segment === "string") {
			if (!node) continue;
			let name = segment;
			let staticChildren;
			if (caseSensitive) staticChildren = node.static ??= /* @__PURE__ */ new Map();
			else {
				name = segment.toLowerCase();
				staticChildren = node.staticInsensitive ??= /* @__PURE__ */ new Map();
			}
			const existingNode = staticChildren.get(name);
			if (existingNode) nextNode = existingNode;
			else {
				const next = createSegmentNode(node);
				nextNode = next;
				staticChildren.set(name, next);
			}
		} else {
			const kind = segment[0];
			let prefix = segment[2];
			let suffix = segment[3] ?? "";
			if (kind === 2) {
				end = length;
				cursor = end + 1;
			}
			if (interpolation && literalStart < end) {
				if (literalStart < start - 1) interpolation.push(path.slice(literalStart, start - 1));
				segment[2] = "/" + prefix;
				if (kind === 2 && segment[3] !== void 0 && literalEnd < length) segment[3] = suffix.slice(0, -1);
				interpolation.push(segment);
				literalStart = end;
			}
			if (!node) continue;
			const actuallyCaseSensitive = caseSensitive && !!(prefix || suffix);
			if (!caseSensitive) {
				prefix = prefix.toLowerCase();
				suffix = suffix.toLowerCase();
			}
			const siblings = kind === 1 ? node.dynamic ??= [] : kind === 3 ? node.optional ??= [] : node.wildcard ??= [];
			const existingNode = kind !== 2 && !parseParams && siblings.find((s) => !s.parse && s.caseSensitive === actuallyCaseSensitive && s.prefix === prefix && s.suffix === suffix);
			if (existingNode) nextNode = existingNode;
			else {
				const next = createSegmentNode(node, kind, actuallyCaseSensitive, prefix, suffix);
				nextNode = next;
				siblings.push(next);
				if (siblings.length === 2) dynamicListsToSort?.push(siblings);
			}
		}
		node = nextNode;
	}
	if (interpolation && literalStart < literalEnd) interpolation.push(path.slice(literalStart, literalEnd));
	const segmentData = interpolation?.slice();
	if (!node) return segmentData;
	if (parseParams && route.children && !route.isRoot && route.id && route.id.charCodeAt(route.id.lastIndexOf("/") + 1) === 95) {
		const pathlessNode = createSegmentNode(node, SEGMENT_TYPE_PATHLESS);
		(node.pathless ??= []).push(pathlessNode);
		node = pathlessNode;
	}
	const isLeaf = (route.path || !route.children) && !route.isRoot;
	if (isLeaf && literalEnd < length) {
		const indexNode = createSegmentNode(node, SEGMENT_TYPE_INDEX);
		node.index = indexNode;
		node = indexNode;
	}
	node.parse = parseParams ?? null;
	node.priority = options?.params?.priority ?? 0;
	if (!node.route) {
		node.data = segmentData;
		if (isLeaf) node.route = route;
	}
	return [
		node,
		cursor,
		segmentData
	];
}
function sortDynamic(a, b) {
	if (a.parse && !b.parse) return -1;
	if (!a.parse && b.parse) return 1;
	if (a.parse && b.parse && (a.priority || b.priority)) return b.priority - a.priority;
	if (a.prefix && b.prefix && a.prefix !== b.prefix) {
		if (a.prefix.startsWith(b.prefix)) return -1;
		if (b.prefix.startsWith(a.prefix)) return 1;
	}
	if (a.suffix && b.suffix && a.suffix !== b.suffix) {
		if (a.suffix.endsWith(b.suffix)) return -1;
		if (b.suffix.endsWith(a.suffix)) return 1;
	}
	if (a.prefix && !b.prefix) return -1;
	if (!a.prefix && b.prefix) return 1;
	if (a.suffix && !b.suffix) return -1;
	if (!a.suffix && b.suffix) return 1;
	if (a.caseSensitive && !b.caseSensitive) return -1;
	if (!a.caseSensitive && b.caseSensitive) return 1;
	return 0;
}
function createSegmentNode(parent, kind = 0, caseSensitive, prefix, suffix) {
	return {
		kind,
		depth: parent ? parent.depth + 1 : 0,
		pathless: null,
		index: null,
		static: null,
		staticInsensitive: null,
		dynamic: null,
		optional: null,
		wildcard: null,
		route: null,
		data: void 0,
		parent,
		parse: null,
		priority: 0,
		caseSensitive,
		prefix,
		suffix
	};
}
function processRouteMasks(routeList, processedTree) {
	const segmentTree = createSegmentNode();
	const dynamicListsToSort = [];
	function visit(route, start, parentNode, parentInterpolation) {
		const [node, cursor, segments] = parseSegments(false, route, start, parentNode, dynamicListsToSort, parentInterpolation);
		if (route.children) for (const child of route.children) visit(child, cursor, node, segments);
	}
	for (const route of routeList) visit(route, 1, segmentTree);
	for (const nodes of dynamicListsToSort) nodes.sort(sortDynamic);
	processedTree.masksTree = segmentTree;
	processedTree.flatCache = createSieveCache(1e3);
}
/**
* Take an arbitrary list of routes, create a tree from them (if it hasn't been created already), and match a path against it.
*/
function findFlatMatch(path, processedTree) {
	path ||= "/";
	const cached = processedTree.flatCache.get(path);
	if (cached !== void 0) return cached;
	const result = findMatch(path, processedTree.masksTree);
	processedTree.flatCache.set(path, result);
	return result;
}
/**
* @deprecated keep until v2 so that `router.matchRoute` can keep not caring about the actual route tree
*/
function findSingleMatch(from, caseSensitive, fuzzy, path, processedTree) {
	from ||= "/";
	path ||= "/";
	const key = caseSensitive ? `case\0${from}` : from;
	let tree = processedTree.singleCache.get(key);
	if (!tree) {
		tree = createSegmentNode();
		parseSegments(caseSensitive, { from }, 1, tree);
		processedTree.singleCache.set(key, tree);
	}
	return findMatch(path, tree, fuzzy);
}
function findRouteMatch(path, processedTree, fuzzy = false) {
	const key = fuzzy ? path : `nofuzz\0${path}`;
	const cached = processedTree.matchCache.get(key);
	if (cached !== void 0) return cached;
	path ||= "/";
	let result;
	try {
		result = findMatch(path, processedTree.segmentTree, fuzzy);
	} catch (err) {
		if (err instanceof URIError) result = null;
		else throw err;
	}
	if (result) result.branch = buildRouteBranch(result.route);
	processedTree.matchCache.set(key, result);
	return result;
}
/**
* Processes a route tree into a segment trie for efficient path matching.
* Also builds lookup maps for routes by ID and by trimmed full path.
*/
function processRouteTree(routeTree, caseSensitive = false) {
	const segmentTree = createSegmentNode();
	const dynamicListsToSort = [];
	const routesById = {};
	const routesByPath = {};
	let index = 0;
	function visit(route, start, parentNode, parentInterpolation) {
		route.init(index);
		if (route.id in routesById) invariant();
		routesById[route.id] = route;
		if (index !== 0 && route.path) {
			const trimmedFullPath = trimPathRight(route.fullPath);
			if (!routesByPath[trimmedFullPath] || route.fullPath.endsWith("/")) routesByPath[trimmedFullPath] = route;
		}
		index++;
		const [node, cursor, segments] = parseSegments(caseSensitive, route, start, parentNode, dynamicListsToSort, parentInterpolation);
		route._interpolation = segments;
		if (route.children) for (const child of route.children) visit(child, cursor, node, segments);
	}
	visit(routeTree, 1, segmentTree);
	for (const nodes of dynamicListsToSort) nodes.sort(sortDynamic);
	return {
		processedTree: {
			segmentTree,
			singleCache: createSieveCache(1e3),
			matchCache: createSieveCache(1e3),
			flatCache: null,
			masksTree: null
		},
		routesById,
		routesByPath
	};
}
function findMatch(path, segmentTree, fuzzy = false) {
	const parts = path.split("/");
	const leaf = getNodeMatch(path, parts, segmentTree, fuzzy);
	if (!leaf) return null;
	const [rawParams] = extractParams(path, parts, leaf);
	return {
		route: leaf.node.route,
		rawParams
	};
}
/**
* This function is "resumable":
* - the `leaf` input can contain `extract` and `rawParams` properties from a previous `extractParams` call
* - the returned `state` can be passed back as `extract` in a future call to continue extracting params from where we left off
*
* Inputs are *not* mutated.
*/
function extractParams(path, parts, leaf) {
	const list = buildBranch(leaf.node);
	const names = leaf.node.data && getParamNames(leaf.node.data);
	const rawParams = Object.create(null);
	/** which segment of the path we're currently processing */
	let partIndex = leaf.extract?.part ?? 0;
	/** which node of the route tree branch we're currently processing */
	let nodeIndex = leaf.extract?.node ?? 0;
	/** index of the 1st character of the segment we're processing in the path string */
	let pathIndex = leaf.extract?.path ?? 0;
	/** Next original parameter name, independent of pathless/static nodes. */
	let paramIndex = leaf.extract?.param ?? 0;
	for (; nodeIndex < list.length; partIndex++, nodeIndex++, pathIndex++) {
		const node = list[nodeIndex];
		if (node.kind === SEGMENT_TYPE_INDEX) break;
		if (node.kind === SEGMENT_TYPE_PATHLESS) {
			partIndex--;
			pathIndex--;
			continue;
		}
		const part = parts[partIndex];
		const currentPathIndex = pathIndex;
		if (part) pathIndex += part.length;
		if (node.kind === 1 || node.kind === 3) {
			const name = names[paramIndex++];
			if (node.kind === 3 && leaf.skipped & 1 << nodeIndex) {
				partIndex--;
				pathIndex = currentPathIndex - 1;
				continue;
			}
			const value = node.suffix || node.prefix ? part.substring(node.prefix.length, part.length - node.suffix.length) : part;
			if (value || node.kind === 1) rawParams[name] = decodeURIComponent(value);
		} else if (node.kind === 2) {
			const n = node;
			const value = path.substring(currentPathIndex + n.prefix.length, path.length - n.suffix.length);
			const splat = decodeURIComponent(value);
			rawParams["*"] = splat;
			rawParams._splat = splat;
			break;
		}
	}
	if (leaf.rawParams) Object.assign(rawParams, leaf.rawParams);
	return [rawParams, {
		part: partIndex,
		node: nodeIndex,
		path: pathIndex,
		param: paramIndex
	}];
}
function buildRouteBranch(route) {
	const list = [route];
	while (route.parentRoute) {
		route = route.parentRoute;
		list.push(route);
	}
	list.reverse();
	return list;
}
function buildBranch(node) {
	const list = Array(node.depth + 1);
	do {
		list[node.depth] = node;
		node = node.parent;
	} while (node);
	return list;
}
function getNodeMatch(path, parts, segmentTree, fuzzy) {
	if (path === "/" && segmentTree.index) return {
		node: segmentTree.index,
		skipped: 0
	};
	const trailingSlash = !last(parts);
	const pathIsIndex = trailingSlash && path !== "/";
	const partsLength = parts.length - (trailingSlash ? 1 : 0);
	const stack = [{
		node: segmentTree,
		index: 1,
		skipped: 0,
		statics: 0,
		dynamics: 0,
		optionals: 0
	}];
	let bestFuzzy = null;
	let bestMatch = null;
	while (stack.length) {
		const frame = stack.pop();
		const { node, index, skipped, statics, dynamics, optionals } = frame;
		let { extract, rawParams } = frame;
		if (node.kind === 2 && node.route && !isFrameMoreSpecific(bestMatch, frame)) continue;
		if (node.parse) {
			if (!validateParseParams(path, parts, frame)) continue;
			rawParams = frame.rawParams;
			extract = frame.extract;
		}
		if (fuzzy && node.route && node.kind !== SEGMENT_TYPE_INDEX && isFrameMoreSpecific(bestFuzzy, frame)) bestFuzzy = frame;
		const isBeyondPath = index === partsLength;
		if (isBeyondPath) {
			if (node.route && (!pathIsIndex || node.kind === SEGMENT_TYPE_INDEX || node.kind === 2) && isFrameMoreSpecific(bestMatch, frame)) bestMatch = frame;
			if (!node.optional && !node.wildcard && !node.index && !node.pathless) continue;
		}
		const part = isBeyondPath ? void 0 : parts[index];
		let lowerPart;
		if (isBeyondPath && node.index) {
			const indexFrame = {
				node: node.index,
				index,
				skipped,
				statics,
				dynamics,
				optionals,
				extract,
				rawParams
			};
			let indexValid = true;
			if (node.index.parse) {
				if (!validateParseParams(path, parts, indexFrame)) indexValid = false;
			}
			if (indexValid) {
				if (!dynamics && !optionals && !skipped && isPerfectStaticMatch(statics, partsLength)) return indexFrame;
				if (isFrameMoreSpecific(bestMatch, indexFrame)) bestMatch = indexFrame;
			}
		}
		if (node.wildcard) for (let i = node.wildcard.length - 1; i >= 0; i--) {
			const segment = node.wildcard[i];
			const { prefix, suffix } = segment;
			if (prefix) {
				if (isBeyondPath) continue;
				if (!(segment.caseSensitive ? part : lowerPart ??= part.toLowerCase()).startsWith(prefix)) continue;
			}
			if (suffix) {
				if (isBeyondPath) continue;
				const end = parts.slice(index).join("/");
				const suffixPart = end.slice(-suffix.length);
				if ((segment.caseSensitive ? suffixPart : suffixPart.toLowerCase()) !== suffix || end.length - suffix.length < prefix.length) continue;
			}
			stack.push({
				node: segment,
				index: partsLength,
				skipped,
				statics,
				dynamics,
				optionals,
				extract,
				rawParams
			});
		}
		if (node.optional) {
			const nextSkipped = skipped | 1 << node.depth + 1;
			for (let i = node.optional.length - 1; i >= 0; i--) {
				const segment = node.optional[i];
				stack.push({
					node: segment,
					index,
					skipped: nextSkipped,
					statics,
					dynamics,
					optionals,
					extract,
					rawParams
				});
			}
			if (!isBeyondPath) for (let i = node.optional.length - 1; i >= 0; i--) {
				const segment = node.optional[i];
				const { prefix, suffix } = segment;
				if (prefix || suffix) {
					const casePart = segment.caseSensitive ? part : lowerPart ??= part.toLowerCase();
					if (prefix && !casePart.startsWith(prefix)) continue;
					if (suffix && casePart.indexOf(suffix, casePart.length - suffix.length) < prefix.length) continue;
				}
				stack.push({
					node: segment,
					index: index + 1,
					skipped,
					statics,
					dynamics,
					optionals: optionals + segmentScore(partsLength, index),
					extract,
					rawParams
				});
			}
		}
		if (!isBeyondPath && node.dynamic && part) for (let i = node.dynamic.length - 1; i >= 0; i--) {
			const segment = node.dynamic[i];
			const { prefix, suffix } = segment;
			if (prefix || suffix) {
				const casePart = segment.caseSensitive ? part : lowerPart ??= part.toLowerCase();
				if (prefix && !casePart.startsWith(prefix)) continue;
				if (suffix && casePart.indexOf(suffix, casePart.length - suffix.length) < prefix.length) continue;
			}
			stack.push({
				node: segment,
				index: index + 1,
				skipped,
				statics,
				dynamics: dynamics + segmentScore(partsLength, index),
				optionals,
				extract,
				rawParams
			});
		}
		if (!isBeyondPath && node.staticInsensitive) {
			const match = node.staticInsensitive.get(lowerPart ??= part.toLowerCase());
			if (match) stack.push({
				node: match,
				index: index + 1,
				skipped,
				statics: statics + segmentScore(partsLength, index),
				dynamics,
				optionals,
				extract,
				rawParams
			});
		}
		if (!isBeyondPath && node.static) {
			const match = node.static.get(part);
			if (match) stack.push({
				node: match,
				index: index + 1,
				skipped,
				statics: statics + segmentScore(partsLength, index),
				dynamics,
				optionals,
				extract,
				rawParams
			});
		}
		if (node.pathless) for (let i = node.pathless.length - 1; i >= 0; i--) {
			const segment = node.pathless[i];
			stack.push({
				node: segment,
				index,
				skipped,
				statics,
				dynamics,
				optionals,
				extract,
				rawParams
			});
		}
	}
	if (bestMatch) return bestMatch;
	if (fuzzy && bestFuzzy) {
		let sliceIndex = bestFuzzy.index;
		for (let i = 0; i < bestFuzzy.index; i++) sliceIndex += parts[i].length;
		const splat = sliceIndex === path.length ? "/" : path.slice(sliceIndex);
		bestFuzzy.rawParams ??= Object.create(null);
		bestFuzzy.rawParams["**"] = decodeURIComponent(splat);
		return bestFuzzy;
	}
	return null;
}
function segmentScore(partsLength, index) {
	return 2 ** (partsLength - index - 1);
}
function isPerfectStaticMatch(statics, partsLength) {
	return statics === 2 ** (partsLength - 1) - 1;
}
function validateParseParams(path, parts, frame) {
	let rawParams;
	let state;
	try {
		[rawParams, state] = extractParams(path, parts, frame);
	} catch {
		return null;
	}
	frame.rawParams = rawParams;
	frame.extract = state;
	if (!frame.node.parse) return true;
	try {
		if (frame.node.parse(rawParams) === false) return null;
	} catch {}
	return true;
}
function isFrameMoreSpecific(prev, next) {
	if (!prev) return true;
	return next.statics > prev.statics || next.statics === prev.statics && (next.dynamics > prev.dynamics || next.dynamics === prev.dynamics && (next.optionals > prev.optionals || next.optionals === prev.optionals && ((next.node.kind === SEGMENT_TYPE_INDEX) > (prev.node.kind === SEGMENT_TYPE_INDEX) || next.node.kind === SEGMENT_TYPE_INDEX === (prev.node.kind === SEGMENT_TYPE_INDEX) && next.node.depth > prev.node.depth)));
}
// node_modules/@tanstack/router-core/dist/esm/scroll-restoration.js
function getSafeSessionStorage() {
	try {
		return sessionStorage;
	} catch {
		return;
	}
}
var storageKey = "tsr-scroll-restoration-v1_3";
getSafeSessionStorage();
/**
* The default `getKey` function for `useScrollRestoration`.
* It returns the `key` from the location state or the `href` of the location.
*
* The `location.href` is used as a fallback to support the use case where the location state is not available like the initial render.
*/
var defaultGetScrollRestorationKey = (location) => {
	return location.state.__TSR_key || location.href;
};
// node_modules/@tanstack/router-core/dist/esm/qss.js
/**
* Program is a reimplementation of the `qss` package:
* Copyright (c) Luke Edwards luke.edwards05@gmail.com, MIT License
* https://github.com/lukeed/qss/blob/master/license.md
*
* This reimplementation uses modern browser APIs
* (namely URLSearchParams) and TypeScript while still
* maintaining the original functionality and interface.
*
* Update: this implementation has also been mangled to
* fit exactly our use-case (single value per key in encoding).
*/
/**
* Encodes an object into a query string.
* @param obj - The object to encode into a query string.
* @param stringify - An optional custom stringify function.
* @returns The encoded query string.
* @example
* ```
* // Example input: encode({ token: 'foo', key: 'value' })
* // Expected output: "token=foo&key=value"
* ```
*/
function encode(obj, stringify = String) {
	let result;
	for (const key in obj) {
		const val = obj[key];
		if (val !== void 0) (result ||= new URLSearchParams()).set(key, stringify(val));
	}
	return result ? result.toString() : "";
}
/**
* Converts a string value to its appropriate type (string, number, boolean).
* @param mix - The string value to convert.
* @returns The converted value.
* @example
* // Example input: toValue("123")
* // Expected output: 123
*/
function toValue(str) {
	if (!str) return "";
	if (str === "false") return false;
	if (str === "true") return true;
	return +str * 0 === 0 && +str + "" === str ? +str : str;
}
/**
* Decodes a query string into an object.
* @param str - The query string to decode.
* @returns The decoded key-value pairs in an object format.
* @example
* // Example input: decode("token=foo&key=value")
* // Expected output: { "token": "foo", "key": "value" }
*/
function decode(str) {
	const searchParams = new URLSearchParams(str);
	const result = Object.create(null);
	for (const [key, value] of searchParams.entries()) {
		const previousValue = result[key];
		if (previousValue == null) result[key] = toValue(value);
		else if (Array.isArray(previousValue)) previousValue.push(toValue(value));
		else result[key] = [previousValue, toValue(value)];
	}
	return result;
}
// node_modules/@tanstack/router-core/dist/esm/searchParams.js
var jsonStart = /^(?:\s|["[{\d-]|fa|nu|tr)/;
/** Default `parseSearch` that strips leading '?' and JSON-parses values. */
var defaultParseSearch = parseSearchWith(JSON.parse);
/** Default `stringifySearch` using JSON.stringify for complex values. */
var defaultStringifySearch = stringifySearchWith(JSON.stringify, JSON.parse);
/**
* Build a `parseSearch` function using a provided JSON-like parser.
*
* The returned function strips a leading `?`, decodes values, and attempts to
* JSON-parse string values using the given `parser`.
*
* @param parser Function to parse a string value (e.g. `JSON.parse`).
* @returns A `parseSearch` function compatible with `Router` options.
* @link https://tanstack.com/router/latest/docs/framework/react/guide/custom-search-param-serialization
*/
function parseSearchWith(parser) {
	const isJsonParser = parser === JSON.parse;
	return (searchStr) => {
		if (searchStr[0] === "?") searchStr = searchStr.slice(1);
		const query = decode(searchStr);
		for (const key in query) {
			const value = query[key];
			if (typeof value === "string") {
				if (isJsonParser && !jsonStart.test(value)) continue;
				try {
					query[key] = parser(value);
				} catch (_err) {}
			}
		}
		return query;
	};
}
/**
* Build a `stringifySearch` function using a provided serializer.
*
* Non-primitive values are serialized with `stringify`. If a `parser` is
* supplied, string values that are parseable are re-serialized to ensure
* symmetry with `parseSearch`.
*
* @param stringify Function to serialize a value (e.g. `JSON.stringify`).
* @param parser Optional parser to detect parseable strings.
* @returns A `stringifySearch` function compatible with `Router` options.
* @link https://tanstack.com/router/latest/docs/framework/react/guide/custom-search-param-serialization
*/
function stringifySearchWith(stringify, parser) {
	const isJsonParser = parser === JSON.parse;
	function stringifyValue(val) {
		if (val && typeof val === "object") try {
			return stringify(val);
		} catch (_err) {}
		else if (parser && typeof val === "string") {
			if (isJsonParser && !jsonStart.test(val)) return val;
			try {
				parser(val);
				return stringify(val);
			} catch (_err) {}
		}
		return val;
	}
	return (search) => {
		const searchStr = encode(search, stringifyValue);
		return searchStr ? `?${searchStr}` : "";
	};
}
// node_modules/@tanstack/router-core/dist/esm/rewrite.js
/** Create a rewrite pair that strips/adds a basepath on input/output. */
function rewriteBasepath(basepath, caseSensitive, rewrite) {
	const trimmedBasepath = trimPath(basepath);
	const normalizedBasepath = `/${trimmedBasepath}`;
	const checkBasepath = caseSensitive ? normalizedBasepath : normalizedBasepath.toLowerCase();
	const checkBasepathWithSlash = `${checkBasepath}/`;
	const basepathRewrite = {
		input: ({ url }) => {
			const pathname = caseSensitive ? url.pathname : url.pathname.toLowerCase();
			if (pathname === checkBasepath) url.pathname = "/";
			else if (pathname.startsWith(checkBasepathWithSlash)) url.pathname = url.pathname.slice(normalizedBasepath.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = cleanPath(`/${trimmedBasepath}${url.pathname}`);
			return url;
		}
	};
	return rewrite ? {
		input: ({ url }) => executeRewriteInput(rewrite, basepathRewrite.input({ url })),
		output: ({ url }) => basepathRewrite.output({ url: executeRewriteOutput(rewrite, url) })
	} : basepathRewrite;
}
/** Execute a location input rewrite if provided. */
function executeRewriteInput(rewrite, url) {
	const res = rewrite?.input?.({ url });
	if (res) {
		if (typeof res === "string") return new URL(res);
		else if (res instanceof URL) return res;
	}
	return url;
}
/** Execute a location output rewrite if provided. */
function executeRewriteOutput(rewrite, url) {
	const res = rewrite?.output?.({ url });
	if (res) {
		if (typeof res === "string") return new URL(res);
		else if (res instanceof URL) return res;
	}
	return url;
}
// node_modules/@tanstack/router-core/dist/esm/stores.js
/** SSR non-reactive createMutableStore */
function createNonReactiveMutableStore(initialValue) {
	let value = initialValue;
	return {
		get() {
			return value;
		},
		set(nextOrUpdater) {
			value = functionalUpdate(nextOrUpdater, value);
		}
	};
}
/** SSR non-reactive createReadonlyStore */
function createNonReactiveReadonlyStore(read) {
	return { get() {
		return read();
	} };
}
function createRouterStores(initialLocation, config) {
	const { createMutableStore, createReadonlyStore, batch } = config;
	const byRoute = /* @__PURE__ */ new Map();
	const status = createMutableStore("idle");
	const location = createMutableStore(initialLocation);
	const resolvedLocation = createMutableStore(void 0);
	const ids = createMutableStore([]);
	const matches = createReadonlyStore(() => ids.get().map((id) => byRoute.get(id).get()));
	const __store = createReadonlyStore(() => ({
		status: status.get(),
		isLoading: status.get() === "pending",
		matches: matches.get(),
		location: location.get(),
		resolvedLocation: resolvedLocation.get()
	}));
	function getMatchStore(routeId) {
		let matchStore = byRoute.get(routeId);
		if (!matchStore) {
			matchStore = createMutableStore(void 0);
			byRoute.set(routeId, matchStore);
		}
		return matchStore;
	}
	const store = {
		status,
		location,
		resolvedLocation,
		ids,
		matches,
		byRoute,
		__store,
		getMatchStore,
		setMatches
	};
	function setMatches(nextMatches) {
		const previousIds = ids.get();
		const nextIds = nextMatches.map((match) => match.routeId);
		batch(() => {
			if (!arraysEqual(previousIds, nextIds)) ids.set(nextIds);
			for (const id of previousIds) if (!nextIds.includes(id)) byRoute.get(id).set(() => void 0);
			for (const nextMatch of nextMatches) {
				const matchStore = getMatchStore(nextMatch.routeId);
				if (matchStore.get() !== nextMatch) matchStore.set(nextMatch);
			}
		});
	}
	return store;
}
// node_modules/@tanstack/router-core/dist/esm/router.js
function isExternalUrl(url, origin) {
	return url.protocol !== "http:" && url.protocol !== "https:" || url.origin !== origin || !!url.username || !!url.password;
}
function getUrlPath(url) {
	return url.pathname + url.search + url.hash;
}
function routeNeedsLoad(route) {
	return route.options.loader || route.options.beforeLoad || route.lazyFn || route.options.component?.preload || route.options.pendingComponent?.preload;
}
/**
* Compute whether path, href or hash changed between previous and current
* resolved locations.
*/
function getLocationChangeInfo(location, resolvedLocation) {
	return {
		fromLocation: resolvedLocation,
		toLocation: location,
		pathChanged: resolvedLocation?.pathname !== location.pathname,
		hrefChanged: resolvedLocation?.href !== location.href,
		hashChanged: resolvedLocation?.hash !== location.hash
	};
}
function lifecycleEnd(matches) {
	return matches.findIndex((match) => match.status === "error" || match.status === "notFound" || match._notFound) + 1;
}
/** Run route lifecycle callbacks in leave/enter/stay phases. */
function runRouteLifecycle(router, previous, matches, previousEnd, nextEnd, owner) {
	if (previousEnd) previous = previous.slice(0, previousEnd);
	if (nextEnd) matches = matches.slice(0, nextEnd);
	for (const match of previous) {
		if (owner && router._tx !== owner) return;
		if (!matches.some((candidate) => candidate.routeId === match.routeId)) router.routesById[match.routeId].options.onLeave?.(match);
	}
	for (const match of matches) {
		if (owner && router._tx !== owner) return;
		router.routesById[match.routeId].options[previous.some((candidate) => candidate.routeId === match.routeId) ? "onStay" : "onEnter"]?.(match);
	}
}
/**
* Core, framework-agnostic router engine that powers TanStack Router.
*
* Provides navigation, matching, loading, preloading, caching and event APIs
* used by framework adapters (React/Solid). Prefer framework helpers like
* `createRouter` in app code.
*
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/RouterType
*/
var RouterCore = class {
	/**
	* @deprecated Use the `createRouter` function instead
	*/
	constructor(options, getStoreConfig) {
		this.tempLocationKey = `${Math.round(Math.random() * 1e7)}`;
		this._scroll = { n: true };
		this.subscribers = /* @__PURE__ */ new Set();
		this._cache = /* @__PURE__ */ new Map();
		this._committed = [];
		this.startTransition = async (fn) => {
			fn();
			return false;
		};
		this.update = (newOptions) => {
			const prevOptions = this.options;
			this.options = {
				...prevOptions,
				...newOptions
			};
			this.isServer = this.options.isServer ?? true ?? typeof document === "undefined";
			this.protocolAllowlist = new Set(this.options.protocolAllowlist);
			if (!this.history || this.options.history && this.options.history !== this.history) {
				if (!this.options.history) {} else this.history = this.options.history;
			}
			this.origin = this.options.origin;
			if (!this.origin) this.origin = "http://localhost";
			const nextBasepath = this.options.basepath ?? "/";
			const nextRewriteOption = this.options.rewrite;
			const rewriteChanged = this.basepath !== nextBasepath || prevOptions?.rewrite !== nextRewriteOption || prevOptions?.caseSensitive !== this.options.caseSensitive;
			if (rewriteChanged) {
				this.basepath = nextBasepath;
				this.rewrite = nextBasepath !== "/" && trimPath(nextBasepath) ? rewriteBasepath(nextBasepath, this.options.caseSensitive, nextRewriteOption) : nextRewriteOption;
			}
			if (this.history) this.updateLatestLocation();
			if (this.options.routeTree !== this.routeTree || prevOptions?.caseSensitive !== this.options.caseSensitive) {
				this.routeTree = this.options.routeTree;
				let processRouteTreeResult;
				if (globalThis.__TSR_CACHE__ && globalThis.__TSR_CACHE__.routeTree === this.routeTree && globalThis.__TSR_CACHE__.caseSensitive === this.options.caseSensitive) processRouteTreeResult = globalThis.__TSR_CACHE__.processRouteTreeResult;
				else {
					processRouteTreeResult = this.buildRouteTree();
					if (globalThis.__TSR_CACHE__ === void 0) globalThis.__TSR_CACHE__ = {
						routeTree: this.routeTree,
						caseSensitive: this.options.caseSensitive,
						processRouteTreeResult
					};
				}
				this.setRoutes(processRouteTreeResult);
			}
			if (!this.stores) {
				if (this.latestLocation) {
					const config = this.getStoreConfig(this);
					this.batch = config.batch;
					this.stores = createRouterStores(this.latestLocation, config);
				}
			} else if (rewriteChanged) this.stores.location.set(this.latestLocation);
		};
		this.updateLatestLocation = () => {
			this.latestLocation = this.parseLocation(this.history.location, this.latestLocation);
		};
		this.buildRouteTree = () => {
			const result = processRouteTree(this.routeTree, this.options.caseSensitive);
			if (this.options.routeMasks) processRouteMasks(this.options.routeMasks, result.processedTree);
			return {
				...result,
				resolvePathCache: createSieveCache(1e3)
			};
		};
		this.subscribe = (eventType, fn) => {
			const listener = {
				eventType,
				fn
			};
			this.subscribers.add(listener);
			return () => {
				this.subscribers.delete(listener);
			};
		};
		this.emit = (routerEvent) => {
			for (const listener of this.subscribers) if (listener.eventType === routerEvent.type) try {
				listener.fn(routerEvent);
			} catch (e) {
				console.error(e);
			}
		};
		this.parseLocation = (locationToParse, previousLocation) => {
			const parse = ({ pathname, search, hash, href }, state) => {
				if (!this.rewrite && !/[ \x00-\x1f\x7f\u0080-\uffff]/.test(pathname)) {
					const parsedSearch = this.options.parseSearch(search);
					const searchStr = this.options.stringifySearch(parsedSearch);
					return {
						href: pathname + searchStr + hash,
						publicHref: pathname + searchStr + hash,
						pathname: decodePath(pathname),
						external: false,
						searchStr,
						search: nullReplaceEqualDeep(previousLocation?.search, parsedSearch),
						hash: decodePath(hash.slice(1)),
						state: replaceEqualDeep(previousLocation?.state, state)
					};
				}
				const url = executeRewriteInput(this.rewrite, new URL(href, this.origin));
				const parsedSearch = this.options.parseSearch(url.search);
				const searchStr = this.options.stringifySearch(parsedSearch);
				url.search = searchStr;
				return {
					href: url.href.replace(url.origin, ""),
					publicHref: href,
					pathname: decodePath(normalizeProtocolRelative(url.pathname)),
					external: !!this.rewrite && isExternalUrl(url, this.origin),
					searchStr,
					search: nullReplaceEqualDeep(previousLocation?.search, parsedSearch),
					hash: decodePath(url.hash.slice(1)),
					state: replaceEqualDeep(previousLocation?.state, state)
				};
			};
			const location = parse(locationToParse, locationToParse.state);
			const { __tempLocation, __tempKey } = location.state;
			if (__tempLocation && (!__tempKey || __tempKey === this.tempLocationKey)) {
				const parsedTempLocation = parse(__tempLocation, {
					...__tempLocation.state,
					__tempLocation: void 0,
					key: location.state.key,
					__TSR_key: location.state.__TSR_key
				});
				parsedTempLocation.maskedLocation = location;
				return parsedTempLocation;
			}
			return location;
		};
		this.matchRoutes = (pathnameOrNext, locationSearchOrOpts, opts) => {
			if (typeof pathnameOrNext === "string") return this.matchRoutesInternal({
				pathname: pathnameOrNext,
				search: locationSearchOrOpts
			}, opts);
			return this.matchRoutesInternal(pathnameOrNext, locationSearchOrOpts);
		};
		this.getMatchedRoutes = (pathname) => {
			const rawParams = Object.create(null);
			const match = findRouteMatch(trimPathRight(pathname), this.processedTree, true);
			if (match) Object.assign(rawParams, match.rawParams);
			return [
				match?.branch || [this.routesById["__root__"]],
				rawParams,
				match?.route
			];
		};
		this.buildLocation = (opts) => {
			const build = (dest = {}) => {
				if (dest.href) {
					const parsed = parseHref(dest.href, {});
					dest = {
						...dest,
						to: executeRewriteInput(this.rewrite, new URL(parsed.pathname, this.origin)).pathname,
						search: this.options.parseSearch(parsed.search),
						hash: parsed.hash.slice(1)
					};
				}
				const currentLocation = opts._fromLocation || this._pendingLocation || this.latestLocation;
				let lightweight;
				const current = () => {
					return currentLocation;
				};
				const currentMatch = () => lightweight ??= this.matchRoutesLightweight(current());
				const to = dest.to ? `${dest.to}` : ".";
				const nextTo = resolvePath(to[0] === "/" ? "" : dest.unsafeRelative === "path" ? current().pathname : dest.from ?? currentMatch()[1], to, this.options.trailingSlash, this.resolvePathCache);
				const destRoute = this.routesByPath[trimPathRight(nextTo)];
				const isTemplate = nextTo.includes("$");
				let destRoutes;
				if (destRoute) destRoutes = destRoute._branch ??= buildRouteBranch(destRoute);
				else if (isTemplate) destRoutes = [];
				else {
					const [matchedRoutes, rawParams, foundRoute] = this.getMatchedRoutes(nextTo);
					destRoutes = matchedRoutes;
					if (this.options.notFoundRoute && (!foundRoute || foundRoute.path !== "/" && rawParams["**"])) destRoutes = [...destRoutes, this.options.notFoundRoute];
				}
				const interpolation = isTemplate ? destRoute?._interpolation ?? parseSegments(false, { fullPath: nextTo }, 0) : void 0;
				let nextParams;
				for (const route of destRoutes) {
					const fn = route.options.params?.stringify ?? route.options.stringifyParams;
					if (fn) {
						const fromParams = currentMatch()[3];
						nextParams ??= resolveNextParams(dest.params, fromParams);
						if (!hasKeys(nextParams)) break;
						if (nextParams === fromParams) nextParams = Object.assign(createNull(), nextParams);
						try {
							Object.assign(nextParams, fn(nextParams));
						} catch {}
					}
				}
				nextParams ??= resolveNextParams(dest.params, needsInheritedParams(dest.params, interpolation) ? currentMatch()[3] : EMPTY_RECORD);
				const nextPathname = opts.leaveParams ? nextTo : normalizeProtocolRelative(decodePath(interpolation ? interpolatePath(nextTo, interpolation, nextParams, this.pathParamsDecoder) : nextTo));
				const middlewares = getSearchMiddlewares(destRoutes, opts._includeValidateSearch);
				const fromSearch = () => {
					let search = currentMatch()[2];
					if (opts._includeValidateSearch && this.options.search?.strict) {
						const validatedSearch = {};
						destRoutes.forEach((route) => {
							if (route.options.validateSearch) try {
								Object.assign(validatedSearch, validateSearch(route.options.validateSearch, {
									...validatedSearch,
									...search
								}));
							} catch {}
						});
						search = validatedSearch;
					}
					return search;
				};
				const nextSearch = middlewares.length ? applySearchMiddleware(middlewares, fromSearch(), dest) : dest.search === true ? fromSearch() : typeof dest.search === "function" ? dest.search(fromSearch()) : dest.search || EMPTY_RECORD;
				const searchStr = this.options.stringifySearch(nextSearch);
				const hash = dest.hash === true ? current().hash : typeof dest.hash === "function" ? dest.hash(current().hash) : dest.hash || void 0;
				const hashStr = hash ? `#${hash}` : "";
				const nextState = !dest.state ? EMPTY_RECORD : dest.state === true ? current().state : typeof dest.state === "function" ? dest.state(current().state) : dest.state;
				const fullPath = `${nextPathname}${searchStr}${hashStr}`;
				let href;
				let publicHref;
				let external = false;
				if (this.rewrite) {
					const url = new URL(fullPath, this.origin);
					const origin = url.origin;
					const rewrittenUrl = executeRewriteOutput(this.rewrite, url);
					href = getUrlPath(url);
					if (isExternalUrl(rewrittenUrl, origin)) {
						publicHref = rewrittenUrl.href;
						external = true;
					} else publicHref = normalizeProtocolRelative(getUrlPath(rewrittenUrl));
				} else {
					href = encodePathLikeUrl(fullPath);
					publicHref = href;
				}
				return {
					publicHref,
					href,
					pathname: nextPathname,
					search: nextSearch,
					searchStr,
					state: nextState,
					hash: hash ?? "",
					external,
					unmaskOnReload: dest.unmaskOnReload
				};
			};
			const next = build(opts);
			if (opts.mask) next.maskedLocation = build({
				from: opts.from,
				...opts.mask
			});
			else if (this.options.routeMasks) {
				const match = findFlatMatch(next.pathname, this.processedTree);
				if (match) {
					const params = Object.assign(createNull(), match.rawParams);
					const { from: _from, params: maskParams, ...maskProps } = match.route;
					const nextParams = resolveNextParams(maskParams, params);
					next.maskedLocation = build({
						from: opts.from,
						...maskProps,
						params: nextParams
					});
				}
			}
			return next;
		};
		this.commitLocation = async ({ viewTransition, ignoreBlocker, ...next }) => {};
		this.buildAndCommitLocation = ({ replace, resetScroll, hashScrollIntoView, viewTransition, ignoreBlocker, ...rest } = {}) => {
			return Promise.resolve();
		};
		this.navigate = async ({ to, reloadDocument, href, publicHref, ...rest }) => {};
		this.load = async (opts) => {
			return loadServerRoute(this, opts);
		};
		this.startViewTransition = (fn) => {
			this.shouldViewTransition ?? this.options.defaultViewTransition;
			this.shouldViewTransition = void 0;
			return fn();
		};
		this.invalidate = (opts) => {
			const committedMatches = this._committed;
			const filter = opts?.filter;
			const preloads = this._preloads;
			const invalidIds = /* @__PURE__ */ new Set();
			const consider = (match) => {
				if (!filter || filter(match)) invalidIds.add(match.id);
			};
			committedMatches.forEach(consider);
			this._cache.forEach(consider);
			preloads?.forEach((matches) => matches.forEach(consider));
			this._tx?.[3].forEach(consider);
			const abort = [];
			for (const [controller, matches] of preloads ?? []) if (matches.some((match) => invalidIds.has(match.id))) {
				preloads.delete(controller);
				abort.push(controller);
			}
			const invalidate = (d) => {
				if (invalidIds.has(d.id)) {
					const route = this.routesById[d.routeId];
					const next = {
						...d,
						invalid: true,
						...(opts?.forcePending || d.status === "error" || d.status === "notFound") && routeNeedsLoad(route) ? {
							status: "pending",
							error: void 0
						} : void 0
					};
					d._flight = void 0;
					return next;
				}
				return d;
			};
			this._committed = committedMatches.map(invalidate);
			for (const [id, match] of this._cache) if (invalidIds.has(id)) {
				match.invalid = true;
				if (opts?.forcePending) match.status = "pending";
			}
			for (const id of invalidIds) {
				const flight = this._flights?.get(id);
				this._flights?.delete(id);
				if (flight && !flight[2]) abort.push(flight[1]);
			}
			for (const controller of abort) controller.abort();
			this.shouldViewTransition = false;
			return this.load({ sync: opts?.sync });
		};
		this.resolveRedirect = (redirect) => {
			const options = redirect.options;
			let href = redirect.headers.get("Location") || options.href;
			if (!href) {
				const location = this.buildLocation(options);
				href = (location.maskedLocation ?? location).publicHref || "/";
			}
			let scheme;
			if (protocolRelativePrefixRegex.test(href) || (scheme = getUrlScheme(href)) && !this.protocolAllowlist.has(scheme)) throw new Error("Redirect blocked: unsafe protocol");
			if (scheme === "http:" || scheme === "https:") {
				const url = new URL(href);
				if (url.pathname.startsWith("//")) href = url.href;
				else if (!isExternalUrl(url, this.origin)) {
					href = getUrlPath(url);
					scheme = void 0;
				}
			}
			if (scheme) options.reloadDocument = true;
			options.href = href;
			redirect.headers.set("Location", href);
			return redirect;
		};
		this.clearCache = (opts) => {
			const cached = this._cache;
			const preloads = this._preloads;
			const filter = opts?.filter;
			const discarded = [];
			const discardedIds = [];
			for (const [id, match] of cached) if (!filter || filter(match)) {
				discardedIds.push(id);
				discarded.push(match);
			}
			const abort = [];
			for (const [controller, matches] of preloads ?? []) if (!filter || matches.some(filter)) {
				abort.push(controller);
				discarded.push(...matches);
			}
			for (const id of discardedIds) cached.delete(id);
			for (const controller of abort) preloads.delete(controller);
			for (const match of discarded) {
				const flight = match._flight;
				match._flight = void 0;
				if (flight && !--flight[2]) {
					if (this._flights?.get(match.id) === flight) this._flights.delete(match.id);
					abort.push(flight[1]);
				}
			}
			for (const controller of abort) controller.abort();
		};
		this.loadRouteChunk = loadRouteChunk;
		this.preloadRoute = (opts) => preloadClientRoute(this, opts);
		this.matchRoute = (location, opts) => {
			const matchLocation = {
				...location,
				to: location.to ? resolvePath(location.from || "", location.to, this.options.trailingSlash, this.resolvePathCache) : void 0,
				params: location.params || {},
				leaveParams: true
			};
			const next = this.buildLocation(matchLocation);
			const isPending = this.stores.status.get() === "pending";
			if (opts?.pending && !isPending) return false;
			const baseLocation = opts?.pending ?? !isPending ? this.latestLocation : this.stores.resolvedLocation.get() || this.stores.location.get();
			const match = findSingleMatch(next.pathname, opts?.caseSensitive ?? false, opts?.fuzzy ?? false, baseLocation.pathname, this.processedTree);
			if (!match) return false;
			if (location.params) {
				if (!deepEqual(match.rawParams, location.params, true)) return false;
			}
			if (opts?.includeSearch ?? true) return deepEqual(baseLocation.search, next.search, true) ? match.rawParams : false;
			return match.rawParams;
		};
		this.getStoreConfig = getStoreConfig;
		if (options.pathParamsAllowedCharacters?.length) this.pathParamsDecoder = compileDecodeCharMap(options.pathParamsAllowedCharacters);
		this.update({
			defaultPreloadDelay: 50,
			defaultPendingMs: 1e3,
			defaultPendingMinMs: 500,
			context: void 0,
			...options,
			caseSensitive: options.caseSensitive ?? false,
			notFoundMode: options.notFoundMode ?? "fuzzy",
			stringifySearch: options.stringifySearch ?? defaultStringifySearch,
			parseSearch: options.parseSearch ?? defaultParseSearch,
			protocolAllowlist: options.protocolAllowlist ?? DEFAULT_PROTOCOL_ALLOWLIST
		});
	}
	isShell() {
		return !!this.options.isShell;
	}
	get state() {
		return this.stores.__store.get();
	}
	setRoutes(caches) {
		Object.assign(this, caches);
		this.lightweightCache = /* @__PURE__ */ new WeakMap();
		const notFoundRoute = this.options.notFoundRoute;
		if (notFoundRoute) {
			notFoundRoute.init(99999999999);
			if (this.routesById[notFoundRoute.id] !== notFoundRoute) notFoundRoute._interpolation = parseSegments(false, notFoundRoute, 0);
			this.routesById[notFoundRoute.id] = notFoundRoute;
		}
	}
	matchRoutesInternal(next, opts) {
		const [initialMatchedRoutes, rawParams, foundRoute] = this.getMatchedRoutes(next.pathname);
		let matchedRoutes = initialMatchedRoutes;
		let isGlobalNotFound = false;
		if (foundRoute ? foundRoute.path !== "/" && rawParams["**"] : trimPathRight(next.pathname)) {
			if (this.options.notFoundRoute) matchedRoutes = [...matchedRoutes, this.options.notFoundRoute];
			else isGlobalNotFound = true;
		}
		const _notFoundRouteId = isGlobalNotFound ? findGlobalNotFoundRouteId(this.options.notFoundMode, matchedRoutes) : void 0;
		const matches = new Array(matchedRoutes.length);
		const committed = this._committed;
		const previousAt = (route, index) => {
			const match = committed[index];
			return match?.routeId === route.id ? match : route === this.options.notFoundRoute ? committed.find((candidate) => candidate.routeId === route.id) : void 0;
		};
		let strictParams;
		for (let index = 0; index < matchedRoutes.length; index++) {
			const route = matchedRoutes[index];
			const parentMatch = matches[index - 1];
			let preMatchSearch;
			let strictMatchSearch;
			let searchError;
			{
				const parentSearch = parentMatch?.search ?? next.search;
				const parentStrictSearch = parentMatch?._strictSearch ?? void 0;
				try {
					const strictSearch = validateSearch(route.options.validateSearch, { ...parentSearch }) ?? void 0;
					preMatchSearch = {
						...parentSearch,
						...strictSearch
					};
					strictMatchSearch = {
						...parentStrictSearch,
						...strictSearch
					};
				} catch (err) {
					let searchParamError = err;
					if (!(err instanceof SearchParamError)) searchParamError = new SearchParamError(err.message, { cause: err });
					if (opts?.throwOnError) throw searchParamError;
					preMatchSearch = parentSearch;
					strictMatchSearch = {};
					searchError = searchParamError;
				}
			}
			let loaderDeps = "";
			let loaderDepsHash = "";
			try {
				loaderDeps = route.options.loaderDeps?.({ search: preMatchSearch }) ?? "";
				loaderDepsHash = loaderDeps ? JSON.stringify(loaderDeps) || "" : "";
			} catch (cause) {
				if (opts?.throwOnError) throw cause;
				searchError ??= cause;
			}
			const usedParams = createNull();
			const interpolatedPath = route._interpolation ? interpolatePath(route.fullPath, route._interpolation, rawParams, this.pathParamsDecoder, usedParams) : route.fullPath;
			const matchId = route.id + interpolatedPath + loaderDepsHash;
			const previousMatch = previousAt(route, index);
			const existingMatch = this._cache.get(matchId) ?? (previousMatch?.id === matchId ? previousMatch : void 0);
			strictParams = existingMatch?._strictParams ?? Object.assign(usedParams, strictParams);
			let paramsError;
			if (!existingMatch) try {
				extractStrictParams(route, strictParams);
			} catch (err) {
				if (isNotFound(err) || isRedirect(err)) paramsError = err;
				else paramsError = new PathParamError(err.message, { cause: err });
				if (opts?.throwOnError) throw paramsError;
			}
			const cause = previousMatch ? "stay" : "enter";
			let match;
			if (existingMatch) match = {
				...existingMatch,
				cause,
				search: previousMatch ? nullReplaceEqualDeep(previousMatch.search, preMatchSearch) : nullReplaceEqualDeep(existingMatch.search, preMatchSearch),
				_strictSearch: strictMatchSearch,
				searchError
			};
			else {
				const status = routeNeedsLoad(route) ? "pending" : "success";
				match = {
					id: matchId,
					ssr: void 0,
					index,
					routeId: route.id,
					params: previousMatch?.params ?? strictParams,
					_strictParams: strictParams,
					pathname: interpolatedPath,
					updatedAt: Date.now(),
					search: previousMatch ? nullReplaceEqualDeep(previousMatch.search, preMatchSearch) : preMatchSearch,
					_strictSearch: strictMatchSearch,
					searchError,
					status,
					isFetching: false,
					error: void 0,
					paramsError,
					context: {},
					abortController: opts?._controller ?? new AbortController(),
					cause,
					loaderDeps: previousMatch ? replaceEqualDeep(previousMatch.loaderDeps, loaderDeps) : loaderDeps,
					invalid: false,
					preload: false,
					staticData: route.options.staticData || {},
					fullPath: route.fullPath
				};
			}
			const _notFound = _notFoundRouteId === route.id;
			if (match._notFound && !_notFound) match.error = void 0;
			match._notFound = _notFound;
			matches[index] = match;
		}
		for (let index = 0; index < matches.length; index++) {
			const match = matches[index];
			match.params = match.cause === "stay" ? nullReplaceEqualDeep(match.params, strictParams) : strictParams;
			if (opts?._controller) match.context = {};
		}
		return matches;
	}
	/**
	* Lightweight route matching for buildLocation.
	* Only computes fullPath, accumulated search, and params - skipping expensive
	* operations like AbortController, loaderDeps, and full match objects.
	*/
	matchRoutesLightweight(location) {
		const lastRouteId = last(this.stores.ids.get());
		const lastStateMatch = lastRouteId ? this.stores.byRoute.get(lastRouteId).get() : void 0;
		const lastStateMatchId = lastStateMatch?.id;
		const cached = this.lightweightCache.get(location);
		if (cached && cached[0] === lastStateMatchId) return cached[1];
		const [matchedRoutes, rawParams] = this.getMatchedRoutes(location.pathname);
		const lastRoute = last(matchedRoutes);
		const accumulatedSearch = { ...location.search };
		for (const route of matchedRoutes) try {
			Object.assign(accumulatedSearch, validateSearch(route.options.validateSearch, accumulatedSearch));
		} catch {}
		const canReuseParams = lastStateMatch && lastStateMatch.routeId === lastRoute.id && lastStateMatch.pathname === location.pathname;
		let params;
		if (canReuseParams) params = lastStateMatch.params;
		else {
			const strictParams = rawParams;
			for (const route of matchedRoutes) try {
				extractStrictParams(route, strictParams);
			} catch {}
			params = strictParams;
		}
		const result = [
			matchedRoutes,
			lastRoute.fullPath,
			accumulatedSearch,
			params
		];
		this.lightweightCache.set(location, [lastStateMatchId, result]);
		return result;
	}
};
/** Error thrown when search parameter validation fails. */
var SearchParamError = class extends Error {};
/** Error thrown when path parameter parsing/validation fails. */
var PathParamError = class extends Error {};
function validateSearch(validateSearch, input) {
	if (validateSearch == null) return {};
	if ("~standard" in validateSearch) {
		const result = validateSearch["~standard"].validate(input);
		if (result instanceof Promise) throw new SearchParamError("Async validation not supported");
		if (result.issues) throw new SearchParamError(JSON.stringify(result.issues, void 0, 2), { cause: result });
		return result.value;
	}
	if ("parse" in validateSearch) return validateSearch.parse(input);
	if (typeof validateSearch === "function") return validateSearch(input);
	return {};
}
function resolveNextParams(spec, base) {
	if (spec === void 0 || spec === true) return base;
	const next = Object.create(null);
	if (spec === false || spec === null) return next;
	if (typeof spec === "function") {
		Object.assign(next, base);
		return Object.assign(next, spec(next));
	}
	return Object.assign(next, base, spec);
}
function needsInheritedParams(spec, interpolation) {
	if (typeof spec === "function") return true;
	if (!interpolation || spec === false || spec === null) return false;
	return spec === void 0 || spec === true || interpolation.some((part) => typeof part !== "string" && !hasOwn.call(spec, part[1]));
}
var EMPTY_RECORD = Object.freeze({});
function getSearchMiddlewares(destRoutes, includeValidateSearch) {
	const middlewares = [];
	for (let i = 0; i < destRoutes.length; i++) {
		const routeOptions = destRoutes[i].options;
		if ("search" in routeOptions) {
			if (routeOptions.search?.middlewares) middlewares.push(...routeOptions.search.middlewares);
		} else if (routeOptions.preSearchFilters || routeOptions.postSearchFilters) {
			const legacyMiddleware = ({ search, next }) => {
				const result = next(routeOptions.preSearchFilters ? routeOptions.preSearchFilters.reduce((prev, next) => next(prev), search) : search);
				return routeOptions.postSearchFilters ? routeOptions.postSearchFilters.reduce((prev, next) => next(prev), result) : result;
			};
			middlewares.push(legacyMiddleware);
		}
		const routeValidateSearch = routeOptions.validateSearch;
		if (includeValidateSearch && routeValidateSearch) {
			const validate = ({ search, next, meta }) => {
				const result = next(search);
				try {
					const validated = validateSearch(routeValidateSearch, result);
					if (meta && validated) {
						for (const key in validated) if (!(key in result)) (meta.defaulted ||= /* @__PURE__ */ new Map()).set(key, validated[key]);
					}
					return {
						...result,
						...validated
					};
				} catch {}
				return result;
			};
			middlewares.push(validate);
		}
	}
	return middlewares;
}
function applySearchMiddleware(middlewares, search, dest) {
	const applyNext = (index, currentSearch, meta) => {
		if (index >= middlewares.length) {
			if (!dest.search) return {};
			if (dest.search === true) return currentSearch;
			const result = functionalUpdate(dest.search, currentSearch);
			if (meta) meta.explicit = result;
			return result;
		}
		const next = (newSearch, collectMeta) => {
			if (collectMeta) {
				const nextMeta = meta || {};
				return {
					search: applyNext(index + 1, newSearch, nextMeta),
					meta: nextMeta
				};
			}
			return applyNext(index + 1, newSearch, meta);
		};
		return middlewares[index]({
			search: currentSearch,
			next,
			meta
		});
	};
	return applyNext(0, search);
}
function findGlobalNotFoundRouteId(notFoundMode, routes) {
	if (notFoundMode !== "root") {
		let fallback;
		for (let i = routes.length - 1; i >= 0; i--) {
			const route = routes[i];
			if (route.options.notFoundComponent) return route.id;
			fallback ||= route.children && route.id;
		}
		if (fallback) return fallback;
	}
	return rootRouteId;
}
function extractStrictParams(route, accumulatedParams) {
	const parseParams = route.options.params?.parse ?? route.options.parseParams;
	if (parseParams) Object.assign(accumulatedParams, parseParams(accumulatedParams));
}
// node_modules/@tanstack/router-core/dist/esm/load-client.js
function preloadComponent(route, type) {
	return route.options[type]?.preload?.();
}
function loadComponents(route, onPendingReady) {
	const component = preloadComponent(route, "component");
	let pending = preloadComponent(route, "pendingComponent");
	if (onPendingReady) {
		if (pending) pending = pending.then(onPendingReady);
		else onPendingReady();
	}
	if (component && pending) return Promise.all([component, pending]).then(() => {});
	return component ?? pending;
}
function loadRouteChunk(route, componentType, onPendingReady) {
	const afterLazy = () => componentType === false ? void 0 : componentType ? preloadComponent(route, componentType) : loadComponents(route, onPendingReady);
	const current = route._lazy;
	if (current) return current === true ? afterLazy() : current.then(afterLazy);
	if (!route.lazyFn) return afterLazy();
	const promise = route.lazyFn().then((lazyRoute) => {
		{
			const { id: _id, ...options } = lazyRoute.options;
			Object.assign(route.options, options);
			route._lazy = true;
		}
	}, (error) => {
		route._lazy = void 0;
		throw error;
	});
	route._lazy = promise;
	return promise.then(afterLazy);
}
/** Return the structural lane through the first terminal render boundary. */
function _getRenderedMatches(matches) {
	const end = matches.findIndex((match) => match.status !== "success" || match._notFound) + 1;
	return end && end < matches.length ? matches.slice(0, end) : matches;
}
/** Return the lane whose document assets belong to the current presentation. */
function _getAssetMatches(matches) {
	let end = matches.length;
	for (let index = 0; index < end; index++) {
		const match = matches[index];
		if (match._assetEnd !== void 0) {
			end = Math.min(end, Math.max(index + 1, match._assetEnd));
			continue;
		}
		if (match.status !== "success" || match._notFound) {
			end = index + 1;
			break;
		}
	}
	return end < matches.length ? matches.slice(0, end) : matches;
}
var SUCCESS$1 = 0;
var ERROR$1 = 1;
var NOT_FOUND$1 = 2;
var REDIRECTED$1 = 3;
var CANCELED_OUTCOME = [4];
function isControl(result) {
	return typeof result[0] === "number";
}
function waitFor$1(value, signal) {
	if (signal.aborted) return Promise.race([Promise.reject(signal), value]);
	return new Promise((resolve, reject) => {
		const abort = () => reject(signal);
		signal.addEventListener("abort", abort, { once: true });
		Promise.resolve(value).then(resolve, reject).then(() => signal.removeEventListener("abort", abort));
	});
}
function getRoute$1(router, match) {
	return router.routesById[match.routeId];
}
function normalize$1(value, rejected, routeId) {
	if (isRedirect(value)) return [REDIRECTED$1, value];
	if (isNotFound(value)) {
		value.routeId ||= routeId;
		return [NOT_FOUND$1, value];
	}
	if (!rejected) return [SUCCESS$1, value];
	if (typeof value?.then === "function") value = new Error("A Promise was thrown", { cause: value });
	return [ERROR$1, value];
}
function normalizeError$1(route, cause) {
	let outcome = normalize$1(cause, true, route.id);
	if (outcome[0] !== ERROR$1) return outcome;
	try {
		route.options.onError?.(outcome[1]);
	} catch (onErrorCause) {
		outcome = normalize$1(onErrorCause, true, route.id);
	}
	return outcome;
}
function normalizeLaneError(router, lane, route, cause, options) {
	if (options[0].signal.aborted) return CANCELED_OUTCOME;
	return materializeRedirect$1(router, lane, route, normalizeError$1(route, cause), options);
}
async function contextualize$1(router, lane, options, end, planSuccessfulLane, retainedEnd) {
	const [location, matches] = lane;
	const signal = options[0].signal;
	const preload = !!options[3];
	for (let index = options[6] ?? 0; index < end; index++) {
		const match = matches[index];
		const route = getRoute$1(router, match);
		match.abortController = options[0];
		const parentContext = matches[index - 1]?.context ?? router.options.context ?? {};
		const common = {
			params: match.params,
			location,
			navigate: (opts) => router.navigate({
				...opts,
				_fromLocation: location
			}),
			buildLocation: router.buildLocation,
			cause: preload ? "preload" : match.cause,
			abortController: options[0],
			preload,
			matches,
			routeId: route.id
		};
		try {
			const routeContext = match._ctx ||= route.options.context ? route.options.context({
				...common,
				deps: match.loaderDeps,
				context: parentContext
			}) || {} : void 0;
			match.context = {
				...parentContext,
				...routeContext
			};
		} catch (cause) {
			releaseFlight(router, match);
			return [index, normalizeLaneError(router, lane, route, cause, options)];
		}
		if (signal.aborted) return [index, CANCELED_OUTCOME];
		const validationError = match.paramsError ?? match.searchError;
		if (validationError !== void 0) {
			releaseFlight(router, match);
			return [index, normalizeLaneError(router, lane, route, validationError, options)];
		}
		const beforeLoad = route.options.beforeLoad;
		if (!beforeLoad) continue;
		const previousStatus = match.status;
		if (index >= retainedEnd) {
			match.status = "pending";
			options[7]?.();
		}
		try {
			setFetching(router, match, "beforeLoad", options[0]);
			const value = beforeLoad({
				...common,
				search: match.search,
				context: match.context,
				...router.options.additionalContext
			});
			const result = await (typeof value?.then === "function" ? waitFor$1(value, signal) : value);
			if (signal.aborted) return [index, CANCELED_OUTCOME];
			const outcome = materializeRedirect$1(router, lane, route, normalize$1(result, false, route.id), options);
			if (outcome[0] !== SUCCESS$1) {
				releaseFlight(router, match);
				return [index, outcome];
			}
			match.context = {
				...match.context,
				...result
			};
		} catch (cause) {
			releaseFlight(router, match);
			return [index, normalizeLaneError(router, lane, route, cause, options)];
		} finally {
			match.status = previousStatus;
			setFetching(router, match, false, options[0]);
		}
	}
	planSuccessfulLane();
}
function releaseOwnedFlight(router, match, flight) {
	if (!flight || --flight[2]) return;
	if (router._flights?.get(match.id) === flight) {
		const current = router._tx;
		if (current && !current[0].signal.aborted && !current[3].includes(match) && current[3].some((candidate) => candidate.id === match.id) && current[3].some((candidate) => candidate.isFetching === "beforeLoad")) return;
		router._flights.delete(match.id);
	}
	return flight[1];
}
function releaseFlight(router, match) {
	const flight = match._flight;
	match._flight = void 0;
	releaseOwnedFlight(router, match, flight)?.abort();
}
/**
* Not passing in a `next` ownership recipient
* is equivalent to discarding the match resources
*/
function transferMatchResources(router, previous, next, deferSameIdFlight) {
	const abort = [];
	for (const match of previous) if (!next?.includes(match)) {
		const flight = match._flight;
		match._flight = void 0;
		if (deferSameIdFlight && flight?.[2] === 1 && router._flights?.get(match.id) === flight && next?.some((candidate) => candidate.id === match.id)) flight[2] = 0;
		else {
			const controller = releaseOwnedFlight(router, match, flight);
			if (controller) abort.push(controller);
		}
	}
	for (const controller of abort) controller.abort();
}
function acquireMatchResources(matches) {
	for (const match of matches) {
		const flight = match._flight;
		if (flight) flight[2]++;
	}
}
function setFetching(router, match, value, owner) {
	match.isFetching = value;
	if (owner && router._tx?.[0] !== owner) return;
	const store = router.stores.byRoute.get(match.routeId);
	const presented = store?.get();
	if (presented?.id === match.id) store.set({
		...presented,
		isFetching: value
	});
}
function getLoaderContext$1(router, lane, match, route, controller, parentMatchPromise, preload) {
	const location = lane[0];
	return {
		params: match.params,
		location,
		navigate: (opts) => router.navigate({
			...opts,
			_fromLocation: location
		}),
		cause: preload ? "preload" : match.cause,
		abortController: controller,
		preload,
		deps: match.loaderDeps,
		parentMatchPromise,
		context: match.context,
		route,
		...router.options.additionalContext
	};
}
async function loadResource(router, lane, match, route, loader, parentMatchPromise, options) {
	const owner = options[0];
	const signal = owner.signal;
	if (signal.aborted) return CANCELED_OUTCOME;
	if (!loader) return [SUCCESS$1, void 0];
	let flight = match._flight;
	setFetching(router, match, "loader", owner);
	try {
		if (!flight) {
			const controller = new AbortController();
			flight = [
				Promise.resolve().then(() => loader(getLoaderContext$1(router, lane, match, route, controller, parentMatchPromise, !!options[3]))).then((value) => normalize$1(value, false, route.id), (cause) => normalize$1(cause, true, route.id)).then((result) => {
					if (result[0] !== SUCCESS$1 && router._flights?.get(match.id) === flight) {
						router._flights.delete(match.id);
						if (!flight[2]) controller.abort();
					}
					return result[0] === ERROR$1 && flight[2] ? normalizeError$1(route, result[1]) : result;
				}),
				controller,
				1
			];
			(router._flights ??= /* @__PURE__ */ new Map()).set(match.id, flight);
		}
		match._flight = flight;
		match.abortController = flight[1];
		return materializeRedirect$1(router, lane, route, await waitFor$1(flight[0], signal), options);
	} catch (cause) {
		if (cause !== signal || !signal.aborted) throw cause;
		releaseFlight(router, match);
		return CANCELED_OUTCOME;
	} finally {
		setFetching(router, match, false, owner);
	}
}
function settleInto(match, result, preload) {
	if (result[0] === REDIRECTED$1) return;
	match.status = "success";
	match.error = void 0;
	if (result[0] === SUCCESS$1) {
		match.loaderData = result[1];
		match.invalid = false;
		match.updatedAt = Date.now();
		match.preload = preload;
	} else match.invalid = true;
}
function cacheLoaderMatch(router, match, planned) {
	const current = router._cache.get(match.id);
	if (current !== planned || router._committed.some((candidate) => candidate.id === match.id && candidate._flight === match._flight)) return;
	const cached = {
		...match,
		_notFound: void 0,
		context: {}
	};
	if (cached._flight) cached._flight[2]++;
	router._cache.set(match.id, cached);
	if (current) releaseFlight(router, current);
}
function getParentSnapshot(match, outcome) {
	if (outcome[0] === ERROR$1 || outcome[0] === NOT_FOUND$1) return {
		...match,
		status: outcome[0] === ERROR$1 ? "error" : "notFound",
		error: outcome[1],
		_flight: void 0
	};
	return match;
}
function createLoaderTask$1(router, lane, index, tasks, semanticParent, options, retainedEnd) {
	const match = lane[1][index];
	const route = getRoute$1(router, match);
	const preload = !!options[3];
	const plannedCacheMatch = router._cache.get(match.id);
	let configured;
	let reload = false;
	let reloadFailure;
	try {
		if (match.status === "success") {
			configured = route.options.shouldReload;
			if (typeof configured === "function") configured = configured(getLoaderContext$1(router, lane, match, route, options[0], semanticParent, preload));
			if (options[0].signal.aborted) reloadFailure = CANCELED_OUTCOME;
		}
		if (!reloadFailure) {
			if (match.status !== "success") reload = true;
			else {
				const staleAge = preload || match.preload ? route.options.preloadStaleTime ?? router.options.defaultPreloadStaleTime ?? 3e4 : route.options.staleTime ?? router.options.defaultStaleTime ?? 0;
				reload = !!(match.invalid || configured || configured === void 0 && Date.now() - match.updatedAt >= staleAge && (options[5] || match.cause === "enter" || options[2].some((candidate) => candidate.routeId === match.routeId && candidate.id !== match.id)));
			}
		}
	} catch (cause) {
		match.invalid = true;
		releaseFlight(router, match);
		reloadFailure = normalizeLaneError(router, lane, route, cause, options);
	}
	const routeLoader = route.options.loader;
	const isLoaderFn = typeof routeLoader === "function";
	const loader = isLoaderFn ? routeLoader : routeLoader?.handler;
	const preloadable = !preload || route.options.preload !== false;
	let donor = preloadable && routeLoader && true ? router._flights?.get(match.id) : void 0;
	if (donor === match._flight || reloadFailure) donor = void 0;
	else if (donor && !reload && !preload && configured === void 0) reload = true;
	else if (!reload) donor = void 0;
	const background = !!(routeLoader && reload && match.status === "success" && !preload && !options[4] && ((isLoaderFn ? void 0 : routeLoader.staleReloadMode) ?? router.options.defaultStaleReloadMode) !== "blocking");
	const loaded = reload && preloadable;
	const blocking = loaded && !background && (match.status !== "success" || !!routeLoader);
	const onReady = index >= retainedEnd ? options[7] : void 0;
	const onLazyReady = route.lazyFn && route._lazy !== true ? onReady : void 0;
	if (loaded && !routeLoader) {
		match.invalid = false;
		match.updatedAt = Date.now();
	}
	if (donor) donor[2]++;
	if (blocking) {
		const acceptedFlight = match._flight;
		match._flight = donor;
		releaseOwnedFlight(router, match, acceptedFlight)?.abort();
		if (index >= retainedEnd) match.status = "pending";
		onReady?.();
	}
	if (!loaded) match.isFetching = false;
	const outcome = !reloadFailure && blocking ? loadResource(router, lane, match, route, loader, semanticParent, options).then((result) => {
		settleInto(match, result, preload);
		if (result[0] === SUCCESS$1) {
			if (routeLoader && !options[0].signal.aborted) cacheLoaderMatch(router, match, plannedCacheMatch);
			if (index >= retainedEnd) match.status = "pending";
		}
		return result;
	}) : Promise.resolve(reloadFailure ?? [SUCCESS$1, match.loaderData]);
	const chunkFailure = (async () => {
		try {
			const chunk = loadRouteChunk(route, void 0, onLazyReady);
			if (chunk) await waitFor$1(chunk, options[0].signal);
		} catch (cause) {
			if (!lane[1].some((candidate, candidateIndex) => candidateIndex <= index && (candidate.status === "error" || candidate.status === "notFound" || candidate._notFound))) return [index, normalizeLaneError(router, lane, route, cause, options)];
		}
		const result = await outcome;
		if (blocking && result[0] === SUCCESS$1 && match.status === "pending" && !options[0].signal.aborted) {
			match.status = "success";
			onReady?.();
		}
	})();
	tasks.push([
		index,
		outcome,
		chunkFailure
	]);
	if (!background) return outcome.then((result) => getParentSnapshot(match, result));
	const candidate = {
		...match,
		status: "pending",
		preload: false,
		_flight: donor
	};
	match.invalid = false;
	match.isFetching = "loader";
	const backgroundOutcome = loadResource(router, lane, candidate, route, loader, semanticParent, options).then((result) => {
		match.isFetching = false;
		settleInto(candidate, result, false);
		return result;
	});
	(lane[2] ??= []).push([
		index,
		backgroundOutcome,
		chunkFailure,
		candidate
	]);
	return backgroundOutcome.then((result) => getParentSnapshot(candidate, result));
}
async function getNotFoundBoundary$1(router, matches, indexed, signal, fallback = 0) {
	const cause = indexed?.[1][1];
	let index = cause?.routeId ? matches.findIndex((match) => match.routeId === cause.routeId) : indexed?.[0] ?? matches.length - 1;
	if (index < 0) index = 0;
	for (let i = index; i >= 0; i--) {
		const route = getRoute$1(router, matches[i]);
		try {
			const loading = loadRouteChunk(route, false);
			if (loading) await waitFor$1(loading, signal);
		} catch (cause) {
			if (cause === signal && signal.aborted) throw cause;
		}
		if (route.options.notFoundComponent) return i;
	}
	return cause?.routeId ? index : fallback;
}
function discardBackground(router, lane) {
	if (lane[2]) {
		transferMatchResources(router, lane[2].map((task) => task[3]));
		lane[2] = void 0;
	}
}
async function settleTasks(tasks, serialFailure, redirectTasks, gate) {
	let loaderFailure;
	try {
		await Promise.all(tasks.map((task) => task[1].then(async (outcome) => {
			const taskIndex = task[0];
			if (gate && taskIndex >= await gate) return;
			if (outcome[0] >= REDIRECTED$1) throw [taskIndex, outcome];
			if (!loaderFailure && outcome[0] !== SUCCESS$1) {
				loaderFailure = [taskIndex, outcome];
				await Promise.all((redirectTasks ?? []).map((nextTask) => {
					if (nextTask[0] <= taskIndex) return;
					return nextTask[1].then((nextOutcome) => {
						if (nextOutcome[0] === REDIRECTED$1) throw [nextTask[0], nextOutcome];
					});
				}));
			}
		})));
	} catch (cause) {
		return cause;
	}
	return serialFailure ?? loaderFailure;
}
function materializeRedirect$1(router, lane, route, outcome, options, failed) {
	while (outcome[0] === REDIRECTED$1) {
		const redirect = outcome[1];
		const redirectOptions = redirect.options;
		try {
			if (redirectOptions.href || redirect.headers.has("Location")) {
				router.resolveRedirect(redirect);
				if (redirectOptions.reloadDocument) return outcome;
			}
			if (redirectOptions.reloadDocument ? options[3] : options[1] >= 20) return outcome;
			const location = router.buildLocation({
				...redirectOptions,
				_fromLocation: lane[0],
				_includeValidateSearch: true
			});
			const publicLocation = location.maskedLocation ?? location;
			if (publicLocation.external) {
				const resolved = redirect.clone();
				resolved.options = { ...redirectOptions };
				resolved.headers.set("Location", publicLocation.publicHref);
				router.resolveRedirect(resolved);
				return options[3] ? [REDIRECTED$1, resolved] : [
					REDIRECTED$1,
					resolved,
					publicLocation
				];
			}
			return [
				REDIRECTED$1,
				redirect,
				location
			];
		} catch (cause) {
			outcome = failed ? [ERROR$1, cause] : normalizeError$1(route, cause);
			failed = true;
		}
	}
	return outcome;
}
async function reduceLane(router, lane, tasks, controller, settlement, onReady) {
	const matches = lane[1];
	let failure = await settlement;
	let redirectLimitExceeded = false;
	const plannedBoundary = matches.findIndex((match) => match._notFound);
	const boundaryOf = (found) => found[1][0] === NOT_FOUND$1 ? getNotFoundBoundary$1(router, matches, found, controller.signal) : found[0];
	let readinessEnd = plannedBoundary < 0 ? matches.length : plannedBoundary;
	if ((failure?.[1][0] ?? 0) >= REDIRECTED$1) readinessEnd = 0;
	else if (failure) {
		readinessEnd = failure[2] ??= await boundaryOf(failure);
		for (const task of tasks) {
			if (task[0] >= readinessEnd) break;
			const outcome = await task[1];
			if (outcome[0] !== SUCCESS$1 && outcome[0] < REDIRECTED$1 && !("loaderData" in matches[task[0]])) {
				failure = [task[0], outcome];
				readinessEnd = failure[2] = await boundaryOf(failure);
				break;
			}
		}
	}
	for (const task of tasks) {
		if (task[0] >= readinessEnd) break;
		const chunkFailure = await task[2];
		if (!chunkFailure) continue;
		failure = chunkFailure;
		break;
	}
	if ((failure?.[1][0] ?? 0) >= REDIRECTED$1) {
		const outcome = failure[1];
		if (outcome[0] !== REDIRECTED$1 || outcome[1].options.reloadDocument || outcome[2]) {
			discardBackground(router, lane);
			return outcome;
		}
		redirectLimitExceeded = true;
		failure = [0, [ERROR$1, /* @__PURE__ */ new Error("Too many redirects")]];
	}
	const boundary = failure ? failure[2] ?? await boundaryOf(failure) : plannedBoundary;
	if (boundary >= 0) {
		const outcome = failure?.[1];
		const kind = outcome?.[0];
		const match = matches[boundary];
		const cause = outcome?.[1];
		const install = () => {
			if (outcome) {
				match._notFound = void 0;
				if (kind === ERROR$1) match.status = "error";
				else {
					cause.routeId = match.routeId;
					if (match.routeId === router.routeTree.id) {
						match.status = "success";
						match._notFound = true;
					} else match.status = "notFound";
				}
				match.error = cause;
				match.isFetching = false;
			}
		};
		install();
		if (!outcome) onReady?.();
		const route = getRoute$1(router, match);
		try {
			await waitFor$1(outcome ? Promise.resolve().then(() => loadRouteChunk(route, kind === ERROR$1 ? "errorComponent" : "notFoundComponent")) : Promise.all([loadRouteChunk(route), loadRouteChunk(route, "notFoundComponent")]), controller.signal);
		} catch (cause) {
			if (cause === controller.signal && controller.signal.aborted) {
				discardBackground(router, lane);
				return CANCELED_OUTCOME;
			}
		}
		if (!outcome) match.status = "success";
		else if (redirectLimitExceeded) {
			controller.abort();
			await Promise.all([
				...tasks.map((task) => task[1]),
				...tasks.map((task) => task[2]),
				...(lane[2] ?? []).map((task) => task[1])
			]);
			discardBackground(router, lane);
			transferMatchResources(router, matches);
			install();
		}
	}
	return lane;
}
async function projectLane$1(router, lane, signal, start = 0, end = lane[1].length) {
	const matches = lane[1];
	for (let index = start; index < end; index++) {
		const match = matches[index];
		const routeOptions = getRoute$1(router, match).options;
		if (routeOptions.head || routeOptions.scripts) try {
			const context = {
				ssr: router.options.ssr,
				matches,
				match,
				params: match.params,
				loaderData: match.loaderData
			};
			const [head, scripts] = await waitFor$1(Promise.all([routeOptions.head?.(context), routeOptions.scripts?.(context)]), signal);
			match.meta = head?.meta;
			match.links = head?.links;
			match.headScripts = head?.scripts;
			match.styles = head?.styles;
			match.scripts = scripts;
		} catch (cause) {
			if (cause === signal && signal.aborted) break;
			console.error(cause);
		}
		if (match.status !== "success" || match._notFound) break;
	}
	return lane;
}
async function executeClientLane(router, location, matches, options) {
	const matched = [location, matches];
	const signal = options[0].signal;
	let reduced;
	try {
		const presented = router.stores.matches.get();
		let plannedBoundary = matches.findIndex((match) => match._notFound);
		if (router.options.notFoundMode !== "root" && plannedBoundary >= 0) {
			const boundary = await getNotFoundBoundary$1(router, matches, void 0, signal, plannedBoundary);
			matches[plannedBoundary]._notFound = void 0;
			matches[boundary]._notFound = true;
			plannedBoundary = boundary;
		}
		let end = plannedBoundary < 0 ? matches.length : plannedBoundary + 1;
		let retainedEnd = 0;
		while (retainedEnd < end && retainedEnd !== plannedBoundary) {
			const match = matches[retainedEnd];
			const committed = options[2][retainedEnd];
			const visible = presented[retainedEnd];
			if (committed?.id !== match.id || committed.status !== "success" || match.preload || visible?.id !== match.id || visible.status !== "success") break;
			retainedEnd++;
			if (committed._notFound || visible._notFound) break;
		}
		const tasks = [];
		const start = options[6] ?? 0;
		let semanticParent = start ? Promise.resolve(matches[start - 1]) : void 0;
		const planSuccessfulLane = () => {
			for (let index = start; index < end; index++) {
				if (signal.aborted) break;
				semanticParent = createLoaderTask$1(router, matched, index, tasks, semanticParent, options, retainedEnd);
			}
		};
		const failure = await contextualize$1(router, matched, options, end, planSuccessfulLane, retainedEnd);
		if (failure) {
			options[4] = true;
			end = failure[0];
			if (failure[1][0] === NOT_FOUND$1) {
				const boundary = await getNotFoundBoundary$1(router, matches, failure, signal);
				failure[2] = boundary;
				end = Math.min(end, boundary + 1);
			} else if (failure[1][0] >= REDIRECTED$1) end = 0;
			planSuccessfulLane();
		}
		if (!signal.aborted && !options[3]) {
			const abort = [];
			for (const [id, flight] of router._flights ?? []) if (!flight[2]) {
				router._flights.delete(id);
				abort.push(flight[1]);
			}
			for (const controller of abort) controller.abort();
		}
		const reduction = reduceLane(router, matched, tasks, options[0], settleTasks(tasks, failure, matched[2]), options[7]);
		if (matched[2]?.length) matched[3] = settleTasks(matched[2], void 0, void 0, reduction.then((foreground) => isControl(foreground) ? 0 : _getRenderedMatches(matches).length, () => 0));
		reduced = await reduction;
	} catch (cause) {
		discardBackground(router, matched);
		if (cause === signal && signal.aborted) return CANCELED_OUTCOME;
		throw cause;
	}
	if (isControl(reduced)) return reduced;
	return projectLane$1(router, reduced, signal, options[6] === matches.length ? options[6] : 0);
}
async function preloadClientRoute(router, opts) {
	let location = router.buildLocation(opts);
	for (let redirects = 0;; redirects++) {
		const base = router._committed;
		const controller = new AbortController();
		let matches;
		let active;
		let result;
		try {
			try {
				matches = router.matchRoutes(location, { _controller: controller });
				acquireMatchResources(matches);
				active = (router._preloads ??= /* @__PURE__ */ new Map()).set(controller, matches);
				result = await executeClientLane(router, location, matches, [
					controller,
					redirects,
					base,
					true
				]);
			} finally {
				if (active) {
					active = active.delete(controller);
					transferMatchResources(router, matches);
				}
				controller.abort();
			}
			if (!isControl(result)) return result[1];
			if (!active || result.length < 3 || false) return;
			location = result[2];
		} catch (cause) {
			if (!isNotFound(cause)) console.error(cause);
			return;
		}
	}
}
// node_modules/@tanstack/router-core/dist/esm/await-signal.js
function observeLate(callback, value) {
	if (!callback) return;
	try {
		const result = callback(value);
		if (result !== void 0) Promise.resolve(result).catch(() => {});
	} catch {}
}
/**
* Await `value` unless `signal` aborts first. A result that settles after the
* abort is passed to `onLate` / `onLateError` instead.
*
* One abort listener per wait: SSR requests nest at most a few waits on one
* signal, so pooling them was measurably slower than this.
*/
function waitForReason(value, signal, onLate, onLateError) {
	const promise = Promise.resolve(value);
	if (signal.aborted) {
		promise.then((result) => observeLate(onLate, result), (error) => observeLate(onLateError, error));
		return Promise.reject(signal.reason);
	}
	return new Promise((resolve, reject) => {
		const abort = () => reject(signal.reason);
		signal.addEventListener("abort", abort, { once: true });
		promise.then((result) => {
			signal.removeEventListener("abort", abort);
			if (signal.aborted) observeLate(onLate, result);
			else resolve(result);
		}, (error) => {
			signal.removeEventListener("abort", abort);
			if (signal.aborted) observeLate(onLateError, error);
			else reject(error);
		});
	});
}
// node_modules/@tanstack/router-core/dist/esm/load-server.js
var SUCCESS = 0;
var ERROR = 1;
var NOT_FOUND = 2;
var REDIRECTED = 3;
var SKIPPED = 4;
var MATCH_SETTLED_ABORT_REASON = Object.freeze({
	name: "AbortError",
	message: "TanStack Router aborted this server match because it settled."
});
var REDIRECT_ABORT_REASON = Object.freeze({
	name: "AbortError",
	message: "TanStack Router aborted this server match because of a redirect."
});
function getRoute(router, match) {
	return router.routesById[match.routeId];
}
function normalize(value, rejected) {
	if (isRedirect(value)) return [REDIRECTED, value];
	if (isNotFound(value)) return [NOT_FOUND, value];
	if (rejected && typeof value?.then === "function") value = new Error("A Promise was thrown", { cause: value });
	return rejected ? [ERROR, value] : [SUCCESS, value];
}
function normalizeError(router, lane, route, cause, signal, notify = true) {
	signal?.throwIfAborted();
	let outcome = normalize(cause, true);
	if (outcome[0] !== ERROR) return materializeRedirect(router, lane, route, outcome, signal, notify);
	try {
		route.options.onError?.(outcome[1]);
	} catch (onErrorCause) {
		outcome = normalize(onErrorCause, true);
	}
	signal?.throwIfAborted();
	return materializeRedirect(router, lane, route, outcome, signal, notify);
}
function materializeRedirect(router, lane, route, outcome, signal, notify = true) {
	if (outcome[0] !== REDIRECTED) return outcome;
	signal?.throwIfAborted();
	try {
		outcome[1].options._fromLocation = lane.location;
		router.resolveRedirect(outcome[1]);
		signal?.throwIfAborted();
		return outcome;
	} catch (cause) {
		signal?.throwIfAborted();
		return notify ? normalizeError(router, lane, route, cause, signal, false) : [ERROR, cause];
	}
}
function maybe(value, cause) {
	if (cause !== void 0) return {
		status: "error",
		error: cause
	};
	return {
		status: "success",
		value
	};
}
function navigateFrom(router, location) {
	return (options) => router.navigate({
		...options,
		_fromLocation: location
	});
}
function waitFor(value, signal) {
	return signal ? waitForReason(value, signal) : value;
}
function resolveSsr(router, lane, index) {
	const match = lane.matches[index];
	const route = getRoute(router, match);
	const parentSsr = lane.matches[index - 1]?.ssr;
	if (router.isShell()) return route.id === rootRouteId;
	if (parentSsr === false) return false;
	const inherit = (value) => {
		return value === true && parentSsr === "data-only" ? "data-only" : value;
	};
	const defaultSsr = router.options.defaultSsr ?? true;
	const inheritedDefault = inherit(defaultSsr);
	match.ssr = inheritedDefault;
	const option = route.options.ssr;
	if (option === void 0) return inheritedDefault;
	if (typeof option !== "function") return inherit(option);
	const context = {
		search: maybe(match.search, match.searchError),
		params: maybe(match.params, match.paramsError),
		location: lane.location,
		matches: lane.matches.map((candidate) => ({
			index: candidate.index,
			pathname: candidate.pathname,
			fullPath: candidate.fullPath,
			staticData: candidate.staticData,
			id: candidate.id,
			routeId: candidate.routeId,
			search: maybe(candidate.search, candidate.searchError),
			params: maybe(candidate.params, candidate.paramsError),
			ssr: candidate.ssr
		}))
	};
	try {
		return Promise.resolve(option(context)).then((value) => inherit(value ?? defaultSsr));
	} catch (cause) {
		return Promise.reject(cause);
	}
}
function stampNotFound(match, outcome) {
	if (outcome[0] === NOT_FOUND && !outcome[1].routeId) outcome[1].routeId = match.routeId;
	return outcome;
}
async function contextualize(router, lane, signal) {
	const globalBoundary = lane.matches.findIndex((match) => match._notFound);
	let end = globalBoundary < 0 ? lane.matches.length : globalBoundary + 1;
	let failure;
	let parentContext = { ...router.options.context ?? {} };
	for (let index = 0; index < end; index++) {
		const match = lane.matches[index];
		const route = getRoute(router, match);
		try {
			const ssr = resolveSsr(router, lane, index);
			match.ssr = ssr instanceof Promise ? await ssr : ssr;
		} catch (cause) {
			signal?.throwIfAborted();
			failure = [index, stampNotFound(match, normalizeError(router, lane, route, cause, signal))];
			end = index;
		}
		signal?.throwIfAborted();
		if (failure?.[1][0] === REDIRECTED) break;
		match.__beforeLoadContext = void 0;
		let context = parentContext;
		try {
			let routeContext;
			if (route.options.context) {
				const routeContextOptions = {
					deps: match.loaderDeps,
					params: match.params,
					context: parentContext,
					location: lane.location,
					navigate: navigateFrom(router, lane.location),
					buildLocation: router.buildLocation,
					cause: match.cause,
					abortController: match.abortController,
					preload: false,
					matches: lane.matches,
					routeId: route.id
				};
				routeContext = route.options.context(routeContextOptions) ?? void 0;
			}
			context = {
				...parentContext,
				...routeContext
			};
			match.context = context;
		} catch (cause) {
			signal?.throwIfAborted();
			if (!failure) failure = [index, stampNotFound(match, normalizeError(router, lane, route, cause, signal))];
			end = index;
			break;
		}
		signal?.throwIfAborted();
		if (failure) break;
		const validationError = match.paramsError ?? match.searchError;
		if (validationError !== void 0) {
			failure = [index, stampNotFound(match, normalizeError(router, lane, route, validationError, signal))];
			end = index;
			break;
		}
		signal?.throwIfAborted();
		if (match.ssr === false || !route.options.beforeLoad) {
			parentContext = context;
			continue;
		}
		const abortController = match.abortController;
		const options = {
			search: match.search,
			abortController,
			params: match.params,
			preload: false,
			context,
			location: lane.location,
			navigate: navigateFrom(router, lane.location),
			buildLocation: router.buildLocation,
			cause: match.cause,
			matches: lane.matches,
			routeId: route.id,
			...router.options.additionalContext
		};
		try {
			const beforeLoadContext = await route.options.beforeLoad(options);
			signal?.throwIfAborted();
			const outcome = stampNotFound(match, materializeRedirect(router, lane, route, normalize(beforeLoadContext, false), signal));
			if (outcome[0] !== SUCCESS) {
				failure = [index, outcome];
				end = index;
				break;
			}
			match.__beforeLoadContext = beforeLoadContext;
			match.context = {
				...context,
				...beforeLoadContext
			};
			parentContext = match.context;
		} catch (cause) {
			signal?.throwIfAborted();
			failure = [index, stampNotFound(match, normalizeError(router, lane, route, cause, signal))];
			end = index;
			break;
		}
	}
	return {
		location: lane.location,
		matches: lane.matches,
		end,
		failure
	};
}
function getLoaderContext(router, lane, match, route, index, tasks) {
	return {
		params: match.params,
		deps: match.loaderDeps,
		preload: false,
		parentMatchPromise: tasks[index - 1]?.match,
		abortController: match.abortController,
		context: match.context,
		location: lane.location,
		navigate: navigateFrom(router, lane.location),
		cause: match.cause,
		route,
		...router.options.additionalContext
	};
}
function createLoaderTask(router, lane, index, tasks, signal) {
	const match = lane.matches[index];
	const route = getRoute(router, match);
	let outcome;
	if (match.ssr === false) outcome = Promise.resolve([SKIPPED]);
	else {
		const routeLoader = route.options.loader;
		const loader = typeof routeLoader === "function" ? routeLoader : routeLoader?.handler;
		if (!loader) outcome = Promise.resolve([SUCCESS, void 0]);
		else outcome = Promise.resolve().then(() => loader(getLoaderContext(router, lane, match, route, index, tasks))).then((result) => normalize(result, false), (cause) => normalize(cause, true)).then((result) => {
			if (signal?.aborted || match.abortController.signal.reason === REDIRECT_ABORT_REASON) return [SKIPPED];
			if (result[0] === ERROR) result = normalizeError(router, lane, route, result[1], signal);
			else result = materializeRedirect(router, lane, route, result, signal);
			return stampNotFound(match, result);
		});
	}
	const parentMatch = outcome.then((result) => {
		const snapshot = { ...match };
		if (result[0] === SUCCESS) {
			snapshot.loaderData = result[1];
			snapshot.status = "success";
			snapshot.error = void 0;
			snapshot.invalid = false;
			snapshot.isFetching = false;
		} else if (result[0] === ERROR) {
			snapshot.status = "error";
			snapshot.error = result[1];
		} else if (result[0] === NOT_FOUND) {
			snapshot.status = "notFound";
			snapshot.error = result[1];
		}
		return snapshot;
	});
	return {
		index,
		outcome,
		match: parentMatch
	};
}
async function getNotFoundBoundary(router, matches, indexed, signal, fallback = 0) {
	const cause = indexed?.[1][1];
	let index = cause?.routeId ? matches.findIndex((match) => match.routeId === cause.routeId) : indexed?.[0] ?? matches.length - 1;
	if (index < 0) index = 0;
	for (let candidate = index; candidate >= 0; candidate--) {
		const route = getRoute(router, matches[candidate]);
		try {
			const loading = loadRouteChunk(route, false);
			if (loading) await loading;
		} catch {
			signal?.throwIfAborted();
		}
		signal?.throwIfAborted();
		if (route.options.notFoundComponent) return candidate;
	}
	return cause?.routeId ? index : fallback;
}
function abortMatches(matches, start = 0, reason = MATCH_SETTLED_ABORT_REASON) {
	for (let index = start; index < matches.length; index++) matches[index].abortController.abort(reason);
}
async function applyFailure(router, lane, indexed, signal) {
	if (!indexed) {
		const boundary = lane.matches.findIndex((match) => match._notFound);
		if (boundary >= 0) {
			abortMatches(lane.matches, boundary + 1);
			return {
				status: 404,
				boundary,
				kind: NOT_FOUND
			};
		}
		return { status: 200 };
	}
	const [index, outcome] = indexed;
	if (outcome[0] === ERROR) {
		const match = lane.matches[index];
		match._notFound = void 0;
		match.status = "error";
		match.error = outcome[1];
		match.isFetching = false;
		abortMatches(lane.matches, index + 1);
		return {
			status: 500,
			boundary: index,
			kind: ERROR
		};
	}
	const boundary = indexed[2] ?? await getNotFoundBoundary(router, lane.matches, indexed, signal);
	const match = lane.matches[boundary];
	const cause = outcome[1];
	cause.routeId = match.routeId;
	match._notFound = void 0;
	if (match.routeId === router.routeTree.id) {
		match.status = "success";
		match._notFound = true;
		match.error = cause;
	} else {
		match.status = "notFound";
		match.error = cause;
	}
	match.isFetching = false;
	abortMatches(lane.matches, boundary + 1);
	return {
		status: 404,
		boundary,
		kind: NOT_FOUND
	};
}
async function loadNormalChunks(router, lane, end, signal) {
	const chunks = [];
	for (let index = 0; index < lane.matches.length; index++) {
		const match = lane.matches[index];
		if (index >= end || match.ssr !== true || match.status !== "success") continue;
		const route = getRoute(router, match);
		try {
			const loading = loadRouteChunk(route);
			if (loading) {
				const chunk = loading.then(() => {
					signal?.throwIfAborted();
				}, (cause) => {
					signal?.throwIfAborted();
					return [index, stampNotFound(match, normalizeError(router, lane, route, cause, signal))];
				});
				chunk.catch(() => {});
				chunks.push(chunk);
			}
		} catch (cause) {
			signal?.throwIfAborted();
			chunks.push([index, stampNotFound(match, normalizeError(router, lane, route, cause, signal))]);
		}
	}
	for (const chunk of chunks) {
		const indexed = Array.isArray(chunk) ? chunk : await chunk;
		if (indexed) return indexed;
	}
}
async function projectLane(router, lane, signal) {
	for (const match of lane.matches) {
		const routeOptions = getRoute(router, match).options;
		if (routeOptions.head || routeOptions.scripts || routeOptions.headers) {
			const context = {
				ssr: router.options.ssr,
				matches: lane.matches,
				match,
				params: match.params,
				loaderData: match.loaderData
			};
			try {
				const [head, scripts, headers] = await Promise.all([
					routeOptions.head?.(context),
					routeOptions.scripts?.(context),
					routeOptions.headers?.(context)
				]);
				signal?.throwIfAborted();
				match.meta = head?.meta;
				match.links = head?.links;
				match.headScripts = head?.scripts;
				match.styles = head?.styles;
				match.scripts = scripts;
				match.headers = headers;
			} catch (cause) {
				signal?.throwIfAborted();
				console.error(cause);
			}
		}
		if (match.ssr === false || match.status !== "success" || match._notFound) break;
	}
}
async function executeServerLane(router, location, matchedMatches, signal) {
	const matched = {
		location,
		matches: matchedMatches.map((match) => ({
			...match,
			__beforeLoadContext: void 0,
			context: {},
			isFetching: false,
			abortController: new AbortController()
		}))
	};
	const abortLane = () => abortMatches(matched.matches, 0, signal?.reason ?? MATCH_SETTLED_ABORT_REASON);
	if (signal?.aborted) {
		abortLane();
		signal.throwIfAborted();
	}
	signal?.addEventListener("abort", abortLane, { once: true });
	try {
		const plannedGlobalBoundary = matched.matches.findIndex((match) => match._notFound);
		if (router.options.notFoundMode !== "root" && plannedGlobalBoundary >= 0) {
			const boundary = await getNotFoundBoundary(router, matched.matches, void 0, signal, plannedGlobalBoundary);
			if (boundary !== plannedGlobalBoundary) {
				matched.matches[plannedGlobalBoundary]._notFound = void 0;
				matched.matches[boundary]._notFound = true;
			}
		}
		const lane = await contextualize(router, matched, signal);
		signal?.throwIfAborted();
		let loaderEnd = lane.end;
		if (lane.failure?.[1][0] === REDIRECTED) loaderEnd = 0;
		else if (lane.failure?.[1][0] === NOT_FOUND) {
			lane.failure[2] = await getNotFoundBoundary(router, lane.matches, lane.failure, signal);
			loaderEnd = Math.min(loaderEnd, lane.failure[2] + 1);
		}
		const tasks = [];
		for (let index = 0; index < loaderEnd; index++) {
			const task = createLoaderTask(router, lane, index, tasks, signal);
			tasks.push(task);
		}
		let loaderFailure;
		let control = lane.failure?.[1][0] === REDIRECTED ? lane.failure : void 0;
		try {
			await Promise.all(tasks.map((task) => task.outcome.then((loadedOutcome) => {
				const match = lane.matches[task.index];
				const outcome = loadedOutcome;
				if (outcome[0] === SUCCESS) {
					match.loaderData = outcome[1];
					match.status = "success";
					match.error = void 0;
					match.invalid = false;
					match.isFetching = false;
					match.updatedAt = Date.now();
				} else if (outcome[0] === REDIRECTED) {
					control = [task.index, outcome];
					throw control;
				} else {
					if (match.ssr !== false) {
						match.status = "success";
						match.error = void 0;
						match.invalid = true;
						match.isFetching = false;
					}
					if (!loaderFailure && outcome[0] !== SKIPPED) loaderFailure = [task.index, outcome];
				}
			})));
		} catch (cause) {
			if (!Array.isArray(cause)) throw cause;
			control = cause;
		}
		signal?.throwIfAborted();
		if (control?.[1][0] === REDIRECTED) {
			abortMatches(lane.matches, 0, REDIRECT_ABORT_REASON);
			return {
				type: "redirect",
				redirect: control[1][1]
			};
		}
		let failure = lane.failure ?? loaderFailure;
		const plannedBoundary = lane.matches.findIndex((match) => match._notFound);
		let readinessEnd;
		if (failure) {
			const outcomeEnd = failure[2] ??= failure[1][0] === NOT_FOUND ? await getNotFoundBoundary(router, lane.matches, failure, signal) : failure[0];
			for (const task of tasks) {
				if (task.index >= outcomeEnd) break;
				const outcome = await task.outcome;
				if (outcome[0] !== SUCCESS && outcome[0] < REDIRECTED && !("loaderData" in lane.matches[task.index])) {
					failure = [task.index, outcome];
					failure[2] = outcome[0] === NOT_FOUND ? await getNotFoundBoundary(router, lane.matches, failure, signal) : task.index;
					break;
				}
			}
			readinessEnd = failure[2];
		} else readinessEnd = plannedBoundary < 0 ? lane.matches.length : plannedBoundary;
		const requiredFailure = await loadNormalChunks(router, lane, readinessEnd, signal);
		signal?.throwIfAborted();
		if (requiredFailure) {
			if (requiredFailure[1][0] === REDIRECTED) {
				abortMatches(lane.matches, 0, REDIRECT_ABORT_REASON);
				return {
					type: "redirect",
					redirect: requiredFailure[1][1]
				};
			}
			failure = requiredFailure;
		}
		const terminal = await applyFailure(router, lane, failure, signal);
		if (terminal.boundary !== void 0) {
			const match = lane.matches[terminal.boundary];
			if (match.ssr === true) {
				const route = getRoute(router, match);
				try {
					if (terminal.kind === ERROR) await loadRouteChunk(route, "errorComponent");
					else if (match._notFound) await Promise.all([loadRouteChunk(route), loadRouteChunk(route, "notFoundComponent")]);
					else await loadRouteChunk(route, "notFoundComponent");
				} catch {}
				signal?.throwIfAborted();
			}
		}
		signal?.throwIfAborted();
		await projectLane(router, {
			location: lane.location,
			matches: lane.matches
		}, signal);
		signal?.throwIfAborted();
		router.serverSsr?.onCleanup((settled) => {
			if (!settled) abortLane();
		});
		return {
			type: "render",
			status: terminal.status,
			matches: lane.matches
		};
	} finally {
		signal?.removeEventListener("abort", abortLane);
	}
}
async function loadServerRoute(router, opts) {
	if (!opts?._skipLocationUpdate) router.updateLatestLocation();
	const next = router.latestLocation;
	const previous = router._committed;
	const previousEnd = router._lifecycleEnd;
	let result;
	try {
		const canonical = router.buildLocation({
			to: next.pathname,
			search: true,
			params: true,
			hash: true,
			state: true,
			_includeValidateSearch: true
		});
		if (next.publicHref !== canonical.publicHref) throw redirect({ href: canonical.publicHref || "/" });
		const changeInfo = getLocationChangeInfo(next, router.stores.resolvedLocation.get());
		router.emit({
			type: "onBeforeNavigate",
			...changeInfo
		});
		router.emit({
			type: "onBeforeLoad",
			...changeInfo
		});
		opts?._signal?.throwIfAborted();
		result = await waitFor(executeServerLane(router, next, router.matchRoutes(next), opts?._signal), opts?._signal);
		opts?._signal?.throwIfAborted();
	} catch (cause) {
		opts?._signal?.throwIfAborted();
		if (!isRedirect(cause)) throw cause;
		cause.options._fromLocation = next;
		result = {
			type: "redirect",
			redirect: router.resolveRedirect(cause)
		};
	}
	router._serverResult = result;
	let nextEnd = 0;
	router.batch(() => {
		router.stores.location.set(next);
		router.stores.status.set("idle");
		if (result.type === "render") {
			router._committed = result.matches;
			nextEnd = router._lifecycleEnd = lifecycleEnd(result.matches);
			router.stores.setMatches(result.matches);
			router.stores.resolvedLocation.set(next);
		}
	});
	if (result.type === "render") runRouteLifecycle(router, previous, result.matches, previousEnd, nextEnd);
	router._commitPromise?.resolve();
	router._commitPromise = void 0;
}
// node_modules/@tanstack/react-router/dist/esm/utils.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* React.use if available (React 19+), undefined otherwise.
* Use dynamic lookup to avoid Webpack compilation errors with React 18.
*/
var reactUse = import_react["use"];
var useLayoutEffect = import_react.useEffect;
// node_modules/@tanstack/router-core/dist/esm/manifest.js
function getAssetCrossOrigin(assetCrossOrigin, kind) {
	if (!assetCrossOrigin) return;
	if (typeof assetCrossOrigin === "string") return assetCrossOrigin;
	return assetCrossOrigin[kind];
}
function getManifestScriptFormat(manifest) {
	return manifest?.scriptFormat ?? "module";
}
function getScriptPreloadAttrs(manifest, link, assetCrossOrigin) {
	const preloadLink = resolveManifestAssetLink(link);
	const crossOrigin = getAssetCrossOrigin(assetCrossOrigin, "script") ?? preloadLink.crossOrigin;
	return {
		...getManifestScriptFormat(manifest) === "iife" ? {
			rel: "preload",
			as: "script"
		} : { rel: "modulepreload" },
		href: preloadLink.href,
		fetchPriority: "low",
		...crossOrigin ? { crossOrigin } : {}
	};
}
function resolveManifestAssetLink(link) {
	if (typeof link === "string") return {
		href: link,
		crossOrigin: void 0
	};
	return link;
}
function appendUniqueUserTags(target, tags) {
	if (tags.length === 0) return;
	if (tags.length === 1) {
		target.push(tags[0]);
		return;
	}
	const seen = /* @__PURE__ */ new Set();
	for (const tag of tags) {
		const key = JSON.stringify(tag);
		if (seen.has(key)) continue;
		seen.add(key);
		target.push(tag);
	}
}
function getStylesheetHref(asset) {
	return resolveManifestCssLink(asset).href;
}
function resolveManifestCssLink(link) {
	if (typeof link === "string") return {
		href: link,
		crossOrigin: void 0
	};
	return link;
}
function createInlineCssStyleAsset(css) {
	return {
		attrs: { suppressHydrationWarning: true },
		children: css
	};
}
function createInlineCssPlaceholderAsset() {
	return { attrs: { suppressHydrationWarning: true } };
}
// node_modules/@tanstack/router-core/dist/esm/ssr/bodyScripts.js
function getSsrBodyScriptParts(matches, manifest, nonce, routeScriptAttrs) {
	const assetMatches = _getAssetMatches(matches);
	const routeScripts = [];
	const manifestScripts = [];
	for (const match of assetMatches) for (const script of Array.isArray(match.scripts) ? match.scripts : []) {
		if (!script) continue;
		const { children, ...attrs } = script;
		routeScripts.push({
			tag: "script",
			attrs: {
				...attrs,
				...routeScriptAttrs,
				nonce
			},
			children
		});
	}
	if (manifest) for (const match of assetMatches) for (const asset of manifest.routes[match.routeId]?.scripts ?? []) manifestScripts.push({
		tag: "script",
		attrs: {
			...asset.attrs,
			nonce
		},
		children: asset.children
	});
	return [routeScripts, manifestScripts];
}
function composeSsrBodyScripts([routeScripts, manifestScripts], initialHydrationScripts) {
	if (!initialHydrationScripts) return [...routeScripts, ...manifestScripts];
	return [
		...initialHydrationScripts.before,
		...routeScripts,
		...manifestScripts,
		initialHydrationScripts.boundary
	];
}
// node_modules/@tanstack/router-core/dist/esm/route.js
var BaseRoute = class {
	get to() {
		return this._to;
	}
	get id() {
		return this._id;
	}
	get path() {
		return this._path;
	}
	get fullPath() {
		return this._fullPath;
	}
	constructor(options) {
		this.init = (originalIndex) => {
			this.originalIndex = originalIndex;
			this._branch = void 0;
			const options = this.options;
			const isRoot = !options?.path && !options?.id;
			this.parentRoute = this.options.getParentRoute?.();
			if (isRoot) this._path = rootRouteId;
			else if (!this.parentRoute) invariant();
			let path = isRoot ? rootRouteId : options?.path;
			if (path && path !== "/") path = trimPathLeft(path);
			const customId = options?.id || path;
			const id = isRoot ? rootRouteId : cleanPath((this.parentRoute.id === "__root__" ? "" : this.parentRoute.id) + "/" + (customId ?? ""));
			if (path === "__root__") path = "/";
			const fullPath = id === "__root__" ? "/" : path === void 0 ? this.parentRoute.fullPath : cleanPath(this.parentRoute.fullPath + "/" + path);
			this._path = path;
			this._id = id;
			this._fullPath = fullPath;
			this._to = trimPathRight(fullPath);
		};
		this.addChildren = (children) => {
			return this._addFileChildren(children);
		};
		this._addFileChildren = (children) => {
			if (Array.isArray(children)) this.children = children;
			if (typeof children === "object" && children !== null) this.children = Object.values(children);
			return this;
		};
		this._addFileTypes = () => {
			return this;
		};
		this.updateLoader = (options) => {
			Object.assign(this.options, options);
			return this;
		};
		this.update = (options) => {
			Object.assign(this.options, options);
			return this;
		};
		this.lazy = (lazyFn) => {
			this.lazyFn = lazyFn;
			return this;
		};
		this.redirect = (opts) => redirect({
			from: this.fullPath,
			...opts
		});
		this.options = options || {};
		this.isRoot = !options?.getParentRoute;
		if (options?.id && options?.path) throw new Error(`Route cannot have both an 'id' and a 'path' option.`);
	}
};
var BaseRootRoute = class extends BaseRoute {
	constructor(options) {
		super(options);
	}
};
// node_modules/seroval/dist/index.js
var import_jsx_runtime = require_jsx_runtime();
var SYM_ASYNC_ITERATOR = Symbol.asyncIterator;
var SYM_HAS_INSTANCE = Symbol.hasInstance;
var SYM_IS_CONCAT_SPREADABLE = Symbol.isConcatSpreadable;
var SYM_ITERATOR = Symbol.iterator;
var SYM_MATCH = Symbol.match;
var SYM_MATCH_ALL = Symbol.matchAll;
var SYM_REPLACE = Symbol.replace;
var SYM_SEARCH = Symbol.search;
var SYM_SPECIES = Symbol.species;
var SYM_SPLIT = Symbol.split;
var SYM_TO_PRIMITIVE = Symbol.toPrimitive;
var SYM_TO_STRING_TAG = Symbol.toStringTag;
var SYM_UNSCOPABLES = Symbol.unscopables;
var TEMPORAL_TYPE_NAME = {
	[0]: "Instant",
	[1]: "Duration",
	[2]: "PlainDate",
	[3]: "PlainDateTime",
	[4]: "PlainMonthDay",
	[5]: "PlainTime",
	[6]: "PlainYearMonth",
	[7]: "ZonedDateTime"
};
var SYMBOL_REF = {
	[0]: SYM_ASYNC_ITERATOR,
	[1]: SYM_HAS_INSTANCE,
	[2]: SYM_IS_CONCAT_SPREADABLE,
	[3]: SYM_ITERATOR,
	[4]: SYM_MATCH,
	[5]: SYM_MATCH_ALL,
	[6]: SYM_REPLACE,
	[7]: SYM_SEARCH,
	[8]: SYM_SPECIES,
	[9]: SYM_SPLIT,
	[10]: SYM_TO_PRIMITIVE,
	[11]: SYM_TO_STRING_TAG,
	[12]: SYM_UNSCOPABLES
};
function createSymbolStringTable() {
	const result = {};
	for (let i = 0; i <= 12; i++) result[i] = SYMBOL_REF[i].description;
	return result;
}
var SYMBOL_STRING = /* @__PURE__ */ createSymbolStringTable();
function createInverseSymbolTable() {
	const result = {};
	for (let i = 0; i <= 12; i++) result[SYMBOL_REF[i]] = i;
	return result;
}
var INV_SYMBOL_REF = /* @__PURE__ */ createInverseSymbolTable();
var CONSTANT_STRING = {
	[2]: "!0",
	[3]: "!1",
	[1]: "void 0",
	[0]: "null",
	[4]: "-0",
	[5]: "1/0",
	[6]: "-1/0",
	[7]: "0/0"
};
var CONSTANT_VAL = {
	[2]: true,
	[3]: false,
	[1]: void 0,
	[0]: null,
	[4]: -0,
	[5]: Infinity,
	[6]: -Infinity,
	[7]: NaN
};
var ERROR_CONSTRUCTOR = {
	[0]: Error,
	[1]: EvalError,
	[2]: RangeError,
	[3]: ReferenceError,
	[4]: SyntaxError,
	[5]: TypeError,
	[6]: URIError
};
function createErrorConstructorStringTable() {
	const result = {};
	for (let i = 0; i <= 6; i++) result[i] = ERROR_CONSTRUCTOR[i].name;
	return result;
}
var ERROR_CONSTRUCTOR_STRING = /* @__PURE__ */ createErrorConstructorStringTable();
function createSerovalNode(t, i, s, c, m, p, e, a, f, b, o, l) {
	if (c === void 0 && m === void 0 && p === void 0 && e === void 0 && a === void 0 && f === void 0 && b === void 0 && o === void 0 && l === void 0) return {
		t,
		i,
		s
	};
	return {
		t,
		i,
		s,
		c,
		m,
		p,
		e,
		a,
		f,
		b,
		o,
		l
	};
}
function createConstantNode(value) {
	return createSerovalNode(2, void 0, value);
}
var TRUE_NODE = /* @__PURE__ */ createConstantNode(2);
var FALSE_NODE = /* @__PURE__ */ createConstantNode(3);
var UNDEFINED_NODE = /* @__PURE__ */ createConstantNode(1);
var NULL_NODE = /* @__PURE__ */ createConstantNode(0);
var NEG_ZERO_NODE = /* @__PURE__ */ createConstantNode(4);
var INFINITY_NODE = /* @__PURE__ */ createConstantNode(5);
var NEG_INFINITY_NODE = /* @__PURE__ */ createConstantNode(6);
var NAN_NODE = /* @__PURE__ */ createConstantNode(7);
var MIN_JSON_STRINGIFY_LENGTH = 64;
var NEEDS_ESCAPE = /["\\\n\r\b\t\f<\u2028\u2029]/;
var JSON_ESCAPE_DIFFERENCES = /[\x00-\x07\x0b\x0e-\x1f\ud800-\udfff]/;
var LESS_THAN = /</g;
var LINE_SEPARATOR = /\u2028/g;
var PARAGRAPH_SEPARATOR = /\u2029/g;
function escapeCharCode(code) {
	switch (code) {
		case 34: return "\\\"";
		case 92: return "\\\\";
		case 10: return "\\n";
		case 13: return "\\r";
		case 8: return "\\b";
		case 9: return "\\t";
		case 12: return "\\f";
		case 60: return "\\x3C";
		case 8232: return "\\u2028";
		case 8233: return "\\u2029";
		default: return;
	}
}
function serializeString(str) {
	if (!NEEDS_ESCAPE.test(str)) return str;
	if (str.length >= MIN_JSON_STRINGIFY_LENGTH && !JSON_ESCAPE_DIFFERENCES.test(str)) {
		let result = JSON.stringify(str).slice(1, -1);
		if (result.includes("<")) result = result.replace(LESS_THAN, "\\x3C");
		if (result.includes("\u2028")) result = result.replace(LINE_SEPARATOR, "\\u2028");
		if (result.includes("\u2029")) result = result.replace(PARAGRAPH_SEPARATOR, "\\u2029");
		return result;
	}
	let result = "";
	let lastPos = 0;
	let replacement;
	for (let i = 0, len = str.length; i < len; i++) {
		replacement = escapeCharCode(str.charCodeAt(i));
		if (replacement) {
			result += str.slice(lastPos, i) + replacement;
			lastPos = i + 1;
		}
	}
	return result + str.slice(lastPos);
}
var JSON_COMPATIBLE = /^(?:[^"\\\x00-\x1f]|\\["\\nrbtf])*$/;
var ESCAPE_SEQUENCE = /(\\\\|\\"|\\n|\\r|\\b|\\t|\\f|\\u2028|\\u2029|\\x3C)/g;
function deserializeString(str) {
	if (typeof str !== "string") return str.replace(ESCAPE_SEQUENCE, deserializeString);
	let index = str.indexOf("\\");
	if (index === -1) return str;
	if (JSON_COMPATIBLE.test(str)) return JSON.parse("\"" + str + "\"");
	let result = "";
	let lastPos = 0;
	const last = str.length - 1;
	while (index !== -1 && index < last) {
		let replacement;
		let length = 2;
		switch (str.charCodeAt(index + 1)) {
			case 92:
				replacement = "\\";
				break;
			case 34:
				replacement = "\"";
				break;
			case 110:
				replacement = "\n";
				break;
			case 114:
				replacement = "\r";
				break;
			case 98:
				replacement = "\b";
				break;
			case 116:
				replacement = "	";
				break;
			case 102:
				replacement = "\f";
				break;
			case 120:
				if (str.startsWith("3C", index + 2)) {
					replacement = "<";
					length = 4;
				}
				break;
			case 117: if (str.startsWith("2028", index + 2)) {
				replacement = "\u2028";
				length = 6;
			} else if (str.startsWith("2029", index + 2)) {
				replacement = "\u2029";
				length = 6;
			}
		}
		if (replacement) {
			result += str.slice(lastPos, index) + replacement;
			lastPos = index + length;
			index = str.indexOf("\\", lastPos);
		} else index = str.indexOf("\\", index + 1);
	}
	return result + str.slice(lastPos);
}
var STEP_ERROR_CODES = {
	parsing: 1,
	serialization: 2,
	deserialization: 3
};
function getErrorMessageProd(type) {
	return `Seroval Error (step: ${STEP_ERROR_CODES[type]})`;
}
var SerovalError = class extends Error {
	constructor(type, cause) {
		super(getErrorMessageProd(type));
		this.cause = cause;
	}
};
var SerovalParserError = class extends SerovalError {
	constructor(cause) {
		super("parsing", cause);
	}
};
var SerovalSerializationError = class extends SerovalError {
	constructor(cause) {
		super("serialization", cause);
	}
};
var SerovalDeserializationError = class extends SerovalError {
	constructor(cause) {
		super("deserialization", cause);
	}
};
function getSpecificErrorMessage(code) {
	return `Seroval Error (specific: ${code})`;
}
var SerovalUnsupportedTypeError = class extends Error {
	constructor(value) {
		super(getSpecificErrorMessage(1));
		this.value = value;
	}
};
var SerovalUnsupportedNodeError = class extends Error {
	constructor(node) {
		super(getSpecificErrorMessage(2));
	}
};
var SerovalMissingPluginError = class extends Error {
	constructor(tag) {
		super(getSpecificErrorMessage(3));
	}
};
var SerovalMissingInstanceError = class extends Error {
	constructor(tag) {
		super(getSpecificErrorMessage(4));
	}
};
var SerovalMissingReferenceForIdError = class extends Error {
	constructor(id) {
		super(getSpecificErrorMessage(6));
	}
};
var SerovalUnknownTypedArrayError = class extends Error {
	constructor(name) {
		super(getSpecificErrorMessage(7));
	}
};
var SerovalMalformedNodeError = class extends Error {
	constructor(node) {
		super(getSpecificErrorMessage(8));
	}
};
var SerovalConflictedNodeIdError = class extends Error {
	constructor(node) {
		super(getSpecificErrorMessage(9));
	}
};
var SerovalDepthLimitError = class extends Error {
	constructor(limit) {
		super(getSpecificErrorMessage(10));
	}
};
var SerovalLiveStreamError = class extends Error {
	constructor(reason) {
		super(getSpecificErrorMessage(12));
		this.reason = reason;
	}
};
function getErrorConstructor(error) {
	for (let i = 1; i <= 6; i++) if (error instanceof ERROR_CONSTRUCTOR[i]) return i;
	return 0;
}
function getErrorOptions(error, features) {
	const options = Object.create(null);
	const construct = ERROR_CONSTRUCTOR_STRING[getErrorConstructor(error)];
	if (error.name !== construct) options.name = error.name;
	else if (error.constructor.name !== construct) options.name = error.constructor.name;
	for (const name of Object.getOwnPropertyNames(error)) if (name !== "name" && name !== "message" && (name !== "stack" || features & 4)) options[name] = error[name];
	return options;
}
function getObjectFlag(obj) {
	if (Object.isExtensible(obj)) return 0;
	if (Object.isFrozen(obj)) return 3;
	if (Object.isSealed(obj)) return 2;
	return 1;
}
function getTypedArrayConstructor(name) {
	switch (name) {
		case "Int8Array": return Int8Array;
		case "Int16Array": return Int16Array;
		case "Int32Array": return Int32Array;
		case "Uint8Array": return Uint8Array;
		case "Uint16Array": return Uint16Array;
		case "Uint32Array": return Uint32Array;
		case "Uint8ClampedArray": return Uint8ClampedArray;
		case "Float32Array": return Float32Array;
		case "Float64Array": return Float64Array;
		case "BigInt64Array": return BigInt64Array;
		case "BigUint64Array": return BigUint64Array;
		default: throw new SerovalUnknownTypedArrayError(name);
	}
}
var typedArrayNameGetter;
function getTypedArrayName(value) {
	if (!typedArrayNameGetter) typedArrayNameGetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Int8Array.prototype), Symbol.toStringTag).get;
	return typedArrayNameGetter.call(value);
}
function createNumberNode(value) {
	switch (value) {
		case Number.POSITIVE_INFINITY: return INFINITY_NODE;
		case Number.NEGATIVE_INFINITY: return NEG_INFINITY_NODE;
	}
	if (value !== value) return NAN_NODE;
	if (Object.is(value, -0)) return NEG_ZERO_NODE;
	return createSerovalNode(0, void 0, value);
}
function createStringNode(value) {
	return createSerovalNode(1, void 0, serializeString(value));
}
function createBigIntNode(current) {
	return createSerovalNode(3, void 0, "" + current);
}
function createIndexedValueNode(id) {
	return createSerovalNode(4, id);
}
function createDateNode(id, current) {
	const timestamp = current.valueOf();
	return createSerovalNode(5, id, timestamp === timestamp ? current.toISOString() : "");
}
function createTemporalNode(id, type, current) {
	return createSerovalNode(36, id, current.toString(), type);
}
function createRegExpNode(id, current) {
	return createSerovalNode(6, id, void 0, serializeString(current.source), current.flags);
}
function createWKSymbolNode(id, current) {
	return createSerovalNode(17, id, INV_SYMBOL_REF[current]);
}
function createReferenceNode(id, referenceId) {
	return createSerovalNode(18, id, serializeString(referenceId));
}
function createPluginNode(id, tag, value) {
	return createSerovalNode(25, id, value, serializeString(tag));
}
function createArrayNode(id, current, parsedItems) {
	return createSerovalNode(9, id, void 0, void 0, void 0, void 0, void 0, parsedItems, void 0, void 0, getObjectFlag(current));
}
function createBoxedNode(id, boxed) {
	return createSerovalNode(21, id, void 0, void 0, void 0, void 0, void 0, void 0, boxed);
}
var MAX_TYPED_ARRAY_LENGTH = 1e6;
function createViewNode(type, id, current, buffer) {
	const isDataView = type === 20;
	const size = isDataView ? current.byteLength : current.length;
	if (size > MAX_TYPED_ARRAY_LENGTH) throw new SerovalUnsupportedTypeError(current);
	return createSerovalNode(type, id, void 0, isDataView ? void 0 : getTypedArrayName(current), void 0, void 0, void 0, void 0, buffer, current.byteOffset, void 0, size);
}
function createErrorNode(type, id, current, options) {
	return createSerovalNode(type, id, getErrorConstructor(current), void 0, serializeString(current.message), options);
}
function createSetNode(id, items) {
	return createSerovalNode(7, id, void 0, void 0, void 0, void 0, void 0, items);
}
function createIteratorFactoryInstanceNode(type, factory, items) {
	return createSerovalNode(type, void 0, void 0, void 0, void 0, void 0, void 0, [factory, items]);
}
function createStreamConstructorNode(id, factory, sequence, live) {
	return createSerovalNode(31, id, void 0, void 0, void 0, void 0, void 0, sequence, factory, void 0, void 0, live);
}
function createStreamEventNode(type, id, parsed) {
	return createSerovalNode(type, id, void 0, void 0, void 0, void 0, void 0, void 0, parsed);
}
function createSequenceNode(id, sequence, throwAt, doneAt) {
	return createSerovalNode(35, id, throwAt, void 0, void 0, void 0, void 0, sequence, void 0, void 0, void 0, doneAt);
}
function isLiveStream(value) {
	return value instanceof LiveStream;
}
/**
* A single-consumer stream for incremental serialization. Unlike
* `createStream`, it keeps no history: at most one event is held, and the
* producer operation that sent it settles only when the consumer accepts it.
*
* An internal class rather than a tagged POJO: identity is checked with
* `instanceof`, which untrusted input cannot forge. The class is exported
* because bundlers cannot drop an unexported top-level class.
*/
var LiveStream = class {
	constructor(options) {
		this.consumed = false;
		this.closed = false;
		this.cancelled = false;
		this.options = options;
	}
	deliver(reader, record) {
		record.delivered = true;
		reader.resolve({
			event: record.event,
			accept: () => {
				if (this.pending === record && record.delivered) {
					const terminal = record.event.type !== "next";
					record.event = void 0;
					this.pending = void 0;
					const resolve = record.resolve;
					record.resolve = void 0;
					record.reject = void 0;
					if (terminal) {
						this.closed = true;
						this.options = void 0;
						const waiter = this.waiting;
						this.waiting = void 0;
						waiter?.reject(new SerovalLiveStreamError("closed"));
					}
					resolve?.();
				}
			}
		});
	}
	/** @internal */
	push(event) {
		if (this.cancelled) return Promise.reject(this.cancelReason);
		if (this.closed) return Promise.reject(new SerovalLiveStreamError("closed"));
		if (this.pending) return Promise.reject(new SerovalLiveStreamError("pending"));
		return new Promise((resolve, reject) => {
			const record = {
				event,
				delivered: false,
				resolve,
				reject
			};
			this.pending = record;
			if (this.waiting) {
				const waiter = this.waiting;
				this.waiting = void 0;
				this.deliver(waiter, record);
			}
		});
	}
	cancel(reason) {
		if (this.cancelled || this.closed) return;
		this.cancelled = true;
		this.cancelReason = reason;
		const record = this.pending;
		const waiter = this.waiting;
		this.pending = void 0;
		this.waiting = void 0;
		const callbackOwner = this.options;
		this.options = void 0;
		if (record) {
			record.event = void 0;
			const reject = record.reject;
			record.resolve = void 0;
			record.reject = void 0;
			reject?.(reason);
		}
		if (waiter) waiter.reject(reason);
		callbackOwner?.onCancel?.(reason);
	}
	read() {
		if (this.cancelled) return Promise.reject(this.cancelReason);
		if (this.closed) return Promise.reject(new SerovalLiveStreamError("closed"));
		if (this.waiting) return Promise.reject(new SerovalLiveStreamError("reading"));
		return new Promise((resolve, reject) => {
			const next = {
				resolve,
				reject
			};
			if (this.pending && !this.pending.delivered) this.deliver(next, this.pending);
			else this.waiting = next;
		});
	}
	consume() {
		if (this.consumed) throw new SerovalLiveStreamError("consumed");
		this.consumed = true;
		return {
			read: () => this.read(),
			cancel: (reason) => this.cancel(reason)
		};
	}
	/**
	* Consumes the stream through a replay-style listener, accepting each
	* event as soon as it has been delivered. Use `consume` or `pump` when
	* acceptance must wait for processing.
	*/
	on(listener) {
		const wrap = (key) => (value, accept) => {
			listener[key](value);
			accept();
		};
		return this.pump({
			next: wrap("next"),
			throw: wrap("throw"),
			return: wrap("return")
		});
	}
	/**
	* Consumes the stream into a sink that controls acceptance. Returns the
	* cancel function.
	* @internal
	*/
	pump(sink) {
		const consumer = this.consume();
		let current = sink;
		function next() {
			consumer.read().then((delivery) => {
				const target = current;
				if (!target) return;
				const event = delivery.event;
				let failure;
				let failed = false;
				try {
					failure = target[event.type](event.type === "throw" ? event.error : event.value, delivery.accept);
				} catch (error) {
					failed = true;
					failure = error;
				}
				if (failed || failure !== void 0) {
					current = void 0;
					try {
						consumer.cancel(failure);
					} finally {
						target.done?.();
					}
					return;
				}
				if (event.type === "next") {
					next();
					return;
				}
				current = void 0;
				target.done?.();
			}, (reason) => {
				const target = current;
				current = void 0;
				target?.error?.(reason);
			});
		}
		next();
		return consumer.cancel;
	}
};
/**
* An opaque reference allows hiding values from the serializer.
*/
var OpaqueReference = class {
	constructor(value, replacement) {
		this.value = value;
		this.replacement = replacement;
	}
};
var PROMISE_CONSTRUCTOR = () => {
	const resolver = {
		p: 0,
		s: 0,
		f: 0
	};
	resolver.p = new Promise((resolve, reject) => {
		resolver.s = resolve;
		resolver.f = reject;
	});
	return resolver;
};
var PROMISE_SUCCESS = (resolver, data) => {
	resolver.s(data);
	resolver.p.s = 1;
	resolver.p.v = data;
};
var PROMISE_FAILURE = (resolver, data) => {
	resolver.f(data);
	resolver.p.s = 2;
	resolver.p.v = data;
};
var SERIALIZED_PROMISE_CONSTRUCTOR = /* @__PURE__ */ PROMISE_CONSTRUCTOR.toString();
var SERIALIZED_PROMISE_SUCCESS = /* @__PURE__ */ PROMISE_SUCCESS.toString();
var SERIALIZED_PROMISE_FAILURE = /* @__PURE__ */ PROMISE_FAILURE.toString();
var STREAM_CONSTRUCTOR = (live) => {
	const buffer = [];
	const listeners = [];
	let alive = true;
	let success = false;
	let count = 0;
	const internal = {
		flush(value, mode, x) {
			live > 1 || buffer.push(value);
			for (x = 0; x < count; x++) {
				const listener = listeners[x];
				if (listener) listener[mode](value);
			}
		},
		up(listener, x, z, current) {
			for (x = 0, z = buffer.length; x < z; x++) {
				current = buffer[x];
				if (!alive && x === z - 1) listener[success ? "return" : "throw"](current);
				else listener.next(current);
			}
		},
		on(listener, temp = 0) {
			if (live > 1) throw new Error("Stream consumed");
			let subscribed = alive;
			if (alive) {
				for (temp = 0; temp < count; temp++) if (!listeners[temp]) break;
				if (temp === count) count++;
				listeners[temp] = listener;
			}
			internal.up(listener);
			if (live) {
				live = 2;
				buffer.length = 0;
			}
			return () => {
				if (alive && subscribed) {
					subscribed = false;
					listeners[temp] = void 0;
					while (count > 0 && !listeners[count - 1]) count--;
					listeners.length = count;
				}
			};
		}
	};
	return {
		__SEROVAL_STREAM__: true,
		on(listener) {
			return internal.on(listener);
		},
		next(value) {
			if (alive) internal.flush(value, "next");
		},
		throw(value) {
			if (alive) {
				internal.flush(value, "throw");
				alive = false;
				success = false;
				listeners.length = 0;
			}
		},
		return(value) {
			if (alive) {
				internal.flush(value, "return");
				alive = false;
				success = true;
				listeners.length = 0;
			}
		}
	};
};
var SERIALIZED_STREAM_CONSTRUCTOR = /* @__PURE__ */ STREAM_CONSTRUCTOR.toString();
var ITERATOR_CONSTRUCTOR = (symbol) => (sequence) => () => {
	let index = 0;
	const instance = {
		[symbol]() {
			return instance;
		},
		next() {
			if (index > sequence.d) return {
				done: true,
				value: void 0
			};
			const currentIndex = index++;
			const data = sequence.v[currentIndex];
			if (currentIndex === sequence.t) throw data;
			return {
				done: currentIndex === sequence.d,
				value: data
			};
		}
	};
	return instance;
};
var SERIALIZED_ITERATOR_CONSTRUCTOR = /* @__PURE__ */ ITERATOR_CONSTRUCTOR.toString();
var ASYNC_ITERATOR_CONSTRUCTOR = (symbol, createPromise) => (stream) => () => {
	let count = 0;
	let doneAt = -1;
	let isThrow = false;
	const buffer = [];
	const pending = [];
	const internal = { finalize(i = 0, len = pending.length) {
		for (; i < len; i++) pending[i].s({
			done: true,
			value: void 0
		});
	} };
	stream.on({
		next(value) {
			const temp = pending.shift();
			if (temp) temp.s({
				done: false,
				value
			});
			buffer.push(value);
		},
		throw(value) {
			const temp = pending.shift();
			if (temp) temp.f(value);
			internal.finalize();
			doneAt = buffer.length;
			isThrow = true;
			buffer.push(value);
		},
		return(value) {
			const temp = pending.shift();
			if (temp) temp.s({
				done: true,
				value
			});
			internal.finalize();
			doneAt = buffer.length;
			buffer.push(value);
		}
	});
	const instance = {
		[symbol]() {
			return instance;
		},
		next() {
			if (doneAt === -1) {
				const index = count++;
				if (index >= buffer.length) {
					const temp = createPromise();
					pending.push(temp);
					return temp.p;
				}
				return {
					done: false,
					value: buffer[index]
				};
			}
			if (count > doneAt) return {
				done: true,
				value: void 0
			};
			const index = count++;
			const value = buffer[index];
			if (index !== doneAt) return {
				done: false,
				value
			};
			if (isThrow) throw value;
			return {
				done: true,
				value
			};
		}
	};
	return instance;
};
var SERIALIZED_ASYNC_ITERATOR_CONSTRUCTOR = /* @__PURE__ */ ASYNC_ITERATOR_CONSTRUCTOR.toString();
var ARRAY_BUFFER_CONSTRUCTOR = (b64) => {
	const decoded = atob(b64);
	const length = decoded.length;
	const arr = new Uint8Array(length);
	for (let i = 0; i < length; i++) arr[i] = decoded.charCodeAt(i);
	return arr.buffer;
};
var SERIALIZED_ARRAY_BUFFER_CONSTRUCTOR = /* @__PURE__ */ ARRAY_BUFFER_CONSTRUCTOR.toString();
/**
* An internal class rather than a tagged POJO: identity is checked with
* `instanceof`, which untrusted input cannot forge. The class is exported
* because bundlers cannot drop an unexported top-level class.
* The eval-based `deserialize` path still rebuilds a `{__SEROVAL_SEQUENCE__…}`
* POJO from embedded source - it has no access to this class - so a value read
* back through `deserialize` is not an instance and, by design, is not treated
* as a genuine Sequence on re-serialization.
*/
var Sequence = class {
	constructor(values, throwAt, doneAt) {
		this.v = values;
		this.t = throwAt;
		this.d = doneAt;
	}
};
function isSequence(value) {
	return value instanceof Sequence;
}
function createSequence(values, throwAt, doneAt) {
	return new Sequence(values, throwAt, doneAt);
}
function createSequenceFromIterable(source) {
	const values = [];
	let throwsAt = -1;
	let doneAt = -1;
	const iterator = source[SYM_ITERATOR]();
	for (;;) try {
		const value = iterator.next();
		values.push(value.value);
		if (value.done) {
			doneAt = values.length - 1;
			break;
		}
	} catch (error) {
		throwsAt = values.length;
		doneAt = throwsAt;
		values.push(error);
		break;
	}
	return createSequence(values, throwsAt, doneAt);
}
var createIterator = /* @__PURE__ */ ITERATOR_CONSTRUCTOR(SYM_ITERATOR);
function sequenceToIterator(sequence) {
	return createIterator(sequence);
}
var ITERATOR = {};
var ASYNC_ITERATOR = {};
/**
* Placeholder references
*/
var SPECIAL_REFS = {
	[0]: {},
	[1]: {},
	[2]: {},
	[3]: {},
	[4]: {},
	[5]: {}
};
var SPECIAL_REF_STRING = {
	[0]: "[]",
	[1]: SERIALIZED_PROMISE_CONSTRUCTOR,
	[2]: SERIALIZED_PROMISE_SUCCESS,
	[3]: SERIALIZED_PROMISE_FAILURE,
	[4]: SERIALIZED_STREAM_CONSTRUCTOR,
	[5]: SERIALIZED_ARRAY_BUFFER_CONSTRUCTOR
};
/**
* An internal class rather than a tagged POJO: identity is checked with
* `instanceof`, which untrusted input cannot forge. The class is exported
* because bundlers cannot drop an unexported top-level class.
*
* The behavior is intentionally duplicated from `STREAM_CONSTRUCTOR`. That
* constructor's source is embedded verbatim into the eval-based `deserialize`
* output, which has no access to this class, so the two cannot be shared. A
* stream read back through `deserialize` is therefore a plain POJO and, by
* design, is not treated as a genuine Stream on re-serialization. Keep the two
* implementations in sync.
*/
var Stream = class {
	constructor(live) {
		this.buffer = [];
		this.listeners = [];
		this.alive = true;
		this.success = false;
		this.count = 0;
		this.live = live;
	}
	flush(value, mode) {
		this.live > 1 || this.buffer.push(value);
		for (let x = 0; x < this.count; x++) this.listeners[x]?.[mode](value);
	}
	replay(listener) {
		for (let x = 0, z = this.buffer.length; x < z; x++) {
			const current = this.buffer[x];
			if (!this.alive && x === z - 1) listener[this.success ? "return" : "throw"](current);
			else listener.next(current);
		}
	}
	on(listener) {
		if (this.live > 1) throw new Error("Stream consumed");
		let subscribed = this.alive;
		let temp = 0;
		if (subscribed) {
			for (; temp < this.count; temp++) if (!this.listeners[temp]) break;
			if (temp === this.count) this.count++;
			this.listeners[temp] = listener;
		}
		this.replay(listener);
		if (this.live) {
			this.live = 2;
			this.buffer.length = 0;
		}
		return () => {
			if (this.alive && subscribed) {
				subscribed = false;
				this.listeners[temp] = void 0;
				while (this.count > 0 && !this.listeners[this.count - 1]) this.count--;
				this.listeners.length = this.count;
			}
		};
	}
	next(value) {
		if (this.alive) this.flush(value, "next");
	}
	throw(value) {
		if (this.alive) {
			this.flush(value, "throw");
			this.alive = false;
			this.success = false;
			this.listeners.length = 0;
		}
	}
	return(value) {
		if (this.alive) {
			this.flush(value, "return");
			this.alive = false;
			this.success = true;
			this.listeners.length = 0;
		}
	}
};
function isStream(value) {
	return value instanceof Stream || isLiveStream(value);
}
function createStream() {
	return new Stream();
}
var createAsyncIterable = /* @__PURE__ */ ASYNC_ITERATOR_CONSTRUCTOR(SYM_ASYNC_ITERATOR, PROMISE_CONSTRUCTOR);
function streamToAsyncIterable(stream) {
	return createAsyncIterable(stream);
}
async function promiseToResult(current) {
	try {
		return [1, await current];
	} catch (e) {
		return [0, e];
	}
}
function encodeArrayBuffer$1(current) {
	const bytes = new Uint8Array(current);
	if (typeof bytes.toBase64 === "function") return bytes.toBase64();
	let result = "";
	for (let i = 0, len = bytes.length; i < len; i++) result += String.fromCharCode(bytes[i]);
	return btoa(result);
}
var MIN_NATIVE_BASE64_LENGTH = 512;
function encodeArrayBuffer(current) {
	if (typeof Buffer !== "undefined") return Buffer.from(current).toString("base64");
	return encodeArrayBuffer$1(current);
}
function decodeArrayBuffer(source) {
	if (source.length < MIN_NATIVE_BASE64_LENGTH || typeof Buffer === "undefined") return ARRAY_BUFFER_CONSTRUCTOR(source);
	const decoded = atob(source);
	const buffer = new ArrayBuffer(decoded.length);
	Buffer.from(buffer).write(decoded, "latin1");
	return buffer;
}
function createPlugin(plugin) {
	return plugin;
}
function dedupePlugins(deduped, plugins) {
	for (let i = 0, len = plugins.length; i < len; i++) {
		const current = plugins[i];
		if (!deduped.has(current)) {
			deduped.add(current);
			if (current.extends) dedupePlugins(deduped, current.extends);
		}
	}
}
var RESOLVED_PLUGINS = /* @__PURE__ */ new WeakMap();
function matchResolved(resolved, plugins, added) {
	for (let i = 0, len = plugins.length; i < len; i++) {
		const current = plugins[i];
		if (current === resolved[added]) {
			added++;
			if (current.extends) {
				added = matchResolved(resolved, current.extends, added);
				if (added === -1) return -1;
			}
		} else {
			const index = resolved.indexOf(current);
			if (index === -1 || index >= added) return -1;
		}
	}
	return added;
}
function resolvePlugins(plugins) {
	if (plugins) {
		const cached = RESOLVED_PLUGINS.get(plugins);
		if (cached && matchResolved(cached, plugins, 0) === cached.length) return cached;
		const deduped = /* @__PURE__ */ new Set();
		dedupePlugins(deduped, plugins);
		const resolved = [...deduped];
		RESOLVED_PLUGINS.set(plugins, resolved);
		return resolved;
	}
}
/**
* Returns the plugins that are tested for plain objects. It is the same array
* when no plugin sets `skipPlainObjects`.
*/
function getPlainObjectPlugins(plugins) {
	if (plugins) {
		for (let i = 0, len = plugins.length; i < len; i++) if (plugins[i].skipPlainObjects) {
			const result = plugins.filter((plugin) => !plugin.skipPlainObjects);
			return result.length ? result : void 0;
		}
	}
	return plugins;
}
var REFERENCES_KEY = "__SEROVAL_REFS__";
var GLOBAL_CONTEXT_R = `self.\$R`;
function getCrossReferenceHeader(id) {
	if (id == null) return `${GLOBAL_CONTEXT_R}=${GLOBAL_CONTEXT_R}||[]`;
	return `(${GLOBAL_CONTEXT_R}=${GLOBAL_CONTEXT_R}||{})["${serializeString(id)}"]=[]`;
}
var REFERENCE = /* @__PURE__ */ new Map();
var INV_REFERENCE = /* @__PURE__ */ new Map();
function hasReference(id) {
	return INV_REFERENCE.has(id);
}
function getReferenceID(value) {
	return REFERENCE.get(value);
}
function getReference(id) {
	if (hasReference(id)) return INV_REFERENCE.get(id);
	throw new SerovalMissingReferenceForIdError(id);
}
function createBaseParserContext(options) {
	return {
		plugins: options.plugins,
		plainObjectPlugins: getPlainObjectPlugins(options.plugins),
		marked: /* @__PURE__ */ new Set(),
		features: 127 ^ (options.disabledFeatures ?? 0),
		refs: options.refs ?? /* @__PURE__ */ new Map(),
		depthLimit: options.depthLimit || 1e3,
		compactArrayBufferViews: options.compactArrayBufferViews ?? false
	};
}
/**
* Returns the plugins to test for an object. Plain objects, whose prototype is
* `Object.prototype`, skip the plugins that set `skipPlainObjects`. Checking
* the prototype as well as `constructor` keeps instances whose prototype has
* no own `constructor` property from skipping those plugins.
*/
function getObjectPlugins(ctx, current, currentClass) {
	return currentClass === Object && Object.getPrototypeOf(current) === Object.prototype ? ctx.plainObjectPlugins : ctx.plugins;
}
/**
* Ensures that the value (based on an identifier) has been visited by the parser.
* @param ctx
* @param id
*/
function markParserRef(ctx, id) {
	ctx.marked.add(id);
}
/**
* Creates an identifier for a value
* @param ctx
* @param current
*/
function createIndexForValue(ctx, current) {
	const id = ctx.refs.size;
	ctx.refs.set(current, id);
	return id;
}
function getNodeForIndexedValue(ctx, current) {
	const registeredId = ctx.refs.get(current);
	if (registeredId != null) {
		markParserRef(ctx, registeredId);
		return createIndexedValueNode(registeredId);
	}
	return createIndexForValue(ctx, current);
}
function getReferenceNode(ctx, current) {
	const indexed = getNodeForIndexedValue(ctx, current);
	if (typeof indexed !== "number") return indexed;
	const referenceId = getReferenceID(current);
	return referenceId === void 0 ? indexed : createReferenceNode(indexed, referenceId);
}
/**
* Parsing methods
*/
function parseWellKnownSymbol(ctx, current) {
	const ref = getReferenceNode(ctx, current);
	if (typeof ref !== "number") return ref;
	if (current in INV_SYMBOL_REF) return createWKSymbolNode(ref, current);
	throw new SerovalUnsupportedTypeError(current);
}
function parseSpecialReference(ctx, ref) {
	const result = getNodeForIndexedValue(ctx, SPECIAL_REFS[ref]);
	if (typeof result !== "number") return result;
	return createSerovalNode(26, result, ref);
}
function parseIteratorFactory(ctx) {
	const result = getNodeForIndexedValue(ctx, ITERATOR);
	if (typeof result !== "number") return result;
	return createSerovalNode(27, result, void 0, void 0, void 0, void 0, void 0, void 0, parseWellKnownSymbol(ctx, SYM_ITERATOR));
}
function parseAsyncIteratorFactory(ctx) {
	const result = getNodeForIndexedValue(ctx, ASYNC_ITERATOR);
	if (typeof result !== "number") return result;
	return createSerovalNode(29, result, void 0, void 0, void 0, void 0, void 0, [parseSpecialReference(ctx, 1), parseWellKnownSymbol(ctx, SYM_ASYNC_ITERATOR)]);
}
function getTemporalType(currentClass) {
	switch (currentClass) {
		case Temporal.Instant: return 0;
		case Temporal.Duration: return 1;
		case Temporal.PlainDate: return 2;
		case Temporal.PlainDateTime: return 3;
		case Temporal.PlainMonthDay: return 4;
		case Temporal.PlainTime: return 5;
		case Temporal.PlainYearMonth: return 6;
		case Temporal.ZonedDateTime: return 7;
		default: return;
	}
}
function getObjectClass(current) {
	const currentClass = current.constructor;
	if (currentClass !== void 0 && typeof currentClass !== "function") {
		const proto = Object.getPrototypeOf(current);
		return proto === null ? void 0 : proto.constructor;
	}
	return currentClass;
}
/**
* Decides how an object is parsed. Shared by the sync, stream and async
* parsers so the class checks and feature gates live in one place.
*/
function getObjectKind(current, currentClass, features) {
	switch (currentClass) {
		case Object: return 1;
		case void 0: return 2;
		case Date: return 3;
		case Error:
		case EvalError:
		case RangeError:
		case ReferenceError:
		case SyntaxError:
		case TypeError:
		case URIError: return 4;
		case Number:
		case Boolean:
		case String:
		case BigInt: return 6;
		case ArrayBuffer: return 7;
		case Int8Array:
		case Int16Array:
		case Int32Array:
		case Uint8Array:
		case Uint16Array:
		case Uint32Array:
		case Uint8ClampedArray:
		case Float32Array:
		case Float64Array: return 8;
		case DataView: return 10;
		case Map: return 11;
		case Set: return 12;
	}
	if (currentClass === Promise || current instanceof Promise) return 13;
	if (features & 32 && currentClass === RegExp) return 14;
	if (features & 16 && (currentClass === BigInt64Array || currentClass === BigUint64Array)) return 9;
	if (features & 1 && typeof AggregateError !== "undefined" && (currentClass === AggregateError || current instanceof AggregateError)) return 5;
	if (features & 64 && typeof Temporal !== "undefined" && getTemporalType(currentClass) != null) return 15;
	if (current instanceof Error) return 4;
	if (SYM_ITERATOR in current || SYM_ASYNC_ITERATOR in current) return 16;
	return 0;
}
function createObjectNode(id, current, empty, record) {
	return createSerovalNode(empty ? 11 : 10, id, void 0, void 0, void 0, record, void 0, void 0, void 0, void 0, getObjectFlag(current));
}
/**
* Gets the sentinel node for a Map. Call it before parsing the entries, so
* that an outer Map declares the sentinel before any Map inside it uses it.
*/
function parseMapSentinel(ctx) {
	return parseSpecialReference(ctx, 0);
}
function createMapNode(id, sentinel, k, v) {
	return createSerovalNode(8, id, void 0, void 0, void 0, void 0, {
		k,
		v
	}, void 0, sentinel);
}
function createPromiseConstructorNode(ctx, id, resolver) {
	return createSerovalNode(22, id, resolver, void 0, void 0, void 0, void 0, void 0, parseSpecialReference(ctx, 1));
}
function getArrayBufferView(ctx, current) {
	if (!ctx.compactArrayBufferViews) return current;
	const buffer = new Uint8Array(current.buffer, current.byteOffset, current.byteLength).slice().buffer;
	return new (current instanceof DataView ? DataView : getTypedArrayConstructor(getTypedArrayName(current)))(buffer);
}
function createArrayBufferNode(ctx, id, current) {
	return createSerovalNode(19, id, encodeArrayBuffer(current), void 0, void 0, void 0, void 0, void 0, parseSpecialReference(ctx, 5));
}
function createAsyncParserContext(options) {
	return { base: createBaseParserContext(options) };
}
async function parseItems$1(ctx, depth, current) {
	const len = current.length;
	const nodes = new Array(len);
	for (let i = 0, node; i < len; i++) if (i in current) {
		node = parseValueAsync(ctx, depth, current[i]);
		nodes[i] = node instanceof Promise ? await node : node;
	} else nodes[i] = 0;
	return nodes;
}
async function parseArray$1(ctx, depth, id, current) {
	return createArrayNode(id, current, await parseItems$1(ctx, depth, current));
}
async function parseProperties$1(ctx, depth, properties) {
	const keys = Object.keys(properties);
	const len = keys.length;
	const keyNodes = new Array(len);
	const valueNodes = new Array(len);
	for (let i = 0, key, node; i < len; i++) {
		key = keys[i];
		keyNodes[i] = serializeString(key);
		node = parseValueAsync(ctx, depth, properties[key]);
		valueNodes[i] = node instanceof Promise ? await node : node;
	}
	if (SYM_ITERATOR in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_ITERATOR));
		valueNodes.push(createIteratorFactoryInstanceNode(28, parseIteratorFactory(ctx.base), await parseAsync(ctx, depth, createSequenceFromIterable(properties))));
	}
	if (SYM_ASYNC_ITERATOR in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_ASYNC_ITERATOR));
		valueNodes.push(createIteratorFactoryInstanceNode(30, parseAsyncIteratorFactory(ctx.base), await parseAsyncIterable$1(ctx, depth, properties)));
	}
	if (SYM_TO_STRING_TAG in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_TO_STRING_TAG));
		valueNodes.push(createStringNode(properties[SYM_TO_STRING_TAG]));
	}
	if (SYM_IS_CONCAT_SPREADABLE in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_IS_CONCAT_SPREADABLE));
		valueNodes.push(properties[SYM_IS_CONCAT_SPREADABLE] ? TRUE_NODE : FALSE_NODE);
	}
	return {
		k: keyNodes,
		v: valueNodes
	};
}
async function parsePlainObject$1(ctx, depth, id, current, empty) {
	return createObjectNode(id, current, empty, await parseProperties$1(ctx, depth, current));
}
async function parseBoxed$1(ctx, depth, id, current) {
	return createBoxedNode(id, await parseAsync(ctx, depth, current.valueOf()));
}
async function parseView$1(ctx, depth, type, id, current) {
	current = getArrayBufferView(ctx.base, current);
	return createViewNode(type, id, current, await parseAsync(ctx, depth, current.buffer));
}
async function parseError$1(ctx, depth, type, id, current) {
	const options = getErrorOptions(current, ctx.base.features);
	return createErrorNode(type, id, current, options ? await parseProperties$1(ctx, depth, options) : void 0);
}
async function parseMap$1(ctx, depth, id, current) {
	const sentinel = parseMapSentinel(ctx.base);
	const keyNodes = new Array(current.size);
	const valueNodes = new Array(current.size);
	let node;
	let i = 0;
	for (const [key, value] of current.entries()) {
		node = parseValueAsync(ctx, depth, key);
		keyNodes[i] = node instanceof Promise ? await node : node;
		node = parseValueAsync(ctx, depth, value);
		valueNodes[i] = node instanceof Promise ? await node : node;
		i++;
	}
	return createMapNode(id, sentinel, keyNodes, valueNodes);
}
async function parseSet$1(ctx, depth, id, current) {
	const items = new Array(current.size);
	let node;
	let i = 0;
	for (const item of current.keys()) {
		node = parseValueAsync(ctx, depth, item);
		items[i++] = node instanceof Promise ? await node : node;
	}
	return createSetNode(id, items);
}
async function parsePlugin$1(ctx, depth, id, current, currentPlugins) {
	if (currentPlugins) for (let i = 0, len = currentPlugins.length; i < len; i++) {
		const plugin = currentPlugins[i];
		if (plugin.parse.async && plugin.test(current)) return createPluginNode(id, plugin.tag, await plugin.parse.async(current, {
			parse: (value) => parseAsync(ctx, depth, value),
			parseStreamSource(source) {
				if (depth >= ctx.base.depthLimit) throw new SerovalDepthLimitError(ctx.base.depthLimit);
				return parseAsyncIterable$1(ctx, depth + 1, source);
			}
		}, { id }));
	}
}
async function parsePromise$1(ctx, depth, id, current) {
	const [status, result] = await promiseToResult(current);
	return createSerovalNode(12, id, status, void 0, void 0, void 0, void 0, void 0, await parseAsync(ctx, depth, result));
}
function parseStreamHandle(depth, id, current, resolve, reject) {
	const sequence = [];
	let unparsed = 0;
	let ended = false;
	let settled = false;
	const fail = (error) => {
		if (!settled) {
			settled = true;
			try {
				cleanup(error);
			} catch {}
			reject(error);
		}
	};
	const handle = (type) => (value, accept) => {
		if (settled) return;
		markParserRef(this.base, id);
		const slot = sequence.push(void 0) - 1;
		unparsed++;
		if (type !== 32) ended = true;
		parseAsync(this, depth, value).then((data) => {
			if (!settled) {
				sequence[slot] = createStreamEventNode(type, id, data);
				unparsed--;
				accept?.();
				if (ended && unparsed === 0) {
					settled = true;
					try {
						cleanup();
					} catch (error) {
						reject(error);
						return;
					}
					resolve(sequence);
				}
			}
		}, fail);
	};
	const listener = {
		next: handle(32),
		throw: handle(33),
		return: handle(34)
	};
	const cleanup = isLiveStream(current) ? current.pump(listener) : current.on(listener);
}
async function parseStream$1(ctx, depth, id, current) {
	return createStreamConstructorNode(id, parseSpecialReference(ctx.base, 4), await new Promise(parseStreamHandle.bind(ctx, depth, id, current)));
}
/**
* Collects an async iterable into a replay node, one value at a time.
*/
async function parseAsyncIterable$1(ctx, depth, current) {
	const id = createIndexForValue(ctx.base, {});
	const reference = parseSpecialReference(ctx.base, 4);
	const iterator = current[SYM_ASYNC_ITERATOR]();
	const sequence = [];
	for (;;) {
		let result;
		try {
			result = await iterator.next();
		} catch (error) {
			markParserRef(ctx.base, id);
			sequence.push(createStreamEventNode(33, id, await parseAsync(ctx, depth, error)));
			break;
		}
		markParserRef(ctx.base, id);
		let parsed;
		try {
			parsed = await parseAsync(ctx, depth, result.value);
		} catch (error) {
			Promise.resolve().then(() => iterator.return?.()).catch(() => {});
			throw error;
		}
		sequence.push(createStreamEventNode(result.done ? 34 : 32, id, parsed));
		if (result.done) break;
	}
	return createStreamConstructorNode(id, reference, sequence);
}
async function parseSequence$1(ctx, depth, id, current) {
	const len = current.v.length;
	const nodes = new Array(len);
	for (let i = 0, node; i < len; i++) {
		node = parseValueAsync(ctx, depth, current.v[i]);
		nodes[i] = node instanceof Promise ? await node : node;
	}
	return createSequenceNode(id, nodes, current.t, current.d);
}
async function parseObjectAsync(ctx, depth, id, current) {
	if (Array.isArray(current)) return parseArray$1(ctx, depth, id, current);
	if (isStream(current)) return parseStream$1(ctx, depth, id, current);
	if (isSequence(current)) return parseSequence$1(ctx, depth, id, current);
	const currentClass = getObjectClass(current);
	if (currentClass === OpaqueReference) return parseAsync(ctx, depth, current.replacement);
	const parsed = await parsePlugin$1(ctx, depth, id, current, getObjectPlugins(ctx.base, current, currentClass));
	if (parsed) return parsed;
	if (currentClass === Object) return parsePlainObject$1(ctx, depth, id, current, false);
	switch (getObjectKind(current, currentClass, ctx.base.features)) {
		case 2: return parsePlainObject$1(ctx, depth, id, current, true);
		case 3: return createDateNode(id, current);
		case 4: return parseError$1(ctx, depth, 13, id, current);
		case 5: return parseError$1(ctx, depth, 14, id, current);
		case 6: return parseBoxed$1(ctx, depth, id, current);
		case 7: return createArrayBufferNode(ctx.base, id, current);
		case 8: return parseView$1(ctx, depth, 15, id, current);
		case 9: return parseView$1(ctx, depth, 16, id, current);
		case 10: return parseView$1(ctx, depth, 20, id, current);
		case 11: return parseMap$1(ctx, depth, id, current);
		case 12: return parseSet$1(ctx, depth, id, current);
		case 13: return parsePromise$1(ctx, depth, id, current);
		case 14: return createRegExpNode(id, current);
		case 15: return createTemporalNode(id, getTemporalType(currentClass), current);
		case 16: return parsePlainObject$1(ctx, depth, id, current, !!currentClass);
		default: throw new SerovalUnsupportedTypeError(current);
	}
}
async function parseFunctionAsync(ctx, depth, current) {
	const ref = getReferenceNode(ctx.base, current);
	if (typeof ref !== "number") return ref;
	const plugin = await parsePlugin$1(ctx, depth, ref, current, ctx.base.plugins);
	if (plugin) return plugin;
	throw new SerovalUnsupportedTypeError(current);
}
/**
* Parses primitives and already-seen values synchronously; only objects and
* functions come back as a Promise. Errors are thrown synchronously, which
* an async caller turns into a rejection as before.
*/
function parseValueAsync(ctx, depth, current) {
	if (depth >= ctx.base.depthLimit) throw new SerovalDepthLimitError(ctx.base.depthLimit);
	switch (typeof current) {
		case "boolean": return current ? TRUE_NODE : FALSE_NODE;
		case "undefined": return UNDEFINED_NODE;
		case "string": return createStringNode(current);
		case "number": return createNumberNode(current);
		case "bigint": return createBigIntNode(current);
		case "object":
			if (current) {
				const ref = getReferenceNode(ctx.base, current);
				return typeof ref === "number" ? parseObjectAsync(ctx, depth + 1, ref, current) : ref;
			}
			return NULL_NODE;
		case "symbol": return parseWellKnownSymbol(ctx.base, current);
		case "function": return parseFunctionAsync(ctx, depth, current);
		default: throw new SerovalUnsupportedTypeError(current);
	}
}
async function parseAsync(ctx, depth, current) {
	return await parseValueAsync(ctx, depth, current);
}
async function parseTopAsync(ctx, current) {
	try {
		return await parseAsync(ctx, 0, current);
	} catch (error) {
		throw error instanceof SerovalParserError ? error : new SerovalParserError(error);
	}
}
function isValidKey(key) {
	switch (key) {
		case "constructor":
		case "__proto__":
		case "prototype":
		case "__defineGetter__":
		case "__defineSetter__":
		case "__lookupGetter__":
		case "__lookupSetter__": return false;
		default: return true;
	}
}
function isValidSymbol(symbol) {
	switch (symbol) {
		case SYM_ASYNC_ITERATOR:
		case SYM_IS_CONCAT_SPREADABLE:
		case SYM_TO_STRING_TAG:
		case SYM_ITERATOR: return true;
		default: return false;
	}
}
var DEFAULT_MAX_BASE64_LENGTH = 1e6;
var MAX_BIGINT_LENGTH = 1e4;
var MAX_REGEXP_SOURCE_LENGTH = 2e4;
function applyObjectFlag(obj, flag) {
	switch (flag) {
		case 3: return Object.freeze(obj);
		case 1: return Object.preventExtensions(obj);
		case 2: return Object.seal(obj);
		default: return obj;
	}
}
var DEFAULT_DEPTH_LIMIT = 1e3;
function createBaseDeserializerContext(options) {
	const maxBase64Length = options.maxBase64Length ?? DEFAULT_MAX_BASE64_LENGTH;
	if (!Number.isSafeInteger(maxBase64Length) || maxBase64Length < 0) throw new RangeError("maxBase64Length must be a non-negative safe integer");
	const refs = options.refs ?? /* @__PURE__ */ new Map();
	if (!("types" in refs)) Object.assign(refs, { types: /* @__PURE__ */ new Map() });
	return {
		plugins: options.plugins,
		refs,
		features: options.features ?? 127 ^ (options.disabledFeatures ?? 0),
		depthLimit: options.depthLimit || DEFAULT_DEPTH_LIMIT,
		maxBase64Length
	};
}
function createVanillaDeserializerContext(options) {
	return {
		base: createBaseDeserializerContext(options),
		marked: new Set(options.markedRefs)
	};
}
function guardIndexedValue(ctx, id) {
	const node = {
		t: 4,
		i: id
	};
	if (id < 0 || !Number.isInteger(id)) throw new SerovalMalformedNodeError(node);
	if (ctx.refs.has(id)) throw new SerovalConflictedNodeIdError(node);
}
function isThennable(value) {
	return !!value && (typeof value === "object" || typeof value === "function") && "then" in value && typeof value.then === "function";
}
function assignIndexedValue$1(ctx, id, value) {
	guardIndexedValue(ctx.base, id);
	const marked = ctx.marked;
	if (!marked || marked.has(id)) ctx.base.refs.set(id, value);
	return value;
}
function deserializeKnownValue(node, record, key) {
	if (Object.hasOwn(record, key)) return record[key];
	throw new SerovalMalformedNodeError(node);
}
function deserializeReference(ctx, node) {
	return assignIndexedValue$1(ctx, node.i, getReference(deserializeString(node.s)));
}
function validateNodeList(node, list) {
	if (!Array.isArray(list)) throw new SerovalMalformedNodeError(node);
}
function deserializeArray(ctx, depth, node) {
	const items = node.a;
	validateNodeList(node, items);
	const len = items.length;
	const result = assignIndexedValue$1(ctx, node.i, new Array(len));
	for (let i = 0, item; i < len; i++) {
		item = items[i];
		if (item) result[i] = deserialize$1(ctx, depth, item);
	}
	applyObjectFlag(result, node.o);
	return result;
}
function assignStringProperty(object, key, value) {
	if (isValidKey(key)) object[key] = value;
	else Object.defineProperty(object, key, {
		value,
		configurable: true,
		enumerable: true,
		writable: true
	});
}
function assignProperty(ctx, depth, object, key, value) {
	if (typeof key === "string") assignStringProperty(object, deserializeString(key), deserialize$1(ctx, depth, value));
	else {
		const actual = deserialize$1(ctx, depth, key);
		switch (typeof actual) {
			case "string":
				assignStringProperty(object, actual, deserialize$1(ctx, depth, value));
				break;
			case "symbol":
				if (isValidSymbol(actual)) object[actual] = deserialize$1(ctx, depth, value);
				break;
			default: throw new SerovalMalformedNodeError(key);
		}
	}
}
function assignNodeType(ctx, id, type) {
	ctx.base.refs.types.set(id, type);
}
function validateNodeType(ctx, node, id, type) {
	if (ctx.base.refs.types.get(id) !== type) throw new SerovalMalformedNodeError(node);
}
function deserializeProperties(ctx, depth, node, result) {
	const keys = node.k;
	validateNodeList(node, keys);
	validateNodeList(node, node.v);
	const len = keys.length;
	if (len > 0) for (let i = 0, vals = node.v; i < len; i++) assignProperty(ctx, depth, result, keys[i], vals[i]);
	return result;
}
function deserializeObject(ctx, depth, node) {
	const result = assignIndexedValue$1(ctx, node.i, node.t === 10 ? {} : Object.create(null));
	deserializeProperties(ctx, depth, node.p, result);
	applyObjectFlag(result, node.o);
	return result;
}
function deserializeDate(ctx, node) {
	return assignIndexedValue$1(ctx, node.i, new Date(node.s));
}
function deserializeTemporal(ctx, node) {
	if (!(ctx.base.features & 64)) throw new SerovalUnsupportedNodeError(node);
	const construct = Temporal[deserializeKnownValue(node, TEMPORAL_TYPE_NAME, node.c)];
	return assignIndexedValue$1(ctx, node.i, construct.from(node.s));
}
function deserializeRegExp(ctx, node) {
	if (ctx.base.features & 32) {
		const source = deserializeString(node.c);
		if (source.length > MAX_REGEXP_SOURCE_LENGTH) throw new SerovalMalformedNodeError(node);
		return assignIndexedValue$1(ctx, node.i, new RegExp(source, node.m));
	}
	throw new SerovalUnsupportedNodeError(node);
}
function deserializeSet(ctx, depth, node) {
	const result = assignIndexedValue$1(ctx, node.i, /* @__PURE__ */ new Set());
	validateNodeList(node, node.a);
	for (let i = 0, items = node.a, len = items.length; i < len; i++) result.add(deserialize$1(ctx, depth, items[i]));
	return result;
}
function deserializeMap(ctx, depth, node) {
	const result = assignIndexedValue$1(ctx, node.i, /* @__PURE__ */ new Map());
	validateNodeList(node, node.e.k);
	validateNodeList(node, node.e.v);
	for (let i = 0, keys = node.e.k, vals = node.e.v, len = keys.length; i < len; i++) result.set(deserialize$1(ctx, depth, keys[i]), deserialize$1(ctx, depth, vals[i]));
	return result;
}
function deserializeArrayBuffer(ctx, node) {
	if (typeof node.s !== "string") throw new SerovalMalformedNodeError(node);
	if (node.s.length > ctx.base.maxBase64Length) throw new RangeError("ArrayBuffer exceeds maxBase64Length (" + ctx.base.maxBase64Length + ")");
	const buffer = decodeArrayBuffer(deserializeString(node.s));
	return assignIndexedValue$1(ctx, node.i, buffer);
}
function deserializeView(ctx, depth, node, construct) {
	const source = deserialize$1(ctx, depth, node.f);
	if (!(source instanceof ArrayBuffer)) throw new SerovalMalformedNodeError(node);
	const offset = node.b ?? 0;
	if (offset < 0 || offset > source.byteLength) throw new SerovalMalformedNodeError(node);
	return assignIndexedValue$1(ctx, node.i, construct ? new construct(source, offset, node.l) : new DataView(source, offset, node.l));
}
function deserializeDictionary(ctx, depth, node, result) {
	if (node.p) {
		const fields = deserializeProperties(ctx, depth, node.p, {});
		Object.defineProperties(result, Object.getOwnPropertyDescriptors(fields));
	}
	return result;
}
function deserializeAggregateError(ctx, depth, node) {
	return deserializeDictionary(ctx, depth, node, assignIndexedValue$1(ctx, node.i, new AggregateError([], deserializeString(node.m))));
}
function deserializeError(ctx, depth, node) {
	const construct = deserializeKnownValue(node, ERROR_CONSTRUCTOR, node.s);
	return deserializeDictionary(ctx, depth, node, assignIndexedValue$1(ctx, node.i, new construct(deserializeString(node.m))));
}
function deserializePromise(ctx, depth, node) {
	const deferred = PROMISE_CONSTRUCTOR();
	const result = assignIndexedValue$1(ctx, node.i, deferred.p);
	const deserialized = deserialize$1(ctx, depth, node.f);
	if (isThennable(deserialized)) throw new SerovalMalformedNodeError(node.f);
	if (node.s) deferred.s(deserialized);
	else deferred.f(deserialized);
	return result;
}
function deserializeBoxed(ctx, depth, node) {
	return assignIndexedValue$1(ctx, node.i, Object(deserialize$1(ctx, depth, node.f)));
}
function deserializePlugin(ctx, depth, node) {
	const currentPlugins = ctx.base.plugins;
	if (currentPlugins) {
		const tag = deserializeString(node.c);
		for (let i = 0, len = currentPlugins.length; i < len; i++) {
			const plugin = currentPlugins[i];
			if (plugin.tag === tag) return assignIndexedValue$1(ctx, node.i, plugin.deserialize(node.s, { deserialize: (current) => deserialize$1(ctx, depth, current) }, { id: node.i }));
		}
	}
	throw new SerovalMissingPluginError(node.c);
}
function deserializePromiseConstructor(ctx, node) {
	const value = assignIndexedValue$1(ctx, node.i, assignIndexedValue$1(ctx, node.s, PROMISE_CONSTRUCTOR()).p);
	assignNodeType(ctx, node.s, 22);
	ctx.base.pending?.add(node.s);
	return value;
}
function deserializePromiseFulfill(ctx, depth, node) {
	const deferred = ctx.base.refs.get(node.i);
	if (deferred) {
		validateNodeType(ctx, node, node.i, 22);
		const deserialized = deserialize$1(ctx, depth, node.a[1]);
		if (isThennable(deserialized)) throw new SerovalMalformedNodeError(node.a[1]);
		if (node.t === 23) deferred.s(deserialized);
		else deferred.f(deserialized);
		ctx.base.pending?.delete(node.i);
		return;
	}
	throw new SerovalMissingInstanceError("Promise");
}
function deserializeIteratorFactoryInstance(ctx, depth, node) {
	deserialize$1(ctx, depth, node.a[0]);
	const source = deserialize$1(ctx, depth, node.a[1]);
	if (!isSequence(source)) throw new SerovalMalformedNodeError(node.a[1]);
	return sequenceToIterator(source);
}
function deserializeAsyncIteratorFactoryInstance(ctx, depth, node) {
	deserialize$1(ctx, depth, node.a[0]);
	const source = deserialize$1(ctx, depth, node.a[1]);
	if (!isStream(source)) throw new SerovalMalformedNodeError(node.a[1]);
	return streamToAsyncIterable(source);
}
function deserializeStreamConstructor(ctx, depth, node) {
	const result = assignIndexedValue$1(ctx, node.i, new Stream(node.l === 1 ? 1 : void 0));
	assignNodeType(ctx, node.i, 31);
	ctx.base.pending?.add(node.i);
	const items = node.a;
	validateNodeList(node, items);
	const len = items.length;
	if (len) for (let i = 0; i < len; i++) deserialize$1(ctx, depth, items[i]);
	return result;
}
function deserializeStreamCall(ctx, depth, node, method) {
	const deferred = ctx.base.refs.get(node.i);
	if (deferred) {
		validateNodeType(ctx, node, node.i, 31);
		deferred[method](deserialize$1(ctx, depth, node.f));
		if (method !== "next") ctx.base.pending?.delete(node.i);
		return;
	}
	throw new SerovalMissingInstanceError("Stream");
}
function deserializeIteratorFactory(ctx, depth, node) {
	deserialize$1(ctx, depth, node.f);
}
function deserializeAsyncIteratorFactory(ctx, depth, node) {
	deserialize$1(ctx, depth, node.a[1]);
}
function isSequenceIndex(value, size) {
	return Number.isInteger(value) && value >= -1 && value < size;
}
function deserializeSequence(ctx, depth, node) {
	validateNodeList(node, node.a);
	const size = node.a.length;
	if (!(isSequenceIndex(node.s, size) && isSequenceIndex(node.l, size))) throw new SerovalMalformedNodeError(node);
	const result = assignIndexedValue$1(ctx, node.i, createSequence([], node.s, node.l));
	assignNodeType(ctx, node.i, 35);
	for (let i = 0; i < size; i++) result.v[i] = deserialize$1(ctx, depth, node.a[i]);
	return result;
}
function deserialize$1(ctx, depth, node) {
	if (depth > ctx.base.depthLimit) throw new SerovalDepthLimitError(ctx.base.depthLimit);
	depth += 1;
	switch (node.t) {
		case 2: return deserializeKnownValue(node, CONSTANT_VAL, node.s);
		case 0: return Number(node.s);
		case 1: return deserializeString(String(node.s));
		case 3:
			if (String(node.s).length > MAX_BIGINT_LENGTH) throw new SerovalMalformedNodeError(node);
			return BigInt(node.s);
		case 4: return ctx.base.refs.get(node.i);
		case 18: return deserializeReference(ctx, node);
		case 9: return deserializeArray(ctx, depth, node);
		case 10:
		case 11: return deserializeObject(ctx, depth, node);
		case 5: return deserializeDate(ctx, node);
		case 6: return deserializeRegExp(ctx, node);
		case 7: return deserializeSet(ctx, depth, node);
		case 8: return deserializeMap(ctx, depth, node);
		case 19: return deserializeArrayBuffer(ctx, node);
		case 16:
		case 15: return deserializeView(ctx, depth, node, getTypedArrayConstructor(node.c));
		case 20: return deserializeView(ctx, depth, node);
		case 14: return deserializeAggregateError(ctx, depth, node);
		case 13: return deserializeError(ctx, depth, node);
		case 12: return deserializePromise(ctx, depth, node);
		case 17: return deserializeKnownValue(node, SYMBOL_REF, node.s);
		case 21: return deserializeBoxed(ctx, depth, node);
		case 25: return deserializePlugin(ctx, depth, node);
		case 22: return deserializePromiseConstructor(ctx, node);
		case 23:
		case 24: return deserializePromiseFulfill(ctx, depth, node);
		case 28: return deserializeIteratorFactoryInstance(ctx, depth, node);
		case 30: return deserializeAsyncIteratorFactoryInstance(ctx, depth, node);
		case 31: return deserializeStreamConstructor(ctx, depth, node);
		case 32: return deserializeStreamCall(ctx, depth, node, "next");
		case 33: return deserializeStreamCall(ctx, depth, node, "throw");
		case 34: return deserializeStreamCall(ctx, depth, node, "return");
		case 27: return deserializeIteratorFactory(ctx, depth, node);
		case 29: return deserializeAsyncIteratorFactory(ctx, depth, node);
		case 35: return deserializeSequence(ctx, depth, node);
		case 36: return deserializeTemporal(ctx, node);
		default: throw new SerovalUnsupportedNodeError(node);
	}
}
function deserializeTop(ctx, node) {
	try {
		return deserialize$1(ctx, 0, node);
	} catch (error) {
		throw new SerovalDeserializationError(error);
	}
}
var RETURN = () => T;
var IS_MODERN = /* @__PURE__ */ (/* @__PURE__ */ RETURN.toString()).includes("=>");
function createFunction(parameters, body) {
	if (IS_MODERN) return (parameters.length === 1 ? parameters[0] : "(" + parameters.join(",") + ")") + "=>" + (body.startsWith("{") ? "(" + body + ")" : body);
	return "function(" + parameters.join(",") + "){return " + body + "}";
}
function createEffectfulFunction(parameters, body) {
	if (IS_MODERN) return (parameters.length === 1 ? parameters[0] : "(" + parameters.join(",") + ")") + "=>{" + body + "}";
	return "function(" + parameters.join(",") + "){" + body + "}";
}
var REF_START_CHARS = "hjkmoquxzABCDEFGHIJKLNPQRTUVWXYZ$_";
var REF_START_CHARS_LEN = 34;
var REF_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$_";
var REF_CHARS_LEN = 64;
function getIdentifier(index) {
	let mod = index % REF_START_CHARS_LEN;
	let ref = REF_START_CHARS[mod];
	index = (index - mod) / REF_START_CHARS_LEN;
	while (index > 0) {
		mod = index % REF_CHARS_LEN;
		ref += REF_CHARS[mod];
		index = (index - mod) / REF_CHARS_LEN;
	}
	return ref;
}
function isValidIdentifier(name) {
	const len = name.length;
	for (let i = 0; i < len; i++) {
		const code = name.charCodeAt(i);
		if (!(code >= 97 && code <= 122 || code >= 65 && code <= 90 || code >= 48 && code <= 57 && i > 0 || code === 95 || code === 36)) return false;
	}
	return len > 0;
}
function getAssignmentExpression(assignment) {
	switch (assignment.t) {
		case 0: return assignment.s + "=" + assignment.v;
		case 2: return assignment.s + ".set(" + assignment.k + "," + assignment.v + ")";
		case 1: return assignment.s + ".add(" + assignment.v + ")";
		case 3: return assignment.s + ".delete(" + assignment.k + ")";
		case 4: return "Object.defineProperty(" + assignment.s + ",\"__proto__\",{value:" + assignment.k + ",configurable:!0,enumerable:!0,writable:!0})";
	}
}
var MAX_ASSIGNMENT_CHAIN_LENGTH = 100;
function resolveAssignments(assignments) {
	if (!assignments.length) return void 0;
	let previous = assignments[0];
	let expression = getAssignmentExpression(previous);
	let result = "";
	let chainLength = 1;
	for (let index = 1, length = assignments.length; index < length; index++) {
		const assignment = assignments[index];
		if (chainLength === MAX_ASSIGNMENT_CHAIN_LENGTH) {
			result += expression + ",";
			expression = getAssignmentExpression(assignment);
			chainLength = 0;
		} else if (assignment.t === 0 && previous.t === 0 && assignment.v === previous.v) expression = assignment.s + "=" + expression;
		else if (assignment.t === 2 && previous.t === 2 && assignment.s === previous.s) expression += ".set(" + assignment.k + "," + assignment.v + ")";
		else if (assignment.t === 1 && previous.t === 1 && assignment.s === previous.s) expression += ".add(" + assignment.v + ")";
		else if (assignment.t === 3 && previous.t === 2 && assignment.s === previous.s) expression += ".delete(" + assignment.k + ")";
		else {
			result += expression + ",";
			expression = getAssignmentExpression(assignment);
			chainLength = 0;
		}
		chainLength++;
		previous = assignment;
	}
	return result + expression + ",";
}
var NULL_CONSTRUCTOR = "Object.create(null)";
var SET_CONSTRUCTOR = "new Set";
var MAP_CONSTRUCTOR = "new Map";
var PROMISE_RESOLVE = "Promise.resolve";
var PROMISE_REJECT = "Promise.reject";
var OBJECT_FLAG_CONSTRUCTOR = {
	[3]: "Object.freeze",
	[2]: "Object.seal",
	[1]: "Object.preventExtensions",
	[0]: void 0
};
function createBaseSerializerContext(mode, options) {
	return {
		mode,
		plugins: options.plugins,
		features: options.features,
		marked: Array.isArray(options.markedRefs) ? new Set(options.markedRefs) : options.markedRefs,
		stack: [],
		flags: [],
		assignments: [],
		assignAll: mode === 2 && !options.assignSharedRefsOnly
	};
}
function createCrossSerializerContext(options) {
	return {
		mode: 2,
		base: createBaseSerializerContext(2, options),
		state: options
	};
}
/**
* Creates the reference param (identifier) from the given reference ID
* Calling this function means the value has been referenced somewhere
*/
function getVanillaRefParam(state, index) {
	/**
	* Creates a new reference ID from a given reference ID
	* This new reference ID means that the reference itself
	* has been referenced at least once, and is used to generate
	* the variables
	*/
	let actualIndex = state.valid.get(index);
	if (actualIndex == null) {
		actualIndex = state.valid.size;
		state.valid.set(index, actualIndex);
	}
	let identifier = state.vars[actualIndex];
	if (identifier == null) {
		identifier = getIdentifier(actualIndex);
		state.vars[actualIndex] = identifier;
	}
	return identifier;
}
function getCrossRefParam(id) {
	return "$R[" + id + "]";
}
/**
* Converts the ID of a reference into a identifier string
* that is used to refer to the object instance in the
* generated script.
*/
function getRefParam(ctx, id) {
	return ctx.mode === 1 ? getVanillaRefParam(ctx.state, id) : getCrossRefParam(id);
}
function markSerializerRef(ctx, id) {
	ctx.marked.add(id);
}
function isSerializerRefMarked(ctx, id) {
	return ctx.marked.has(id);
}
function pushObjectFlag(ctx, flag, id) {
	if (flag !== 0) {
		markSerializerRef(ctx.base, id);
		ctx.base.flags.push({
			type: flag,
			value: getRefParam(ctx, id)
		});
	}
}
function resolveFlags(ctx) {
	let result = "";
	for (let i = 0, current = ctx.flags, len = current.length; i < len; i++) {
		const flag = current[i];
		result += OBJECT_FLAG_CONSTRUCTOR[flag.type] + "(" + flag.value + "),";
	}
	return result;
}
function resolvePatches(ctx) {
	const assignments = resolveAssignments(ctx.assignments);
	const flags = resolveFlags(ctx);
	if (assignments) {
		if (flags) return assignments + flags;
		return assignments;
	}
	return flags;
}
/**
* Generates the inlined assignment for the reference
* This is different from the assignments array as this one
* signifies creation rather than mutation
*/
function createAssignment(ctx, source, value) {
	ctx.assignments.push({
		t: 0,
		s: source,
		k: void 0,
		v: value
	});
}
function createAddAssignment(ctx, ref, value) {
	ctx.base.assignments.push({
		t: 1,
		s: getRefParam(ctx, ref),
		k: void 0,
		v: value
	});
}
function createSetAssignment(ctx, ref, key, value) {
	ctx.base.assignments.push({
		t: 2,
		s: getRefParam(ctx, ref),
		k: key,
		v: value
	});
}
function createDeleteAssignment(ctx, ref, key) {
	ctx.base.assignments.push({
		t: 3,
		s: getRefParam(ctx, ref),
		k: key,
		v: void 0
	});
}
function createArrayAssign(ctx, ref, index, value) {
	createAssignment(ctx.base, getRefParam(ctx, ref) + "[" + index + "]", value);
}
function createObjectAssign(ctx, ref, key, value) {
	if (key === "__proto__") {
		ctx.base.assignments.push({
			t: 4,
			s: getRefParam(ctx, ref),
			k: value,
			v: void 0
		});
		return;
	}
	createAssignment(ctx.base, getRefParam(ctx, ref) + "." + key, value);
}
function createSequenceAssign(ctx, ref, index, value) {
	createAssignment(ctx.base, getRefParam(ctx, ref) + ".v[" + index + "]", value);
}
/**
* Checks if the value is in the stack. Stack here is a reference
* structure to know if a object is to be accessed in a TDZ.
*/
function getKeyKind(key) {
	const first = key.charCodeAt(0);
	if (first >= 48 && first <= 57) {
		const check = Number(key);
		return check >= 0 && check.toString() === key ? 2 : 0;
	}
	if (key === "Infinity") return 2;
	return isValidIdentifier(key) ? 1 : 0;
}
function isIndexedValueInStack(ctx, node) {
	return node.t === 4 && ctx.stack.includes(node.i);
}
/**
* Checks if the node, or any node inside it, is read from more than one
* place. Such a node must not be created inside a deferred assignment,
* because the places that read it may run before the assignment does.
*/
function hasMarkedNode(ctx, node) {
	if (Array.isArray(node)) {
		for (let i = 0, len = node.length; i < len; i++) if (hasMarkedNode(ctx, node[i])) return true;
		return false;
	}
	if (node == null || typeof node !== "object") return false;
	const current = node;
	if (current.t !== 4 && typeof current.i === "number" && isSerializerRefMarked(ctx, current.i)) return true;
	for (const key in current) if (hasMarkedNode(ctx, current[key])) return true;
	return false;
}
/**
* Produces an assignment expression. `id` generates a reference
* parameter (through `getRefParam`) and has the option to
* return the reference parameter directly or assign a value to
* it.
*/
function assignIndexedValue(ctx, index, value) {
	if (!ctx.base.assignAll && !isSerializerRefMarked(ctx.base, index)) return value;
	/**
	* In cross-reference, we have to assume that
	* every reference are going to be referenced
	* in the future, and so we need to store
	* all of it into the reference array.
	*
	* otherwise in vanilla, we only do this if it
	* is actually referenced. `assignSharedRefsOnly` gives cross-reference
	* output the vanilla behavior.
	*/
	return getRefParam(ctx, index) + "=" + value;
}
function serializeReference(node) {
	return REFERENCES_KEY + ".get(\"" + node.s + "\")";
}
function serializeArrayItem(ctx, id, item, index) {
	if (item) {
		if (isIndexedValueInStack(ctx.base, item)) {
			markSerializerRef(ctx.base, id);
			createArrayAssign(ctx, id, index, getRefParam(ctx, item.i));
			return "";
		}
		return serialize$1(ctx, item);
	}
	return "";
}
function serializeArray(ctx, node) {
	const id = node.i;
	const list = node.a;
	const len = list.length;
	if (len > 0) {
		ctx.base.stack.push(id);
		let values = serializeArrayItem(ctx, id, list[0], 0);
		let isHoley = values === "";
		for (let i = 1, item; i < len; i++) {
			item = serializeArrayItem(ctx, id, list[i], i);
			values += "," + item;
			isHoley = item === "";
		}
		ctx.base.stack.pop();
		pushObjectFlag(ctx, node.o, node.i);
		return "[" + values + (isHoley ? ",]" : "]");
	}
	return "[]";
}
function serializeProperty(ctx, source, key, val) {
	if (typeof key === "string") {
		const kind = getKeyKind(key);
		if (isIndexedValueInStack(ctx.base, val)) {
			const refParam = getRefParam(ctx, val.i);
			markSerializerRef(ctx.base, source.i);
			if (kind === 1) createObjectAssign(ctx, source.i, key, refParam);
			else createArrayAssign(ctx, source.i, kind === 2 ? key : "\"" + key + "\"", refParam);
			return "";
		}
		if (key !== "__proto__") return (kind === 0 ? "\"" + key + "\"" : key) + ":" + serialize$1(ctx, val);
		return "[\"" + key + "\"]:" + serialize$1(ctx, val);
	}
	return "[" + serialize$1(ctx, key) + "]:" + serialize$1(ctx, val);
}
function serializeProperties(ctx, source, record) {
	const keys = record.k;
	const len = keys.length;
	if (len > 0) {
		const values = record.v;
		ctx.base.stack.push(source.i);
		let result = serializeProperty(ctx, source, keys[0], values[0]);
		for (let i = 1, item; i < len; i++) {
			item = serializeProperty(ctx, source, keys[i], values[i]);
			result += (item && result && ",") + item;
		}
		ctx.base.stack.pop();
		return "{" + result + "}";
	}
	return "{}";
}
function serializeObject(ctx, node) {
	pushObjectFlag(ctx, node.o, node.i);
	return serializeProperties(ctx, node, node.p);
}
function serializeWithObjectAssign(ctx, source, value, serialized) {
	const fields = serializeProperties(ctx, source, value);
	if (fields !== "{}") return "Object.assign(" + serialized + "," + fields + ")";
	return serialized;
}
function serializeStringKeyAssignment(ctx, source, mainAssignments, key, value) {
	const base = ctx.base;
	const serialized = serialize$1(ctx, value);
	const parentAssignment = base.assignments;
	if (!isIndexedValueInStack(base, value)) base.assignments = mainAssignments;
	createKeyAssign(ctx, source.i, getKeyKind(key), key, serialized);
	base.assignments = parentAssignment;
}
function createKeyAssign(ctx, ref, kind, key, value) {
	if (kind === 1) createObjectAssign(ctx, ref, key, value);
	else createArrayAssign(ctx, ref, kind === 2 ? key : "\"" + key + "\"", value);
}
function serializeAssignment(ctx, source, mainAssignments, key, value) {
	if (typeof key === "string") serializeStringKeyAssignment(ctx, source, mainAssignments, key, value);
	else {
		const base = ctx.base;
		const parent = base.stack;
		base.stack = [];
		const serialized = serialize$1(ctx, value);
		base.stack = parent;
		const parentAssignment = base.assignments;
		base.assignments = mainAssignments;
		createArrayAssign(ctx, source.i, serialize$1(ctx, key), serialized);
		base.assignments = parentAssignment;
	}
}
function serializeAssignments(ctx, source, node) {
	const keys = node.k;
	const len = keys.length;
	if (len > 0) {
		const mainAssignments = [];
		const values = node.v;
		ctx.base.stack.push(source.i);
		for (let i = 0; i < len; i++) serializeAssignment(ctx, source, mainAssignments, keys[i], values[i]);
		ctx.base.stack.pop();
		return resolveAssignments(mainAssignments);
	}
}
function serializeDictionary(ctx, node, init) {
	if (node.p) {
		const base = ctx.base;
		if (base.features & 8 && !node.p.k.includes("__proto__")) init = serializeWithObjectAssign(ctx, node, node.p, init);
		else {
			markSerializerRef(base, node.i);
			const assignments = serializeAssignments(ctx, node, node.p);
			if (assignments) return "(" + assignIndexedValue(ctx, node.i, init) + "," + assignments + getRefParam(ctx, node.i) + ")";
		}
	}
	return init;
}
function serializeNullConstructor(ctx, node) {
	pushObjectFlag(ctx, node.o, node.i);
	return serializeDictionary(ctx, node, NULL_CONSTRUCTOR);
}
function serializeDate(node) {
	return "new Date(\"" + node.s + "\")";
}
function serializeTemporal(ctx, node) {
	if (ctx.base.features & 64) return "Temporal." + TEMPORAL_TYPE_NAME[node.c] + ".from(\"" + node.s + "\")";
	throw new SerovalUnsupportedNodeError(node);
}
function serializeRegExp(ctx, node) {
	if (ctx.base.features & 32) {
		if (node.c.includes("\\x3C")) return "new RegExp(\"" + node.c + "\",\"" + node.m + "\")";
		return "/" + deserializeString(node.c) + "/" + node.m;
	}
	throw new SerovalUnsupportedNodeError(node);
}
function serializeSetItem(ctx, id, item) {
	const base = ctx.base;
	if (isIndexedValueInStack(base, item)) {
		markSerializerRef(base, id);
		createAddAssignment(ctx, id, getRefParam(ctx, item.i));
		return "";
	}
	return serialize$1(ctx, item);
}
function serializeSet(ctx, node) {
	let serialized = SET_CONSTRUCTOR;
	const items = node.a;
	const size = items.length;
	const id = node.i;
	if (size > 0) {
		ctx.base.stack.push(id);
		let result = serializeSetItem(ctx, id, items[0]);
		for (let i = 1, item; i < size; i++) {
			item = serializeSetItem(ctx, id, items[i]);
			result += (item && result && ",") + item;
		}
		ctx.base.stack.pop();
		if (result) serialized += "([" + result + "])";
	}
	return serialized;
}
function serializeMapEntry(ctx, id, key, val, getSentinel) {
	const base = ctx.base;
	if (isIndexedValueInStack(base, key)) {
		const keyRef = getRefParam(ctx, key.i);
		markSerializerRef(base, id);
		if (isIndexedValueInStack(base, val)) {
			createSetAssignment(ctx, id, keyRef, getRefParam(ctx, val.i));
			return "";
		}
		if (val.t !== 4 && val.i != null && hasMarkedNode(base, val)) {
			markSerializerRef(base, val.i);
			const sentinel = getSentinel();
			const serialized = "(" + serialize$1(ctx, val) + ",[" + sentinel + "," + sentinel + "])";
			createSetAssignment(ctx, id, keyRef, getRefParam(ctx, val.i));
			createDeleteAssignment(ctx, id, sentinel);
			return serialized;
		}
		const parent = base.stack;
		base.stack = [];
		createSetAssignment(ctx, id, keyRef, serialize$1(ctx, val));
		base.stack = parent;
		return "";
	}
	if (isIndexedValueInStack(base, val)) {
		const valueRef = getRefParam(ctx, val.i);
		markSerializerRef(base, id);
		if (key.t !== 4 && key.i != null && hasMarkedNode(base, key)) {
			markSerializerRef(base, key.i);
			const sentinel = getSentinel();
			const serialized = "(" + serialize$1(ctx, key) + ",[" + sentinel + "," + sentinel + "])";
			createSetAssignment(ctx, id, getRefParam(ctx, key.i), valueRef);
			createDeleteAssignment(ctx, id, sentinel);
			return serialized;
		}
		const parent = base.stack;
		base.stack = [];
		createSetAssignment(ctx, id, serialize$1(ctx, key), valueRef);
		base.stack = parent;
		return "";
	}
	return "[" + serialize$1(ctx, key) + "," + serialize$1(ctx, val) + "]";
}
function serializeMap(ctx, node) {
	let serialized = MAP_CONSTRUCTOR;
	const keys = node.e.k;
	const size = keys.length;
	const id = node.i;
	const sentinel = node.f;
	let sentinelRef;
	const getSentinel = () => {
		if (sentinelRef == null) {
			sentinelRef = getRefParam(ctx, sentinel.i);
			if (ctx.mode === 1) ctx.state.sentinels.add(ctx.state.valid.get(sentinel.i));
		}
		return sentinelRef;
	};
	const base = ctx.base;
	if (size > 0) {
		const vals = node.e.v;
		base.stack.push(id);
		let result = serializeMapEntry(ctx, id, keys[0], vals[0], getSentinel);
		for (let i = 1, item; i < size; i++) {
			item = serializeMapEntry(ctx, id, keys[i], vals[i], getSentinel);
			result += (item && result && ",") + item;
		}
		base.stack.pop();
		if (result) serialized += "([" + result + "])";
	}
	if (ctx.mode === 2 && sentinel.t === 26) {
		markSerializerRef(base, sentinel.i);
		serialized = "(" + serialize$1(ctx, sentinel) + "," + serialized + ")";
	}
	return serialized;
}
function serializeArrayBuffer(ctx, node) {
	return getConstructor(ctx, node.f) + "(\"" + node.s + "\")";
}
function serializeView(ctx, node) {
	return "new " + (node.t === 20 ? "DataView" : node.c) + "(" + serialize$1(ctx, node.f) + "," + node.b + "," + node.l + ")";
}
function serializeAggregateError(ctx, node) {
	const id = node.i;
	ctx.base.stack.push(id);
	const serialized = serializeDictionary(ctx, node, "new AggregateError([],\"" + node.m + "\")");
	ctx.base.stack.pop();
	return serialized;
}
function serializeError(ctx, node) {
	return serializeDictionary(ctx, node, "new " + ERROR_CONSTRUCTOR_STRING[node.s] + "(\"" + node.m + "\")");
}
function serializePromise(ctx, node) {
	let serialized;
	const fulfilled = node.f;
	const id = node.i;
	const promiseConstructor = node.s ? PROMISE_RESOLVE : PROMISE_REJECT;
	const base = ctx.base;
	if (isIndexedValueInStack(base, fulfilled)) {
		const ref = getRefParam(ctx, fulfilled.i);
		serialized = promiseConstructor + (node.s ? "().then(" + createFunction([], ref) + ")" : "().catch(" + createEffectfulFunction([], "throw " + ref) + ")");
	} else {
		base.stack.push(id);
		const result = serialize$1(ctx, fulfilled);
		base.stack.pop();
		serialized = promiseConstructor + "(" + result + ")";
	}
	return serialized;
}
function serializeBoxed(ctx, node) {
	return "Object(" + serialize$1(ctx, node.f) + ")";
}
function getConstructor(ctx, node) {
	const current = serialize$1(ctx, node);
	return node.t === 4 ? current : "(" + current + ")";
}
function serializePromiseConstructor(ctx, node) {
	if (ctx.mode === 1) throw new SerovalUnsupportedNodeError(node);
	return "(" + assignIndexedValue(ctx, node.s, getConstructor(ctx, node.f) + "()") + ").p";
}
function serializePromiseResult(ctx, node) {
	if (ctx.mode === 1) throw new SerovalUnsupportedNodeError(node);
	return getConstructor(ctx, node.a[0]) + "(" + getRefParam(ctx, node.i) + "," + serialize$1(ctx, node.a[1]) + ")";
}
function serializePlugin(ctx, node) {
	const currentPlugins = ctx.base.plugins;
	if (currentPlugins) for (let i = 0, len = currentPlugins.length; i < len; i++) {
		const plugin = currentPlugins[i];
		if (plugin.tag === node.c) return plugin.serialize(node.s, { serialize: (current) => serialize$1(ctx, current) }, { id: node.i });
	}
	throw new SerovalMissingPluginError(node.c);
}
function serializeIteratorFactory(ctx, node) {
	let result = "";
	let initialized = false;
	if (node.f.t !== 4) {
		markSerializerRef(ctx.base, node.f.i);
		result = "(" + serialize$1(ctx, node.f) + ",";
		initialized = true;
	}
	result += assignIndexedValue(ctx, node.i, "(" + SERIALIZED_ITERATOR_CONSTRUCTOR + ")(" + getRefParam(ctx, node.f.i) + ")");
	if (initialized) result += ")";
	return result;
}
function serializeIteratorFactoryInstance(ctx, node) {
	return getConstructor(ctx, node.a[0]) + "(" + serialize$1(ctx, node.a[1]) + ")";
}
function serializeAsyncIteratorFactory(ctx, node) {
	const promise = node.a[0];
	const symbol = node.a[1];
	const base = ctx.base;
	let result = "";
	if (promise.t !== 4) {
		markSerializerRef(base, promise.i);
		result += "(" + serialize$1(ctx, promise);
	}
	if (symbol.t !== 4) {
		markSerializerRef(base, symbol.i);
		result += (result ? "," : "(") + serialize$1(ctx, symbol);
	}
	if (result) result += ",";
	const iterator = assignIndexedValue(ctx, node.i, "(" + SERIALIZED_ASYNC_ITERATOR_CONSTRUCTOR + ")(" + getRefParam(ctx, symbol.i) + "," + getRefParam(ctx, promise.i) + ")");
	if (result) return result + iterator + ")";
	return iterator;
}
function serializeStreamConstructor(ctx, node) {
	const result = assignIndexedValue(ctx, node.i, getConstructor(ctx, node.f) + (node.l === 1 ? "(1)" : "()"));
	const len = node.a.length;
	if (len) {
		let values = serialize$1(ctx, node.a[0]);
		for (let i = 1; i < len; i++) values += "," + serialize$1(ctx, node.a[i]);
		return "(" + result + "," + values + "," + getRefParam(ctx, node.i) + ")";
	}
	return result;
}
function serializeStreamCall(ctx, node, method) {
	return getRefParam(ctx, node.i) + "." + method + "(" + serialize$1(ctx, node.f) + ")";
}
function serializeSequenceItem(ctx, id, index, item) {
	const base = ctx.base;
	if (isIndexedValueInStack(base, item)) {
		markSerializerRef(base, id);
		createSequenceAssign(ctx, id, index, getRefParam(ctx, item.i));
		return "";
	}
	return serialize$1(ctx, item);
}
function serializeSequence(ctx, node) {
	const items = node.a;
	const size = items.length;
	const id = node.i;
	if (size > 0) {
		ctx.base.stack.push(id);
		let result = serializeSequenceItem(ctx, id, 0, items[0]);
		for (let i = 1, item; i < size; i++) {
			item = serializeSequenceItem(ctx, id, i, items[i]);
			result += (item && result && ",") + item;
		}
		ctx.base.stack.pop();
		if (result) return "{__SEROVAL_SEQUENCE__:!0,v:[" + result + "],t:" + node.s + ",d:" + node.l + "}";
	}
	return "{__SEROVAL_SEQUENCE__:!0,v:[],t:-1,d:0}";
}
function serializeAssignable(ctx, node) {
	switch (node.t) {
		case 17: return SYMBOL_STRING[node.s];
		case 18: return serializeReference(node);
		case 9: return serializeArray(ctx, node);
		case 10: return serializeObject(ctx, node);
		case 11: return serializeNullConstructor(ctx, node);
		case 5: return serializeDate(node);
		case 6: return serializeRegExp(ctx, node);
		case 7: return serializeSet(ctx, node);
		case 8: return serializeMap(ctx, node);
		case 19: return serializeArrayBuffer(ctx, node);
		case 16:
		case 15:
		case 20: return serializeView(ctx, node);
		case 14: return serializeAggregateError(ctx, node);
		case 13: return serializeError(ctx, node);
		case 12: return serializePromise(ctx, node);
		case 21: return serializeBoxed(ctx, node);
		case 22: return serializePromiseConstructor(ctx, node);
		case 25: return serializePlugin(ctx, node);
		case 26: return SPECIAL_REF_STRING[node.s];
		case 35: return serializeSequence(ctx, node);
		case 36: return serializeTemporal(ctx, node);
		default: throw new SerovalUnsupportedNodeError(node);
	}
}
function serialize$1(ctx, node) {
	switch (node.t) {
		case 2: return CONSTANT_STRING[node.s];
		case 0: return "" + node.s;
		case 1: return "\"" + node.s + "\"";
		case 3: return node.s + "n";
		case 4: return getRefParam(ctx, node.i);
		case 23:
		case 24: return serializePromiseResult(ctx, node);
		case 27: return serializeIteratorFactory(ctx, node);
		case 28:
		case 30: return serializeIteratorFactoryInstance(ctx, node);
		case 29: return serializeAsyncIteratorFactory(ctx, node);
		case 31: return serializeStreamConstructor(ctx, node);
		case 32: return serializeStreamCall(ctx, node, "next");
		case 33: return serializeStreamCall(ctx, node, "throw");
		case 34: return serializeStreamCall(ctx, node, "return");
		default: return assignIndexedValue(ctx, node.i, serializeAssignable(ctx, node));
	}
}
function serializeCross(ctx, tree) {
	const result = serialize$1(ctx, tree);
	const id = tree.i;
	if (id == null) return result;
	const patches = resolvePatches(ctx.base);
	const ref = getRefParam(ctx, id);
	const scopeId = ctx.state.scopeId;
	const params = scopeId == null ? "" : "$R";
	let body = result;
	if (patches) {
		if (!ctx.base.assignAll && !result.startsWith(ref + "=")) body = ref + "=" + result;
		body = "(" + body + "," + patches + ref + ")";
	}
	if (params === "") {
		if (tree.t === 10 && !patches) return "(" + body + ")";
		return body;
	}
	const args = scopeId == null ? "()" : "($R[\"" + serializeString(scopeId) + "\"])";
	return "(" + createFunction([params], body) + ")" + args;
}
function wrapSerializationError(error) {
	return error instanceof SerovalSerializationError ? error : new SerovalSerializationError(error);
}
function serializeTopCross(ctx, tree) {
	try {
		return serializeCross(ctx, tree);
	} catch (error) {
		throw wrapSerializationError(error);
	}
}
function parseItems(ctx, depth, current) {
	const len = current.length;
	const nodes = new Array(len);
	for (let i = 0; i < len; i++) if (i in current) nodes[i] = parseSOS(ctx, depth, current[i]);
	else nodes[i] = 0;
	return nodes;
}
function parseArray(ctx, depth, id, current) {
	return createArrayNode(id, current, parseItems(ctx, depth, current));
}
function parseProperties(ctx, depth, properties) {
	const keys = Object.keys(properties);
	const len = keys.length;
	const keyNodes = new Array(len);
	const valueNodes = new Array(len);
	for (let i = 0, key; i < len; i++) {
		key = keys[i];
		keyNodes[i] = serializeString(key);
		valueNodes[i] = parseSOS(ctx, depth, properties[key]);
	}
	if (SYM_ITERATOR in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_ITERATOR));
		valueNodes.push(createIteratorFactoryInstanceNode(28, parseIteratorFactory(ctx.base), parseSOS(ctx, depth, createSequenceFromIterable(properties))));
	}
	if (SYM_ASYNC_ITERATOR in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_ASYNC_ITERATOR));
		valueNodes.push(createIteratorFactoryInstanceNode(30, parseAsyncIteratorFactory(ctx.base), parseAsyncIterable(ctx, depth, properties)));
	}
	if (SYM_TO_STRING_TAG in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_TO_STRING_TAG));
		valueNodes.push(createStringNode(properties[SYM_TO_STRING_TAG]));
	}
	if (SYM_IS_CONCAT_SPREADABLE in properties) {
		keyNodes.push(parseWellKnownSymbol(ctx.base, SYM_IS_CONCAT_SPREADABLE));
		valueNodes.push(properties[SYM_IS_CONCAT_SPREADABLE] ? TRUE_NODE : FALSE_NODE);
	}
	return {
		k: keyNodes,
		v: valueNodes
	};
}
function parseAsyncIterable(ctx, depth, current) {
	const id = createIndexForValue(ctx.base, {});
	const result = createStreamConstructorNode(id, parseSpecialReference(ctx.base, 4), []);
	if (ctx.type === 2) ctx.state.iterable(ctx, depth, id, current);
	return result;
}
function parsePlainObject(ctx, depth, id, current, empty) {
	return createObjectNode(id, current, empty, parseProperties(ctx, depth, current));
}
function parseBoxed(ctx, depth, id, current) {
	return createBoxedNode(id, parseSOS(ctx, depth, current.valueOf()));
}
function parseView(ctx, depth, type, id, current) {
	current = getArrayBufferView(ctx.base, current);
	return createViewNode(type, id, current, parseSOS(ctx, depth, current.buffer));
}
function parseError(ctx, depth, type, id, current) {
	const options = getErrorOptions(current, ctx.base.features);
	return createErrorNode(type, id, current, options ? parseProperties(ctx, depth, options) : void 0);
}
function parseMap(ctx, depth, id, current) {
	const sentinel = parseMapSentinel(ctx.base);
	const keyNodes = new Array(current.size);
	const valueNodes = new Array(current.size);
	let i = 0;
	for (const [key, value] of current.entries()) {
		keyNodes[i] = parseSOS(ctx, depth, key);
		valueNodes[i] = parseSOS(ctx, depth, value);
		i++;
	}
	return createMapNode(id, sentinel, keyNodes, valueNodes);
}
function parseSet(ctx, depth, id, current) {
	const items = new Array(current.size);
	let i = 0;
	for (const item of current.keys()) items[i++] = parseSOS(ctx, depth, item);
	return createSetNode(id, items);
}
function parseStream(ctx, depth, id, current) {
	const result = createStreamConstructorNode(id, parseSpecialReference(ctx.base, 4), []);
	if (ctx.type === 2) ctx.state.stream(ctx, depth, id, current);
	return result;
}
function parseLiveStream(ctx, depth, id, current) {
	const stream = ctx.type === 2;
	const result = createStreamConstructorNode(id, parseSpecialReference(ctx.base, 4), [], stream ? 1 : void 0);
	if (stream) ctx.state.live(ctx, depth, id, current);
	return result;
}
function parsePromise(ctx, depth, id, current) {
	if (ctx.type !== 2) throw new SerovalUnsupportedTypeError(current);
	const resolver = createIndexForValue(ctx.base, {});
	ctx.state.promise(ctx, resolver, depth, current);
	return createPromiseConstructorNode(ctx.base, id, resolver);
}
function parsePluginSync(ctx, depth, id, current, currentPlugins) {
	for (let i = 0, len = currentPlugins.length; i < len; i++) {
		const plugin = currentPlugins[i];
		if (plugin.parse.sync && plugin.test(current)) return createPluginNode(id, plugin.tag, plugin.parse.sync(current, { parse: (value) => parseSOS(ctx, depth, value) }, { id }));
	}
}
function parsePlugin(ctx, depth, id, current, currentPlugins) {
	if (currentPlugins) return ctx.type === 1 ? parsePluginSync(ctx, depth, id, current, currentPlugins) : ctx.state.plugin(ctx, depth, id, current, currentPlugins);
}
function parseSequence(ctx, depth, id, current) {
	const len = current.v.length;
	const nodes = new Array(len);
	for (let i = 0; i < len; i++) nodes[i] = parseSOS(ctx, depth, current.v[i]);
	return createSequenceNode(id, nodes, current.t, current.d);
}
function parseObjectPhase2(ctx, depth, id, current, currentClass) {
	if (currentClass === Object) return parsePlainObject(ctx, depth, id, current, false);
	switch (getObjectKind(current, currentClass, ctx.base.features)) {
		case 2: return parsePlainObject(ctx, depth, id, current, true);
		case 3: return createDateNode(id, current);
		case 4: return parseError(ctx, depth, 13, id, current);
		case 5: return parseError(ctx, depth, 14, id, current);
		case 6: return parseBoxed(ctx, depth, id, current);
		case 7: return createArrayBufferNode(ctx.base, id, current);
		case 8: return parseView(ctx, depth, 15, id, current);
		case 9: return parseView(ctx, depth, 16, id, current);
		case 10: return parseView(ctx, depth, 20, id, current);
		case 11: return parseMap(ctx, depth, id, current);
		case 12: return parseSet(ctx, depth, id, current);
		case 13: return parsePromise(ctx, depth, id, current);
		case 14: return createRegExpNode(id, current);
		case 15: return createTemporalNode(id, getTemporalType(currentClass), current);
		case 16: return parsePlainObject(ctx, depth, id, current, !!currentClass);
		default: throw new SerovalUnsupportedTypeError(current);
	}
}
function parseObject(ctx, depth, id, current) {
	if (Array.isArray(current)) return parseArray(ctx, depth, id, current);
	if (isStream(current)) return isLiveStream(current) ? parseLiveStream(ctx, depth, id, current) : parseStream(ctx, depth, id, current);
	if (isSequence(current)) return parseSequence(ctx, depth, id, current);
	const currentClass = getObjectClass(current);
	if (currentClass === OpaqueReference) return parseSOS(ctx, depth, current.replacement);
	const parsed = parsePlugin(ctx, depth, id, current, getObjectPlugins(ctx.base, current, currentClass));
	if (parsed) return parsed;
	return parseObjectPhase2(ctx, depth, id, current, currentClass);
}
function parseFunction(ctx, depth, current) {
	const ref = getReferenceNode(ctx.base, current);
	if (typeof ref !== "number") return ref;
	const plugin = parsePlugin(ctx, depth, ref, current, ctx.base.plugins);
	if (plugin) return plugin;
	throw new SerovalUnsupportedTypeError(current);
}
function parseSOS(ctx, depth, current) {
	if (depth >= ctx.base.depthLimit) throw new SerovalDepthLimitError(ctx.base.depthLimit);
	switch (typeof current) {
		case "boolean": return current ? TRUE_NODE : FALSE_NODE;
		case "undefined": return UNDEFINED_NODE;
		case "string": return createStringNode(current);
		case "number": return createNumberNode(current);
		case "bigint": return createBigIntNode(current);
		case "object":
			if (current) {
				const ref = getReferenceNode(ctx.base, current);
				return typeof ref === "number" ? parseObject(ctx, depth + 1, ref, current) : ref;
			}
			return NULL_NODE;
		case "symbol": return parseWellKnownSymbol(ctx.base, current);
		case "function": return parseFunction(ctx, depth, current);
		default: throw new SerovalUnsupportedTypeError(current);
	}
}
/**
* Streaming parse mode. Everything here is reached through the function
* fields of the stream parser state, which only `createStreamParserContext`
* sets, so synchronous consumers (`serialize`, `toJSON`) never bundle it.
*/
function createStreamParsePluginContext(ctx, depth) {
	const state = ctx.state;
	function parse(current) {
		state.parsing++;
		try {
			return parseSOS(ctx, depth, current);
		} finally {
			state.parsing--;
			if (!state.alive) releaseParserValues(ctx);
		}
	}
	return {
		parse,
		parseStreamSource(current) {
			state.parsing++;
			try {
				if (depth >= ctx.base.depthLimit) throw new SerovalDepthLimitError(ctx.base.depthLimit);
				const id = createIndexForValue(ctx.base, {});
				const node = createStreamConstructorNode(id, parseSpecialReference(ctx.base, 4), [], 1);
				iterateAsync(ctx, depth + 1, id, current, true);
				return node;
			} finally {
				state.parsing--;
				if (!state.alive) releaseParserValues(ctx);
			}
		},
		parseWithError(current) {
			try {
				return parse(current);
			} catch (error) {
				stopStreamParse(ctx, 1, error);
				return;
			}
		},
		isAlive: () => state.alive,
		pushPendingState: () => {
			pushPendingState(ctx);
		},
		popPendingState: () => {
			popPendingState(ctx);
		},
		onParse(node) {
			if (state.alive) {
				state.queue.push({
					node,
					initial: false,
					accept: void 0
				});
				drainOutput(ctx);
			}
		},
		onError(error) {
			stopStreamParse(ctx, 1, error);
		},
		addCleanup(callback) {
			addCleanup(ctx, callback);
		}
	};
}
function getStreamParsePluginContext(ctx, depth) {
	const contexts = ctx.state.pluginContexts;
	return contexts[depth] ?? (contexts[depth] = createStreamParsePluginContext(ctx, depth));
}
function addCleanup(ctx, callback) {
	if (ctx.state.alive) ctx.state.cleanups.push(callback);
	else callback();
}
function parsePluginStream(ctx, depth, id, current, currentPlugins) {
	for (let i = 0, len = currentPlugins.length; i < len; i++) {
		const plugin = currentPlugins[i];
		if (plugin.parse.stream && plugin.test(current)) return createPluginNode(id, plugin.tag, plugin.parse.stream(current, getStreamParsePluginContext(ctx, depth), { id }));
	}
}
/**
* One listener shape serves both `Stream.on` (no accept) and
* `LiveStream.pump` (accept tied to record acceptance). Handlers return the
* parse error so the pump can stop the source.
*/
function streamListener(ctx, depth, id, subscription) {
	const handle = (type, terminal) => (value, accept) => {
		let failure = void 0;
		if (ctx.state.alive) try {
			failure = parseEvent(ctx, depth, value, createStreamEventNode.bind(null, type, id), accept);
		} catch (error) {
			if (!subscription?.active) throw error;
			subscription.failure ?? (subscription.failure = { value: error });
			failure = error;
		}
		if (terminal && !accept) popPendingState(ctx);
		return failure;
	};
	return {
		next: handle(32, false),
		throw: handle(33, true),
		return: handle(34, true),
		done() {
			popPendingState(ctx);
		},
		error(reason) {
			if (ctx.state.alive) stopStreamParse(ctx, 1, reason);
		}
	};
}
function subscribeStream(ctx, depth, id, current) {
	pushPendingState(ctx);
	const subscription = {
		active: true,
		failure: void 0
	};
	let cleanup;
	try {
		cleanup = current.on(streamListener(ctx, depth, id, subscription));
	} finally {
		subscription.active = false;
	}
	try {
		addCleanup(ctx, cleanup);
	} catch (error) {
		subscription.failure ?? (subscription.failure = { value: error });
	}
	const failure = subscription.failure;
	subscription.failure = void 0;
	if (failure) throw failure.value;
}
function consumeLiveStream(ctx, depth, id, current) {
	const cancel = current.pump(streamListener(ctx, depth, id));
	pushPendingState(ctx);
	addCleanup(ctx, () => {
		cancel(ctx.state.reason);
	});
}
function wrapPromiseResult(ctx, type, id, node) {
	return createSerovalNode(type, id, void 0, void 0, void 0, void 0, void 0, [parseSpecialReference(ctx.base, type === 23 ? 2 : 3), node], void 0, void 0, void 0, void 0);
}
function handlePromise(type, id, depth, data) {
	if (this.state.alive) parseEvent(this, depth, data, wrapPromiseResult.bind(null, this, type, id), void 0);
	popPendingState(this);
}
function watchPromise(ctx, resolver, depth, current) {
	pushPendingState(ctx);
	current.then(handlePromise.bind(ctx, 23, resolver, depth), handlePromise.bind(ctx, 24, resolver, depth));
}
function returnIterator(iterator) {
	Promise.resolve().then(() => iterator.return?.()).catch(() => {});
}
/**
* Drives an async iterator directly. The next value is pulled only after the
* record for the previous one has been accepted, and cancellation returns
* the iterator once.
*/
function iterateAsync(ctx, depth, id, current, forwardReason) {
	const iterator = current[SYM_ASYNC_ITERATOR]();
	const listener = streamListener(ctx, depth, id);
	let active = true;
	function stop() {
		if (active) {
			active = false;
			if (forwardReason) try {
				Promise.resolve(iterator.return?.(ctx.state.reason)).catch(() => {});
			} catch {}
			else returnIterator(iterator);
		}
	}
	function pull() {
		if (active) iterator.next().then((result) => {
			if (active) {
				if (result.done) {
					active = false;
					listener.return(result.value, void 0);
				} else if (listener.next(result.value, pull) !== void 0) {
					stop();
					listener.done();
				}
			}
		}, (error) => {
			if (active) {
				active = false;
				listener.throw(error, void 0);
			}
		});
	}
	pushPendingState(ctx);
	addCleanup(ctx, stop);
	pull();
}
function createStreamParserState(options) {
	return {
		alive: true,
		pending: 0,
		parsing: 0,
		queue: [],
		writing: false,
		inFlight: void 0,
		reason: void 0,
		onParse: options.onParse,
		onError: options.onError,
		onDone: options.onDone,
		cleanups: [],
		pluginContexts: [],
		stream: subscribeStream,
		live: consumeLiveStream,
		promise: watchPromise,
		iterable: iterateAsync,
		plugin: parsePluginStream
	};
}
function createStreamParserContext(options) {
	return {
		type: 2,
		base: createBaseParserContext(options),
		state: createStreamParserState(options)
	};
}
function pushPendingState(ctx) {
	if (ctx.state.alive) ctx.state.pending++;
}
function popPendingState(ctx) {
	if (ctx.state.alive) {
		ctx.state.pending--;
		checkStreamParse(ctx);
	}
}
/**
* Parses a value that arrived after the root. Its record is queued before
* parsing starts so that records discovered inside it follow it, and it is
* dropped again if parsing fails. Returns the parse error after reporting
* it, or `undefined`.
*/
function parseEvent(ctx, depth, value, wrap, accept) {
	const state = ctx.state;
	const record = {
		node: void 0,
		initial: false,
		accept
	};
	let failure;
	state.queue.push(record);
	state.parsing++;
	try {
		record.node = wrap(parseSOS(ctx, depth, value));
	} catch (error) {
		failure = { value: error };
	} finally {
		state.parsing--;
		if (!state.alive) releaseParserValues(ctx);
	}
	if (failure) stopStreamParse(ctx, 1, failure.value);
	else drainOutput(ctx);
	return failure?.value;
}
/**
* Emits queued records one at a time. A callback that returns a promise
* pauses emission until it settles; the source event behind the record is
* accepted only after that.
*/
function drainOutput(ctx) {
	const state = ctx.state;
	if (state.writing || state.parsing > 0) return;
	while (state.alive && state.queue.length > 0) {
		const record = state.queue.shift();
		if (!record.node) continue;
		let pending;
		state.writing = true;
		state.inFlight = record;
		state.parsing++;
		try {
			if (!state.onParse) throw new Error("Stream output callback is unavailable");
			const result = state.onParse(record.node, record.initial);
			if (result !== null && (typeof result === "object" || typeof result === "function")) {
				const then = Reflect.get(result, "then");
				if (typeof then === "function") pending = new Promise((resolve, reject) => {
					Reflect.apply(then, result, [resolve, reject]);
				});
			}
		} catch (error) {
			releaseRecord(record);
			stopStreamParse(ctx, 1, error);
			return;
		} finally {
			state.parsing--;
			if (!state.alive) releaseParserValues(ctx);
		}
		record.node = void 0;
		if (pending) {
			if (!state.alive) releaseRecord(record);
			pending.then(() => {
				state.writing = false;
				state.inFlight = void 0;
				if (state.alive) {
					const accept = record.accept;
					releaseRecord(record);
					accept?.();
					drainOutput(ctx);
				}
			}, (error) => {
				state.writing = false;
				state.inFlight = void 0;
				releaseRecord(record);
				stopStreamParse(ctx, 1, error);
			});
			return;
		}
		if (!state.alive) {
			releaseRecord(record);
			return;
		}
		state.writing = false;
		state.inFlight = void 0;
		const accept = record.accept;
		releaseRecord(record);
		accept?.();
	}
	checkStreamParse(ctx);
}
function checkStreamParse(ctx) {
	const state = ctx.state;
	if (state.alive && state.parsing === 0 && state.pending <= 0 && state.queue.length === 0 && !state.writing) stopStreamParse(ctx, 0);
}
function startStreamParse(ctx, current) {
	const state = ctx.state;
	let parsed;
	let failure;
	state.parsing++;
	try {
		parsed = parseSOS(ctx, 0, current);
	} catch (error) {
		failure = { value: error };
	} finally {
		state.parsing--;
		if (!state.alive) releaseParserValues(ctx);
	}
	if (failure) {
		if (state.alive) stopStreamParse(ctx, 1, failure.value);
		else throw failure.value;
	} else if (parsed && state.alive) {
		state.queue.unshift({
			node: parsed,
			initial: true,
			accept: void 0
		});
		drainOutput(ctx);
	}
}
function runCleanups(state) {
	const cleanups = state.cleanups;
	let failure;
	state.cleanups = [];
	for (const record of state.queue) releaseRecord(record);
	state.queue.length = 0;
	if (state.inFlight) releaseRecord(state.inFlight);
	state.inFlight = void 0;
	for (let i = 0, len = cleanups.length; i < len; i++) try {
		cleanups[i]();
	} catch (error) {
		failure ?? (failure = { value: error });
	}
	if (failure) throw failure.value;
}
function releaseRecord(record) {
	record.node = void 0;
	record.accept = void 0;
}
function releaseParserValues(ctx) {
	ctx.base.refs = /* @__PURE__ */ new Map();
	ctx.base.marked.clear();
	ctx.base.plugins = void 0;
	ctx.base.plainObjectPlugins = void 0;
	ctx.state.pluginContexts = [];
	if (ctx.state.parsing === 0) ctx.state.reason = void 0;
}
/**
* Ends the parse once: `onDone` on success, `onError` on failure, and every
* cleanup either way.
*/
function stopStreamParse(ctx, mode, reason) {
	const state = ctx.state;
	if (state.alive) {
		state.alive = false;
		const onError = state.onError;
		const onDone = state.onDone;
		if (mode === 1 && !onError && !(reason instanceof SerovalParserError)) reason = new SerovalParserError(reason);
		state.reason = reason;
		state.onParse = void 0;
		state.onError = void 0;
		state.onDone = void 0;
		state.writing = false;
		state.parsing++;
		let failure;
		try {
			if (mode === 1) {
				if (onError) onError(reason);
				else throw reason;
			} else if (mode === 0) onDone?.();
		} catch (error) {
			failure = { value: error };
		}
		try {
			runCleanups(state);
		} catch (error) {
			failure ?? (failure = { value: error });
		} finally {
			state.parsing--;
			releaseParserValues(ctx);
			state.pending = 0;
		}
		if (failure) throw failure.value;
	}
}
function destroyStreamParse(ctx, reason) {
	stopStreamParse(ctx, 2, reason);
}
async function toCrossJSONAsync(source, options = {}) {
	const plugins = resolvePlugins(options.plugins);
	return await parseTopAsync(createAsyncParserContext({
		compactArrayBufferViews: options.compactArrayBufferViews,
		depthLimit: options.depthLimit,
		plugins,
		disabledFeatures: options.disabledFeatures,
		refs: options.refs
	}), source);
}
function crossSerializeStream(source, options) {
	const plugins = resolvePlugins(options.plugins);
	const onSerialize = options.onSerialize;
	const scopeId = options.scopeId;
	const ctx = createStreamParserContext({
		compactArrayBufferViews: options.compactArrayBufferViews,
		depthLimit: options.depthLimit,
		plugins,
		refs: options.refs,
		disabledFeatures: options.disabledFeatures,
		onParse(node, initial) {
			const serial = createCrossSerializerContext({
				plugins,
				features: ctx.base.features,
				scopeId,
				markedRefs: ctx.base.marked
			});
			return onSerialize(serializeTopCross(serial, node), initial);
		},
		onError: options.onError,
		onDone: options.onDone
	});
	startStreamParse(ctx, source);
	return destroyStreamParse.bind(null, ctx);
}
function toCrossJSONStream(source, options) {
	const plugins = resolvePlugins(options.plugins);
	const ctx = createStreamParserContext({
		compactArrayBufferViews: options.compactArrayBufferViews,
		plugins,
		refs: options.refs,
		disabledFeatures: options.disabledFeatures,
		depthLimit: options.depthLimit,
		onParse: options.onParse,
		onError: options.onError,
		onDone: options.onDone
	});
	startStreamParse(ctx, source);
	return destroyStreamParse.bind(null, ctx);
}
function fromJSON(source, options = {}) {
	const plugins = resolvePlugins(options.plugins);
	const disabledFeatures = options.disabledFeatures ?? 0;
	const sourceFeatures = source.f ?? 127;
	return deserializeTop(createVanillaDeserializerContext({
		depthLimit: options.depthLimit,
		maxBase64Length: options.maxBase64Length,
		plugins,
		markedRefs: source.m,
		features: sourceFeatures & ~disabledFeatures,
		disabledFeatures
	}), source.t);
}
// node_modules/@tanstack/react-router/dist/esm/CatchBoundary.js
var CatchBoundary = class extends import_react.Component {
	constructor(..._args) {
		super(..._args);
		this.state = { error: 0 };
		this.reset = () => {
			this.setState({ error: 0 });
		};
	}
	static getDerivedStateFromProps(props, state) {
		const resetKey = props.getResetKey();
		if (state.error && state.resetKey !== resetKey) return {
			resetKey,
			error: 0
		};
		return { resetKey };
	}
	static getDerivedStateFromError(error) {
		return { error: [error] };
	}
	componentDidCatch(error, errorInfo) {
		this.props.onCatch?.(error, errorInfo);
	}
	render() {
		const error = this.state.error;
		if (error) return import_react.createElement(this.props.errorComponent ?? ErrorComponent, {
			error: error[0],
			reset: this.reset
		});
		return this.props.children;
	}
};
function ErrorComponent({ error }) {
	const [show, setShow] = import_react.useState(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			padding: ".5rem",
			maxWidth: "100%"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: ".5rem"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					style: { fontSize: "1rem" },
					children: "Something went wrong!"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					style: {
						appearance: "none",
						fontSize: ".6em",
						border: "1px solid currentColor",
						padding: ".1rem .2rem",
						fontWeight: "bold",
						borderRadius: ".25rem"
					},
					onClick: () => setShow((d) => !d),
					children: show ? "Hide Error" : "Show Error"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: ".25rem" } }),
			show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				style: {
					fontSize: ".7em",
					border: "1px solid red",
					borderRadius: ".25rem",
					padding: ".3rem",
					color: "red",
					overflow: "auto"
				},
				children: error?.message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: error.message }) : null
			}) }) : null
		]
	});
}
// node_modules/@tanstack/react-router/dist/esm/ClientOnly.js
var getSnapshot = () => true;
var getServerSnapshot = () => false;
/**
* Render the children only after the JS has loaded client-side. Use an optional
* fallback component if the JS is not yet loaded.
*
* @example
* Render a Chart component if JS loads, renders a simple FakeChart
* component server-side or if there is no JS. The FakeChart can have only the
* UI without the behavior or be a loading spinner or skeleton.
*
* ```tsx
* return (
*   <ClientOnly fallback={<FakeChart />}>
*     <Chart />
*   </ClientOnly>
* )
* ```
*/
function ClientOnly({ children, fallback = null }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Fragment, { children: useHydrated() ? children : fallback });
}
/** @internal */
function useHydrated(enabled = true) {
	return import_react.useSyncExternalStore(subscribe, getSnapshot, enabled ? getServerSnapshot : getSnapshot);
}
function subscribe() {
	return () => {};
}
// node_modules/@tanstack/react-router/dist/esm/routerContext.js
var routerContext = import_react.createContext(null);
// node_modules/@tanstack/react-router/dist/esm/useRouter.js
/**
* Access the current TanStack Router instance from React context.
* Must be used within a `RouterProvider`.
*
* Options:
* - `warn`: Log a warning if no router context is found (default: true).
*
* @returns The registered router instance.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useRouterHook
*/
function useRouter(opts) {
	const value = import_react.useContext(routerContext);
	if (!value);
	return value;
}
var matchContext = import_react.createContext(void 0);
var dummyMatchContext = import_react.createContext(void 0);
// node_modules/@tanstack/store/dist/alien.js
/* @__NO_SIDE_EFFECTS__ */
function createReactiveSystem({ update, notify, unwatched }) {
	return {
		link,
		unlink,
		propagate,
		checkDirty,
		shallowPropagate
	};
	function link(dep, sub, version) {
		const prevDep = sub.depsTail;
		if (prevDep !== void 0 && prevDep.dep === dep) return;
		const nextDep = prevDep !== void 0 ? prevDep.nextDep : sub.deps;
		if (nextDep !== void 0 && nextDep.dep === dep) {
			nextDep.version = version;
			sub.depsTail = nextDep;
			return;
		}
		const prevSub = dep.subsTail;
		if (prevSub !== void 0 && prevSub.version === version && prevSub.sub === sub) return;
		const newLink = sub.depsTail = dep.subsTail = {
			version,
			dep,
			sub,
			prevDep,
			nextDep,
			prevSub,
			nextSub: void 0
		};
		if (nextDep !== void 0) nextDep.prevDep = newLink;
		if (prevDep !== void 0) prevDep.nextDep = newLink;
		else sub.deps = newLink;
		if (prevSub !== void 0) prevSub.nextSub = newLink;
		else dep.subs = newLink;
	}
	function unlink(link, sub = link.sub) {
		const dep = link.dep;
		const prevDep = link.prevDep;
		const nextDep = link.nextDep;
		const nextSub = link.nextSub;
		const prevSub = link.prevSub;
		if (nextDep !== void 0) nextDep.prevDep = prevDep;
		else sub.depsTail = prevDep;
		if (prevDep !== void 0) prevDep.nextDep = nextDep;
		else sub.deps = nextDep;
		if (nextSub !== void 0) nextSub.prevSub = prevSub;
		else dep.subsTail = prevSub;
		if (prevSub !== void 0) prevSub.nextSub = nextSub;
		else if ((dep.subs = nextSub) === void 0) unwatched(dep);
		return nextDep;
	}
	function propagate(link) {
		let next = link.nextSub;
		let stack;
		top: do {
			const sub = link.sub;
			let flags = sub.flags;
			if (!(flags & 60)) sub.flags = flags | 32;
			else if (!(flags & 12)) flags = 0;
			else if (!(flags & 4)) sub.flags = flags & -9 | 32;
			else if (!(flags & 48) && isValidLink(link, sub)) {
				sub.flags = flags | 40;
				flags &= 1;
			} else flags = 0;
			if (flags & 2) notify(sub);
			if (flags & 1) {
				const subSubs = sub.subs;
				if (subSubs !== void 0) {
					const nextSub = (link = subSubs).nextSub;
					if (nextSub !== void 0) {
						stack = {
							value: next,
							prev: stack
						};
						next = nextSub;
					}
					continue;
				}
			}
			if ((link = next) !== void 0) {
				next = link.nextSub;
				continue;
			}
			while (stack !== void 0) {
				link = stack.value;
				stack = stack.prev;
				if (link !== void 0) {
					next = link.nextSub;
					continue top;
				}
			}
			break;
		} while (true);
	}
	function checkDirty(link, sub) {
		let stack;
		let checkDepth = 0;
		let dirty = false;
		top: do {
			const dep = link.dep;
			const flags = dep.flags;
			if (sub.flags & 16) dirty = true;
			else if ((flags & 17) === 17) {
				if (update(dep)) {
					const subs = dep.subs;
					if (subs.nextSub !== void 0) shallowPropagate(subs);
					dirty = true;
				}
			} else if ((flags & 33) === 33) {
				if (link.nextSub !== void 0 || link.prevSub !== void 0) stack = {
					value: link,
					prev: stack
				};
				link = dep.deps;
				sub = dep;
				++checkDepth;
				continue;
			}
			if (!dirty) {
				const nextDep = link.nextDep;
				if (nextDep !== void 0) {
					link = nextDep;
					continue;
				}
			}
			while (checkDepth--) {
				const firstSub = sub.subs;
				const hasMultipleSubs = firstSub.nextSub !== void 0;
				if (hasMultipleSubs) {
					link = stack.value;
					stack = stack.prev;
				} else link = firstSub;
				if (dirty) {
					if (update(sub)) {
						if (hasMultipleSubs) shallowPropagate(firstSub);
						sub = link.sub;
						continue;
					}
					dirty = false;
				} else sub.flags &= -33;
				sub = link.sub;
				const nextDep = link.nextDep;
				if (nextDep !== void 0) {
					link = nextDep;
					continue top;
				}
			}
			return dirty;
		} while (true);
	}
	function shallowPropagate(link) {
		do {
			const sub = link.sub;
			const flags = sub.flags;
			if ((flags & 48) === 32) {
				sub.flags = flags | 16;
				if ((flags & 6) === 2) notify(sub);
			}
		} while ((link = link.nextSub) !== void 0);
	}
	function isValidLink(checkLink, sub) {
		let link = sub.depsTail;
		while (link !== void 0) {
			if (link === checkLink) return true;
			link = link.prevDep;
		}
		return false;
	}
}
var queuedEffects = [];
var { link, unlink, propagate, checkDirty, shallowPropagate } = /* @__PURE__ */ createReactiveSystem({
	update(atom) {
		return atom._update();
	},
	notify(effect) {
		queuedEffects[queuedEffectsLength++] = effect;
		effect.flags &= -3;
	},
	unwatched(atom) {
		if (atom.depsTail !== void 0) {
			atom.depsTail = void 0;
			atom.flags = 17;
			purgeDeps(atom);
		}
	}
});
var queuedEffectsLength = 0;
function purgeDeps(sub) {
	const depsTail = sub.depsTail;
	let dep = depsTail !== void 0 ? depsTail.nextDep : sub.deps;
	while (dep !== void 0) dep = unlink(dep, sub);
}
// node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.production.js
/**
* @license React
* use-sync-external-store-shim.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_use_sync_external_store_shim_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var React = require_react();
	function is(x, y) {
		return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
	}
	var objectIs = "function" === typeof Object.is ? Object.is : is;
	var useState = React.useState;
	var useEffect = React.useEffect;
	var useLayoutEffect = React.useLayoutEffect;
	var useDebugValue = React.useDebugValue;
	function useSyncExternalStore$2(subscribe, getSnapshot) {
		var value = getSnapshot(), _useState = useState({ inst: {
			value,
			getSnapshot
		} }), inst = _useState[0].inst, forceUpdate = _useState[1];
		useLayoutEffect(function() {
			inst.value = value;
			inst.getSnapshot = getSnapshot;
			checkIfSnapshotChanged(inst) && forceUpdate({ inst });
		}, [
			subscribe,
			value,
			getSnapshot
		]);
		useEffect(function() {
			checkIfSnapshotChanged(inst) && forceUpdate({ inst });
			return subscribe(function() {
				checkIfSnapshotChanged(inst) && forceUpdate({ inst });
			});
		}, [subscribe]);
		useDebugValue(value);
		return value;
	}
	function checkIfSnapshotChanged(inst) {
		var latestGetSnapshot = inst.getSnapshot;
		inst = inst.value;
		try {
			var nextValue = latestGetSnapshot();
			return !objectIs(inst, nextValue);
		} catch (error) {
			return !0;
		}
	}
	function useSyncExternalStore$1(subscribe, getSnapshot) {
		return getSnapshot();
	}
	var shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
	exports.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
}));
// node_modules/use-sync-external-store/shim/index.js
var require_shim = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_use_sync_external_store_shim_production();
}));
// node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.production.js
/**
* @license React
* use-sync-external-store-shim/with-selector.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_with_selector_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var React = require_react();
	var shim = require_shim();
	function is(x, y) {
		return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
	}
	var objectIs = "function" === typeof Object.is ? Object.is : is;
	var useSyncExternalStore = shim.useSyncExternalStore;
	var useRef = React.useRef;
	var useEffect = React.useEffect;
	var useMemo = React.useMemo;
	var useDebugValue = React.useDebugValue;
	exports.useSyncExternalStoreWithSelector = function(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
		var instRef = useRef(null);
		if (null === instRef.current) {
			var inst = {
				hasValue: !1,
				value: null
			};
			instRef.current = inst;
		} else inst = instRef.current;
		instRef = useMemo(function() {
			function memoizedSelector(nextSnapshot) {
				if (!hasMemo) {
					hasMemo = !0;
					memoizedSnapshot = nextSnapshot;
					nextSnapshot = selector(nextSnapshot);
					if (void 0 !== isEqual && inst.hasValue) {
						var currentSelection = inst.value;
						if (isEqual(currentSelection, nextSnapshot)) return memoizedSelection = currentSelection;
					}
					return memoizedSelection = nextSnapshot;
				}
				currentSelection = memoizedSelection;
				if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
				var nextSelection = selector(nextSnapshot);
				if (void 0 !== isEqual && isEqual(currentSelection, nextSelection)) return memoizedSnapshot = nextSnapshot, currentSelection;
				memoizedSnapshot = nextSnapshot;
				return memoizedSelection = nextSelection;
			}
			var hasMemo = !1, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
			return [function() {
				return memoizedSelector(getSnapshot());
			}, null === maybeGetServerSnapshot ? void 0 : function() {
				return memoizedSelector(maybeGetServerSnapshot());
			}];
		}, [
			getSnapshot,
			getServerSnapshot,
			selector,
			isEqual
		]);
		var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
		useEffect(function() {
			inst.hasValue = !0;
			inst.value = value;
		}, [value]);
		useDebugValue(value);
		return value;
	};
}));
(/* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_with_selector_production();
})))();
/**
* Read and select the nearest or targeted route match.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useMatchHook
*/
function useMatch(opts) {
	const router = useRouter();
	const nearestRouteId = import_react.useContext(opts.from ? dummyMatchContext : matchContext);
	const routeId = opts.from ?? nearestRouteId;
	const matchStore = router.stores.getMatchStore(routeId);
	{
		const match = matchStore.get();
		if (!match) {
			if (opts.shouldThrow ?? true) invariant();
			return;
		}
		return opts.select ? opts.select(match) : match;
	}
}
// node_modules/@tanstack/react-router/dist/esm/useLoaderData.js
/**
* Read and select the current route's loader data with type‑safety.
*
* Options:
* - `from`/`strict`: Choose which route's data to read and strictness
* - `select`: Map the loader data to a derived value
* - `structuralSharing`: Enable structural sharing for stable references
*
* @returns The loader data (or selected value) for the matched route.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useLoaderDataHook
*/
function useLoaderData(opts) {
	return useMatch({
		from: opts.from,
		strict: opts.strict,
		structuralSharing: opts.structuralSharing,
		select: (match) => {
			return opts.select ? opts.select(match.loaderData) : match.loaderData;
		}
	});
}
// node_modules/@tanstack/react-router/dist/esm/useLoaderDeps.js
/**
* Read and select the current route's loader dependencies object.
*
* Options:
* - `from`: Choose which route's loader deps to read
* - `select`: Map the deps to a derived value
* - `structuralSharing`: Enable structural sharing for stable references
*
* @returns The loader deps (or selected value) for the matched route.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useLoaderDepsHook
*/
function useLoaderDeps(opts) {
	const { select, ...rest } = opts;
	return useMatch({
		...rest,
		select: (match) => {
			return select ? select(match.loaderDeps) : match.loaderDeps;
		}
	});
}
// node_modules/@tanstack/react-router/dist/esm/useParams.js
/**
* Access the current route's path parameters with type-safety.
*
* Options:
* - `from`/`strict`: Specify the matched route and whether to enforce strict typing
* - `select`: Project the params object to a derived value for memoized renders
* - `structuralSharing`: Enable structural sharing for stable references
* - `shouldThrow`: Throw if the route is not found in strict contexts
*
* @returns The params object (or selected value) for the matched route.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useParamsHook
*/
function useParams(opts) {
	return useMatch({
		from: opts.from,
		shouldThrow: opts.shouldThrow,
		structuralSharing: opts.structuralSharing,
		strict: opts.strict,
		select: (match) => {
			const params = opts.strict === false ? match.params : match._strictParams;
			return opts.select ? opts.select(params) : params;
		}
	});
}
// node_modules/@tanstack/react-router/dist/esm/useSearch.js
/**
* Read and select the current route's search parameters with type-safety.
*
* Options:
* - `from`/`strict`: Control which route's search is read and how strictly it's typed
* - `select`: Map the search object to a derived value for render optimization
* - `structuralSharing`: Enable structural sharing for stable references
* - `shouldThrow`: Throw when the route is not found (strict contexts)
*
* @returns The search object (or selected value) for the matched route.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useSearchHook
*/
function useSearch(opts) {
	return useMatch({
		from: opts.from,
		strict: opts.strict,
		shouldThrow: opts.shouldThrow,
		structuralSharing: opts.structuralSharing,
		select: (match) => {
			return opts.select ? opts.select(match.search) : match.search;
		}
	});
}
// node_modules/@tanstack/react-router/dist/esm/useNavigate.js
/**
* Imperative navigation hook.
*
* Returns a stable `navigate(options)` function to change the current location
* programmatically. Prefer the `Link` component for user-initiated navigation,
* and use this hook from effects, callbacks, or handlers where imperative
* navigation is required.
*
* Options:
* - `from`: Optional route base used to resolve relative `to` paths.
*
* @returns A function that accepts `NavigateOptions`.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useNavigateHook
*/
function useNavigate(_defaultOpts) {
	const router = useRouter();
	return import_react.useCallback((options) => {
		return router.navigate({
			...options,
			from: options.from ?? _defaultOpts?.from
		});
	}, [_defaultOpts?.from, router]);
}
// node_modules/@tanstack/react-router/dist/esm/useRouteContext.js
function useRouteContext(opts) {
	return useMatch({
		...opts,
		select: (match) => opts.select ? opts.select(match.context) : match.context
	});
}
function resolveExternalLink(to, protocolAllowlist) {
	const scheme = typeof to === "string" && getUrlScheme(to);
	if (!scheme) return;
	if (!protocolAllowlist.has(scheme)) return null;
	return to;
}
function resolveIsActive(location, next, activeOptions, basepath) {
	const currentPath = removeTrailingSlash(location.pathname, basepath);
	const nextPath = removeTrailingSlash(next.pathname, basepath);
	if (activeOptions?.exact ? currentPath !== nextPath : !(currentPath.startsWith(nextPath) && (currentPath.length === nextPath.length || currentPath[nextPath.length] === "/"))) return false;
	if (activeOptions?.includeSearch ?? true) {
		if (!deepEqual(location.search, next.search, !activeOptions?.exact, activeOptions?.explicitUndefined)) return false;
	}
	return !activeOptions?.includeHash || location.hash === next.hash;
}
function useLinkProps(options, forwardedRef, host) {
	return getServerLinkProps(useRouter(), options, forwardedRef, host);
}
var STATIC_EMPTY_OBJECT = {};
var STATIC_ACTIVE_OBJECT = { className: "active" };
var ROUTER_OPTION_KEYS = /* @__PURE__ */ new Set([
	"to",
	"params",
	"search",
	"hash",
	"state",
	"mask",
	"from",
	"unsafeRelative",
	"reloadDocument",
	"preload",
	"preloadDelay",
	"preloadIntentProximity",
	"hashScrollIntoView",
	"replace",
	"startTransition",
	"resetScroll",
	"viewTransition",
	"ignoreBlocker",
	"activeProps",
	"inactiveProps",
	"activeOptions",
	"_asChild"
]);
function collectElementProps(options, host) {
	const props = {};
	for (const key in options) {
		if (ROUTER_OPTION_KEYS.has(key) || key === "type" && host !== void 0 || key === "disabled" && host === "a") continue;
		props[key] = options[key];
	}
	return props;
}
function applyLinkState(props, options, isActive, href, linkDisabled, host) {
	const { activeProps, inactiveProps, className, style, target } = options;
	const stateProps = functionalUpdate(isActive ? activeProps : inactiveProps, {}) ?? (isActive ? STATIC_ACTIVE_OBJECT : STATIC_EMPTY_OBJECT);
	Object.assign(props, stateProps);
	props.href = href;
	if (host !== "a") props.disabled = linkDisabled;
	props.target = target;
	const stateStyle = stateProps.style;
	if (style || stateStyle) props.style = style && stateStyle ? {
		...style,
		...stateStyle
	} : style || stateStyle;
	const stateClassName = stateProps.className;
	if (className || stateClassName) props.className = className ? stateClassName ? `${className} ${stateClassName}` : className : stateClassName;
	if (linkDisabled) {
		props.role = "link";
		props["aria-disabled"] = true;
	}
	if (isActive) {
		props["data-status"] = "active";
		props["aria-current"] = "page";
	}
	return props;
}
function getServerLinkProps(router, options, forwardedRef, host) {
	const { to, disabled, activeOptions } = options;
	const directExternalLink = resolveExternalLink(to, router.protocolAllowlist);
	const next = directExternalLink === void 0 ? router.buildLocation(options) : void 0;
	const hrefOption = next ? getHrefOption(next, router, disabled) : directExternalLink ?? void 0;
	const linkDisabled = disabled || !hrefOption;
	const externalLink = directExternalLink ?? (hrefOption && getUrlScheme(hrefOption) ? hrefOption : void 0);
	const props = collectElementProps(options, host);
	props.ref = forwardedRef;
	if (externalLink) {
		props.href = externalLink;
		return props;
	}
	return applyLinkState(props, options, !!next && !(!disabled && !hrefOption) && !activeOptions?.includeHash && resolveIsActive(router.stores.location.get(), next, activeOptions, router.basepath), hrefOption, linkDisabled, host);
}
function getHrefOption(next, router, disabled) {
	if (disabled) return;
	const location = next.maskedLocation ?? next;
	const href = location.external ? location.publicHref : router.history.createHref(location.publicHref) || "/";
	if ((location.external || href !== location.publicHref) && isDangerousProtocol(href, router.protocolAllowlist)) return;
	return href;
}
/**
* A strongly-typed anchor component for declarative navigation.
* Handles path, search, hash and state updates with optional route preloading
* and active-state styling.
*
* Props:
* - `preload`: Controls route preloading (eg. 'intent', 'render', 'viewport', true/false)
* - `preloadDelay`: Delay in ms before preloading on focus, hover, or viewport entry
* - `activeProps`/`inactiveProps`: Additional props merged when link is active/inactive
* - `resetScroll`/`hashScrollIntoView`: Control scroll behavior on navigation
* - `viewTransition`/`startTransition`: Use View Transitions/React transitions for navigation
* - `ignoreBlocker`: Bypass registered blockers
*
* @returns An anchor-like element that navigates without full page reloads.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/linkComponent
*/
var Link = import_react.memo(import_react.forwardRef((props, ref) => {
	const host = props._asChild || "a";
	const linkProps = useLinkProps(props, ref, host);
	const children = typeof props.children === "function" ? props.children({ isActive: linkProps["data-status"] === "active" }) : props.children;
	return import_react.createElement(host, linkProps, children);
}), areLinkPropsEqual);
function areLinkPropsEqual(prev, next) {
	let extraKeys = 0;
	for (const key in next) {
		extraKeys++;
		if (prev[key] === next[key]) continue;
		if (!ROUTER_OPTION_KEYS.has(key) || !deepEqual(prev[key], next[key], false, true)) return false;
	}
	for (const _key in prev) extraKeys--;
	return extraKeys === 0;
}
// node_modules/@tanstack/react-router/dist/esm/route.js
var Route = class extends BaseRoute {
	/**
	* @deprecated Use the `createRoute` function instead.
	*/
	constructor(options) {
		super(options);
		this.useMatch = (opts) => {
			return useMatch({
				...opts,
				from: this.id
			});
		};
		this.useRouteContext = (opts) => {
			return useRouteContext({
				...opts,
				from: this.id
			});
		};
		this.useSearch = (opts) => {
			return useSearch({
				...opts,
				from: this.id
			});
		};
		this.useParams = (opts) => {
			return useParams({
				...opts,
				from: this.id
			});
		};
		this.useLoaderDeps = (opts) => {
			return useLoaderDeps({
				...opts,
				from: this.id
			});
		};
		this.useLoaderData = (opts) => {
			return useLoaderData({
				...opts,
				from: this.id
			});
		};
		this.useNavigate = () => {
			return useNavigate({ from: this.fullPath });
		};
		this.Link = import_react.forwardRef((props, ref) => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				ref,
				from: this.fullPath,
				...props
			});
		});
	}
};
/**
* Creates a non-root Route instance for code-based routing.
*
* Use this to define a route that will be composed into a route tree
* (typically via a parent route's `addChildren`). If you're using file-based
* routing, prefer `createFileRoute`.
*
* @param options Route options (path, component, loader, context, etc.).
* @returns A Route instance to be attached to the route tree.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/createRouteFunction
*/
function createRoute(options) {
	return new Route(options);
}
var RootRoute = class extends BaseRootRoute {
	/**
	* @deprecated `RootRoute` is now an internal implementation detail. Use `createRootRoute()` instead.
	*/
	constructor(options) {
		super(options);
		this.useMatch = (opts) => {
			return useMatch({
				...opts,
				from: this.id
			});
		};
		this.useRouteContext = (opts) => {
			return useRouteContext({
				...opts,
				from: this.id
			});
		};
		this.useSearch = (opts) => {
			return useSearch({
				...opts,
				from: this.id
			});
		};
		this.useParams = (opts) => {
			return useParams({
				...opts,
				from: this.id
			});
		};
		this.useLoaderDeps = (opts) => {
			return useLoaderDeps({
				...opts,
				from: this.id
			});
		};
		this.useLoaderData = (opts) => {
			return useLoaderData({
				...opts,
				from: this.id
			});
		};
		this.useNavigate = () => {
			return useNavigate({ from: this.fullPath });
		};
		this.Link = import_react.forwardRef((props, ref) => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				ref,
				from: this.fullPath,
				...props
			});
		});
	}
};
/**
* Creates a root Route instance used to build your route tree.
*
* Typically paired with `createRouter({ routeTree })`. If you need to require
* a typed router context, use `createRootRouteWithContext` instead.
*
* @param options Root route options (component, error, pending, etc.).
* @returns A root route instance.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/createRootRouteFunction
*/
function createRootRoute(options) {
	return new RootRoute(options);
}
// node_modules/@tanstack/react-router/dist/esm/fileRoute.js
/**
* Creates a file-based Route factory for a given path.
*
* Used by TanStack Router's file-based routing to associate a file with a
* route. The returned function accepts standard route options. In normal usage
* the `path` string is inserted and maintained by the `tsr` generator.
*
* @param path File path literal for the route (usually auto-generated).
* @returns A function that accepts Route options and returns a Route instance.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/createFileRouteFunction
*/
function createFileRoute(path) {
	return (options) => {
		const route = createRoute(options);
		route.isRoot = false;
		return route;
	};
}
// node_modules/@tanstack/react-router/dist/esm/lazyRouteComponent.js
/**
* Wrap a dynamic import to create a route component that supports
* `.preload()` and friendly reload-on-module-missing behavior.
*
* @param importer Function returning a module promise
* @param exportName Named export to use (default: `default`)
* @returns A lazy route component compatible with TanStack Router
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/lazyRouteComponentFunction
*/
function lazyRouteComponent(importer, exportName) {
	let loadPromise;
	let comp;
	let error;
	const load = () => {
		if (!loadPromise) {
			error = void 0;
			loadPromise = importer().then((res) => {
				comp = res[exportName ?? "default"];
			}).catch((err) => {
				loadPromise = void 0;
				error = err;
			});
		}
		return loadPromise;
	};
	const lazyComp = function Lazy(props) {
		if (error) {
			if (isModuleNotFoundError(error) && false);
			throw error;
		}
		if (!comp) {
			if (reactUse) reactUse(load());
			else throw load();
		}
		return import_react.createElement(comp, props);
	};
	lazyComp.preload = load;
	return lazyComp;
}
// node_modules/@tanstack/react-router/dist/esm/not-found.js
function CatchNotFound(props) {
	const router = useRouter();
	{
		const resetKey = `not-found-${router.stores.location.get().pathname}-${router.stores.status.get()}`;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatchBoundary, {
			getResetKey: () => resetKey,
			onCatch: (error, errorInfo) => {
				if (isNotFound(error)) props.onCatch?.(error, errorInfo);
				else throw error;
			},
			errorComponent: ({ error }) => {
				if (isNotFound(error)) return props.fallback?.(error);
				else throw error;
			},
			children: props.children
		});
	}
}
function DefaultGlobalNotFound() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Not Found" });
}
// node_modules/@tanstack/react-router/dist/esm/ScriptOnce.js
/**
* Server-only helper to emit a script tag exactly once during SSR.
*/
function ScriptOnce({ children }) {
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
		nonce: router.options.ssr?.nonce,
		dangerouslySetInnerHTML: { __html: children + ";document.currentScript.remove()" }
	});
}
// node_modules/@tanstack/react-router/dist/esm/renderRouteNotFound.js
/**
* Renders a not found component for a route when no matching route is found.
*
* @param router - The router instance containing the route configuration
* @param route - The route that triggered the not found state
* @param data - Additional data to pass to the not found component
* @returns The rendered not found component or a default fallback component
*/
function renderRouteNotFound(router, route, data) {
	if (!route.options.notFoundComponent) {
		if (router.options.defaultNotFoundComponent) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(router.options.defaultNotFoundComponent, { ...data });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DefaultGlobalNotFound, {});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(route.options.notFoundComponent, { ...data });
}
// node_modules/@tanstack/router-core/dist/esm/scroll-restoration-inline.js
var scroll_restoration_inline_default = "function(a,f){let l;try{l=JSON.parse(sessionStorage.getItem(a)||\"{}\")}catch{return}const n=l?.[f||history.state?.__TSR_key];let c=!1;for(const t in n){const e=n[t],o=e?.scrollX,s=e?.scrollY;if(Number.isFinite(o)&&Number.isFinite(s)){if(t===\"window\")scrollTo(o,s),c=!0;else if(t)try{const r=document.querySelector(t);r&&(r.scrollLeft=o,r.scrollTop=s)}catch{}}}if(c)return;const i=location.hash.slice(1);if(i){const t=history.state?.__hashScrollIntoViewOptions??!0;if(t){const e=document.getElementById(i);e&&e.scrollIntoView(t)}return}scrollTo(0,0)}";
// node_modules/@tanstack/router-core/dist/esm/scroll-restoration-script/server.js
var defaultInlineScrollRestorationScript = `(${scroll_restoration_inline_default})(${escapeHtml(JSON.stringify(storageKey))})`;
function getScrollRestorationScript(key) {
	if (key === void 0) return defaultInlineScrollRestorationScript;
	return `(${scroll_restoration_inline_default})(${escapeHtml(JSON.stringify(storageKey))},${escapeHtml(JSON.stringify(key))})`;
}
function getScrollRestorationScriptForRouter(router) {
	if (typeof router.options.scrollRestoration === "function" && !router.options.scrollRestoration({ location: router.latestLocation })) return null;
	const getKey = router.options.getScrollRestorationKey;
	if (!getKey) return defaultInlineScrollRestorationScript;
	const location = router.latestLocation;
	const userKey = getKey(location);
	if (userKey === defaultGetScrollRestorationKey(location)) return defaultInlineScrollRestorationScript;
	return getScrollRestorationScript(userKey);
}
// node_modules/@tanstack/react-router/dist/esm/scroll-restoration.js
function ScrollRestoration() {
	const script = getScrollRestorationScriptForRouter(useRouter());
	if (!script) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScriptOnce, { children: script });
}
// node_modules/@tanstack/react-router/dist/esm/Match.js
function renderPending(router, route) {
	const PendingComponent = route?.options.pendingComponent ?? router.options.defaultPendingComponent;
	if (!PendingComponent) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PendingComponent, {});
}
var canWrapInSuspense = (router, route, ssr) => !route.isRoot || route.options.shellComponent || route.options.wrapInSuspense || ssr === false || ssr === "data-only" || false;
var Match = import_react.memo(function MatchImpl({ routeId }) {
	const router = useRouter();
	return matchView(router, router.stores.byRoute.get(routeId).get());
});
function matchView(router, match) {
	const route = router.routesById[match.routeId];
	const pendingElement = renderPending(router, route);
	const routeErrorComponent = route.options.errorComponent ?? router.options.defaultErrorComponent;
	const routeOnCatch = route.options.onCatch ?? router.options.defaultOnCatch;
	const routeNotFoundComponent = route.isRoot ? route.options.notFoundComponent ?? router.options.notFoundRoute?.options.component : route.options.notFoundComponent;
	const resolvedNoSsr = match.ssr === false || match.ssr === "data-only";
	const wrapInSuspense = canWrapInSuspense(router, route, match.ssr) && (route.options.wrapInSuspense ?? pendingElement ?? (route.options.errorComponent?.preload || resolvedNoSsr));
	let content = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchInner, { match });
	if (resolvedNoSsr) content = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, {
		fallback: pendingElement,
		children: content
	});
	if (routeNotFoundComponent) content = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatchNotFound, {
		fallback: (error) => {
			error.routeId ??= match.routeId;
			if (error.routeId !== match.routeId) throw error;
			return import_react.createElement(routeNotFoundComponent, error);
		},
		children: content
	});
	if (routeErrorComponent) content = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatchBoundary, {
		getResetKey: () => match,
		errorComponent: routeErrorComponent,
		onCatch: (error, errorInfo) => {
			if (isNotFound(error)) {
				error.routeId ??= match.routeId;
				throw error;
			}
			routeOnCatch?.(error, errorInfo);
		},
		children: content
	});
	if (wrapInSuspense) content = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: pendingElement,
		children: content
	});
	const scrollRestoration = route.parentRoute?.id === "__root__" && router.options.scrollRestoration ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollRestoration, {}) : null;
	const ShellComponent = route.isRoot && route.options.shellComponent;
	return ShellComponent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(matchContext.Provider, {
		value: match.routeId,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ShellComponent, { children: [content, scrollRestoration] })
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(matchContext.Provider, {
		value: match.routeId,
		children: [content, scrollRestoration]
	});
}
var MatchInner = import_react.memo(function MatchInnerImpl({ match }) {
	const router = useRouter();
	const routeId = match.routeId;
	const route = router.routesById[routeId];
	const key = import_react.useMemo(() => {
		const remountDeps = (route.options.remountDeps ?? router.options.defaultRemountDeps)?.({
			routeId,
			loaderDeps: match.loaderDeps,
			params: match._strictParams,
			search: match._strictSearch
		});
		return remountDeps ? JSON.stringify(remountDeps) : void 0;
	}, [
		routeId,
		match.loaderDeps,
		match._strictParams,
		match._strictSearch,
		route.options.remountDeps,
		router.options.defaultRemountDeps
	]);
	const out = import_react.useMemo(() => {
		const Comp = route.options.component ?? router.options.defaultComponent;
		return Comp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comp, {}, key) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	}, [
		key,
		route.options.component,
		router.options.defaultComponent
	]);
	if (match.status === "pending") {
		if (router.ssr && !canWrapInSuspense(router, route, match.ssr)) return out;
		if (router._tx) throw router._tx[5];
		return renderPending(router, route);
	}
	if (match.status === "notFound") return renderRouteNotFound(router, route, match.error);
	if (match.status === "error") {
		const RouteErrorComponent = (route.options.errorComponent ?? router.options.defaultErrorComponent) || ErrorComponent;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouteErrorComponent, {
			error: match.error,
			reset: void 0,
			info: { componentStack: "" }
		});
	}
	return out;
});
/**
* Render the next child match in the route tree. Typically used inside
* a route component to render nested routes.
*
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/outletComponent
*/
var Outlet = import_react.memo(function OutletImpl() {
	const router = useRouter();
	const routeId = import_react.useContext(matchContext);
	let parentGlobalNotFound;
	let parentNotFoundError;
	let childRouteId;
	{
		const matches = router.stores.matches.get();
		const parentIndex = matches.findIndex((match) => match.routeId === routeId);
		const parentMatch = matches[parentIndex];
		parentGlobalNotFound = !!parentMatch._notFound;
		parentNotFoundError = parentMatch.error;
		childRouteId = matches[parentIndex + 1]?.routeId;
	}
	if (parentGlobalNotFound) return renderRouteNotFound(router, router.routesById[routeId], parentNotFoundError);
	if (!childRouteId) return null;
	const nextMatch = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Match, { routeId: childRouteId });
	if (routeId === "__root__") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: renderPending(router),
		children: nextMatch
	});
	return nextMatch;
});
// node_modules/@tanstack/react-router/dist/esm/Transitioner.js
function settleOwner(owner, rendered) {
	const settle = owner[1];
	owner.length = 0;
	settle?.(rendered);
}
// node_modules/@tanstack/react-router/dist/esm/Matches.js
/**
* Internal component that renders the router's active match tree with
* suspense, error, and not-found boundaries. Rendered by `RouterProvider`.
*/
function Matches() {
	const router = useRouter();
	const rootRoute = router.routesById[rootRouteId];
	renderPending(router, rootRoute);
	const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [false, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchesInner, {})] });
	return router.options.InnerWrap ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(router.options.InnerWrap, { children: inner }) : inner;
}
function MatchesInner() {
	const router = useRouter();
	const acknowledgement = router._rendered;
	const matches = router.stores.matches.get();
	const match = matches[0];
	const routeId = match?.routeId;
	useLayoutEffect(() => {
		if (acknowledgement[0] === matches) settleOwner(acknowledgement, true);
	}, [acknowledgement, matches]);
	const matchComponent = routeId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Match, { routeId }) : null;
	return router.options.disableGlobalCatchBoundary ? matchComponent : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatchBoundary, {
		getResetKey: () => match,
		onCatch: void 0,
		children: matchComponent
	});
}
// node_modules/@tanstack/react-router/dist/esm/routerStores.js
var getStoreFactory = (opts) => {
	return {
		createMutableStore: createNonReactiveMutableStore,
		createReadonlyStore: createNonReactiveReadonlyStore,
		batch: (fn) => fn()
	};
};
// node_modules/@tanstack/react-router/dist/esm/router.js
/**
* Creates a new Router instance for React.
*
* Pass the returned router to `RouterProvider` to enable routing.
* Notable options: `routeTree` (your route definitions) and `context`
* (required if the root route was created with `createRootRouteWithContext`).
*
* @param options Router options used to configure the router.
* @returns A Router instance to be provided to `RouterProvider`.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/createRouterFunction
*/
var createRouter = (options) => {
	return new Router(options);
};
var Router = class extends RouterCore {
	constructor(options) {
		super(options, getStoreFactory);
	}
};
// node_modules/@tanstack/react-router/dist/esm/RouterProvider.js
/**
* Low-level provider that places the router into React context and optionally
* updates router options from props. Most apps should use `RouterProvider`.
*/
function RouterContextProvider({ router, children, ...rest }) {
	if (hasKeys(rest)) router.update({
		...router.options,
		...rest,
		context: {
			...router.options.context,
			...rest.context
		}
	});
	const provider = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(routerContext.Provider, {
		value: router,
		children
	});
	if (router.options.Wrap) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(router.options.Wrap, { children: provider });
	return provider;
}
/**
* Renders the current match presentation and provides the router to the React
* tree via context.
*
* Accepts mutable router options via props. Configure initialization-only
* options with `createRouter`.
*
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/createRouterFunction
*/
function RouterProvider({ router, ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouterContextProvider, {
		router,
		...rest,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Matches, {})
	});
}
// node_modules/@tanstack/react-router/dist/esm/Asset.js
var noopScriptHandler = () => {};
function setScriptAttrs(script, attrs) {
	if (!attrs) return;
	for (const [key, value] of Object.entries(attrs)) if (key !== "suppressHydrationWarning" && value !== void 0 && value !== false) script.setAttribute(key, typeof value === "boolean" ? "" : String(value));
}
function Asset(asset) {
	const { attrs, children, nonce, preventScriptHoist } = asset;
	const innerHTML = import_react.useMemo(() => children === void 0 ? void 0 : { __html: children }, [children]);
	switch (asset.tag) {
		case "title": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", {
			...attrs,
			suppressHydrationWarning: true,
			children
		});
		case "meta": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			...attrs,
			suppressHydrationWarning: true
		});
		case "link": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("link", {
			...attrs,
			precedence: attrs?.precedence ?? (attrs?.rel === "stylesheet" ? "default" : void 0),
			nonce,
			suppressHydrationWarning: true
		});
		case "style":
			if (asset.inlineCss && false);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", {
				...attrs,
				dangerouslySetInnerHTML: innerHTML,
				nonce
			});
		case "script": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Script, {
			attrs,
			preventScriptHoist,
			children
		});
		default: return null;
	}
}
function Script({ attrs, children, preventScriptHoist }) {
	useRouter();
	useHydrated();
	const innerHTML = import_react.useMemo(() => children === void 0 ? void 0 : { __html: children }, [children]);
	const dataScript = typeof attrs?.type === "string" && attrs.type !== "" && attrs.type !== "text/javascript" && attrs.type !== "module";
	import_react.useEffect(() => {
		if (dataScript) return;
		if (attrs?.src) {
			const link = document.createElement("a");
			link.href = attrs.src;
			const normSrc = link.href;
			for (const el of document.scripts) if (el.src === normSrc) return;
			const script = document.createElement("script");
			setScriptAttrs(script, attrs);
			document.head.appendChild(script);
			return () => script.remove();
		}
		if (typeof children === "string") {
			const typeAttr = typeof attrs?.type === "string" ? attrs.type : "text/javascript";
			const nonceAttr = typeof attrs?.nonce === "string" ? attrs.nonce : void 0;
			for (const el of document.scripts) {
				if (el.hasAttribute("src")) continue;
				const sType = el.getAttribute("type") ?? "text/javascript";
				const sNonce = el.getAttribute("nonce") ?? void 0;
				if (el.textContent === children && sType === typeAttr && sNonce === nonceAttr) return;
			}
			const script = document.createElement("script");
			script.textContent = children;
			setScriptAttrs(script, attrs);
			document.head.appendChild(script);
			return () => script.remove();
		}
	}, [
		attrs,
		children,
		dataScript
	]);
	if (attrs?.src) {
		if (!preventScriptHoist) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			...attrs,
			suppressHydrationWarning: true
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			...attrs,
			onLoad: noopScriptHandler,
			suppressHydrationWarning: true
		});
	}
	if (typeof children === "string") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
		...attrs,
		dangerouslySetInnerHTML: innerHTML,
		suppressHydrationWarning: true
	});
	return null;
}
// node_modules/@tanstack/react-router/dist/esm/headContentUtils.js
function buildTagsFromMatches(router, nonce, matches, assetCrossOrigin) {
	matches = _getAssetMatches(matches);
	const routeMeta = matches.map((match) => match.meta).filter((meta) => meta !== void 0);
	const resultMeta = [];
	const metaByAttribute = {};
	let title;
	for (let i = routeMeta.length - 1; i >= 0; i--) {
		const metas = routeMeta[i];
		for (let j = metas.length - 1; j >= 0; j--) {
			const m = metas[j];
			if (!m) continue;
			if (m.title) {
				if (!title) title = {
					tag: "title",
					children: m.title
				};
			} else if ("script:ld+json" in m) try {
				const json = JSON.stringify(m["script:ld+json"]);
				resultMeta.push({
					tag: "script",
					attrs: { type: "application/ld+json" },
					children: escapeHtml(json)
				});
			} catch {}
			else {
				const attribute = m.name ?? m.property;
				if (attribute) {
					if (metaByAttribute[attribute]) continue;
					else metaByAttribute[attribute] = true;
				}
				resultMeta.push({
					tag: "meta",
					attrs: {
						...m,
						nonce
					}
				});
			}
		}
	}
	if (title) resultMeta.push(title);
	if (nonce) resultMeta.push({
		tag: "meta",
		attrs: {
			property: "csp-nonce",
			content: nonce
		}
	});
	resultMeta.reverse();
	const constructedLinks = matches.flatMap((match) => match.links ?? []).filter((link) => link !== void 0).map((link) => ({
		tag: "link",
		attrs: {
			...link,
			nonce
		}
	}));
	const manifest = router.ssr?.manifest;
	const manifestCssTags = [];
	if (manifest) {
		matches.forEach((match) => {
			(manifest.routes[match.routeId]?.css)?.forEach((link) => {
				const resolvedLink = resolveManifestCssLink(link);
				manifestCssTags.push({
					tag: "link",
					attrs: {
						rel: "stylesheet",
						...resolvedLink,
						crossOrigin: getAssetCrossOrigin(assetCrossOrigin, "stylesheet") ?? resolvedLink.crossOrigin,
						suppressHydrationWarning: true,
						nonce
					}
				});
			});
		});
		if (manifest.inlineStyle) manifestCssTags.push({
			tag: "style",
			attrs: {
				...manifest.inlineStyle.attrs,
				nonce
			},
			children: manifest.inlineStyle.children,
			inlineCss: true
		});
	}
	const preloadLinks = [];
	if (manifest) matches.forEach((match) => {
		manifest.routes[match.routeId]?.preloads?.forEach((preload) => {
			preloadLinks.push({
				tag: "link",
				attrs: {
					...getScriptPreloadAttrs(manifest, preload, assetCrossOrigin),
					nonce
				}
			});
		});
	});
	const styles = matches.flatMap((match) => match.styles ?? []).filter((style) => style !== void 0).map(({ children, ...attrs }) => ({
		tag: "style",
		attrs: {
			...attrs,
			nonce
		},
		children
	}));
	const headScripts = matches.flatMap((match) => match.headScripts ?? []).filter((script) => script !== void 0).map(({ children, ...script }) => ({
		tag: "script",
		attrs: {
			...script,
			nonce
		},
		children
	}));
	const tags = [];
	appendUniqueUserTags(tags, resultMeta);
	tags.push(...preloadLinks);
	appendUniqueUserTags(tags, constructedLinks);
	tags.push(...manifestCssTags);
	appendUniqueUserTags(tags, styles);
	appendUniqueUserTags(tags, headScripts);
	return tags;
}
/**
* Build the head/link/meta/script tags from the renderable presented prefix.
* Used internally by `HeadContent`.
*/
var useTags = (assetCrossOrigin) => {
	const router = useRouter();
	const nonce = router.options.ssr?.nonce;
	return buildTagsFromMatches(router, nonce, router.stores.matches.get(), assetCrossOrigin);
};
// node_modules/@tanstack/react-router/dist/esm/HeadContent.js
/**
* Render route-managed head tags (title, meta, links, styles, head scripts).
* Place inside the document head of your app shell.
* @link https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management
*/
function HeadContent(props) {
	const tags = useTags(props.assetCrossOrigin);
	const nonce = useRouter().options.ssr?.nonce;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: tags.map((tag) => /* @__PURE__ */ (0, import_react.createElement)(Asset, {
		...tag,
		key: `tsr-meta-${JSON.stringify(tag)}`,
		nonce
	})) });
}
// node_modules/@tanstack/react-router/dist/esm/Scripts.js
var routeScriptAttrs = { suppressHydrationWarning: true };
/**
* Render body script tags collected from route matches and SSR manifests.
* During streaming SSR, `<Scripts>` marks where late hydration scripts may
* begin to be inserted.
*/
var Scripts = () => {
	const router = useRouter();
	const nonce = router.options.ssr?.nonce;
	const getParts = (matches) => {
		const parts = getSsrBodyScriptParts(matches, router.ssr?.manifest, nonce, routeScriptAttrs);
		for (const script of parts[1]) if (typeof script.attrs?.src === "string") {
			const scriptWithHoist = script;
			scriptWithHoist.preventScriptHoist = true;
		}
		return parts;
	};
	return renderScripts(composeSsrBodyScripts(getParts(router.stores.matches.get()), router.serverSsr?.takeInitialHydrationScriptTags()));
};
function renderScripts(scripts) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: scripts.map((asset, i) => /* @__PURE__ */ (0, import_react.createElement)(Asset, {
		...asset,
		key: `tsr-scripts-${asset.tag}-${i}`
	})) });
}
// node_modules/@tanstack/router-core/dist/esm/ssr/constants.js
var GLOBAL_TSR = "$_TSR";
// node_modules/@tanstack/router-core/dist/esm/ssr/tsrScript.js
var tsrScript_default = "self.$_TSR={h(){this.hydrated=!0,this.c()},e(){this.streamEnded=!0,this.c()},c(){this.hydrated&&this.streamEnded&&(delete self.$_TSR,delete self.$R.tsr)},p(e){this.initialized?e():this.buffer.push(e)},buffer:[]}";
// node_modules/@tanstack/router-core/dist/esm/ssr/htmlBoundaryScanner.js
var textEncoder = new TextEncoder();
var DOCUMENT_CLOSE = "</body></html>";
var SCRIPT_CLOSE = "<\/script>";
var DOCUMENT_CLOSE_ANCHOR_INDEX = DOCUMENT_CLOSE.indexOf("y");
var SCRIPT_CLOSE_ANCHOR_INDEX = SCRIPT_CLOSE.indexOf("p");
var DOCUMENT_CLOSE_BYTES = textEncoder.encode(DOCUMENT_CLOSE);
var SCRIPT_CLOSE_BYTES = textEncoder.encode(SCRIPT_CLOSE);
function encodeIntoBoundedChunk(source, sourceOffset, output, outputOffset = 0) {
	return textEncoder.encodeInto(sourceOffset === 0 ? source : source.slice(sourceOffset), outputOffset === 0 ? output : output.subarray(outputOffset));
}
/** Advance matcher state and return the local offset after a complete match. */
function advanceByteMatcher(matcher, value, startIndex = 0, findLast = false) {
	const { pattern, anchorIndex } = matcher;
	let matched = matcher.matched;
	let lastMatchEnd;
	let index = startIndex;
	while (index < value.length) {
		if (matched === 0) {
			if (anchorIndex > 0 && index < value.length - anchorIndex) {
				const anchor = value.indexOf(pattern[anchorIndex], index + anchorIndex);
				if (anchor < 0) {
					index = value.length - anchorIndex;
					continue;
				}
				index = anchor - anchorIndex;
			} else {
				index = value.indexOf(pattern[0], index);
				if (index < 0) {
					matcher.matched = matched;
					return lastMatchEnd;
				}
			}
		}
		const byte = value[index];
		if (byte === pattern[matched]) matched++;
		else matched = byte === pattern[0] ? 1 : 0;
		index++;
		if (matched === pattern.length) {
			matched = 0;
			if (!findLast) {
				matcher.matched = matched;
				return index;
			}
			lastMatchEnd = index;
		}
	}
	matcher.matched = matched;
	return lastMatchEnd;
}
/** Find a complete fixed sequence that is contained in one byte chunk. */
function findExactBytes(value, pattern, startIndex = 0, anchorIndex = 0) {
	let anchor = value.indexOf(pattern[anchorIndex], startIndex + anchorIndex);
	while (anchor >= 0) {
		const candidate = anchor - anchorIndex;
		if (candidate + pattern.length > value.length) return -1;
		let patternIndex = 0;
		while (patternIndex < pattern.length && value[candidate + patternIndex] === pattern[patternIndex]) patternIndex++;
		if (patternIndex === pattern.length) return candidate;
		anchor = value.indexOf(pattern[anchorIndex], anchor + 1);
	}
	return -1;
}
/**
* Find the longest suffix that can become the fixed sequence in the next
* chunk. The returned index starts that suffix.
*/
function getExactBytesPrefixAtEnd(value, pattern, startIndex = 0) {
	candidate: for (let length = Math.min(pattern.length - 1, value.length - startIndex); length > 0; length--) {
		const candidateStart = value.length - length;
		for (let index = 0; index < length; index++) if (value[candidateStart + index] !== pattern[index]) continue candidate;
		return candidateStart;
	}
}
// node_modules/@tanstack/router-core/dist/esm/ssr/hydrationScripts.js
var encoder = new TextEncoder();
var SOURCE_SEPARATOR = ";";
var MAX_INITIAL_SOURCE_CODE_UNITS = 16384;
var MAX_BACKLOG_CODE_UNITS = 16777216;
var MAX_BACKLOG_SOURCES = 4096;
var MIN_OUTPUT_BYTES = 256;
var MAX_DIRECT_CODE_UNITS = 16384;
var MAX_HYDRATION_OUTPUT_CHUNK_BYTES = 65536;
var MAX_DYNAMIC_RECORD_CODE_UNITS = MAX_HYDRATION_OUTPUT_CHUNK_BYTES;
var STREAM_PART_ATTRIBUTE = "data-tsr-stream-part";
var INITIAL_CLEANUP_SOURCE = `{let s=document.currentScript,p;while((p=s.previousElementSibling)&&p.hasAttribute('${STREAM_PART_ATTRIBUTE}'))p.remove();s.remove()}`;
var INITIAL_CLEANUP_SUFFIX = SOURCE_SEPARATOR + INITIAL_CLEANUP_SOURCE;
var DYNAMIC_CLOSE_SOURCE = "document.currentScript.remove()<\/script>";
var HYDRATION_SCRIPT_BOUNDARY_SOURCE = "document.currentScript.remove();/*$tsr-stream-boundary*/";
var HYDRATION_SCRIPT_BOUNDARY_SUFFIX = ";/*$tsr-stream-boundary*/<\/script>";
var HYDRATION_SCRIPT_BOUNDARY_ANCHOR_INDEX = HYDRATION_SCRIPT_BOUNDARY_SUFFIX.lastIndexOf("*");
var HYDRATION_SCRIPT_BOUNDARY_BYTES = encoder.encode(HYDRATION_SCRIPT_BOUNDARY_SUFFIX);
var ROUTER_PREFIX = GLOBAL_TSR + ".router=";
var PROMISE_PREFIX = GLOBAL_TSR + ".p(()=>";
var DEFAULT_INITIAL_SOURCES = [getCrossReferenceHeader("tsr"), tsrScript_default];
var HydrationScriptOutputState = {
	Waiting: 0,
	Ready: 1,
	Active: 2,
	Done: 3,
	Failed: 4
};
function escapeAttribute(value) {
	return value.replace(/[&"'<>]/g, (char) => `&#${char.charCodeAt(0)};`);
}
function createInitialTags(sources, nonce) {
	const before = [];
	for (const source of sources) {
		if (!source) continue;
		const previous = before[before.length - 1];
		if (previous?.children && previous.children.length + 1 + source.length <= MAX_INITIAL_SOURCE_CODE_UNITS) previous.children += SOURCE_SEPARATOR + source;
		else before.push({
			tag: "script",
			attrs: {
				nonce,
				[STREAM_PART_ATTRIBUTE]: ""
			},
			children: source
		});
	}
	const lastHydrationTag = before[before.length - 1];
	if (lastHydrationTag) {
		const lastSource = lastHydrationTag.children;
		if (lastSource.length + INITIAL_CLEANUP_SUFFIX.length <= MAX_INITIAL_SOURCE_CODE_UNITS) lastHydrationTag.children = lastSource + INITIAL_CLEANUP_SUFFIX;
		else before.push({
			tag: "script",
			attrs: {
				nonce,
				[STREAM_PART_ATTRIBUTE]: ""
			},
			children: INITIAL_CLEANUP_SOURCE
		});
	}
	return {
		before,
		boundary: {
			tag: "script",
			attrs: { nonce },
			children: HYDRATION_SCRIPT_BOUNDARY_SOURCE
		}
	};
}
var HydrationScriptsOwner = class {
	constructor(nonce, initialSources) {
		this.nonce = nonce;
		this.queuedSources = [];
		this.queuedSourceHead = 0;
		this.initialTaken = false;
		this.barrierLifted = false;
		this.producerDone = false;
		this.retainedSources = 0;
		this.regularCodeUnits = 0;
		this.hasOversizedSource = false;
		this.segmentIndex = 0;
		this.closingSegmentIndex = 0;
		this.source = "";
		this.sourceOffset = 0;
		this.outputCapacity = MIN_OUTPUT_BYTES;
		this.outputState = HydrationScriptOutputState.Waiting;
		this.takeInitialHydrationScriptTags = this.takeInitialHydrationScriptTags.bind(this);
		const seedSources = initialSources ?? DEFAULT_INITIAL_SOURCES;
		for (const seedSource of seedSources) {
			if (!this.account(seedSource)) break;
			this.queuedSources.push(seedSource);
		}
	}
	get state() {
		return this.outputState;
	}
	get error() {
		return this.outputError;
	}
	notify() {
		try {
			this.listener?.();
		} catch (listenerError) {
			console.error("Hydration script output listener error:", listenerError);
		}
	}
	refresh(notifyChange = true) {
		const next = this.outputState === HydrationScriptOutputState.Failed ? HydrationScriptOutputState.Failed : this.active ? HydrationScriptOutputState.Active : typeof this.consumer === "object" && this.initialTaken && this.barrierLifted && !this.queueIsEmpty() ? HydrationScriptOutputState.Ready : this.producerDone && this.initialTaken && this.queueIsEmpty() ? HydrationScriptOutputState.Done : HydrationScriptOutputState.Waiting;
		if (this.outputState !== next) {
			this.outputState = next;
			if (notifyChange) this.notify();
		}
	}
	clearTimeoutIfSet() {
		if (this.timeout !== void 0) {
			clearTimeout(this.timeout);
			this.timeout = void 0;
		}
	}
	queueIsEmpty() {
		return this.queuedSourceHead === this.queuedSources.length;
	}
	clearQueue() {
		this.queuedSources = [];
		this.queuedSourceHead = 0;
	}
	dropBufferedOutput() {
		this.clearQueue();
		this.active = void 0;
		this.retainedSources = 0;
		this.regularCodeUnits = 0;
		this.hasOversizedSource = false;
		this.segmentIndex = 0;
		this.closingSegmentIndex = 0;
		this.source = "";
		this.sourceOffset = 0;
		this.outputCapacity = MIN_OUTPUT_BYTES;
		this.opening = void 0;
	}
	fail(reason) {
		if (this.consumer === "cleaned" || this.outputState === HydrationScriptOutputState.Failed) return;
		this.outputError = reason;
		this.clearTimeoutIfSet();
		this.dropBufferedOutput();
		this.outputState = HydrationScriptOutputState.Failed;
		this.notify();
	}
	rejectBacklog(kind) {
		this.fail(/* @__PURE__ */ new Error(`SSR hydration backlog exceeded maximum ${kind} count`));
		return false;
	}
	account(nextSource) {
		if (this.retainedSources === MAX_BACKLOG_SOURCES) return this.rejectBacklog("source-part");
		if (nextSource.length > MAX_BACKLOG_CODE_UNITS) {
			if (this.hasOversizedSource) return this.rejectBacklog("code-unit");
			this.hasOversizedSource = true;
		} else if (this.regularCodeUnits + nextSource.length > MAX_BACKLOG_CODE_UNITS) return this.rejectBacklog("code-unit");
		else this.regularCodeUnits += nextSource.length;
		this.retainedSources++;
		return true;
	}
	releaseSource(part) {
		this.retainedSources--;
		if (part.length > MAX_BACKLOG_CODE_UNITS) this.hasOversizedSource = false;
		else this.regularCodeUnits -= part.length;
	}
	releaseAccounting(batch) {
		for (const part of batch) if (part !== void 0) this.releaseSource(part);
	}
	liftBarrier() {
		if (this.consumer !== "cleaned" && !this.barrierLifted) {
			this.barrierLifted = true;
			this.refresh();
		}
	}
	producerCanWrite() {
		return this.consumer !== "cleaned" && this.outputState !== HydrationScriptOutputState.Failed && !this.producerDone;
	}
	pushSource(nextSource) {
		if (!this.producerCanWrite()) return false;
		if (this.account(nextSource)) {
			this.queuedSources.push(nextSource);
			if (this.initialTaken) this.refresh();
		} else return false;
		return this.producerCanWrite();
	}
	takeQueuedBatch(batchLength) {
		if (this.queuedSourceHead === 0 && batchLength === this.queuedSources.length) {
			const batch = this.queuedSources;
			this.clearQueue();
			return batch;
		}
		const end = this.queuedSourceHead + batchLength;
		const batch = this.queuedSources.slice(this.queuedSourceHead, end);
		for (let index = this.queuedSourceHead; index < end; index++) this.queuedSources[index] = void 0;
		this.queuedSourceHead = end;
		if (this.queueIsEmpty()) this.clearQueue();
		else if (this.queuedSourceHead >= 1024 && this.queuedSourceHead >= this.queuedSources.length - this.queuedSourceHead) {
			this.queuedSources = this.queuedSources.slice(this.queuedSourceHead);
			this.queuedSourceHead = 0;
		}
		return batch;
	}
	release(batch) {
		this.releaseAccounting(batch);
		this.active = void 0;
		this.source = "";
		this.sourceOffset = 0;
		this.refresh(false);
	}
	advanceSource() {
		const batch = this.active;
		if (this.segmentIndex > 0 && this.segmentIndex < this.closingSegmentIndex) {
			const partIndex = this.segmentIndex - 1 >> 1;
			if (this.segmentIndex % 2 === 1) {
				const part = batch[partIndex];
				if (part !== void 0) {
					this.releaseSource(part);
					batch[partIndex] = void 0;
				}
			}
		}
		this.segmentIndex++;
		if (this.segmentIndex < this.closingSegmentIndex) {
			const partIndex = this.segmentIndex - 1 >> 1;
			this.source = this.segmentIndex % 2 === 1 ? batch[partIndex] : SOURCE_SEPARATOR;
		} else if (this.segmentIndex === this.closingSegmentIndex) this.source = DYNAMIC_CLOSE_SOURCE;
		else this.release(batch);
		this.sourceOffset = 0;
	}
	pullActive() {
		const bytes = new Uint8Array(this.outputCapacity);
		let offset = 0;
		while (this.active) if (this.sourceOffset === this.source.length) this.advanceSource();
		else if (offset === bytes.length) break;
		else {
			const result = encodeIntoBoundedChunk(this.source, this.sourceOffset, bytes, offset);
			if (result.read === 0) break;
			this.sourceOffset += result.read;
			offset += result.written;
		}
		if (offset === 0) throw new Error("SSR router script record produced no output");
		if (offset === bytes.length) return bytes;
		return offset * 2 < bytes.length ? bytes.slice(0, offset) : bytes.subarray(0, offset);
	}
	pullReady() {
		const scriptOpening = this.opening ??= this.nonce ? `<script nonce="${escapeAttribute(this.nonce)}">` : "<script>";
		let codeUnits = scriptOpening.length + 40;
		let batchLength = 0;
		for (let index = this.queuedSourceHead; index < this.queuedSources.length; index++) {
			const part = this.queuedSources[index];
			const nextCodeUnits = codeUnits + 1 + part.length;
			if (batchLength > 0 && nextCodeUnits > MAX_DYNAMIC_RECORD_CODE_UNITS) break;
			codeUnits = nextCodeUnits;
			batchLength++;
			if (codeUnits > MAX_DYNAMIC_RECORD_CODE_UNITS) break;
		}
		const batch = this.takeQueuedBatch(batchLength);
		if (codeUnits <= MAX_DIRECT_CODE_UNITS) {
			const joined = batch.length === 1 ? batch[0] : batch.join(SOURCE_SEPARATOR);
			const bytes = encoder.encode(scriptOpening + joined + ";document.currentScript.remove()<\/script>");
			this.release(batch);
			return bytes;
		}
		this.active = batch;
		this.segmentIndex = 0;
		this.closingSegmentIndex = (batch.length << 1) + 1;
		this.source = scriptOpening;
		this.sourceOffset = 0;
		this.outputCapacity = Math.max(MIN_OUTPUT_BYTES, Math.min(MAX_HYDRATION_OUTPUT_CHUNK_BYTES, codeUnits));
		this.outputState = HydrationScriptOutputState.Active;
		return this.pullActive();
	}
	pullChunk() {
		if (this.outputState !== HydrationScriptOutputState.Ready && this.outputState !== HydrationScriptOutputState.Active) throw new Error("Hydration script output is not ready");
		try {
			return this.outputState === HydrationScriptOutputState.Ready ? this.pullReady() : this.pullActive();
		} catch (cause) {
			this.fail(cause);
			throw cause;
		}
	}
	subscribe(onChange) {
		if (this.consumer === "cleaned") return () => {};
		if (this.listener) throw new Error("SSR hydration output already has a subscriber");
		this.listener = onChange;
		return () => {
			if (this.listener === onChange) this.listener = void 0;
		};
	}
	pushSerializedSource(data, initial, wrap) {
		let serialized = initial ? ROUTER_PREFIX + data : data;
		if (wrap) serialized = PROMISE_PREFIX + serialized + ")";
		return this.pushSource(serialized);
	}
	finish() {
		if (!this.pushSource("$_TSR.e()")) return;
		this.producerDone = true;
		this.clearTimeoutIfSet();
		this.refresh();
	}
	takeInitialHydrationScriptTags() {
		if (this.consumer === "cleaned" || this.outputState === HydrationScriptOutputState.Failed || this.initialTaken) return;
		const sources = this.queuedSources;
		const tags = createInitialTags(sources, this.nonce);
		this.initialTaken = true;
		this.releaseAccounting(sources);
		sources.length = 0;
		this.queuedSourceHead = 0;
		this.refresh();
		return tags;
	}
	/**
	* Opt this request out of hydration output entirely (for example a
	* `hydrate: false` page). Drops the queued bootstrap sources, marks the
	* producer done, and makes the fast pass-through path reservable without
	* a rendered `<Scripts>` boundary. Must run before the initial take and
	* before serialization produces output.
	*/
	disableHydration() {
		if (this.consumer === "cleaned" || this.outputState === HydrationScriptOutputState.Failed) return;
		if (this.initialTaken || this.consumer !== void 0 || this.producerDone) invariant();
		this.releaseAccounting(this.queuedSources);
		this.clearQueue();
		this.initialTaken = true;
		this.barrierLifted = true;
		this.producerDone = true;
		this.refresh();
	}
	isInitialTaken() {
		return this.initialTaken;
	}
	skipInitialTake() {
		if (this.consumer !== "cleaned" && !this.initialTaken) {
			this.initialTaken = true;
			this.refresh();
		}
	}
	claimOutput() {
		if (this.consumer === "cleaned") throw new Error("SSR hydration script output is already cleaned up");
		if (this.consumer !== void 0) throw new Error("SSR hydration script output already has a consumer");
		this.consumer = this;
		this.refresh(false);
		return this;
	}
	reserveFastPath(output) {
		const ownsConsumer = this.consumer === output;
		if (this.outputState === HydrationScriptOutputState.Failed || !this.producerDone || !this.initialTaken || !this.queueIsEmpty() || this.active || !ownsConsumer) return false;
		this.consumer = "fast-path";
		return true;
	}
	startSerializationTimeout(timeoutMs) {
		if (this.consumer === "cleaned" || this.outputState === HydrationScriptOutputState.Failed || this.producerDone || this.timeout !== void 0) return;
		this.timeout = setTimeout(() => {
			this.timeout = void 0;
			if (this.consumer !== "cleaned" && this.outputState !== HydrationScriptOutputState.Failed && !this.producerDone) {
				console.error("Serialization timeout after app render finished");
				this.fail(/* @__PURE__ */ new Error("Serialization timeout after app render finished"));
			}
		}, timeoutMs);
	}
	cleanup() {
		if (this.consumer === "cleaned") return;
		this.consumer = "cleaned";
		this.clearTimeoutIfSet();
		this.dropBufferedOutput();
		this.listener = void 0;
		this.outputError = void 0;
		this.producerDone = true;
		this.outputState = HydrationScriptOutputState.Done;
	}
};
/** Create the hydration-script owner for one server request. */
function createHydrationScripts(nonce, initialSources) {
	return new HydrationScriptsOwner(nonce, initialSources);
}
// node_modules/@tanstack/router-core/dist/esm/ssr/handlerCallback.js
function isSsrResponse(value) {
	if (typeof value !== "object" || value === null || !("response" in value) || !(value.response instanceof Response) || !("serverSsrCleanup" in value)) return false;
	if (value.serverSsrCleanup === "none") return true;
	return value.serverSsrCleanup === "stream" && "dispose" in value && typeof value.dispose === "function";
}
function normalizeSsrResponse(result) {
	if (result instanceof Response) return {
		response: result,
		serverSsrCleanup: "none"
	};
	if (isSsrResponse(result)) return result;
	throw new TypeError("Expected a Response from the SSR handler");
}
function cancelResponseBody(response, reason) {
	const body = response.body;
	if (!body) return;
	body.cancel(reason).catch(console.error);
}
function disposeSsrResponse(result, reason) {
	const response = normalizeSsrResponse(result);
	if (response.serverSsrCleanup === "stream") response.dispose(reason);
	else cancelResponseBody(response.response, reason);
}
/** The HTTP status that Router's server load selected for this render. */
function getSsrStatus(router) {
	return router._serverResult?.type === "render" ? router._serverResult.status : 200;
}
function createSsrStreamResponse(router, response) {
	const body = response.body;
	if (!body) throw new Error("Invariant failed: SSR stream response requires a body");
	return {
		response,
		serverSsrCleanup: "stream",
		dispose(reason) {
			router.serverSsr?.cleanup();
			body.cancel(reason).catch(() => {});
		}
	};
}
function bindSsrResponseToRequest(router, result, signal) {
	const ssrResponse = normalizeSsrResponse(result);
	if (ssrResponse.serverSsrCleanup !== "stream") {
		if (signal.aborted) disposeSsrResponse(result, signal.reason);
		return ssrResponse;
	}
	const abort = () => {
		disposeSsrResponse(ssrResponse, signal.reason);
	};
	if (signal.aborted) {
		abort();
		return ssrResponse;
	}
	const serverSsr = router?.serverSsr;
	if (serverSsr?.hydrationScripts.requestSignal === signal) {
		serverSsr.onCleanup(() => {
			if (signal.aborted) abort();
		});
		return ssrResponse;
	}
	signal.addEventListener("abort", abort, { once: true });
	if (!serverSsr) return ssrResponse;
	serverSsr.onCleanup(() => {
		signal.removeEventListener("abort", abort);
	});
	return ssrResponse;
}
function stripSsrResponseBody(result, reason) {
	const ssrResponse = normalizeSsrResponse(result);
	disposeSsrResponse(ssrResponse, reason);
	return {
		response: new Response(null, ssrResponse.response),
		serverSsrCleanup: "none"
	};
}
function defineHandlerCallback(handler) {
	return handler;
}
// node_modules/@tanstack/router-core/dist/esm/ssr/transformStreamWithRouter.js
var DEFAULT_SERIALIZATION_TIMEOUT_MS = 6e4;
var MIN_APPLICATION_STRING_CHUNK_BYTES = 256;
var MAX_APPLICATION_STRING_CHUNK_BYTES = 65536;
var ApplicationPhase = {
	BeforeBoundary: 0,
	Merge: 1,
	HeldClose: 2,
	PassThrough: 3
};
function releaseReader(reader) {
	try {
		reader.releaseLock();
	} catch {}
}
function cancelReader(reader, reason) {
	const cancelled = reader.cancel(reason).catch(() => {});
	releaseReader(reader);
	return cancelled;
}
function finalizeSsrStream(kind, reason, controller, reader, serverSsr, onAbort) {
	try {
		if (kind === "complete") controller.close();
		else if (kind === "failure") controller.error(reason);
	} catch {}
	const aborted = kind !== "complete";
	if (aborted) try {
		onAbort?.(reason);
	} catch {}
	const readerDone = aborted ? cancelReader(reader, reason) : releaseReader(reader);
	serverSsr.cleanup();
	return readerDone;
}
function getLifetimeMs(opts) {
	return opts?.lifetimeMs ?? (opts?.timeoutMs ?? DEFAULT_SERIALIZATION_TIMEOUT_MS) * 2;
}
function createCleanupAbortError() {
	const error = /* @__PURE__ */ new Error("SSR stream transform aborted by router SSR cleanup");
	error.name = "AbortError";
	return error;
}
function listenForAbort(signal, onAbort) {
	if (!signal) return;
	const listener = () => onAbort(signal.reason);
	signal.addEventListener("abort", listener, { once: true });
	return () => signal.removeEventListener("abort", listener);
}
/**
* Create a timer that does not keep the Node.js process alive when this
* last-resort stream backstop is the only remaining work.
*
* Node's global `setTimeout()` returns a `Timeout` object with `unref()`.
* Web-standard runtimes return a numeric timer ID instead. Cloudflare Workers
* retain that Web behavior for global timers even when `nodejs_compat` is
* enabled. Accessing an optional property on a numeric ID is safe, so timer
* creation can normalize the Node-only capability without allocating a
* wrapper object. The native handle is returned unchanged for `clearTimeout`.
*/
function setUnrefTimeout(callback, timeoutMs) {
	const handle = setTimeout(callback, timeoutMs);
	handle.unref?.();
	return handle;
}
/**
* Arm the shared teardown triggers of a transform stream: the lifetime
* backstop timer, the request-abort listener, and the external-cleanup
* listener. Returns a disarm function that `terminate()` calls exactly once;
* teardown ordering must stay identical between the fast and merge paths.
*/
function armStreamLifecycle(serverSsr, opts, isTerminal, terminate) {
	const signal = opts?.signal;
	let lifetimeTimeoutHandle;
	let stopAbortListener;
	const disarm = () => {
		stopAbortListener?.();
		stopAbortListener = void 0;
		if (signal && serverSsr.hydrationScripts.requestSignal === signal) serverSsr.hydrationScripts.requestSignal = void 0;
		if (lifetimeTimeoutHandle !== void 0) {
			clearTimeout(lifetimeTimeoutHandle);
			lifetimeTimeoutHandle = void 0;
		}
	};
	const lifetimeMs = getLifetimeMs(opts);
	lifetimeTimeoutHandle = setUnrefTimeout(() => {
		if (isTerminal()) return;
		const error = /* @__PURE__ */ new Error("Stream lifetime exceeded");
		console.warn(`SSR stream transform exceeded maximum lifetime (${lifetimeMs}ms), forcing cleanup`);
		terminate("failure", error);
	}, lifetimeMs);
	stopAbortListener = listenForAbort(signal, (reason) => {
		terminate("failure", reason);
	});
	if (signal) serverSsr.hydrationScripts.requestSignal = signal;
	serverSsr.onCleanup(() => {
		if (!isTerminal()) terminate("failure", createCleanupAbortError());
	});
	return disarm;
}
function cleanupFailedStreamCreation(serverSsr, onAbort, error) {
	try {
		onAbort?.(error);
	} catch {}
	serverSsr.cleanup();
}
function encodeStringSource(value, offset) {
	const remaining = value.length - offset;
	const capacity = Math.min(MAX_APPLICATION_STRING_CHUNK_BYTES, Math.max(MIN_APPLICATION_STRING_CHUNK_BYTES, Math.min(value.length, remaining * 3)));
	const output = new Uint8Array(capacity);
	const { read, written } = encodeIntoBoundedChunk(value, offset, output);
	return {
		bytes: written === output.length ? output : output.subarray(0, written),
		read
	};
}
function transformReadableStreamWithRouter(router, appStream, opts) {
	const serverSsr = router.serverSsr;
	if (!serverSsr) throw new Error("Invariant failed: router.serverSsr is required");
	const hydrationScripts = serverSsr.hydrationScripts;
	let reader;
	try {
		reader = appStream.getReader();
	} catch (error) {
		cleanupFailedStreamCreation(serverSsr, opts?.onAbort, error);
		throw error;
	}
	try {
		opts?.signal?.throwIfAborted();
		if (hydrationScripts.reserveFastPath()) return makeMergeStream(serverSsr, reader, void 0, opts);
		const hydrationOutput = hydrationScripts.claimOutput();
		if (hydrationOutput.state === HydrationScriptOutputState.Failed) throw hydrationOutput.error;
		return makeMergeStream(serverSsr, reader, hydrationOutput, opts);
	} catch (error) {
		cancelReader(reader, error);
		cleanupFailedStreamCreation(serverSsr, opts?.onAbort, error);
		throw error;
	}
}
function makeMergeStream(serverSsr, reader, hydrationOutput, opts) {
	const hydrationScripts = serverSsr.hydrationScripts;
	let controller;
	let terminal = false;
	let appDone = false;
	let applicationPhase = hydrationOutput ? ApplicationPhase.BeforeBoundary : ApplicationPhase.PassThrough;
	let insertionBoundary = false;
	let stopHydrationOutputListener;
	let appReadPending = false;
	let settledAppRead;
	let appBytes;
	let appOffset = 0;
	let documentCloseIndex;
	let appString;
	let appStringOffset = 0;
	const useScriptCloseSafePoints = opts?.rendererSafePoint === "script-close";
	const useRecordEndSafePoints = opts?.rendererSafePoint === "record-end";
	let barrierMatcher;
	let safePointMatcher;
	let closeCarry;
	let wakeResolve;
	let disarmLifecycle = () => {};
	function waitForWake() {
		return new Promise((resolve) => {
			wakeResolve = resolve;
		});
	}
	function wakePump() {
		const resolve = wakeResolve;
		wakeResolve = void 0;
		resolve?.();
	}
	function enqueueAppBytes(value) {
		if (value.length === 0) return false;
		controller.enqueue(value);
		return true;
	}
	function finishAppChunk() {
		appBytes = void 0;
		documentCloseIndex = void 0;
		if (appString === void 0 && useRecordEndSafePoints && closeCarry === void 0) insertionBoundary = true;
	}
	function emitAppRange(end, safePoint, finishCurrentChunk = end === appBytes.length) {
		const value = appBytes;
		const output = appOffset === 0 && end === value.length ? value : value.subarray(appOffset, end);
		appOffset = end;
		if (safePoint) insertionBoundary = true;
		if (finishCurrentChunk) finishAppChunk();
		return enqueueAppBytes(output);
	}
	function loadNextAppStringChunk() {
		const value = appString;
		const encoded = encodeStringSource(value, appStringOffset);
		appStringOffset += encoded.read;
		appBytes = encoded.bytes;
		appOffset = 0;
		if (appStringOffset === value.length) appString = void 0;
	}
	function processUntilBarrier() {
		const value = appBytes;
		if (!hydrationScripts.isInitialTaken()) return emitAppRange(value.length, false);
		const matchEnd = advanceByteMatcher(barrierMatcher ??= {
			pattern: HYDRATION_SCRIPT_BOUNDARY_BYTES,
			anchorIndex: HYDRATION_SCRIPT_BOUNDARY_ANCHOR_INDEX,
			matched: 0
		}, value, appOffset);
		if (matchEnd === void 0) return emitAppRange(value.length, false);
		applicationPhase = ApplicationPhase.Merge;
		hydrationScripts.liftBarrier();
		return emitAppRange(matchEnd, true);
	}
	function enterHeldClose(consumed, prefix) {
		appOffset = consumed;
		applicationPhase = ApplicationPhase.HeldClose;
		if (safePointMatcher) safePointMatcher.matched = 0;
		insertionBoundary = true;
		if (appOffset === appBytes.length) finishAppChunk();
		return prefix ? enqueueAppBytes(prefix) : false;
	}
	function holdDocumentClose(matchStart) {
		const value = appBytes;
		return enterHeldClose(matchStart + DOCUMENT_CLOSE_BYTES.length, matchStart === appOffset ? void 0 : value.subarray(appOffset, matchStart));
	}
	function processUntilSafePoint(endIndex) {
		const matchEnd = findSafePointEnd(appBytes, appOffset, endIndex);
		if (matchEnd === void 0) return false;
		return emitAppRange(matchEnd, true);
	}
	function findSafePointEnd(value, startIndex, endIndex) {
		const hydrationState = hydrationOutput.state;
		if (endIndex === startIndex || hydrationState === HydrationScriptOutputState.Done) return;
		const scanValue = endIndex === value.length ? value : value.subarray(0, endIndex);
		const matcher = safePointMatcher ??= {
			pattern: SCRIPT_CLOSE_BYTES,
			anchorIndex: SCRIPT_CLOSE_ANCHOR_INDEX,
			matched: 0
		};
		const waiting = hydrationState === HydrationScriptOutputState.Waiting;
		const matchEnd = advanceByteMatcher(matcher, scanValue, startIndex, waiting);
		if (matchEnd === void 0) return;
		if (waiting) matcher.matched = 0;
		return matchEnd;
	}
	function processCloseCarry() {
		const value = appBytes;
		const carry = closeCarry;
		const headLength = Math.min(value.length - appOffset, DOCUMENT_CLOSE_BYTES.length);
		const combined = new Uint8Array(carry.length + headLength);
		combined.set(carry);
		combined.set(value.subarray(appOffset, appOffset + headLength), carry.length);
		const matchStart = findExactBytes(combined, DOCUMENT_CLOSE_BYTES, 0, DOCUMENT_CLOSE_ANCHOR_INDEX);
		const partial = matchStart < 0 ? getExactBytesPrefixAtEnd(combined, DOCUMENT_CLOSE_BYTES) : void 0;
		const safeEnd = matchStart >= 0 ? matchStart : partial ?? combined.length;
		if (useScriptCloseSafePoints) {
			const safePointEnd = findSafePointEnd(combined, 0, safeEnd);
			if (safePointEnd !== void 0) {
				appOffset += safePointEnd - carry.length;
				closeCarry = void 0;
				insertionBoundary = true;
				if (appOffset === value.length) finishAppChunk();
				return enqueueAppBytes(combined.subarray(0, safePointEnd));
			}
		}
		if (matchStart >= 0) {
			closeCarry = void 0;
			return enterHeldClose(appOffset + matchStart + DOCUMENT_CLOSE_BYTES.length - carry.length, matchStart === 0 ? void 0 : combined.subarray(0, matchStart));
		}
		closeCarry = partial === void 0 ? void 0 : combined.slice(partial);
		appOffset += headLength;
		return enqueueAppBytes(safeEnd === combined.length ? combined : combined.subarray(0, safeEnd));
	}
	function processUntilDocumentClose() {
		const value = appBytes;
		if (closeCarry) {
			if (processCloseCarry()) return true;
			if (applicationPhase === ApplicationPhase.HeldClose) return false;
			if (appOffset >= value.length) {
				finishAppChunk();
				return false;
			}
		}
		const matchStart = documentCloseIndex ??= findExactBytes(value, DOCUMENT_CLOSE_BYTES, appOffset, DOCUMENT_CLOSE_ANCHOR_INDEX);
		if (matchStart >= 0) {
			if (useScriptCloseSafePoints && processUntilSafePoint(matchStart)) return true;
			return holdDocumentClose(matchStart);
		}
		const partial = getExactBytesPrefixAtEnd(value, DOCUMENT_CLOSE_BYTES, appOffset);
		const safeEnd = partial ?? value.length;
		if (useScriptCloseSafePoints && processUntilSafePoint(safeEnd)) return true;
		closeCarry = partial === void 0 ? void 0 : value.slice(partial);
		return emitAppRange(safeEnd, false, true);
	}
	function processAppChunk() {
		if (appOffset >= appBytes.length) {
			finishAppChunk();
			return false;
		}
		insertionBoundary = false;
		if (applicationPhase === ApplicationPhase.BeforeBoundary) return processUntilBarrier();
		if (applicationPhase === ApplicationPhase.Merge) return processUntilDocumentClose();
		const value = appBytes;
		if (useScriptCloseSafePoints && processUntilSafePoint(value.length)) return true;
		return emitAppRange(value.length, false);
	}
	function terminate(kind, reason) {
		if (terminal) return;
		terminal = true;
		stopHydrationOutputListener?.();
		stopHydrationOutputListener = void 0;
		disarmLifecycle();
		settledAppRead = void 0;
		appBytes = void 0;
		documentCloseIndex = void 0;
		appString = void 0;
		closeCarry = void 0;
		wakePump();
		return finalizeSsrStream(kind, reason, controller, reader, serverSsr, opts?.onAbort);
	}
	function startAppRead() {
		if (appReadPending || settledAppRead || terminal) return;
		appReadPending = true;
		reader.read().then((result) => {
			appReadPending = false;
			if (!terminal) {
				if (result.done) acceptAppRead(result);
				else settledAppRead = result;
				wakePump();
			}
		}, (error) => {
			appReadPending = false;
			if (!terminal) handlePumpError(error);
		});
	}
	function acceptAppRead(result) {
		if (result.done) {
			appDone = true;
			insertionBoundary = closeCarry === void 0;
			hydrationScripts.startSerializationTimeout(opts?.timeoutMs ?? DEFAULT_SERIALIZATION_TIMEOUT_MS);
			serverSsr.setRenderFinished();
			return;
		}
		const value = result.value;
		if (typeof value === "string") {
			if (value.length === 0) return;
			appString = value;
			appStringOffset = 0;
			insertionBoundary = false;
			loadNextAppStringChunk();
			return;
		}
		if (value.byteLength === 0) return;
		appBytes = value;
		appOffset = 0;
		insertionBoundary = false;
	}
	async function loadNextAppChunk() {
		if (appString !== void 0) {
			loadNextAppStringChunk();
			return;
		}
		if (settledAppRead) {
			const settled = settledAppRead;
			settledAppRead = void 0;
			acceptAppRead(settled);
			return;
		}
		if (!(applicationPhase !== ApplicationPhase.BeforeBoundary && insertionBoundary && hydrationOutput.state !== HydrationScriptOutputState.Done) && !appReadPending) {
			const result = await reader.read();
			if (terminal) return;
			acceptAppRead(result);
			return;
		}
		const wake = waitForWake();
		startAppRead();
		await wake;
	}
	async function pumpPassThrough() {
		try {
			for (;;) {
				if (appBytes) {
					const remainder = appOffset === 0 ? appBytes : appBytes.subarray(appOffset);
					appBytes = void 0;
					if (enqueueAppBytes(remainder)) return;
					continue;
				}
				if (appString !== void 0) {
					loadNextAppStringChunk();
					continue;
				}
				if (appDone) {
					terminate("complete");
					return;
				}
				if (appReadPending) {
					await waitForWake();
					continue;
				}
				let result = settledAppRead;
				if (result) settledAppRead = void 0;
				else {
					result = await reader.read();
					if (terminal) return;
				}
				if (result.done || typeof result.value === "string") {
					acceptAppRead(result);
					continue;
				}
				if (result.value.byteLength > 0) {
					controller.enqueue(result.value);
					return;
				}
			}
		} catch (error) {
			handlePumpError(error);
		}
	}
	async function pump() {
		const output = hydrationOutput;
		while (!terminal) {
			const hydrationState = output.state;
			if (hydrationState === HydrationScriptOutputState.Active) {
				controller.enqueue(output.pullChunk());
				return;
			}
			if (applicationPhase !== ApplicationPhase.BeforeBoundary && insertionBoundary && hydrationState === HydrationScriptOutputState.Ready) {
				if (!appDone && !appBytes && appString === void 0) startAppRead();
				controller.enqueue(output.pullChunk());
				return;
			}
			if (applicationPhase === ApplicationPhase.Merge && hydrationState === HydrationScriptOutputState.Done && closeCarry === void 0 && hydrationScripts.reserveFastPath(output)) {
				applicationPhase = ApplicationPhase.PassThrough;
				stopHydrationOutputListener?.();
				stopHydrationOutputListener = void 0;
				return pumpPassThrough();
			}
			if (appBytes) {
				if (processAppChunk()) return;
				continue;
			}
			if (appDone) {
				if (applicationPhase === ApplicationPhase.BeforeBoundary) {
					hydrationScripts.skipInitialTake();
					applicationPhase = ApplicationPhase.Merge;
					insertionBoundary = true;
					continue;
				}
				if (closeCarry) {
					const carry = closeCarry;
					closeCarry = void 0;
					insertionBoundary = true;
					if (enqueueAppBytes(carry)) return;
					continue;
				}
				if (hydrationState === HydrationScriptOutputState.Waiting) {
					await waitForWake();
					continue;
				}
				if (applicationPhase === ApplicationPhase.HeldClose) {
					controller.enqueue(DOCUMENT_CLOSE_BYTES.slice());
					terminate("complete");
					return;
				}
				terminate("complete");
				return;
			}
			await loadNextAppChunk();
		}
	}
	function handlePumpError(error) {
		if (terminal) return;
		console.error("Error processing appStream:", error);
		terminate("failure", error);
	}
	const stream = new ReadableStream({
		start(c) {
			controller = c;
		},
		pull() {
			return applicationPhase === ApplicationPhase.PassThrough ? pumpPassThrough() : pump().catch(handlePumpError);
		},
		cancel(reason) {
			return terminate("cancel", reason);
		}
	});
	if (hydrationOutput) stopHydrationOutputListener = hydrationOutput.subscribe(() => {
		if (hydrationOutput.state === HydrationScriptOutputState.Failed) {
			terminate("failure", hydrationOutput.error);
			return;
		}
		wakePump();
	});
	disarmLifecycle = armStreamLifecycle(serverSsr, opts, () => terminal, terminate);
	return stream;
}
// node_modules/react-dom/cjs/react-dom-server-legacy.node.production.min.js
/**
* @license React
* react-dom-server-legacy.node.production.min.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_dom_server_legacy_node_production_min = /* @__PURE__ */ __commonJSMin(((exports) => {
	var ea = require_react();
	var fa = __require("stream");
	var n = Object.prototype.hasOwnProperty;
	var ha = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/;
	var ia = {};
	var ja = {};
	function ka(a) {
		if (n.call(ja, a)) return !0;
		if (n.call(ia, a)) return !1;
		if (ha.test(a)) return ja[a] = !0;
		ia[a] = !0;
		return !1;
	}
	function q(a, b, c, d, f, e, g) {
		this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
		this.attributeName = d;
		this.attributeNamespace = f;
		this.mustUseProperty = c;
		this.propertyName = a;
		this.type = b;
		this.sanitizeURL = e;
		this.removeEmptyString = g;
	}
	var r = {};
	"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
		r[a] = new q(a, 0, !1, a, null, !1, !1);
	});
	[
		["acceptCharset", "accept-charset"],
		["className", "class"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"]
	].forEach(function(a) {
		var b = a[0];
		r[b] = new q(b, 1, !1, a[1], null, !1, !1);
	});
	[
		"contentEditable",
		"draggable",
		"spellCheck",
		"value"
	].forEach(function(a) {
		r[a] = new q(a, 2, !1, a.toLowerCase(), null, !1, !1);
	});
	[
		"autoReverse",
		"externalResourcesRequired",
		"focusable",
		"preserveAlpha"
	].forEach(function(a) {
		r[a] = new q(a, 2, !1, a, null, !1, !1);
	});
	"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
		r[a] = new q(a, 3, !1, a.toLowerCase(), null, !1, !1);
	});
	[
		"checked",
		"multiple",
		"muted",
		"selected"
	].forEach(function(a) {
		r[a] = new q(a, 3, !0, a, null, !1, !1);
	});
	["capture", "download"].forEach(function(a) {
		r[a] = new q(a, 4, !1, a, null, !1, !1);
	});
	[
		"cols",
		"rows",
		"size",
		"span"
	].forEach(function(a) {
		r[a] = new q(a, 6, !1, a, null, !1, !1);
	});
	["rowSpan", "start"].forEach(function(a) {
		r[a] = new q(a, 5, !1, a.toLowerCase(), null, !1, !1);
	});
	var la = /[\-:]([a-z])/g;
	function ma(a) {
		return a[1].toUpperCase();
	}
	"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
		var b = a.replace(la, ma);
		r[b] = new q(b, 1, !1, a, null, !1, !1);
	});
	"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
		var b = a.replace(la, ma);
		r[b] = new q(b, 1, !1, a, "http://www.w3.org/1999/xlink", !1, !1);
	});
	[
		"xml:base",
		"xml:lang",
		"xml:space"
	].forEach(function(a) {
		var b = a.replace(la, ma);
		r[b] = new q(b, 1, !1, a, "http://www.w3.org/XML/1998/namespace", !1, !1);
	});
	["tabIndex", "crossOrigin"].forEach(function(a) {
		r[a] = new q(a, 1, !1, a.toLowerCase(), null, !1, !1);
	});
	r.xlinkHref = new q("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
	[
		"src",
		"href",
		"action",
		"formAction"
	].forEach(function(a) {
		r[a] = new q(a, 1, !1, a.toLowerCase(), null, !0, !0);
	});
	var t = {
		animationIterationCount: !0,
		aspectRatio: !0,
		borderImageOutset: !0,
		borderImageSlice: !0,
		borderImageWidth: !0,
		boxFlex: !0,
		boxFlexGroup: !0,
		boxOrdinalGroup: !0,
		columnCount: !0,
		columns: !0,
		flex: !0,
		flexGrow: !0,
		flexPositive: !0,
		flexShrink: !0,
		flexNegative: !0,
		flexOrder: !0,
		gridArea: !0,
		gridRow: !0,
		gridRowEnd: !0,
		gridRowSpan: !0,
		gridRowStart: !0,
		gridColumn: !0,
		gridColumnEnd: !0,
		gridColumnSpan: !0,
		gridColumnStart: !0,
		fontWeight: !0,
		lineClamp: !0,
		lineHeight: !0,
		opacity: !0,
		order: !0,
		orphans: !0,
		tabSize: !0,
		widows: !0,
		zIndex: !0,
		zoom: !0,
		fillOpacity: !0,
		floodOpacity: !0,
		stopOpacity: !0,
		strokeDasharray: !0,
		strokeDashoffset: !0,
		strokeMiterlimit: !0,
		strokeOpacity: !0,
		strokeWidth: !0
	};
	var na = [
		"Webkit",
		"ms",
		"Moz",
		"O"
	];
	Object.keys(t).forEach(function(a) {
		na.forEach(function(b) {
			b = b + a.charAt(0).toUpperCase() + a.substring(1);
			t[b] = t[a];
		});
	});
	var oa = /["'&<>]/;
	function u(a) {
		if ("boolean" === typeof a || "number" === typeof a) return "" + a;
		a = "" + a;
		var b = oa.exec(a);
		if (b) {
			var c = "", d, f = 0;
			for (d = b.index; d < a.length; d++) {
				switch (a.charCodeAt(d)) {
					case 34:
						b = "&quot;";
						break;
					case 38:
						b = "&amp;";
						break;
					case 39:
						b = "&#x27;";
						break;
					case 60:
						b = "&lt;";
						break;
					case 62:
						b = "&gt;";
						break;
					default: continue;
				}
				f !== d && (c += a.substring(f, d));
				f = d + 1;
				c += b;
			}
			a = f !== d ? c + a.substring(f, d) : c;
		}
		return a;
	}
	var pa = /([A-Z])/g;
	var qa = /^ms-/;
	var ra = Array.isArray;
	function v(a, b) {
		return {
			insertionMode: a,
			selectedValue: b
		};
	}
	function sa(a, b, c) {
		switch (b) {
			case "select": return v(1, null != c.value ? c.value : c.defaultValue);
			case "svg": return v(2, null);
			case "math": return v(3, null);
			case "foreignObject": return v(1, null);
			case "table": return v(4, null);
			case "thead":
			case "tbody":
			case "tfoot": return v(5, null);
			case "colgroup": return v(7, null);
			case "tr": return v(6, null);
		}
		return 4 <= a.insertionMode || 0 === a.insertionMode ? v(1, null) : a;
	}
	var ta = /* @__PURE__ */ new Map();
	function ua(a, b, c) {
		if ("object" !== typeof c) throw Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
		b = !0;
		for (var d in c) if (n.call(c, d)) {
			var f = c[d];
			if (null != f && "boolean" !== typeof f && "" !== f) {
				if (0 === d.indexOf("--")) {
					var e = u(d);
					f = u(("" + f).trim());
				} else {
					e = d;
					var g = ta.get(e);
					void 0 !== g ? e = g : (g = u(e.replace(pa, "-$1").toLowerCase().replace(qa, "-ms-")), ta.set(e, g), e = g);
					f = "number" === typeof f ? 0 === f || n.call(t, d) ? "" + f : f + "px" : u(("" + f).trim());
				}
				b ? (b = !1, a.push(" style=\"", e, ":", f)) : a.push(";", e, ":", f);
			}
		}
		b || a.push("\"");
	}
	function w(a, b, c, d) {
		switch (c) {
			case "style":
				ua(a, b, d);
				return;
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning": return;
		}
		if (!(2 < c.length) || "o" !== c[0] && "O" !== c[0] || "n" !== c[1] && "N" !== c[1]) {
			if (b = r.hasOwnProperty(c) ? r[c] : null, null !== b) {
				switch (typeof d) {
					case "function":
					case "symbol": return;
					case "boolean": if (!b.acceptsBooleans) return;
				}
				c = b.attributeName;
				switch (b.type) {
					case 3:
						d && a.push(" ", c, "=\"\"");
						break;
					case 4:
						!0 === d ? a.push(" ", c, "=\"\"") : !1 !== d && a.push(" ", c, "=\"", u(d), "\"");
						break;
					case 5:
						isNaN(d) || a.push(" ", c, "=\"", u(d), "\"");
						break;
					case 6:
						!isNaN(d) && 1 <= d && a.push(" ", c, "=\"", u(d), "\"");
						break;
					default: b.sanitizeURL && (d = "" + d), a.push(" ", c, "=\"", u(d), "\"");
				}
			} else if (ka(c)) {
				switch (typeof d) {
					case "function":
					case "symbol": return;
					case "boolean": if (b = c.toLowerCase().slice(0, 5), "data-" !== b && "aria-" !== b) return;
				}
				a.push(" ", c, "=\"", u(d), "\"");
			}
		}
	}
	function x(a, b, c) {
		if (null != b) {
			if (null != c) throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
			if ("object" !== typeof b || !("__html" in b)) throw Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
			b = b.__html;
			null !== b && void 0 !== b && a.push("" + b);
		}
	}
	function va(a) {
		var b = "";
		ea.Children.forEach(a, function(a) {
			null != a && (b += a);
		});
		return b;
	}
	function wa(a, b, c, d) {
		a.push(z(c));
		var f = c = null, e;
		for (e in b) if (n.call(b, e)) {
			var g = b[e];
			if (null != g) switch (e) {
				case "children":
					c = g;
					break;
				case "dangerouslySetInnerHTML":
					f = g;
					break;
				default: w(a, d, e, g);
			}
		}
		a.push(">");
		x(a, f, c);
		return "string" === typeof c ? (a.push(u(c)), null) : c;
	}
	var xa = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/;
	var ya = /* @__PURE__ */ new Map();
	function z(a) {
		var b = ya.get(a);
		if (void 0 === b) {
			if (!xa.test(a)) throw Error("Invalid tag: " + a);
			b = "<" + a;
			ya.set(a, b);
		}
		return b;
	}
	function za(a, b, c, d, f) {
		switch (b) {
			case "select":
				a.push(z("select"));
				var e = null, g = null;
				for (l in c) if (n.call(c, l)) {
					var h = c[l];
					if (null != h) switch (l) {
						case "children":
							e = h;
							break;
						case "dangerouslySetInnerHTML":
							g = h;
							break;
						case "defaultValue":
						case "value": break;
						default: w(a, d, l, h);
					}
				}
				a.push(">");
				x(a, g, e);
				return e;
			case "option":
				g = f.selectedValue;
				a.push(z("option"));
				var k = h = null, m = null;
				var l = null;
				for (e in c) if (n.call(c, e)) {
					var p = c[e];
					if (null != p) switch (e) {
						case "children":
							h = p;
							break;
						case "selected":
							m = p;
							break;
						case "dangerouslySetInnerHTML":
							l = p;
							break;
						case "value": k = p;
						default: w(a, d, e, p);
					}
				}
				if (null != g) if (c = null !== k ? "" + k : va(h), ra(g)) {
					for (d = 0; d < g.length; d++) if ("" + g[d] === c) {
						a.push(" selected=\"\"");
						break;
					}
				} else "" + g === c && a.push(" selected=\"\"");
				else m && a.push(" selected=\"\"");
				a.push(">");
				x(a, l, h);
				return h;
			case "textarea":
				a.push(z("textarea"));
				l = g = e = null;
				for (h in c) if (n.call(c, h) && (k = c[h], null != k)) switch (h) {
					case "children":
						l = k;
						break;
					case "value":
						e = k;
						break;
					case "defaultValue":
						g = k;
						break;
					case "dangerouslySetInnerHTML": throw Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
					default: w(a, d, h, k);
				}
				null === e && null !== g && (e = g);
				a.push(">");
				if (null != l) {
					if (null != e) throw Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
					if (ra(l) && 1 < l.length) throw Error("<textarea> can only have at most one child.");
					e = "" + l;
				}
				"string" === typeof e && "\n" === e[0] && a.push("\n");
				null !== e && a.push(u("" + e));
				return null;
			case "input":
				a.push(z("input"));
				k = l = h = e = null;
				for (g in c) if (n.call(c, g) && (m = c[g], null != m)) switch (g) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error("input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
					case "defaultChecked":
						k = m;
						break;
					case "defaultValue":
						h = m;
						break;
					case "checked":
						l = m;
						break;
					case "value":
						e = m;
						break;
					default: w(a, d, g, m);
				}
				null !== l ? w(a, d, "checked", l) : null !== k && w(a, d, "checked", k);
				null !== e ? w(a, d, "value", e) : null !== h && w(a, d, "value", h);
				a.push("/>");
				return null;
			case "menuitem":
				a.push(z("menuitem"));
				for (var B in c) if (n.call(c, B) && (e = c[B], null != e)) switch (B) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error("menuitems cannot have `children` nor `dangerouslySetInnerHTML`.");
					default: w(a, d, B, e);
				}
				a.push(">");
				return null;
			case "title":
				a.push(z("title"));
				e = null;
				for (p in c) if (n.call(c, p) && (g = c[p], null != g)) switch (p) {
					case "children":
						e = g;
						break;
					case "dangerouslySetInnerHTML": throw Error("`dangerouslySetInnerHTML` does not make sense on <title>.");
					default: w(a, d, p, g);
				}
				a.push(">");
				return e;
			case "listing":
			case "pre":
				a.push(z(b));
				g = e = null;
				for (k in c) if (n.call(c, k) && (h = c[k], null != h)) switch (k) {
					case "children":
						e = h;
						break;
					case "dangerouslySetInnerHTML":
						g = h;
						break;
					default: w(a, d, k, h);
				}
				a.push(">");
				if (null != g) {
					if (null != e) throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
					if ("object" !== typeof g || !("__html" in g)) throw Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
					c = g.__html;
					null !== c && void 0 !== c && ("string" === typeof c && 0 < c.length && "\n" === c[0] ? a.push("\n", c) : a.push("" + c));
				}
				"string" === typeof e && "\n" === e[0] && a.push("\n");
				return e;
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "img":
			case "keygen":
			case "link":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
				a.push(z(b));
				for (var C in c) if (n.call(c, C) && (e = c[C], null != e)) switch (C) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(b + " is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
					default: w(a, d, C, e);
				}
				a.push("/>");
				return null;
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return wa(a, c, b, d);
			case "html": return 0 === f.insertionMode && a.push("<!DOCTYPE html>"), wa(a, c, b, d);
			default:
				if (-1 === b.indexOf("-") && "string" !== typeof c.is) return wa(a, c, b, d);
				a.push(z(b));
				g = e = null;
				for (m in c) if (n.call(c, m) && (h = c[m], null != h)) switch (m) {
					case "children":
						e = h;
						break;
					case "dangerouslySetInnerHTML":
						g = h;
						break;
					case "style":
						ua(a, d, h);
						break;
					case "suppressContentEditableWarning":
					case "suppressHydrationWarning": break;
					default: ka(m) && "function" !== typeof h && "symbol" !== typeof h && a.push(" ", m, "=\"", u(h), "\"");
				}
				a.push(">");
				x(a, g, e);
				return e;
		}
	}
	function Aa(a, b, c) {
		a.push("<!--$?--><template id=\"");
		if (null === c) throw Error("An ID must have been assigned before we can complete the boundary.");
		a.push(c);
		return a.push("\"></template>");
	}
	function Ba(a, b, c, d) {
		switch (c.insertionMode) {
			case 0:
			case 1: return a.push("<div hidden id=\""), a.push(b.segmentPrefix), b = d.toString(16), a.push(b), a.push("\">");
			case 2: return a.push("<svg aria-hidden=\"true\" style=\"display:none\" id=\""), a.push(b.segmentPrefix), b = d.toString(16), a.push(b), a.push("\">");
			case 3: return a.push("<math aria-hidden=\"true\" style=\"display:none\" id=\""), a.push(b.segmentPrefix), b = d.toString(16), a.push(b), a.push("\">");
			case 4: return a.push("<table hidden id=\""), a.push(b.segmentPrefix), b = d.toString(16), a.push(b), a.push("\">");
			case 5: return a.push("<table hidden><tbody id=\""), a.push(b.segmentPrefix), b = d.toString(16), a.push(b), a.push("\">");
			case 6: return a.push("<table hidden><tr id=\""), a.push(b.segmentPrefix), b = d.toString(16), a.push(b), a.push("\">");
			case 7: return a.push("<table hidden><colgroup id=\""), a.push(b.segmentPrefix), b = d.toString(16), a.push(b), a.push("\">");
			default: throw Error("Unknown insertion mode. This is a bug in React.");
		}
	}
	function Ca(a, b) {
		switch (b.insertionMode) {
			case 0:
			case 1: return a.push("</div>");
			case 2: return a.push("</svg>");
			case 3: return a.push("</math>");
			case 4: return a.push("</table>");
			case 5: return a.push("</tbody></table>");
			case 6: return a.push("</tr></table>");
			case 7: return a.push("</colgroup></table>");
			default: throw Error("Unknown insertion mode. This is a bug in React.");
		}
	}
	var Da = /[<\u2028\u2029]/g;
	function Ea(a) {
		return JSON.stringify(a).replace(Da, function(a) {
			switch (a) {
				case "<": return "\\u003c";
				case "\u2028": return "\\u2028";
				case "\u2029": return "\\u2029";
				default: throw Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
			}
		});
	}
	function Fa(a, b) {
		b = void 0 === b ? "" : b;
		return {
			bootstrapChunks: [],
			startInlineScript: "<script>",
			placeholderPrefix: b + "P:",
			segmentPrefix: b + "S:",
			boundaryPrefix: b + "B:",
			idPrefix: b,
			nextSuspenseID: 0,
			sentCompleteSegmentFunction: !1,
			sentCompleteBoundaryFunction: !1,
			sentClientRenderFunction: !1,
			generateStaticMarkup: a
		};
	}
	function Ga() {
		return {
			insertionMode: 1,
			selectedValue: null
		};
	}
	function Ha(a, b, c, d) {
		if (c.generateStaticMarkup) return a.push(u(b)), !1;
		"" === b ? a = d : (d && a.push("<!-- -->"), a.push(u(b)), a = !0);
		return a;
	}
	var A = Object.assign;
	var Ia = Symbol.for("react.element");
	var Ja = Symbol.for("react.portal");
	var Ka = Symbol.for("react.fragment");
	var La = Symbol.for("react.strict_mode");
	var Ma = Symbol.for("react.profiler");
	var Na = Symbol.for("react.provider");
	var Oa = Symbol.for("react.context");
	var Pa = Symbol.for("react.forward_ref");
	var Qa = Symbol.for("react.suspense");
	var Ra = Symbol.for("react.suspense_list");
	var Sa = Symbol.for("react.memo");
	var Ta = Symbol.for("react.lazy");
	var Ua = Symbol.for("react.scope");
	var Va = Symbol.for("react.debug_trace_mode");
	var Wa = Symbol.for("react.legacy_hidden");
	var Xa = Symbol.for("react.default_value");
	var Ya = Symbol.iterator;
	function Za(a) {
		if (null == a) return null;
		if ("function" === typeof a) return a.displayName || a.name || null;
		if ("string" === typeof a) return a;
		switch (a) {
			case Ka: return "Fragment";
			case Ja: return "Portal";
			case Ma: return "Profiler";
			case La: return "StrictMode";
			case Qa: return "Suspense";
			case Ra: return "SuspenseList";
		}
		if ("object" === typeof a) switch (a.$$typeof) {
			case Oa: return (a.displayName || "Context") + ".Consumer";
			case Na: return (a._context.displayName || "Context") + ".Provider";
			case Pa:
				var b = a.render;
				a = a.displayName;
				a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
				return a;
			case Sa: return b = a.displayName || null, null !== b ? b : Za(a.type) || "Memo";
			case Ta:
				b = a._payload;
				a = a._init;
				try {
					return Za(a(b));
				} catch (c) {}
		}
		return null;
	}
	var $a = {};
	function ab(a, b) {
		a = a.contextTypes;
		if (!a) return $a;
		var c = {}, d;
		for (d in a) c[d] = b[d];
		return c;
	}
	var D = null;
	function E(a, b) {
		if (a !== b) {
			a.context._currentValue2 = a.parentValue;
			a = a.parent;
			var c = b.parent;
			if (null === a) {
				if (null !== c) throw Error("The stacks must reach the root at the same time. This is a bug in React.");
			} else {
				if (null === c) throw Error("The stacks must reach the root at the same time. This is a bug in React.");
				E(a, c);
			}
			b.context._currentValue2 = b.value;
		}
	}
	function bb(a) {
		a.context._currentValue2 = a.parentValue;
		a = a.parent;
		null !== a && bb(a);
	}
	function cb(a) {
		var b = a.parent;
		null !== b && cb(b);
		a.context._currentValue2 = a.value;
	}
	function db(a, b) {
		a.context._currentValue2 = a.parentValue;
		a = a.parent;
		if (null === a) throw Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
		a.depth === b.depth ? E(a, b) : db(a, b);
	}
	function eb(a, b) {
		var c = b.parent;
		if (null === c) throw Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
		a.depth === c.depth ? E(a, c) : eb(a, c);
		b.context._currentValue2 = b.value;
	}
	function F(a) {
		var b = D;
		b !== a && (null === b ? cb(a) : null === a ? bb(b) : b.depth === a.depth ? E(b, a) : b.depth > a.depth ? db(b, a) : eb(b, a), D = a);
	}
	var fb = {
		isMounted: function() {
			return !1;
		},
		enqueueSetState: function(a, b) {
			a = a._reactInternals;
			null !== a.queue && a.queue.push(b);
		},
		enqueueReplaceState: function(a, b) {
			a = a._reactInternals;
			a.replace = !0;
			a.queue = [b];
		},
		enqueueForceUpdate: function() {}
	};
	function gb(a, b, c, d) {
		var f = void 0 !== a.state ? a.state : null;
		a.updater = fb;
		a.props = c;
		a.state = f;
		var e = {
			queue: [],
			replace: !1
		};
		a._reactInternals = e;
		var g = b.contextType;
		a.context = "object" === typeof g && null !== g ? g._currentValue2 : d;
		g = b.getDerivedStateFromProps;
		"function" === typeof g && (g = g(c, f), f = null === g || void 0 === g ? f : A({}, f, g), a.state = f);
		if ("function" !== typeof b.getDerivedStateFromProps && "function" !== typeof a.getSnapshotBeforeUpdate && ("function" === typeof a.UNSAFE_componentWillMount || "function" === typeof a.componentWillMount)) if (b = a.state, "function" === typeof a.componentWillMount && a.componentWillMount(), "function" === typeof a.UNSAFE_componentWillMount && a.UNSAFE_componentWillMount(), b !== a.state && fb.enqueueReplaceState(a, a.state, null), null !== e.queue && 0 < e.queue.length) if (b = e.queue, g = e.replace, e.queue = null, e.replace = !1, g && 1 === b.length) a.state = b[0];
		else {
			e = g ? b[0] : a.state;
			f = !0;
			for (g = g ? 1 : 0; g < b.length; g++) {
				var h = b[g];
				h = "function" === typeof h ? h.call(a, e, c, d) : h;
				null != h && (f ? (f = !1, e = A({}, e, h)) : A(e, h));
			}
			a.state = e;
		}
		else e.queue = null;
	}
	var hb = {
		id: 1,
		overflow: ""
	};
	function ib(a, b, c) {
		var d = a.id;
		a = a.overflow;
		var f = 32 - G(d) - 1;
		d &= ~(1 << f);
		c += 1;
		var e = 32 - G(b) + f;
		if (30 < e) {
			var g = f - f % 5;
			e = (d & (1 << g) - 1).toString(32);
			d >>= g;
			f -= g;
			return {
				id: 1 << 32 - G(b) + f | c << f | d,
				overflow: e + a
			};
		}
		return {
			id: 1 << e | c << f | d,
			overflow: a
		};
	}
	var G = Math.clz32 ? Math.clz32 : jb;
	var kb = Math.log;
	var lb = Math.LN2;
	function jb(a) {
		a >>>= 0;
		return 0 === a ? 32 : 31 - (kb(a) / lb | 0) | 0;
	}
	function mb(a, b) {
		return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
	}
	var nb = "function" === typeof Object.is ? Object.is : mb;
	var H = null;
	var ob = null;
	var I = null;
	var J = null;
	var K = !1;
	var L = !1;
	var M = 0;
	var N = null;
	var O = 0;
	function P() {
		if (null === H) throw Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
		return H;
	}
	function rb() {
		if (0 < O) throw Error("Rendered more hooks than during the previous render");
		return {
			memoizedState: null,
			queue: null,
			next: null
		};
	}
	function sb() {
		null === J ? null === I ? (K = !1, I = J = rb()) : (K = !0, J = I) : null === J.next ? (K = !1, J = J.next = rb()) : (K = !0, J = J.next);
		return J;
	}
	function tb() {
		ob = H = null;
		L = !1;
		I = null;
		O = 0;
		J = N = null;
	}
	function ub(a, b) {
		return "function" === typeof b ? b(a) : b;
	}
	function vb(a, b, c) {
		H = P();
		J = sb();
		if (K) {
			var d = J.queue;
			b = d.dispatch;
			if (null !== N && (c = N.get(d), void 0 !== c)) {
				N.delete(d);
				d = J.memoizedState;
				do
					d = a(d, c.action), c = c.next;
				while (null !== c);
				J.memoizedState = d;
				return [d, b];
			}
			return [J.memoizedState, b];
		}
		a = a === ub ? "function" === typeof b ? b() : b : void 0 !== c ? c(b) : b;
		J.memoizedState = a;
		a = J.queue = {
			last: null,
			dispatch: null
		};
		a = a.dispatch = wb.bind(null, H, a);
		return [J.memoizedState, a];
	}
	function xb(a, b) {
		H = P();
		J = sb();
		b = void 0 === b ? null : b;
		if (null !== J) {
			var c = J.memoizedState;
			if (null !== c && null !== b) {
				var d = c[1];
				a: if (null === d) d = !1;
				else {
					for (var f = 0; f < d.length && f < b.length; f++) if (!nb(b[f], d[f])) {
						d = !1;
						break a;
					}
					d = !0;
				}
				if (d) return c[0];
			}
		}
		a = a();
		J.memoizedState = [a, b];
		return a;
	}
	function wb(a, b, c) {
		if (25 <= O) throw Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
		if (a === H) if (L = !0, a = {
			action: c,
			next: null
		}, null === N && (N = /* @__PURE__ */ new Map()), c = N.get(b), void 0 === c) N.set(b, a);
		else {
			for (b = c; null !== b.next;) b = b.next;
			b.next = a;
		}
	}
	function yb() {
		throw Error("startTransition cannot be called during server rendering.");
	}
	function Q() {}
	var zb = {
		readContext: function(a) {
			return a._currentValue2;
		},
		useContext: function(a) {
			P();
			return a._currentValue2;
		},
		useMemo: xb,
		useReducer: vb,
		useRef: function(a) {
			H = P();
			J = sb();
			var b = J.memoizedState;
			return null === b ? (a = { current: a }, J.memoizedState = a) : b;
		},
		useState: function(a) {
			return vb(ub, a);
		},
		useInsertionEffect: Q,
		useLayoutEffect: function() {},
		useCallback: function(a, b) {
			return xb(function() {
				return a;
			}, b);
		},
		useImperativeHandle: Q,
		useEffect: Q,
		useDebugValue: Q,
		useDeferredValue: function(a) {
			P();
			return a;
		},
		useTransition: function() {
			P();
			return [!1, yb];
		},
		useId: function() {
			var a = ob.treeContext;
			var b = a.overflow;
			a = a.id;
			a = (a & ~(1 << 32 - G(a) - 1)).toString(32) + b;
			var c = R;
			if (null === c) throw Error("Invalid hook call. Hooks can only be called inside of the body of a function component.");
			b = M++;
			a = ":" + c.idPrefix + "R" + a;
			0 < b && (a += "H" + b.toString(32));
			return a + ":";
		},
		useMutableSource: function(a, b) {
			P();
			return b(a._source);
		},
		useSyncExternalStore: function(a, b, c) {
			if (void 0 === c) throw Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
			return c();
		}
	};
	var R = null;
	var Ab = ea.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;
	function Bb(a) {
		console.error(a);
		return null;
	}
	function S() {}
	function Cb(a, b, c, d, f, e, g, h, k) {
		var m = [], l = /* @__PURE__ */ new Set();
		b = {
			destination: null,
			responseState: b,
			progressiveChunkSize: void 0 === d ? 12800 : d,
			status: 0,
			fatalError: null,
			nextSegmentId: 0,
			allPendingTasks: 0,
			pendingRootTasks: 0,
			completedRootSegment: null,
			abortableTasks: l,
			pingedTasks: m,
			clientRenderedBoundaries: [],
			completedBoundaries: [],
			partialBoundaries: [],
			onError: void 0 === f ? Bb : f,
			onAllReady: void 0 === e ? S : e,
			onShellReady: void 0 === g ? S : g,
			onShellError: void 0 === h ? S : h,
			onFatalError: void 0 === k ? S : k
		};
		c = T(b, 0, null, c, !1, !1);
		c.parentFlushed = !0;
		a = Db(b, a, null, c, l, $a, null, hb);
		m.push(a);
		return b;
	}
	function Db(a, b, c, d, f, e, g, h) {
		a.allPendingTasks++;
		null === c ? a.pendingRootTasks++ : c.pendingTasks++;
		var k = {
			node: b,
			ping: function() {
				var b = a.pingedTasks;
				b.push(k);
				1 === b.length && Eb(a);
			},
			blockedBoundary: c,
			blockedSegment: d,
			abortSet: f,
			legacyContext: e,
			context: g,
			treeContext: h
		};
		f.add(k);
		return k;
	}
	function T(a, b, c, d, f, e) {
		return {
			status: 0,
			id: -1,
			index: b,
			parentFlushed: !1,
			chunks: [],
			children: [],
			formatContext: d,
			boundary: c,
			lastPushedText: f,
			textEmbedded: e
		};
	}
	function U(a, b) {
		a = a.onError(b);
		if (null != a && "string" !== typeof a) throw Error("onError returned something with a type other than \"string\". onError should return a string and may return null or undefined but must not return anything else. It received something of type \"" + typeof a + "\" instead");
		return a;
	}
	function V(a, b) {
		var c = a.onShellError;
		c(b);
		c = a.onFatalError;
		c(b);
		null !== a.destination ? (a.status = 2, a.destination.destroy(b)) : (a.status = 1, a.fatalError = b);
	}
	function Fb(a, b, c, d, f) {
		H = {};
		ob = b;
		M = 0;
		for (a = c(d, f); L;) L = !1, M = 0, O += 1, J = null, a = c(d, f);
		tb();
		return a;
	}
	function Gb(a, b, c, d) {
		var f = c.render(), e = d.childContextTypes;
		if (null !== e && void 0 !== e) {
			var g = b.legacyContext;
			if ("function" !== typeof c.getChildContext) d = g;
			else {
				c = c.getChildContext();
				for (var h in c) if (!(h in e)) throw Error((Za(d) || "Unknown") + ".getChildContext(): key \"" + h + "\" is not defined in childContextTypes.");
				d = A({}, g, c);
			}
			b.legacyContext = d;
			W(a, b, f);
			b.legacyContext = g;
		} else W(a, b, f);
	}
	function Hb(a, b) {
		if (a && a.defaultProps) {
			b = A({}, b);
			a = a.defaultProps;
			for (var c in a) void 0 === b[c] && (b[c] = a[c]);
			return b;
		}
		return b;
	}
	function Ib(a, b, c, d, f) {
		if ("function" === typeof c) if (c.prototype && c.prototype.isReactComponent) {
			f = ab(c, b.legacyContext);
			var e = c.contextType;
			e = new c(d, "object" === typeof e && null !== e ? e._currentValue2 : f);
			gb(e, c, d, f);
			Gb(a, b, e, c);
		} else {
			e = ab(c, b.legacyContext);
			f = Fb(a, b, c, d, e);
			var g = 0 !== M;
			if ("object" === typeof f && null !== f && "function" === typeof f.render && void 0 === f.$$typeof) gb(f, c, d, e), Gb(a, b, f, c);
			else if (g) {
				d = b.treeContext;
				b.treeContext = ib(d, 1, 0);
				try {
					W(a, b, f);
				} finally {
					b.treeContext = d;
				}
			} else W(a, b, f);
		}
		else if ("string" === typeof c) {
			f = b.blockedSegment;
			e = za(f.chunks, c, d, a.responseState, f.formatContext);
			f.lastPushedText = !1;
			g = f.formatContext;
			f.formatContext = sa(g, c, d);
			Jb(a, b, e);
			f.formatContext = g;
			switch (c) {
				case "area":
				case "base":
				case "br":
				case "col":
				case "embed":
				case "hr":
				case "img":
				case "input":
				case "keygen":
				case "link":
				case "meta":
				case "param":
				case "source":
				case "track":
				case "wbr": break;
				default: f.chunks.push("</", c, ">");
			}
			f.lastPushedText = !1;
		} else {
			switch (c) {
				case Wa:
				case Va:
				case La:
				case Ma:
				case Ka:
					W(a, b, d.children);
					return;
				case Ra:
					W(a, b, d.children);
					return;
				case Ua: throw Error("ReactDOMServer does not yet support scope components.");
				case Qa:
					a: {
						c = b.blockedBoundary;
						f = b.blockedSegment;
						e = d.fallback;
						d = d.children;
						g = /* @__PURE__ */ new Set();
						var h = {
							id: null,
							rootSegmentID: -1,
							parentFlushed: !1,
							pendingTasks: 0,
							forceClientRender: !1,
							completedSegments: [],
							byteSize: 0,
							fallbackAbortableTasks: g,
							errorDigest: null
						}, k = T(a, f.chunks.length, h, f.formatContext, !1, !1);
						f.children.push(k);
						f.lastPushedText = !1;
						var m = T(a, 0, null, f.formatContext, !1, !1);
						m.parentFlushed = !0;
						b.blockedBoundary = h;
						b.blockedSegment = m;
						try {
							if (Jb(a, b, d), a.responseState.generateStaticMarkup || m.lastPushedText && m.textEmbedded && m.chunks.push("<!-- -->"), m.status = 1, X(h, m), 0 === h.pendingTasks) break a;
						} catch (l) {
							m.status = 4, h.forceClientRender = !0, h.errorDigest = U(a, l);
						} finally {
							b.blockedBoundary = c, b.blockedSegment = f;
						}
						b = Db(a, e, c, k, g, b.legacyContext, b.context, b.treeContext);
						a.pingedTasks.push(b);
					}
					return;
			}
			if ("object" === typeof c && null !== c) switch (c.$$typeof) {
				case Pa:
					d = Fb(a, b, c.render, d, f);
					if (0 !== M) {
						c = b.treeContext;
						b.treeContext = ib(c, 1, 0);
						try {
							W(a, b, d);
						} finally {
							b.treeContext = c;
						}
					} else W(a, b, d);
					return;
				case Sa:
					c = c.type;
					d = Hb(c, d);
					Ib(a, b, c, d, f);
					return;
				case Na:
					f = d.children;
					c = c._context;
					d = d.value;
					e = c._currentValue2;
					c._currentValue2 = d;
					g = D;
					D = d = {
						parent: g,
						depth: null === g ? 0 : g.depth + 1,
						context: c,
						parentValue: e,
						value: d
					};
					b.context = d;
					W(a, b, f);
					a = D;
					if (null === a) throw Error("Tried to pop a Context at the root of the app. This is a bug in React.");
					d = a.parentValue;
					a.context._currentValue2 = d === Xa ? a.context._defaultValue : d;
					a = D = a.parent;
					b.context = a;
					return;
				case Oa:
					d = d.children;
					d = d(c._currentValue2);
					W(a, b, d);
					return;
				case Ta:
					f = c._init;
					c = f(c._payload);
					d = Hb(c, d);
					Ib(a, b, c, d, void 0);
					return;
			}
			throw Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " + ((null == c ? c : typeof c) + "."));
		}
	}
	function W(a, b, c) {
		b.node = c;
		if ("object" === typeof c && null !== c) {
			switch (c.$$typeof) {
				case Ia:
					Ib(a, b, c.type, c.props, c.ref);
					return;
				case Ja: throw Error("Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render.");
				case Ta:
					var d = c._init;
					c = d(c._payload);
					W(a, b, c);
					return;
			}
			if (ra(c)) {
				Kb(a, b, c);
				return;
			}
			null === c || "object" !== typeof c ? d = null : (d = Ya && c[Ya] || c["@@iterator"], d = "function" === typeof d ? d : null);
			if (d && (d = d.call(c))) {
				c = d.next();
				if (!c.done) {
					var f = [];
					do
						f.push(c.value), c = d.next();
					while (!c.done);
					Kb(a, b, f);
				}
				return;
			}
			a = Object.prototype.toString.call(c);
			throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === a ? "object with keys {" + Object.keys(c).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
		}
		"string" === typeof c ? (d = b.blockedSegment, d.lastPushedText = Ha(b.blockedSegment.chunks, c, a.responseState, d.lastPushedText)) : "number" === typeof c && (d = b.blockedSegment, d.lastPushedText = Ha(b.blockedSegment.chunks, "" + c, a.responseState, d.lastPushedText));
	}
	function Kb(a, b, c) {
		for (var d = c.length, f = 0; f < d; f++) {
			var e = b.treeContext;
			b.treeContext = ib(e, d, f);
			try {
				Jb(a, b, c[f]);
			} finally {
				b.treeContext = e;
			}
		}
	}
	function Jb(a, b, c) {
		var d = b.blockedSegment.formatContext, f = b.legacyContext, e = b.context;
		try {
			return W(a, b, c);
		} catch (k) {
			if (tb(), "object" === typeof k && null !== k && "function" === typeof k.then) {
				c = k;
				var g = b.blockedSegment, h = T(a, g.chunks.length, null, g.formatContext, g.lastPushedText, !0);
				g.children.push(h);
				g.lastPushedText = !1;
				a = Db(a, b.node, b.blockedBoundary, h, b.abortSet, b.legacyContext, b.context, b.treeContext).ping;
				c.then(a, a);
				b.blockedSegment.formatContext = d;
				b.legacyContext = f;
				b.context = e;
				F(e);
			} else throw b.blockedSegment.formatContext = d, b.legacyContext = f, b.context = e, F(e), k;
		}
	}
	function Lb(a) {
		var b = a.blockedBoundary;
		a = a.blockedSegment;
		a.status = 3;
		Mb(this, b, a);
	}
	function Nb(a, b, c) {
		var d = a.blockedBoundary;
		a.blockedSegment.status = 3;
		null === d ? (b.allPendingTasks--, 2 !== b.status && (b.status = 2, null !== b.destination && b.destination.push(null))) : (d.pendingTasks--, d.forceClientRender || (d.forceClientRender = !0, d.errorDigest = b.onError(void 0 === c ? Error("The render was aborted by the server without a reason.") : c), d.parentFlushed && b.clientRenderedBoundaries.push(d)), d.fallbackAbortableTasks.forEach(function(a) {
			return Nb(a, b, c);
		}), d.fallbackAbortableTasks.clear(), b.allPendingTasks--, 0 === b.allPendingTasks && (a = b.onAllReady, a()));
	}
	function X(a, b) {
		if (0 === b.chunks.length && 1 === b.children.length && null === b.children[0].boundary) {
			var c = b.children[0];
			c.id = b.id;
			c.parentFlushed = !0;
			1 === c.status && X(a, c);
		} else a.completedSegments.push(b);
	}
	function Mb(a, b, c) {
		if (null === b) {
			if (c.parentFlushed) {
				if (null !== a.completedRootSegment) throw Error("There can only be one root segment. This is a bug in React.");
				a.completedRootSegment = c;
			}
			a.pendingRootTasks--;
			0 === a.pendingRootTasks && (a.onShellError = S, b = a.onShellReady, b());
		} else b.pendingTasks--, b.forceClientRender || (0 === b.pendingTasks ? (c.parentFlushed && 1 === c.status && X(b, c), b.parentFlushed && a.completedBoundaries.push(b), b.fallbackAbortableTasks.forEach(Lb, a), b.fallbackAbortableTasks.clear()) : c.parentFlushed && 1 === c.status && (X(b, c), 1 === b.completedSegments.length && b.parentFlushed && a.partialBoundaries.push(b)));
		a.allPendingTasks--;
		0 === a.allPendingTasks && (a = a.onAllReady, a());
	}
	function Eb(a) {
		if (2 !== a.status) {
			var b = D, c = Ab.current;
			Ab.current = zb;
			var d = R;
			R = a.responseState;
			try {
				var f = a.pingedTasks, e = 0;
				for (; e < f.length; e++) {
					var g = f[e];
					var h = a, k = g.blockedSegment;
					if (0 === k.status) {
						F(g.context);
						try {
							W(h, g, g.node), h.responseState.generateStaticMarkup || k.lastPushedText && k.textEmbedded && k.chunks.push("<!-- -->"), g.abortSet.delete(g), k.status = 1, Mb(h, g.blockedBoundary, k);
						} catch (y) {
							if (tb(), "object" === typeof y && null !== y && "function" === typeof y.then) {
								var m = g.ping;
								y.then(m, m);
							} else {
								g.abortSet.delete(g);
								k.status = 4;
								var l = g.blockedBoundary, p = y, B = U(h, p);
								null === l ? V(h, p) : (l.pendingTasks--, l.forceClientRender || (l.forceClientRender = !0, l.errorDigest = B, l.parentFlushed && h.clientRenderedBoundaries.push(l)));
								h.allPendingTasks--;
								if (0 === h.allPendingTasks) {
									var C = h.onAllReady;
									C();
								}
							}
						}
					}
				}
				f.splice(0, e);
				null !== a.destination && Ob(a, a.destination);
			} catch (y) {
				U(a, y), V(a, y);
			} finally {
				R = d, Ab.current = c, c === zb && F(b);
			}
		}
	}
	function Y(a, b, c) {
		c.parentFlushed = !0;
		switch (c.status) {
			case 0:
				var d = c.id = a.nextSegmentId++;
				c.lastPushedText = !1;
				c.textEmbedded = !1;
				a = a.responseState;
				b.push("<template id=\"");
				b.push(a.placeholderPrefix);
				a = d.toString(16);
				b.push(a);
				return b.push("\"></template>");
			case 1:
				c.status = 2;
				var f = !0;
				d = c.chunks;
				var e = 0;
				c = c.children;
				for (var g = 0; g < c.length; g++) {
					for (f = c[g]; e < f.index; e++) b.push(d[e]);
					f = Z(a, b, f);
				}
				for (; e < d.length - 1; e++) b.push(d[e]);
				e < d.length && (f = b.push(d[e]));
				return f;
			default: throw Error("Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React.");
		}
	}
	function Z(a, b, c) {
		var d = c.boundary;
		if (null === d) return Y(a, b, c);
		d.parentFlushed = !0;
		if (d.forceClientRender) return a.responseState.generateStaticMarkup || (d = d.errorDigest, b.push("<!--$!-->"), b.push("<template"), d && (b.push(" data-dgst=\""), d = u(d), b.push(d), b.push("\"")), b.push("></template>")), Y(a, b, c), a = a.responseState.generateStaticMarkup ? !0 : b.push("<!--/$-->"), a;
		if (0 < d.pendingTasks) {
			d.rootSegmentID = a.nextSegmentId++;
			0 < d.completedSegments.length && a.partialBoundaries.push(d);
			var f = a.responseState;
			var e = f.nextSuspenseID++;
			f = f.boundaryPrefix + e.toString(16);
			d = d.id = f;
			Aa(b, a.responseState, d);
			Y(a, b, c);
			return b.push("<!--/$-->");
		}
		if (d.byteSize > a.progressiveChunkSize) return d.rootSegmentID = a.nextSegmentId++, a.completedBoundaries.push(d), Aa(b, a.responseState, d.id), Y(a, b, c), b.push("<!--/$-->");
		a.responseState.generateStaticMarkup || b.push("<!--$-->");
		c = d.completedSegments;
		if (1 !== c.length) throw Error("A previously unvisited boundary must have exactly one root segment. This is a bug in React.");
		Z(a, b, c[0]);
		a = a.responseState.generateStaticMarkup ? !0 : b.push("<!--/$-->");
		return a;
	}
	function Pb(a, b, c) {
		Ba(b, a.responseState, c.formatContext, c.id);
		Z(a, b, c);
		return Ca(b, c.formatContext);
	}
	function Qb(a, b, c) {
		for (var d = c.completedSegments, f = 0; f < d.length; f++) Rb(a, b, c, d[f]);
		d.length = 0;
		a = a.responseState;
		d = c.id;
		c = c.rootSegmentID;
		b.push(a.startInlineScript);
		a.sentCompleteBoundaryFunction ? b.push("$RC(\"") : (a.sentCompleteBoundaryFunction = !0, b.push("function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if(\"/$\"===d)if(0===e)break;else e--;else\"$\"!==d&&\"$?\"!==d&&\"$!\"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data=\"$\";a._reactRetry&&a._reactRetry()}};$RC(\""));
		if (null === d) throw Error("An ID must have been assigned before we can complete the boundary.");
		c = c.toString(16);
		b.push(d);
		b.push("\",\"");
		b.push(a.segmentPrefix);
		b.push(c);
		return b.push("\")<\/script>");
	}
	function Rb(a, b, c, d) {
		if (2 === d.status) return !0;
		var f = d.id;
		if (-1 === f) {
			if (-1 === (d.id = c.rootSegmentID)) throw Error("A root segment ID must have been assigned by now. This is a bug in React.");
			return Pb(a, b, d);
		}
		Pb(a, b, d);
		a = a.responseState;
		b.push(a.startInlineScript);
		a.sentCompleteSegmentFunction ? b.push("$RS(\"") : (a.sentCompleteSegmentFunction = !0, b.push("function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS(\""));
		b.push(a.segmentPrefix);
		f = f.toString(16);
		b.push(f);
		b.push("\",\"");
		b.push(a.placeholderPrefix);
		b.push(f);
		return b.push("\")<\/script>");
	}
	function Ob(a, b) {
		try {
			var c = a.completedRootSegment;
			if (null !== c && 0 === a.pendingRootTasks) {
				Z(a, b, c);
				a.completedRootSegment = null;
				var d = a.responseState.bootstrapChunks;
				for (c = 0; c < d.length - 1; c++) b.push(d[c]);
				c < d.length && b.push(d[c]);
			}
			var f = a.clientRenderedBoundaries, e = 0;
			for (; e < f.length; e++) {
				var g = f[e];
				d = b;
				var h = a.responseState, k = g.id, m = g.errorDigest, l = g.errorMessage, p = g.errorComponentStack;
				d.push(h.startInlineScript);
				h.sentClientRenderFunction ? d.push("$RX(\"") : (h.sentClientRenderFunction = !0, d.push("function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data=\"$!\",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())};$RX(\""));
				if (null === k) throw Error("An ID must have been assigned before we can complete the boundary.");
				d.push(k);
				d.push("\"");
				if (m || l || p) {
					d.push(",");
					var B = Ea(m || "");
					d.push(B);
				}
				if (l || p) {
					d.push(",");
					var C = Ea(l || "");
					d.push(C);
				}
				if (p) {
					d.push(",");
					var y = Ea(p);
					d.push(y);
				}
				if (!d.push(")<\/script>")) {
					a.destination = null;
					e++;
					f.splice(0, e);
					return;
				}
			}
			f.splice(0, e);
			var aa = a.completedBoundaries;
			for (e = 0; e < aa.length; e++) if (!Qb(a, b, aa[e])) {
				a.destination = null;
				e++;
				aa.splice(0, e);
				return;
			}
			aa.splice(0, e);
			var ba = a.partialBoundaries;
			for (e = 0; e < ba.length; e++) {
				var pb = ba[e];
				a: {
					f = a;
					g = b;
					var ca = pb.completedSegments;
					for (h = 0; h < ca.length; h++) if (!Rb(f, g, pb, ca[h])) {
						h++;
						ca.splice(0, h);
						var qb = !1;
						break a;
					}
					ca.splice(0, h);
					qb = !0;
				}
				if (!qb) {
					a.destination = null;
					e++;
					ba.splice(0, e);
					return;
				}
			}
			ba.splice(0, e);
			var da = a.completedBoundaries;
			for (e = 0; e < da.length; e++) if (!Qb(a, b, da[e])) {
				a.destination = null;
				e++;
				da.splice(0, e);
				return;
			}
			da.splice(0, e);
		} finally {
			0 === a.allPendingTasks && 0 === a.pingedTasks.length && 0 === a.clientRenderedBoundaries.length && 0 === a.completedBoundaries.length && b.push(null);
		}
	}
	function Sb(a, b) {
		if (1 === a.status) a.status = 2, b.destroy(a.fatalError);
		else if (2 !== a.status && null === a.destination) {
			a.destination = b;
			try {
				Ob(a, b);
			} catch (c) {
				U(a, c), V(a, c);
			}
		}
	}
	function Tb(a, b) {
		try {
			var c = a.abortableTasks;
			c.forEach(function(c) {
				return Nb(c, a, b);
			});
			c.clear();
			null !== a.destination && Ob(a, a.destination);
		} catch (d) {
			U(a, d), V(a, d);
		}
	}
	function Ub() {}
	function Vb(a, b, c, d) {
		var f = !1, e = null, g = "", h = !1;
		a = Cb(a, Fa(c, b ? b.identifierPrefix : void 0), Ga(), Infinity, Ub, void 0, function() {
			h = !0;
		}, void 0, void 0);
		Eb(a);
		Tb(a, d);
		Sb(a, {
			push: function(a) {
				null !== a && (g += a);
				return !0;
			},
			destroy: function(a) {
				f = !0;
				e = a;
			}
		});
		if (f) throw e;
		if (!h) throw Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
		return g;
	}
	function Wb(a, b) {
		a.prototype = Object.create(b.prototype);
		a.prototype.constructor = a;
		a.__proto__ = b;
	}
	var Xb = function(a) {
		function b() {
			var b = a.call(this, {}) || this;
			b.request = null;
			b.startedFlowing = !1;
			return b;
		}
		Wb(b, a);
		var c = b.prototype;
		c._destroy = function(a, b) {
			Tb(this.request);
			b(a);
		};
		c._read = function() {
			this.startedFlowing && Sb(this.request, this);
		};
		return b;
	}(fa.Readable);
	function Yb() {}
	function Zb(a, b) {
		var c = new Xb(), d = Cb(a, Fa(!1, b ? b.identifierPrefix : void 0), Ga(), Infinity, Yb, function() {
			c.startedFlowing = !0;
			Sb(d, c);
		}, void 0, void 0);
		c.request = d;
		Eb(d);
		return c;
	}
	exports.renderToNodeStream = function(a, b) {
		return Zb(a, b);
	};
	exports.renderToStaticMarkup = function(a, b) {
		return Vb(a, b, !0, "The server used \"renderToStaticMarkup\" which does not support Suspense. If you intended to have the server wait for the suspended component please switch to \"renderToPipeableStream\" which supports Suspense on the server");
	};
	exports.renderToStaticNodeStream = function(a, b) {
		return Zb(a, b);
	};
	exports.renderToString = function(a, b) {
		return Vb(a, b, !1, "The server used \"renderToString\" which does not support Suspense. If you intended for this Suspense boundary to render the fallback content on the server consider throwing an Error somewhere within the Suspense boundary. If you intended to have the server wait for the suspended component please switch to \"renderToPipeableStream\" which supports Suspense on the server");
	};
	exports.version = "18.3.1";
}));
// node_modules/react-dom/cjs/react-dom-server.node.production.min.js
/**
* @license React
* react-dom-server.node.production.min.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_dom_server_node_production_min = /* @__PURE__ */ __commonJSMin(((exports) => {
	var aa = __require("util");
	var ba = require_react();
	var k = null;
	var l = 0;
	var q = !0;
	function r(a, b) {
		if ("string" === typeof b) {
			if (0 !== b.length) if (2048 < 3 * b.length) 0 < l && (t(a, k.subarray(0, l)), k = /* @__PURE__ */ new Uint8Array(2048), l = 0), t(a, u.encode(b));
			else {
				var c = k;
				0 < l && (c = k.subarray(l));
				c = u.encodeInto(b, c);
				var d = c.read;
				l += c.written;
				d < b.length && (t(a, k), k = /* @__PURE__ */ new Uint8Array(2048), l = u.encodeInto(b.slice(d), k).written);
				2048 === l && (t(a, k), k = /* @__PURE__ */ new Uint8Array(2048), l = 0);
			}
		} else 0 !== b.byteLength && (2048 < b.byteLength ? (0 < l && (t(a, k.subarray(0, l)), k = /* @__PURE__ */ new Uint8Array(2048), l = 0), t(a, b)) : (c = k.length - l, c < b.byteLength && (0 === c ? t(a, k) : (k.set(b.subarray(0, c), l), l += c, t(a, k), b = b.subarray(c)), k = /* @__PURE__ */ new Uint8Array(2048), l = 0), k.set(b, l), l += b.byteLength, 2048 === l && (t(a, k), k = /* @__PURE__ */ new Uint8Array(2048), l = 0)));
	}
	function t(a, b) {
		a = a.write(b);
		q = q && a;
	}
	function w(a, b) {
		r(a, b);
		return q;
	}
	function ca(a) {
		k && 0 < l && a.write(k.subarray(0, l));
		k = null;
		l = 0;
		q = !0;
	}
	var u = new aa.TextEncoder();
	function x(a) {
		return u.encode(a);
	}
	var y = Object.prototype.hasOwnProperty;
	var da = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/;
	var ea = {};
	var fa = {};
	function ha(a) {
		if (y.call(fa, a)) return !0;
		if (y.call(ea, a)) return !1;
		if (da.test(a)) return fa[a] = !0;
		ea[a] = !0;
		return !1;
	}
	function z(a, b, c, d, f, e, g) {
		this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
		this.attributeName = d;
		this.attributeNamespace = f;
		this.mustUseProperty = c;
		this.propertyName = a;
		this.type = b;
		this.sanitizeURL = e;
		this.removeEmptyString = g;
	}
	var A = {};
	"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
		A[a] = new z(a, 0, !1, a, null, !1, !1);
	});
	[
		["acceptCharset", "accept-charset"],
		["className", "class"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"]
	].forEach(function(a) {
		var b = a[0];
		A[b] = new z(b, 1, !1, a[1], null, !1, !1);
	});
	[
		"contentEditable",
		"draggable",
		"spellCheck",
		"value"
	].forEach(function(a) {
		A[a] = new z(a, 2, !1, a.toLowerCase(), null, !1, !1);
	});
	[
		"autoReverse",
		"externalResourcesRequired",
		"focusable",
		"preserveAlpha"
	].forEach(function(a) {
		A[a] = new z(a, 2, !1, a, null, !1, !1);
	});
	"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
		A[a] = new z(a, 3, !1, a.toLowerCase(), null, !1, !1);
	});
	[
		"checked",
		"multiple",
		"muted",
		"selected"
	].forEach(function(a) {
		A[a] = new z(a, 3, !0, a, null, !1, !1);
	});
	["capture", "download"].forEach(function(a) {
		A[a] = new z(a, 4, !1, a, null, !1, !1);
	});
	[
		"cols",
		"rows",
		"size",
		"span"
	].forEach(function(a) {
		A[a] = new z(a, 6, !1, a, null, !1, !1);
	});
	["rowSpan", "start"].forEach(function(a) {
		A[a] = new z(a, 5, !1, a.toLowerCase(), null, !1, !1);
	});
	var ia = /[\-:]([a-z])/g;
	function ja(a) {
		return a[1].toUpperCase();
	}
	"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
		var b = a.replace(ia, ja);
		A[b] = new z(b, 1, !1, a, null, !1, !1);
	});
	"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
		var b = a.replace(ia, ja);
		A[b] = new z(b, 1, !1, a, "http://www.w3.org/1999/xlink", !1, !1);
	});
	[
		"xml:base",
		"xml:lang",
		"xml:space"
	].forEach(function(a) {
		var b = a.replace(ia, ja);
		A[b] = new z(b, 1, !1, a, "http://www.w3.org/XML/1998/namespace", !1, !1);
	});
	["tabIndex", "crossOrigin"].forEach(function(a) {
		A[a] = new z(a, 1, !1, a.toLowerCase(), null, !1, !1);
	});
	A.xlinkHref = new z("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
	[
		"src",
		"href",
		"action",
		"formAction"
	].forEach(function(a) {
		A[a] = new z(a, 1, !1, a.toLowerCase(), null, !0, !0);
	});
	var B = {
		animationIterationCount: !0,
		aspectRatio: !0,
		borderImageOutset: !0,
		borderImageSlice: !0,
		borderImageWidth: !0,
		boxFlex: !0,
		boxFlexGroup: !0,
		boxOrdinalGroup: !0,
		columnCount: !0,
		columns: !0,
		flex: !0,
		flexGrow: !0,
		flexPositive: !0,
		flexShrink: !0,
		flexNegative: !0,
		flexOrder: !0,
		gridArea: !0,
		gridRow: !0,
		gridRowEnd: !0,
		gridRowSpan: !0,
		gridRowStart: !0,
		gridColumn: !0,
		gridColumnEnd: !0,
		gridColumnSpan: !0,
		gridColumnStart: !0,
		fontWeight: !0,
		lineClamp: !0,
		lineHeight: !0,
		opacity: !0,
		order: !0,
		orphans: !0,
		tabSize: !0,
		widows: !0,
		zIndex: !0,
		zoom: !0,
		fillOpacity: !0,
		floodOpacity: !0,
		stopOpacity: !0,
		strokeDasharray: !0,
		strokeDashoffset: !0,
		strokeMiterlimit: !0,
		strokeOpacity: !0,
		strokeWidth: !0
	};
	var ka = [
		"Webkit",
		"ms",
		"Moz",
		"O"
	];
	Object.keys(B).forEach(function(a) {
		ka.forEach(function(b) {
			b = b + a.charAt(0).toUpperCase() + a.substring(1);
			B[b] = B[a];
		});
	});
	var la = /["'&<>]/;
	function F(a) {
		if ("boolean" === typeof a || "number" === typeof a) return "" + a;
		a = "" + a;
		var b = la.exec(a);
		if (b) {
			var c = "", d, f = 0;
			for (d = b.index; d < a.length; d++) {
				switch (a.charCodeAt(d)) {
					case 34:
						b = "&quot;";
						break;
					case 38:
						b = "&amp;";
						break;
					case 39:
						b = "&#x27;";
						break;
					case 60:
						b = "&lt;";
						break;
					case 62:
						b = "&gt;";
						break;
					default: continue;
				}
				f !== d && (c += a.substring(f, d));
				f = d + 1;
				c += b;
			}
			a = f !== d ? c + a.substring(f, d) : c;
		}
		return a;
	}
	var ma = /([A-Z])/g;
	var pa = /^ms-/;
	var qa = Array.isArray;
	var ra = x("<script>");
	var sa = x("<\/script>");
	var ta = x("<script src=\"");
	var ua = x("<script type=\"module\" src=\"");
	var va = x("\" async=\"\"><\/script>");
	var wa = /(<\/|<)(s)(cript)/gi;
	function xa(a, b, c, d) {
		return "" + b + ("s" === c ? "\\u0073" : "\\u0053") + d;
	}
	function G(a, b) {
		return {
			insertionMode: a,
			selectedValue: b
		};
	}
	function ya(a, b, c) {
		switch (b) {
			case "select": return G(1, null != c.value ? c.value : c.defaultValue);
			case "svg": return G(2, null);
			case "math": return G(3, null);
			case "foreignObject": return G(1, null);
			case "table": return G(4, null);
			case "thead":
			case "tbody":
			case "tfoot": return G(5, null);
			case "colgroup": return G(7, null);
			case "tr": return G(6, null);
		}
		return 4 <= a.insertionMode || 0 === a.insertionMode ? G(1, null) : a;
	}
	var za = x("<!-- -->");
	function Aa(a, b, c, d) {
		if ("" === b) return d;
		d && a.push(za);
		a.push(F(b));
		return !0;
	}
	var Ba = /* @__PURE__ */ new Map();
	var Ca = x(" style=\"");
	var Da = x(":");
	var Ea = x(";");
	function Fa(a, b, c) {
		if ("object" !== typeof c) throw Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
		b = !0;
		for (var d in c) if (y.call(c, d)) {
			var f = c[d];
			if (null != f && "boolean" !== typeof f && "" !== f) {
				if (0 === d.indexOf("--")) {
					var e = F(d);
					f = F(("" + f).trim());
				} else {
					e = d;
					var g = Ba.get(e);
					void 0 !== g ? e = g : (g = x(F(e.replace(ma, "-$1").toLowerCase().replace(pa, "-ms-"))), Ba.set(e, g), e = g);
					f = "number" === typeof f ? 0 === f || y.call(B, d) ? "" + f : f + "px" : F(("" + f).trim());
				}
				b ? (b = !1, a.push(Ca, e, Da, f)) : a.push(Ea, e, Da, f);
			}
		}
		b || a.push(H);
	}
	var I = x(" ");
	var J = x("=\"");
	var H = x("\"");
	var Ga = x("=\"\"");
	function K(a, b, c, d) {
		switch (c) {
			case "style":
				Fa(a, b, d);
				return;
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning": return;
		}
		if (!(2 < c.length) || "o" !== c[0] && "O" !== c[0] || "n" !== c[1] && "N" !== c[1]) {
			if (b = A.hasOwnProperty(c) ? A[c] : null, null !== b) {
				switch (typeof d) {
					case "function":
					case "symbol": return;
					case "boolean": if (!b.acceptsBooleans) return;
				}
				c = b.attributeName;
				switch (b.type) {
					case 3:
						d && a.push(I, c, Ga);
						break;
					case 4:
						!0 === d ? a.push(I, c, Ga) : !1 !== d && a.push(I, c, J, F(d), H);
						break;
					case 5:
						isNaN(d) || a.push(I, c, J, F(d), H);
						break;
					case 6:
						!isNaN(d) && 1 <= d && a.push(I, c, J, F(d), H);
						break;
					default: b.sanitizeURL && (d = "" + d), a.push(I, c, J, F(d), H);
				}
			} else if (ha(c)) {
				switch (typeof d) {
					case "function":
					case "symbol": return;
					case "boolean": if (b = c.toLowerCase().slice(0, 5), "data-" !== b && "aria-" !== b) return;
				}
				a.push(I, c, J, F(d), H);
			}
		}
	}
	var L = x(">");
	var Ha = x("/>");
	function M(a, b, c) {
		if (null != b) {
			if (null != c) throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
			if ("object" !== typeof b || !("__html" in b)) throw Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
			b = b.__html;
			null !== b && void 0 !== b && a.push("" + b);
		}
	}
	function Ia(a) {
		var b = "";
		ba.Children.forEach(a, function(a) {
			null != a && (b += a);
		});
		return b;
	}
	var Ja = x(" selected=\"\"");
	function Ka(a, b, c, d) {
		a.push(N(c));
		var f = c = null, e;
		for (e in b) if (y.call(b, e)) {
			var g = b[e];
			if (null != g) switch (e) {
				case "children":
					c = g;
					break;
				case "dangerouslySetInnerHTML":
					f = g;
					break;
				default: K(a, d, e, g);
			}
		}
		a.push(L);
		M(a, f, c);
		return "string" === typeof c ? (a.push(F(c)), null) : c;
	}
	var La = x("\n");
	var Ma = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/;
	var Na = /* @__PURE__ */ new Map();
	function N(a) {
		var b = Na.get(a);
		if (void 0 === b) {
			if (!Ma.test(a)) throw Error("Invalid tag: " + a);
			b = x("<" + a);
			Na.set(a, b);
		}
		return b;
	}
	var Oa = x("<!DOCTYPE html>");
	function Pa(a, b, c, d, f) {
		switch (b) {
			case "select":
				a.push(N("select"));
				var e = null, g = null;
				for (p in c) if (y.call(c, p)) {
					var h = c[p];
					if (null != h) switch (p) {
						case "children":
							e = h;
							break;
						case "dangerouslySetInnerHTML":
							g = h;
							break;
						case "defaultValue":
						case "value": break;
						default: K(a, d, p, h);
					}
				}
				a.push(L);
				M(a, g, e);
				return e;
			case "option":
				g = f.selectedValue;
				a.push(N("option"));
				var m = h = null, n = null;
				var p = null;
				for (e in c) if (y.call(c, e)) {
					var v = c[e];
					if (null != v) switch (e) {
						case "children":
							h = v;
							break;
						case "selected":
							n = v;
							break;
						case "dangerouslySetInnerHTML":
							p = v;
							break;
						case "value": m = v;
						default: K(a, d, e, v);
					}
				}
				if (null != g) if (c = null !== m ? "" + m : Ia(h), qa(g)) {
					for (d = 0; d < g.length; d++) if ("" + g[d] === c) {
						a.push(Ja);
						break;
					}
				} else "" + g === c && a.push(Ja);
				else n && a.push(Ja);
				a.push(L);
				M(a, p, h);
				return h;
			case "textarea":
				a.push(N("textarea"));
				p = g = e = null;
				for (h in c) if (y.call(c, h) && (m = c[h], null != m)) switch (h) {
					case "children":
						p = m;
						break;
					case "value":
						e = m;
						break;
					case "defaultValue":
						g = m;
						break;
					case "dangerouslySetInnerHTML": throw Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
					default: K(a, d, h, m);
				}
				null === e && null !== g && (e = g);
				a.push(L);
				if (null != p) {
					if (null != e) throw Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
					if (qa(p) && 1 < p.length) throw Error("<textarea> can only have at most one child.");
					e = "" + p;
				}
				"string" === typeof e && "\n" === e[0] && a.push(La);
				null !== e && a.push(F("" + e));
				return null;
			case "input":
				a.push(N("input"));
				m = p = h = e = null;
				for (g in c) if (y.call(c, g) && (n = c[g], null != n)) switch (g) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error("input is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
					case "defaultChecked":
						m = n;
						break;
					case "defaultValue":
						h = n;
						break;
					case "checked":
						p = n;
						break;
					case "value":
						e = n;
						break;
					default: K(a, d, g, n);
				}
				null !== p ? K(a, d, "checked", p) : null !== m && K(a, d, "checked", m);
				null !== e ? K(a, d, "value", e) : null !== h && K(a, d, "value", h);
				a.push(Ha);
				return null;
			case "menuitem":
				a.push(N("menuitem"));
				for (var C in c) if (y.call(c, C) && (e = c[C], null != e)) switch (C) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error("menuitems cannot have `children` nor `dangerouslySetInnerHTML`.");
					default: K(a, d, C, e);
				}
				a.push(L);
				return null;
			case "title":
				a.push(N("title"));
				e = null;
				for (v in c) if (y.call(c, v) && (g = c[v], null != g)) switch (v) {
					case "children":
						e = g;
						break;
					case "dangerouslySetInnerHTML": throw Error("`dangerouslySetInnerHTML` does not make sense on <title>.");
					default: K(a, d, v, g);
				}
				a.push(L);
				return e;
			case "listing":
			case "pre":
				a.push(N(b));
				g = e = null;
				for (m in c) if (y.call(c, m) && (h = c[m], null != h)) switch (m) {
					case "children":
						e = h;
						break;
					case "dangerouslySetInnerHTML":
						g = h;
						break;
					default: K(a, d, m, h);
				}
				a.push(L);
				if (null != g) {
					if (null != e) throw Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
					if ("object" !== typeof g || !("__html" in g)) throw Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
					c = g.__html;
					null !== c && void 0 !== c && ("string" === typeof c && 0 < c.length && "\n" === c[0] ? a.push(La, c) : a.push("" + c));
				}
				"string" === typeof e && "\n" === e[0] && a.push(La);
				return e;
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "img":
			case "keygen":
			case "link":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
				a.push(N(b));
				for (var D in c) if (y.call(c, D) && (e = c[D], null != e)) switch (D) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(b + " is a self-closing tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
					default: K(a, d, D, e);
				}
				a.push(Ha);
				return null;
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return Ka(a, c, b, d);
			case "html": return 0 === f.insertionMode && a.push(Oa), Ka(a, c, b, d);
			default:
				if (-1 === b.indexOf("-") && "string" !== typeof c.is) return Ka(a, c, b, d);
				a.push(N(b));
				g = e = null;
				for (n in c) if (y.call(c, n) && (h = c[n], null != h)) switch (n) {
					case "children":
						e = h;
						break;
					case "dangerouslySetInnerHTML":
						g = h;
						break;
					case "style":
						Fa(a, d, h);
						break;
					case "suppressContentEditableWarning":
					case "suppressHydrationWarning": break;
					default: ha(n) && "function" !== typeof h && "symbol" !== typeof h && a.push(I, n, J, F(h), H);
				}
				a.push(L);
				M(a, g, e);
				return e;
		}
	}
	var Qa = x("</");
	var Ra = x(">");
	var Sa = x("<template id=\"");
	var Ta = x("\"></template>");
	var Ua = x("<!--$-->");
	var Va = x("<!--$?--><template id=\"");
	var Wa = x("\"></template>");
	var Xa = x("<!--$!-->");
	var Ya = x("<!--/$-->");
	var Za = x("<template");
	var $a = x("\"");
	var ab = x(" data-dgst=\"");
	x(" data-msg=\"");
	x(" data-stck=\"");
	var bb = x("></template>");
	function cb(a, b, c) {
		r(a, Va);
		if (null === c) throw Error("An ID must have been assigned before we can complete the boundary.");
		r(a, c);
		return w(a, Wa);
	}
	var db = x("<div hidden id=\"");
	var eb = x("\">");
	var fb = x("</div>");
	var gb = x("<svg aria-hidden=\"true\" style=\"display:none\" id=\"");
	var hb = x("\">");
	var ib = x("</svg>");
	var jb = x("<math aria-hidden=\"true\" style=\"display:none\" id=\"");
	var kb = x("\">");
	var lb = x("</math>");
	var mb = x("<table hidden id=\"");
	var nb = x("\">");
	var ob = x("</table>");
	var pb = x("<table hidden><tbody id=\"");
	var qb = x("\">");
	var rb = x("</tbody></table>");
	var sb = x("<table hidden><tr id=\"");
	var tb = x("\">");
	var ub = x("</tr></table>");
	var vb = x("<table hidden><colgroup id=\"");
	var wb = x("\">");
	var xb = x("</colgroup></table>");
	function yb(a, b, c, d) {
		switch (c.insertionMode) {
			case 0:
			case 1: return r(a, db), r(a, b.segmentPrefix), r(a, d.toString(16)), w(a, eb);
			case 2: return r(a, gb), r(a, b.segmentPrefix), r(a, d.toString(16)), w(a, hb);
			case 3: return r(a, jb), r(a, b.segmentPrefix), r(a, d.toString(16)), w(a, kb);
			case 4: return r(a, mb), r(a, b.segmentPrefix), r(a, d.toString(16)), w(a, nb);
			case 5: return r(a, pb), r(a, b.segmentPrefix), r(a, d.toString(16)), w(a, qb);
			case 6: return r(a, sb), r(a, b.segmentPrefix), r(a, d.toString(16)), w(a, tb);
			case 7: return r(a, vb), r(a, b.segmentPrefix), r(a, d.toString(16)), w(a, wb);
			default: throw Error("Unknown insertion mode. This is a bug in React.");
		}
	}
	function zb(a, b) {
		switch (b.insertionMode) {
			case 0:
			case 1: return w(a, fb);
			case 2: return w(a, ib);
			case 3: return w(a, lb);
			case 4: return w(a, ob);
			case 5: return w(a, rb);
			case 6: return w(a, ub);
			case 7: return w(a, xb);
			default: throw Error("Unknown insertion mode. This is a bug in React.");
		}
	}
	var Ab = x("function $RS(a,b){a=document.getElementById(a);b=document.getElementById(b);for(a.parentNode.removeChild(a);a.firstChild;)b.parentNode.insertBefore(a.firstChild,b);b.parentNode.removeChild(b)};$RS(\"");
	var Bb = x("$RS(\"");
	var Cb = x("\",\"");
	var Db = x("\")<\/script>");
	var Fb = x("function $RC(a,b){a=document.getElementById(a);b=document.getElementById(b);b.parentNode.removeChild(b);if(a){a=a.previousSibling;var f=a.parentNode,c=a.nextSibling,e=0;do{if(c&&8===c.nodeType){var d=c.data;if(\"/$\"===d)if(0===e)break;else e--;else\"$\"!==d&&\"$?\"!==d&&\"$!\"!==d||e++}d=c.nextSibling;f.removeChild(c);c=d}while(c);for(;b.firstChild;)f.insertBefore(b.firstChild,c);a.data=\"$\";a._reactRetry&&a._reactRetry()}};$RC(\"");
	var Gb = x("$RC(\"");
	var Hb = x("\",\"");
	var Ib = x("\")<\/script>");
	var Jb = x("function $RX(b,c,d,e){var a=document.getElementById(b);a&&(b=a.previousSibling,b.data=\"$!\",a=a.dataset,c&&(a.dgst=c),d&&(a.msg=d),e&&(a.stck=e),b._reactRetry&&b._reactRetry())};$RX(\"");
	var Kb = x("$RX(\"");
	var Lb = x("\"");
	var Mb = x(")<\/script>");
	var Nb = x(",");
	var Ob = /[<\u2028\u2029]/g;
	function Pb(a) {
		return JSON.stringify(a).replace(Ob, function(a) {
			switch (a) {
				case "<": return "\\u003c";
				case "\u2028": return "\\u2028";
				case "\u2029": return "\\u2029";
				default: throw Error("escapeJSStringsForInstructionScripts encountered a match it does not know how to replace. this means the match regex and the replacement characters are no longer in sync. This is a bug in React");
			}
		});
	}
	var O = Object.assign;
	var Qb = Symbol.for("react.element");
	var Rb = Symbol.for("react.portal");
	var Sb = Symbol.for("react.fragment");
	var Tb = Symbol.for("react.strict_mode");
	var Ub = Symbol.for("react.profiler");
	var Vb = Symbol.for("react.provider");
	var Wb = Symbol.for("react.context");
	var Xb = Symbol.for("react.forward_ref");
	var Yb = Symbol.for("react.suspense");
	var Zb = Symbol.for("react.suspense_list");
	var $b = Symbol.for("react.memo");
	var ac = Symbol.for("react.lazy");
	var bc = Symbol.for("react.scope");
	var cc = Symbol.for("react.debug_trace_mode");
	var dc = Symbol.for("react.legacy_hidden");
	var ec = Symbol.for("react.default_value");
	var fc = Symbol.iterator;
	function gc(a) {
		if (null == a) return null;
		if ("function" === typeof a) return a.displayName || a.name || null;
		if ("string" === typeof a) return a;
		switch (a) {
			case Sb: return "Fragment";
			case Rb: return "Portal";
			case Ub: return "Profiler";
			case Tb: return "StrictMode";
			case Yb: return "Suspense";
			case Zb: return "SuspenseList";
		}
		if ("object" === typeof a) switch (a.$$typeof) {
			case Wb: return (a.displayName || "Context") + ".Consumer";
			case Vb: return (a._context.displayName || "Context") + ".Provider";
			case Xb:
				var b = a.render;
				a = a.displayName;
				a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
				return a;
			case $b: return b = a.displayName || null, null !== b ? b : gc(a.type) || "Memo";
			case ac:
				b = a._payload;
				a = a._init;
				try {
					return gc(a(b));
				} catch (c) {}
		}
		return null;
	}
	var hc = {};
	function ic(a, b) {
		a = a.contextTypes;
		if (!a) return hc;
		var c = {}, d;
		for (d in a) c[d] = b[d];
		return c;
	}
	var P = null;
	function Q(a, b) {
		if (a !== b) {
			a.context._currentValue = a.parentValue;
			a = a.parent;
			var c = b.parent;
			if (null === a) {
				if (null !== c) throw Error("The stacks must reach the root at the same time. This is a bug in React.");
			} else {
				if (null === c) throw Error("The stacks must reach the root at the same time. This is a bug in React.");
				Q(a, c);
			}
			b.context._currentValue = b.value;
		}
	}
	function jc(a) {
		a.context._currentValue = a.parentValue;
		a = a.parent;
		null !== a && jc(a);
	}
	function kc(a) {
		var b = a.parent;
		null !== b && kc(b);
		a.context._currentValue = a.value;
	}
	function lc(a, b) {
		a.context._currentValue = a.parentValue;
		a = a.parent;
		if (null === a) throw Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
		a.depth === b.depth ? Q(a, b) : lc(a, b);
	}
	function mc(a, b) {
		var c = b.parent;
		if (null === c) throw Error("The depth must equal at least at zero before reaching the root. This is a bug in React.");
		a.depth === c.depth ? Q(a, c) : mc(a, c);
		b.context._currentValue = b.value;
	}
	function nc(a) {
		var b = P;
		b !== a && (null === b ? kc(a) : null === a ? jc(b) : b.depth === a.depth ? Q(b, a) : b.depth > a.depth ? lc(b, a) : mc(b, a), P = a);
	}
	var oc = {
		isMounted: function() {
			return !1;
		},
		enqueueSetState: function(a, b) {
			a = a._reactInternals;
			null !== a.queue && a.queue.push(b);
		},
		enqueueReplaceState: function(a, b) {
			a = a._reactInternals;
			a.replace = !0;
			a.queue = [b];
		},
		enqueueForceUpdate: function() {}
	};
	function pc(a, b, c, d) {
		var f = void 0 !== a.state ? a.state : null;
		a.updater = oc;
		a.props = c;
		a.state = f;
		var e = {
			queue: [],
			replace: !1
		};
		a._reactInternals = e;
		var g = b.contextType;
		a.context = "object" === typeof g && null !== g ? g._currentValue : d;
		g = b.getDerivedStateFromProps;
		"function" === typeof g && (g = g(c, f), f = null === g || void 0 === g ? f : O({}, f, g), a.state = f);
		if ("function" !== typeof b.getDerivedStateFromProps && "function" !== typeof a.getSnapshotBeforeUpdate && ("function" === typeof a.UNSAFE_componentWillMount || "function" === typeof a.componentWillMount)) if (b = a.state, "function" === typeof a.componentWillMount && a.componentWillMount(), "function" === typeof a.UNSAFE_componentWillMount && a.UNSAFE_componentWillMount(), b !== a.state && oc.enqueueReplaceState(a, a.state, null), null !== e.queue && 0 < e.queue.length) if (b = e.queue, g = e.replace, e.queue = null, e.replace = !1, g && 1 === b.length) a.state = b[0];
		else {
			e = g ? b[0] : a.state;
			f = !0;
			for (g = g ? 1 : 0; g < b.length; g++) {
				var h = b[g];
				h = "function" === typeof h ? h.call(a, e, c, d) : h;
				null != h && (f ? (f = !1, e = O({}, e, h)) : O(e, h));
			}
			a.state = e;
		}
		else e.queue = null;
	}
	var qc = {
		id: 1,
		overflow: ""
	};
	function rc(a, b, c) {
		var d = a.id;
		a = a.overflow;
		var f = 32 - sc(d) - 1;
		d &= ~(1 << f);
		c += 1;
		var e = 32 - sc(b) + f;
		if (30 < e) {
			var g = f - f % 5;
			e = (d & (1 << g) - 1).toString(32);
			d >>= g;
			f -= g;
			return {
				id: 1 << 32 - sc(b) + f | c << f | d,
				overflow: e + a
			};
		}
		return {
			id: 1 << e | c << f | d,
			overflow: a
		};
	}
	var sc = Math.clz32 ? Math.clz32 : tc;
	var uc = Math.log;
	var vc = Math.LN2;
	function tc(a) {
		a >>>= 0;
		return 0 === a ? 32 : 31 - (uc(a) / vc | 0) | 0;
	}
	function wc(a, b) {
		return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
	}
	var xc = "function" === typeof Object.is ? Object.is : wc;
	var R = null;
	var yc = null;
	var zc = null;
	var S = null;
	var T = !1;
	var Ac = !1;
	var U = 0;
	var V = null;
	var Bc = 0;
	function W() {
		if (null === R) throw Error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
		return R;
	}
	function Cc() {
		if (0 < Bc) throw Error("Rendered more hooks than during the previous render");
		return {
			memoizedState: null,
			queue: null,
			next: null
		};
	}
	function Dc() {
		null === S ? null === zc ? (T = !1, zc = S = Cc()) : (T = !0, S = zc) : null === S.next ? (T = !1, S = S.next = Cc()) : (T = !0, S = S.next);
		return S;
	}
	function Ec() {
		yc = R = null;
		Ac = !1;
		zc = null;
		Bc = 0;
		S = V = null;
	}
	function Fc(a, b) {
		return "function" === typeof b ? b(a) : b;
	}
	function Gc(a, b, c) {
		R = W();
		S = Dc();
		if (T) {
			var d = S.queue;
			b = d.dispatch;
			if (null !== V && (c = V.get(d), void 0 !== c)) {
				V.delete(d);
				d = S.memoizedState;
				do
					d = a(d, c.action), c = c.next;
				while (null !== c);
				S.memoizedState = d;
				return [d, b];
			}
			return [S.memoizedState, b];
		}
		a = a === Fc ? "function" === typeof b ? b() : b : void 0 !== c ? c(b) : b;
		S.memoizedState = a;
		a = S.queue = {
			last: null,
			dispatch: null
		};
		a = a.dispatch = Hc.bind(null, R, a);
		return [S.memoizedState, a];
	}
	function Ic(a, b) {
		R = W();
		S = Dc();
		b = void 0 === b ? null : b;
		if (null !== S) {
			var c = S.memoizedState;
			if (null !== c && null !== b) {
				var d = c[1];
				a: if (null === d) d = !1;
				else {
					for (var f = 0; f < d.length && f < b.length; f++) if (!xc(b[f], d[f])) {
						d = !1;
						break a;
					}
					d = !0;
				}
				if (d) return c[0];
			}
		}
		a = a();
		S.memoizedState = [a, b];
		return a;
	}
	function Hc(a, b, c) {
		if (25 <= Bc) throw Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
		if (a === R) if (Ac = !0, a = {
			action: c,
			next: null
		}, null === V && (V = /* @__PURE__ */ new Map()), c = V.get(b), void 0 === c) V.set(b, a);
		else {
			for (b = c; null !== b.next;) b = b.next;
			b.next = a;
		}
	}
	function Jc() {
		throw Error("startTransition cannot be called during server rendering.");
	}
	function Kc() {}
	var Mc = {
		readContext: function(a) {
			return a._currentValue;
		},
		useContext: function(a) {
			W();
			return a._currentValue;
		},
		useMemo: Ic,
		useReducer: Gc,
		useRef: function(a) {
			R = W();
			S = Dc();
			var b = S.memoizedState;
			return null === b ? (a = { current: a }, S.memoizedState = a) : b;
		},
		useState: function(a) {
			return Gc(Fc, a);
		},
		useInsertionEffect: Kc,
		useLayoutEffect: function() {},
		useCallback: function(a, b) {
			return Ic(function() {
				return a;
			}, b);
		},
		useImperativeHandle: Kc,
		useEffect: Kc,
		useDebugValue: Kc,
		useDeferredValue: function(a) {
			W();
			return a;
		},
		useTransition: function() {
			W();
			return [!1, Jc];
		},
		useId: function() {
			var a = yc.treeContext;
			var b = a.overflow;
			a = a.id;
			a = (a & ~(1 << 32 - sc(a) - 1)).toString(32) + b;
			var c = Lc;
			if (null === c) throw Error("Invalid hook call. Hooks can only be called inside of the body of a function component.");
			b = U++;
			a = ":" + c.idPrefix + "R" + a;
			0 < b && (a += "H" + b.toString(32));
			return a + ":";
		},
		useMutableSource: function(a, b) {
			W();
			return b(a._source);
		},
		useSyncExternalStore: function(a, b, c) {
			if (void 0 === c) throw Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
			return c();
		}
	};
	var Lc = null;
	var Nc = ba.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;
	function Oc(a) {
		console.error(a);
		return null;
	}
	function X() {}
	function Pc(a, b) {
		var c = a.pingedTasks;
		c.push(b);
		1 === c.length && setImmediate(function() {
			return Qc(a);
		});
	}
	function Rc(a, b, c, d, f, e, g, h) {
		a.allPendingTasks++;
		null === c ? a.pendingRootTasks++ : c.pendingTasks++;
		var m = {
			node: b,
			ping: function() {
				return Pc(a, m);
			},
			blockedBoundary: c,
			blockedSegment: d,
			abortSet: f,
			legacyContext: e,
			context: g,
			treeContext: h
		};
		f.add(m);
		return m;
	}
	function Sc(a, b, c, d, f, e) {
		return {
			status: 0,
			id: -1,
			index: b,
			parentFlushed: !1,
			chunks: [],
			children: [],
			formatContext: d,
			boundary: c,
			lastPushedText: f,
			textEmbedded: e
		};
	}
	function Y(a, b) {
		a = a.onError(b);
		if (null != a && "string" !== typeof a) throw Error("onError returned something with a type other than \"string\". onError should return a string and may return null or undefined but must not return anything else. It received something of type \"" + typeof a + "\" instead");
		return a;
	}
	function Tc(a, b) {
		var c = a.onShellError;
		c(b);
		c = a.onFatalError;
		c(b);
		null !== a.destination ? (a.status = 2, a.destination.destroy(b)) : (a.status = 1, a.fatalError = b);
	}
	function Uc(a, b, c, d, f) {
		R = {};
		yc = b;
		U = 0;
		for (a = c(d, f); Ac;) Ac = !1, U = 0, Bc += 1, S = null, a = c(d, f);
		Ec();
		return a;
	}
	function Vc(a, b, c, d) {
		var f = c.render(), e = d.childContextTypes;
		if (null !== e && void 0 !== e) {
			var g = b.legacyContext;
			if ("function" !== typeof c.getChildContext) d = g;
			else {
				c = c.getChildContext();
				for (var h in c) if (!(h in e)) throw Error((gc(d) || "Unknown") + ".getChildContext(): key \"" + h + "\" is not defined in childContextTypes.");
				d = O({}, g, c);
			}
			b.legacyContext = d;
			Z(a, b, f);
			b.legacyContext = g;
		} else Z(a, b, f);
	}
	function Wc(a, b) {
		if (a && a.defaultProps) {
			b = O({}, b);
			a = a.defaultProps;
			for (var c in a) void 0 === b[c] && (b[c] = a[c]);
			return b;
		}
		return b;
	}
	function Xc(a, b, c, d, f) {
		if ("function" === typeof c) if (c.prototype && c.prototype.isReactComponent) {
			f = ic(c, b.legacyContext);
			var e = c.contextType;
			e = new c(d, "object" === typeof e && null !== e ? e._currentValue : f);
			pc(e, c, d, f);
			Vc(a, b, e, c);
		} else {
			e = ic(c, b.legacyContext);
			f = Uc(a, b, c, d, e);
			var g = 0 !== U;
			if ("object" === typeof f && null !== f && "function" === typeof f.render && void 0 === f.$$typeof) pc(f, c, d, e), Vc(a, b, f, c);
			else if (g) {
				d = b.treeContext;
				b.treeContext = rc(d, 1, 0);
				try {
					Z(a, b, f);
				} finally {
					b.treeContext = d;
				}
			} else Z(a, b, f);
		}
		else if ("string" === typeof c) {
			f = b.blockedSegment;
			e = Pa(f.chunks, c, d, a.responseState, f.formatContext);
			f.lastPushedText = !1;
			g = f.formatContext;
			f.formatContext = ya(g, c, d);
			Yc(a, b, e);
			f.formatContext = g;
			switch (c) {
				case "area":
				case "base":
				case "br":
				case "col":
				case "embed":
				case "hr":
				case "img":
				case "input":
				case "keygen":
				case "link":
				case "meta":
				case "param":
				case "source":
				case "track":
				case "wbr": break;
				default: f.chunks.push(Qa, c, Ra);
			}
			f.lastPushedText = !1;
		} else {
			switch (c) {
				case dc:
				case cc:
				case Tb:
				case Ub:
				case Sb:
					Z(a, b, d.children);
					return;
				case Zb:
					Z(a, b, d.children);
					return;
				case bc: throw Error("ReactDOMServer does not yet support scope components.");
				case Yb:
					a: {
						c = b.blockedBoundary;
						f = b.blockedSegment;
						e = d.fallback;
						d = d.children;
						g = /* @__PURE__ */ new Set();
						var h = {
							id: null,
							rootSegmentID: -1,
							parentFlushed: !1,
							pendingTasks: 0,
							forceClientRender: !1,
							completedSegments: [],
							byteSize: 0,
							fallbackAbortableTasks: g,
							errorDigest: null
						}, m = Sc(a, f.chunks.length, h, f.formatContext, !1, !1);
						f.children.push(m);
						f.lastPushedText = !1;
						var n = Sc(a, 0, null, f.formatContext, !1, !1);
						n.parentFlushed = !0;
						b.blockedBoundary = h;
						b.blockedSegment = n;
						try {
							if (Yc(a, b, d), n.lastPushedText && n.textEmbedded && n.chunks.push(za), n.status = 1, Zc(h, n), 0 === h.pendingTasks) break a;
						} catch (p) {
							n.status = 4, h.forceClientRender = !0, h.errorDigest = Y(a, p);
						} finally {
							b.blockedBoundary = c, b.blockedSegment = f;
						}
						b = Rc(a, e, c, m, g, b.legacyContext, b.context, b.treeContext);
						a.pingedTasks.push(b);
					}
					return;
			}
			if ("object" === typeof c && null !== c) switch (c.$$typeof) {
				case Xb:
					d = Uc(a, b, c.render, d, f);
					if (0 !== U) {
						c = b.treeContext;
						b.treeContext = rc(c, 1, 0);
						try {
							Z(a, b, d);
						} finally {
							b.treeContext = c;
						}
					} else Z(a, b, d);
					return;
				case $b:
					c = c.type;
					d = Wc(c, d);
					Xc(a, b, c, d, f);
					return;
				case Vb:
					f = d.children;
					c = c._context;
					d = d.value;
					e = c._currentValue;
					c._currentValue = d;
					g = P;
					P = d = {
						parent: g,
						depth: null === g ? 0 : g.depth + 1,
						context: c,
						parentValue: e,
						value: d
					};
					b.context = d;
					Z(a, b, f);
					a = P;
					if (null === a) throw Error("Tried to pop a Context at the root of the app. This is a bug in React.");
					d = a.parentValue;
					a.context._currentValue = d === ec ? a.context._defaultValue : d;
					a = P = a.parent;
					b.context = a;
					return;
				case Wb:
					d = d.children;
					d = d(c._currentValue);
					Z(a, b, d);
					return;
				case ac:
					f = c._init;
					c = f(c._payload);
					d = Wc(c, d);
					Xc(a, b, c, d, void 0);
					return;
			}
			throw Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " + ((null == c ? c : typeof c) + "."));
		}
	}
	function Z(a, b, c) {
		b.node = c;
		if ("object" === typeof c && null !== c) {
			switch (c.$$typeof) {
				case Qb:
					Xc(a, b, c.type, c.props, c.ref);
					return;
				case Rb: throw Error("Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render.");
				case ac:
					var d = c._init;
					c = d(c._payload);
					Z(a, b, c);
					return;
			}
			if (qa(c)) {
				$c(a, b, c);
				return;
			}
			null === c || "object" !== typeof c ? d = null : (d = fc && c[fc] || c["@@iterator"], d = "function" === typeof d ? d : null);
			if (d && (d = d.call(c))) {
				c = d.next();
				if (!c.done) {
					var f = [];
					do
						f.push(c.value), c = d.next();
					while (!c.done);
					$c(a, b, f);
				}
				return;
			}
			a = Object.prototype.toString.call(c);
			throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === a ? "object with keys {" + Object.keys(c).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
		}
		"string" === typeof c ? (d = b.blockedSegment, d.lastPushedText = Aa(b.blockedSegment.chunks, c, a.responseState, d.lastPushedText)) : "number" === typeof c && (d = b.blockedSegment, d.lastPushedText = Aa(b.blockedSegment.chunks, "" + c, a.responseState, d.lastPushedText));
	}
	function $c(a, b, c) {
		for (var d = c.length, f = 0; f < d; f++) {
			var e = b.treeContext;
			b.treeContext = rc(e, d, f);
			try {
				Yc(a, b, c[f]);
			} finally {
				b.treeContext = e;
			}
		}
	}
	function Yc(a, b, c) {
		var d = b.blockedSegment.formatContext, f = b.legacyContext, e = b.context;
		try {
			return Z(a, b, c);
		} catch (m) {
			if (Ec(), "object" === typeof m && null !== m && "function" === typeof m.then) {
				c = m;
				var g = b.blockedSegment, h = Sc(a, g.chunks.length, null, g.formatContext, g.lastPushedText, !0);
				g.children.push(h);
				g.lastPushedText = !1;
				a = Rc(a, b.node, b.blockedBoundary, h, b.abortSet, b.legacyContext, b.context, b.treeContext).ping;
				c.then(a, a);
				b.blockedSegment.formatContext = d;
				b.legacyContext = f;
				b.context = e;
				nc(e);
			} else throw b.blockedSegment.formatContext = d, b.legacyContext = f, b.context = e, nc(e), m;
		}
	}
	function ad(a) {
		var b = a.blockedBoundary;
		a = a.blockedSegment;
		a.status = 3;
		bd(this, b, a);
	}
	function cd(a, b, c) {
		var d = a.blockedBoundary;
		a.blockedSegment.status = 3;
		null === d ? (b.allPendingTasks--, 2 !== b.status && (b.status = 2, null !== b.destination && b.destination.end())) : (d.pendingTasks--, d.forceClientRender || (d.forceClientRender = !0, d.errorDigest = b.onError(void 0 === c ? Error("The render was aborted by the server without a reason.") : c), d.parentFlushed && b.clientRenderedBoundaries.push(d)), d.fallbackAbortableTasks.forEach(function(a) {
			return cd(a, b, c);
		}), d.fallbackAbortableTasks.clear(), b.allPendingTasks--, 0 === b.allPendingTasks && (a = b.onAllReady, a()));
	}
	function Zc(a, b) {
		if (0 === b.chunks.length && 1 === b.children.length && null === b.children[0].boundary) {
			var c = b.children[0];
			c.id = b.id;
			c.parentFlushed = !0;
			1 === c.status && Zc(a, c);
		} else a.completedSegments.push(b);
	}
	function bd(a, b, c) {
		if (null === b) {
			if (c.parentFlushed) {
				if (null !== a.completedRootSegment) throw Error("There can only be one root segment. This is a bug in React.");
				a.completedRootSegment = c;
			}
			a.pendingRootTasks--;
			0 === a.pendingRootTasks && (a.onShellError = X, b = a.onShellReady, b());
		} else b.pendingTasks--, b.forceClientRender || (0 === b.pendingTasks ? (c.parentFlushed && 1 === c.status && Zc(b, c), b.parentFlushed && a.completedBoundaries.push(b), b.fallbackAbortableTasks.forEach(ad, a), b.fallbackAbortableTasks.clear()) : c.parentFlushed && 1 === c.status && (Zc(b, c), 1 === b.completedSegments.length && b.parentFlushed && a.partialBoundaries.push(b)));
		a.allPendingTasks--;
		0 === a.allPendingTasks && (a = a.onAllReady, a());
	}
	function Qc(a) {
		if (2 !== a.status) {
			var b = P, c = Nc.current;
			Nc.current = Mc;
			var d = Lc;
			Lc = a.responseState;
			try {
				var f = a.pingedTasks, e = 0;
				for (; e < f.length; e++) {
					var g = f[e];
					var h = a, m = g.blockedSegment;
					if (0 === m.status) {
						nc(g.context);
						try {
							Z(h, g, g.node), m.lastPushedText && m.textEmbedded && m.chunks.push(za), g.abortSet.delete(g), m.status = 1, bd(h, g.blockedBoundary, m);
						} catch (E) {
							if (Ec(), "object" === typeof E && null !== E && "function" === typeof E.then) {
								var n = g.ping;
								E.then(n, n);
							} else {
								g.abortSet.delete(g);
								m.status = 4;
								var p = g.blockedBoundary, v = E, C = Y(h, v);
								null === p ? Tc(h, v) : (p.pendingTasks--, p.forceClientRender || (p.forceClientRender = !0, p.errorDigest = C, p.parentFlushed && h.clientRenderedBoundaries.push(p)));
								h.allPendingTasks--;
								if (0 === h.allPendingTasks) {
									var D = h.onAllReady;
									D();
								}
							}
						}
					}
				}
				f.splice(0, e);
				null !== a.destination && dd(a, a.destination);
			} catch (E) {
				Y(a, E), Tc(a, E);
			} finally {
				Lc = d, Nc.current = c, c === Mc && nc(b);
			}
		}
	}
	function ed(a, b, c) {
		c.parentFlushed = !0;
		switch (c.status) {
			case 0:
				var d = c.id = a.nextSegmentId++;
				c.lastPushedText = !1;
				c.textEmbedded = !1;
				a = a.responseState;
				r(b, Sa);
				r(b, a.placeholderPrefix);
				a = d.toString(16);
				r(b, a);
				return w(b, Ta);
			case 1:
				c.status = 2;
				var f = !0;
				d = c.chunks;
				var e = 0;
				c = c.children;
				for (var g = 0; g < c.length; g++) {
					for (f = c[g]; e < f.index; e++) r(b, d[e]);
					f = fd(a, b, f);
				}
				for (; e < d.length - 1; e++) r(b, d[e]);
				e < d.length && (f = w(b, d[e]));
				return f;
			default: throw Error("Aborted, errored or already flushed boundaries should not be flushed again. This is a bug in React.");
		}
	}
	function fd(a, b, c) {
		var d = c.boundary;
		if (null === d) return ed(a, b, c);
		d.parentFlushed = !0;
		if (d.forceClientRender) d = d.errorDigest, w(b, Xa), r(b, Za), d && (r(b, ab), r(b, F(d)), r(b, $a)), w(b, bb), ed(a, b, c);
		else if (0 < d.pendingTasks) {
			d.rootSegmentID = a.nextSegmentId++;
			0 < d.completedSegments.length && a.partialBoundaries.push(d);
			var f = a.responseState;
			var e = f.nextSuspenseID++;
			f = x(f.boundaryPrefix + e.toString(16));
			d = d.id = f;
			cb(b, a.responseState, d);
			ed(a, b, c);
		} else if (d.byteSize > a.progressiveChunkSize) d.rootSegmentID = a.nextSegmentId++, a.completedBoundaries.push(d), cb(b, a.responseState, d.id), ed(a, b, c);
		else {
			w(b, Ua);
			c = d.completedSegments;
			if (1 !== c.length) throw Error("A previously unvisited boundary must have exactly one root segment. This is a bug in React.");
			fd(a, b, c[0]);
		}
		return w(b, Ya);
	}
	function gd(a, b, c) {
		yb(b, a.responseState, c.formatContext, c.id);
		fd(a, b, c);
		return zb(b, c.formatContext);
	}
	function hd(a, b, c) {
		for (var d = c.completedSegments, f = 0; f < d.length; f++) id(a, b, c, d[f]);
		d.length = 0;
		a = a.responseState;
		d = c.id;
		c = c.rootSegmentID;
		r(b, a.startInlineScript);
		a.sentCompleteBoundaryFunction ? r(b, Gb) : (a.sentCompleteBoundaryFunction = !0, r(b, Fb));
		if (null === d) throw Error("An ID must have been assigned before we can complete the boundary.");
		c = c.toString(16);
		r(b, d);
		r(b, Hb);
		r(b, a.segmentPrefix);
		r(b, c);
		return w(b, Ib);
	}
	function id(a, b, c, d) {
		if (2 === d.status) return !0;
		var f = d.id;
		if (-1 === f) {
			if (-1 === (d.id = c.rootSegmentID)) throw Error("A root segment ID must have been assigned by now. This is a bug in React.");
			return gd(a, b, d);
		}
		gd(a, b, d);
		a = a.responseState;
		r(b, a.startInlineScript);
		a.sentCompleteSegmentFunction ? r(b, Bb) : (a.sentCompleteSegmentFunction = !0, r(b, Ab));
		r(b, a.segmentPrefix);
		f = f.toString(16);
		r(b, f);
		r(b, Cb);
		r(b, a.placeholderPrefix);
		r(b, f);
		return w(b, Db);
	}
	function dd(a, b) {
		k = /* @__PURE__ */ new Uint8Array(2048);
		l = 0;
		q = !0;
		try {
			var c = a.completedRootSegment;
			if (null !== c && 0 === a.pendingRootTasks) {
				fd(a, b, c);
				a.completedRootSegment = null;
				var d = a.responseState.bootstrapChunks;
				for (c = 0; c < d.length - 1; c++) r(b, d[c]);
				c < d.length && w(b, d[c]);
			}
			var f = a.clientRenderedBoundaries, e = 0;
			for (; e < f.length; e++) {
				var g = f[e];
				d = b;
				var h = a.responseState, m = g.id, n = g.errorDigest, p = g.errorMessage, v = g.errorComponentStack;
				r(d, h.startInlineScript);
				h.sentClientRenderFunction ? r(d, Kb) : (h.sentClientRenderFunction = !0, r(d, Jb));
				if (null === m) throw Error("An ID must have been assigned before we can complete the boundary.");
				r(d, m);
				r(d, Lb);
				if (n || p || v) r(d, Nb), r(d, Pb(n || ""));
				if (p || v) r(d, Nb), r(d, Pb(p || ""));
				v && (r(d, Nb), r(d, Pb(v)));
				if (!w(d, Mb)) {
					a.destination = null;
					e++;
					f.splice(0, e);
					return;
				}
			}
			f.splice(0, e);
			var C = a.completedBoundaries;
			for (e = 0; e < C.length; e++) if (!hd(a, b, C[e])) {
				a.destination = null;
				e++;
				C.splice(0, e);
				return;
			}
			C.splice(0, e);
			ca(b);
			k = /* @__PURE__ */ new Uint8Array(2048);
			l = 0;
			q = !0;
			var D = a.partialBoundaries;
			for (e = 0; e < D.length; e++) {
				var E = D[e];
				a: {
					f = a;
					g = b;
					var na = E.completedSegments;
					for (h = 0; h < na.length; h++) if (!id(f, g, E, na[h])) {
						h++;
						na.splice(0, h);
						var Eb = !1;
						break a;
					}
					na.splice(0, h);
					Eb = !0;
				}
				if (!Eb) {
					a.destination = null;
					e++;
					D.splice(0, e);
					return;
				}
			}
			D.splice(0, e);
			var oa = a.completedBoundaries;
			for (e = 0; e < oa.length; e++) if (!hd(a, b, oa[e])) {
				a.destination = null;
				e++;
				oa.splice(0, e);
				return;
			}
			oa.splice(0, e);
		} finally {
			ca(b), "function" === typeof b.flush && b.flush(), 0 === a.allPendingTasks && 0 === a.pingedTasks.length && 0 === a.clientRenderedBoundaries.length && 0 === a.completedBoundaries.length && b.end();
		}
	}
	function jd(a) {
		setImmediate(function() {
			return Qc(a);
		});
	}
	function kd(a, b) {
		if (1 === a.status) a.status = 2, b.destroy(a.fatalError);
		else if (2 !== a.status && null === a.destination) {
			a.destination = b;
			try {
				dd(a, b);
			} catch (c) {
				Y(a, c), Tc(a, c);
			}
		}
	}
	function ld(a, b) {
		try {
			var c = a.abortableTasks;
			c.forEach(function(c) {
				return cd(c, a, b);
			});
			c.clear();
			null !== a.destination && dd(a, a.destination);
		} catch (d) {
			Y(a, d), Tc(a, d);
		}
	}
	function md(a, b) {
		return function() {
			return kd(b, a);
		};
	}
	function nd(a, b) {
		return function() {
			return ld(a, b);
		};
	}
	function od(a, b) {
		var c = b ? b.identifierPrefix : void 0, d = b ? b.nonce : void 0, f = b ? b.bootstrapScriptContent : void 0, e = b ? b.bootstrapScripts : void 0;
		var g = b ? b.bootstrapModules : void 0;
		c = void 0 === c ? "" : c;
		d = void 0 === d ? ra : x("<script nonce=\"" + F(d) + "\">");
		var h = [];
		void 0 !== f && h.push(d, ("" + f).replace(wa, xa), sa);
		if (void 0 !== e) for (f = 0; f < e.length; f++) h.push(ta, F(e[f]), va);
		if (void 0 !== g) for (e = 0; e < g.length; e++) h.push(ua, F(g[e]), va);
		g = {
			bootstrapChunks: h,
			startInlineScript: d,
			placeholderPrefix: x(c + "P:"),
			segmentPrefix: x(c + "S:"),
			boundaryPrefix: c + "B:",
			idPrefix: c,
			nextSuspenseID: 0,
			sentCompleteSegmentFunction: !1,
			sentCompleteBoundaryFunction: !1,
			sentClientRenderFunction: !1
		};
		e = b ? b.namespaceURI : void 0;
		e = G("http://www.w3.org/2000/svg" === e ? 2 : "http://www.w3.org/1998/Math/MathML" === e ? 3 : 0, null);
		f = b ? b.progressiveChunkSize : void 0;
		d = b ? b.onError : void 0;
		h = b ? b.onAllReady : void 0;
		var m = b ? b.onShellReady : void 0, n = b ? b.onShellError : void 0;
		b = [];
		c = /* @__PURE__ */ new Set();
		g = {
			destination: null,
			responseState: g,
			progressiveChunkSize: void 0 === f ? 12800 : f,
			status: 0,
			fatalError: null,
			nextSegmentId: 0,
			allPendingTasks: 0,
			pendingRootTasks: 0,
			completedRootSegment: null,
			abortableTasks: c,
			pingedTasks: b,
			clientRenderedBoundaries: [],
			completedBoundaries: [],
			partialBoundaries: [],
			onError: void 0 === d ? Oc : d,
			onAllReady: void 0 === h ? X : h,
			onShellReady: void 0 === m ? X : m,
			onShellError: void 0 === n ? X : n,
			onFatalError: X
		};
		e = Sc(g, 0, null, e, !1, !1);
		e.parentFlushed = !0;
		a = Rc(g, a, null, e, c, hc, null, qc);
		b.push(a);
		return g;
	}
	exports.renderToPipeableStream = function(a, b) {
		var c = od(a, b), d = !1;
		jd(c);
		return {
			pipe: function(a) {
				if (d) throw Error("React currently only supports piping to one writable stream.");
				d = !0;
				kd(c, a);
				a.on("drain", md(a, c));
				a.on("error", nd(c, Error("The destination stream errored while writing data.")));
				a.on("close", nd(c, Error("The destination stream closed early.")));
				return a;
			},
			abort: function(a) {
				ld(c, a);
			}
		};
	};
	exports.version = "18.3.1";
}));
// node_modules/isbot/index.mjs
var import_server_node = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports) => {
	var l = require_react_dom_server_legacy_node_production_min();
	var s = require_react_dom_server_node_production_min();
	exports.version = l.version;
	exports.renderToString = l.renderToString;
	exports.renderToStaticMarkup = l.renderToStaticMarkup;
	exports.renderToNodeStream = l.renderToNodeStream;
	exports.renderToStaticNodeStream = l.renderToStaticNodeStream;
	exports.renderToPipeableStream = s.renderToPipeableStream;
})))(), 1);
var fullPattern = " daum[ /]| deusu/|(?:^|[^g])news(?!sapphire)|(?<! channel/|google/)google(?!(?:wv|app|/google| pixel))|(?<! cu)bots?(?:\\b|_)|(?<!cam)scan|(?<!lib)http|24x7|;\\s\\w+;$|@[a-z][\\w-]+\\.|\\(\\)|\\.com\\b|\\b\\w+/1\\.0;|\\bbw/|\\bdlc\\b|\\bort/|\\bperl\\b|\\btime/|\\||^[<\\(;]|^[\\w \\.\\-\\(?:\\):%]+(?:/v?\\d+(?:\\.\\d+)?(?:\\.\\d{1,10})*?)?(?:,|$)|^[\\w\\-]+/[\\w]+$|^[^ ]{50,}$|^\\d+\\b|^\\w*search\\b|^\\w+/[\\w\\(\\)]*$|^\\w+/\\d\\.\\d\\s\\([\\w@]+\\)$|^active|^ad muncher|^amaya|^apache/|^avsdevicesdk/|^azure|^biglotron|^blackbox exporter|^bot|^clamav[ /]|^claude-code/|^client/|^cobweb/|^custom|^ddg[_-]android|^discourse|^dispatch/\\d|^downcast/|^duckduckgo|^email|^exodusmovement|^facebook|^getright/|^gozilla/|^hobbit|^hotzonu|^hwcdn/|^igetter/|^jeode/|^jetty/|^jigsaw|^microsoft bits|^movabletype|^mozilla/\\d\\.\\d\\s[\\w\\.-]+$|^mozilla/\\d\\.\\d\\s\\((?:compatible;)?(?:\\s?[\\w\\d-.]+\\/\\d+\\.\\d+)?\\)$|^navermailapp|^netsurf|^offline|^openai/|^owler|^php|^postman|^ps_daily/|^python|^rank|^read|^reed|^remove\\.bg/|^rest|^rss|^snapchat|^sora |^space bison|^stape/|^svn|^swcd |^taringa|^thumbor/|^track|^w3c|^webbandit/|^webcopier|^wget|^whatsapp|^wordpress|^xenu link sleuth|^yahoo|^yandex|^zdm/\\d|^zoom marketplace/|abuse|advisor|agent\\b|analyzer|archive|ask jeeves/teoma|attracta|audit|bluecoat drtr|browsex|burpcollaborator|capture|catch|check\\b|checker|chrome-lighthouse|chromeframe|classifier|cloudflare|collapsify\\b|convertify|cookiehubverify/|crawl|cursor/|cypress/|dareboost|datanyze|dejaclick|detect|discovery|dmbrowser|download|exaleadcloudview|feed|firephp|foregenix|functionize|grab|hardenize\\b|headless|hotjar|httrack|hubspot marketing grader|ibisbrowser|infrawatch|insight|inspect|iplabel|java(?!;)|library|linkcheck|linktiger|mail\\.ru/|manager|manus-user/|marketgoo/|measure|monitor\\b|neustar wpm|node\\b|nutch|offbyone|openvas|optimize|pageburst|pagespeed|parser|phantomjs|pingdom|playwright|powermarks|preview|productfinder|prospectingstudio|proxy|ptst[ /]\\d|radar|readable/|retriever|rexx;|rigor|rss\\b|scrape|securityheaders|selenium|server|silktide|sindup/|sogou|sparkler/|speedcurve|spider|splash|statuscake|supercleaner|synapse|synthetic|testlocally|tools|torrent|transcoder|url|validator|virtuoso|wappalyzer|watchtowr|webglance|webkit2png|whatcms/|xtate/";
var naivePattern = /bot|crawl|http|lighthouse|scan|search|spider/i;
var pattern;
function getPattern() {
	if (pattern instanceof RegExp) return pattern;
	try {
		pattern = new RegExp(fullPattern, "i");
	} catch (error) {
		pattern = naivePattern;
	}
	return pattern;
}
var isNonEmptyString = (value) => typeof value === "string" && value !== "";
function isBot(userAgent) {
	return isNonEmptyString(userAgent) && getPattern().test(userAgent);
}
var isbot = isBot;
// node_modules/@tanstack/react-router/dist/esm/ssr/renderRouterToStream.js
var renderRouterToStream = async ({ request, router, responseHeaders, children }) => {
	const signal = request.signal;
	if (signal.aborted) {
		router.serverSsr?.cleanup();
		throw signal.reason;
	}
	let rendererTeardown = false;
	const bot = isbot(request.headers.get("User-Agent"));
	const onError = (renderer) => (error, info) => {
		if (!rendererTeardown && !signal.aborted) console.error(`Error in ${renderer}:`, error, info);
	};
	try {
		if (typeof import_server_node.default.renderToReadableStream === "function") {
			const stream = await import_server_node.default.renderToReadableStream(children, {
				signal,
				nonce: router.options.ssr?.nonce,
				progressiveChunkSize: Number.POSITIVE_INFINITY,
				onError: onError("renderToReadableStream")
			});
			const rendererAbort = bot ? new AbortController() : void 0;
			const responseStream = transformReadableStreamWithRouter(router, stream, {
				rendererSafePoint: "script-close",
				signal,
				onAbort: (reason) => {
					rendererTeardown = true;
					rendererAbort?.abort(reason);
				}
			});
			if (rendererAbort) await waitForReason(stream.allReady, rendererAbort.signal);
			return createSsrStreamResponse(router, new Response(responseStream, {
				status: getSsrStatus(router),
				headers: responseHeaders
			}));
		}
		if (typeof import_server_node.renderToPipeableStream === "function") {
			const reactAppPassthrough = new PassThrough();
			let pipeable;
			let resolveReady;
			const ready = new Promise((resolve) => {
				resolveReady = resolve;
			});
			const rendererAbort = new AbortController();
			const abortPipeable = (reason) => {
				if (rendererTeardown) return;
				rendererTeardown = true;
				rendererAbort.abort(reason);
				try {
					pipeable?.abort(reason);
				} catch {}
			};
			try {
				pipeable = import_server_node.renderToPipeableStream(children, {
					nonce: router.options.ssr?.nonce,
					progressiveChunkSize: Number.POSITIVE_INFINITY,
					...bot ? { onAllReady: resolveReady } : { onShellReady: resolveReady },
					onError: onError("renderToPipeableStream"),
					onShellError: (error) => rendererAbort.abort(error)
				});
				const responseStream = transformReadableStreamWithRouter(router, Readable.toWeb(reactAppPassthrough), {
					rendererSafePoint: "script-close",
					signal,
					onAbort: abortPipeable
				});
				await waitForReason(ready, rendererAbort.signal);
				pipeable.pipe(reactAppPassthrough);
				return createSsrStreamResponse(router, new Response(responseStream, {
					status: getSsrStatus(router),
					headers: responseHeaders
				}));
			} catch (error) {
				abortPipeable(error);
				throw error;
			}
		}
		throw new Error("No renderToReadableStream or renderToPipeableStream found in react-dom/server. Ensure you are using a version of react-dom that supports streaming.");
	} catch (error) {
		router.serverSsr?.cleanup();
		throw error;
	}
};
export { GLOBAL_TSR, HeadContent, Outlet, RouterProvider, Scripts, _getRenderedMatches, bindSsrResponseToRequest, createFileRoute, createHydrationScripts, createInlineCssPlaceholderAsset, createInlineCssStyleAsset, createPlugin, createRootRoute, createRouter, createSieveCache, createStream, crossSerializeStream, decodePath, defineHandlerCallback, dehydrateSsrMatchId, disposeSsrResponse, fromJSON, getScriptPreloadAttrs, getStylesheetHref, invariant, isDangerousProtocol, isNotFound, isPromise, isRedirect, isSsrResponse, isStream, lazyRouteComponent, normalizeSsrResponse, parseRedirect, renderRouterToStream, resolveManifestAssetLink, resolveManifestCssLink, rootRouteId, stripSsrResponseBody, toCrossJSONAsync, toCrossJSONStream, waitForReason };
