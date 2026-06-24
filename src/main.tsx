import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Force HTTPS: redirect any http:// load to https:// (skip localhost for development).
if (
  typeof window !== "undefined" &&
  window.location.protocol === "http:" &&
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1"
) {
  window.location.replace(
    "https:" + window.location.href.substring(window.location.protocol.length)
  );
}

// Register service worker for PWA – only in production.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  import("virtual:pwa-register").then(({ registerSW }) => {
    registerSW({ immediate: true });
  });
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);