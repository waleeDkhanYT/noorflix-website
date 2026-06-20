-- Performance indexes for watchlist lookups and sync operations
create index if not exists watchlists_user_id_idx on public.watchlists (user_id);
create index if not exists watchlists_content_id_idx on public.watchlists (content_id);
create index if not exists watchlists_user_content_idx
  on public.watchlists (user_id, content_id, media_type);