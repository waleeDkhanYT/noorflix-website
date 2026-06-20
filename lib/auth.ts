import type { AuthProfile, AuthUser } from "@/store/slices/authSlice";
import type { User } from "@supabase/supabase-js";

export const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"] as const;

export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

export function mapSupabaseUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email ?? null,
  };
}

export function getUserDisplayName(
  user: AuthUser | null,
  profile: AuthProfile | null
): string {
  if (profile?.username) return profile.username;
  if (user?.email) return user.email.split("@")[0] ?? "User";
  return "User";
}

export function getUserAvatarUrl(profile: AuthProfile | null): string | null {
  return profile?.avatar_url ?? null;
}

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return "Something went wrong. Please try again.";
}