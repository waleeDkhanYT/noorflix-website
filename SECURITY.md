# NoorFlix Security

This document describes security decisions and data-handling practices for the NoorFlix web application.

## Principles

1. **Data minimization** — Store only what is necessary. Watchlist rows contain TMDB IDs, media type, title, poster path, and timestamp — not video content.
2. **Least privilege** — Database access uses the Supabase anon key with RLS on the client auth path; service role key is server-only and optional.
3. **Defense in depth** — Validation at the edge (Zod), server actions, RLS, rate limiting on public APIs, and security headers.

## Authentication & Database Access

| Layer | Mechanism |
|-------|-----------|
| Auth | Supabase Auth (email/password, OAuth) |
| Client session | `@supabase/ssr` browser client — auth only, no direct table writes from UI |
| Server reads/writes | `createClient()` from `lib/supabase/server.ts` inside Server Actions |
| Admin (optional) | `createAdminClient()` in `lib/supabase/admin.ts` — `server-only`, bypasses RLS; not used in normal user flows |

All user data mutations go through Server Actions in `app/actions/`:

- `auth.ts` — profile reads/updates
- `preferences.ts` — user preferences
- `watchlist.ts` — watchlist CRUD and sync

## Row Level Security (Supabase)

RLS is enabled and **forced** on:

- `profiles`
- `user_preferences`
- `watchlists`

Policies restrict `authenticated` users to their own rows (`auth.uid() = id` / `user_id`).

Migration `20260617200000_security_hardening.sql` explicitly revokes table access from the `anon` role.

Apply migrations via Supabase Dashboard SQL Editor or `supabase db push`.

## Input Validation

| Surface | Validation |
|---------|------------|
| Auth forms | Zod schemas in `lib/validation/user.ts` (client) |
| Server Actions | `parseInput()` + Zod before any DB write |
| TMDB/Watchmode/OMDb APIs | Zod query schemas + path allowlists in `lib/server/` |
| Ratings batch API | `batchRatingsBodySchema` |

## API Key Handling

| Variable | Exposure |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public (required for client auth) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (RLS-protected) |
| `TMDB_API_KEY` | Server only — `lib/env.ts` |
| `WATCHMODE_API_KEY` | Server only |
| `OMDB_API_KEY` | Server only |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only — never import in Client Components |

Third-party API calls are proxied through `/api/tmdb`, `/api/watchmode`, `/api/omdb` with rate limiting and path restrictions.

## HTTP Security Headers

Configured in `next.config.ts`:

- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy (restricts camera, microphone, geolocation, payment)

## Privacy & Consent

- **Privacy Policy** (`/privacy`) describes guest vs signed-in data handling.
- **Data storage notice** (`DataStorageConsent`) shown to signed-in users on first visit, stored in localStorage after acknowledgment.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values. Never commit `.env.local`.

Run `getServerSecretsStatus()` from `lib/env.ts` in server diagnostics to verify configuration without logging secret values.

## Account Deletion

Users can delete their account from the account menu. `deleteAccountAction`:

1. Verifies the authenticated user via server Supabase client
2. Deletes the auth user via `createAdminClient()` (requires `SUPABASE_SERVICE_ROLE_KEY`)
3. Cascades removal of `profiles`, `user_preferences`, and `watchlists` rows
4. Signs out and clears client local data

## Admin Access

| Route | Access |
|-------|--------|
| `/admin` | Signed-in user whose email is in `ADMIN_EMAILS` |
| `GET /api/admin/health` | Requires `x-admin-secret` header matching `ADMIN_API_SECRET` |

The service role key is never sent to the browser.

## Reporting Issues

If you discover a security vulnerability, please report it through the contact channels listed in the site footer rather than opening a public issue with exploit details.