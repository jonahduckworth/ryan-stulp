import type { Metadata } from "next";
import { MarketUpdateForm } from "@/components/admin/market-update-form";

export const metadata: Metadata = { title: "New market update" };

export default function NewMarketUpdatePage() {
  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Write market update</h1>
          <p>
            Create a private draft first, then add a cover image, preview, and
            publish when it is ready.
          </p>
        </div>
      </header>
      <MarketUpdateForm />
    </div>
  );
}
