import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatDate, formatTime, formatCurrency, getInitials } from "@/lib/utils";
import Link from "next/link";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";

const statusVariants: Record<string, BadgeVariant> = {
  PENDING: "warning",
  ACCEPTED: "info",
  CONFIRMED: "success",
  COMPLETED: "success",
  REVIEWED: "success",
  DECLINED: "danger",
  CANCELLED: "danger",
};

const statusColors: Record<string, string> = {
  PENDING: "border-l-warning",
  ACCEPTED: "border-l-info",
  CONFIRMED: "border-l-success",
  COMPLETED: "border-l-success",
  REVIEWED: "border-l-success",
  DECLINED: "border-l-danger",
  CANCELLED: "border-l-danger",
};

export default async function BookingsListPage() {
  const session = await requireAuth();

  const bookings = await prisma.booking.findMany({
    where: {
      OR: [
        { parentId: session.userId },
        { sitterId: session.userId },
      ],
    },
    include: {
      parent: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      },
      sitter: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      },
      request: {
        select: { title: true },
      },
    },
    orderBy: { dateBooked: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-text-primary">Bookings</h1>
        <p className="mt-1 text-sm text-text-secondary">
          View and manage all your bookings.
        </p>
      </div>

      {bookings.length === 0 ? (
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
          <p className="text-sm text-text-secondary">No bookings yet.</p>
          {session.role === "PARENT" && (
            <Link
              href="/search"
              className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
            >
              Find a babysitter
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
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
                className={`flex items-center justify-between border border-border-default border-l-4 bg-surface-secondary p-5 transition hover:border-border-hover ${statusColors[booking.status] || "border-l-text-tertiary"}`}
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
                <Badge variant={statusVariants[booking.status] || "neutral"}>
                  {booking.status}
                </Badge>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
