import { describe, expect, it } from "vitest";
import { formatCurrency, slugify } from "@/lib/utils";

describe("formatCurrency", () => {
  it("formats Canadian asking prices", () => {
    expect(formatCurrency(725000)).toContain("725,000");
  });

  it("handles confidential prices", () => {
    expect(formatCurrency(null)).toBe("Price on request");
  });
});

describe("slugify", () => {
  it("creates URL-safe listing slugs", () => {
    expect(slugify(" 123 Main St. SE ")).toBe("123-main-st-se");
  });
});
