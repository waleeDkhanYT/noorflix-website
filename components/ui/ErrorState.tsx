"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please check your connection and API keys, then try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card/50 px-6 py-12 text-center",
        "dark:border-white/10 dark:bg-card/30",
        className
      )}
    >
      <AlertCircle className="mx-auto size-10 text-red-500/80" strokeWidth={1.5} />
      <h2 className="mt-4 text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent dark:border-white/10 dark:hover:bg-white/5"
        >
          <RefreshCw className="size-4" />
          Try again
        </button>
      )}
    </div>
  );
}