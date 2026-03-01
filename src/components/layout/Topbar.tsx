"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function Topbar() {
  const { user } = useCurrentUser();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border-default bg-surface-primary">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <Link href="/dashboard" className="text-sm font-medium uppercase tracking-widest text-text-primary">
          FYBS
        </Link>

        <div className="flex items-center gap-6">
          {user && (
            <>
              <span className="hidden text-xs uppercase tracking-wide text-text-tertiary sm:block">
                {user.firstName} {user.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs uppercase tracking-wide text-text-tertiary transition-colors hover:text-accent"
              >
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
