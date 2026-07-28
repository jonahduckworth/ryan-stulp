import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ryan Stulp Real Estate",
    short_name: "Ryan Stulp",
    description: "Calgary and area real estate guidance.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f6f2",
    theme_color: "#c91836",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
