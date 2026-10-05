# Migrate MAX NEWS to TanStack Start

## Goal
Move the current React/Vite site to TanStack Start without changing its design, public URLs, admin workflows, Lovable Cloud data, or push-notification behavior. Article pages will render their title, description, and article photo in the initial HTML so Facebook can create the correct link preview.

## Work
1. Replace the Classic Vite entry points with TanStack Start configuration and root document structure.
2. Recreate all public, legal, search, topic, author, article, login, and nested admin routes with TanStack Router while preserving current URLs.
3. Keep `/{short_code}` as the canonical article URL and retain `/article/{uuid}` as a redirect to it.
4. Add a server-side article loader that fetches the published article before rendering and emits self-referencing canonical, Open Graph, Twitter, and NewsArticle metadata using the article photo.
5. Keep browser-only behavior—including theme/language storage, splash screen, notifications, service workers, clipboard, and browser navigation—behind client-safe boundaries.
6. Preserve the existing shared layout, query cache, tooltips, toasts, mobile navigation, fixed admin sidebar, and admin authorization behavior.
7. Reconfigure PWA assets and service-worker registration for the new build pipeline without changing notification behavior.
8. Remove obsolete Classic entry/configuration only after the new app builds successfully.
9. Verify the homepage, a short-code article URL, its initial HTML metadata, the legacy UUID redirect, and representative admin/public routes.

## Technical details
- Use TanStack Start file-based routes and TanStack Router navigation APIs.
- Use route loaders/head metadata for SSR; do not rely on client-side Helmet for article share metadata.
- Keep Lovable Cloud access through the generated client and never expose privileged keys.
- Preserve the existing Tailwind tokens and components; this is a framework migration, not a redesign.
