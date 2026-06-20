"use client";

import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SupabaseErrorBannerProps = {
  message: string;
  onDismiss?: () => void;
  className?: string;
};

export function SupabaseErrorBanner({
  message,
  onDismiss,
  className,
}: SupabaseErrorBannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive",
        className
      )}
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <p className="min-w-0 flex-1">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="shrink-0 rounded-md p-0.5 transition-colors hover:bg-destructive/10"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}