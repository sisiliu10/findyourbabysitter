"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center">
      {routing.locales.map((code, i) => (
        <span key={code} className="flex items-center">
          {i > 0 && (
            <span className="text-[10px] text-text-muted select-none">|</span>
          )}
          <button
            onClick={() => router.replace(pathname, { locale: code })}
            className={[
              "min-h-[44px] px-2 text-[10px] uppercase tracking-widest transition-colors",
              locale === code
                ? "text-text-primary border-b border-text-primary pb-px"
                : "text-text-muted hover:text-text-secondary",
            ].join(" ")}
            aria-current={locale === code ? "true" : undefined}
          >
            {code.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
