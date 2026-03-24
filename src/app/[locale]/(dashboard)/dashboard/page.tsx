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
      take: 20,
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

  // Compute sitter profile completeness
  let completenessItems: { key: string; label: string; done: boolean }[] = [];
  if (user.role === "BABYSITTER" && user.babysitterProfile) {
    const p = user.babysitterProfile;
    let availability: Record<string, string[]> = {};
    try { availability = JSON.parse(p.availabilityJson); } catch { /* empty */ }
    const hasAvailability = Object.values(availability).some(slots => slots.length > 0);

    completenessItems = [
      { key: "photo", label: t("missingPhoto"), done: !!user.avatarUrl },
      { key: "bio", label: t("missingBio"), done: p.bio.length >= 50 },
      { key: "experience", label: t("missingExperience"), done: p.yearsExperience > 0 },
      { key: "firstAid", label: t("missingFirstAid"), done: p.hasFirstAid },
      { key: "cpr", label: t("missingCPR"), done: p.hasCPR },
      { key: "transport", label: t("missingTransport"), done: p.hasTransportation },
      { key: "availability", label: t("missingAvailability"), done: hasAvailability },
    ];
  }

  const completenessCount = completenessItems.filter(i => i.done).length;
  const completenessTotal = completenessItems.length;
  const completenessPercent = completenessTotal > 0 ? Math.round((completenessCount / completenessTotal) * 100) : 100;
  const missingItems = completenessItems.filter(i => !i.done);

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

      {/* Profile completeness banner for sitters */}
      {user.role === "BABYSITTER" && completenessPercent < 100 && (
        <div className="mb-10">
          <div className="border border-border-default bg-surface-secondary p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                  {t("profileCompleteness")}
                </p>
                <p className="mt-0.5 text-xs text-text-tertiary">{t("profileCompletenessHint")}</p>
              </div>
              <span className={`text-2xl font-medium tabular-nums ${completenessPercent >= 70 ? "text-success" : completenessPercent >= 40 ? "text-warning" : "text-danger"}`}>
                {completenessPercent}%
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 w-full bg-surface-tertiary overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${completenessPercent >= 70 ? "bg-success" : completenessPercent >= 40 ? "bg-warning" : "bg-danger"}`}
                style={{ width: `${completenessPercent}%` }}
              />
            </div>
            {/* Missing items */}
            {missingItems.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {missingItems.slice(0, 4).map(item => (
                  <Link
                    key={item.key}
                    href="/profile/edit"
                    className="flex items-center gap-1.5 bg-surface-tertiary px-3 py-1.5 text-xs text-text-secondary transition hover:bg-border-default hover:text-text-primary"
                  >
                    <svg className="h-3 w-3 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    {item.label}
                  </Link>
                ))}
                {missingItems.length > 4 && (
                  <Link
                    href="/profile/edit"
                    className="flex items-center gap-1.5 border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:border-text-primary hover:text-text-primary"
                  >
                    {t("editProfileLink")}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Discover — parent cards */}
      {user.role === "PARENT" && (
        <div className="mb-10">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
            {t("discover")}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/browse"
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
            <Link
              href="/kita-search"
              className="group col-span-2 flex flex-row items-center gap-5 border border-success/20 bg-success-muted p-6 transition hover:border-success/40"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-success/10 transition group-hover:scale-105">
                <svg className="h-7 w-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </div>
              <div>
                <p className="font-serif text-lg text-text-primary">{t("findKita")}</p>
                <p className="mt-0.5 text-xs text-text-secondary">{t("browseKitas")}</p>
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
          <div className="space-y-4">
            {user.role === "BABYSITTER" && (
              <Link
                href="/requests/browse"
                className="group flex flex-col gap-3 border border-accent/20 bg-accent-muted p-6 transition hover:border-accent/40"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-accent/10 transition group-hover:scale-105">
                    <svg className="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-serif text-lg text-text-primary">{t("getStartedTitle")}</p>
                    <p className="mt-0.5 text-xs text-text-secondary">{t("getStartedSubtitle")}</p>
                  </div>
                  <svg className="ml-auto h-5 w-5 shrink-0 text-text-muted transition group-hover:translate-x-0.5 group-hover:text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </Link>
            )}
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
                  href="/browse"
                  className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
                >
                  {t("findSitters")}
                </Link>
              )}
            </div>
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
