"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchMultiQuery } from "@/store/api/tmdbApi";
import { getPosterUrl } from "@/lib/tmdb-images";
import { cn } from "@/lib/utils";
import type { TMDBMedia } from "@/types";

export type SearchBarProps = {
  variant?: "navbar" | "hero";
  overlay?: boolean;
  className?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
};

function getMediaTitle(item: TMDBMedia) {
  return item.title ?? item.name ?? "Untitled";
}

function getMediaYear(item: TMDBMedia) {
  return (item.release_date ?? item.first_air_date ?? "").slice(0, 4);
}

export function SearchBar({
  variant = "navbar",
  overlay = false,
  className,
  autoFocus = false,
  onNavigate,
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(urlQuery);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query.trim(), 400);

  const { data, isFetching, isError } = useSearchMultiQuery(
    { query: debouncedQuery, page: 1 },
    { skip: debouncedQuery.length < 2 }
  );

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigateToSearch = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;

      setIsOpen(false);
      onNavigate?.();
      const params = new URLSearchParams();
      params.set("q", trimmed);
      if (pathname === "/search") {
        searchParams.forEach((value, key) => {
          if (key !== "q" && key !== "page") params.set(key, value);
        });
      }
      router.push(`/search?${params.toString()}`);
    },
    [router, onNavigate]
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigateToSearch(query);
  };

  const results =
    data?.results?.filter(
      (item) =>
        item.media_type === "movie" ||
        item.media_type === "tv" ||
        (!item.media_type && (item.title || item.name))
    ) ?? [];

  const showDropdown =
    isOpen && debouncedQuery.length >= 2 && (isFetching || results.length > 0 || isError);

  const isHero = variant === "hero";
  const isOverlayNavbar = overlay && variant === "navbar";

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} role="search">
        <div
          className={cn(
            "group flex items-center gap-3 rounded-2xl border transition-all duration-300",
            isHero || isOverlayNavbar
              ? "border-white/20 bg-white/10 px-5 py-4 shadow-2xl backdrop-blur-md focus-within:border-white/40 focus-within:bg-white/15"
              : "border-border/80 bg-muted/50 px-4 py-2.5 focus-within:border-primary/40 focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/15 dark:border-white/10 dark:bg-white/5 dark:focus-within:bg-white/10",
            isOverlayNavbar && "px-4 py-2.5 shadow-none"
          )}
        >
          <Search
            className={cn(
              "shrink-0",
              isHero || isOverlayNavbar
                ? "size-5 text-white/70"
                : "size-4.5 text-muted-foreground"
            )}
            strokeWidth={2}
          />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            autoFocus={autoFocus}
            placeholder={
              isHero
                ? "Search movies, TV shows, anime..."
                : "Search titles..."
            }
            aria-label="Search movies and TV shows"
            className={cn(
              "w-full bg-transparent text-sm outline-none placeholder:transition-colors",
              isHero || isOverlayNavbar
                ? "text-white placeholder:text-white/50"
                : "text-foreground placeholder:text-muted-foreground"
            )}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                if (pathname === "/search") {
                  router.push("/search");
                }
              }}
              aria-label="Clear search"
              className={cn(
                "shrink-0 rounded-lg p-1 transition-colors",
                isHero || isOverlayNavbar
                  ? "text-white/60 hover:bg-white/10 hover:text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <X className="size-4" strokeWidth={2} />
            </button>
          )}
          {isFetching && debouncedQuery.length >= 2 && (
            <Loader2
              className={cn(
                "size-4 shrink-0 animate-spin",
                isHero || isOverlayNavbar
                  ? "text-white/60"
                  : "text-muted-foreground"
              )}
            />
          )}
        </div>
      </form>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border shadow-xl",
              "border-border/80 bg-card/95 backdrop-blur-xl",
              "dark:border-white/10 dark:bg-card/90 dark:shadow-[0_16px_48px_rgba(0,0,0,0.4)]",
              isHero ? "top-full" : "top-[calc(100%+6px)]"
            )}
          >
            {isFetching && results.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            ) : isError ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                Search unavailable. Check your API key.
              </div>
            ) : results.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                No results for &ldquo;{debouncedQuery}&rdquo;
              </div>
            ) : (
              <ul className="max-h-80 overflow-y-auto py-2">
                {results.slice(0, 6).map((item, index) => {
                  const title = getMediaTitle(item);
                  const year = getMediaYear(item);
                  const poster = getPosterUrl(item.poster_path, "w185");

                  return (
                    <motion.li
                      key={`${item.id}-${item.media_type ?? "media"}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <button
                        type="button"
                        onClick={() => navigateToSearch(title)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent/80 dark:hover:bg-white/5"
                      >
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {poster ? (
                            <Image
                              src={poster}
                              alt=""
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                              N/A
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{title}</p>
                          <p className="text-xs text-muted-foreground">
                            {[item.media_type ?? "title", year]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            )}
            {results.length > 0 && (
              <div className="border-t border-border/60 px-4 py-3 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => navigateToSearch(debouncedQuery)}
                  className="text-sm font-medium text-primary transition-colors hover:brightness-110"
                >
                  View all results for &ldquo;{debouncedQuery}&rdquo;
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}