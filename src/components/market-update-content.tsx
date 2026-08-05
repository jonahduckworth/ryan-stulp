import Link from "next/link";
import {
  parseMarketUpdateBody,
  parseMarketUpdateInline,
} from "@/lib/market-updates";

function InlineContent({ text }: { text: string }) {
  return parseMarketUpdateInline(text).map((part, index) =>
    part.type === "text" ? (
      part.text
    ) : part.external ? (
      <a
        href={part.href}
        key={`${part.href}-${index}`}
        rel="noreferrer"
        target="_blank"
      >
        {part.text}
      </a>
    ) : (
      <Link href={part.href} key={`${part.href}-${index}`}>
        {part.text}
      </Link>
    ),
  );
}

export function MarketUpdateContent({ body }: { body: string }) {
  const blocks = parseMarketUpdateBody(body);

  return (
    <div className="market-update-content">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        if (block.type === "heading") {
          return block.level === 2 ? (
            <h2 key={key}>
              <InlineContent text={block.text} />
            </h2>
          ) : (
            <h3 key={key}>
              <InlineContent text={block.text} />
            </h3>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={key}>
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>
                  <InlineContent text={item} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={key}>
            <InlineContent text={block.text} />
          </p>
        );
      })}
    </div>
  );
}
