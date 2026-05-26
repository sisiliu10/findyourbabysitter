"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// Pages that are accessible even when not published
const EXEMPT_PATHS = ["/publish", "/onboarding", "/profile/edit", "/profile", "/settings"];

export function PublishGate() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || !user) return;
    if (!user.onboarded) return; // still onboarding — onboarding page handles that
    if (user.isPublished) return; // all good

    // Check if current path is exempt
    const isExempt = EXEMPT_PATHS.some((p) => pathname.includes(p));
    if (!isExempt) {
      router.replace("/publish");
    }
  }, [user, loading, pathname, router]);

  return null;
}
