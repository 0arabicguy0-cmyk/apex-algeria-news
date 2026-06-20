
-- article_views
DROP POLICY IF EXISTS "Anyone can insert article views" ON public.article_views;
CREATE POLICY "Anyone can insert article views"
  ON public.article_views FOR INSERT
  TO public
  WITH CHECK (article_id IS NOT NULL);

-- article_reactions
DROP POLICY IF EXISTS "Anyone can add reactions" ON public.article_reactions;
CREATE POLICY "Anyone can add reactions"
  ON public.article_reactions FOR INSERT
  TO public
  WITH CHECK (
    article_id IS NOT NULL
    AND length(reaction) BETWEEN 1 AND 32
  );

-- fcm_tokens
DROP POLICY IF EXISTS "Anyone can insert a token" ON public.fcm_tokens;
CREATE POLICY "Anyone can insert a token"
  ON public.fcm_tokens FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(token) BETWEEN 20 AND 4096
    AND (user_id IS NULL OR user_id = auth.uid())
  );

-- newsletter_subscribers
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_subscribers FOR INSERT
  TO public
  WITH CHECK (
    length(email) BETWEEN 5 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );
