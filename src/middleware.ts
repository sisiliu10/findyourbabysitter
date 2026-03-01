import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/", "/login", "/register", "/api/auth/register", "/api/auth/login", "/api/auth/logout"];
const adminPaths = ["/admin", "/api/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/_next") || pathname.startsWith("/uploads") || pathname === "/favicon.ico" || pathname.match(/\.(jpg|jpeg|png|svg|gif|webp|ico)$/)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("fyb_session")?.value;

  // Just check cookie existence; route handlers verify the JWT
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|uploads/).*)"],
};
