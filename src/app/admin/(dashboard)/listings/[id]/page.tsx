import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeleteListingForm } from "@/components/admin/delete-listing-form";
import { ListingForm } from "@/components/admin/listing-form";
import { getAdminListing } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Edit listing" };

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getAdminListing(id);
  if (!listing) notFound();

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Edit listing</h1>
          <p>{listing.address}</p>
        </div>
      </header>
      <ListingForm listing={listing} />
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
