import type { Metadata } from "next";
import Link from "next/link";
import { getAdminListings } from "@/lib/data/admin";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Listings" };

export default async function AdminListingsPage() {
  const listings = await getAdminListings();
  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Listings</h1>
          <p>Add properties now or later, and control what is public.</p>
        </div>
        <Link className="button button-primary" href="/admin/listings/new">
          Add listing
        </Link>
      </header>
      <section className="admin-panel">
        {listings.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Homepage</th>
                  <th>Updated</th>
                  <th>Public page</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id}>
                    <td data-label="Property">
                      <Link href={`/admin/listings/${listing.id}`}>
                        {listing.title}
                      </Link>
                      <br />
                      <span className="form-note">
                        {listing.address}
                        {listing.mls_number ? ` · MLS ${listing.mls_number}` : ""}
                      </span>
                    </td>
                    <td data-label="Price">{formatCurrency(listing.price)}</td>
                    <td data-label="Status">
                      <span className="status-badge" data-status={listing.status}>
                        {listing.status}
                      </span>
                    </td>
                    <td data-label="Homepage">
                      {listing.featured ? (
                        <span className="status-badge" data-status="active">
                          Featured
                        </span>
                      ) : (
                        <span className="form-note">Standard</span>
                      )}
                    </td>
                    <td data-label="Updated">{formatDate(listing.updated_at)}</td>
                    <td data-label="Public page">
                      {listing.published_at &&
                      ["active", "pending", "sold"].includes(listing.status) ? (
                        <Link href={`/listings/${listing.slug}`} target="_blank">
                          Open ↗
                        </Link>
                      ) : (
                        <span className="form-note">Not public</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty">
            <h2>No listings yet</h2>
            <p>
              That is completely fine. Add the first property when it is ready
              for Ryan&apos;s site.
            </p>
            <Link className="button button-primary" href="/admin/listings/new">
              Add the first listing
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
