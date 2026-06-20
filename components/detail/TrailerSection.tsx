"use client";

import { motion } from "framer-motion";
import type { TMDBVideo } from "@/types/tmdb-detail";

type TrailerSectionProps = {
  trailer: TMDBVideo | null;
};

export function TrailerSection({ trailer }: TrailerSectionProps) {
  if (!trailer) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      <div>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Trailer
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{trailer.name}</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border/60 shadow-lg dark:border-white/10">
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?rel=0&modestbranding=1`}
            title={trailer.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
    </motion.section>
  );
}