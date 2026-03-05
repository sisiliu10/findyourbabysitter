import type { MetadataRoute } from "next";
import { LANDING_PAGES } from "@/data/landing-pages";
import { GUIDES } from "@/data/guides";
import { routing } from "@/i18n/routing";

const BASE = "https://berlinbabysitter.com";

const staticPaths = ["/", "/login", "/register", "/guides"];

export default function sitemap(): MetadataRoute.Sitemap {
  const alternateLanguages = (path: string) => ({
    en: path === "/" ? BASE : `${BASE}${path}`,
    de: path === "/" ? `${BASE}/de` : `${BASE}/de${path}`,
  });

  const staticPages = staticPaths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url:
        locale === routing.defaultLocale
          ? path === "/"
            ? BASE
            : `${BASE}${path}`
          : path === "/"
          ? `${BASE}/de`
          : `${BASE}/de${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
      alternates: { languages: alternateLanguages(path) },
    }))
  );

  const landingPages = LANDING_PAGES.flatMap((page) => {
    const path = `/babysitter/${page.slug}`;
    return routing.locales.map((locale) => ({
      url:
        locale === routing.defaultLocale
          ? `${BASE}${path}`
          : `${BASE}/de${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: { languages: alternateLanguages(path) },
    }));
  });

  const guidePages = GUIDES.flatMap((guide) => {
    const path = `/guides/${guide.slug}`;
    return routing.locales.map((locale) => ({
      url:
        locale === routing.defaultLocale
          ? `${BASE}${path}`
          : `${BASE}/de${path}`,
      lastModified: new Date(guide.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: { languages: alternateLanguages(path) },
    }));
  });

  return [...staticPages, ...landingPages, ...guidePages];
}
