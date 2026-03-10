import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ColoringPageGrid } from "@/components/coloring-pages/ColoringPageGrid";
import { COLORING_PAGES, getColoringPage } from "@/data/coloring-pages";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isDE = locale === "de";

  return {
    title: isDE
      ? "Ausmalbilder | Kostenlose Malvorlagen für Kinder"
      : "Coloring Pages | Free Printable Pages for Kids",
    description: isDE
      ? "Kostenlose Ausmalbilder für Kinder — Tiere, Dinosaurier, Weltraum und mehr. Altersgruppe wählen, herunterladen und losmalen."
      : "Free coloring pages for kids — animals, dinosaurs, space and more. Choose an age group, download and start coloring.",
    alternates: { canonical: "https://berlinbabysitter.com/coloring-pages" },
    openGraph: {
      title: isDE
        ? "Ausmalbilder | Kostenlose Malvorlagen für Kinder"
        : "Coloring Pages | Free Printable Pages for Kids",
      description: isDE
        ? "Kostenlose Ausmalbilder für Kinder — Tiere, Dinosaurier, Weltraum und mehr. Altersgruppe wählen, herunterladen und losmalen."
        : "Free coloring pages for kids — animals, dinosaurs, space and more. Choose an age group, download and start coloring.",
      url: "https://berlinbabysitter.com/coloring-pages",
      siteName: "BerlinBabysitter",
      locale: isDE ? "de_DE" : "en_US",
      type: "website",
    },
  };
}

export default async function ColoringPagesPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "coloringPages" });

  const pages = COLORING_PAGES.map((p) => getColoringPage(p.slug, locale)!);

  return (
    <div className="flex min-h-screen flex-col bg-surface-primary">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted mb-4">
              {t("label")}
            </p>
            <h1 className="font-serif text-3xl leading-tight text-text-primary sm:text-4xl lg:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-text-secondary">
              {t("intro")}
            </p>
          </div>
        </section>

        {/* Coloring pages grid */}
        <section className="border-t border-border-default">
          <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
            <ColoringPageGrid pages={pages} />
          </div>
        </section>

        {/* Print tips */}
        <section className="border-t border-border-default">
          <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted mb-8">
              {t("tipsLabel")}
            </p>
            <div className="grid grid-cols-1 gap-0 sm:grid-cols-3">
              <div className="py-6 sm:py-0 border-b sm:border-b-0 sm:border-r border-border-default sm:pr-10">
                <h3 className="text-sm font-medium text-text-primary">
                  {t("tip1Title")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-tertiary">
                  {t("tip1Desc")}
                </p>
              </div>
              <div className="py-6 sm:py-0 border-b sm:border-b-0 sm:border-r border-border-default sm:px-10">
                <h3 className="text-sm font-medium text-text-primary">
                  {t("tip2Title")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-tertiary">
                  {t("tip2Desc")}
                </p>
              </div>
              <div className="py-6 sm:py-0 sm:pl-10">
                <h3 className="text-sm font-medium text-text-primary">
                  {t("tip3Title")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-tertiary">
                  {t("tip3Desc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="border-t border-border-default"
          style={{
            background:
              "linear-gradient(135deg, #E8C9A0, #F2D9B6, #E0B88A, #E8C9A0)",
          }}
        >
          <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20 text-center">
            <h2 className="font-serif text-2xl text-text-primary sm:text-3xl">
              {t("ctaTitle")}
            </h2>
            <p className="mt-3 text-sm text-text-primary/60">
              {t("ctaSubtitle")}
            </p>
            <Link
              href="/register"
              className="mt-8 inline-block border border-text-primary bg-text-primary px-8 py-3.5 text-sm font-medium text-surface-primary transition-colors hover:bg-accent hover:border-accent"
            >
              {t("ctaButton")}
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
