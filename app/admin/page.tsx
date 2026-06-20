import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminStatsAction } from "@/app/actions/admin";
import { isAdminEmail } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin",
  description: "NoorFlix administration dashboard.",
  path: "/admin",
  noIndex: true,
});

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    redirect("/");
  }

  const statsResult = await getAdminStatsAction();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-2">
        <p className="text-sm text-muted-foreground">Admin only</p>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Signed in as {user.email}. Service-role access is used server-side
          only.
        </p>
      </header>

      {!statsResult.success ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {statsResult.error}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Profiles" value={statsResult.data.profiles} />
          <StatCard
            label="Watchlist items"
            value={statsResult.data.watchlistItems}
          />
          <StatCard label="Preferences" value={statsResult.data.preferences} />
        </div>
      )}

      {statsResult.success && (
        <section className="mt-8 space-y-3 rounded-xl border border-border/70 p-5 dark:border-white/10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Server configuration
          </h2>
          <ul className="space-y-1.5 text-sm">
            {Object.entries(statsResult.data.secrets).map(([key, value]) => (
              <li key={key} className="flex justify-between gap-4">
                <span className="text-muted-foreground">{key}</span>
                <span className={value ? "text-emerald-600" : "text-amber-600"}>
                  {value ? "configured" : "missing"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-8 text-sm text-muted-foreground">
        <Link href="/" className="font-medium text-primary hover:underline">
          ← Back to NoorFlix
        </Link>
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card/50 p-5 dark:border-white/10">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}