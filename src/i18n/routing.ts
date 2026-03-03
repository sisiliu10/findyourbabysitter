import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de"],
  defaultLocale: "en",
  // Default locale (English) has no prefix: /login, /dashboard
  // Other locales get a prefix: /de/login, /de/dashboard
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
