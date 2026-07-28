import { describe, expect, it } from "vitest";
import { csvCell, rowsToCsv } from "@/lib/csv";

describe("csvCell", () => {
  it("escapes quotes and line breaks", () => {
    expect(csvCell('A "quoted"\nvalue')).toBe('"A ""quoted"" value"');
  });

  it("neutralizes spreadsheet formulas", () => {
    expect(csvCell("=HYPERLINK(\"https://example.com\")")).toBe(
      "\"'=HYPERLINK(\"\"https://example.com\"\")\"",
    );
    expect(csvCell("+1-587-555-0100")).toBe("\"'+1-587-555-0100\"");
  });
});

describe("rowsToCsv", () => {
  it("creates a CRLF-delimited CSV", () => {
    expect(
      rowsToCsv([
        ["Name", "Email"],
        ["Ryan", "ryan@example.com"],
      ]),
    ).toBe('"Name","Email"\r\n"Ryan","ryan@example.com"');
  });
});
