import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const handleI18nRouting = createMiddleware(routing);

// Paths that don't require authentication (without locale prefix)
const publicBasePaths = [
  "/",
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/babysitter",
  "/guides",
  "/privacy-policy",
  "/terms-of-service",
  "/impressum",
  "/api/auth",
  "/api/health",
];

function isPublicPath(normalised: string): boolean {
  return publicBasePaths.some(
    (p) => normalised === p || normalised.startsWith(p + "/")
  );
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Strip locale prefix to normalise path for auth/public-path checks.
  // With localePrefix: 'as-needed', only non-default locales are prefixed.
  const normalised = pathname.replace(/^\/de(?=\/|$)/, "") || "/";

  // API routes bypass next-intl entirely — just do auth check
  if (normalised.startsWith("/api/")) {
    if (isPublicPath(normalised)) return NextResponse.next();
    const token = request.cookies.get("fyb_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.next();
  }

  // Public page paths — run i18n routing, no auth needed
  if (isPublicPath(normalised)) {
    return handleI18nRouting(request);
  }

  // Protected pages — check session cookie
  const token = request.cookies.get("fyb_session")?.value;
  if (!token) {
    const locale = pathname.startsWith("/de") ? "de" : "en";
    const loginPath = locale === "de" ? "/de/login" : "/login";
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!_next|_vercel|uploads|.*\\..*).*)" ],
};
