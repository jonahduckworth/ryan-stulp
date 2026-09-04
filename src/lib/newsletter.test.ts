import { describe, expect, it } from "vitest";
import {
  buildNewsletterEmail,
  deliveryStatusFromWebhook,
  newsletterDeliveryDetail,
  normalizeNewsletterEmail,
} from "@/lib/newsletter";
import { resolveSiteIdentity } from "@/lib/site";

describe("newsletter contact helpers", () => {
  it("normalizes contact emails", () => {
    expect(normalizeNewsletterEmail(" Ryan@Example.COM ")).toBe("ryan@example.com");
  });
});

describe("buildNewsletterEmail", () => {
  it("creates safe branded HTML, a public article link, and an unsubscribe link", () => {
    const result = buildNewsletterEmail({
      title: "September <update>",
      excerpt: "A useful Calgary snapshot.",
      body: "## Inventory\n\nRead the [area guide](/calgary-areas).\n\n<script>alert(1)</script>",
      slug: "september-update",
      coverImageUrl: "/market-update-media/update-id",
      identity: resolveSiteIdentity(null),
    });

    expect(result.articleUrl).toBe("https://ryanstulp.ca/market-updates/september-update");
    expect(result.html).toContain("September &lt;update&gt;");
    expect(result.html).toContain('href="https://ryanstulp.ca/calgary-areas"');
    expect(result.html).toContain('src="https://ryanstulp.ca/market-update-media/update-id"');
    expect(result.html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(result.html).not.toContain("<script>alert(1)</script>");
    expect(result.html).toContain("{{{RESEND_UNSUBSCRIBE_URL}}}");
    expect(result.text).toContain("Unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}");
  });
});

describe("Resend delivery helpers", () => {
  it("stores operational events and ignores engagement events", () => {
    expect(deliveryStatusFromWebhook("email.delivered")).toBe("delivered");
    expect(deliveryStatusFromWebhook("email.delivery_delayed")).toBe("delivery_delayed");
    expect(deliveryStatusFromWebhook("email.opened")).toBeNull();
    expect(deliveryStatusFromWebhook("email.clicked")).toBeNull();
  });

  it("extracts a bounded delivery failure reason", () => {
    expect(
      newsletterDeliveryDetail("email.failed", {
        failed: { reason: "Mailbox unavailable" },
      }),
    ).toBe("Mailbox unavailable");
  });
});
