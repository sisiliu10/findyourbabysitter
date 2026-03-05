import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30, // Cache dynamic pages for 30s — revisiting a tab is instant
      static: 180,
    },
  },
};

export default withNextIntl(nextConfig);
