CREATE TABLE public.dialogues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  guest_name text NOT NULL DEFAULT '',
  guest_title text NOT NULL DEFAULT '',
  interviewer text NOT NULL DEFAULT '',
  excerpt text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  image_url text,
  status text NOT NULL DEFAULT 'draft',
  is_featured boolean NOT NULL DEFAULT false,
  tags text[] NOT NULL DEFAULT '{}'::text[],
  view_count integer NOT NULL DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.dialogues TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dialogues TO anon;
GRANT ALL ON public.dialogues TO service_role;

ALTER TABLE public.dialogues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published dialogues"
  ON public.dialogues FOR SELECT USING (status = 'published');

CREATE POLICY "Public can manage dialogues"
  ON public.dialogues FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER update_dialogues_updated_at
  BEFORE UPDATE ON public.dialogues
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();