"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { getAuthErrorMessage } from "@/lib/auth";
import { emailSchema } from "@/lib/validation/user";
import { cn } from "@/lib/utils";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const validated = emailSchema.safeParse(email);
      if (!validated.success) {
        throw new Error(
          validated.error.issues[0]?.message ?? "Enter a valid email address."
        );
      }

      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(
        validated.data,
        {
          redirectTo: `${window.location.origin}/auth/callback?next=/login`,
        }
      );

      if (error) throw error;

      setSent(true);
      toast.success("Reset link sent. Check your inbox.");
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent) {
    return (
      <p className="text-center text-sm leading-relaxed text-muted-foreground">
        If an account exists for <strong className="text-foreground">{email}</strong>,
        you will receive a password reset email shortly.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="reset-email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="reset-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={cn(
            "w-full rounded-xl border border-border/80 bg-background px-4 py-3 text-sm",
            "outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15",
            "dark:border-white/10 dark:bg-white/5"
          )}
          placeholder="you@example.com"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground",
          "transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        )}
      >
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Send Reset Link
      </button>
    </form>
  );
}