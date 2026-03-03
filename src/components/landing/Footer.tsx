"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DISTRICTS, LANGUAGES } from "@/data/landing-pages";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border-default">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-primary mb-4">
              Berlin Babysitter
            </p>
            <p className="text-xs leading-relaxed text-text-tertiary">
              {t("tagline")}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary mb-3">
              {t("neighborhoods")}
            </p>
            <div className="flex flex-col gap-1.5">
              {DISTRICTS.map((d) => (
                <Link
                  key={d.slug}
                  href={`/babysitter/${d.slug}`}
                  className="text-xs text-text-tertiary transition-colors hover:text-text-primary"
                >
                  {d.name}
                </Link>
              ))}
            </div>
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
              <Link href="/privacy-policy" className="text-xs text-text-tertiary transition-colors hover:text-text-primary">
                {t("privacyPolicy")}
              </Link>
              <Link href="/terms-of-service" className="text-xs text-text-tertiary transition-colors hover:text-text-primary">
                {t("termsOfService")}
              </Link>
              <Link href="/impressum" className="text-xs text-text-tertiary transition-colors hover:text-text-primary">
                {t("impressum")}
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-between border-t border-border-default pt-6">
          <span className="text-xs uppercase tracking-wide text-text-muted">
            Berlin Babysitter
          </span>
          <span className="text-xs text-text-muted">
            {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}
