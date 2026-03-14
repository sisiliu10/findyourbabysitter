import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getKitas, getDistrictsWithCounts, getLastKitaSyncDate } from "@/lib/kita";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { KitaSearchClient } from "./KitaSearchClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "kitaSearch" });

  const title = t("metaTitle");
  const description = t("metaDescription");

  return {
    title,
    description,
    alternates: {
      canonical: locale === "en" ? "/kita-search" : "/de/kita-search",
      languages: {
        en: "/kita-search",
        de: "/de/kita-search",
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function KitaSearchPage() {
  const [{ kitas, pagination }, districts, lastSyncDate] = await Promise.all([
    getKitas({ page: 1, limit: 18 }),
    getDistrictsWithCounts(),
    getLastKitaSyncDate(),
  ]);

  return (
    <>
      <Header />
      <main>
        <KitaSearchClient
          initialKitas={kitas}
          initialPagination={pagination}
          districts={districts}
          lastSyncDate={lastSyncDate ? lastSyncDate.toISOString() : null}
        />
      </main>
      <Footer />
    </>
  );
}
