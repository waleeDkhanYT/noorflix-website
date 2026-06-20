"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, LogOut, Settings, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { DeleteAccountDialog } from "@/components/auth/DeleteAccountDialog";
import { createClient } from "@/lib/supabase/client";
import { clearUserLocalData } from "@/lib/user-local-data";
import {
  selectAuthLoading,
  selectAuthProfile,
  selectAuthUser,
  clearAuth,
} from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  getUserAvatarUrl,
  getUserDisplayName,
} from "@/lib/auth";
import { cn } from "@/lib/utils";

type UserMenuProps = {
  overlay?: boolean;
  size?: "sm" | "md";
};

export function UserMenu({ overlay = false, size = "md" }: UserMenuProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(selectAuthUser);
  const profile = useAppSelector(selectAuthProfile);
  const authLoading = useAppSelector(selectAuthLoading);

  const [open, setOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const dimension = size === "sm" ? 36 : 40;
  const displayName = getUserDisplayName(user, profile);
  const avatarUrl = getUserAvatarUrl(profile);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      dispatch(clearAuth());
      clearUserLocalData();
      setOpen(false);
      toast.success("Signed out");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Could not sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  if (authLoading) {
    return (
      <div
        className="flex items-center justify-center rounded-full"
        style={{ width: dimension, height: dimension }}
      >
        <Loader2
          className={cn(
            "animate-spin text-muted-foreground",
            size === "sm" ? "size-4" : "size-4.5"
          )}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className={cn(
          "rounded-full transition-transform hover:scale-105 active:scale-95",
          overlay
            ? "text-white/90 hover:text-white"
            : "text-muted-foreground hover:text-foreground"
        )}
        aria-label="Sign in"
      >
        <Avatar
          sx={{
            width: dimension,
            height: dimension,
            bgcolor: "transparent",
            border: "1px solid",
            borderColor: overlay ? "rgba(255,255,255,0.25)" : "var(--border)",
            color: overlay ? "white" : "var(--muted-foreground)",
          }}
        >
          <User
            className={size === "sm" ? "size-4" : "size-4.5"}
            strokeWidth={2}
          />
        </Avatar>
      </Link>
    );
  }

  return (
    <>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-label="Account menu"
          aria-expanded={open}
          className="rounded-full transition-transform hover:scale-105 active:scale-95"
        >
          <Avatar
            src={avatarUrl ?? undefined}
            alt={displayName}
            sx={{
              width: dimension,
              height: dimension,
              bgcolor: "var(--primary)",
              color: "var(--primary-foreground)",
              fontSize: size === "sm" ? 14 : 15,
              fontWeight: 600,
              border: "1px solid",
              borderColor: overlay ? "rgba(255,255,255,0.25)" : "var(--border)",
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className={cn(
                "absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl",
                "glass-panel shadow-(--shadow-soft)",
                "dark:shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
              )}
            >
              <div className="border-b border-border/50 px-4 py-3 dark:border-white/10">
                <p className="truncate text-sm font-semibold">{displayName}</p>
                {user.email && (
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                )}
              </div>
              <div className="p-1.5">
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground dark:hover:bg-white/5"
                >
                  <Settings className="size-4" strokeWidth={2} />
                  Account settings
                </Link>
                <Link
                  href="/watchlist"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground dark:hover:bg-white/5"
                >
                  My watchlist
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground dark:hover:bg-white/5"
                >
                  {isSigningOut ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <LogOut className="size-4" strokeWidth={2} />
                  )}
                  Sign out
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setShowDeleteDialog(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" strokeWidth={2} />
                  Delete account
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DeleteAccountDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </>
  );
}