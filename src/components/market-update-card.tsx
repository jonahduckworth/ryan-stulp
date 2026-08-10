import Image from "next/image";
import Link from "next/link";
import { calculateReadingTime } from "@/lib/market-updates";
import type { MarketUpdate } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function MarketUpdateCard({ update }: { update: MarketUpdate }) {
  return (
    <article className="market-update-card">
      <Link
        className="market-update-card-image"
        href={`/market-updates/${update.slug}`}
        aria-label={`Read ${update.title}`}
      >
        {update.cover_image_url ? (
          <Image
            src={update.cover_image_url}
            alt={update.cover_image_alt || ""}
            fill
            sizes="(max-width: 720px) 100vw, 50vw"
          />
        ) : (
          <span aria-hidden="true">Market perspective</span>
        )}
      </Link>
      <div className="market-update-card-copy">
        <p className="market-update-meta">
          {formatDate(update.published_at || update.updated_at)} ·{" "}
          {calculateReadingTime(update.body)} min read
        </p>
        <h2>
          <Link href={`/market-updates/${update.slug}`}>{update.title}</Link>
        </h2>
        <p>{update.excerpt}</p>
        <Link href={`/market-updates/${update.slug}`}>Read the update →</Link>
      </div>
    </article>
  );
}
