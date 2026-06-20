"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserMenu } from "@/components/auth/UserMenu";
import { useAppSelector } from "@/store/hooks";
import {
  selectAuthLoading,
  selectAuthProfile,
  selectAuthUser,
  selectIsAuthenticated,
} from "@/store/slices/authSlice";
import { getUserDisplayName } from "@/lib/auth";
import { WatchlistNavLink } from "@/components/watchlist/WatchlistNavLink";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Shows" },
  { href: "/anime", label: "Anime" },
];

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const user = useAppSelector(selectAuthUser);
  const profile = useAppSelector(selectAuthProfile);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authLoading = useAppSelector(selectAuthLoading);
  const displayName = getUserDisplayName(user, profile);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className={cn(
              "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col",
              "border-l border-border/60 bg-background/95 backdrop-blur-xl",
              "dark:border-white/10 dark:bg-background/90",
              "lg:hidden"
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-4 dark:border-white/10">
              <span className="text-sm font-semibold tracking-wide">Menu</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-foreground dark:hover:bg-white/10"
              >
                <X className="size-5" strokeWidth={2} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <nav className="space-y-1">
                {navLinks.map((link, index) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                          "block rounded-xl px-4 py-3 text-base font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground dark:hover:bg-white/5"
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                >
                  <WatchlistNavLink
                    className="block w-full rounded-xl px-4 py-3 text-base"
                    onClick={onClose}
                  />
                </motion.div>
              </nav>
            </div>

            <div className="flex items-center justify-between border-t border-border/60 px-5 py-4 dark:border-white/10">
              <div className="flex items-center gap-3">
                <UserMenu size="sm" />
                <div>
                  <p className="text-sm font-medium">
                    {authLoading
                      ? "Loading…"
                      : isAuthenticated
                        ? displayName
                        : "Guest"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {authLoading
                      ? "Checking session"
                      : isAuthenticated
                        ? "Signed in"
                        : "Sign in to sync watchlist"}
                  </p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}