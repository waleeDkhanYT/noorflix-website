"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { clearAuth } from "@/store/slices/authSlice";
import { hydrateAuth, syncAuthSession } from "@/store/thunks/authThunks";
import { useAppDispatch } from "@/store/hooks";

export function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const supabase = createClient();

    void dispatch(hydrateAuth());

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") return;

      if (!session?.user) {
        dispatch(clearAuth());
        return;
      }

      void dispatch(syncAuthSession(session));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return null;
}