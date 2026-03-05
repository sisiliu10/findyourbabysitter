"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageToggle } from "@/components/LanguageToggle";

export function Header() {
  const t = useTranslations("nav");

  return (
    <header className="border-b border-border-default">
      <div className="mx-auto flex min-h-14 max-w-7xl flex-wrap items-center justify-between gap-x-4 px-4 sm:px-6">
        <Link href="/" className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-text-primary">
          Berlin Babysitter
        </Link>
        <div className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/guides"
            className="text-xs uppercase tracking-wide text-text-tertiary transition-colors hover:text-text-primary"
          >
            {t("guides")}
          </Link>
          <LanguageToggle />
          <Link
            href="/login"
            className="min-w-[5.5rem] text-center text-xs uppercase tracking-wide text-text-tertiary transition-colors hover:text-text-primary"
          >
            {t("login")}
          </Link>
          <Link
            href="/register"
            className="min-w-[8.5rem] border border-text-primary bg-text-primary px-5 py-2 text-center text-xs font-medium uppercase tracking-wide text-surface-primary transition-colors hover:bg-accent hover:border-accent"
          >
            {t("signup")}
          </Link>
        </div>
      </div>
    </header>
  );
}
