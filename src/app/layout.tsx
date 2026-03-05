// Minimal root layout — fonts exported here so [locale]/layout.tsx can use them.
// The [locale] layout owns <html>, <body>, providers, and per-locale metadata.
import { Source_Sans_3, Instrument_Serif } from "next/font/google";
import "./globals.css";

export const sourceSans = Source_Sans_3({ subsets: ["latin"], variable: "--font-sans" });
export const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
