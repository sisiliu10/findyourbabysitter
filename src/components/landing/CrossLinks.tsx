import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { DISTRICTS, LANGUAGES, type LandingPage } from "@/data/landing-pages";

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
            .map((page) => (
              <Link
                key={page.slug}
                href={`/babysitter/${page.slug}`}
                className="border border-border-default p-3 text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
              >
                {page.name}
              </Link>
            ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-text-muted mb-4">
          {isDistrict ? t("browseByLanguage") : t("browseByNeighborhood")}
        </p>
        <div className="flex flex-wrap gap-2">
          {otherType.map((page) => (
            <Link
              key={page.slug}
              href={`/babysitter/${page.slug}`}
              className="border border-border-default px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
            >
              {page.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
