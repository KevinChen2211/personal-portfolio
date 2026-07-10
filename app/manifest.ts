import type { MetadataRoute } from "next";
import { siteConfig } from "./lib/site";

// Generated /manifest.webmanifest — improves installability and gives mobile /
// search surfaces a name, theme color, and icon for the site.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FAF2E6",
    theme_color: "#FAF2E6",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
