import type { Metadata } from "next";
import { ListingForm } from "@/components/admin/listing-form";

export const metadata: Metadata = { title: "New listing" };

export default function NewListingPage() {
  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Add listing</h1>
          <p>
            Enter the property details, create a private draft, then add photos
            and preview before publishing.
          </p>
        </div>
      </header>
      <ListingForm />
    </div>
  );
}
