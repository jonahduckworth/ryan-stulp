import type { AreaKey } from "@/lib/listing-options";

export type ListingStatus = "draft" | "active" | "pending" | "sold" | "archived";
export type ListingType = "residential" | "commercial" | "rural";

export type ListingPropertyDetails = {
  parking: string | null;
  lotSize: string | null;
  annualPropertyTax: number | null;
  monthlyCondoFee: number | null;
  transactionType: "sale" | "lease" | "sale-or-lease" | null;
  zoning: string | null;
  commercialUse: string | null;
  acreage: number | null;
  waterSource: string | null;
  wastewaterSystem: string | null;
  outbuildings: string | null;
};

export type Listing = {
  id: string;
  slug: string;
  title: string;
  address: string;
  address_line_2: string | null;
  city: string;
  province: string;
  postal_code: string | null;
  price: number | null;
  status: ListingStatus;
  listing_type: ListingType;
  property_type: string;
  neighbourhood: string | null;
  area_key: AreaKey | null;
  mls_number: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  year_built: number | null;
  description: string;
  features: string[];
  property_details: ListingPropertyDetails;
  cover_image_url: string | null;
  cta_label: string | null;
  cta_destination: string | null;
  featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  social_image_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ListingMedia = {
  id: string;
  listing_id: string;
  storage_path: string;
  public_url: string;
  alt_text: string;
  caption: string | null;
  sort_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "won"
  | "lost"
  | "archived";
export type LeadIntent = "buy" | "sell" | "invest" | "commercial" | "general";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  intent: LeadIntent;
  message: string;
  property_address: string | null;
  listing_id: string | null;
  status: LeadStatus;
  source: string;
  notes: string | null;
  page_url: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  consent_version: string;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  id: boolean;
  notification_email: string | null;
  public_email: string | null;
  phone_display: string | null;
  facebook_url: string | null;
  booking_url: string | null;
  brokerage_name: string | null;
  brokerage_address: string | null;
  licensed_name: string | null;
  homepage_eyebrow: string | null;
  homepage_title: string | null;
  homepage_description: string | null;
  updated_at: string;
};

export type PublicSiteSettings = Pick<
  SiteSettings,
  | "id"
  | "public_email"
  | "phone_display"
  | "facebook_url"
  | "booking_url"
  | "brokerage_name"
  | "brokerage_address"
  | "licensed_name"
  | "homepage_eyebrow"
  | "homepage_title"
  | "homepage_description"
>;

export type MarketUpdateStatus = "draft" | "published" | "archived";

export type MarketUpdate = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: MarketUpdateStatus;
  author_name: string;
  cover_image_url: string | null;
  cover_image_path: string | null;
  cover_image_alt: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};
