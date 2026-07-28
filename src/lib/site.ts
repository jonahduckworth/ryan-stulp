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

export const NAV_ITEMS = [
  { href: "/listings", label: "Listings" },
  { href: "/buying-calgary", label: "Buy" },
  { href: "/selling-calgary", label: "Sell" },
  { href: "/about", label: "About" },
] as const;
