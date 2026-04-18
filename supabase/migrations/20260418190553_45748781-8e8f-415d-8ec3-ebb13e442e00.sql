
-- 1. Extend articles table
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_articles_tags ON public.articles USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_articles_view_count ON public.articles(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category_key ON public.articles(category_key);
CREATE INDEX IF NOT EXISTS idx_articles_status_published ON public.articles(status, published_at DESC);

-- 2. Article views (tracking)
CREATE TABLE IF NOT EXISTS public.article_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_article_views_article ON public.article_views(article_id, created_at DESC);

ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert article views"
  ON public.article_views FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read article views"
  ON public.article_views FOR SELECT TO public
  USING (true);

CREATE POLICY "Admins can manage article views"
  ON public.article_views FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger to increment view_count on articles
CREATE OR REPLACE FUNCTION public.increment_article_view_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.articles
  SET view_count = view_count + 1
  WHERE id = NEW.article_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_increment_view_count ON public.article_views;
CREATE TRIGGER trg_increment_view_count
AFTER INSERT ON public.article_views
FOR EACH ROW EXECUTE FUNCTION public.increment_article_view_count();

-- 3. Article reactions
CREATE TABLE IF NOT EXISTS public.article_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  reaction text NOT NULL CHECK (reaction IN ('like','love','insightful','sad','angry')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_article_reactions_article ON public.article_reactions(article_id);

ALTER TABLE public.article_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reactions"
  ON public.article_reactions FOR SELECT TO public
  USING (true);

CREATE POLICY "Anyone can add reactions"
  ON public.article_reactions FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Admins can manage reactions"
  ON public.article_reactions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Article comments
CREATE TABLE IF NOT EXISTS public.article_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  name text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','hidden')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT comment_name_len CHECK (length(name) BETWEEN 1 AND 80),
  CONSTRAINT comment_message_len CHECK (length(message) BETWEEN 1 AND 1000)
);
CREATE INDEX IF NOT EXISTS idx_comments_article_status ON public.article_comments(article_id, status, created_at DESC);

ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read approved comments"
  ON public.article_comments FOR SELECT TO public
  USING (status = 'approved');

CREATE POLICY "Anyone can submit comments"
  ON public.article_comments FOR INSERT TO public
  WITH CHECK (status = 'pending');

CREATE POLICY "Admins can manage comments"
  ON public.article_comments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Newsletter subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT subscriber_email_len CHECK (length(email) BETWEEN 3 AND 255)
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_subscribers FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view subscribers"
  ON public.newsletter_subscribers FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete subscribers"
  ON public.newsletter_subscribers FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 6. Breaking news items (rotating ticker)
CREATE TABLE IF NOT EXISTS public.breaking_news_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  link_article_id uuid REFERENCES public.articles(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT breaking_text_len CHECK (length(text) BETWEEN 1 AND 280)
);
CREATE INDEX IF NOT EXISTS idx_breaking_active_order ON public.breaking_news_items(is_active, display_order);

ALTER TABLE public.breaking_news_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active breaking news"
  ON public.breaking_news_items FOR SELECT TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage breaking news"
  ON public.breaking_news_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
