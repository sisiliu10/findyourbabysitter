"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageToggle } from "@/components/LanguageToggle";

export function Header() {
  const t = useTranslations("nav");

  return (
    <header className="border-b border-border-default">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        {/* Primary row: logo + main actions */}
        <div className="flex min-h-14 items-center justify-between gap-4">
          <Link href="/" className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-text-primary">
            Berlin Babysitter
          </Link>

          {/* Desktop: everything in one row */}
          <nav className="hidden items-center gap-6 sm:flex">
            <Link
              href="/guides"
              className="text-xs uppercase tracking-wide text-text-tertiary transition-colors hover:text-text-primary"
            >
              {t("guides")}
            </Link>
            <LanguageToggle />
            <Link
              href="/login"
              className="text-xs uppercase tracking-wide text-text-tertiary transition-colors hover:text-text-primary"
            >
              {t("login")}
            </Link>
            <Link
              href="/register"
              className="border border-text-primary bg-text-primary px-5 py-2 text-center text-xs font-medium uppercase tracking-wide text-surface-primary transition-colors hover:border-accent hover:bg-accent"
            >
              {t("signup")}
            </Link>
          </nav>

          {/* Mobile: primary actions only */}
          <div className="flex items-center gap-4 sm:hidden">
            <Link
              href="/login"
              className="text-xs uppercase tracking-wide text-text-tertiary transition-colors hover:text-text-primary"
            >
              {t("login")}
            </Link>
            <Link
              href="/register"
              className="border border-text-primary bg-text-primary px-4 py-2 text-center text-xs font-medium uppercase tracking-wide text-surface-primary transition-colors hover:border-accent hover:bg-accent"
            >
              {t("signup")}
            </Link>
          </div>
        </div>

        {/* Mobile: secondary nav row */}
        <div className="flex items-center gap-5 pb-3 sm:hidden">
          <Link
            href="/guides"
            className="text-xs uppercase tracking-wide text-text-tertiary transition-colors hover:text-text-primary"
          >
            {t("guides")}
          </Link>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
