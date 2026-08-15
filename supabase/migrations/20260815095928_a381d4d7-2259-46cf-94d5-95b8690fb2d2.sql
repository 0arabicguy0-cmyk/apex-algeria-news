CREATE TABLE IF NOT EXISTS public.admin_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS admin_accounts_username_lower_idx ON public.admin_accounts (lower(username));

GRANT SELECT, UPDATE ON public.admin_accounts TO authenticated;
GRANT ALL ON public.admin_accounts TO service_role;

ALTER TABLE public.admin_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read their own admin account" ON public.admin_accounts;
CREATE POLICY "Admins can read their own admin account"
ON public.admin_accounts FOR SELECT TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can update their own admin account" ON public.admin_accounts;
CREATE POLICY "Admins can update their own admin account"
ON public.admin_accounts FOR UPDATE TO authenticated
USING (user_id = auth.uid() AND public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (user_id = auth.uid() AND public.has_role(auth.uid(), 'admin'::public.app_role));

DROP TRIGGER IF EXISTS trg_admin_accounts_updated_at ON public.admin_accounts;
CREATE TRIGGER trg_admin_accounts_updated_at
BEFORE UPDATE ON public.admin_accounts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Validate username shape on write
CREATE OR REPLACE FUNCTION public.validate_admin_username()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.username := btrim(NEW.username);
  IF char_length(NEW.username) < 3 OR char_length(NEW.username) > 32 THEN
    RAISE EXCEPTION 'Username must be between 3 and 32 characters';
  END IF;
  IF NEW.username !~ '^[A-Za-z0-9._-]+$' THEN
    RAISE EXCEPTION 'Username may only contain letters, numbers, dot, dash and underscore';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_admin_accounts_validate ON public.admin_accounts;
CREATE TRIGGER trg_admin_accounts_validate
BEFORE INSERT OR UPDATE ON public.admin_accounts
FOR EACH ROW EXECUTE FUNCTION public.validate_admin_username();

-- Secure username -> auth email resolution (admins only, no other auth data exposed)
CREATE OR REPLACE FUNCTION public.resolve_admin_login(_username text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.email::text
  FROM public.admin_accounts a
  JOIN auth.users u ON u.id = a.user_id
  JOIN public.user_roles r ON r.user_id = a.user_id AND r.role = 'admin'::public.app_role
  WHERE lower(a.username) = lower(btrim(_username))
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.resolve_admin_login(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.resolve_admin_login(text) TO anon, authenticated;

-- admin_exists now reflects a provisioned admin account
CREATE OR REPLACE FUNCTION public.admin_exists()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_accounts a
    JOIN public.user_roles r ON r.user_id = a.user_id AND r.role = 'admin'::public.app_role
  );
$$;

REVOKE ALL ON FUNCTION public.admin_exists() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_exists() TO anon, authenticated;

-- Provision the username for the existing admin user(s)
INSERT INTO public.admin_accounts (user_id, username)
SELECT r.user_id, 'admin'
FROM public.user_roles r
WHERE r.role = 'admin'::public.app_role
ORDER BY r.user_id
LIMIT 1
ON CONFLICT (user_id) DO NOTHING;