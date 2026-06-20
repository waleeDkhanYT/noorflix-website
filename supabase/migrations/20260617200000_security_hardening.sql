-- Security hardening: explicit anon denial + force RLS

-- Revoke direct table access from anonymous users
revoke all on table public.profiles from anon;
revoke all on table public.user_preferences from anon;
revoke all on table public.watchlists from anon;

-- Ensure RLS cannot be bypassed by table owners in normal operations
alter table public.profiles force row level security;
alter table public.user_preferences force row level security;
alter table public.watchlists force row level security;