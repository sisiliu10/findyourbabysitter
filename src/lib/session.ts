import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt, type JwtPayload } from "./auth";
import { prisma } from "./prisma";

const COOKIE_NAME = "fyb_session";

// Throttle lastSeenAt writes: at most once per 5 min per user per function instance
const lastSeenAtCache = new Map<string, number>();
const LAST_SEEN_TTL = 5 * 60 * 1000;

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyJwt(token);
}

export async function requireAuth(): Promise<JwtPayload> {
  const session = await getSession();
  if (!session) redirect("/login");

  // Fire-and-forget: update lastSeenAt (throttled to once per 5 min)
  const now = Date.now();
  if (now - (lastSeenAtCache.get(session.userId) ?? 0) > LAST_SEEN_TTL) {
    lastSeenAtCache.set(session.userId, now);
    prisma.user
      .update({ where: { id: session.userId }, data: { lastSeenAt: new Date() } })
      .catch(() => {});
  }

  return session;
}

export async function requireRole(allowedRoles: string[]): Promise<JwtPayload> {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.role)) {
    redirect("/dashboard");
  }
  return session;
}

// Only the platform owner (ADMIN + matching OWNER_EMAIL) can access super-admin pages.
export async function requireOwner(): Promise<JwtPayload> {
  const session = await requireRole(["ADMIN"]);
  const ownerEmail = process.env.OWNER_EMAIL;
  if (!ownerEmail || session.email !== ownerEmail) {
    redirect("/dashboard");
  }
  return session;
}
