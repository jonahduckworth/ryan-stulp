import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
        pathname: "/storage/v1/object/public/**",
      },
      ...(supabaseHostname
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHostname,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/properties",
        destination: "/listings",
        permanent: true,
      },
      {
        source: "/property-listings",
        destination: "/listings",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/about-me",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/contact-me",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/buying-resources",
        destination: "/buying-calgary",
        permanent: true,
      },
      {
        source: "/selling-resources",
        destination: "/selling-calgary",
        permanent: true,
      },
      {
        source: "/product/268-madeira-place-ne",
        destination: "/listings",
        permanent: true,
      },
      {
        source: "/product-category/real-estate",
        destination: "/listings",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
