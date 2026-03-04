import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LANDING_PAGES, getLandingPage } from "@/data/landing-pages";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { FAQ } from "@/components/landing/FAQ";
import { CrossLinks } from "@/components/landing/CrossLinks";
import { JsonLd } from "@/components/landing/JsonLd";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return LANDING_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = getLandingPage(slug, locale);
  if (!page) return {};

  const url = `https://berlinbabysitter.com/babysitter/${slug}`;

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url,
      siteName: "Berlin Babysitter",
      locale: locale === "de" ? "de_DE" : "en_US",
      type: "website",
    },
  };
}

export default async function LandingPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const page = getLandingPage(slug, locale);
  if (!page) notFound();

  const t = await getTranslations({ locale, namespace: "babysitter" });
  const isDistrict = page.type === "district";

  const mainJsonLd = isDistrict
    ? {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: `Berlin Babysitter - ${page.name}`,
        description: page.metaDescription,
        url: `https://berlinbabysitter.com/babysitter/${slug}`,
        areaServed: {
          "@type": "Place",
          name: `${page.name}, Berlin, Germany`,
          ...(page.latitude && page.longitude
            ? { geo: { "@type": "GeoCoordinates", latitude: page.latitude, longitude: page.longitude } }
            : {}),
        },
        serviceType: "Babysitting",
        priceRange: "12-25 EUR/hr",
      }
    : {
        "@context": "https://schema.org",
        "@type": "Service",
        name: `${page.name}-Speaking Babysitters in Berlin`,
        description: page.metaDescription,
        url: `https://berlinbabysitter.com/babysitter/${slug}`,
        areaServed: { "@type": "City", name: "Berlin, Germany" },
        serviceType: "Babysitting",
        availableLanguage: {
          "@type": "Language",
          name: page.name,
          ...(page.nativeName ? { alternateName: page.nativeName } : {}),
        },
      };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("home"), item: "https://berlinbabysitter.com" },
      { "@type": "ListItem", position: 2, name: page.h1, item: `https://berlinbabysitter.com/babysitter/${slug}` },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface-primary">
      <JsonLd data={mainJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-6 pt-6">
          <nav className="text-xs text-text-muted">
            <Link href="/" className="transition-colors hover:text-text-primary">{t("home")}</Link>
            <span className="mx-2">/</span>
            <span className="text-text-secondary">{page.h1}</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl">
            <h1 className="font-serif text-3xl leading-tight text-text-primary sm:text-4xl lg:text-5xl">
              {page.h1}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-text-secondary">
              {page.intro}
            </p>
            <div className="mt-8 flex items-center gap-6">
              <Link
                href="/register?role=PARENT"
                className="border border-text-primary bg-text-primary px-8 py-3.5 text-sm font-medium text-surface-primary transition-colors hover:bg-accent hover:border-accent"
              >
                {t("findBabysitter")}
              </Link>
              <Link
                href="/register?role=BABYSITTER"
                className="text-sm text-text-tertiary transition-colors hover:text-text-primary"
              >
                {t("iAmSitter")}
              </Link>
            </div>
          </div>
        </section>

        {/* About section */}
        <section className="border-t border-border-default">
          <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="text-xs font-medium uppercase tracking-wide text-text-muted mb-4">
                  {isDistrict ? t("about", { name: page.name }) : t("languageIn", { name: page.name })}
                </p>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {page.longDescription}
                </p>
                {isDistrict && (
                  <Link
                    href={`/babysitter/${slug}/playgrounds`}
                    className="mt-6 inline-flex items-center gap-2 text-sm text-accent transition-colors hover:text-text-primary"
                  >
                    {t("playgroundGuide", { district: page.name })}
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </Link>
                )}
              </div>
              <div className="lg:col-span-5">
                <p className="text-xs font-medium uppercase tracking-wide text-text-muted mb-4">
                  {t("highlights")}
                </p>
                <div className="space-y-0">
                  {page.highlights.map((highlight, i) => (
                    <div
                      key={i}
                      className={`flex gap-4 py-4 ${i < page.highlights.length - 1 ? "border-b border-border-default" : ""}`}
                    >
                      <span className="text-xs text-text-muted">{String(i + 1).padStart(2, "0")}</span>
                      <p className="text-sm text-text-secondary">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-border-default">
          <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
            <p className="text-xs uppercase tracking-wide text-text-muted mb-8">{t("howItWorks")}</p>
            <div className="grid grid-cols-1 gap-0 sm:grid-cols-3">
              {[
                { num: "01", title: t("verifiedProfiles"), desc: t("verifiedProfilesDesc") },
                { num: "02", title: t("backgroundChecks"), desc: t("backgroundChecksDesc") },
                { num: "03", title: t("honestReviews"), desc: t("honestReviewsDesc") },
              ].map((item, i) => (
                <div
                  key={item.num}
                  className={`py-8 sm:py-0 ${i < 2 ? "border-b sm:border-b-0 sm:border-r border-border-default sm:pr-10" : ""} ${i > 0 ? "sm:pl-10" : ""}`}
                >
                  <p className="text-xs text-text-muted mb-3">{item.num}</p>
                  <h3 className="text-sm font-medium text-text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-tertiary">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        {page.faqs.length > 0 && (
          <section className="border-t border-border-default">
            <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted mb-6">
                {t("frequentlyAsked")}
              </p>
              <div className="max-w-2xl">
                <FAQ items={page.faqs} />
              </div>
            </div>
          </section>
        )}

        {/* Cross-links */}
        <section className="border-t border-border-default">
          <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
            <CrossLinks current={page} locale={locale} />
          </div>
        </section>

        {/* CTA */}
        <section
          className="border-t border-border-default"
          style={{ background: "linear-gradient(135deg, #E8C9A0, #F2D9B6, #E0B88A, #E8C9A0)" }}
        >
          <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20 text-center">
            <h2 className="font-serif text-2xl text-text-primary sm:text-3xl">
              {t("readyToFind")}
            </h2>
            <p className="mt-3 text-sm text-text-primary/60">
              {t("joinFamilies")}
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
