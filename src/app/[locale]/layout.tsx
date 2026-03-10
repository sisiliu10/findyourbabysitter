import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { outfit, instrumentSerif } from "@/app/layout";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const base = "https://berlinbabysitter.com";
  const url = locale === "en" ? base : `${base}/${locale}`;
  const isDE = locale === "de";

  return {
    metadataBase: new URL(base),
    title: {
      default: isDE
        ? "Babysitter in Berlin finden | BerlinBabysitter"
        : "Find a Babysitter in Berlin | BerlinBabysitter",
      template: "%s | BerlinBabysitter",
    },
    description: isDE
      ? "Kostenlose Plattform für Babysitter und Familien in Berlin. Profile entdecken, Bewertungen sehen und direkt Kontakt aufnehmen."
      : "Free platform for babysitters and families in Berlin. Browse profiles, read reviews and get in touch directly.",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png" }],
    },
    alternates: {
      canonical: url,
      languages: {
        en: base,
        de: `${base}/de`,
        "x-default": base,
      },
    },
    openGraph: {
      siteName: "BerlinBabysitter",
      locale: isDE ? "de_DE" : "en_US",
      type: "website",
      images: [
        {
          url: `${base}/hero-bg.png`,
          width: 1536,
          height: 1024,
          alt: isDE
            ? "BerlinBabysitter – Vertrauenswürdige Kinderbetreuung in Berlin"
            : "BerlinBabysitter – Trusted childcare in Berlin",
        },
      ],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${outfit.variable} ${instrumentSerif.variable} font-sans antialiased bg-surface-primary text-text-primary`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
