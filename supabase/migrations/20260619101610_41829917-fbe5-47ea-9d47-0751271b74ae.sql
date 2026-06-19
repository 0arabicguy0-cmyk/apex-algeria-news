CREATE TABLE public.fcm_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  enabled boolean NOT NULL DEFAULT true,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.fcm_tokens TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fcm_tokens TO anon;
GRANT ALL ON public.fcm_tokens TO service_role;

ALTER TABLE public.fcm_tokens ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous visitors) can register/update their own token.
-- Dedup is enforced by the UNIQUE(token) constraint; the edge function upserts on conflict.
CREATE POLICY "Anyone can insert a token"
  ON public.fcm_tokens FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Owner or anon can update by token match"
  ON public.fcm_tokens FOR UPDATE
  TO anon, authenticated
  USING (user_id IS NULL OR user_id = auth.uid())
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Owner or anon can delete by token match"
  ON public.fcm_tokens FOR DELETE
  TO anon, authenticated
  USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Admins can view all tokens"
  ON public.fcm_tokens FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_fcm_tokens_updated_at
  BEFORE UPDATE ON public.fcm_tokens
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_fcm_tokens_enabled ON public.fcm_tokens(enabled) WHERE enabled = true;