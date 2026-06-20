import type { Metadata } from "next";
import { DetailContent } from "@/components/detail/DetailContent";
import { generateDetailPageMetadata, parseDetailId } from "@/lib/detail-page";

type MovieDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: MovieDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return generateDetailPageMetadata("movie", id);
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = await params;
  const numericId = parseDetailId(id);

  if (numericId === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <p className="text-muted-foreground">Invalid content ID.</p>
      </div>
    );
  }

  return <DetailContent routeType="movie" id={numericId} />;
}