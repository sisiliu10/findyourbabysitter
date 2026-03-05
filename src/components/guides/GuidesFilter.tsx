"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Guide } from "@/data/guides";

const CATEGORIES = ["all", "cafes", "playgrounds", "activities"] as const;

export function GuidesFilter({ guides }: { guides: Guide[] }) {
  const t = useTranslations("guides");
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = guides.filter((g) => {
    if (category !== "all" && g.category !== category) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        g.title.toLowerCase().includes(q) ||
        g.metaDescription.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <>
      {/* Category pills */}
      <div className="flex flex-wrap items-center gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wide transition-colors ${
              category === cat
                ? "border border-text-primary bg-text-primary text-surface-primary"
                : "border border-border-default text-text-secondary hover:border-text-primary hover:text-text-primary"
            }`}
          >
            {t(cat)}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mt-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full max-w-md border border-border-default bg-surface-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-text-primary focus:outline-none"
        />
      </div>

      {/* Guide cards */}
      <div className="mt-10 grid grid-cols-1 gap-0 sm:grid-cols-3">
        {filtered.map((guide, i) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className={`group block py-8 sm:py-0 ${
              i < filtered.length - 1
                ? "border-b sm:border-b-0 sm:border-r border-border-default"
                : ""
            } ${i > 0 ? "sm:pl-10" : ""} ${i < filtered.length - 1 ? "sm:pr-10" : ""}`}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted mb-3">
              {t(guide.category)}
            </p>
            <h3 className="font-serif text-xl text-text-primary group-hover:text-accent transition-colors">
              {guide.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text-tertiary line-clamp-3">
              {guide.intro}
            </p>
            <p className="mt-4 text-xs text-text-muted">
              {t("updatedOn", { date: guide.updatedAt })}
            </p>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-text-tertiary sm:col-span-3">
            {t("noResults")}
          </p>
        )}
      </div>
    </>
  );
}
