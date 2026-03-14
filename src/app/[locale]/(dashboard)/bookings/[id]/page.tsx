import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  formatDate,
  formatTime,
  formatCurrency,
  getInitials,
} from "@/lib/utils";
import { notFound, redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { BookingActions } from "./BookingActions";
import { AffiliateRecommendations } from "@/components/affiliate/AffiliateRecommendations";
import { getTranslations } from "next-intl/server";

const statusVariants: Record<string, BadgeVariant> = {
  PENDING: "warning",
  ACCEPTED: "info",
  CONFIRMED: "success",
  COMPLETED: "success",
  REVIEWED: "success",
  DECLINED: "danger",
  CANCELLED: "danger",
};

const TIMELINE_STEPS = [
  "PENDING",
  "ACCEPTED",
  "CONFIRMED",
  "COMPLETED",
] as const;

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const session = await requireAuth();
  const t = await getTranslations("bookingDetail");
  const tc = await getTranslations("common");
  const { id, locale } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      parent: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          email: true,
        },
      },
      sitter: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          email: true,
        },
      },
      request: {
        select: {
          id: true,
          title: true,
          childrenJson: true,
          numberOfChildren: true,
          specialNotes: true,
        },
      },
      review: true,
    },
  });

  if (!booking) notFound();

  const isParent = booking.parentId === session.userId;
  const isSitter = booking.sitterId === session.userId;

  if (!isParent && !isSitter) {
    redirect("/dashboard");
  }

  const otherPerson = isParent ? booking.sitter : booking.parent;
  const otherInitials = getInitials(
    otherPerson.firstName,
    otherPerson.lastName
  );

  let children: { name: string; age: number }[] = [];
  try {
    children = JSON.parse(booking.request.childrenJson);
  } catch {
    children = [];
  }

  // Determine which step is current for timeline
  const isCancelledOrDeclined =
    booking.status === "CANCELLED" || booking.status === "DECLINED";
  const currentStepIndex = TIMELINE_STEPS.indexOf(
    booking.status === "REVIEWED" ? "COMPLETED" : (booking.status as (typeof TIMELINE_STEPS)[number])
  );

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link
          href="/bookings"
          className="text-sm text-text-secondary hover:text-text-primary"
        >
          &larr; {t("backToBookings")}
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="font-serif text-2xl text-text-primary">{t("bookingDetails")}</h1>
          <Badge variant={statusVariants[booking.status] || "neutral"}>
            {tc(`status.${booking.status}` as any)}
          </Badge>
        </div>
      </div>

      <div className="space-y-6">
        {/* Status timeline */}
        {!isCancelledOrDeclined && (
          <div className="border border-border-default bg-surface-secondary p-6">
            <p className="mb-5 text-xs font-medium uppercase tracking-wide text-text-secondary">
              {t("bookingProgress")}
            </p>
            <div className="flex items-center justify-between">
              {TIMELINE_STEPS.map((step, index) => {
                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={step} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center text-xs font-medium transition ${
                          isCurrent
                            ? "bg-accent text-white"
                            : isActive
                              ? "bg-success text-white"
                              : "bg-surface-tertiary text-text-muted"
                        }`}
                      >
                        {isActive && !isCurrent ? (
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span
                        className={`mt-2 text-xs ${
                          isActive
                            ? "font-medium text-text-primary"
                            : "text-text-muted"
                        }`}
                      >
                        {t(step.toLowerCase() as any)}
                      </span>
                    </div>
                    {index < TIMELINE_STEPS.length - 1 && (
                      <div
                        className={`mx-2 h-0.5 flex-1 ${
                          index < currentStepIndex
                            ? "bg-success"
                            : "bg-surface-tertiary"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cancelled / Declined notice */}
        {isCancelledOrDeclined && (
          <div className="border border-danger/30 bg-danger-muted p-5">
            <p className="font-medium text-danger">
              {t("bookingWas", { status: tc(`status.${booking.status}` as any) })}
            </p>
            {booking.status === "DECLINED" && booking.declinedReason && (
              <p className="mt-1 text-sm text-danger">
                {t("reason", { reason: booking.declinedReason })}
              </p>
            )}
            {booking.status === "CANCELLED" && booking.cancelledReason && (
              <p className="mt-1 text-sm text-danger">
                {t("reason", { reason: booking.cancelledReason })}
              </p>
            )}
          </div>
        )}

        {/* Booking info */}
        <div className="border border-border-default bg-surface-secondary p-6">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
            {t("bookingInfo")}
          </p>
          <div className="flex items-center gap-4 pb-4">
            {otherPerson.avatarUrl ? (
              <img
                src={otherPerson.avatarUrl}
                alt={`${otherPerson.firstName} ${otherPerson.lastName}`}
                className="h-14 w-14 object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center bg-accent-muted text-sm font-semibold text-accent">
                {otherInitials}
              </div>
            )}
            <div>
              <p className="font-medium text-text-primary">
                {otherPerson.firstName} {otherPerson.lastName}
              </p>
              <p className="text-sm text-text-secondary">
                {isParent ? t("babysitter") : t("parent")}
              </p>
            </div>
          </div>

          <div className="grid gap-4 border-t border-border-default pt-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{t("date")}</p>
              <p className="mt-0.5 text-sm text-text-primary">
                {formatDate(booking.dateBooked)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{t("time")}</p>
              <p className="mt-0.5 text-sm text-text-primary">
                {formatTime(booking.startTime)} -{" "}
                {formatTime(booking.endTime)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{t("rate")}</p>
              <p className="mt-0.5 text-sm text-text-primary">
                {formatCurrency(booking.agreedRate)}/hr
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                {t("estimatedTotal")}
              </p>
              <p className="mt-0.5 text-sm font-medium text-text-primary">
                {formatCurrency(booking.totalEstimated)}
              </p>
            </div>
          </div>

          {booking.request?.title && (
            <div className="mt-4 border-t border-border-default pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{t("request")}</p>
              <Link
                href={`/requests/${booking.request.id}`}
                className="mt-0.5 text-sm text-accent hover:underline"
              >
                {booking.request.title}
              </Link>
            </div>
          )}

          {booking.parentNotes && (
            <div className="mt-4 border-t border-border-default pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                {t("parentNotes")}
              </p>
              <p className="mt-0.5 text-sm text-text-primary">
                {booking.parentNotes}
              </p>
            </div>
          )}
        </div>

        {/* Children info */}
        {children.length > 0 && (
          <div className="border border-border-default bg-surface-secondary p-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">
              {t("children")}
            </p>
            <div className="space-y-2">
              {children.map((child, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-surface-tertiary px-4 py-2.5"
                >
                  <div className="flex h-7 w-7 items-center justify-center bg-accent-muted text-xs font-semibold text-accent">
                    {child.name?.charAt(0)?.toUpperCase() || "C"}
                  </div>
                  <p className="text-sm text-text-secondary">
                    <span className="font-medium text-text-primary">
                      {child.name || t("childFallback", { n: i + 1 })}
                    </span>
                    {t("age", { age: child.age })}
                  </p>
                </div>
              ))}
            </div>
            {booking.request?.specialNotes && (
              <div className="mt-4 border-t border-border-default pt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                  {t("specialNotes")}
                </p>
                <p className="mt-0.5 text-sm text-text-primary">
                  {booking.request.specialNotes}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <BookingActions
          bookingId={booking.id}
          status={booking.status}
          isParent={isParent}
          isSitter={isSitter}
          hasReview={!!booking.review}
        />

        {/* Affiliate recommendations — shown to parents on active bookings */}
        {isParent && !isCancelledOrDeclined && (
          <AffiliateRecommendations locale={locale} context="booking" />
        )}

        {/* Message link */}
        {!isCancelledOrDeclined &&
          booking.status !== "DECLINED" && (
            <div className="flex justify-center pb-6">
              <Link
                href={`/messages/${booking.id}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                  />
                </svg>
                {t("messageUser", { name: otherPerson.firstName })}
              </Link>
            </div>
          )}
      </div>
    </div>
  );
}
