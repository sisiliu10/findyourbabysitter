import { Topbar } from "@/components/layout/Topbar";
import { Link } from "@/i18n/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-primary">
      <Topbar />
      <div className="flex flex-1">
        <aside className="hidden w-56 shrink-0 border-r border-border-default bg-surface-secondary lg:block">
          <nav className="flex flex-col gap-0 p-4">
            <span className="mb-3 px-3 text-xs font-medium uppercase tracking-wide text-text-secondary">
              Admin
            </span>
            <Link
              href="/admin"
              className="border-r-2 border-transparent px-3 py-2 text-sm font-medium text-text-tertiary transition-colors hover:border-r-2 hover:border-accent hover:bg-accent-muted hover:text-text-primary"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className="border-r-2 border-transparent px-3 py-2 text-sm font-medium text-text-tertiary transition-colors hover:border-r-2 hover:border-accent hover:bg-accent-muted hover:text-text-primary"
            >
              Users
            </Link>
          </nav>
        </aside>
        <main className="flex-1 overflow-y-auto bg-surface-primary p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
