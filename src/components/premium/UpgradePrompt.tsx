"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface UpgradePromptProps {
  used: number;
  limit: number;
  type: "conversations" | "likes" | "requests";
}

export function UpgradePrompt({ used, limit, type }: UpgradePromptProps) {
  const t = useTranslations("premium");

  const typeLabel =
    type === "conversations"
      ? t("contactsThisWeek")
      : type === "likes"
        ? t("likesToday")
        : t("activeRequests");

  return (
    <div className="border border-accent/30 bg-accent-muted p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-accent/10">
          <svg
            className="h-4 w-4 text-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-text-primary">
            {t("limitReached", { used, limit })}
          </p>
          <p className="mt-0.5 text-xs text-text-secondary">{typeLabel}</p>
          <Link
            href="/pricing"
            className="mt-3 inline-block bg-accent px-4 py-2 text-xs font-medium text-white transition hover:bg-accent/90"
          >
            {t("upgradeToUnlock")}
          </Link>
        </div>
      </div>
    </div>
  );
}
