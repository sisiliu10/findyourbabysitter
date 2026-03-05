import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { dmSans, instrumentSerif } from "@/app/layout";

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
        ? "Babysitter Berlin | Vertrauenswürdige Babysitter & Kita-Plätze finden"
        : "Babysitter Berlin | Find Trusted Babysitters & Kita Places",
      template: "%s | Berlin Babysitter",
    },
    description: isDE
      ? "Finde vertrauenswürdige Babysitter in Berlin. Stöbere durch Sitter, die von Eltern vor Ort empfohlen werden, entdecke Kita-Plätze und vernetze dich mit anderen Familien in ganz Berlin."
      : "Find trusted babysitters in Berlin. Browse sitters recommended by local parents, discover Kita places and connect with other families across Berlin.",
    alternates: {
      canonical: url,
      languages: {
        en: base,
        de: `${base}/de`,
        "x-default": base,
      },
    },
    openGraph: {
      siteName: "Berlin Babysitter",
      locale: isDE ? "de_DE" : "en_US",
      type: "website",
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
        className={`${dmSans.variable} ${instrumentSerif.variable} font-sans antialiased bg-surface-primary text-text-primary`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
