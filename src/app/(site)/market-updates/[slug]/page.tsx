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
  const title = update.seo_title || update.title;
  const description = update.seo_description || update.excerpt;
  const url = `${SITE.url}/market-updates/${update.slug}`;
  const coverImageUrl = update.cover_image_url
    ? new URL(update.cover_image_url, SITE.url).toString()
    : null;

  return {
    title,
    description,
    alternates: { canonical: `/market-updates/${update.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      locale: "en_CA",
      siteName: SITE.name,
      publishedTime: update.published_at || undefined,
      modifiedTime: update.updated_at,
      authors: [update.author_name],
      images: coverImageUrl
        ? [
            {
              url: coverImageUrl,
              alt: update.cover_image_alt || update.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: coverImageUrl ? [coverImageUrl] : undefined,
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
  const coverImageUrl = update.cover_image_url
    ? new URL(update.cover_image_url, SITE.url).toString()
    : null;

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
          image: coverImageUrl || undefined,
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
