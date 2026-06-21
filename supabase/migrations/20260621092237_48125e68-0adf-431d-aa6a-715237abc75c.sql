
-- Table
CREATE TABLE public.ad_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  product_title TEXT NOT NULL,
  product_description TEXT NOT NULL DEFAULT '',
  product_url TEXT,
  product_image_url TEXT NOT NULL,
  payment_receipt_url TEXT NOT NULL,
  ccp_reference TEXT NOT NULL,
  amount_dzd INTEGER NOT NULL DEFAULT 0,
  duration_days INTEGER NOT NULL DEFAULT 7,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_note TEXT,
  approved_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  view_count INTEGER NOT NULL DEFAULT 0,
  click_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT ad_submissions_status_chk CHECK (status IN ('pending','approved','rejected','expired')),
  CONSTRAINT ad_submissions_title_len CHECK (char_length(product_title) BETWEEN 2 AND 200),
  CONSTRAINT ad_submissions_email_chk CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT ad_submissions_ccp_len CHECK (char_length(ccp_reference) BETWEEN 3 AND 64),
  CONSTRAINT ad_submissions_duration_chk CHECK (duration_days BETWEEN 1 AND 365)
);

-- Grants
GRANT SELECT, INSERT ON public.ad_submissions TO anon, authenticated;
GRANT ALL ON public.ad_submissions TO service_role;

-- RLS
ALTER TABLE public.ad_submissions ENABLE ROW LEVEL SECURITY;

-- Public read: only approved + still active ads, and only safe columns are surfaced via a view (clients select explicit columns)
CREATE POLICY "Public can read approved active ads"
  ON public.ad_submissions
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved' AND (expires_at IS NULL OR expires_at > now()));

-- Admins can read everything
CREATE POLICY "Admins can read all ad submissions"
  ON public.ad_submissions
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Anyone can submit (insert) with validated content
CREATE POLICY "Anyone can submit an ad"
  ON public.ad_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND char_length(advertiser_name) BETWEEN 2 AND 120
    AND char_length(product_image_url) BETWEEN 8 AND 2048
    AND char_length(payment_receipt_url) BETWEEN 8 AND 2048
  );

-- Admins can update / delete
CREATE POLICY "Admins can update ad submissions"
  ON public.ad_submissions
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete ad submissions"
  ON public.ad_submissions
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE TRIGGER ad_submissions_set_updated_at
  BEFORE UPDATE ON public.ad_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Helpful index for the rotating banner query
CREATE INDEX ad_submissions_active_idx
  ON public.ad_submissions (status, expires_at)
  WHERE status = 'approved';

-- Storage policies for ad-uploads (private bucket: receipts)
-- Anyone can upload to this bucket (so guests can submit receipts)
CREATE POLICY "Anyone can upload ad files"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'ad-uploads');

-- Only admins can read files in ad-uploads
CREATE POLICY "Admins can read ad files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'ad-uploads' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete ad files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'ad-uploads' AND public.has_role(auth.uid(), 'admin'));
