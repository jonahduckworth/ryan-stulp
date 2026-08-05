import type { Metadata } from "next";
import Link from "next/link";
import { getAdminMarketUpdates } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Market updates" };

export default async function AdminMarketUpdatesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const [allUpdates, query] = await Promise.all([
    getAdminMarketUpdates(),
    searchParams,
  ]);
  const search = query.q?.trim().toLowerCase() ?? "";
  const status = ["draft", "published", "archived"].includes(
    query.status ?? "",
  )
    ? query.status
    : "";
  const updates = allUpdates.filter((update) => {
    const searchable = [update.title, update.excerpt, update.author_name]
      .join(" ")
      .toLowerCase();
    return (
      (!search || searchable.includes(search)) &&
      (!status || update.status === status)
    );
  });
  const filtersActive = Boolean(search || status);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Market updates</h1>
          <p>Write useful local insights, preview them, and control what is public.</p>
        </div>
        <Link className="button button-primary" href="/admin/market-updates/new">
          Write update
        </Link>
      </header>
      <section className="admin-panel">
        <form className="admin-filter-bar" method="get">
          <div className="field">
            <label htmlFor="market-update-search">Search updates</label>
            <input
              id="market-update-search"
              name="q"
              defaultValue={query.q ?? ""}
              placeholder="Title, summary, or author"
            />
          </div>
          <div className="field">
            <label htmlFor="market-update-status-filter">Status</label>
            <select
              id="market-update-status-filter"
              name="status"
              defaultValue={status}
            >
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="admin-filter-actions">
            <button className="button button-primary" type="submit">
              Apply filters
            </button>
            {filtersActive ? (
              <Link
                className="button button-secondary"
                href="/admin/market-updates"
              >
                Clear
              </Link>
            ) : null}
          </div>
        </form>
        <div className="admin-results-summary" aria-live="polite">
          Showing {updates.length} of {allUpdates.length} market updates
        </div>
        {updates.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Update</th>
                  <th>Status</th>
                  <th>Author</th>
                  <th>Updated</th>
                  <th>Public page</th>
                </tr>
              </thead>
              <tbody>
                {updates.map((update) => (
                  <tr key={update.id}>
                    <td data-label="Update">
                      <Link href={`/admin/market-updates/${update.id}`}>
                        {update.title}
                      </Link>
                      <br />
                      <span className="form-note">{update.excerpt}</span>
                    </td>
                    <td data-label="Status">
                      <span className="status-badge" data-status={update.status}>
                        {update.status}
                      </span>
                    </td>
                    <td data-label="Author">{update.author_name}</td>
                    <td data-label="Updated">{formatDate(update.updated_at)}</td>
                    <td data-label="Public page">
                      {update.status === "published" && update.published_at ? (
                        <Link
                          href={`/market-updates/${update.slug}`}
                          target="_blank"
                        >
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
            <h2>No updates match those filters</h2>
            <p>Clear the filters or try a broader search.</p>
            <Link className="button button-secondary" href="/admin/market-updates">
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="admin-empty">
            <h2>No market updates yet</h2>
            <p>
              Start with one clear takeaway from the Calgary market and explain
              what it means for buyers, sellers, or investors.
            </p>
            <Link
              className="button button-primary"
              href="/admin/market-updates/new"
            >
              Write the first update
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
