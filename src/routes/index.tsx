import { createFileRoute } from "@tanstack/react-router";
import App from "../App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ property: "og:url", content: "https://apex-algeria-news.lovable.app/" }],
    links: [{ rel: "canonical", href: "https://apex-algeria-news.lovable.app/" }],
  }),
  component: App,
});