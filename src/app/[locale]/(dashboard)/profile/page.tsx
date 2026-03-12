import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatDate, formatCurrency, getInitials } from "@/lib/utils";
import { DAYS_OF_WEEK, TIME_SLOTS, CHILDCARE_TYPES, CARE_TIMES_OF_DAY, CARE_FREQUENCIES } from "@/lib/constants";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import { getTranslations } from "next-intl/server";
import { isPremium } from "@/lib/subscription";

function formatLastSeen(
  lastSeenAt: Date | null,
  t: (key: string, params?: Record<string, unknown>) => string,
): { text: string; isActive: boolean } {
  if (!lastSeenAt) return { text: t("activeNow"), isActive: true };

  const now = Date.now();
  const diff = now - lastSeenAt.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 5) return { text: t("activeNow"), isActive: true };
  if (minutes < 60) return { text: t("lastSeenMinutes", { count: minutes }), isActive: false };
  if (hours < 24) return { text: t("lastSeenHours", { count: hours }), isActive: false };
  if (days < 30) return { text: t("lastSeenDays", { count: days }), isActive: false };
  return { text: t("lastSeenDate", { date: lastSeenAt.toLocaleDateString() }), isActive: false };
}

function calculateCompleteness(
  user: {
    avatarUrl: string | null;
    bio: string;
    phone: string | null;
    birthday: Date | null;
  },
  profile: {
    bio: string;
    hourlyRate: number;
    yearsExperience: number;
    languages: string;
    hasFirstAid: boolean;
    hasCPR: boolean;
    hasTransportation: boolean;
    city: string;
  } | null,
  isSitter: boolean,
): number {
  if (isSitter && profile) {
    let filled = 0;
    const total = 8;
    if (user.avatarUrl) filled++;
    if (profile.bio) filled++;
    if (user.phone) filled++;
    if (profile.hourlyRate > 0) filled++;
    if (profile.yearsExperience > 0) filled++;
    if (profile.languages) filled++;
    if (profile.hasFirstAid || profile.hasCPR || profile.hasTransportation)
      filled++;
    if (profile.city) filled++;
    return Math.round((filled / total) * 100);
  } else {
    let filled = 0;
    const total = 4;
    if (user.avatarUrl) filled++;
    if (user.bio) filled++;
    if (user.phone) filled++;
    if (user.birthday) filled++;
    return Math.round((filled / total) * 100);
  }
}

export default async function ProfilePage() {
  const session = await requireAuth();
  const t = await getTranslations("profileView");
  const tc = await getTranslations("common");
  const tn = await getTranslations("childcareNeeds");
  const tp = await getTranslations("premium");

  const [user, bookingsCount, likesCount, matchesCount, userIsPremium] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        babysitterProfile: true,
        reviewsReceived: {
          where: { isVisible: true },
          select: { rating: true },
        },
      },
    }),
    prisma.booking.count({
      where: {
        OR: [{ parentId: session.userId }, { sitterId: session.userId }],
      },
    }),
    prisma.like.count({
      where: { toUserId: session.userId },
    }),
    prisma.match.count({
      where: {
        OR: [{ user1Id: session.userId }, { user2Id: session.userId }],
      },
    }),
    isPremium(session.userId),
  ]);

  if (!user) return null;

  const profile = user.babysitterProfile;
  const isSitter = user.role === "BABYSITTER";
  const initials = getInitials(user.firstName, user.lastName);
  const reviewsCount = user.reviewsReceived.length;

  let availability: Record<string, string[]> = {};
  if (profile?.availabilityJson) {
    try {
      availability = JSON.parse(profile.availabilityJson);
    } catch {
      availability = {};
    }
  }

  const avgRating =
    reviewsCount > 0
      ? user.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) /
        reviewsCount
      : null;

  const certifications: string[] = [];
  if (profile?.hasFirstAid) certifications.push(t("firstAid"));
  if (profile?.hasCPR) certifications.push(t("cpr"));
  if (profile?.hasTransportation) certifications.push(t("transportation"));

  const completeness = calculateCompleteness(user, profile, isSitter);
  const bio = isSitter ? profile?.bio || "" : user.bio;
  const location = profile
    ? [profile.city, profile.state].filter(Boolean).join(", ")
    : "";
  const roleLabel =
    user.role === "PARENT" || user.role === "BABYSITTER"
      ? tc(`roles.${user.role}` as "roles.PARENT" | "roles.BABYSITTER")
      : null;

  // Parse childcare needs for parents
  let parsedChildcareTypes: string[] = [];
  let parsedTimesOfDay: string[] = [];
  try { parsedChildcareTypes = JSON.parse(user.childcareTypes || "[]"); } catch { /* empty */ }
  try { parsedTimesOfDay = JSON.parse(user.timesOfDay || "[]"); } catch { /* empty */ }
  const parsedCareFrequency = user.careFrequency || "";
  const hasChildcareNeeds = parsedChildcareTypes.length > 0 || parsedTimesOfDay.length > 0 || parsedCareFrequency;

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-8">
      {/* ─── Hero Profile Card ─── */}
      <div className="bg-surface-tertiary p-6 sm:p-8">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left sm:gap-6">
          {/* Avatar */}
          <div className="mb-4 shrink-0 sm:mb-0">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-28 w-28 object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center bg-accent-muted text-2xl font-semibold text-accent">
                {initials}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            {/* Name */}
            <h1 className="font-serif text-2xl text-text-primary">
              {user.firstName} {user.lastName}
            </h1>

            {/* Instagram */}
            {user.instagram && (
              <a
                href={`https://instagram.com/${user.instagram.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-accent transition hover:text-accent-hover"
              >
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                {user.instagram.startsWith("@")
                  ? user.instagram
                  : `@${user.instagram}`}
              </a>
            )}

            {/* Context line: role + location + joined */}
            <p className="text-sm text-text-secondary">
              {[roleLabel, location, t("joined", { date: formatDate(user.createdAt) })]
                .filter(Boolean)
                .join(" \u00b7 ")}
            </p>

            {/* Last seen */}
            {(() => {
              const { text, isActive } = formatLastSeen(user.lastSeenAt, t as any);
              return (
                <p className="flex items-center justify-center gap-1.5 text-xs text-text-tertiary sm:justify-start">
                  <span
                    className={`inline-block h-2 w-2 ${isActive ? "bg-success" : "bg-text-muted"}`}
                    style={{ borderRadius: "50%" }}
                  />
                  {text}
                </p>
              );
            })()}

            {/* Rating */}
            {avgRating !== null && (
              <p className="text-sm text-text-secondary">
                <span className="text-accent">{"\u2605"}</span>{" "}
                {t("stars", {
                  rating: avgRating.toFixed(1),
                  count: reviewsCount,
                })}
              </p>
            )}

            {/* Pill tags */}
            <div className="flex flex-wrap justify-center gap-2 pt-1 sm:justify-start">
              {roleLabel && (
                <Badge variant={isSitter ? "info" : "neutral"}>
                  {roleLabel}
                </Badge>
              )}
              {user.emailVerified && (
                <Badge variant="success">{t("emailVerifiedStatus")}</Badge>
              )}
              {location && <Badge variant="neutral">{location}</Badge>}
            </div>

            {/* Edit Profile button */}
            <div className="pt-2">
              <Link
                href="/profile/edit"
                className="inline-flex items-center bg-text-primary px-5 py-2.5 text-sm font-medium text-surface-primary transition hover:bg-accent"
              >
                {t("editProfile")}
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Completeness */}
        {completeness < 100 && (
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-text-secondary">
                {t("profileComplete", { percent: completeness })}
              </span>
            </div>
            <div className="h-1.5 bg-surface-primary">
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ─── Premium Upgrade Card (free parents only) ─── */}
      {!isSitter && !userIsPremium && (
        <div className="border border-accent/30 bg-accent-muted p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-accent/15">
              <svg
                className="h-5 w-5 text-accent"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-text-primary">{tp("upgrade")}</p>
              <p className="text-xs text-text-secondary">{tp("subtitle")}</p>
            </div>
          </div>
          <ul className="mb-5 space-y-2">
            {(
              [
                "feature_unlimitedMessages",
                "feature_unlimitedLikes",
                "feature_unlimitedRequests",
                "feature_seeWhoLikedYou",
              ] as const
            ).map((key) => (
              <li key={key} className="flex items-center gap-2 text-sm text-text-secondary">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center bg-accent/15 text-[10px] font-bold text-accent">
                  ✓
                </span>
                {tp(key)}
              </li>
            ))}
          </ul>
          <Link
            href="/pricing"
            className="flex w-full items-center justify-center gap-1.5 bg-accent px-4 py-3 text-sm font-medium text-white transition hover:bg-accent/90"
          >
            {tp("upgrade")}
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      )}

      {/* ─── About ─── */}
      <section>
        <h2 className="mb-3 font-serif text-lg text-text-primary">
          {t("about")}
        </h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
          {bio || t("noBio")}
        </p>
      </section>

      {/* ─── Childcare Needs (Parents) ─── */}
      {!isSitter && hasChildcareNeeds && (
        <section>
          <h2 className="mb-4 font-serif text-lg text-text-primary">
            {tn("title")}
          </h2>
          <div className="space-y-4">
            {parsedChildcareTypes.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">
                  {tn("childcareType")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {parsedChildcareTypes.map((type) => (
                    <span
                      key={type}
                      className="border border-border-default bg-surface-secondary px-3 py-1 text-xs text-text-secondary"
                    >
                      {tn(`types.${type}` as any)}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {parsedTimesOfDay.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">
                  {tn("timeOfDay")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {parsedTimesOfDay.map((time) => (
                    <span
                      key={time}
                      className="border border-border-default bg-surface-secondary px-3 py-1 text-xs text-text-secondary"
                    >
                      {tn(`times.${time}` as any)}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {parsedCareFrequency && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">
                  {tn("frequency")}
                </p>
                <span className="border border-border-default bg-surface-secondary px-3 py-1 text-xs text-text-secondary">
                  {tn(`frequencies.${parsedCareFrequency}` as any)}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── Quick Stats ─── */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { value: bookingsCount, label: t("bookingsLabel") },
          { value: likesCount, label: t("likesLabel") },
          { value: matchesCount, label: t("matchesLabel") },
          { value: reviewsCount, label: t("reviewsLabel") },
        ].map((stat) => (
          <div
            key={stat.label}
            className="border border-border-subtle bg-surface-secondary p-4 text-center"
          >
            <p className="text-xl font-semibold text-text-primary">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-text-tertiary">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* ─── Sitter: Experience & Skills ─── */}
      {isSitter && profile && (
        <section>
          <h2 className="mb-4 font-serif text-lg text-text-primary">
            {t("experienceSkills")}
          </h2>

          {/* Rate & Experience highlight cards */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="bg-accent-muted p-5">
              <p className="text-2xl font-semibold text-accent">
                {formatCurrency(profile.hourlyRate)}
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                {t("hourlyRate")}
              </p>
            </div>
            <div className="bg-success-muted p-5">
              <p className="text-2xl font-semibold text-success">
                {t("yearCount", { count: profile.yearsExperience })}
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                {t("experience")}
              </p>
            </div>
          </div>

          {/* Languages */}
          {profile.languages && (
            <div className="mb-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">
                {t("languages")}
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.languages.split(",").map((lang) => (
                  <span
                    key={lang.trim()}
                    className="border border-border-default bg-surface-secondary px-3 py-1 text-xs text-text-secondary"
                  >
                    {lang.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">
                {t("certifications")}
              </p>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert) => (
                  <span
                    key={cert}
                    className="border border-success/20 bg-success-muted px-3 py-1 text-xs text-success"
                  >
                    {"\u2713"} {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Age Range */}
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <svg
              className="h-4 w-4 text-text-tertiary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            <span>
              {t("ageRangeDesc", {
                min: profile.ageRangeMin,
                max: profile.ageRangeMax,
              })}
            </span>
          </div>
        </section>
      )}

      {/* ─── Location ─── */}
      {isSitter && profile && (profile.city || profile.state) && (
        <section>
          <h2 className="mb-3 font-serif text-lg text-text-primary">
            {t("location")}
          </h2>
          <div className="flex items-start gap-2 text-sm text-text-secondary">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-text-tertiary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
            <div>
              <p>
                {[profile.city, profile.state, profile.zipCode]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {profile.radiusMiles > 0 && (
                <p className="mt-0.5 text-text-tertiary">
                  {t("travelRadius", { miles: profile.radiusMiles })}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── Availability ─── */}
      {isSitter && profile && (
        <section>
          <h2 className="mb-4 font-serif text-lg text-text-primary">
            {t("availability")}
          </h2>
          <div className="overflow-x-auto border border-border-subtle bg-surface-secondary p-4 sm:p-5">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wide text-text-tertiary" />
                  {TIME_SLOTS.map((slot) => (
                    <th
                      key={slot}
                      className="pb-3 text-center text-xs font-medium uppercase tracking-wide text-text-tertiary"
                    >
                      {tc(`timeSlots.${slot}` as "timeSlots.morning" | "timeSlots.afternoon" | "timeSlots.evening")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS_OF_WEEK.map((day) => (
                  <tr key={day} className="border-t border-border-subtle">
                    <td className="py-2.5 pr-4 text-sm capitalize text-text-secondary">
                      {tc(`days.${day}` as "days.monday" | "days.tuesday" | "days.wednesday" | "days.thursday" | "days.friday" | "days.saturday" | "days.sunday")}
                    </td>
                    {TIME_SLOTS.map((slot) => {
                      const isAvailable = (
                        availability[day] || []
                      ).includes(slot);
                      return (
                        <td key={slot} className="py-2.5 text-center">
                          <span
                            className={`inline-flex h-7 w-7 items-center justify-center text-xs ${
                              isAvailable
                                ? "bg-success-muted text-success"
                                : "bg-surface-tertiary text-text-muted"
                            }`}
                          >
                            {isAvailable ? "\u2713" : "\u2013"}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ─── Trust & Verification ─── */}
      <section>
        <h2 className="mb-4 font-serif text-lg text-text-primary">
          {t("trustVerification")}
        </h2>
        <div className="space-y-3">
          {/* Email */}
          <div className="flex items-center gap-3">
            <span
              className={`flex h-6 w-6 items-center justify-center text-xs ${
                user.emailVerified
                  ? "bg-success-muted text-success"
                  : "bg-surface-tertiary text-text-muted"
              }`}
            >
              {user.emailVerified ? "\u2713" : "\u2013"}
            </span>
            <span className="text-sm text-text-secondary">
              {user.emailVerified
                ? t("emailVerifiedStatus")
                : t("emailNotVerified")}
            </span>
          </div>
          {/* Phone */}
          <div className="flex items-center gap-3">
            <span
              className={`flex h-6 w-6 items-center justify-center text-xs ${
                user.phone
                  ? "bg-success-muted text-success"
                  : "bg-surface-tertiary text-text-muted"
              }`}
            >
              {user.phone ? "\u2713" : "\u2013"}
            </span>
            <span className="text-sm text-text-secondary">
              {user.phone ? t("phoneAdded") : t("phoneNotAdded")}
            </span>
          </div>
          {/* Reviews */}
          <div className="flex items-center gap-3">
            <span
              className={`flex h-6 w-6 items-center justify-center text-xs ${
                reviewsCount > 0
                  ? "bg-accent-muted text-accent"
                  : "bg-surface-tertiary text-text-muted"
              }`}
            >
              {"\u2605"}
            </span>
            <span className="text-sm text-text-secondary">
              {t("reviewsReceivedCount", { count: reviewsCount })}
            </span>
          </div>
        </div>
      </section>

      {/* ─── Account (de-emphasized) ─── */}
      <section className="border-t border-border-subtle pt-6">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-muted">
          {t("account")}
        </p>
        <div className="space-y-1.5 text-xs text-text-tertiary">
          <p>{user.email}</p>
          {user.phone && <p>{user.phone}</p>}
          <p>{t("joined", { date: formatDate(user.createdAt) })}</p>
        </div>
      </section>
    </div>
  );
}
