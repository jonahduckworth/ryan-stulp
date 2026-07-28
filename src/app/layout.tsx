import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/analytics";
import { SITE } from "@/lib/site";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Ryan Stulp | Calgary Real Estate",
    template: "%s | Ryan Stulp",
  },
  description:
    "Clear, practical guidance for buying, selling, and investing in Calgary-area real estate with Ryan Stulp.",
  applicationName: "Ryan Stulp Real Estate",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: "Ryan Stulp Real Estate",
    title: "Ryan Stulp | Calgary Real Estate",
    description:
      "Clear, practical guidance for Calgary-area buyers, sellers, and investors.",
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: "Ryan Stulp | Calgary Real Estate",
    description:
      "Clear, practical guidance for Calgary-area buyers, sellers, and investors.",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f8f6f2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
