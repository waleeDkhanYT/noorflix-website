"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/ErrorState";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg px-4 py-20 sm:px-6">
      <ErrorState
        title="Unexpected error"
        message="NoorFlix hit a snag. You can try reloading this page."
        onRetry={reset}
      />
    </div>
  );
}