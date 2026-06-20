import { getMediaTypeLabel } from "@/lib/content";
import type { ContentMediaType } from "@/types/content";
import { cn } from "@/lib/utils";

type MediaTypeBadgeProps = {
  type: ContentMediaType;
  className?: string;
  variant?: "overlay" | "inline";
};

const badgeStyles: Record<ContentMediaType, string> = {
  movie:
    "bg-primary/90 text-primary-foreground dark:bg-primary/80 dark:text-primary-foreground",
  tv: "bg-sky-500/90 text-white dark:bg-sky-400/90 dark:text-sky-950",
  anime:
    "bg-rose-500/90 text-white dark:bg-rose-400/90 dark:text-rose-950",
};

export function MediaTypeBadge({
  type,
  className,
  variant = "inline",
}: MediaTypeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-semibold uppercase tracking-wide",
        variant === "overlay"
          ? "px-2 py-0.5 text-[10px] shadow-sm backdrop-blur-sm"
          : "px-1.5 py-0.5 text-[10px]",
        badgeStyles[type],
        className
      )}
    >
      {getMediaTypeLabel(type)}
    </span>
  );
}