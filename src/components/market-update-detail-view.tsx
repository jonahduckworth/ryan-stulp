import Image from "next/image";
import Link from "next/link";
import { MarketUpdateContent } from "@/components/market-update-content";
import { calculateReadingTime } from "@/lib/market-updates";
import type { MarketUpdate } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function MarketUpdateDetailView({
  update,
  preview = false,
}: {
  update: MarketUpdate;
  preview?: boolean;
}) {
  return (
    <>
      {preview ? (
        <div className="preview-banner" role="status">
          Admin preview · This market update is not public unless its status is
          Published
        </div>
      ) : null}
      <article className="market-update-article">
        <header className="market-update-article-header">
          <div className="narrow stack">
            <Link className="eyebrow" href="/market-updates">
              Calgary market updates
            </Link>
            <h1 className="display">{update.title}</h1>
            <p className="lede">{update.excerpt}</p>
            <p className="market-update-meta">
              {formatDate(update.published_at || update.updated_at)} · By{" "}
              {update.author_name} · {calculateReadingTime(update.body)} min read
            </p>
          </div>
        </header>
        {update.cover_image_url ? (
          <div className="container market-update-cover">
            <Image
              src={update.cover_image_url}
              alt={update.cover_image_alt || ""}
              fill
              priority
              unoptimized={preview}
              sizes="(max-width: 1240px) 100vw, 1240px"
            />
          </div>
        ) : null}
        <div className="narrow market-update-reading-column">
          <MarketUpdateContent body={update.body} />
          <aside className="market-update-author">
            <span className="eyebrow">A practical next step</span>
            <h2>Want to know what this means for your plans?</h2>
            <p>
              Market-wide numbers are useful context. Your price range,
              property type, location, and timing determine the decision.
            </p>
            <Link className="button button-primary" href="/contact">
              Ask Ryan
            </Link>
          </aside>
        </div>
      </article>
    </>
  );
}
