"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

export function BrowseFilters() {
  const t = useTranslations("browseRequests");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const city = searchParams.get("city") ?? "";
  const careType = searchParams.get("careType") ?? "";
  const careCategory = searchParams.get("careCategory") ?? "";

  return (
    <div className="flex flex-wrap gap-3">
      <input
        type="text"
        value={city}
        onChange={(e) => update("city", e.target.value)}
        placeholder={t("filterCity")}
        className="border border-border-default bg-surface-secondary px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:border-text-primary focus:outline-none"
      />
      <select
        value={careType}
        onChange={(e) => update("careType", e.target.value)}
        className="border border-border-default bg-surface-secondary px-3 py-2 text-sm text-text-primary focus:border-text-primary focus:outline-none"
      >
        <option value="">{t("allTypes")}</option>
        <option value="recurring">{t("recurring")}</option>
        <option value="occasional">{t("occasional")}</option>
      </select>
      <select
        value={careCategory}
        onChange={(e) => update("careCategory", e.target.value)}
        className="border border-border-default bg-surface-secondary px-3 py-2 text-sm text-text-primary focus:border-text-primary focus:outline-none"
      >
        <option value="">{t("allCategories")}</option>
        <option value="after_school">{t("cat_after_school")}</option>
        <option value="full_day">{t("cat_full_day")}</option>
        <option value="overnight">{t("cat_overnight")}</option>
        <option value="date_night">{t("cat_date_night")}</option>
        <option value="other">{t("cat_other")}</option>
      </select>
    </div>
  );
}
