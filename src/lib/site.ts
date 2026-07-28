import type { PublicSiteSettings } from "@/lib/types";

export const SITE = {
  name: "Ryan Stulp Real Estate",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ryanstulp.ca",
  phoneDisplay: "(587) 839-1432",
  phoneHref: "tel:+15878391432",
  email: "ryanstulp@gmail.com",
  facebook: "https://www.facebook.com/ryanstulprealtor",
  brokerage: "The Real Estate District",
  licensedName: "Ryan Andrew Stulp",
  address: "#375 7220 Fisher St SE, Calgary, AB T2H 2H8",
} as const;

export type PublicSiteIdentity = {
  name: string;
  url: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  facebook: string;
  bookingUrl: string | null;
  brokerage: string;
  licensedName: string;
  address: string;
  homepageEyebrow: string;
  homepageTitle: string;
  homepageDescription: string;
};

export function resolveSiteIdentity(
  settings?: PublicSiteSettings | null,
): PublicSiteIdentity {
  const phoneDisplay = settings?.phone_display || SITE.phoneDisplay;
  const phoneDigits = phoneDisplay.replace(/\D/g, "");
  const phoneHref =
    phoneDigits.length === 10
      ? `tel:+1${phoneDigits}`
      : phoneDigits
        ? `tel:+${phoneDigits}`
        : SITE.phoneHref;

  return {
    name: SITE.name,
    url: SITE.url,
    phoneDisplay,
    phoneHref,
    email: settings?.public_email || SITE.email,
    facebook: settings?.facebook_url || SITE.facebook,
    bookingUrl: settings?.booking_url || null,
    brokerage: settings?.brokerage_name || SITE.brokerage,
    licensedName: settings?.licensed_name || SITE.licensedName,
    address: settings?.brokerage_address || SITE.address,
    homepageEyebrow:
      settings?.homepage_eyebrow || "Calgary and area real estate",
    homepageTitle:
      settings?.homepage_title || "Make your next move with clarity.",
    homepageDescription:
      settings?.homepage_description ||
      "Whether you're buying your first home, selling, investing, or planning a development, Ryan gives you a clear read on the market and a practical path forward.",
  };
}

export const NAV_ITEMS = [
  { href: "/listings", label: "Listings" },
  { href: "/buying-calgary", label: "Buy" },
  { href: "/selling-calgary", label: "Sell" },
  { href: "/calgary-areas", label: "Areas" },
  { href: "/about", label: "About" },
] as const;
