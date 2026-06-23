
DROP POLICY IF EXISTS "Admins can manage all articles" ON public.articles;
DROP POLICY IF EXISTS "Admins can manage breaking news" ON public.breaking_news_items;
DROP POLICY IF EXISTS "Admins can read all ad submissions" ON public.ad_submissions;
DROP POLICY IF EXISTS "Admins can update ad submissions" ON public.ad_submissions;
DROP POLICY IF EXISTS "Admins can delete ad submissions" ON public.ad_submissions;
DROP POLICY IF EXISTS "Admins can manage corrections" ON public.corrections_log;
DROP POLICY IF EXISTS "Admins can read feedback" ON public.feedback_messages;
DROP POLICY IF EXISTS "Admins can delete feedback" ON public.feedback_messages;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.breaking_news_items TO anon;
GRANT SELECT, UPDATE, DELETE ON public.ad_submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.corrections_log TO anon;
GRANT SELECT, UPDATE, DELETE ON public.feedback_messages TO anon;

CREATE POLICY "Public can manage articles" ON public.articles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can manage breaking news" ON public.breaking_news_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can read ad submissions" ON public.ad_submissions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can update ad submissions" ON public.ad_submissions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can delete ad submissions" ON public.ad_submissions FOR DELETE TO anon, authenticated USING (true);
CREATE POLICY "Public can manage corrections" ON public.corrections_log FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can read feedback" ON public.feedback_messages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can delete feedback" ON public.feedback_messages FOR DELETE TO anon, authenticated USING (true);
