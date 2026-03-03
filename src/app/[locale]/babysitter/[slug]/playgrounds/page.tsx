import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getLandingPage } from "@/data/landing-pages";
import { getPlaygroundGuide } from "@/data/playground-guides";
import { getPlaygroundsWithRatings } from "@/lib/playground-ratings";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { CrossLinks } from "@/components/landing/CrossLinks";
import { JsonLd } from "@/components/landing/JsonLd";

// Use dynamic rendering to avoid generating static params that exceed Vercel Hobby limits
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getPlaygroundGuide(slug);
  if (!guide) return {};

  const url = `https://berlinbabysitter.com/babysitter/${slug}/playgrounds`;

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url,
      siteName: "Berlin Babysitter",
      locale: "en_US",
      type: "article",
    },
  };
}

export default async function PlaygroundGuidePage({ params }: PageProps) {
  const { locale, slug } = await params;
  const guide = getPlaygroundGuide(slug);
  if (!guide) notFound();

  const district = getLandingPage(slug);
  if (!district) notFound();

  const t = await getTranslations({ locale, namespace: "babysitter" });
  const playgrounds = await getPlaygroundsWithRatings(slug, guide.playgrounds);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.h1,
    description: guide.metaDescription,
    url: `https://berlinbabysitter.com/babysitter/${slug}/playgrounds`,
    publisher: {
      "@type": "Organization",
      name: "Berlin Babysitter",
      url: "https://berlinbabysitter.com",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("home"), item: "https://berlinbabysitter.com" },
      { "@type": "ListItem", position: 2, name: t("babysittersIn", { district: guide.districtName }), item: `https://berlinbabysitter.com/babysitter/${slug}` },
      { "@type": "ListItem", position: 3, name: t("playgrounds"), item: `https://berlinbabysitter.com/babysitter/${slug}/playgrounds` },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface-primary">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-6 pt-6">
          <nav className="text-xs text-text-muted">
            <Link href="/" className="transition-colors hover:text-text-primary">{t("home")}</Link>
            <span className="mx-2">/</span>
            <Link href={`/babysitter/${slug}`} className="transition-colors hover:text-text-primary">
              {t("babysittersIn", { district: guide.districtName })}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-text-secondary">{t("playgrounds")}</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted mb-4">
              {t("playgroundGuideLabel")}
            </p>
            <h1 className="font-serif text-3xl leading-tight text-text-primary sm:text-4xl lg:text-5xl">
              {guide.h1}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-text-secondary">
              {guide.intro}
            </p>
          </div>
        </section>

        {/* Playground entries */}
        {playgrounds.map((pg, index) => {
          const rating = pg.liveRating ?? pg.googleRating;
          const reviewCount = pg.liveReviewCount ?? pg.googleReviewCount;
          return (
          <section key={pg.name} className="border-t border-border-default">
            <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <p className="text-xs text-text-muted mb-3">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="font-serif text-2xl text-text-primary sm:text-3xl">
                    {pg.name}
                  </h2>
                  <p className="mt-2 text-xs text-text-muted">{pg.address}</p>
                  <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                    {pg.description}
                  </p>
                </div>
                <div className="lg:col-span-5">
                  <div className="mb-6">
                    <p className="text-xs font-medium uppercase tracking-wide text-text-muted mb-2">
                      {t("googleRating")}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const fill = Math.min(1, Math.max(0, rating - (star - 1)));
                          return (
                            <svg key={star} className="h-4 w-4" viewBox="0 0 20 20" fill="none">
                              <defs>
                                <linearGradient id={`star-${index}-${star}`}>
                                  <stop offset={`${fill * 100}%`} stopColor="#FBBC04" />
                                  <stop offset={`${fill * 100}%`} stopColor="#D1D5DB" />
                                </linearGradient>
                              </defs>
                              <path
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                fill={`url(#star-${index}-${star})`}
                              />
                            </svg>
                          );
                        })}
                      </div>
                      <span className="text-sm font-medium text-text-primary">{rating}</span>
                      <span className="text-xs text-text-muted">{t("reviews", { count: reviewCount.toLocaleString(locale) })}</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="text-xs font-medium uppercase tracking-wide text-text-muted mb-2">
                      {t("recommendedAges")}
                    </p>
                    <p className="text-sm text-text-secondary">{pg.ageRange}</p>
                  </div>
                  <p className="text-xs font-medium uppercase tracking-wide text-text-muted mb-4">
                    {t("whatMakesItSpecial")}
                  </p>
                  <div className="space-y-0">
                    {pg.highlights.map((h, i) => (
                      <div
                        key={i}
                        className={`flex gap-4 py-4 ${i < pg.highlights.length - 1 ? "border-b border-border-default" : ""}`}
                      >
                        <span className="text-xs text-text-muted">{String(i + 1).padStart(2, "0")}</span>
                        <p className="text-sm text-text-secondary">{h}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          );
        })}

        {/* Closing note */}
        <section className="border-t border-border-default">
          <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
            <div className="max-w-2xl">
              <p className="text-sm leading-relaxed text-text-secondary">
                {guide.closingNote}
              </p>
            </div>
          </div>
        </section>

        {/* Cross-links */}
        <section className="border-t border-border-default">
          <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
            <CrossLinks current={district} locale={locale} />
          </div>
        </section>

        {/* CTA */}
        <section
          className="border-t border-border-default"
          style={{ background: "linear-gradient(135deg, #E8C9A0, #F2D9B6, #E0B88A, #E8C9A0)" }}
        >
          <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20 text-center">
            <h2 className="font-serif text-2xl text-text-primary sm:text-3xl">
              {t("needSitter")}
            </h2>
            <p className="mt-3 text-sm text-text-primary/60">
              {t("findSitterKnowsPlaygrounds", { district: guide.districtName })}
            </p>
            <Link
              href="/register"
              className="mt-8 inline-block border border-text-primary bg-text-primary px-8 py-3.5 text-sm font-medium text-surface-primary transition-colors hover:bg-accent hover:border-accent"
            >
              {t("getStartedFree")}
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
