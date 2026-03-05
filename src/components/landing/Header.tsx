"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageToggle } from "@/components/LanguageToggle";

export function Header() {
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-border-default">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        {/* Desktop */}
        <div className="hidden min-h-14 items-center justify-between sm:flex">
          {/* Left: logo */}
          <Link
            href="/"
            className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-text-primary"
          >
            Berlin Babysitter
          </Link>

          {/* Center: nav links */}
          <nav className="flex items-center gap-8">
            <a
              href="#how-it-works"
              className="text-xs uppercase tracking-wide text-text-tertiary transition-colors hover:text-text-primary"
            >
              {t("howItWorks")}
            </a>
            <a
              href="#neighborhoods"
              className="text-xs uppercase tracking-wide text-text-tertiary transition-colors hover:text-text-primary"
            >
              {t("neighborhoods")}
            </a>
            <Link
              href="/guides"
              className="text-xs uppercase tracking-wide text-text-tertiary transition-colors hover:text-text-primary"
            >
              {t("guides")}
            </Link>
          </nav>

          {/* Right: language + CTA */}
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <Link
              href="/register"
              className="border border-text-primary bg-text-primary px-5 py-2 text-center text-xs font-medium uppercase tracking-wide text-surface-primary transition-colors hover:border-accent hover:bg-accent"
            >
              {t("getStarted")}
            </Link>
          </div>
        </div>

        {/* Mobile: single row */}
        <div className="flex min-h-14 items-center justify-between sm:hidden">
          <Link
            href="/"
            className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-text-primary"
          >
            Berlin Babysitter
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 p-2 -mr-2"
            aria-label={t("menu")}
            aria-expanded={menuOpen}
          >
            <span className="text-xs uppercase tracking-wide text-text-tertiary">
              {t("menu")}
            </span>
            <svg
              className="h-5 w-5 text-text-tertiary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile: expandable menu */}
        {menuOpen && (
          <nav className="flex flex-col gap-4 border-t border-border-default py-5 sm:hidden">
            <a
              href="#how-it-works"
              onClick={() => setMenuOpen(false)}
              className="text-xs uppercase tracking-wide text-text-tertiary transition-colors hover:text-text-primary"
            >
              {t("howItWorks")}
            </a>
            <a
              href="#neighborhoods"
              onClick={() => setMenuOpen(false)}
              className="text-xs uppercase tracking-wide text-text-tertiary transition-colors hover:text-text-primary"
            >
              {t("neighborhoods")}
            </a>
            <Link
              href="/guides"
              className="text-xs uppercase tracking-wide text-text-tertiary transition-colors hover:text-text-primary"
            >
              {t("guides")}
            </Link>
            <LanguageToggle />
            <div className="flex items-center gap-4 pt-2 border-t border-border-subtle">
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
                {t("getStarted")}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
