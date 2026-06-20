"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { DataStorageConsent } from "@/components/privacy/DataStorageConsent";
import { WatchlistSyncManager } from "@/components/watchlist/WatchlistSyncManager";
import { ThemeProvider } from "./ThemeProvider";
import { ReduxProvider } from "@/store/provider";

function ThemedToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      toastOptions={{
        className: "font-sans !rounded-xl !border-border/60 dark:!border-white/10",
      }}
    />
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider>
        <AuthInitializer />
        <WatchlistSyncManager />
        {children}
        <DataStorageConsent />
        <ThemedToaster />
      </ThemeProvider>
    </ReduxProvider>
  );
}