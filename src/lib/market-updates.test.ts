import { describe, expect, it } from "vitest";
import {
  calculateReadingTime,
  parseMarketUpdateBody,
} from "@/lib/market-updates";

describe("calculateReadingTime", () => {
  it("returns at least one minute", () => {
    expect(calculateReadingTime("A short update.")).toBe(1);
  });

  it("rounds longer articles up to the next minute", () => {
    expect(calculateReadingTime("word ".repeat(221))).toBe(2);
  });
});

describe("parseMarketUpdateBody", () => {
  it("turns the editor format into safe content blocks", () => {
    expect(
      parseMarketUpdateBody(
        "Opening context.\n\n## What changed\n\n- Sales increased\n- Inventory tightened\n\n### For buyers\n\nCompare the details\nacross property types.",
      ),
    ).toEqual([
      { type: "paragraph", text: "Opening context." },
      { type: "heading", level: 2, text: "What changed" },
      {
        type: "list",
        items: ["Sales increased", "Inventory tightened"],
      },
      { type: "heading", level: 3, text: "For buyers" },
      {
        type: "paragraph",
        text: "Compare the details across property types.",
      },
    ]);
  });

  it("normalizes Windows line endings", () => {
    expect(parseMarketUpdateBody("First.\r\n\r\nSecond.")).toEqual([
      { type: "paragraph", text: "First." },
      { type: "paragraph", text: "Second." },
    ]);
  });
});
