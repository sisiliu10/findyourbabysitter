"use client";

import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { LanguageToggle } from "@/components/LanguageToggle";

export function Topbar() {
  const { user } = useCurrentUser();
  const t = useTranslations("nav");
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
          <img
            src="/bear-logo.jpg"
            alt="Berlin Babysitter"
            width={48}
            height={48}
            className="object-contain"
            style={{ mixBlendMode: "multiply" }}
          />
        </Link>

        <div className="flex items-center gap-6">
          <LanguageToggle />
          {user && (
            <>
              <span className="hidden text-xs uppercase tracking-wide text-text-tertiary sm:block">
                {user.firstName} {user.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="min-w-[5.5rem] text-center text-xs uppercase tracking-wide text-text-tertiary transition-colors hover:text-accent"
              >
                {t("logout")}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
