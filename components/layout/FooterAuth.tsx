"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { clearUserLocalData } from "@/lib/user-local-data";
import {
  selectAuthLoading,
  selectAuthUser,
  selectIsAuthenticated,
  clearAuth,
} from "@/store/slices/authSlice";
import { selectAuthProfile } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getUserDisplayName } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function FooterAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const authLoading = useAppSelector(selectAuthLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser);
  const profile = useAppSelector(selectAuthProfile);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      dispatch(clearAuth());
      clearUserLocalData();
      toast.success("Signed out");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Could not sign out.");
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" />
        Loading account…
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Browse as a guest or sign in to sync your watchlist.
        </p>
        <div className="flex flex-wrap gap-3">
          <FooterAuthLink href="/login">Sign in</FooterAuthLink>
          <FooterAuthLink href="/signup">Create account</FooterAuthLink>
        </div>
      </div>
    );
  }

  const displayName = getUserDisplayName(user, profile);

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Signed in as{" "}
        <span className="font-medium text-foreground">{displayName}</span>
        {user.email ? ` (${user.email})` : ""}
      </p>
      <div className="flex flex-wrap gap-3">
        <FooterAuthLink href="/watchlist">My watchlist</FooterAuthLink>
        <button
          type="button"
          onClick={handleSignOut}
          className={cn(
            "text-sm text-muted-foreground transition-colors hover:text-foreground"
          )}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

function FooterAuthLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-primary underline-offset-4 hover:underline"
    >
      {children}
    </Link>
  );
}