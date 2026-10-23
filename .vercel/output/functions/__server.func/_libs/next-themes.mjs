import { __toESM } from "../_runtime.mjs";
import { require_react } from "./@floating-ui/react-dom+[...].mjs";
// node_modules/next-themes/dist/index.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var P = ["light", "dark"];
var E = "(prefers-color-scheme: dark)";
var L = import_react.createContext(void 0);
var D = {
	setTheme: (e) => {},
	themes: []
};
var j = () => {
	var e;
	return (e = import_react.useContext(L)) != null ? e : D;
};
import_react.memo(({ forcedTheme: e, storageKey: a, attribute: n, enableSystem: g, enableColorScheme: m, defaultTheme: c, value: o, attrs: y, nonce: h }) => {
	let k = c === "system", w = n === "class" ? `var d=document.documentElement,c=d.classList;${`c.remove(${y.map((u) => `'${u}'`).join(",")})`};` : `var d=document.documentElement,n='${n}',s='setAttribute';`, i = m ? (P.includes(c) ? c : null) ? `if(e==='light'||e==='dark'||!e)d.style.colorScheme=e||'${c}'` : "if(e==='light'||e==='dark')d.style.colorScheme=e" : "", d = (l, u = !1, R = !0) => {
		let f = o ? o[l] : l, p = u ? l + "|| ''" : `'${f}'`, $ = "";
		return m && R && !u && P.includes(l) && ($ += `d.style.colorScheme = '${l}';`), n === "class" ? u || f ? $ += `c.add(${p})` : $ += "null" : f && ($ += `d[s](n,${p})`), $;
	}, S = e ? `!function(){${w}${d(e)}}()` : g ? `!function(){try{${w}var e=localStorage.getItem('${a}');if('system'===e||(!e&&${k})){var t='${E}',m=window.matchMedia(t);if(m.media!==t||m.matches){${d("dark")}}else{${d("light")}}}else if(e){${o ? `var x=${JSON.stringify(o)};` : ""}${d(o ? "x[e]" : "e", !0)}}${k ? "" : "else{" + d(c, !1, !1) + "}"}${i}}catch(e){}}()` : `!function(){try{${w}var e=localStorage.getItem('${a}');if(e){${o ? `var x=${JSON.stringify(o)};` : ""}${d(o ? "x[e]" : "e", !0)}}else{${d(c, !1, !1)};}${i}}catch(t){}}();`;
	return import_react.createElement("script", {
		nonce: h,
		dangerouslySetInnerHTML: { __html: S }
	});
});
export { j };
