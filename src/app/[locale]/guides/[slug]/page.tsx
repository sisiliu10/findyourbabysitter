import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GUIDES, getGuide } from "@/data/guides";
import { DISTRICTS } from "@/data/landing-pages";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { JsonLd } from "@/components/landing/JsonLd";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getGuide(slug, locale);
  if (!guide) return {};

  const url = `https://berlinbabysitter.com/guides/${slug}`;

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url,
      siteName: "Berlin Babysitter",
      locale: locale === "de" ? "de_DE" : "en_US",
      type: "article",
    },
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const guide = getGuide(slug, locale);
  if (!guide) notFound();

  const t = await getTranslations({ locale, namespace: "guides" });

  const related = GUIDES.filter(
    (g) => g.category === guide.category && g.slug !== slug
  ).map((g) => getGuide(g.slug, locale)!);

  const neighborhoodDistricts = DISTRICTS.filter((d) =>
    guide.neighborhoods.includes(d.slug)
  );

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: guide.title,
    description: guide.metaDescription,
    url: `https://berlinbabysitter.com/guides/${slug}`,
    dateModified: guide.updatedAt,
    datePublished: guide.updatedAt,
    author: {
      "@type": "Organization",
      name: "Berlin Babysitter",
      url: "https://berlinbabysitter.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Berlin Babysitter",
      url: "https://berlinbabysitter.com",
    },
    about: {
      "@type": "Place",
      name: "Berlin, Germany",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("home"), item: "https://berlinbabysitter.com" },
      { "@type": "ListItem", position: 2, name: t("label"), item: "https://berlinbabysitter.com/guides" },
      { "@type": "ListItem", position: 3, name: guide.title, item: `https://berlinbabysitter.com/guides/${slug}` },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface-primary">
      <JsonLd data={blogPostingJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-6 pt-6">
          <nav className="text-xs text-text-muted">
            <Link href="/" className="transition-colors hover:text-text-primary">{t("home")}</Link>
            <span className="mx-2">/</span>
            <Link href="/guides" className="transition-colors hover:text-text-primary">{t("label")}</Link>
            <span className="mx-2">/</span>
            <span className="text-text-secondary">{guide.title}</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted mb-4">
              {t(guide.category)}
            </p>
            <h1 className="font-serif text-3xl leading-tight text-text-primary sm:text-4xl lg:text-5xl">
              {guide.title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-text-secondary">
              {guide.intro}
            </p>
            <p className="mt-4 text-xs text-text-muted">
              {t("updatedOn", { date: guide.updatedAt })}
            </p>
          </div>
        </section>

        {/* Content + sidebar */}
        <section className="border-t border-border-default">
          <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              {/* Main content */}
              <div className="lg:col-span-7">
                {guide.sections.map((section, i) => (
                  <div
                    key={i}
                    id={slugify(section.heading)}
                    className={i > 0 ? "mt-12 pt-12 border-t border-border-default" : ""}
                  >
                    <h2 className="font-serif text-2xl text-text-primary sm:text-3xl">
                      {section.heading}
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                      {section.content}
                    </p>
                    {section.items && section.items.length > 0 && (
                      <div className="mt-6 space-y-0">
                        {section.items.map((item, j) => (
                          <div
                            key={j}
                            className={`flex gap-4 py-4 ${j < section.items!.length - 1 ? "border-b border-border-default" : ""}`}
                          >
                            <span className="text-xs text-text-muted shrink-0">
                              {String(j + 1).padStart(2, "0")}
                            </span>
                            <p className="text-sm text-text-secondary">{item}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-8 space-y-10">
                  {/* Table of contents */}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-text-muted mb-4">
                      {t("tableOfContents")}
                    </p>
                    <div className="space-y-0">
                      {guide.sections.map((section, i) => (
                        <a
                          key={i}
                          href={`#${slugify(section.heading)}`}
                          className={`block py-3 text-sm text-text-tertiary transition-colors hover:text-text-primary ${
                            i < guide.sections.length - 1 ? "border-b border-border-default" : ""
                          }`}
                        >
                          {section.heading}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="border border-border-default p-6">
                    <p className="text-xs font-medium uppercase tracking-wide text-text-muted mb-3">
                      {t("needBabysitter")}
                    </p>
                    <p className="text-sm text-text-secondary mb-5">
                      {t("ctaSubtitle")}
                    </p>
                    <Link
                      href="/register"
                      className="block border border-text-primary bg-text-primary px-6 py-3 text-center text-sm font-medium text-surface-primary transition-colors hover:bg-accent hover:border-accent"
                    >
                      {t("findBabysitter")}
                    </Link>
                  </div>

                  {/* Browse by neighborhood */}
                  {neighborhoodDistricts.length > 0 && (
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-text-muted mb-4">
                        {t("browseSitters")}
                      </p>
                      <div className="space-y-0">
                        {neighborhoodDistricts.map((d, i) => (
                          <Link
                            key={d.slug}
                            href={`/babysitter/${d.slug}`}
                            className={`block py-3 text-sm text-text-tertiary transition-colors hover:text-text-primary ${
                              i < neighborhoodDistricts.length - 1 ? "border-b border-border-default" : ""
                            }`}
                          >
                            {d.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related guides */}
        {related.length > 0 && (
          <section className="border-t border-border-default">
            <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted mb-8">
                {t("relatedGuides")}
              </p>
              <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
                {related.map((g, i) => (
                  <Link
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    className={`group block py-8 sm:py-0 ${
                      i < related.length - 1
                        ? "border-b sm:border-b-0 sm:border-r border-border-default sm:pr-10"
                        : ""
                    } ${i > 0 ? "sm:pl-10" : ""}`}
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-text-muted mb-3">
                      {t(g.category)}
                    </p>
                    <h3 className="font-serif text-xl text-text-primary group-hover:text-accent transition-colors">
                      {g.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-tertiary line-clamp-2">
                      {g.intro}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

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
              {t("ctaSubtitle")}
            </p>
            <Link
              href="/register"
              className="mt-8 inline-block border border-text-primary bg-text-primary px-8 py-3.5 text-sm font-medium text-surface-primary transition-colors hover:bg-accent hover:border-accent"
            >
              {t("findBabysitter")}
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
