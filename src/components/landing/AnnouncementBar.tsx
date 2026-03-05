"use client";

import { useTranslations } from "next-intl";

export function AnnouncementBar() {
  const t = useTranslations("home");

  return (
    <div className="w-full bg-warning-muted py-2.5 text-center">
      <p className="text-xs font-medium tracking-wide text-text-secondary">
        {t("announcementBar")}
      </p>
    </div>
  );
}
