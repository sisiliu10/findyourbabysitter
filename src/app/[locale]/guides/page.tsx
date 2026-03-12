import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GUIDES, getGuide } from "@/data/guides";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { GuidesFilter } from "@/components/guides/GuidesFilter";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isDE = locale === "de";

  return {
    title: isDE
      ? "Berlin mit Kindern | Guides für Familien"
      : "Berlin with Kids | Guides for Families",
    description: isDE
      ? "Entdecke kinderfreundliche Cafes, Spielplätze und Aktivitäten in Berlin. Lokale Tipps von Berliner Eltern."
      : "Discover kid-friendly cafes, playgrounds, and activities in Berlin. Local tips from Berlin parents.",
    alternates: { canonical: "https://berlinbabysitter.com/guides" },
    openGraph: {
      title: isDE
        ? "Berlin mit Kindern | Guides für Familien"
        : "Berlin with Kids | Guides for Families",
      description: isDE
        ? "Entdecke kinderfreundliche Cafes, Spielplätze und Aktivitäten in Berlin."
        : "Discover kid-friendly cafes, playgrounds, and activities in Berlin.",
      url: "https://berlinbabysitter.com/guides",
      siteName: "Berlin Babysitter",
      locale: isDE ? "de_DE" : "en_US",
      type: "website",
    },
  };
}

export default async function GuidesIndexPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guides" });

  const guides = GUIDES
    .filter((g) => g.category !== "parenting")
    .map((g) => getGuide(g.slug, locale)!);

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

        {/* Filter + cards */}
        <section className="border-t border-border-default">
          <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
            <GuidesFilter guides={guides} />
          </div>
        </section>

        {/* CTA */}
        <section
          className="border-t border-border-default"
          style={{ background: "linear-gradient(135deg, #E8C9A0, #F2D9B6, #E0B88A, #E8C9A0)" }}
        >
          <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20 text-center">
            <h2 className="font-serif text-2xl text-text-primary sm:text-3xl">
              {t("needBabysitter")}
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
