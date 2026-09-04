import { describe, expect, it, vi } from "vitest";
import {
  createResendRequester,
  parseCsv,
  readContacts,
  syncContact,
} from "./import-newsletter-contacts.mjs";

describe("newsletter contact import", () => {
  it("deduplicates normalized email addresses", () => {
    const result = readContacts(
      parseCsv(
        "First Name,Last Name,Email\nPat,Lee,PAT@example.test\nPat,Lee,pat@example.test\nSam,,sam@example.test\n",
      ),
    );
    expect(result.contacts).toHaveLength(2);
    expect(result.duplicateCount).toBe(1);
  });

  it("preserves a provider-side global unsubscribe without writing to Resend", async () => {
    const update = vi.fn();
    const resend = {
      contacts: {
        get: vi.fn().mockResolvedValue({
          data: { id: "contact-1", unsubscribed: true },
          error: null,
        }),
        topics: {
          list: vi.fn().mockResolvedValue({ data: { data: [] }, error: null }),
        },
        update,
      },
    };
    const result = await syncContact(
      resend,
      "segment-1",
      "topic-1",
      { firstName: "Pat", lastName: "Lee", email: "pat@example.test" },
      (operation) => operation(),
    );
    expect(result).toEqual({ id: "contact-1", subscriptionStatus: "unsubscribed" });
    expect(update).not.toHaveBeenCalled();
  });

  it("preserves a provider-side topic opt-out without writing to Resend", async () => {
    const update = vi.fn();
    const resend = {
      contacts: {
        get: vi.fn().mockResolvedValue({
          data: { id: "contact-2", unsubscribed: false },
          error: null,
        }),
        topics: {
          list: vi.fn().mockResolvedValue({
            data: { data: [{ id: "topic-1", subscription: "opt_out" }] },
            error: null,
          }),
        },
        update,
      },
    };
    const result = await syncContact(
      resend,
      "segment-1",
      "topic-1",
      { firstName: "Sam", lastName: "", email: "sam@example.test" },
      (operation) => operation(),
    );
    expect(result.subscriptionStatus).toBe("unsubscribed");
    expect(update).not.toHaveBeenCalled();
  });

  it("backs off and retries rate-limited Resend requests", async () => {
    const sleeps = [];
    const request = createResendRequester({
      minimumIntervalMs: 0,
      sleep: async (milliseconds) => sleeps.push(milliseconds),
      now: () => 0,
    });
    const operation = vi
      .fn()
      .mockResolvedValueOnce({ error: { statusCode: 429 } })
      .mockResolvedValueOnce({ error: { statusCode: 429 } })
      .mockResolvedValue({ data: { id: "ok" }, error: null });

    await expect(request(operation)).resolves.toEqual({
      data: { id: "ok" },
      error: null,
    });
    expect(operation).toHaveBeenCalledTimes(3);
    expect(sleeps).toEqual([1_000, 2_000]);
  });
});
