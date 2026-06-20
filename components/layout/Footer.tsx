import Link from "next/link";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import { FooterAuth } from "@/components/layout/FooterAuth";
import { cn } from "@/lib/utils";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Shows" },
  { href: "/anime", label: "Anime" },
  { href: "/watchlist", label: "Watchlist" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

const socialLinks = [
  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: InstagramIcon,
  },
  {
    href: "https://x.com",
    label: "X (Twitter)",
    icon: XIcon,
  },
  {
    href: "https://youtube.com",
    label: "YouTube",
    icon: YoutubeIcon,
  },
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function FooterLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className = cn(
    "text-sm text-muted-foreground transition-colors",
    "hover:text-foreground"
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function FooterSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/30 dark:border-white/10 dark:bg-card/20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:items-start">
          <div className="space-y-4 sm:col-span-2 lg:col-span-4">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105 dark:bg-primary/20">
                <MovieFilterIcon sx={{ fontSize: 20 }} />
              </span>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                Noor<span className="text-primary">Flix</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Discover cinema that moves you
            </p>
          </div>

          <FooterSection title="Quick Links" className="lg:col-span-2">
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </FooterSection>

          <FooterSection title="Legal" className="lg:col-span-2">
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </FooterSection>

          <FooterSection title="Account" className="lg:col-span-2">
            <FooterAuth />
          </FooterSection>

          <FooterSection title="Follow Us" className="lg:col-span-2">
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-xl border border-border/70",
                    "bg-background/60 text-muted-foreground transition-all",
                    "hover:border-primary/25 hover:bg-accent hover:text-foreground",
                    "dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
                  )}
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </FooterSection>
        </div>

        <div className="mt-10 border-t border-border/50 pt-8 dark:border-white/10">
          <p className="text-center text-xs leading-relaxed text-muted-foreground sm:text-left sm:text-sm">
            © 2026 NoorFlix. Made with love for storytellers and cinephiles.
          </p>
        </div>
      </div>
    </footer>
  );
}