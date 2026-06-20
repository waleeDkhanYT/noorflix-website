import type { Metadata } from "next";
import { DetailContent } from "@/components/detail/DetailContent";
import { generateDetailPageMetadata, parseDetailId } from "@/lib/detail-page";

type TvDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: TvDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return generateDetailPageMetadata("tv", id);
}

export default async function TvDetailPage({ params }: TvDetailPageProps) {
  const { id } = await params;
  const numericId = parseDetailId(id);

  if (numericId === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <p className="text-muted-foreground">Invalid content ID.</p>
      </div>
    );
  }

  return <DetailContent routeType="tv" id={numericId} />;
}