-- 1. ad_submissions: hide sensitive columns from the public, admin-only management
DROP POLICY IF EXISTS "Public can read ad submissions" ON public.ad_submissions;
DROP POLICY IF EXISTS "Public can update ad submissions" ON public.ad_submissions;
DROP POLICY IF EXISTS "Public can delete ad submissions" ON public.ad_submissions;
DROP POLICY IF EXISTS "Public can read approved active ads" ON public.ad_submissions;

CREATE POLICY "Anon can read approved active ads"
  ON public.ad_submissions FOR SELECT TO anon
  USING (status = 'approved' AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Admins can read all ad submissions"
  ON public.ad_submissions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update ad submissions"
  ON public.ad_submissions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete ad submissions"
  ON public.ad_submissions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Column-level privileges: anon may only read display-safe columns
REVOKE ALL ON public.ad_submissions FROM anon;
GRANT INSERT ON public.ad_submissions TO anon;
GRANT SELECT (id, advertiser_name, product_title, product_description,
              product_image_url, product_url, status, approved_at,
              expires_at, created_at)
  ON public.ad_submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ad_submissions TO authenticated;
GRANT ALL ON public.ad_submissions TO service_role;

-- 2. ad-uploads: constrain anonymous receipt uploads to a fixed prefix and file types
DROP POLICY IF EXISTS "Anyone can upload ad files" ON storage.objects;

CREATE POLICY "Public can upload ad receipts only"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (
    bucket_id = 'ad-uploads'
    AND (storage.foldername(name))[1] = 'receipts'
    AND lower(name) ~ '\.(png|jpg|jpeg|webp|pdf)$'
  );

-- 3. fcm_tokens: no anonymous mutations (edge functions use the service role)
DROP POLICY IF EXISTS "Owner or anon can update by token match" ON public.fcm_tokens;
DROP POLICY IF EXISTS "Owner or anon can delete by token match" ON public.fcm_tokens;

CREATE POLICY "Owners can update their tokens"
  ON public.fcm_tokens FOR UPDATE TO authenticated
  USING (user_id IS NOT NULL AND user_id = auth.uid())
  WITH CHECK (user_id IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Owners can delete their tokens"
  ON public.fcm_tokens FOR DELETE TO authenticated
  USING (user_id IS NOT NULL AND user_id = auth.uid());

REVOKE UPDATE, DELETE ON public.fcm_tokens FROM anon;

-- 4. article-images: remove bucket-wide listing (public URLs still work)
DROP POLICY IF EXISTS "Public can view article images" ON storage.objects;