import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { DISTRICTS, LANGUAGES } from "@/data/landing-pages";
import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: t("heroTagline"),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <div className="flex min-h-screen flex-col bg-surface-primary">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-center border-b border-border-default">
            <div className="lg:col-span-7 py-16 sm:py-20 lg:py-24 lg:pr-16">
              <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
                {t("heroTagline")}
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-text-secondary">
                {t("heroBody1")}<br />
                {t("heroBody2")}<br />
                {t("heroBody3")}
              </p>
              <div className="mt-10 flex items-center gap-6">
                <Link
                  href="/register"
                  className="border border-text-primary bg-text-primary px-8 py-3.5 text-sm font-medium text-surface-primary transition-colors hover:bg-accent hover:border-accent"
                >
                  {t("getStarted")}
                </Link>
                <Link
                  href="/login"
                  className="text-sm text-text-tertiary transition-colors hover:text-text-primary"
                >
                  {t("signIn")}
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 lg:pl-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero-drawing.jpg"
                alt="Child's crayon drawing of a house with flowers and sunshine"
                className="w-full h-auto"
                style={{ mixBlendMode: "multiply" }}
              />
            </div>
          </div>
        </section>

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
              <h2 className="font-serif text-3xl text-text-primary sm:text-4xl">{t("iAmParent")}</h2>
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
              <h2 className="font-serif text-3xl text-text-primary sm:text-4xl">{t("iAmSitter")}</h2>
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
        <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
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
        <section className="border-t border-border-default">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
            <p className="text-xs uppercase tracking-wide text-text-muted mb-8">{t("browseByNeighborhood")}</p>
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
          <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
            <p className="text-xs uppercase tracking-wide text-text-muted mb-8">{t("browseByLanguage")}</p>
            <div className="flex flex-wrap gap-3">
              {LANGUAGES.map((l) => (
                <Link
                  key={l.slug}
                  href={`/babysitter/${l.slug}`}
                  className="border border-border-default px-5 py-3 text-sm text-text-secondary transition-colors hover:border-text-primary hover:text-text-primary"
                >
                  {l.name}{l.nativeName ? ` — ${l.nativeName}` : ""}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-default">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-wide text-text-muted">Berlin Babysitter</span>
            <nav className="flex items-center gap-6">
              <Link href="/privacy-policy" className="text-xs text-text-muted transition-colors hover:text-text-primary">{t("privacyPolicy")}</Link>
              <Link href="/terms-of-service" className="text-xs text-text-muted transition-colors hover:text-text-primary">{t("termsOfService")}</Link>
              <Link href="/impressum" className="text-xs text-text-muted transition-colors hover:text-text-primary">{t("impressum")}</Link>
            </nav>
            <span className="text-xs text-text-muted">{new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
