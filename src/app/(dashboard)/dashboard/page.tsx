import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate, formatTime, formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { babysitterProfile: true },
  });

  if (!user) return null;

  if (!user.onboarded) {
    const { redirect } = await import("next/navigation");
    redirect("/onboarding");
  }

  const recentBookings = await prisma.booking.findMany({
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
  });

  const pendingCount = await prisma.booking.count({
    where: {
      sitterId: session.userId,
      status: "PENDING",
    },
  });

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
          Welcome back, {user.firstName}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {user.role === "PARENT"
            ? "Find and manage your childcare bookings"
            : "Manage your bookings and availability"}
        </p>
      </div>

      {/* Quick actions */}
      <div className="mb-10">
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
          Quick Actions
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {user.role === "PARENT" && (
            <>
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
                  <p className="font-medium text-text-primary">Create request</p>
                  <p className="text-xs text-text-tertiary">Post a childcare need</p>
                </div>
              </Link>
              <Link
                href="/search"
                className="flex items-center gap-4 border border-border-default bg-surface-secondary p-5 transition hover:border-border-hover"
              >
                <div className="flex h-10 w-10 items-center justify-center bg-accent-muted text-accent">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-text-primary">Find sitters</p>
                  <p className="text-xs text-text-tertiary">Browse available babysitters</p>
                </div>
              </Link>
            </>
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
                    <p className="font-medium text-text-primary">Pending requests</p>
                    <p className="text-xs text-text-tertiary">Respond to booking requests</p>
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
                  <p className="font-medium text-text-primary">Find parents</p>
                  <p className="text-xs text-text-tertiary">Browse open childcare requests</p>
                </div>
              </Link>
            </>
          )}}

          <Link
            href="/profile"
            className="flex items-center gap-4 border border-border-default bg-surface-secondary p-5 transition hover:border-border-hover"
          >
            <div className="flex h-10 w-10 items-center justify-center bg-accent-muted text-accent">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-text-primary">Your profile</p>
              <p className="text-xs text-text-tertiary">View and edit your info</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent bookings */}
      <div>
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
          Upcoming Bookings
        </p>
        {recentBookings.length === 0 ? (
          <div className="border border-border-default bg-surface-secondary p-8">
            <p className="text-sm text-text-secondary">No upcoming bookings yet</p>
            {user.role === "PARENT" && (
              <Link href="/search" className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
                Find a babysitter
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((booking) => {
              const otherPerson = session.role === "PARENT" ? booking.sitter : booking.parent;
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
    </div>
  );
}
