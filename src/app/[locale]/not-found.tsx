import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-primary px-6 text-center">
      <h1 className="font-serif text-6xl text-text-primary">{t("title")}</h1>
      <p className="mt-4 text-lg text-text-secondary">{t("message")}</p>
      <Link
        href="/"
        className="mt-8 border border-text-primary bg-text-primary px-8 py-3.5 text-surface-primary transition-colors hover:bg-accent"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
