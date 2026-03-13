import { Suspense } from "react";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import { ExpressInterestButton } from "@/components/requests/ExpressInterestButton";
import { BrowseFilters } from "@/components/requests/BrowseFilters";

export const dynamic = "force-dynamic";

const CAT_LABELS: Record<string, string> = {
  after_school: "After school",
  full_day: "Full day",
  overnight: "Overnight",
  date_night: "Date night",
  other: "Other",
};

interface PageProps {
  searchParams: Promise<{ city?: string; careType?: string; careCategory?: string }>;
}

export default async function BrowseRequestsPage({ searchParams }: PageProps) {
  const session = await requireAuth();
  if (session.role !== "BABYSITTER") redirect("/dashboard");

  const { city, careType, careCategory } = await searchParams;
  const t = await getTranslations("browseRequests");

  const requests = await prisma.childcareRequest.findMany({
    where: {
      status: "OPEN",
      ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
      ...(careType ? { careType } : {}),
      ...(careCategory ? { careCategory } : {}),
    },
    include: {
      parent: { select: { firstName: true, avatarUrl: true } },
      bookings: {
        where: { sitterId: session.userId },
        select: { id: true, status: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-text-primary">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("subtitle")}</p>
      </div>

      <div className="mb-6">
        <Suspense>
          <BrowseFilters />
        </Suspense>
      </div>

      {requests.length === 0 ? (
        <div className="border border-border-default bg-surface-secondary p-12 text-center">
          <svg className="mx-auto mb-3 h-10 w-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm text-text-secondary">{t("noRequests")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const alreadySent = request.bookings.length > 0;

            let childrenSummary = "";
            try {
              const children = JSON.parse(request.childrenJson) as Array<{ ageRange?: string; age?: number }>;
              childrenSummary = children
                .map((c) => c.ageRange ?? (c.age != null ? `${c.age} yrs` : null))
                .filter(Boolean)
                .join(", ");
            } catch {
              childrenSummary = "";
            }

            let scheduleSummary = "";
            if (request.careType === "recurring" && request.recurringDays) {
              try {
                const dayMap: Record<string, string> = { MON: "Mon", TUE: "Tue", WED: "Wed", THU: "Thu", FRI: "Fri", SAT: "Sat", SUN: "Sun" };
                const days = (JSON.parse(request.recurringDays) as string[]).map((d) => dayMap[d] ?? d).join(", ");
                scheduleSummary = `${days} · ${request.startTime}–${request.endTime}`;
              } catch { scheduleSummary = request.startTime + "–" + request.endTime; }
            } else if (request.dateNeeded) {
              const date = new Date(request.dateNeeded).toLocaleDateString("en-DE", { day: "numeric", month: "short" });
              scheduleSummary = `${date} · ${request.startTime}–${request.endTime}`;
            } else {
              scheduleSummary = `${request.startTime}–${request.endTime}`;
            }

            return (
              <div key={request.id} className="border border-border-default bg-surface-secondary p-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={request.careType === "recurring" ? "info" : "neutral"}>
                      {request.careType === "recurring" ? t("recurring") : t("occasional")}
                    </Badge>
                    {request.careCategory && (
                      <Badge variant="neutral">
                        {CAT_LABELS[request.careCategory] ?? request.careCategory}
                      </Badge>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-text-tertiary">{request.city}</span>
                </div>

                <div className="mb-3 space-y-1">
                  <p className="text-sm font-medium text-text-primary">{scheduleSummary}</p>
                  <p className="text-sm text-text-secondary">
                    {t("childCount", { count: request.numberOfChildren })}
                    {childrenSummary ? ` · ${childrenSummary}` : ""}
                  </p>
                  {(request.description || request.specialNotes) && (
                    <p className="line-clamp-2 text-sm text-text-secondary">
                      {(request.description || request.specialNotes).slice(0, 160)}
                    </p>
                  )}
                  {request.maxHourlyRate ? (
                    <p className="text-xs text-text-tertiary">Budget: up to €{request.maxHourlyRate}/h</p>
                  ) : null}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-tertiary">
                    {t("postedBy", { name: request.parent.firstName })}
                  </span>
                  <ExpressInterestButton requestId={request.id} alreadySent={alreadySent} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
