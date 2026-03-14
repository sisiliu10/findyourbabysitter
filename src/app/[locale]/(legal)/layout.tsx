import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { LanguageToggle } from "@/components/LanguageToggle";

export default async function LegalLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("legal");
  return (
    <div className="flex min-h-screen flex-col bg-surface-primary">
      <header className="border-b border-border-default">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-xs font-medium uppercase tracking-[0.2em] text-text-primary">
            Berlin Babysitter
          </Link>
          <div className="flex items-center gap-6">
            <LanguageToggle />
            <Link href="/login" className="text-xs uppercase tracking-wide text-text-tertiary transition-colors hover:text-text-primary">
              {t("login")}
            </Link>
            <Link href="/register" className="border border-text-primary bg-text-primary px-5 py-2 text-xs font-medium uppercase tracking-wide text-surface-primary transition-colors hover:bg-accent hover:border-accent">
              {t("signup")}
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border-default">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-wide text-text-muted">Berlin Babysitter</span>
            <nav className="flex items-center gap-6">
              <Link href="/legal" className="text-xs text-text-muted transition-colors hover:text-text-primary">{t("impressum")}</Link>
            </nav>
            <span className="text-xs text-text-muted">{new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
