import { describe, expect, it } from "vitest";
import {
  leadSchema,
  listingSchema,
  passwordSetupSchema,
  siteSettingsSchema,
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
      addressLine2: "",
      city: "Calgary",
      province: "AB",
      postalCode: "",
      price: null,
      status: "draft",
      listingType: "residential",
      propertyType: "Residential",
      neighbourhood: "",
      mlsNumber: "",
      bedrooms: null,
      bathrooms: null,
      squareFeet: null,
      yearBuilt: null,
      description: "A complete property description with enough detail.",
      features: "South-facing yard\nDouble garage",
      coverImageUrl: "",
      ctaLabel: "",
      ctaDestination: "",
      featured: false,
      seoTitle: "",
      seoDescription: "",
      socialImageUrl: "",
    });
    expect(result.price).toBeNull();
    expect(result.features).toEqual(["South-facing yard", "Double garage"]);
  });
});

describe("siteSettingsSchema", () => {
  it("normalizes production website settings", () => {
    const result = siteSettingsSchema.parse({
      notificationEmail: "RYAN@EXAMPLE.COM",
      publicEmail: "hello@example.com",
      phoneDisplay: "(587) 839-1432",
      facebookUrl: "",
      bookingUrl: "",
      brokerageName: "The Real Estate District",
      brokerageAddress: "#375 7220 Fisher St SE, Calgary, AB T2H 2H8",
      licensedName: "Ryan Andrew Stulp",
      homepageEyebrow: "Calgary and area real estate",
      homepageTitle: "Make your next move with clarity.",
      homepageDescription:
        "Clear, practical guidance for buyers, sellers, and investors across Calgary and area.",
    });

    expect(result.notificationEmail).toBe("ryan@example.com");
    expect(result.facebookUrl).toBeNull();
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
