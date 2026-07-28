import type { Metadata } from "next";
import { ListingForm } from "@/components/admin/listing-form";

export const metadata: Metadata = { title: "New listing" };

export default function NewListingPage() {
  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Add listing</h1>
          <p>Save as a draft, or publish by choosing a public status.</p>
        </div>
      </header>
      <ListingForm />
    </div>
  );
}
