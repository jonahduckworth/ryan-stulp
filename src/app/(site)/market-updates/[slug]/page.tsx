import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { MarketUpdateDetailView } from "@/components/market-update-detail-view";
import { getPublishedMarketUpdateBySlug } from "@/lib/data/public";
import { SITE } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const update = await getPublishedMarketUpdateBySlug(slug);
  if (!update) return { title: "Market update not found" };

  return {
    title: update.seo_title || update.title,
    description: update.seo_description || update.excerpt,
    alternates: { canonical: `/market-updates/${update.slug}` },
    openGraph: {
      type: "article",
      publishedTime: update.published_at || undefined,
      modifiedTime: update.updated_at,
      authors: [update.author_name],
      images: update.cover_image_url
        ? [
            {
              url: update.cover_image_url,
              alt: update.cover_image_alt || update.title,
            },
          ]
        : undefined,
    },
  };
}

export default async function MarketUpdatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const update = await getPublishedMarketUpdateBySlug(slug);
  if (!update) notFound();
  const url = `${SITE.url}/market-updates/${update.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: update.title,
          description: update.seo_description || update.excerpt,
          url,
          mainEntityOfPage: url,
          image: update.cover_image_url || undefined,
          datePublished: update.published_at,
          dateModified: update.updated_at,
          author: {
            "@type": "Person",
            "@id": `${SITE.url}/#agent`,
            name: update.author_name,
          },
          publisher: {
            "@type": "Organization",
            name: SITE.name,
            url: SITE.url,
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: SITE.url,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Market updates",
              item: `${SITE.url}/market-updates`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: update.title,
              item: url,
            },
          ],
        }}
      />
      <MarketUpdateDetailView update={update} />
    </>
  );
}
