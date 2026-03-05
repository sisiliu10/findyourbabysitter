"use client";

import { useTranslations } from "next-intl";

const TRUST_ITEMS = [
  "Prenzlauer Berg",
  "Kreuzberg",
  "Mitte",
  "Friedrichshain",
  "Charlottenburg",
  "Schöneberg",
  "Neukölln",
  "Wedding",
  "Moabit",
  "Steglitz",
];

export function TrustBar() {
  const t = useTranslations("home");

  return (
    <section className="w-full border-y border-border-default overflow-hidden py-4">
      <div className="flex items-center">
        <span className="shrink-0 pl-6 pr-8 text-[10px] font-medium uppercase tracking-widest text-text-muted">
          {t("trustedBy")}
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="marquee-track flex gap-12">
            {[...TRUST_ITEMS, ...TRUST_ITEMS].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="shrink-0 text-sm font-medium uppercase tracking-wide text-text-tertiary whitespace-nowrap"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
