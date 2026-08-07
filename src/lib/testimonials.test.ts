import { describe, expect, it } from "vitest";
import { FEATURED_TESTIMONIALS } from "./testimonials";

describe("featured testimonials", () => {
  it("features 10 unique five-star Google reviews", () => {
    const authors = FEATURED_TESTIMONIALS.map(({ author }) => author);

    expect(FEATURED_TESTIMONIALS).toHaveLength(10);
    expect(new Set(authors)).toHaveLength(10);
    expect(FEATURED_TESTIMONIALS.every(({ rating }) => rating === 5)).toBe(
      true,
    );
  });
});
