import { FileQuestion } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 sm:px-6">
      <EmptyState
        icon={FileQuestion}
        title="Page not found"
        description="The page you're looking for doesn't exist or may have been moved."
        actionLabel="Back to Home"
        actionHref="/"
      />
    </div>
  );
}