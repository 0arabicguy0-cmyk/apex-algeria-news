create table public.corrections_log (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles(id) on delete set null,
  article_title text not null,
  correction text not null,
  original_text text,
  corrected_at timestamptz not null default now(),
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.corrections_log enable row level security;

create policy "Anyone can read published corrections"
  on public.corrections_log for select
  to public
  using (is_published = true);

create policy "Admins can manage corrections"
  on public.corrections_log for all
  to authenticated
  using (has_role(auth.uid(), 'admin'::app_role))
  with check (has_role(auth.uid(), 'admin'::app_role));

create index corrections_log_corrected_at_idx on public.corrections_log (corrected_at desc);