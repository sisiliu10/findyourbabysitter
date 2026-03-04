import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatDate, formatTime, formatCurrency, getInitials } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { MatchedSitters } from "./MatchedSitters";
import { getTranslations } from "next-intl/server";

const statusVariants: Record<string, BadgeVariant> = {
  OPEN: "success",
  MATCHED: "info",
  CLOSED: "neutral",
};

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAuth();
  const t = await getTranslations("requestDetail");
  const tc = await getTranslations("common");
  const { id } = await params;

  const request = await prisma.childcareRequest.findUnique({
    where: { id },
    include: {
      bookings: {
        include: {
          sitter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  if (!request) notFound();

  if (request.parentId !== session.userId) {
    redirect("/dashboard");
  }

  let children: { name: string; age: number }[] = [];
  try {
    children = JSON.parse(request.childrenJson);
  } catch {
    children = [];
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/requests"
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            &larr; {t("backToRequests")}
          </Link>
          <h1 className="mt-2 font-serif text-2xl text-text-primary">
            {request.title}
          </h1>
        </div>
        <Badge variant={statusVariants[request.status] || "neutral"}>
          {tc(`status.${request.status}` as any)}
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Request details */}
        <div className="border border-border-default bg-surface-secondary p-6">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">{t("details")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{t("date")}</p>
              <p className="mt-1 text-sm text-text-primary">
                {formatDate(request.dateNeeded)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{t("time")}</p>
              <p className="mt-1 text-sm text-text-primary">
                {formatTime(request.startTime)} -{" "}
                {formatTime(request.endTime)} ({request.durationHours}h)
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{t("location")}</p>
              <p className="mt-1 text-sm text-text-primary">
                {[request.city, request.state, request.zipCode]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
            {request.maxHourlyRate && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{t("maxRate")}</p>
                <p className="mt-1 text-sm text-text-primary">
                  {formatCurrency(request.maxHourlyRate)}/hr
                </p>
              </div>
            )}
          </div>
          {request.specialNotes && (
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{t("specialNotes")}</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-text-secondary">
                {request.specialNotes}
              </p>
            </div>
          )}
        </div>

        {/* Children */}
        {children.length > 0 && (
          <div className="border border-border-default bg-surface-secondary p-6">
            <h2 className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
              {t("childrenCount", { count: children.length })}
            </h2>
            <div className="space-y-2">
              {children.map((child, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 border border-border-default bg-surface-tertiary px-4 py-2.5"
                >
                  <div className="flex h-8 w-8 items-center justify-center bg-accent-muted text-xs font-semibold text-accent">
                    {child.name?.charAt(0)?.toUpperCase() || "C"}
                  </div>
                  <div>
                    <p className="text-sm text-text-primary font-medium">
                      {child.name || t("childFallback", { n: i + 1 })}
                    </p>
                    <p className="text-xs text-text-secondary">{t("ageLabel", { age: child.age })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing bookings */}
        {request.bookings.length > 0 && (
          <div className="border border-border-default bg-surface-secondary p-6">
            <h2 className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
              {t("bookings")}
            </h2>
            <div className="space-y-2">
              {request.bookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/bookings/${booking.id}`}
                  className="flex items-center justify-between border border-border-default bg-surface-tertiary px-4 py-3 transition hover:border-text-primary"
                >
                  <div className="flex items-center gap-3">
                    {booking.sitter.avatarUrl ? (
                      <img
                        src={booking.sitter.avatarUrl}
                        alt={`${booking.sitter.firstName} ${booking.sitter.lastName}`}
                        className="h-8 w-8 object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center bg-accent-muted text-xs font-semibold text-accent">
                        {getInitials(
                          booking.sitter.firstName,
                          booking.sitter.lastName
                        )}
                      </div>
                    )}
                    <span className="text-sm font-medium text-text-primary">
                      {booking.sitter.firstName} {booking.sitter.lastName}
                    </span>
                  </div>
                  <Badge
                    variant={
                      booking.status === "PENDING"
                        ? "warning"
                        : booking.status === "ACCEPTED"
                          ? "info"
                          : booking.status === "CONFIRMED"
                            ? "success"
                            : booking.status === "COMPLETED" ||
                                booking.status === "REVIEWED"
                              ? "success"
                              : booking.status === "DECLINED" ||
                                  booking.status === "CANCELLED"
                                ? "danger"
                                : "neutral"
                    }
                  >
                    {tc(`status.${booking.status}` as any)}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Matched sitters - client component for OPEN requests */}
        {request.status === "OPEN" && <MatchedSitters requestId={id} />}
      </div>
    </div>
  );
}
