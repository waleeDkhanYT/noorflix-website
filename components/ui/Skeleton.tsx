"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0.4 }}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{
        duration: 1.6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={cn(
        "relative overflow-hidden rounded-xl bg-muted/80 dark:bg-white/5",
        className
      )}
    >
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10"
        animate={{ translateX: ["-100%", "100%"] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.div>
  );
}

export function MediaCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[2/3] w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <Skeleton className="aspect-[21/9] w-full rounded-2xl" />
      <div className="absolute inset-0 flex flex-col justify-end gap-4 p-8">
        <Skeleton className="h-10 w-2/3 max-w-md" />
        <Skeleton className="h-4 w-full max-w-lg" />
        <Skeleton className="h-4 w-4/5 max-w-md" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-11 w-32 rounded-full" />
          <Skeleton className="h-11 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function MediaRowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-5">
      <Skeleton className="h-7 w-48" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: count }).map((_, i) => (
          <MediaCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function HorizontalRowSkeleton({
  title,
  count = 8,
}: {
  title?: string;
  count?: number;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          {title ? (
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {title}
            </h2>
          ) : (
            <Skeleton className="h-7 w-48" />
          )}
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
      <div className="scrollbar-hide -mx-4 flex gap-4 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="w-[9.5rem] shrink-0 sm:w-[11rem] md:w-[12.5rem] lg:w-[13.5rem]"
          >
            <MediaCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}