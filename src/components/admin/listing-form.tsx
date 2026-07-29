"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  saveListing,
  type AdminFormState,
} from "@/app/actions/admin";
import {
  AREA_OPTIONS,
  isPublicListingStatus,
} from "@/lib/listing-options";
import type { Listing, ListingType } from "@/lib/types";

const initialAdminState: AdminFormState = {
  status: "idle",
  message: "",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}

function RequiredLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor}>
      {children} <span className="required-marker" aria-hidden="true">*</span>
      <span className="visually-hidden"> required</span>
    </label>
  );
}

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

function CharacterCount({
  current,
  maximum,
}: {
  current: number;
  maximum: number;
}) {
  return (
    <span className="character-count">
      {current}/{maximum}
    </span>
  );
}

export function ListingForm({ listing }: { listing?: Listing | null }) {
  const [state, action, pending] = useActionState(
    saveListing,
    initialAdminState,
  );
  const isNew = !listing;
  const originalStatus = listing?.status ?? "draft";
  const [status, setStatus] = useState(originalStatus);
  const [listingType, setListingType] = useState<ListingType>(
    listing?.listing_type ?? "residential",
  );
  const [address, setAddress] = useState(listing?.address ?? "");
  const [city, setCity] = useState(listing?.city ?? "Calgary");
  const [slug, setSlug] = useState(listing?.slug ?? "");
  const [slugCustomized, setSlugCustomized] = useState(Boolean(listing?.slug));
  const [seoTitle, setSeoTitle] = useState(listing?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(
    listing?.seo_description ?? "",
  );
  const [dirty, setDirty] = useState(false);
  const errorSummaryRef = useRef<HTMLParagraphElement>(null);
  const details = listing?.property_details;

  useEffect(() => {
    if (state.status === "error") errorSummaryRef.current?.focus();
  }, [state]);

  useEffect(() => {
    function warnAboutUnsavedChanges(event: BeforeUnloadEvent) {
      if (!dirty || pending) return;
      event.preventDefault();
    }
    window.addEventListener("beforeunload", warnAboutUnsavedChanges);
    return () =>
      window.removeEventListener("beforeunload", warnAboutUnsavedChanges);
  }, [dirty, pending]);

  function updateGeneratedSlug(nextAddress: string, nextCity = city) {
    if (!slugCustomized) setSlug(slugify(`${nextAddress}-${nextCity}`));
  }

  function confirmPublication(event: FormEvent<HTMLFormElement>) {
    if (
      !isPublicListingStatus(originalStatus) &&
      isPublicListingStatus(status) &&
      !window.confirm(
        "Publish this listing now? It will become visible on the public website immediately.",
      )
    ) {
      event.preventDefault();
    }
  }

  const saveLabel = isNew
    ? "Create draft and add photos"
    : !isPublicListingStatus(originalStatus) && isPublicListingStatus(status)
      ? "Publish listing"
      : "Save changes";

  return (
    <form
      className="admin-form"
      action={action}
      onChange={() => setDirty(true)}
      onSubmit={confirmPublication}
    >
      {listing ? <input type="hidden" name="id" value={listing.id} /> : null}
      {isNew ? <input type="hidden" name="status" value="draft" /> : null}

      <ol className="admin-progress field-full" aria-label="Listing setup steps">
        <li aria-current={isNew ? "step" : undefined}>
          <span>1</span>
          <strong>Property details</strong>
        </li>
        <li aria-current={!isNew ? "step" : undefined}>
          <span>2</span>
          <strong>Gallery and preview</strong>
        </li>
        <li>
          <span>3</span>
          <strong>Publish</strong>
        </li>
      </ol>

      {isNew ? (
        <div className="admin-notice field-full">
          <strong>Start safely as a draft.</strong>
          <p>
            Save the property details first. The next screen lets you upload and
            order multiple photos, choose the featured image, preview the page,
            and publish when it is ready.
          </p>
        </div>
      ) : null}

      <section className="admin-form-section" aria-labelledby="property-basics">
        <h2 id="property-basics">Property basics</h2>
        <p className="section-note field-full">
          Fields marked <span aria-hidden="true">*</span> are required.
        </p>
        <div className="field">
          <RequiredLabel htmlFor="title">Listing title</RequiredLabel>
          <input
            id="title"
            name="title"
            defaultValue={listing?.title}
            placeholder="Bright family home in Altadore"
            required
            {...errorProps(state, "title")}
          />
          <ErrorText state={state} field="title" />
        </div>
        <div className="field">
          <RequiredLabel htmlFor="slug">Page URL</RequiredLabel>
          <div className="input-with-prefix">
            <span aria-hidden="true">/listings/</span>
            <input
              id="slug"
              name="slug"
              value={slug}
              placeholder="123-main-street-calgary"
              required
              onChange={(event) => {
                setSlug(slugify(event.target.value));
                setSlugCustomized(true);
              }}
              {...errorProps(state, "slug")}
            />
          </div>
          <span className="field-help">
            Generated from the address. Edit only when a custom URL is needed.
          </span>
          <ErrorText state={state} field="slug" />
        </div>
        <div className="field field-full">
          <RequiredLabel htmlFor="address">Street address</RequiredLabel>
          <input
            id="address"
            name="address"
            value={address}
            required
            onChange={(event) => {
              const nextAddress = event.target.value;
              setAddress(nextAddress);
              updateGeneratedSlug(nextAddress);
            }}
            {...errorProps(state, "address")}
          />
          <ErrorText state={state} field="address" />
        </div>
        <div className="field field-full">
          <label htmlFor="addressLine2">Unit or address line 2</label>
          <input
            id="addressLine2"
            name="addressLine2"
            defaultValue={listing?.address_line_2 ?? ""}
          />
        </div>
        <div className="field">
          <RequiredLabel htmlFor="city">City</RequiredLabel>
          <input
            id="city"
            name="city"
            value={city}
            required
            onChange={(event) => {
              const nextCity = event.target.value;
              setCity(nextCity);
              updateGeneratedSlug(address, nextCity);
            }}
          />
        </div>
        <div className="field">
          <RequiredLabel htmlFor="province">Province</RequiredLabel>
          <input
            id="province"
            name="province"
            defaultValue={listing?.province ?? "AB"}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="postalCode">Postal code</label>
          <input
            id="postalCode"
            name="postalCode"
            defaultValue={listing?.postal_code ?? ""}
            autoComplete="postal-code"
          />
        </div>
        <div className="field">
          <label htmlFor="price">Price (CAD)</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            defaultValue={listing?.price ?? ""}
            {...errorProps(state, "price")}
          />
          <ErrorText state={state} field="price" />
        </div>
      </section>

      <section className="admin-form-section" aria-labelledby="listing-details">
        <h2 id="listing-details">Listing details</h2>
        {!isNew ? (
          <div className="field">
            <label htmlFor="status">Publication status</label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as Listing["status"])
              }
              {...errorProps(state, "status")}
            >
              <option value="draft">Draft (not public)</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
              <option value="archived">Archived (not public)</option>
            </select>
            <span className="field-help">
              Public statuses go live on save and require a featured gallery
              image.
            </span>
            <ErrorText state={state} field="status" />
          </div>
        ) : null}
        <div className="field">
          <label htmlFor="listingType">Listing category</label>
          <select
            id="listingType"
            name="listingType"
            value={listingType}
            onChange={(event) =>
              setListingType(event.target.value as ListingType)
            }
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="rural">Rural</option>
          </select>
        </div>
        <div className="field">
          <RequiredLabel htmlFor="propertyType">Property type</RequiredLabel>
          <input
            id="propertyType"
            name="propertyType"
            defaultValue={listing?.property_type ?? "Residential"}
            placeholder="Detached, apartment, retail, acreage…"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="neighbourhood">Community or municipality</label>
          <input
            id="neighbourhood"
            name="neighbourhood"
            defaultValue={listing?.neighbourhood ?? ""}
            placeholder="Altadore, Airdrie, Foothills County…"
          />
        </div>
        <div className="field">
          <label htmlFor="areaKey">Website area guide</label>
          <select
            id="areaKey"
            name="areaKey"
            defaultValue={listing?.area_key ?? ""}
          >
            <option value="">Not assigned</option>
            {AREA_OPTIONS.map((area) => (
              <option key={area.value} value={area.value}>
                {area.label}
              </option>
            ))}
          </select>
          <span className="field-help">
            Connects the listing to the matching Calgary-area guidance.
          </span>
        </div>
        <div className="field">
          <label htmlFor="mlsNumber">MLS number</label>
          <input
            id="mlsNumber"
            name="mlsNumber"
            defaultValue={listing?.mls_number ?? ""}
          />
        </div>
        {listingType !== "commercial" ? (
          <>
            <div className="field">
              <label htmlFor="bedrooms">Bedrooms</label>
              <input
                id="bedrooms"
                name="bedrooms"
                type="number"
                min="0"
                defaultValue={listing?.bedrooms ?? ""}
              />
            </div>
            <div className="field">
              <label htmlFor="bathrooms">Bathrooms</label>
              <input
                id="bathrooms"
                name="bathrooms"
                type="number"
                min="0"
                step="0.5"
                defaultValue={listing?.bathrooms ?? ""}
              />
            </div>
          </>
        ) : null}
        <div className="field">
          <label htmlFor="squareFeet">
            {listingType === "rural" ? "Building square feet" : "Square feet"}
          </label>
          <input
            id="squareFeet"
            name="squareFeet"
            type="number"
            min="1"
            defaultValue={listing?.square_feet ?? ""}
          />
        </div>
        <div className="field">
          <label htmlFor="yearBuilt">Year built</label>
          <input
            id="yearBuilt"
            name="yearBuilt"
            type="number"
            min="1800"
            max={new Date().getFullYear() + 2}
            defaultValue={listing?.year_built ?? ""}
          />
        </div>
        <label className="check-field field-full">
          <input
            name="featured"
            type="checkbox"
            defaultChecked={listing?.featured ?? false}
          />
          <span>
            <strong>Feature on the homepage</strong>
            <small>Featured properties are shown before other listings.</small>
          </span>
        </label>
      </section>

      <section
        className="admin-form-section"
        aria-labelledby="property-specific-details"
      >
        <h2 id="property-specific-details">
          {listingType === "residential"
            ? "Residential details"
            : listingType === "commercial"
              ? "Commercial details"
              : "Rural details"}
        </h2>
        <p className="section-note field-full">
          Only the fields relevant to this property category are shown.
        </p>
        {listingType === "residential" ? (
          <>
            <div className="field">
              <label htmlFor="parking">Parking</label>
              <input
                id="parking"
                name="parking"
                defaultValue={details?.parking ?? ""}
                placeholder="Double attached garage"
              />
            </div>
            <div className="field">
              <label htmlFor="lotSize">Lot size</label>
              <input
                id="lotSize"
                name="lotSize"
                defaultValue={details?.lotSize ?? ""}
                placeholder="50 × 120 ft."
              />
            </div>
            <div className="field">
              <label htmlFor="annualPropertyTax">
                Annual property tax (CAD)
              </label>
              <input
                id="annualPropertyTax"
                name="annualPropertyTax"
                type="number"
                min="0"
                step="1"
                defaultValue={details?.annualPropertyTax ?? ""}
              />
            </div>
            <div className="field">
              <label htmlFor="monthlyCondoFee">
                Monthly condo fee (CAD)
              </label>
              <input
                id="monthlyCondoFee"
                name="monthlyCondoFee"
                type="number"
                min="0"
                step="1"
                defaultValue={details?.monthlyCondoFee ?? ""}
              />
            </div>
          </>
        ) : null}
        {listingType === "commercial" ? (
          <>
            <div className="field">
              <label htmlFor="transactionType">Available for</label>
              <select
                id="transactionType"
                name="transactionType"
                defaultValue={details?.transactionType ?? ""}
              >
                <option value="">Not specified</option>
                <option value="sale">Sale</option>
                <option value="lease">Lease</option>
                <option value="sale-or-lease">Sale or lease</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="zoning">Zoning</label>
              <input
                id="zoning"
                name="zoning"
                defaultValue={details?.zoning ?? ""}
              />
            </div>
            <div className="field field-full">
              <label htmlFor="commercialUse">Current or intended use</label>
              <input
                id="commercialUse"
                name="commercialUse"
                defaultValue={details?.commercialUse ?? ""}
                placeholder="Retail, office, industrial, development land…"
              />
            </div>
          </>
        ) : null}
        {listingType === "rural" ? (
          <>
            <div className="field">
              <label htmlFor="acreage">Acreage</label>
              <input
                id="acreage"
                name="acreage"
                type="number"
                min="0"
                step="0.01"
                defaultValue={details?.acreage ?? ""}
              />
            </div>
            <div className="field">
              <label htmlFor="zoning">Land use or zoning</label>
              <input
                id="zoning"
                name="zoning"
                defaultValue={details?.zoning ?? ""}
              />
            </div>
            <div className="field">
              <label htmlFor="waterSource">Water source</label>
              <input
                id="waterSource"
                name="waterSource"
                defaultValue={details?.waterSource ?? ""}
                placeholder="Drilled well, municipal, cistern…"
              />
            </div>
            <div className="field">
              <label htmlFor="wastewaterSystem">Wastewater system</label>
              <input
                id="wastewaterSystem"
                name="wastewaterSystem"
                defaultValue={details?.wastewaterSystem ?? ""}
                placeholder="Septic field, holding tank…"
              />
            </div>
            <div className="field field-full">
              <label htmlFor="outbuildings">Outbuildings</label>
              <input
                id="outbuildings"
                name="outbuildings"
                defaultValue={details?.outbuildings ?? ""}
                placeholder="Shop, barn, detached garage…"
              />
            </div>
          </>
        ) : null}
      </section>

      <section className="admin-form-section" aria-labelledby="marketing-content">
        <h2 id="marketing-content">Marketing content</h2>
        <div className="field field-full">
          <RequiredLabel htmlFor="description">Description</RequiredLabel>
          <textarea
            id="description"
            name="description"
            defaultValue={listing?.description}
            required
            {...errorProps(state, "description")}
          />
          <ErrorText state={state} field="description" />
        </div>
        <div className="field field-full">
          <label htmlFor="features">Highlights (one per line)</label>
          <textarea
            id="features"
            name="features"
            defaultValue={listing?.features.join("\n")}
          />
        </div>
        <div className="admin-notice admin-notice-compact field-full">
          <strong>Property photography is managed in the next section.</strong>
          <p>
            The gallery supports multiple images, ordering, captions, alt text,
            and a featured cover image.
          </p>
        </div>
      </section>

      <section className="admin-form-section" aria-labelledby="call-to-action">
        <h2 id="call-to-action">Call to action</h2>
        <p className="section-note field-full">
          Leave these blank to use the standard listing inquiry button.
        </p>
        <div className="field">
          <label htmlFor="ctaLabel">Button label</label>
          <input
            id="ctaLabel"
            name="ctaLabel"
            defaultValue={listing?.cta_label ?? ""}
            placeholder="Book a private viewing"
          />
        </div>
        <div className="field">
          <label htmlFor="ctaDestination">Button destination</label>
          <input
            id="ctaDestination"
            name="ctaDestination"
            defaultValue={listing?.cta_destination ?? ""}
            placeholder="/contact or https://…"
            {...errorProps(state, "ctaDestination")}
          />
          <ErrorText state={state} field="ctaDestination" />
        </div>
      </section>

      <section className="admin-form-section" aria-labelledby="search-sharing">
        <h2 id="search-sharing">Search and sharing</h2>
        <div className="field field-full">
          <div className="label-row">
            <label htmlFor="seoTitle">SEO title</label>
            <CharacterCount current={seoTitle.length} maximum={70} />
          </div>
          <input
            id="seoTitle"
            name="seoTitle"
            value={seoTitle}
            onChange={(event) => setSeoTitle(event.target.value)}
            placeholder={listing?.title ?? "Defaults to the listing title"}
            maxLength={70}
          />
        </div>
        <div className="field field-full">
          <div className="label-row">
            <label htmlFor="seoDescription">SEO description</label>
            <CharacterCount current={seoDescription.length} maximum={180} />
          </div>
          <textarea
            id="seoDescription"
            name="seoDescription"
            value={seoDescription}
            onChange={(event) => setSeoDescription(event.target.value)}
            placeholder="Defaults to the first 155 characters of the description."
            maxLength={180}
          />
        </div>
        <div className="field field-full">
          <label htmlFor="socialImageUrl">Social sharing image URL</label>
          <input
            id="socialImageUrl"
            name="socialImageUrl"
            type="url"
            defaultValue={listing?.social_image_url ?? ""}
            placeholder="Defaults to the featured listing image."
            {...errorProps(state, "socialImageUrl")}
          />
          <ErrorText state={state} field="socialImageUrl" />
        </div>
      </section>

      <p
        ref={errorSummaryRef}
        className="form-status field-full"
        data-status={state.status}
        aria-live="polite"
        tabIndex={-1}
      >
        {state.message}
      </p>
      <div className="admin-actions admin-actions-sticky">
        <span className="form-note">
          {isNew
            ? "This creates a private draft and opens the gallery."
            : isPublicListingStatus(status)
              ? "Saving keeps this listing public immediately."
              : "Draft and archived listings are not public."}
        </span>
        <button className="button button-primary" disabled={pending}>
          {pending ? "Saving…" : saveLabel}
        </button>
      </div>
    </form>
  );
}
