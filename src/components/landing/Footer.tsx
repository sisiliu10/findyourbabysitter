"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LANGUAGES } from "@/data/landing-pages";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border-default">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-primary mb-4">
              tottilotti
            </p>
            <p className="text-xs leading-relaxed text-text-tertiary">
              {t("tagline")}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary mb-3">
              {t("languages")}
            </p>
            <div className="flex flex-col gap-1.5">
              {LANGUAGES.map((l) => (
                <Link
                  key={l.slug}
                  href={`/babysitter/${l.slug}`}
                  className="text-xs text-text-tertiary transition-colors hover:text-text-primary"
                >
                  {l.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary mb-3">
              {t("legal")}
            </p>
            <div className="flex flex-col gap-1.5">
              <Link href="/guides" className="text-xs text-text-tertiary transition-colors hover:text-text-primary">
                {t("guides")}
              </Link>
              <Link href="/coloring-pages" className="text-xs text-text-tertiary transition-colors hover:text-text-primary">
                {t("coloringPages")}
              </Link>
              <Link href="/kita-search" className="text-xs text-text-tertiary transition-colors hover:text-text-primary">
                {t("kitaSearch")}
              </Link>
              <Link href="/impressum" className="text-xs text-text-tertiary transition-colors hover:text-text-primary">
                {t("legal")}
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-between border-t border-border-default pt-6">
          <span className="text-xs uppercase tracking-wide text-text-muted">
            tottilotti
          </span>
          <span className="text-xs text-text-muted">
            {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}
