import { describe, expect, it } from "vitest";
import { internalAnalyticsPath } from "@/lib/analytics";

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
