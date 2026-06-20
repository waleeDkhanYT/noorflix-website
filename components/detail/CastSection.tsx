"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { getPosterUrl } from "@/lib/tmdb-images";
import type { TMDBCastMember, TMDBCrewMember } from "@/types/tmdb-detail";
import { cn } from "@/lib/utils";

type CastSectionProps = {
  cast: TMDBCastMember[];
  crew: TMDBCrewMember[];
};

function PersonCard({
  name,
  subtitle,
  imagePath,
  index,
}: {
  name: string;
  subtitle: string;
  imagePath: string | null;
  index: number;
}) {
  const profileUrl = imagePath
    ? getPosterUrl(imagePath, "w185")
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="w-[7.5rem] shrink-0 snap-start sm:w-[8.5rem]"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted ring-1 ring-border/50 dark:ring-white/10">
        {profileUrl ? (
          <Image
            src={profileUrl}
            alt={name}
            fill
            sizes="120px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <User className="size-10 text-muted-foreground/40" strokeWidth={1.5} />
          </div>
        )}
      </div>
      <p className="mt-2 line-clamp-1 text-sm font-medium">{name}</p>
      <p className="line-clamp-1 text-xs text-muted-foreground">{subtitle}</p>
    </motion.div>
  );
}

export function CastSection({ cast, crew }: CastSectionProps) {
  const topCast = [...cast]
    .sort((a, b) => a.order - b.order)
    .slice(0, 10);

  const keyCrew = crew
    .filter((member) =>
      ["Director", "Writer", "Screenplay", "Creator", "Executive Producer"].includes(
        member.job
      )
    )
    .slice(0, 6);

  if (topCast.length === 0 && keyCrew.length === 0) return null;

  return (
    <div className="space-y-8">
      {topCast.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Cast</h2>
          <div
            className={cn(
              "scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2",
              "snap-x snap-mandatory scroll-smooth sm:-mx-6 sm:px-6"
            )}
          >
            {topCast.map((member, index) => (
              <PersonCard
                key={member.id}
                name={member.name}
                subtitle={member.character}
                imagePath={member.profile_path}
                index={index}
              />
            ))}
          </div>
        </section>
      )}

      {keyCrew.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Crew
          </h2>
          <div
            className={cn(
              "scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2",
              "snap-x snap-mandatory scroll-smooth sm:-mx-6 sm:px-6"
            )}
          >
            {keyCrew.map((member, index) => (
              <PersonCard
                key={`${member.id}-${member.job}`}
                name={member.name}
                subtitle={member.job}
                imagePath={member.profile_path}
                index={index}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}