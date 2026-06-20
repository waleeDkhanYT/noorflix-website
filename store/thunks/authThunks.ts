import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Session } from "@supabase/supabase-js";
import { getProfileAction } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { mapSupabaseUser } from "@/lib/auth";
import type {
  AuthProfile,
  AuthSessionSummary,
  AuthUser,
} from "@/store/slices/authSlice";

type AuthPayload = {
  user: AuthUser | null;
  profile: AuthProfile | null;
  session: AuthSessionSummary | null;
};

function mapSessionSummary(session: Session | null): AuthSessionSummary | null {
  if (!session) return null;

  return {
    expiresAt: session.expires_at ?? null,
    lastSignInAt: session.user.last_sign_in_at ?? null,
  };
}

async function buildAuthPayload(session: Session | null): Promise<AuthPayload> {
  if (!session?.user) {
    return { user: null, profile: null, session: null };
  }

  const profileResult = await getProfileAction();

  return {
    user: mapSupabaseUser(session.user),
    profile: profileResult.success ? profileResult.data : null,
    session: mapSessionSummary(session),
  };
}

export const hydrateAuth = createAsyncThunk<AuthPayload, void, { rejectValue: string }>(
  "auth/hydrate",
  async (_, { rejectWithValue }) => {
    try {
      const supabase = createClient();
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        return rejectWithValue(error.message);
      }

      return buildAuthPayload(session);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to hydrate auth."
      );
    }
  }
);

export const syncAuthSession = createAsyncThunk<
  AuthPayload,
  Session | null,
  { rejectValue: string }
>("auth/syncSession", async (session, { rejectWithValue }) => {
  try {
    return buildAuthPayload(session);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to sync auth session."
    );
  }
});