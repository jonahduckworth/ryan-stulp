import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketUpdateDetailView } from "@/components/market-update-detail-view";
import { getAdminMarketUpdate } from "@/lib/data/admin";

export const metadata: Metadata = {
  title: "Market update preview",
  robots: { index: false, follow: false },
};

export default async function MarketUpdatePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const marketUpdate = await getAdminMarketUpdate(id);
  if (!marketUpdate) notFound();

  return (
    <main id="main-content">
      <MarketUpdateDetailView update={marketUpdate} preview />
    </main>
  );
}
