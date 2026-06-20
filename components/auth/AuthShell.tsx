import Link from "next/link";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2.5 self-center"
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
          <MovieFilterIcon sx={{ fontSize: 22 }} />
        </span>
        <span className="text-xl font-semibold tracking-tight">
          Noor<span className="text-primary">Flix</span>
        </span>
      </Link>

      <div
        className={cn(
          "rounded-2xl border border-border/60 p-6 shadow-[var(--shadow-soft)] sm:p-8",
          "bg-card/60 backdrop-blur-sm dark:border-white/10 dark:bg-card/40"
        )}
      >
        <header className="mb-6 space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        </header>

        {children}
      </div>

      {footer && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {footer}
        </p>
      )}
    </div>
  );
}