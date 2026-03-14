"use client";

import { useTranslations } from "next-intl";
import { AFFILIATE_PRODUCTS } from "@/data/affiliate-products";

interface AffiliateRecommendationsProps {
  locale: string;
  context: "booking" | "profile";
}

export function AffiliateRecommendations({
  locale,
  context,
}: AffiliateRecommendationsProps) {
  const t = useTranslations("affiliateRecommendations");
  const isDE = locale === "de";

  return (
    <div className="border border-border-default bg-surface-secondary p-6">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
        {context === "booking" ? t("bookingHeading") : t("profileHeading")}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {AFFILIATE_PRODUCTS.map((product) => (
          <a
            key={product.id}
            href={product.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group flex flex-col gap-2 bg-surface-tertiary p-4 transition hover:bg-accent-muted"
          >
            <span className="text-2xl" aria-hidden="true">
              {product.icon}
            </span>
            <p className="text-xs font-medium leading-snug text-text-primary group-hover:text-accent">
              {isDE ? product.nameDe : product.nameEn}
            </p>
            <p className="text-xs leading-relaxed text-text-tertiary">
              {isDE ? product.descDe : product.descEn}
            </p>
            <span className="mt-auto text-xs font-medium text-accent">
              {t("viewOnAmazon")}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
