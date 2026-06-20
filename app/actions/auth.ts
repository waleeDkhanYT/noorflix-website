"use server";

import { redirect } from "next/navigation";
import { isAllowedCloudinaryAvatarUrl } from "@/lib/cloudinary";
import { getSupabaseServiceRoleKey } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { parseInput } from "@/lib/validation/parse";
import { updateProfileInputSchema } from "@/lib/validation/user";
import type { AuthProfile } from "@/store/slices/authSlice";
import { actionError, actionSuccess, type ActionResult } from "@/types/actions";

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function deleteAccountAction(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return actionError("Not authenticated");
  }

  if (!getSupabaseServiceRoleKey()) {
    return actionError(
      "Account deletion is temporarily unavailable. Please contact support."
    );
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(user.id);

    if (error) {
      return actionError(error.message);
    }

    await supabase.auth.signOut();
    return actionSuccess(undefined);
  } catch (error) {
    return actionError(
      error instanceof Error ? error.message : "Failed to delete account."
    );
  }
}

export async function getProfileAction(): Promise<ActionResult<AuthProfile>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return actionError("Not authenticated");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("username, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return actionError(error.message);
  }

  return actionSuccess({
    username: data?.username ?? null,
    avatar_url: data?.avatar_url ?? null,
  });
}

export async function updateProfileAction(
  input: unknown
): Promise<ActionResult<AuthProfile>> {
  const parsed = parseInput(updateProfileInputSchema, input);
  if (!parsed.success) {
    return parsed;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return actionError("Not authenticated");
  }

  const updates: { username?: string | null; avatar_url?: string | null } = {};

  if (parsed.data.username !== undefined) {
    updates.username = parsed.data.username ?? null;
  }

  if (parsed.data.avatar_url !== undefined) {
    if (!isAllowedCloudinaryAvatarUrl(parsed.data.avatar_url)) {
      return actionError("Avatar URL must be hosted on Cloudinary.");
    }

    updates.avatar_url = parsed.data.avatar_url;
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select("username, avatar_url")
    .single();

  if (error || !data) {
    if (error?.code === "23505") {
      return actionError("That username is already taken.");
    }

    return actionError(error?.message ?? "Failed to update profile.");
  }

  return actionSuccess({
    username: data.username,
    avatar_url: data.avatar_url,
  });
}