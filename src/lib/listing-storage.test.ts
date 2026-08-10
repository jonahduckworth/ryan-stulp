import { describe, expect, it } from "vitest";
import { listingStoragePaths } from "@/lib/listing-storage";

describe("listingStoragePaths", () => {
  it("deduplicates gallery paths and includes an encoded bucket cover path", () => {
    expect(
      listingStoragePaths(
        ["listing-id/front door.jpg", "listing-id/kitchen.jpg"],
        "https://project.supabase.co/storage/v1/object/public/listing-media/listing-id/front%20door.jpg",
        "https://project.supabase.co",
      ),
    ).toEqual(["listing-id/front door.jpg", "listing-id/kitchen.jpg"]);
  });

  it("ignores cover images outside the configured listing-media bucket", () => {
    expect(
      listingStoragePaths(
        [],
        "https://images.example.com/property.jpg",
        "https://project.supabase.co",
      ),
    ).toEqual([]);
  });
});
