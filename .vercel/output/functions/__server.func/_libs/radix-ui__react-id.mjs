import { __toESM } from "../_runtime.mjs";
import { require_react } from "./@floating-ui/react-dom+[...].mjs";
import { useLayoutEffect2 } from "./@radix-ui/react-collection+[...].mjs";
// node_modules/@radix-ui/react-id/dist/index.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", {
	value,
	configurable: true
});
var useReactId = import_react[" useId ".trim().toString()] || (() => void 0);
var count = 0;
function useId(deterministicId) {
	const [id, setId] = import_react.useState(useReactId());
	useLayoutEffect2(() => {
		if (!deterministicId) setId((reactId) => reactId ?? String(count++));
	}, [deterministicId]);
	return deterministicId || (id ? `radix-${id}` : "");
}
__name(useId, "useId");
export { useId };
