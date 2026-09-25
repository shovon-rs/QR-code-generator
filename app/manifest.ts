import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "QR Generator",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f7f8f5",
    theme_color: "#22664e",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
