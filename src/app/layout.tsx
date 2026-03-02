import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  metadataBase: new URL("https://berlinbabysitter.com"),
  title: {
    default: "Berlin Babysitter - Trusted Childcare",
    template: "%s | Berlin Babysitter",
  },
  description: "Find trusted, vetted babysitters in Berlin. Quick booking, verified profiles, real reviews.",
  openGraph: {
    siteName: "Berlin Babysitter",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${instrumentSerif.variable} font-sans antialiased bg-surface-primary text-text-primary`}>
        {children}
      </body>
    </html>
  );
}
