import { WatchlistContent } from "@/components/watchlist/WatchlistContent";

export default function WatchlistPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Watchlist
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Your saved movies and shows — stored locally as a guest, or synced to
          your account when signed in.
        </p>
      </header>

      <WatchlistContent />
    </div>
  );
}