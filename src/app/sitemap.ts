import type { MetadataRoute } from "next";
import { LANDING_PAGES } from "@/data/landing-pages";

const BASE = "https://berlinbabysitter.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const landingPages = LANDING_PAGES.map((page) => ({
    url: `${BASE}/babysitter/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...landingPages,
  ];
}
