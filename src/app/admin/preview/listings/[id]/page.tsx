import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingDetailView } from "@/components/listing-detail-view";
import {
  getAdminListing,
  getAdminListingMedia,
} from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Listing preview",
  robots: { index: false, follow: false },
};

export default async function ListingPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [listing, media] = await Promise.all([
    getAdminListing(id),
    getAdminListingMedia(id),
  ]);
  if (!listing) notFound();

  return (
    <main id="main-content">
      <ListingDetailView listing={listing} media={media} preview />
    </main>
  );
}
