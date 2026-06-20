"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";
import { getServerSecretsStatus } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { actionError, actionSuccess, type ActionResult } from "@/types/actions";

export type AdminStats = {
  profiles: number;
  watchlistItems: number;
  preferences: number;
  secrets: ReturnType<typeof getServerSecretsStatus>;
};

async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return { ok: false as const, error: "Unauthorized" };
  }

  return { ok: true as const, user };
}

export async function getAdminStatsAction(): Promise<ActionResult<AdminStats>> {
  const adminCheck = await requireAdminUser();
  if (!adminCheck.ok) {
    return actionError(adminCheck.error);
  }

  try {
    const admin = createAdminClient();

    const [profiles, watchlists, preferences] = await Promise.all([
      admin.from("profiles").select("id", { count: "exact", head: true }),
      admin.from("watchlists").select("id", { count: "exact", head: true }),
      admin
        .from("user_preferences")
        .select("user_id", { count: "exact", head: true }),
    ]);

    if (profiles.error || watchlists.error || preferences.error) {
      return actionError(
        profiles.error?.message ??
          watchlists.error?.message ??
          preferences.error?.message ??
          "Failed to load admin stats."
      );
    }

    return actionSuccess({
      profiles: profiles.count ?? 0,
      watchlistItems: watchlists.count ?? 0,
      preferences: preferences.count ?? 0,
      secrets: getServerSecretsStatus(),
    });
  } catch (error) {
    return actionError(
      error instanceof Error
        ? error.message
        : "Admin stats require SUPABASE_SERVICE_ROLE_KEY."
    );
  }
}