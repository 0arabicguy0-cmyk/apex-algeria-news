import { require_jsx_runtime } from "./_libs/@radix-ui/react-collection+[...].mjs";
import { App } from "./_ssr/App-Bw3RW8eF.mjs";
import { Route } from "./_ssr/router-Cw5QR3qB.mjs";
// node_modules/.nitro/vite/services/ssr/assets/_-CizLo0i1.js
var import_jsx_runtime = require_jsx_runtime();
function LegacyPage() {
	const { _splat } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, { initialPath: `/${_splat ?? ""}` });
}
export { LegacyPage as component };
