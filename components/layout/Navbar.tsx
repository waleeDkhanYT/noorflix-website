"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import { Menu } from "lucide-react";
import { SearchBarSuspense } from "@/components/search/SearchBarSuspense";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AuthNavButton } from "@/components/auth/AuthNavButton";
import { UserMenu } from "@/components/auth/UserMenu";
import { WatchlistNavLink } from "@/components/watchlist/WatchlistNavLink";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Shows" },
  { href: "/anime", label: "Anime" },
];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const isOverlay = isHome && !isScrolled;

  return (
    <>
      <motion.header
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "top-0 z-50 w-full transition-all duration-300",
          isHome ? "fixed" : "sticky",
          isOverlay
            ? "border-transparent bg-transparent"
            : cn(
                "border-b border-border/60 bg-background/80 backdrop-blur-xl",
                "dark:border-white/10 dark:bg-background/70 dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
              )
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:gap-6 sm:px-6 lg:px-8">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
                isOverlay
                  ? "bg-white/10 text-white backdrop-blur-sm"
                  : "bg-primary/10 text-primary dark:bg-primary/20"
              )}
            >
              <MovieFilterIcon sx={{ fontSize: 20 }} />
            </span>
            <span
              className={cn(
                "text-lg font-semibold tracking-tight",
                isOverlay ? "text-white" : "text-foreground"
              )}
            >
              Noor<span className="text-primary">Flix</span>
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 lg:block lg:max-w-md xl:max-w-lg">
            <SearchBarSuspense variant="navbar" />
          </div>

          <div className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isOverlay
                      ? isActive
                        ? "bg-white/15 text-white"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                      : isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground dark:hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <WatchlistNavLink overlay={isOverlay} />
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <div
              className={cn(
                isOverlay &&
                  "[&_button]:text-white/80! [&_button:hover]:bg-white/10!"
              )}
            >
              <ThemeToggle />
            </div>
            <AuthNavButton overlay={isOverlay} className="hidden md:inline-flex" />
            <div className="hidden sm:block">
              <UserMenu overlay={isOverlay} />
            </div>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              className={cn(
                "flex size-10 items-center justify-center rounded-xl transition-colors lg:hidden",
                isOverlay
                  ? "text-white hover:bg-white/10"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground dark:hover:bg-white/10"
              )}
            >
              <Menu className="size-5" strokeWidth={2} />
            </button>
          </div>
        </nav>

        <div
          className={cn(
            "px-4 pb-3 pt-1 lg:hidden",
            isOverlay
              ? "border-t border-white/10"
              : "border-t border-border/40 dark:border-white/5"
          )}
        >
          <SearchBarSuspense variant="navbar" overlay={isOverlay} />
        </div>
      </motion.header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}