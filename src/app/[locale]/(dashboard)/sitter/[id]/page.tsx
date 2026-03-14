import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatDate, formatCurrency, getInitials } from "@/lib/utils";
import { DAYS_OF_WEEK, TIME_SLOTS } from "@/lib/constants";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { AffiliateRecommendations } from "@/components/affiliate/AffiliateRecommendations";
import { getTranslations } from "next-intl/server";

export default async function SitterProfilePage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const session = await requireAuth();
  const { id, locale } = await params;
  const isParent = session.role === "PARENT";
  const t = await getTranslations("sitterProfile");

  const profile = await prisma.babysitterProfile.findUnique({
    where: { userId: id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          district: true,
          lastSeenAt: true,
          createdAt: true,
        },
      },
    },
  });

  if (!profile) notFound();

  const reviews = await prisma.review.findMany({
    where: { subjectId: id, isVisible: true },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  const { user } = profile;
  const initials = getInitials(user.firstName, user.lastName);

  // Compute last-seen status
  const lastSeen = (() => {
    if (!user.lastSeenAt) return { text: t("activeNow"), isActive: true };
    const diff = Date.now() - new Date(user.lastSeenAt).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 5) return { text: t("activeNow"), isActive: true };
    if (minutes < 60) return { text: t("lastSeenMinutes", { count: minutes }), isActive: false };
    if (hours < 24) return { text: t("lastSeenHours", { count: hours }), isActive: false };
    if (days < 30) return { text: t("lastSeenDays", { count: days }), isActive: false };
    return { text: t("lastSeenDate", { date: new Date(user.lastSeenAt).toLocaleDateString() }), isActive: false };
  })();

  let availability: Record<string, string[]> = {};
  try {
    availability = JSON.parse(profile.availabilityJson);
  } catch {
    availability = {};
  }

  const certifications: string[] = [];
  if (profile.hasFirstAid) certifications.push("First Aid");
  if (profile.hasCPR) certifications.push("CPR");
  if (profile.hasTransportation) certifications.push("Transportation");

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="border border-border-default bg-surface-secondary p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={`${user.firstName} ${user.lastName}`}
              className="h-24 w-24 object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center bg-accent-muted text-2xl font-semibold text-accent">
              {initials}
            </div>
          )}
          <div className="flex-1">
            <h1 className="font-serif text-2xl text-text-primary">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-text-secondary">
              {user.district || "Berlin"}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {avgRating !== null && (
                <div className="flex items-center gap-1.5">
                  <StarRating value={Math.round(avgRating)} readonly size="sm" />
                  <span className="text-sm font-medium text-text-secondary">
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-text-tertiary">
                    ({t("reviewCount", { count: reviews.length })})
                  </span>
                </div>
              )}
              <span className="text-lg font-medium text-text-primary">
                {formatCurrency(profile.hourlyRate)}
                <span className="text-sm font-normal text-text-tertiary">{t("perHr")}</span>
              </span>
            </div>
            <p className="mt-1 text-xs text-text-tertiary">
              {t("memberSince", { date: formatDate(user.createdAt, locale) })}
              {" · "}
              <span className={lastSeen.isActive ? "text-success" : ""}>
                {lastSeen.text}
              </span>
            </p>
          </div>
          <Link
            href={`/requests/new?sitterId=${id}`}
            className="mt-4 inline-flex items-center justify-center bg-text-primary px-5 py-2.5 text-sm font-medium text-surface-primary transition hover:bg-accent sm:mt-0"
          >
            {t("requestBooking")}
          </Link>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* About */}
        {profile.bio && (
          <div className="border border-border-default bg-surface-secondary p-6">
            <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">{t("about")}</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Experience & Certifications */}
        <div className="border border-border-default bg-surface-secondary p-6">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
            {t("experienceAndCerts")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">{t("experience")}</p>
              <p className="mt-1 text-lg font-medium text-text-primary">
                {t("yearCount", { count: profile.yearsExperience })}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">{t("ageRange")}</p>
              <p className="mt-1 text-lg font-medium text-text-primary">
                {profile.ageRangeMin} - {profile.ageRangeMax} {t("yrs")}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">{t("languages")}</p>
              <p className="mt-1 text-lg font-medium text-text-primary">
                {profile.languages}
              </p>
            </div>
          </div>
          {certifications.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {certifications.map((cert) => (
                <Badge key={cert} variant="success">
                  {cert}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Availability */}
        <div className="border border-border-default bg-surface-secondary p-6">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
            {t("availability")}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="pb-3 text-left font-medium text-text-secondary" />
                  {TIME_SLOTS.map((slot) => (
                    <th
                      key={slot}
                      className="pb-3 text-center text-xs font-medium uppercase tracking-wide text-text-secondary"
                    >
                      {slot}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS_OF_WEEK.map((day) => (
                  <tr key={day}>
                    <td className="py-2 pr-4 text-sm capitalize text-text-secondary">
                      {day}
                    </td>
                    {TIME_SLOTS.map((slot) => {
                      const isAvailable = (availability[day] || []).includes(
                        slot
                      );
                      return (
                        <td key={slot} className="py-2 text-center">
                          <span
                            className={`inline-flex h-8 w-8 items-center justify-center text-xs ${
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
        </div>

        {/* Rate */}
        <div className="border border-border-default bg-surface-secondary p-6">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">{t("rate")}</h2>
          <p className="text-3xl font-medium text-text-primary">
            {formatCurrency(profile.hourlyRate)}
            <span className="text-base font-normal text-text-tertiary"> {t("perHour")}</span>
          </p>
        </div>

        {/* Before you book tip */}
        <div className="border border-accent/20 bg-accent-muted p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-accent">
            {t("beforeYouBook")}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            {t("meetupTip")}
          </p>
          <Link
            href="/guides/first-meetup-babysitter"
            className="mt-3 inline-block text-sm font-medium text-accent underline-offset-2 hover:underline"
          >
            {t("meetupTipLink")}
          </Link>
        </div>

        {/* Affiliate recommendations — parents only */}
        {isParent && (
          <AffiliateRecommendations locale={locale} context="profile" />
        )}

        {/* Reviews */}
        <div className="border border-border-default bg-surface-secondary p-6">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
            {t("reviews")}
            {reviews.length > 0 && (
              <span className="ml-2 text-xs font-normal normal-case tracking-normal text-text-tertiary">
                ({reviews.length})
              </span>
            )}
          </h2>
          {reviews.length === 0 ? (
            <p className="text-sm text-text-secondary">{t("noReviews")}</p>
          ) : (
            <div className="space-y-5">
              {reviews.map((review) => {
                const reviewerInitials = getInitials(
                  review.author.firstName,
                  review.author.lastName
                );
                return (
                  <div
                    key={review.id}
                    className="border-b border-border-default pb-5 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      {review.author.avatarUrl ? (
                        <img
                          src={review.author.avatarUrl}
                          alt={`${review.author.firstName} ${review.author.lastName}`}
                          className="h-8 w-8 object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center bg-surface-tertiary text-xs font-semibold text-text-secondary">
                          {reviewerInitials}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {review.author.firstName} {review.author.lastName}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          {formatDate(review.createdAt, locale)}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <StarRating
                          value={review.rating}
                          readonly
                          size="sm"
                        />
                      </div>
                    </div>
                    {review.title && (
                      <p className="mt-2 text-sm font-medium text-text-primary">
                        {review.title}
                      </p>
                    )}
                    {review.comment && (
                      <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                        {review.comment}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
