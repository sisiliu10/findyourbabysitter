import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { formatDate, formatTime, getInitials } from "@/lib/utils";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const session = await requireAuth();
  const t = await getTranslations("dashboard");

  const [user, allBookings, pendingCount] = await Promise.all([
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
      },
      include: {
        parent: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
        sitter: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
        request: { select: { title: true } },
      },
      orderBy: { dateBooked: "desc" },
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

  const tc = await getTranslations("common");

  const bookingStatusVariants: Record<string, BadgeVariant> = {
    PENDING: "warning",
    ACCEPTED: "info",
    CONFIRMED: "success",
    COMPLETED: "success",
    REVIEWED: "success",
    DECLINED: "danger",
    CANCELLED: "danger",
  };

  const bookingBorderColors: Record<string, string> = {
    PENDING: "border-l-warning",
    ACCEPTED: "border-l-info",
    CONFIRMED: "border-l-success",
    COMPLETED: "border-l-success",
    REVIEWED: "border-l-success",
    DECLINED: "border-l-danger",
    CANCELLED: "border-l-danger",
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

      {/* All bookings */}
      <div>
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
          {t("upcomingBookings")}
        </p>
        {allBookings.length === 0 ? (
          <div className="border border-border-default bg-surface-secondary p-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-surface-tertiary">
              <svg
                className="h-6 w-6 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
            </div>
            <p className="text-sm text-text-secondary">{t("noUpcomingBookings")}</p>
            {user.role === "PARENT" && (
              <Link
                href="/search"
                className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
              >
                {t("findSitters")}
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {allBookings.map((booking) => {
              const isParent = booking.parentId === session.userId;
              const otherPerson = isParent ? booking.sitter : booking.parent;
              const otherInitials = getInitials(
                otherPerson.firstName,
                otherPerson.lastName
              );

              return (
                <Link
                  key={booking.id}
                  href={`/bookings/${booking.id}`}
                  className={`flex items-center justify-between border border-border-default border-l-4 bg-surface-secondary p-5 transition hover:border-border-hover ${bookingBorderColors[booking.status] || "border-l-text-tertiary"}`}
                >
                  <div className="flex items-center gap-4">
                    {otherPerson.avatarUrl ? (
                      <img
                        src={otherPerson.avatarUrl}
                        alt={`${otherPerson.firstName} ${otherPerson.lastName}`}
                        className="h-10 w-10 object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center bg-accent-muted text-xs font-semibold text-accent">
                        {otherInitials}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-text-primary">
                        {otherPerson.firstName} {otherPerson.lastName}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {formatDate(booking.dateBooked)}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={bookingStatusVariants[booking.status] || "neutral"}>
                    {tc(`status.${booking.status}` as any)}
                  </Badge>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
