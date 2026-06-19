---
name: Site features
description: Full feature inventory — search, bookmarks, comments, reactions, newsletter, TOC, reading progress, audio (Web Speech API), AI translation (translate-article edge function), trending, topic pages, rotating breaking ticker, admin panels
type: feature
---
- Reader is guest-only (no signup). Bookmarks via localStorage `apex:bookmarks`.
- View tracking: `article_views` insert + trigger increments `articles.view_count`. De-duped per session via `sessionStorage`.
- Reactions: 5 emojis (like/love/insightful/sad/angry), one per browser via localStorage `reaction:{id}`.
- Comments: anonymous submit → `pending`, admin approves to `approved`.
- Newsletter: email-only, unique constraint, admin can export CSV.
- TOC: built from `## ` prefixed paragraphs in article body. Editor doesn't enforce — markdown-style.
- Audio: browser Web Speech API (`ar-SA`). No server cost.
- Translation: `translate-article` edge function calls AI (`google/gemini-2.5-flash`) → JSON `{title, body}`. Targets fr/en.
- Trending sidebar uses `view_count DESC`. Featured hero uses `is_featured=true` then falls back to newest.
- Rotating breaking ticker: `breaking_news_items` table, 5s rotation. Admin manages from `/admin/breaking`.
- Routes: `/`, `/article/:id`, `/topic/:key`, `/search`, `/bookmarks`, `/contact`, `/admin/*`.
- Admin nav: articles, breaking, comments, newsletter, feedback.
