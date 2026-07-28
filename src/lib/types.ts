export type ListingStatus = "draft" | "active" | "pending" | "sold" | "archived";

export type Listing = {
  id: string;
  slug: string;
  title: string;
  address: string;
  city: string;
  province: string;
  postal_code: string | null;
  price: number | null;
  status: ListingStatus;
  property_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  description: string;
  features: string[];
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadStatus = "new" | "contacted" | "qualified" | "closed" | "archived";
export type LeadIntent = "buy" | "sell" | "invest" | "commercial" | "general";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  intent: LeadIntent;
  message: string;
  property_address: string | null;
  status: LeadStatus;
  source: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
