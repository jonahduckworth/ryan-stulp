import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function ListingCard({ listing }: { listing: Listing }) {
  const details = [
    listing.bedrooms !== null ? `${listing.bedrooms} bed` : null,
    listing.bathrooms !== null ? `${listing.bathrooms} bath` : null,
    listing.square_feet !== null
      ? `${listing.square_feet.toLocaleString("en-CA")} sq. ft.`
      : null,
  ].filter(Boolean);

  return (
    <article className="listing-card">
      <div className="listing-image">
        {listing.cover_image_url ? (
          <Image
            src={listing.cover_image_url}
            alt={`Exterior or interior view of ${listing.address}`}
            fill
            sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 33vw"
          />
        ) : null}
        <span className="listing-status">{listing.status}</span>
      </div>
      <div className="listing-copy">
        <p className="listing-price">{formatCurrency(listing.price)}</p>
        <h3>{listing.title}</h3>
        <p>{listing.address}</p>
        <p className="listing-meta">{details.join(" · ")}</p>
        <Link href={`/listings/${listing.slug}`}>View property</Link>
      </div>
    </article>
  );
}
