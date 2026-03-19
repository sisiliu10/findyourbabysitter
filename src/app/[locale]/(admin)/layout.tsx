import type { Metadata } from "next";
import { Topbar } from "@/components/layout/Topbar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("admin");
  return (
    <div className="flex min-h-screen flex-col bg-surface-primary">
      <Topbar />
      <div className="flex flex-1 flex-col">
        <nav className="flex gap-1 border-b border-border-default bg-surface-secondary px-4">
          <Link
            href="/admin"
            className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-text-tertiary transition-colors hover:border-accent hover:text-text-primary"
          >
            {t("dashboard")}
          </Link>
          <Link
            href="/admin/users"
            className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-text-tertiary transition-colors hover:border-accent hover:text-text-primary"
          >
            {t("users")}
          </Link>
          <Link
            href="/admin/messages"
            className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-text-tertiary transition-colors hover:border-accent hover:text-text-primary"
          >
            {t("messages")}
          </Link>
        </nav>
        <main className="flex-1 overflow-y-auto bg-surface-primary p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
