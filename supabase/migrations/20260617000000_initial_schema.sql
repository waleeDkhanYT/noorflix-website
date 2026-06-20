-- NoorFlix initial schema
-- Apply via Supabase CLI: supabase db push
-- Or paste into Supabase Dashboard → SQL Editor

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_username_length check (
    username is null or char_length(username) between 3 and 30
  ),
  constraint profiles_username_format check (
    username is null or username ~ '^[a-zA-Z0-9_]+$'
  )
);

create unique index profiles_username_unique_idx
  on public.profiles (username)
  where username is not null;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

alter table public.profiles enable row level security;

create policy "Profiles: users can view own row"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Profiles: users can insert own row"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Profiles: users can update own row"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- user_preferences
-- ---------------------------------------------------------------------------
create table public.user_preferences (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  favorite_genres jsonb not null default '[]'::jsonb,
  preferred_language text not null default 'en',
  theme_preference text not null default 'system',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint user_preferences_theme_check check (
    theme_preference in ('light', 'dark', 'system')
  ),
  constraint user_preferences_favorite_genres_array check (
    jsonb_typeof(favorite_genres) = 'array'
  )
);

create trigger user_preferences_set_updated_at
  before update on public.user_preferences
  for each row
  execute function public.handle_updated_at();

alter table public.user_preferences enable row level security;

create policy "Preferences: users can view own row"
  on public.user_preferences
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Preferences: users can insert own row"
  on public.user_preferences
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Preferences: users can update own row"
  on public.user_preferences
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Preferences: users can delete own row"
  on public.user_preferences
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- watchlists (TMDB references only — no hosted media content)
-- ---------------------------------------------------------------------------
create table public.watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  content_id text not null,
  media_type text not null,
  title text not null,
  poster_path text,
  added_at timestamptz not null default timezone('utc', now()),
  constraint watchlists_media_type_check check (
    media_type in ('movie', 'tv', 'anime')
  ),
  constraint watchlists_content_id_not_empty check (
    char_length(trim(content_id)) > 0
  ),
  constraint watchlists_title_not_empty check (
    char_length(trim(title)) > 0
  ),
  constraint watchlists_user_content_unique unique (user_id, content_id, media_type)
);

create index watchlists_user_id_idx on public.watchlists (user_id);
create index watchlists_user_added_at_idx on public.watchlists (user_id, added_at desc);

alter table public.watchlists enable row level security;

create policy "Watchlists: users can view own items"
  on public.watchlists
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Watchlists: users can insert own items"
  on public.watchlists
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Watchlists: users can update own items"
  on public.watchlists
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Watchlists: users can delete own items"
  on public.watchlists
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Auto-provision profile + preferences on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);

  insert into public.user_preferences (user_id)
  values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Grants (authenticated users only; anon has no direct table access)
-- ---------------------------------------------------------------------------
grant usage on schema public to authenticated;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.user_preferences to authenticated;
grant select, insert, update, delete on public.watchlists to authenticated;