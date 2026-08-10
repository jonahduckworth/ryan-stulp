export type MarketUpdateContentBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export type MarketUpdateInlinePart =
  | { type: "text"; text: string }
  | { type: "link"; text: string; href: string; external: boolean };

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

function isSafeMarketUpdateLink(href: string) {
  if (href.startsWith("/") && !href.startsWith("//")) return true;
  try {
    const url = new URL(href);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function parseMarketUpdateInline(
  text: string,
): MarketUpdateInlinePart[] {
  const parts: MarketUpdateInlinePart[] = [];
  const linkPattern = /\[([^\]]+)]\(([^)\s]+)\)/g;
  let cursor = 0;

  for (const match of text.matchAll(linkPattern)) {
    const index = match.index;
    if (index > cursor) {
      parts.push({ type: "text", text: text.slice(cursor, index) });
    }
    const [source, label, href] = match;
    if (isSafeMarketUpdateLink(href)) {
      parts.push({
        type: "link",
        text: label,
        href,
        external: !href.startsWith("/"),
      });
    } else {
      parts.push({ type: "text", text: source });
    }
    cursor = index + source.length;
  }

  if (cursor < text.length) {
    parts.push({ type: "text", text: text.slice(cursor) });
  }
  return parts.length ? parts : [{ type: "text", text }];
}
