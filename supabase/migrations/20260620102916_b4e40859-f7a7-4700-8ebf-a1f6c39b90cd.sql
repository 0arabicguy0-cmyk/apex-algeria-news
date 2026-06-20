
-- 1) Storage: allow real public read on article-images bucket
DROP POLICY IF EXISTS "Anyone can view article images" ON storage.objects;
CREATE POLICY "Public can view article images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'article-images');

-- 2) push_subscriptions: remove permissive INSERT/DELETE; rely on edge functions (service role)
DROP POLICY IF EXISTS "Anyone can remove their endpoint" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Anyone can subscribe a device" ON public.push_subscriptions;

-- 3) has_role: keep callable by authenticated (needed by RLS), revoke from anon/public
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
