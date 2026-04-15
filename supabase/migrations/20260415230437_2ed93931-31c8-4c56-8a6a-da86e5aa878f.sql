-- Fix permissive INSERT policy on feedback_messages
DROP POLICY "Anyone can submit feedback" ON public.feedback_messages;
CREATE POLICY "Anyone can submit feedback"
  ON public.feedback_messages FOR INSERT
  WITH CHECK (
    length(name) > 0 AND length(name) <= 100
    AND length(email) > 0 AND length(email) <= 255
    AND length(message) > 0 AND length(message) <= 1000
  );

-- Fix public bucket listing: restrict SELECT to specific objects only
DROP POLICY "Anyone can view article images" ON storage.objects;
CREATE POLICY "Anyone can view article images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'article-images' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));