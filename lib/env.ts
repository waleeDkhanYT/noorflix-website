import "server-only";

/**
 * Server-only environment variable accessors.
 * Secrets never use the NEXT_PUBLIC_ prefix.
 */

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function requireEnv(name: string): string {
  const value = readEnv(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getPublicSiteUrl(): string | undefined {
  return readEnv("NEXT_PUBLIC_SITE_URL");
}

export function getSupabaseUrl(): string {
  return requireEnv("NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabaseAnonKey(): string {
  return requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export function getSupabaseServiceRoleKey(): string | undefined {
  return readEnv("SUPABASE_SERVICE_ROLE_KEY");
}

export function getTmdbApiKey(): string | undefined {
  return readEnv("TMDB_API_KEY");
}

export function getWatchmodeApiKey(): string | undefined {
  return readEnv("WATCHMODE_API_KEY");
}

export function getOmdbApiKey(): string | undefined {
  return readEnv("OMDB_API_KEY");
}

export function getCloudinaryCloudName(): string | undefined {
  return readEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
}

export function getCloudinaryApiKey(): string | undefined {
  return readEnv("CLOUDINARY_API_KEY");
}

export function getCloudinaryApiSecret(): string | undefined {
  return readEnv("CLOUDINARY_API_SECRET");
}

export function getCloudinaryUploadPreset(): string | undefined {
  return readEnv("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET");
}

/** Variables safe to expose to the browser (validated at startup on server). */
export function getPublicEnvStatus() {
  return {
    supabaseConfigured: Boolean(getSupabaseUrl() && getSupabaseAnonKey()),
    siteUrlConfigured: Boolean(getPublicSiteUrl()),
  };
}

/** Server-only secrets — never import into Client Components. */
export function getServerSecretsStatus() {
  return {
    tmdbConfigured: Boolean(getTmdbApiKey()),
    watchmodeConfigured: Boolean(getWatchmodeApiKey()),
    omdbConfigured: Boolean(getOmdbApiKey()),
    serviceRoleConfigured: Boolean(getSupabaseServiceRoleKey()),
    cloudinaryConfigured: Boolean(
      getCloudinaryCloudName() &&
        getCloudinaryApiKey() &&
        getCloudinaryApiSecret()
    ),
  };
}