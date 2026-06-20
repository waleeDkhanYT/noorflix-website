import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type LegalPageLayoutProps = {
  title: string;
  description: string;
  lastUpdated: string;
  children: React.ReactNode;
  currentPath: "/privacy" | "/terms";
};

export function LegalPageLayout({
  title,
  description,
  lastUpdated,
  children,
  currentPath,
}: LegalPageLayoutProps) {
  const breadcrumbLabel =
    currentPath === "/privacy" ? "Privacy Policy" : "Terms & Conditions";

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link
          href="/"
          className="transition-colors hover:text-foreground"
        >
          Home
        </Link>
        <ChevronRight className="size-3.5 shrink-0 opacity-60" aria-hidden />
        <span className="font-medium text-foreground">{breadcrumbLabel}</span>
      </nav>

      <Link
        href="/"
        className={cn(
          "mb-8 inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-sm font-medium",
          "text-muted-foreground transition-colors hover:border-primary/25 hover:bg-accent hover:text-foreground",
          "dark:border-white/10 dark:hover:bg-white/5"
        )}
      >
        <ArrowLeft className="size-4" strokeWidth={2} />
        Back to Home
      </Link>

      <header className="mb-10 space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
          Last updated: {lastUpdated}
        </p>
      </header>

      <div
        className={cn(
          "space-y-10 rounded-2xl border border-border/60 p-6 sm:p-8 lg:p-10",
          "bg-card/50 shadow-[var(--shadow-soft)] backdrop-blur-sm",
          "dark:border-white/10 dark:bg-card/30"
        )}
      >
        {children}
      </div>
    </article>
  );
}

export function LegalSection({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h2>
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-primary/70">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}