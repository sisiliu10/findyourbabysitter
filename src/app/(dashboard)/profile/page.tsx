import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatDate, formatCurrency, getInitials } from "@/lib/utils";
import { DAYS_OF_WEEK, TIME_SLOTS } from "@/lib/constants";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export default async function ProfilePage() {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      babysitterProfile: true,
      reviewsReceived: {
        where: { isVisible: true },
        select: { rating: true },
      },
    },
  });

  if (!user) return null;

  const profile = user.babysitterProfile;
  const isSitter = user.role === "BABYSITTER";
  const initials = getInitials(user.firstName, user.lastName);

  let availability: Record<string, string[]> = {};
  if (profile?.availabilityJson) {
    try {
      availability = JSON.parse(profile.availabilityJson);
    } catch {
      availability = {};
    }
  }

  const avgRating =
    user.reviewsReceived.length > 0
      ? user.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) /
        user.reviewsReceived.length
      : null;

  const certifications: string[] = [];
  if (profile?.hasFirstAid) certifications.push("First Aid");
  if (profile?.hasCPR) certifications.push("CPR");
  if (profile?.hasTransportation) certifications.push("Transportation");

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-text-primary">Your Profile</h1>
        <Link
          href="/profile/edit"
          className="inline-flex items-center bg-text-primary px-5 py-2.5 text-sm font-medium text-surface-primary transition hover:bg-accent"
        >
          Edit Profile
        </Link>
      </div>

      {/* Header card */}
      <div className="border border-border-default bg-surface-secondary p-6">
        <div className="flex items-center gap-5">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={`${user.firstName} ${user.lastName}`}
              className="h-20 w-20 object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center bg-accent-muted text-xl font-semibold text-accent">
              {initials}
            </div>
          )}
          <div>
            <h2 className="text-xl font-medium text-text-primary">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-text-secondary">{user.email}</p>
            {user.phone && (
              <p className="text-sm text-text-secondary">{user.phone}</p>
            )}
            <div className="mt-1 flex items-center gap-2">
              <Badge variant={isSitter ? "info" : "neutral"}>
                {user.role === "BABYSITTER" ? "Babysitter" : "Parent"}
              </Badge>
              {avgRating !== null && (
                <span className="text-sm text-text-secondary">
                  {avgRating.toFixed(1)} stars ({user.reviewsReceived.length}{" "}
                  {user.reviewsReceived.length === 1 ? "review" : "reviews"})
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-text-tertiary">
              Joined {formatDate(user.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Sitter-specific sections */}
      {isSitter && profile && (
        <div className="mt-6 space-y-6">
          {/* Bio */}
          <div className="border border-border-default bg-surface-secondary p-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">About</p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
              {profile.bio || "No bio added yet."}
            </p>
          </div>

          {/* Rate & Experience */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border border-border-default bg-surface-secondary p-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">
                Hourly Rate
              </p>
              <p className="text-2xl font-medium text-text-primary">
                {formatCurrency(profile.hourlyRate)}
              </p>
            </div>
            <div className="border border-border-default bg-surface-secondary p-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">
                Experience
              </p>
              <p className="text-2xl font-medium text-text-primary">
                {profile.yearsExperience}{" "}
                {profile.yearsExperience === 1 ? "year" : "years"}
              </p>
            </div>
          </div>

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="border border-border-default bg-surface-secondary p-6">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">
                Certifications
              </p>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert) => (
                  <Badge key={cert} variant="success">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {profile.languages && (
            <div className="border border-border-default bg-surface-secondary p-6">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">
                Languages
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.languages.split(",").map((lang) => (
                  <Badge key={lang.trim()} variant="info">
                    {lang.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Age Range */}
          <div className="border border-border-default bg-surface-secondary p-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">
              Age Range
            </p>
            <p className="text-sm text-text-secondary">
              Comfortable with children ages{" "}
              <span className="font-medium text-text-primary">{profile.ageRangeMin}</span> to{" "}
              <span className="font-medium text-text-primary">{profile.ageRangeMax}</span>
            </p>
          </div>

          {/* Location */}
          {(profile.city || profile.state) && (
            <div className="border border-border-default bg-surface-secondary p-6">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">
                Location
              </p>
              <p className="text-sm text-text-secondary">
                {[profile.city, profile.state, profile.zipCode]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {profile.radiusMiles > 0 && (
                <p className="mt-1 text-sm text-text-secondary">
                  Willing to travel up to {profile.radiusMiles} miles
                </p>
              )}
            </div>
          )}

          {/* Availability Grid */}
          <div className="border border-border-default bg-surface-secondary p-6">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
              Availability
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wide text-text-secondary" />
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
                        const isAvailable = (
                          availability[day] || []
                        ).includes(slot);
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
        </div>
      )}

      {/* Parent-specific sections */}
      {!isSitter && (
        <div className="mt-6 space-y-6">
          {/* Location */}
          <div className="border border-border-default bg-surface-secondary p-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">
              Account Info
            </p>
            <div className="space-y-2 text-sm text-text-secondary">
              <p>
                <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">Email:</span>{" "}
                {user.email}
              </p>
              {user.phone && (
                <p>
                  <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">Phone:</span>{" "}
                  {user.phone}
                </p>
              )}
              <p>
                <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">Member since:</span>{" "}
                {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
