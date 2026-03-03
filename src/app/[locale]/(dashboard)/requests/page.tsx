import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatDate, formatTime } from "@/lib/utils";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";

const statusVariants: Record<string, BadgeVariant> = {
  OPEN: "success",
  MATCHED: "info",
  CLOSED: "neutral",
};

export default async function RequestsListPage() {
  const session = await requireAuth();

  if (session.role !== "PARENT") {
    redirect("/dashboard");
  }

  const requests = await prisma.childcareRequest.findMany({
    where: { parentId: session.userId },
    orderBy: { dateNeeded: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-text-primary">Your Requests</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage your childcare requests.
          </p>
        </div>
        <Link
          href="/requests/new"
          className="inline-flex items-center bg-text-primary px-4 py-2 text-sm font-medium text-surface-primary transition hover:bg-accent"
        >
          <svg
            className="mr-1.5 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          New Request
        </Link>
      </div>

      {requests.length === 0 ? (
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
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <p className="text-sm text-text-secondary">No requests yet.</p>
          <Link
            href="/requests/new"
            className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
          >
            Create your first request
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => {
            let childCount = 1;
            try {
              const children = JSON.parse(request.childrenJson);
              childCount = Array.isArray(children) ? children.length : request.numberOfChildren;
            } catch {
              childCount = request.numberOfChildren;
            }

            return (
              <Link
                key={request.id}
                href={`/requests/${request.id}`}
                className="flex items-center justify-between border border-border-default bg-surface-secondary p-5 transition hover:border-text-primary"
              >
                <div>
                  <h3 className="text-text-primary font-medium">
                    {request.title}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {formatDate(request.dateNeeded)} &middot;{" "}
                    {formatTime(request.startTime)} -{" "}
                    {formatTime(request.endTime)}
                  </p>
                  <p className="mt-0.5 text-xs text-text-tertiary">
                    {childCount} {childCount === 1 ? "child" : "children"}{" "}
                    &middot;{" "}
                    {[request.city, request.state].filter(Boolean).join(", ")}
                  </p>
                </div>
                <Badge variant={statusVariants[request.status] || "neutral"}>
                  {request.status}
                </Badge>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
