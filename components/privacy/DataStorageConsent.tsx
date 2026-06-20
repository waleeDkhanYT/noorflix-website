"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import {
  acceptDataStorageConsent,
  hasDataStorageConsent,
} from "@/lib/consent-storage";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";

export function DataStorageConsent() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setVisible(false);
      return;
    }

    setVisible(!hasDataStorageConsent());
  }, [isAuthenticated]);

  if (!visible) return null;

  const handleAccept = () => {
    acceptDataStorageConsent();
    setVisible(false);
  };

  return (
    <div
      role="note"
      aria-live="polite"
      className={cn(
        "fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-2xl",
        "rounded-xl border border-border/70 bg-card/95 p-4 shadow-lg backdrop-blur-md",
        "dark:border-white/10 dark:bg-card/90"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-sm font-medium">Account data storage</p>
          <p className="text-sm text-muted-foreground">
            When signed in, NoorFlix stores your watchlist (TMDB IDs, titles,
            and poster references) and preferences in your account to enable
            optional cloud sync. We do not store payment details or sell this
            data. See our{" "}
            <Link
              href="/privacy"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={handleAccept}
          aria-label="Dismiss notice"
          className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
      <button
        type="button"
        onClick={handleAccept}
        className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:brightness-110"
      >
        Got it
      </button>
    </div>
  );
}