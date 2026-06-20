import { ContentCardSkeleton } from "@/components/ui/ContentCard";

export default function RootLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 h-10 w-64 rounded-xl bg-muted/70 dark:bg-white/5" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <ContentCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}