import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ProfileSettingsForm } from "@/components/auth/ProfileSettingsForm";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Update your NoorFlix username and profile photo.",
};

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-lg px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Account
          </h1>
          <p className="text-muted-foreground">
            Update your username and profile photo.
          </p>
        </header>

        <div
          className={cn(
            "rounded-2xl border border-border/60 p-6 shadow-(--shadow-soft) sm:p-8",
            "bg-card/60 backdrop-blur-sm dark:border-white/10 dark:bg-card/40"
          )}
        >
          <ProfileSettingsForm />
        </div>
      </div>
    </ProtectedRoute>
  );
}