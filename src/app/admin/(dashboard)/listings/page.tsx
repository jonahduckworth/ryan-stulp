import type { Metadata } from "next";
import Link from "next/link";
import { getAdminListings } from "@/lib/data/admin";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Listings" };

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; type?: string }>;
}) {
  const [allListings, query] = await Promise.all([
    getAdminListings(),
    searchParams,
  ]);
  const search = query.q?.trim().toLowerCase() ?? "";
  const status = ["draft", "active", "pending", "sold", "archived"].includes(
    query.status ?? "",
  )
    ? query.status
    : "";
  const listingType = ["residential", "commercial", "rural"].includes(
    query.type ?? "",
  )
    ? query.type
    : "";
  const listings = allListings.filter((listing) => {
    const searchable = [
      listing.title,
      listing.address,
      listing.neighbourhood,
      listing.mls_number,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return (
      (!search || searchable.includes(search)) &&
      (!status || listing.status === status) &&
      (!listingType || listing.listing_type === listingType)
    );
  });
  const filtersActive = Boolean(search || status || listingType);

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
        <form className="admin-filter-bar" method="get">
          <div className="field">
            <label htmlFor="listing-search">Search listings</label>
            <input
              id="listing-search"
              name="q"
              defaultValue={query.q ?? ""}
              placeholder="Title, address, community, or MLS"
            />
          </div>
          <div className="field">
            <label htmlFor="listing-status-filter">Status</label>
            <select
              id="listing-status-filter"
              name="status"
              defaultValue={status}
            >
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="listing-type-filter">Category</label>
            <select
              id="listing-type-filter"
              name="type"
              defaultValue={listingType}
            >
              <option value="">All categories</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="rural">Rural</option>
            </select>
          </div>
          <div className="admin-filter-actions">
            <button className="button button-primary" type="submit">
              Apply filters
            </button>
            {filtersActive ? (
              <Link className="button button-secondary" href="/admin/listings">
                Clear
              </Link>
            ) : null}
          </div>
        </form>
        <div className="admin-results-summary" aria-live="polite">
          Showing {listings.length} of {allListings.length} listings
        </div>
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
        ) : filtersActive ? (
          <div className="admin-empty">
            <h2>No listings match those filters</h2>
            <p>Clear the filters or try a broader search.</p>
            <Link className="button button-secondary" href="/admin/listings">
              Clear filters
            </Link>
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
