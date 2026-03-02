import Link from "next/link";
import { DISTRICTS, LANGUAGES, type LandingPage } from "@/data/landing-pages";

export function CrossLinks({ current }: { current: LandingPage }) {
  const isDistrict = current.type === "district";
  const siblings = isDistrict ? DISTRICTS : LANGUAGES;
  const otherType = isDistrict ? LANGUAGES : DISTRICTS;

  return (
    <div className="space-y-12">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-text-muted mb-4">
          {isDistrict ? "Other neighborhoods" : "Other languages"}
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
          {isDistrict ? "Browse by language" : "Browse by neighborhood"}
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
