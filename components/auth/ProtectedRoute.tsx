"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  selectAuthLoading,
  selectIsAuthenticated,
} from "@/store/slices/authSlice";
import { useAppSelector } from "@/store/hooks";

type ProtectedRouteProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

export function ProtectedRoute({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const router = useRouter();
  const authLoading = useAppSelector(selectAuthLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      const next =
        typeof window !== "undefined"
          ? `${redirectTo}?next=${encodeURIComponent(window.location.pathname)}`
          : redirectTo;
      router.replace(next);
    }
  }, [authLoading, isAuthenticated, redirectTo, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return children;
}