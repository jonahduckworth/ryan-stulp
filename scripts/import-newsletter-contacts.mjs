import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted && character === '"' && text[index + 1] === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (!quoted && character === ",") {
      row.push(cell);
      cell = "";
    } else if (!quoted && (character === "\n" || character === "\r")) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }
  row.push(cell);
  if (row.some((value) => value.trim())) rows.push(row);
  if (quoted) throw new Error("The CSV contains an unclosed quoted value.");
  return rows;
}

function normalizedHeader(value) {
  return value.trim().toLowerCase().replaceAll(/[^a-z0-9]/g, "");
}

function findColumn(headers, candidates) {
  return headers.findIndex((header) => candidates.includes(normalizedHeader(header)));
}

export function readContacts(rows) {
  if (rows.length < 2) throw new Error("The CSV needs a header and at least one contact.");
  const [headers, ...records] = rows;
  const firstNameIndex = findColumn(headers, ["firstname", "first"]);
  const lastNameIndex = findColumn(headers, ["lastname", "last"]);
  const emailIndex = findColumn(headers, ["email", "emailaddress"]);
  if (firstNameIndex < 0 || emailIndex < 0) {
    throw new Error("The CSV must include First Name and Email columns.");
  }

  const unique = new Map();
  let duplicateCount = 0;
  for (const [index, record] of records.entries()) {
    const email = (record[emailIndex] ?? "").trim().toLowerCase();
    const firstName = (record[firstNameIndex] ?? "").trim();
    const lastName = lastNameIndex >= 0 ? (record[lastNameIndex] ?? "").trim() : "";
    if (!firstName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error(`Invalid contact at CSV row ${index + 2}.`);
    }
    if (unique.has(email)) duplicateCount += 1;
    unique.set(email, { firstName, lastName, email });
  }
  return { contacts: [...unique.values()], duplicateCount };
}

function requiredEnvironment() {
  const keys = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "RESEND_API_KEY",
    "RESEND_MARKET_UPDATES_SEGMENT_ID",
    "RESEND_MARKET_UPDATES_TOPIC_ID",
  ];
  const missing = keys.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing environment: ${missing.join(", ")}`);
  return Object.fromEntries(keys.map((key) => [key, process.env[key]]));
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function createResendRequester({
  minimumIntervalMs = 225,
  sleep = delay,
  now = Date.now,
} = {}) {
  let nextRequestAt = 0;
  return async function resendRequest(operation) {
    let response;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const wait = Math.max(0, nextRequestAt - now());
      if (wait) await sleep(wait);
      nextRequestAt = now() + minimumIntervalMs;
      response = await operation();
      if (response.error?.statusCode !== 429) return response;
      await sleep(1_000 * 2 ** attempt);
    }
    return response;
  };
}

const resendRequest = createResendRequester();

export async function syncContact(
  resend,
  segmentId,
  topicId,
  contact,
  request = resendRequest,
) {
  const existing = await request(() =>
    resend.contacts.get({ email: contact.email }),
  );
  if (existing.error && existing.error.name !== "not_found") throw new Error(existing.error.message);
  if (!existing.data) {
    const created = await request(() =>
      resend.contacts.create({
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        unsubscribed: false,
        segments: [{ id: segmentId }],
        topics: [{ id: topicId, subscription: "opt_in" }],
      }),
    );
    if (created.error) throw new Error(created.error.message);
    return { id: created.data.id, subscriptionStatus: "subscribed" };
  }

  const currentTopics = await request(() =>
    resend.contacts.topics.list({ email: contact.email }),
  );
  if (currentTopics.error) throw new Error(currentTopics.error.message);
  const marketUpdateTopic = currentTopics.data.data.find(
    (topic) => topic.id === topicId,
  );
  if (
    existing.data.unsubscribed ||
    marketUpdateTopic?.subscription === "opt_out"
  ) {
    return { id: existing.data.id, subscriptionStatus: "unsubscribed" };
  }

  const updated = await request(() =>
    resend.contacts.update({
      email: contact.email,
      firstName: contact.firstName,
      lastName: contact.lastName,
      unsubscribed: false,
    }),
  );
  if (updated.error) throw new Error(updated.error.message);
  const segments = await request(() =>
    resend.contacts.segments.list({ email: contact.email }),
  );
  if (segments.error) throw new Error(segments.error.message);
  if (!segments.data.data.some((segment) => segment.id === segmentId)) {
    const added = await request(() =>
      resend.contacts.segments.add({ email: contact.email, segmentId }),
    );
    if (added.error) throw new Error(added.error.message);
  }
  const topics = await request(() =>
    resend.contacts.topics.update({
      email: contact.email,
      topics: [{ id: topicId, subscription: "opt_in" }],
    }),
  );
  if (topics.error) throw new Error(topics.error.message);
  return { id: existing.data.id, subscriptionStatus: "subscribed" };
}

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const path = args.find((argument) => !argument.startsWith("--"));
  if (!path) throw new Error("Usage: npm run newsletter:import -- /path/to/contacts.csv [--apply]");
  const { contacts, duplicateCount } = readContacts(parseCsv(await readFile(path, "utf8")));
  console.log(`Validated ${contacts.length} unique contacts (${duplicateCount} duplicate rows removed).`);
  if (!apply) {
    console.log("Dry run only. Add --apply after reviewing this count.");
    return;
  }

  const env = requiredEnvironment();
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  const resend = new Resend(env.RESEND_API_KEY);
  const confirmedAt = new Date().toISOString();
  const { data: batch, error: batchError } = await supabase
    .from("newsletter_consent_batches")
    .insert({
      source_name: "Approved former-client spreadsheet",
      confirmed_by: "Ryan Stulp",
      confirmation_note:
        "Ryan confirmed these former clients had consented and were within the applicable two-year window at import.",
      confirmed_at: confirmedAt,
    })
    .select("id")
    .single();
  if (batchError) throw batchError;

  let imported = 0;
  let preserved = 0;
  let failed = 0;
  for (const [index, contact] of contacts.entries()) {
    const { data: existing, error: readError } = await supabase
      .from("newsletter_contacts")
      .select("id, subscription_status")
      .eq("email", contact.email)
      .maybeSingle();
    if (readError) throw readError;
    if (existing && existing.subscription_status !== "subscribed") {
      preserved += 1;
      continue;
    }
    try {
      const syncResult = await syncContact(
        resend,
        env.RESEND_MARKET_UPDATES_SEGMENT_ID,
        env.RESEND_MARKET_UPDATES_TOPIC_ID,
        contact,
      );
      const payload = {
        first_name: contact.firstName,
        last_name: contact.lastName,
        email: contact.email,
        subscription_status: syncResult.subscriptionStatus,
        consent_source: "existing_client_batch",
        consent_confirmed_by: "Ryan Stulp",
        consent_confirmed_at: confirmedAt,
        consent_batch_id: batch.id,
        unsubscribed_at:
          syncResult.subscriptionStatus === "unsubscribed" ? confirmedAt : null,
        resend_contact_id: syncResult.id,
        resend_sync_status: "synced",
        resend_sync_error: null,
      };
      const result = existing
        ? await supabase.from("newsletter_contacts").update(payload).eq("id", existing.id)
        : await supabase.from("newsletter_contacts").insert(payload);
      if (result.error) throw result.error;
      if (syncResult.subscriptionStatus === "unsubscribed") preserved += 1;
      else imported += 1;
    } catch {
      failed += 1;
      console.error(`Failed contact ${index + 1}. Review the provider and database logs.`);
    }
  }
  console.log(`Imported ${imported}; preserved ${preserved} prior opt-outs/suppressions; failed ${failed}.`);
  if (failed) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
