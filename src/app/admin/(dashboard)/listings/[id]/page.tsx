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
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    created?: string;
    saved?: string;
    duplicated?: string;
  }>;
}) {
  const { id } = await params;
  const query = await searchParams;
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
      {query.created === "1" ? (
        <div className="admin-success" role="status">
          <strong>Draft created.</strong>
          <p>
            Add and order the property photos below, choose the featured image,
            preview the page, then publish when everything is ready.
          </p>
        </div>
      ) : query.duplicated === "1" ? (
        <div className="admin-success" role="status">
          <strong>Draft duplicated.</strong>
          <p>Review every field and photo before publishing the copy.</p>
        </div>
      ) : query.saved === "1" ? (
        <div className="admin-success" role="status">
          Listing changes saved.
        </div>
      ) : null}
      <ListingForm listing={listing} />
      <ListingMediaManager
        listingId={listing.id}
        address={listing.address}
        listingStatus={listing.status}
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
