"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  saveMarketUpdate,
  type AdminFormState,
} from "@/app/actions/admin";
import type { MarketUpdate, MarketUpdateStatus } from "@/lib/types";
import { slugify } from "@/lib/utils";

const initialState: AdminFormState = { status: "idle", message: "" };

function ErrorText({
  state,
  field,
}: {
  state: AdminFormState;
  field: string;
}) {
  const message = state.errors?.[field]?.[0];
  return message ? (
    <span className="field-error" id={`${field}-error`}>
      {message}
    </span>
  ) : null;
}

function errorProps(state: AdminFormState, field: string) {
  const hasError = Boolean(state.errors?.[field]?.[0]);
  return {
    "aria-invalid": hasError || undefined,
    "aria-describedby": hasError ? `${field}-error` : undefined,
  };
}

export function MarketUpdateForm({
  marketUpdate,
}: {
  marketUpdate?: MarketUpdate | null;
}) {
  const [state, action, pending] = useActionState(
    saveMarketUpdate,
    initialState,
  );
  const isNew = !marketUpdate;
  const originalStatus = marketUpdate?.status ?? "draft";
  const [status, setStatus] = useState<MarketUpdateStatus>(originalStatus);
  const [title, setTitle] = useState(marketUpdate?.title ?? "");
  const [slug, setSlug] = useState(marketUpdate?.slug ?? "");
  const [slugCustomized, setSlugCustomized] = useState(
    Boolean(marketUpdate?.slug),
  );
  const [excerpt, setExcerpt] = useState(marketUpdate?.excerpt ?? "");
  const [body, setBody] = useState(marketUpdate?.body ?? "");
  const [seoTitle, setSeoTitle] = useState(marketUpdate?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(
    marketUpdate?.seo_description ?? "",
  );
  const [dirty, setDirty] = useState(false);
  const errorSummaryRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.status === "error") errorSummaryRef.current?.focus();
  }, [state]);

  useEffect(() => {
    function warnAboutUnsavedChanges(event: BeforeUnloadEvent) {
      if (!dirty || pending) return;
      event.preventDefault();
      event.returnValue = "";
    }
    function confirmInternalNavigation(event: MouseEvent) {
      if (!dirty || pending) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (
        !link ||
        link.target === "_blank" ||
        link.href === window.location.href ||
        link.getAttribute("href")?.startsWith("#")
      ) {
        return;
      }
      if (
        !window.confirm(
          "You have unsaved market update changes. Leave this page and discard them?",
        )
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
    window.addEventListener("beforeunload", warnAboutUnsavedChanges);
    document.addEventListener("click", confirmInternalNavigation, true);
    return () => {
      window.removeEventListener("beforeunload", warnAboutUnsavedChanges);
      document.removeEventListener("click", confirmInternalNavigation, true);
    };
  }, [dirty, pending]);

  function confirmPublication(event: FormEvent<HTMLFormElement>) {
    if (
      originalStatus !== "published" &&
      status === "published" &&
      !window.confirm(
        "Publish this market update now? It will become visible on the public website immediately.",
      )
    ) {
      event.preventDefault();
    }
  }

  const saveLabel = isNew
    ? "Create draft"
    : originalStatus !== "published" && status === "published"
      ? "Publish update"
      : "Save changes";

  return (
    <form
      className="admin-form"
      action={action}
      onChange={() => setDirty(true)}
      onSubmit={confirmPublication}
    >
      {marketUpdate ? (
        <input type="hidden" name="id" value={marketUpdate.id} />
      ) : null}
      {isNew ? <input type="hidden" name="status" value="draft" /> : null}

      {isNew ? (
        <div className="admin-notice field-full">
          <strong>Start as a private draft.</strong>
          <p>
            Add the core copy first. The next screen lets you upload a cover
            image, preview the full article, and publish when it is ready.
          </p>
        </div>
      ) : null}

      <section className="admin-form-section" aria-labelledby="update-copy">
        <h2 id="update-copy">Article</h2>
        <div className="field field-full">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={title}
            maxLength={140}
            required
            placeholder="Calgary housing market update for August 2026"
            onChange={(event) => {
              const nextTitle = event.target.value;
              setTitle(nextTitle);
              if (!slugCustomized) setSlug(slugify(nextTitle));
            }}
            {...errorProps(state, "title")}
          />
          <span className="character-count">{title.length}/140</span>
          <ErrorText state={state} field="title" />
        </div>
        <div className="field field-full">
          <label htmlFor="slug">Page URL</label>
          <div className="input-with-prefix">
            <span aria-hidden="true">/market-updates/</span>
            <input
              id="slug"
              name="slug"
              value={slug}
              required
              placeholder="calgary-market-update-august-2026"
              onChange={(event) => {
                setSlug(slugify(event.target.value));
                setSlugCustomized(true);
              }}
              {...errorProps(state, "slug")}
            />
          </div>
          <span className="field-help">
            Generated from the title. Avoid changing it after publication.
          </span>
          <ErrorText state={state} field="slug" />
        </div>
        <div className="field field-full">
          <label htmlFor="excerpt">Short summary</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={excerpt}
            rows={3}
            maxLength={320}
            required
            placeholder="A concise summary of what changed, what it means, and who should pay attention."
            onChange={(event) => setExcerpt(event.target.value)}
            {...errorProps(state, "excerpt")}
          />
          <span className="character-count">{excerpt.length}/320</span>
          <ErrorText state={state} field="excerpt" />
        </div>
        <div className="field field-full market-update-body-field">
          <label htmlFor="body">Article body</label>
          <textarea
            id="body"
            name="body"
            value={body}
            rows={22}
            maxLength={50000}
            required
            placeholder={
              "Start with the clearest takeaway.\n\n## What changed\n\nExplain the data in plain language.\n\n- First useful point\n- Second useful point\n\n## What this means for buyers and sellers"
            }
            onChange={(event) => setBody(event.target.value)}
            {...errorProps(state, "body")}
          />
          <span className="field-help">
            Use blank lines between paragraphs. Start a subheading with ## and
            create a bullet list with - at the beginning of each line. Add a
            link with [link text](https://example.com).
          </span>
          <span className="character-count">
            {body.length.toLocaleString("en-CA")}/50,000
          </span>
          <ErrorText state={state} field="body" />
        </div>
      </section>

      <section
        className="admin-form-section"
        aria-labelledby="update-publication"
      >
        <h2 id="update-publication">Publication</h2>
        {!isNew ? (
          <div className="field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as MarketUpdateStatus)
              }
            >
              <option value="draft">Draft (not public)</option>
              <option value="published">Published</option>
              <option value="archived">Archived (not public)</option>
            </select>
            <span className="field-help">
              Publishing makes the article public immediately. Archiving keeps
              it in admin without a public page.
            </span>
          </div>
        ) : null}
        <div className="field">
          <label htmlFor="authorName">Author</label>
          <input
            id="authorName"
            name="authorName"
            defaultValue={marketUpdate?.author_name ?? "Ryan Stulp"}
            required
          />
        </div>
      </section>

      <section className="admin-form-section" aria-labelledby="update-seo">
        <h2 id="update-seo">Search and sharing</h2>
        <div className="field field-full">
          <label htmlFor="seoTitle">SEO title (optional)</label>
          <input
            id="seoTitle"
            name="seoTitle"
            value={seoTitle}
            maxLength={70}
            placeholder={title || "Uses the article title when left blank"}
            onChange={(event) => setSeoTitle(event.target.value)}
          />
          <span className="character-count">{seoTitle.length}/70</span>
        </div>
        <div className="field field-full">
          <label htmlFor="seoDescription">Meta description (optional)</label>
          <textarea
            id="seoDescription"
            name="seoDescription"
            value={seoDescription}
            rows={3}
            maxLength={180}
            placeholder="Uses the short summary when left blank"
            onChange={(event) => setSeoDescription(event.target.value)}
          />
          <span className="character-count">{seoDescription.length}/180</span>
        </div>
      </section>

      {state.status === "error" ? (
        <p
          className="form-error field-full"
          ref={errorSummaryRef}
          role="alert"
          tabIndex={-1}
        >
          {state.message}
        </p>
      ) : null}
      <div className="admin-actions admin-actions-sticky field-full">
        <button className="button button-primary" disabled={pending} type="submit">
          {pending ? "Saving…" : saveLabel}
        </button>
        <span className="form-note">
          {isNew
            ? "The draft stays private until Ryan publishes it."
            : "Preview before publishing or after major edits."}
        </span>
      </div>
    </form>
  );
}
