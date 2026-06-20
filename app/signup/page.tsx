import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Create Account",
  description: "Join NoorFlix to save titles and sync your watchlist.",
  path: "/signup",
  noIndex: true,
});

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join NoorFlix and start building your personal watchlist."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthShell>
  );
}