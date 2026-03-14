import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/babysitter/", "/guides/", "/coloring-pages/", "/register", "/login"],
      disallow: ["/dashboard/", "/admin/", "/api/", "/onboarding/", "/profile/"],
    },
    sitemap: "https://berlinbabysitter.com/sitemap.xml",
  };
}
