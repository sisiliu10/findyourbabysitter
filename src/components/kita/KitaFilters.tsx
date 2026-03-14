"use client";

import { useTranslations } from "next-intl";

interface KitaFiltersProps {
  query: string;
  district: string;
  minRating: string;
  hasSpots: boolean;
  openingHours: string;
  lastSyncDate: string | null;
  districts: { name: string; count: number }[];
  onQueryChange: (q: string) => void;
  onDistrictChange: (d: string) => void;
  onMinRatingChange: (r: string) => void;
  onHasSpotsChange: (v: boolean) => void;
  onOpeningHoursChange: (v: string) => void;
}

export function KitaFilters({
  query,
  district,
  minRating,
  hasSpots,
  openingHours,
  lastSyncDate,
  districts,
  onQueryChange,
  onDistrictChange,
  onMinRatingChange,
  onHasSpotsChange,
  onOpeningHoursChange,
}: KitaFiltersProps) {
  const t = useTranslations("kitaSearch");

  const syncDateLabel = lastSyncDate
    ? new Date(lastSyncDate).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* Search */}
      <div className="flex-1 min-w-[200px]">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full border border-border-default bg-surface-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-border-active"
        />
      </div>

      {/* District */}
      <div className="min-w-[160px]">
        <select
          value={district}
          onChange={(e) => onDistrictChange(e.target.value)}
          className="w-full border border-border-default bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-border-active"
        >
          <option value="">{t("allDistricts")}</option>
          {districts.map((d) => (
            <option key={d.name} value={d.name}>
              {d.name} ({d.count})
            </option>
          ))}
        </select>
      </div>

      {/* Opening Hours */}
      <div className="min-w-[175px]">
        <select
          value={openingHours}
          onChange={(e) => onOpeningHoursChange(e.target.value)}
          className="w-full border border-border-default bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-border-active"
        >
          <option value="">{t("allHours")}</option>
          <option value="early">{t("opensEarly")}</option>
          <option value="fullday">{t("openFullDay")}</option>
          <option value="extended">{t("openExtended")}</option>
        </select>
      </div>

      {/* Min Rating */}
      <div className="min-w-[130px]">
        <select
          value={minRating}
          onChange={(e) => onMinRatingChange(e.target.value)}
          className="w-full border border-border-default bg-surface-secondary px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-border-active"
        >
          <option value="">{t("minRating")}</option>
          <option value="3">3.0+</option>
          <option value="3.5">3.5+</option>
          <option value="4">4.0+</option>
          <option value="4.5">4.5+</option>
        </select>
      </div>

      {/* Available spots toggle */}
      <div className="flex flex-col gap-0.5">
        <label className="flex cursor-pointer items-center gap-2 border border-border-default bg-surface-secondary px-3 py-2 text-sm text-text-secondary transition-colors hover:border-border-hover">
          <input
            type="checkbox"
            checked={hasSpots}
            onChange={(e) => onHasSpotsChange(e.target.checked)}
            className="h-3.5 w-3.5"
          />
          {t("spotsAvailable")}
        </label>
        {syncDateLabel && (
          <span className="text-[10px] text-text-muted px-1">
            {t("dataAsOf")} {syncDateLabel}
          </span>
        )}
      </div>
    </div>
  );
}
