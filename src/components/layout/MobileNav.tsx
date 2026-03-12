"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUnreadCount } from "@/hooks/useUnreadCount";
import { cn } from "@/lib/utils";

const parentLinks: { href: string; key: string; icon: string }[] = [
  { href: "/dashboard", key: "home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/browse", key: "browse", icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" },
  { href: "/search", key: "likes", icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" },
  { href: "/messages", key: "chat", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  { href: "/profile", key: "profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
];

const sitterLinks: { href: string; key: string; icon: string }[] = [
  { href: "/dashboard", key: "home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/browse", key: "browse", icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" },
  { href: "/search", key: "parents", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { href: "/messages", key: "chat", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  { href: "/profile", key: "profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
];

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useCurrentUser();
  const unreadCount = useUnreadCount();
  const t = useTranslations("mobilenav");
  const router = useRouter();
  const links = user?.role === "BABYSITTER" ? sitterLinks : parentLinks;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border-default bg-surface-primary lg:hidden">
      <div className="flex items-center justify-around py-2">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              onTouchStart={() => router.prefetch(link.href)}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] uppercase tracking-wide transition-colors",
                isActive ? "text-accent" : "text-text-tertiary"
              )}
            >
              <span className="relative">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                </svg>
                {link.key === "chat" && unreadCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                {link.key === "profile" && user?.role !== "BABYSITTER" && !user?.isPremium && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent">
                    <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </span>
                )}
              </span>
              {t(link.key as Parameters<typeof t>[0])}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
