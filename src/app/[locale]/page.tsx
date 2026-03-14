import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { DISTRICTS, LANGUAGES } from "@/data/landing-pages";
import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/landing/Header";
import { AnnouncementBar } from "@/components/landing/AnnouncementBar";
import { TrustBar } from "@/components/landing/TrustBar";
import { JsonLd } from "@/components/landing/JsonLd";
import { FAQ } from "@/components/landing/FAQ";
import ScrollRevealText from "@/components/landing/ScrollRevealText";

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

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isDE = locale === "de";
  return {
    title: isDE
      ? "Babysitter Berlin | Vertrauenswürdige Babysitter & Kita-Plätze finden"
      : "Babysitter Berlin | Find Trusted Babysitters & Kita Places",
    description: isDE
      ? "Babysitter in Berlin gesucht? Finde vertrauenswürdige Babysitter und Kindermädchen in Prenzlauer Berg, Mitte, Charlottenburg und mehr – empfohlen von Berliner Eltern."
      : "Looking for a babysitter in Berlin? Find trusted babysitters in Prenzlauer Berg, Mitte, Charlottenburg and more – recommended by local Berlin parents.",
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const isDE = locale === "de";
  const base = "https://berlinbabysitter.com";
  const url = isDE ? `${base}/de` : base;

  const faqItems = [
    { question: t("faq1Q"), answer: t("faq1A") },
    { question: t("faq2Q"), answer: t("faq2A") },
    { question: t("faq3Q"), answer: t("faq3A") },
    { question: t("faq4Q"), answer: t("faq4A") },
    { question: t("faq5Q"), answer: t("faq5A") },
  ];

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BerlinBabysitter",
    url: base,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${base}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Berlin Babysitter",
    url: base,
    logo: `${base}/hero-bg.png`,
    description: isDE
      ? "Finde vertrauenswürdige Babysitter in Berlin, empfohlen von anderen Berliner Familien."
      : "Find trusted babysitters in Berlin, recommended by local families.",
    areaServed: {
      "@type": "City",
      name: "Berlin, Germany",
    },
    sameAs: [],
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: isDE
      ? "Wie finde ich einen Babysitter in Berlin?"
      : "How to find a babysitter in Berlin",
    description: isDE
      ? "Finde vertrauenswürdige Babysitter in Berlin in drei einfachen Schritten."
      : "Find trusted babysitters in Berlin in three simple steps.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: t("kitaTitle"),
        text: t("kitaDesc"),
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: t("babysitterTitle"),
        text: t("babysitterDesc"),
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: t("momsTitle"),
        text: t("momsDesc"),
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface-primary">
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={howToJsonLd} />
      <JsonLd data={faqJsonLd} />
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Hero — text overlays the sky area, full image visible */}
        <section className="relative w-full overflow-hidden min-h-[70vh] sm:min-h-[80vh] lg:min-h-[85vh] flex flex-col">
          {/* Background image — full vibrancy, fully visible */}
          <div className="absolute inset-0">
            <Image
              src="/hero-bg.png"
              alt=""
              fill
              priority
              className="object-cover object-bottom"
              aria-hidden="true"
              sizes="100vw"
            />
            {/* Very light veil at the top only — just enough for text readability */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to bottom, color-mix(in srgb, var(--color-surface-primary) 55%, transparent) 0%, color-mix(in srgb, var(--color-surface-primary) 25%, transparent) 35%, transparent 55%)",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-3xl px-6 pt-16 sm:pt-24 lg:pt-32 text-center">
            <p className="mb-6 text-[10px] font-medium uppercase tracking-widest text-text-tertiary">
              {t("trustedBadge")}
            </p>
            <h1 className="mx-auto max-w-2xl font-serif text-4xl leading-[1.1] tracking-tight text-text-primary sm:text-5xl lg:text-6xl xl:text-7xl">
              {t("heroTagline")}
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg">
              {t("heroSubtitle")}
            </p>
            <div className="mt-10">
              <Link
                href="/register"
                className="inline-block border border-text-primary bg-text-primary px-10 py-4 text-sm font-medium uppercase tracking-wide text-surface-primary transition-colors hover:bg-accent hover:border-accent"
              >
                {t("getStarted")}
              </Link>
            </div>
          </div>
        </section>

        {/* Scrolling trust bar */}
        <TrustBar />

        {/* SEO intro - scroll reveal */}
        <ScrollRevealText
          title={t("seoIntroTitle")}
          body={t("seoIntro")}
          label="Berlin Babysitter"
          highlights={isDE
            ? ["vertrauen", "Nachbarschaft", "Kita-Plätze", "Bewertungen", "Spielverabredungen", "spontan", "schnell"]
            : ["trust", "neighborhood", "Kita", "reviews", "playdates", "last-minute", "quickly"]}
        />

        {/* Two paths */}
        <section className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-6">
            <Link
              href="/register?role=PARENT"
              className="group relative overflow-hidden p-8 sm:p-10 transition-transform hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #E8C9A0, #F2D9B6, #E0B88A, #E8C9A0)",
                backgroundSize: "300% 300%",
                animation: "gradientShift 8s ease infinite",
              }}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-text-primary/40 mb-3">{t("forParents")}</p>
              <h3 className="font-serif text-3xl text-text-primary sm:text-4xl">{t("iAmParent")}</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-primary/60">{t("parentDescription")}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-text-primary/40 transition-colors group-hover:text-text-primary">
                {t("getStarted")}
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </span>
            </Link>

            <Link
              href="/register?role=BABYSITTER"
              className="group relative overflow-hidden p-8 sm:p-10 transition-transform hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #C4D8E2, #D6E6EE, #B8CFD9, #C4D8E2)",
                backgroundSize: "300% 300%",
                animation: "gradientShift 8s ease infinite 2s",
              }}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-text-primary/40 mb-3">{t("forSitters")}</p>
              <h3 className="font-serif text-3xl text-text-primary sm:text-4xl">{t("iAmSitter")}</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-primary/60">{t("sitterDescription")}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-text-primary/40 transition-colors group-hover:text-text-primary">
                {t("getStarted")}
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </span>
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <p className="text-xs uppercase tracking-wide text-text-muted mb-3">{t("howItWorks")}</p>
          <h2 className="font-serif text-3xl text-text-primary sm:text-4xl mb-8">{t("howItWorksTitle")}</h2>
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-3">
            <div className="py-8 sm:py-0 border-b sm:border-b-0 sm:border-r border-border-default sm:pr-10">
              <svg className="h-5 w-5 text-text-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
              </svg>
              <h3 className="text-sm font-medium text-text-primary">{t("kitaTitle")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-tertiary">{t("kitaDesc")}</p>
            </div>
            <div className="py-8 sm:py-0 border-b sm:border-b-0 sm:border-r border-border-default sm:pr-10 sm:pl-10">
              <svg className="h-5 w-5 text-text-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
              </svg>
              <h3 className="text-sm font-medium text-text-primary">{t("babysitterTitle")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-tertiary">{t("babysitterDesc")}</p>
            </div>
            <div className="py-8 sm:py-0 sm:pl-10">
              <svg className="h-5 w-5 text-text-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <h3 className="text-sm font-medium text-text-primary">{t("momsTitle")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-tertiary">{t("momsDesc")}</p>
            </div>
          </div>
        </section>

        {/* Browse by neighborhood */}
        <section id="neighborhoods" className="border-t border-border-default">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
            <h2 className="text-xs uppercase tracking-wide text-text-muted mb-8">{t("browseByNeighborhood")}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {DISTRICTS.map((d) => (
                <Link
                  key={d.slug}
                  href={`/babysitter/${d.slug}`}
                  className="group border border-border-default p-5 transition-colors hover:border-text-primary"
                >
                  <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">{d.name}</p>
                  <p className="mt-1 text-xs text-text-tertiary">{t("babysitters")}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Browse by language */}
        <section className="border-t border-border-default">
          <div className="mx-auto max-w-7xl px-6 py-12 sm:py-28">
            <h2 className="text-xs uppercase tracking-wide text-text-muted mb-5">{t("browseByLanguage")}</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
              {LANGUAGES.map((l) => (
                <Link
                  key={l.slug}
                  href={`/babysitter/${l.slug}`}
                  className="group flex items-center gap-2 border border-border-default bg-surface-secondary px-3 py-2.5 transition-all hover:border-text-primary hover:bg-surface-tertiary sm:gap-3 sm:px-4 sm:py-4"
                >
                  <span className="text-xl leading-none sm:text-2xl" role="img" aria-hidden="true">
                    {LANGUAGE_FLAGS[l.slug] ?? "🌐"}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs font-medium text-text-primary leading-tight sm:text-sm">{l.name}</span>
                    {l.nativeName && l.nativeName !== l.name && (
                      <span className="text-[10px] text-text-tertiary leading-tight sm:text-xs">{l.nativeName}</span>
                    )}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border-default">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
            <h2 className="font-serif text-3xl text-text-primary sm:text-4xl mb-8">{t("faqTitle")}</h2>
            <FAQ items={faqItems} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-default">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-wide text-text-muted">Berlin Babysitter</span>
            <nav className="flex items-center gap-6">
              <Link href="/impressum" className="text-xs text-text-muted transition-colors hover:text-text-primary">{t("impressum")}</Link>
            </nav>
            <span className="text-xs text-text-muted">{new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
