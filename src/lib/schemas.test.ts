import { describe, expect, it } from "vitest";
import {
  leadSchema,
  listingSchema,
  marketUpdateSchema,
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
      areaKey: "southwest",
      mlsNumber: "",
      bedrooms: null,
      bathrooms: null,
      squareFeet: null,
      yearBuilt: null,
      description: "A complete property description with enough detail.",
      features: "South-facing yard\nDouble garage",
      propertyDetails: {
        parking: "Double garage",
        lotSize: "50 x 120 ft.",
        annualPropertyTax: null,
        monthlyCondoFee: null,
        transactionType: "",
        zoning: "",
        commercialUse: "",
        acreage: null,
        waterSource: "",
        wastewaterSystem: "",
        outbuildings: "",
      },
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
    expect(result.areaKey).toBe("southwest");
    expect(result.propertyDetails.parking).toBe("Double garage");
  });

  it("normalizes category-specific details", () => {
    const result = listingSchema.parse({
      title: "Foothills acreage",
      slug: "foothills-acreage",
      address: "100 Range Road",
      addressLine2: "",
      city: "Foothills County",
      province: "AB",
      postalCode: "",
      price: "1250000",
      status: "draft",
      listingType: "rural",
      propertyType: "Acreage",
      neighbourhood: "Foothills County",
      areaKey: "surrounding-area",
      mlsNumber: "",
      bedrooms: "4",
      bathrooms: "3",
      squareFeet: "2400",
      yearBuilt: "2010",
      description: "A complete rural property description with enough detail.",
      features: "",
      propertyDetails: {
        parking: null,
        lotSize: null,
        annualPropertyTax: null,
        monthlyCondoFee: null,
        transactionType: "",
        zoning: "Country residential",
        commercialUse: null,
        acreage: "8.25",
        waterSource: "Drilled well",
        wastewaterSystem: "Septic field",
        outbuildings: "Heated shop",
      },
      coverImageUrl: "",
      ctaLabel: "",
      ctaDestination: "",
      featured: false,
      seoTitle: "",
      seoDescription: "",
      socialImageUrl: "",
    });

    expect(result.propertyDetails.acreage).toBe(8.25);
    expect(result.propertyDetails.waterSource).toBe("Drilled well");
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

describe("marketUpdateSchema", () => {
  const baseUpdate = {
    title: "Calgary market update for August 2026",
    slug: "calgary-market-update-august-2026",
    excerpt:
      "A practical look at Calgary housing activity and what it may mean for your next move.",
    body: "A useful private draft with an early market observation.",
    status: "draft" as const,
    authorName: "Ryan Stulp",
    seoTitle: "",
    seoDescription: "",
  };

  it("accepts a concise private draft and normalizes optional SEO fields", () => {
    const result = marketUpdateSchema.parse(baseUpdate);
    expect(result.status).toBe("draft");
    expect(result.seoTitle).toBeNull();
  });

  it("requires useful depth before an update can be published", () => {
    const result = marketUpdateSchema.safeParse({
      ...baseUpdate,
      status: "published",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a substantive published update", () => {
    const result = marketUpdateSchema.safeParse({
      ...baseUpdate,
      status: "published",
      body: "Calgary market context ".repeat(20),
    });
    expect(result.success).toBe(true);
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
