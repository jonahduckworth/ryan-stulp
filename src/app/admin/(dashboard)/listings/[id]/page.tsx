import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteListingForm } from "@/components/admin/delete-listing-form";
import { DuplicateListingForm } from "@/components/admin/duplicate-listing-form";
import { ListingMediaManager } from "@/components/admin/listing-media-manager";
import { ListingForm } from "@/components/admin/listing-form";
import {
  getAdminListing,
  getAdminListingMedia,
} from "@/lib/data/admin";

export const metadata: Metadata = { title: "Edit listing" };

export default async function EditListingPage({
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
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Edit listing</h1>
          <p>{listing.address}</p>
        </div>
        <div className="admin-header-actions">
          <Link
            className="button button-secondary"
            href={`/admin/preview/listings/${listing.id}`}
            target="_blank"
          >
            Preview
          </Link>
          <DuplicateListingForm id={listing.id} title={listing.title} />
        </div>
      </header>
      <ListingForm listing={listing} />
      <ListingMediaManager
        listingId={listing.id}
        address={listing.address}
        initialMedia={media}
      />
      <section className="danger-zone">
        <h2>Delete listing</h2>
        <p>
          This permanently removes the listing record. Archiving is safer if
          the property may be needed later.
        </p>
        <DeleteListingForm id={listing.id} address={listing.address} />
      </section>
    </div>
  );
}
