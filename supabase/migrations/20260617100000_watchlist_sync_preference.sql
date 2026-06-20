-- Optional cloud sync preference per user
alter table public.user_preferences
  add column if not exists watchlist_sync_enabled boolean not null default true;