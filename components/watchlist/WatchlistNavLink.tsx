"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { selectWatchlistCount } from "@/store/slices/watchlistSlice";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";

type WatchlistNavLinkProps = {
  href?: string;
  label?: string;
  overlay?: boolean;
  className?: string;
  onClick?: () => void;
};

export function WatchlistNavLink({
  href = "/watchlist",
  label = "Watchlist",
  overlay = false,
  className,
  onClick,
}: WatchlistNavLinkProps) {
  const pathname = usePathname();
  const count = useAppSelector(selectWatchlistCount);
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        overlay
          ? isActive
            ? "bg-white/15 text-white"
            : "text-white/75 hover:bg-white/10 hover:text-white"
          : isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-accent/60 hover:text-foreground dark:hover:bg-white/5",
        className
      )}
    >
      {label}
      {count > 0 && (
        <span
          className={cn(
            "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none",
            overlay
              ? "bg-white text-black"
              : "bg-primary text-primary-foreground"
          )}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}