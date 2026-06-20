"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateProfileAction } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { getAuthErrorMessage } from "@/lib/auth";
import { signUpInputSchema } from "@/lib/validation/user";
import { cn } from "@/lib/utils";

export function SignUpForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const validated = signUpInputSchema.safeParse({
        email,
        password,
        username,
      });

      if (!validated.success) {
        throw new Error(
          validated.error.issues[0]?.message ?? "Invalid sign-up details."
        );
      }

      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: validated.data.email,
        password: validated.data.password,
        options: {
          data: validated.data.username
            ? { username: validated.data.username }
            : undefined,
        },
      });

      if (error) throw error;

      if (data.session && validated.data.username) {
        const profileResult = await updateProfileAction({
          username: validated.data.username,
        });

        if (!profileResult.success) {
          throw new Error(profileResult.error);
        }
      }

      toast.success("Account created! You can sign in now.");
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/`,
        },
      });

      if (error) throw error;
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Username <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className={cn(
              "w-full rounded-xl border border-border/80 bg-background px-4 py-3 text-sm",
              "outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15",
              "dark:border-white/10 dark:bg-white/5"
            )}
            placeholder="cinephile_42"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="signup-email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="signup-email"
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

        <div className="space-y-2">
          <label htmlFor="signup-password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={cn(
              "w-full rounded-xl border border-border/80 bg-background px-4 py-3 text-sm",
              "outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15",
              "dark:border-white/10 dark:bg-white/5"
            )}
            placeholder="At least 8 characters"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isGoogleLoading}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground",
            "transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          )}
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Create Account
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/60 dark:border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card/60 px-2 text-muted-foreground dark:bg-card/40">
            Or continue with
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={isSubmitting || isGoogleLoading}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl border border-border/80 px-4 py-3 text-sm font-medium",
          "transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60",
          "dark:border-white/10 dark:hover:bg-white/5"
        )}
      >
        {isGoogleLoading && <Loader2 className="size-4 animate-spin" />}
        Continue with Google
      </button>
    </div>
  );
}