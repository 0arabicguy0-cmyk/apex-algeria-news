
-- Allow anon/authenticated to upload, update, delete article images (admin auth happens client-side via env credentials)
DROP POLICY IF EXISTS "Admins can upload article images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update article images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete article images" ON storage.objects;

CREATE POLICY "Anyone can upload article images"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'article-images');

CREATE POLICY "Anyone can update article images"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'article-images');

CREATE POLICY "Anyone can delete article images"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'article-images');
