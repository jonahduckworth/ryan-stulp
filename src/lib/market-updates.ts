export type MarketUpdateContentBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export function calculateReadingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function parseMarketUpdateBody(body: string): MarketUpdateContentBlock[] {
  return body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      if (chunk.startsWith("### ")) {
        return { type: "heading", level: 3, text: chunk.slice(4).trim() };
      }
      if (chunk.startsWith("## ")) {
        return { type: "heading", level: 2, text: chunk.slice(3).trim() };
      }

      const lines = chunk.split("\n").map((line) => line.trim());
      if (lines.every((line) => line.startsWith("- "))) {
        return {
          type: "list",
          items: lines.map((line) => line.slice(2).trim()).filter(Boolean),
        };
      }

      return {
        type: "paragraph",
        text: lines.join(" "),
      };
    });
}
