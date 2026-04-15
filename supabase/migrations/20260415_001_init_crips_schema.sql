-- CRIPS marketplace / cabinet schema (Supabase Postgres)
-- Execute in Supabase SQL Editor (or via MCP execute_sql once authenticated).

begin;

create extension if not exists pgcrypto;

create schema if not exists private;

-- ------------------------------------------------------------
-- Utility: updated_at trigger
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------
-- User profiles (linked to auth.users)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  role text not null default 'staff' check (role in ('admin', 'staff', 'therapist')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Utility: admin check (based on profile role)
-- ------------------------------------------------------------
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

-- ------------------------------------------------------------
-- Blog content
-- ------------------------------------------------------------
create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null default '',
  image_url text not null,
  category_id uuid references public.blog_categories(id) on delete set null,
  category_name text not null, -- fallback label used by UI
  author_name text not null,
  author_avatar_url text not null,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_blog_posts_updated_at on public.blog_posts;
create trigger trg_blog_posts_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

create index if not exists idx_blog_posts_status_published_at
  on public.blog_posts(status, published_at desc);
create index if not exists idx_blog_posts_category_id
  on public.blog_posts(category_id);

-- ------------------------------------------------------------
-- Media library
-- ------------------------------------------------------------
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  public_url text not null,
  bucket text default 'cms',
  alt_text text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_media_assets_created_at
  on public.media_assets(created_at desc);

-- ------------------------------------------------------------
-- Contact / consultation requests
-- ------------------------------------------------------------
create table if not exists public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  message text not null,
  preferred_contact text default 'phone' check (preferred_contact in ('phone', 'email', 'whatsapp')),
  source_page text default 'home',
  status text not null default 'new' check (status in ('new', 'in_progress', 'booked', 'closed', 'spam')),
  assigned_to uuid references public.profiles(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_consultation_requests_updated_at on public.consultation_requests;
create trigger trg_consultation_requests_updated_at
before update on public.consultation_requests
for each row execute function public.set_updated_at();

create index if not exists idx_consultation_requests_status_created_at
  on public.consultation_requests(status, created_at desc);

-- ------------------------------------------------------------
-- Newsletter subscriptions
-- ------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text,
  status text not null default 'subscribed' check (status in ('subscribed', 'unsubscribed')),
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

-- ------------------------------------------------------------
-- Analytics
-- ------------------------------------------------------------
create table if not exists public.page_view_events (
  id bigserial primary key,
  page text not null check (page in ('home', 'blog', 'blog_post', 'admin')),
  path text not null,
  referrer text,
  user_agent text,
  ip inet,
  viewed_at timestamptz not null default now()
);

create index if not exists idx_page_view_events_page_viewed_at
  on public.page_view_events(page, viewed_at desc);

create table if not exists public.blog_post_view_events (
  id bigserial primary key,
  post_id uuid references public.blog_posts(id) on delete cascade,
  post_slug text not null,
  referrer text,
  user_agent text,
  ip inet,
  viewed_at timestamptz not null default now()
);

create index if not exists idx_blog_post_view_events_slug_viewed_at
  on public.blog_post_view_events(post_slug, viewed_at desc);

-- ------------------------------------------------------------
-- Site settings (simple key/value JSON)
-- ------------------------------------------------------------
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_site_settings_updated_at on public.site_settings;
create trigger trg_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Seed minimal categories and settings
-- ------------------------------------------------------------
insert into public.blog_categories (slug, name, description)
values
  ('bien-etre', 'Bien-être', 'Conseils pratiques de mieux-être'),
  ('consultation', 'Consultation', 'Informations sur les consultations'),
  ('ressources', 'Ressources', 'Ressources psychologiques')
on conflict (slug) do nothing;

insert into public.site_settings(key, value)
values
  ('brand', '{"name":"CRIPS","phone":"0818787174","email":"benmak265@gmail.com"}'::jsonb),
  ('social', '{"instagram":"https://instagram.com","whatsapp":"https://wa.me/243818787174","tiktok":"https://tiktok.com"}'::jsonb)
on conflict (key) do nothing;

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.media_assets enable row level security;
alter table public.consultation_requests enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.page_view_events enable row level security;
alter table public.blog_post_view_events enable row level security;
alter table public.site_settings enable row level security;

-- PROFILES
drop policy if exists profiles_select_self_or_admin on public.profiles;
create policy profiles_select_self_or_admin on public.profiles
for select to authenticated
using (id = auth.uid() or private.is_admin());

drop policy if exists profiles_update_self_or_admin on public.profiles;
create policy profiles_update_self_or_admin on public.profiles
for update to authenticated
using (id = auth.uid() or private.is_admin())
with check (id = auth.uid() or private.is_admin());

drop policy if exists profiles_insert_admin_only on public.profiles;
create policy profiles_insert_admin_only on public.profiles
for insert to authenticated
with check (private.is_admin());

-- BLOG CATEGORIES
drop policy if exists blog_categories_read_public on public.blog_categories;
create policy blog_categories_read_public on public.blog_categories
for select to anon, authenticated
using (true);

drop policy if exists blog_categories_write_admin on public.blog_categories;
create policy blog_categories_write_admin on public.blog_categories
for all to authenticated
using (private.is_admin())
with check (private.is_admin());

-- BLOG POSTS
drop policy if exists blog_posts_read_published_public on public.blog_posts;
create policy blog_posts_read_published_public on public.blog_posts
for select to anon, authenticated
using (status = 'published' or private.is_admin());

drop policy if exists blog_posts_write_admin on public.blog_posts;
create policy blog_posts_write_admin on public.blog_posts
for all to authenticated
using (private.is_admin())
with check (private.is_admin());

-- MEDIA
drop policy if exists media_assets_read_public on public.media_assets;
create policy media_assets_read_public on public.media_assets
for select to anon, authenticated
using (true);

drop policy if exists media_assets_write_admin on public.media_assets;
create policy media_assets_write_admin on public.media_assets
for all to authenticated
using (private.is_admin())
with check (private.is_admin());

-- CONTACT / CONSULTATION REQUESTS
drop policy if exists consultation_insert_public on public.consultation_requests;
create policy consultation_insert_public on public.consultation_requests
for insert to anon, authenticated
with check (true);

drop policy if exists consultation_admin_manage on public.consultation_requests;
create policy consultation_admin_manage on public.consultation_requests
for all to authenticated
using (private.is_admin())
with check (private.is_admin());

-- NEWSLETTER
drop policy if exists newsletter_insert_public on public.newsletter_subscribers;
create policy newsletter_insert_public on public.newsletter_subscribers
for insert to anon, authenticated
with check (true);

drop policy if exists newsletter_admin_manage on public.newsletter_subscribers;
create policy newsletter_admin_manage on public.newsletter_subscribers
for all to authenticated
using (private.is_admin())
with check (private.is_admin());

-- ANALYTICS EVENTS
drop policy if exists page_view_insert_public on public.page_view_events;
create policy page_view_insert_public on public.page_view_events
for insert to anon, authenticated
with check (true);

drop policy if exists page_view_read_admin on public.page_view_events;
create policy page_view_read_admin on public.page_view_events
for select to authenticated
using (private.is_admin());

drop policy if exists post_view_insert_public on public.blog_post_view_events;
create policy post_view_insert_public on public.blog_post_view_events
for insert to anon, authenticated
with check (true);

drop policy if exists post_view_read_admin on public.blog_post_view_events;
create policy post_view_read_admin on public.blog_post_view_events
for select to authenticated
using (private.is_admin());

-- SITE SETTINGS
drop policy if exists site_settings_read_public on public.site_settings;
create policy site_settings_read_public on public.site_settings
for select to anon, authenticated
using (true);

drop policy if exists site_settings_write_admin on public.site_settings;
create policy site_settings_write_admin on public.site_settings
for all to authenticated
using (private.is_admin())
with check (private.is_admin());

commit;
