import { describe, expect, it } from "vitest";
import {
  internalAnalyticsPath,
  linkAnalyticsEvent,
} from "@/lib/analytics";

describe("internalAnalyticsPath", () => {
  it("removes query strings and fragments from internal paths", () => {
    expect(
      internalAnalyticsPath(
        "/contact?listing=123%20Main%20Street&listingId=private#form",
      ),
    ).toBe("/contact");
  });

  it("does not report external, protocol-relative, phone, or email destinations", () => {
    expect(internalAnalyticsPath("https://example.com/contact")).toBeUndefined();
    expect(internalAnalyticsPath("//example.com/contact")).toBeUndefined();
    expect(internalAnalyticsPath("tel:+15875550100")).toBeUndefined();
    expect(internalAnalyticsPath("mailto:ryan@example.com")).toBeUndefined();
  });
});

describe("linkAnalyticsEvent", () => {
  it("preserves explicit event names", () => {
    expect(
      linkAnalyticsEvent({
        href: "/contact",
        explicitEvent: "listing_inquiry_click",
        isCta: true,
      }),
    ).toBe("listing_inquiry_click");
  });

  it("tracks phone, email, and general call-to-action clicks", () => {
    expect(
      linkAnalyticsEvent({
        href: "tel:+15878391432",
        isCta: true,
      }),
    ).toBe("phone_click");
    expect(
      linkAnalyticsEvent({
        href: "mailto:ryanstulp@gmail.com",
        isCta: true,
      }),
    ).toBe("email_click");
    expect(
      linkAnalyticsEvent({
        href: "/contact",
        isCta: true,
      }),
    ).toBe("cta_click");
  });

  it("ignores ordinary navigation links", () => {
    expect(
      linkAnalyticsEvent({
        href: "/about",
        isCta: false,
      }),
    ).toBeNull();
  });
});
