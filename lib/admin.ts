import "server-only";

export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS?.trim();
  if (!raw) return [];

  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowlist = getAdminEmails();
  if (allowlist.length === 0) return false;
  return allowlist.includes(email.trim().toLowerCase());
}

export function getAdminApiSecret(): string | undefined {
  return process.env.ADMIN_API_SECRET?.trim() || undefined;
}

export function isValidAdminApiSecret(secret: string | null | undefined): boolean {
  const expected = getAdminApiSecret();
  if (!expected || !secret) return false;
  return secret === expected;
}