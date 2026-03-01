"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency, getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { createBooking } from "@/actions/booking.actions";

interface MatchedSitter {
  sitterId: string;
  score: number;
  matchReasons: string[];
  profile: {
    id: string;
    bio: string;
    hourlyRate: number;
    city: string;
    state: string;
    yearsExperience: number;
    hasFirstAid: boolean;
    hasCPR: boolean;
    hasTransportation: boolean;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
  };
}

export function MatchedSitters({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchedSitter[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/requests/${requestId}/matches`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.matches) {
          setMatches(json.data.matches);
        }
      })
      .catch(() => setError("Failed to load matches"))
      .finally(() => setLoading(false));
  }, [requestId]);

  async function handleRequestBooking(sitter: MatchedSitter) {
    setBookingLoading(sitter.sitterId);
    setError("");

    const formData = new FormData();
    formData.set("requestId", requestId);
    formData.set("sitterId", sitter.sitterId);
    formData.set("agreedRate", String(sitter.profile.hourlyRate));

    try {
      const result = await createBooking(formData);
      if (result.success && result.data) {
        const bookingId = (result.data as { bookingId: string }).bookingId;
        router.push(`/bookings/${bookingId}`);
      } else {
        setError(result.error || "Failed to create booking");
      }
    } catch {
      setError("Failed to create booking");
    } finally {
      setBookingLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="border border-border-default bg-surface-secondary p-8">
        <div className="flex items-center justify-center gap-3">
          <Spinner size="md" className="text-accent" />
          <span className="text-sm text-text-secondary">
            Finding matching sitters...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border-default bg-surface-secondary p-6">
      <h2 className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
        Matched Babysitters
        {matches.length > 0 && (
          <span className="ml-2 text-xs font-normal normal-case tracking-normal text-text-tertiary">
            ({matches.length})
          </span>
        )}
      </h2>

      {error && (
        <div className="mb-4 border border-danger/30 bg-danger-muted p-3 text-sm text-danger">
          {error}
        </div>
      )}

      {matches.length === 0 ? (
        <p className="text-sm text-text-secondary">
          No matching sitters found for this request yet. Try broadening your
          criteria.
        </p>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => {
            const { profile } = match;
            const { user } = profile;
            const initials = getInitials(user.firstName, user.lastName);

            return (
              <div
                key={match.sitterId}
                className="border border-border-default p-4 transition hover:border-text-primary"
              >
                <div className="flex items-start gap-4">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="h-12 w-12 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-accent-muted text-sm font-semibold text-accent">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-text-primary font-medium">
                        {user.firstName} {user.lastName}
                      </h3>
                      <Badge variant="info">{match.score}% match</Badge>
                    </div>
                    <p className="text-sm text-text-secondary">
                      {[profile.city, profile.state].filter(Boolean).join(", ")}{" "}
                      &middot; {formatCurrency(profile.hourlyRate)}/hr
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {match.matchReasons.map((reason, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center border border-accent/20 bg-accent-muted px-2 py-0.5 text-xs text-accent"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    loading={bookingLoading === match.sitterId}
                    onClick={() => handleRequestBooking(match)}
                  >
                    Request Booking
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
