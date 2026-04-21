
CREATE TABLE public.push_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe a device"
  ON public.push_subscriptions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can remove their endpoint"
  ON public.push_subscriptions
  FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Admins can view subscriptions"
  ON public.push_subscriptions
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
