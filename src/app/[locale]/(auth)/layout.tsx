import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { LanguageToggle } from "@/components/LanguageToggle";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-primary">
      <header className="border-b border-border-default">
        <div className="flex h-14 items-center justify-between px-6">
          <Link href="/" className="text-xs font-medium uppercase tracking-[0.2em] text-text-primary">
            Berlin Babysitter
          </Link>
          <LanguageToggle />
        </div>
      </header>
      <div className="flex flex-1 items-start justify-start px-6 py-16 sm:py-24 sm:px-16 lg:px-24">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
