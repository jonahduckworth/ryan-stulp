"use client";

import { useMemo, useState } from "react";
import { ListingCard } from "@/components/listing-card";
import type {
  Listing,
  ListingStatus,
  ListingType,
} from "@/lib/types";

const TYPE_OPTIONS: Array<{ value: "all" | ListingType; label: string }> = [
  { value: "all", label: "All properties" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "rural", label: "Rural" },
];

const STATUS_OPTIONS: Array<{ value: "all" | ListingStatus; label: string }> = [
  { value: "all", label: "Any status" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "sold", label: "Recently sold" },
];

export function ListingExplorer({ listings }: { listings: Listing[] }) {
  const [listingType, setListingType] = useState<"all" | ListingType>("all");
  const [status, setStatus] = useState<"all" | ListingStatus>("all");
  const [area, setArea] = useState("all");

  const areas = useMemo(
    () =>
      Array.from(
        new Set(
          listings.map((listing) => listing.neighbourhood || listing.city),
        ),
      ).sort((left, right) => left.localeCompare(right)),
    [listings],
  );

  const filteredListings = useMemo(
    () =>
      listings.filter(
        (listing) =>
          (listingType === "all" || listing.listing_type === listingType) &&
          (status === "all" || listing.status === status) &&
          (area === "all" ||
            (listing.neighbourhood || listing.city) === area),
      ),
    [area, listingType, listings, status],
  );

  const hasFilters =
    listingType !== "all" || status !== "all" || area !== "all";

  return (
    <div className="listing-explorer">
      <div className="listing-filters" aria-label="Filter listings">
        <fieldset>
          <legend>Property category</legend>
          <div className="filter-pills">
            {TYPE_OPTIONS.map((option) => (
              <button
                type="button"
                key={option.value}
                aria-pressed={listingType === option.value}
                onClick={() => setListingType(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="listing-filter-selects">
          <label>
            <span>Status</span>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as "all" | ListingStatus)
              }
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Area</span>
            <select value={area} onChange={(event) => setArea(event.target.value)}>
              <option value="all">All available areas</option>
              {areas.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="listing-results-summary">
        <p aria-live="polite">
          Showing {filteredListings.length} of {listings.length}{" "}
          {listings.length === 1 ? "property" : "properties"}
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={() => {
              setListingType("all");
              setStatus("all");
              setArea("all");
            }}
          >
            Clear filters
          </button>
        ) : null}
      </div>
      {filteredListings.length ? (
        <div className="listing-grid">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="listing-filter-empty">
          <h2>No properties match those filters.</h2>
          <p>Clear the filters or tell Ryan what you are looking for.</p>
        </div>
      )}
    </div>
  );
}
