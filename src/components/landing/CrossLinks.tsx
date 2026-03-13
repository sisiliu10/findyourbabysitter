import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { DISTRICTS, LANGUAGES, type LandingPage } from "@/data/landing-pages";

const LANGUAGE_FLAGS: Record<string, string> = {
  english: "🇬🇧",
  german: "🇩🇪",
  spanish: "🇪🇸",
  french: "🇫🇷",
  russian: "🇷🇺",
  turkish: "🇹🇷",
  arabic: "🇸🇦",
  chinese: "🇨🇳",
  korean: "🇰🇷",
  japanese: "🇯🇵",
};

export async function CrossLinks({ current, locale }: { current: LandingPage; locale: string }) {
  const t = await getTranslations({ locale, namespace: "babysitter" });
  const isDistrict = current.type === "district";
  const siblings = isDistrict ? DISTRICTS : LANGUAGES;
  const otherType = isDistrict ? LANGUAGES : DISTRICTS;

  return (
    <div className="space-y-12">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-text-muted mb-4">
          {isDistrict ? t("otherNeighborhoods") : t("otherLanguages")}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {siblings
            .filter((p) => p.slug !== current.slug)
            .map((page) => {
              const flag = !isDistrict ? LANGUAGE_FLAGS[page.slug] : undefined;
              return (
                <Link
                  key={page.slug}
                  href={`/babysitter/${page.slug}`}
                  className="flex items-center gap-2.5 border border-border-default bg-surface-secondary px-4 py-3 transition-all hover:border-text-primary hover:bg-surface-tertiary"
                >
                  {flag && (
                    <span className="text-xl leading-none" role="img" aria-hidden="true">{flag}</span>
                  )}
                  <span className="flex flex-col">
                    <span className="text-xs font-medium text-text-primary leading-tight">{page.name}</span>
                    {!isDistrict && page.nativeName && page.nativeName !== page.name && (
                      <span className="text-[10px] text-text-tertiary leading-tight">{page.nativeName}</span>
                    )}
                  </span>
                </Link>
              );
            })}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-text-muted mb-4">
          {isDistrict ? t("browseByLanguage") : t("browseByNeighborhood")}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {otherType.map((page) => {
            const isLang = !isDistrict;
            const flag = LANGUAGE_FLAGS[page.slug];
            return (
              <Link
                key={page.slug}
                href={`/babysitter/${page.slug}`}
                className="group flex items-center gap-2.5 border border-border-default bg-surface-secondary px-4 py-3 transition-all hover:border-text-primary hover:bg-surface-tertiary"
              >
                {isLang && flag && (
                  <span className="text-xl leading-none" role="img" aria-hidden="true">{flag}</span>
                )}
                <span className="flex flex-col">
                  <span className="text-xs font-medium text-text-primary leading-tight">{page.name}</span>
                  {isLang && page.nativeName && page.nativeName !== page.name && (
                    <span className="text-[10px] text-text-tertiary leading-tight">{page.nativeName}</span>
                  )}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
