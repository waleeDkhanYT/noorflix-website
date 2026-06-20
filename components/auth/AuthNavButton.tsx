"use client";

import Link from "next/link";
import { Loader2, LogIn } from "lucide-react";
import {
  selectAuthLoading,
  selectAuthUser,
  selectIsAuthenticated,
} from "@/store/slices/authSlice";
import { selectAuthProfile } from "@/store/slices/authSlice";
import { useAppSelector } from "@/store/hooks";
import { getUserDisplayName } from "@/lib/auth";
import { cn } from "@/lib/utils";

type AuthNavButtonProps = {
  overlay?: boolean;
  className?: string;
};

export function AuthNavButton({ overlay = false, className }: AuthNavButtonProps) {
  const authLoading = useAppSelector(selectAuthLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser);
  const profile = useAppSelector(selectAuthProfile);

  if (authLoading) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-1.5 text-sm",
          overlay ? "text-white/70" : "text-muted-foreground",
          className
        )}
      >
        <Loader2 className="size-3.5 animate-spin" />
      </span>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Link
        href="/login"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
          overlay
            ? "text-white/85 hover:bg-white/10 hover:text-white"
            : "text-muted-foreground hover:bg-accent hover:text-foreground dark:hover:bg-white/5",
          className
        )}
      >
        <LogIn className="size-3.5" strokeWidth={2} />
        Sign in
      </Link>
    );
  }

  const displayName = getUserDisplayName(user, profile);

  return (
    <Link
      href="/watchlist"
      className={cn(
        "hidden max-w-[8rem] truncate rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors sm:inline-block xl:max-w-[10rem]",
        overlay
          ? "text-white/85 hover:bg-white/10 hover:text-white"
          : "text-muted-foreground hover:bg-accent hover:text-foreground dark:hover:bg-white/5",
        className
      )}
      title={displayName}
    >
      {displayName}
    </Link>
  );
}