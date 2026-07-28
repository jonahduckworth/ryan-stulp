import { describe, expect, it } from "vitest";
import {
  leadSchema,
  listingSchema,
  passwordSetupSchema,
} from "@/lib/schemas";

describe("leadSchema", () => {
  it("normalizes a valid lead", () => {
    const result = leadSchema.parse({
      name: " Ryan Stulp ",
      email: "RYAN@EXAMPLE.COM",
      phone: "",
      intent: "buy",
      message: "I am looking for a home in Calgary.",
      propertyAddress: "",
      source: "contact-page",
      website: "",
    });
    expect(result.email).toBe("ryan@example.com");
    expect(result.phone).toBeNull();
    expect(result.propertyAddress).toBeNull();
  });

  it("rejects bot honeypot and short messages", () => {
    const result = leadSchema.safeParse({
      name: "Bot",
      email: "bot@example.com",
      phone: "",
      intent: "general",
      message: "hello",
      propertyAddress: "",
      source: "contact-page",
      website: "spam.example",
    });
    expect(result.success).toBe(false);
  });
});

describe("listingSchema", () => {
  it("turns empty numeric fields into null values", () => {
    const result = listingSchema.parse({
      title: "Calgary family home",
      slug: "calgary-family-home",
      address: "123 Main Street",
      city: "Calgary",
      province: "AB",
      postalCode: "",
      price: null,
      status: "draft",
      propertyType: "Residential",
      bedrooms: null,
      bathrooms: null,
      squareFeet: null,
      description: "A complete property description with enough detail.",
      features: "South-facing yard\nDouble garage",
      coverImageUrl: "",
    });
    expect(result.price).toBeNull();
    expect(result.features).toEqual(["South-facing yard", "Double garage"]);
  });
});

describe("passwordSetupSchema", () => {
  it("accepts matching passwords with at least 12 characters", () => {
    expect(
      passwordSetupSchema.safeParse({
        password: "a-secure-password",
        confirmPassword: "a-secure-password",
      }).success,
    ).toBe(true);
  });

  it("rejects short or mismatched passwords", () => {
    expect(
      passwordSetupSchema.safeParse({
        password: "short",
        confirmPassword: "different",
      }).success,
    ).toBe(false);
  });
});
