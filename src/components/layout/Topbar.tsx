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
        <Link href="/dashboard" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-text-primary">
            <path d="M14 3L3 12h3v11h7v-7h2v7h7V12h3L14 3z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="14" cy="14" r="2.5" fill="currentColor" opacity="0.5" />
          </svg>
          <span className="text-sm font-semibold tracking-tight text-text-primary">berlin babysitter</span>
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
