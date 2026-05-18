import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getInitials, formatCurrency } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

function formatLastSeen(lastSeenAt: Date | null): { text: string; active: boolean } {
  if (!lastSeenAt) return { text: "Offline", active: false };
  const diff = Date.now() - new Date(lastSeenAt).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 5) return { text: "Gerade aktiv", active: true };
  if (min < 60) return { text: `Vor ${min} Min.`, active: true };
  const h = Math.floor(min / 60);
  if (h < 24) return { text: `Vor ${h} Std.`, active: false };
  const d = Math.floor(h / 24);
  return { text: `Vor ${d} Tagen`, active: false };
}

export default async function ParentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();
  const { id } = await params;

  const parent = await prisma.user.findUnique({
    where: { id, role: "PARENT", isDisabled: false },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      birthday: true,
      bio: true,
      district: true,
      zipCode: true,
      childcareTypes: true,
      timesOfDay: true,
      careFrequency: true,
      lastSeenAt: true,
      createdAt: true,
      childcareRequests: {
        where: { status: "OPEN" },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          city: true,
          careType: true,
          careCategory: true,
          numberOfChildren: true,
          childrenJson: true,
          startTime: true,
          endTime: true,
          maxHourlyRate: true,
          dateNeeded: true,
        },
      },
    },
  });

  if (!parent) notFound();

  const tn = await getTranslations("childcareNeeds");

  const initials = getInitials(parent.firstName, parent.lastName);
  const age = parent.birthday
    ? Math.floor((Date.now() - new Date(parent.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null;
  const lastSeen = formatLastSeen(parent.lastSeenAt);

  let childcareTypes: string[] = [];
  let timesOfDay: string[] = [];
  try { childcareTypes = JSON.parse(parent.childcareTypes || "[]"); } catch { /* */ }
  try { timesOfDay = JSON.parse(parent.timesOfDay || "[]"); } catch { /* */ }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Back */}
      <Link
        href="/search?mode=moms"
        className="mb-6 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-text-tertiary hover:text-text-primary"
      >
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Zurück
      </Link>

      {/* Header card */}
      <div className="border border-border-default bg-surface-secondary">
        <div className="flex items-start gap-6 p-6">
          {parent.avatarUrl ? (
            <img
              src={parent.avatarUrl}
              alt={`${parent.firstName} ${parent.lastName}`}
              className="h-24 w-24 shrink-0 object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center bg-surface-tertiary font-serif text-3xl text-text-muted/60">
              {initials}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl text-text-primary">
                  {parent.firstName} {parent.lastName}
                  {age && <span className="ml-2 font-sans text-lg font-light text-text-tertiary">{age}</span>}
                </h1>
                {parent.district && (
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-text-secondary">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {parent.district}
                  </p>
                )}
              </div>
              <span className={`flex shrink-0 items-center gap-1.5 text-xs ${lastSeen.active ? "text-success" : "text-text-muted"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${lastSeen.active ? "bg-success" : "bg-text-muted"}`} />
                {lastSeen.text}
              </span>
            </div>

            {parent.bio && (
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{parent.bio}</p>
            )}

            {/* Needs chips */}
            {(childcareTypes.length > 0 || timesOfDay.length > 0 || parent.careFrequency) && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {childcareTypes.map((type) => (
                  <span key={type} className="bg-accent-muted px-2.5 py-1 text-xs text-accent">
                    {tn(`types.${type}`)}
                  </span>
                ))}
                {timesOfDay.map((time) => (
                  <span key={time} className="bg-info-muted px-2.5 py-1 text-xs text-info">
                    {tn(`times.${time}`)}
                  </span>
                ))}
                {parent.careFrequency && (
                  <span className="bg-surface-tertiary px-2.5 py-1 text-xs text-text-secondary">
                    {tn(`frequencies.${parent.careFrequency}`)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Message CTA */}
        <div className="border-t border-border-default p-4">
          <Link
            href="/messages"
            className="block w-full bg-text-primary px-4 py-3 text-center text-xs font-medium uppercase tracking-widest text-surface-primary transition hover:bg-accent"
          >
            Nachricht senden
          </Link>
        </div>
      </div>

      {/* Open requests */}
      {parent.childcareRequests.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">
            Offene Betreuungsanfragen ({parent.childcareRequests.length})
          </p>
          <div className="space-y-3">
            {parent.childcareRequests.map((req) => {
              let children: { name: string; age: number }[] = [];
              try { children = JSON.parse(req.childrenJson); } catch { /* */ }

              return (
                <div key={req.id} className="border border-border-default bg-surface-secondary p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-text-primary">{req.title}</p>
                      {req.city && (
                        <p className="mt-0.5 text-xs text-text-tertiary">📍 {req.city}</p>
                      )}
                    </div>
                    {req.maxHourlyRate && (
                      <span className="shrink-0 text-sm font-medium text-accent">
                        bis {formatCurrency(req.maxHourlyRate)}/Std.
                      </span>
                    )}
                  </div>

                  {req.description && (
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary line-clamp-2">
                      {req.description}
                    </p>
                  )}

                  {children.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {children.map((child, i) => (
                        <span key={i} className="bg-surface-tertiary px-2.5 py-1 text-xs text-text-secondary">
                          {child.name ? `${child.name}, ${child.age}J` : `Kind, ${child.age}J`}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-3 text-xs text-text-muted">
                    <span>{req.startTime} – {req.endTime}</span>
                    {req.dateNeeded && (
                      <span>· {new Date(req.dateNeeded).toLocaleDateString("de-DE")}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="mt-6 text-xs text-text-muted">
        Mitglied seit {new Date(parent.createdAt).toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
      </p>
    </div>
  );
}
