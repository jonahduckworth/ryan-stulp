import { SITE } from "@/lib/site";

export function GET() {
  return new Response(
    [
      "# Ryan Stulp Real Estate",
      "",
      `> Official website for Ryan Stulp, a licensed real estate professional with ${SITE.brokerage} in Calgary, Alberta.`,
      "",
      "## Primary pages",
      `- ${SITE.url}/about`,
      `- ${SITE.url}/listings`,
      `- ${SITE.url}/buying-calgary`,
      `- ${SITE.url}/selling-calgary`,
      `- ${SITE.url}/home-evaluation`,
      `- ${SITE.url}/contact`,
      "",
      "## Contact",
      `- Email: ${SITE.email}`,
      `- Phone: ${SITE.phoneDisplay}`,
      "",
      "Public listing information may change. Confirm availability and property details directly with Ryan.",
    ].join("\n"),
    { headers: { "content-type": "text/plain; charset=utf-8" } },
  );
}
