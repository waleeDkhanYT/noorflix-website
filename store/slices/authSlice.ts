import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/store/index";
import {
  hydrateAuth,
  syncAuthSession,
} from "@/store/thunks/authThunks";

export type AuthUser = {
  id: string;
  email: string | null;
};

export type AuthProfile = {
  username: string | null;
  avatar_url: string | null;
};

/** Serializable session metadata — no tokens stored in Redux. */
export type AuthSessionSummary = {
  expiresAt: number | null;
  lastSignInAt: string | null;
};

type AuthState = {
  user: AuthUser | null;
  profile: AuthProfile | null;
  session: AuthSessionSummary | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  initialized: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  profile: null,
  session: null,
  status: "idle",
  initialized: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth(state) {
      state.user = null;
      state.profile = null;
      state.session = null;
      state.status = "unauthenticated";
      state.initialized = true;
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
    setProfile(state, action: { payload: AuthProfile }) {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: AuthState) => {
      state.status = "loading";
      state.error = null;
    };

    const handleFulfilled = (
      state: AuthState,
      action: {
        payload: {
          user: AuthUser | null;
          profile: AuthProfile | null;
          session: AuthSessionSummary | null;
        };
      }
    ) => {
      state.user = action.payload.user;
      state.profile = action.payload.profile;
      state.session = action.payload.session;
      state.status = action.payload.user ? "authenticated" : "unauthenticated";
      state.initialized = true;
      state.error = null;
    };

    const handleRejected = (state: AuthState, action: { payload: unknown }) => {
      state.user = null;
      state.profile = null;
      state.session = null;
      state.status = "unauthenticated";
      state.initialized = true;
      state.error =
        typeof action.payload === "string"
          ? action.payload
          : "Failed to load authentication state.";
    };

    builder
      .addCase(hydrateAuth.pending, handlePending)
      .addCase(hydrateAuth.fulfilled, handleFulfilled)
      .addCase(hydrateAuth.rejected, handleRejected)
      .addCase(syncAuthSession.pending, handlePending)
      .addCase(syncAuthSession.fulfilled, handleFulfilled)
      .addCase(syncAuthSession.rejected, handleRejected);
  },
});

export const { clearAuth, clearAuthError, setProfile } = authSlice.actions;

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthProfile = (state: RootState) => state.auth.profile;
export const selectAuthSession = (state: RootState) => state.auth.session;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthInitialized = (state: RootState) => state.auth.initialized;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthLoading = (state: RootState) =>
  !state.auth.initialized || state.auth.status === "loading";
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.status === "authenticated" && state.auth.user !== null;
export const selectAuthUserId = (state: RootState) => state.auth.user?.id ?? null;

export default authSlice.reducer;