import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { formatDate, formatTime, formatCurrency } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const session = await requireAuth();
  const t = await getTranslations("dashboard");

  const [user, recentBookings, pendingCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      include: { babysitterProfile: true },
    }),
    prisma.booking.findMany({
      where: {
        OR: [
          { parentId: session.userId },
          { sitterId: session.userId },
        ],
        status: { in: ["PENDING", "ACCEPTED", "CONFIRMED"] },
      },
      include: {
        request: true,
        parent: { select: { firstName: true, lastName: true } },
        sitter: { select: { firstName: true, lastName: true } },
      },
      orderBy: { dateBooked: "asc" },
      take: 5,
    }),
    prisma.booking.count({
      where: {
        sitterId: session.userId,
        status: "PENDING",
      },
    }),
  ]);

  if (!user) return null;

  if (!user.onboarded) {
    const { redirect } = await import("next/navigation");
    redirect("/onboarding");
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-warning-muted text-warning border border-warning/20",
    ACCEPTED: "bg-info-muted text-info border border-info/20",
    CONFIRMED: "bg-success-muted text-success border border-success/20",
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-3xl text-text-primary">
          {t("welcomeBack")} {user.firstName}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {user.role === "PARENT"
            ? t("subtitleParent")
            : t("subtitleSitter")}
        </p>
      </div>

      {/* Discover — parent cards */}
      {user.role === "PARENT" && (
        <div className="mb-10">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
            {t("discover")}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/search?mode=sitters"
              className="group relative flex aspect-square flex-col items-center justify-center gap-3 border border-accent/20 bg-accent-muted p-6 transition hover:border-accent/40"
            >
              <div className="flex h-14 w-14 items-center justify-center bg-accent/10 transition group-hover:scale-105">
                <svg className="h-7 w-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-serif text-lg text-text-primary">{t("findSitters")}</p>
                <p className="mt-0.5 text-xs text-text-secondary">{t("browseBabysitters")}</p>
              </div>
            </Link>
            <Link
              href="/search?mode=moms"
              className="group relative flex aspect-square flex-col items-center justify-center gap-3 border border-[#b8860b]/20 bg-[#b8860b]/5 p-6 transition hover:border-[#b8860b]/40"
            >
              <div className="flex h-14 w-14 items-center justify-center bg-[#b8860b]/10 transition group-hover:scale-105">
                <svg className="h-7 w-7 text-[#b8860b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-serif text-lg text-text-primary">{t("findMoms")}</p>
                <p className="mt-0.5 text-xs text-text-secondary">{t("connectWithParents")}</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="mb-10">
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
          {t("quickActions")}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {user.role === "PARENT" && (
            <Link
              href="/requests/new"
              className="flex items-center gap-4 border border-border-default bg-surface-secondary p-5 transition hover:border-border-hover"
            >
              <div className="flex h-10 w-10 items-center justify-center bg-accent-muted text-accent">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-text-primary">{t("createRequest")}</p>
                <p className="text-xs text-text-tertiary">{t("postChildcareNeed")}</p>
              </div>
            </Link>
          )}

          {user.role === "BABYSITTER" && (
            <>
              {pendingCount > 0 && (
                <Link
                  href="/bookings"
                  className="flex items-center gap-4 border border-warning/20 bg-warning-muted p-5 transition hover:border-border-hover"
                >
                  <div className="flex h-10 w-10 items-center justify-center bg-warning-muted text-warning">
                    <span className="text-lg font-medium">{pendingCount}</span>
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{t("pendingRequests", { count: pendingCount })}</p>
                    <p className="text-xs text-text-tertiary">{t("respondToRequests")}</p>
                  </div>
                </Link>
              )}
              <Link
                href="/requests"
                className="flex items-center gap-4 border border-border-default bg-surface-secondary p-5 transition hover:border-border-hover"
              >
                <div className="flex h-10 w-10 items-center justify-center bg-accent-muted text-accent">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-text-primary">{t("findParents")}</p>
                  <p className="text-xs text-text-tertiary">{t("browseOpenRequests")}</p>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Recent bookings (sitters only) */}
      {user.role === "BABYSITTER" && (
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
            {t("upcomingBookings")}
          </p>
          {recentBookings.length === 0 ? (
            <div className="border border-border-default bg-surface-secondary p-8">
              <p className="text-sm text-text-secondary">{t("noUpcomingBookings")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => {
                const otherPerson = booking.parent;
                return (
                  <Link
                    key={booking.id}
                    href={`/bookings/${booking.id}`}
                    className="flex items-center justify-between border border-border-default bg-surface-secondary p-4 transition hover:border-border-hover"
                  >
                    <div>
                      <p className="font-medium text-text-primary">
                        {otherPerson.firstName} {otherPerson.lastName}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {formatDate(booking.dateBooked)} &middot; {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-text-primary">
                        {formatCurrency(booking.totalEstimated)}
                      </span>
                      <span className={`px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${statusColors[booking.status] || "bg-surface-tertiary text-text-tertiary border border-border-default"}`}>
                        {booking.status}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
