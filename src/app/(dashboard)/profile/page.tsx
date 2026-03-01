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
            {user.instagram && (
              <a
                href={`https://instagram.com/${user.instagram.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-accent transition hover:text-text-primary"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                {user.instagram.startsWith("@") ? user.instagram : `@${user.instagram}`}
              </a>
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
