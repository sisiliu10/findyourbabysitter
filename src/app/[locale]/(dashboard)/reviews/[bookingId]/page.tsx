"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter, Link } from "@/i18n/navigation";
import { StarRating } from "@/components/ui/StarRating";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export default function ReviewPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          rating,
          title: title || undefined,
          comment: comment || undefined,
        }),
      });

      if (res.ok) {
        router.push(`/bookings/${bookingId}`);
        return;
      }

      // If there's no /api/reviews route, use server action fallback
      const json = await res.json();
      setError(json.error || "Failed to submit review");
    } catch {
      // Try the server action as fallback
      try {
        const { submitReview } = await import("@/actions/review.actions");
        const formData = new FormData();
        formData.set("bookingId", bookingId);
        formData.set("rating", String(rating));
        if (title) formData.set("title", title);
        if (comment) formData.set("comment", comment);

        const result = await submitReview(formData);
        if (result.success) {
          router.push(`/bookings/${bookingId}`);
        } else {
          setError(result.error || "Failed to submit review");
        }
      } catch {
        setError("Failed to submit review");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-8">
        <Link
          href={`/bookings/${bookingId}`}
          className="text-sm text-text-secondary hover:text-text-primary"
        >
          &larr; Back to booking
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-text-primary">
          Leave a Review
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Share your experience to help other parents.
        </p>
      </div>

      {error && (
        <div className="mb-6 border border-danger/30 bg-danger-muted p-3 text-sm text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border border-border-default bg-surface-secondary p-6">
          {/* Rating */}
          <div className="mb-6">
            <label className="mb-3 block text-xs font-medium uppercase tracking-wide text-text-secondary">
              Rating
            </label>
            <StarRating value={rating} onChange={setRating} size="lg" />
            {rating > 0 && (
              <p className="mt-2 text-sm text-text-secondary">
                {rating === 1
                  ? "Poor"
                  : rating === 2
                    ? "Fair"
                    : rating === 3
                      ? "Good"
                      : rating === 4
                        ? "Very Good"
                        : "Excellent"}
              </p>
            )}
          </div>

          {/* Title */}
          <div className="mb-4">
            <Input
              label="Title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
            />
          </div>

          {/* Comment */}
          <Textarea
            label="Your Review (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details about your experience with this babysitter..."
            rows={5}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pb-8">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push(`/bookings/${bookingId}`)}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={rating === 0}>
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </form>
    </div>
  );
}
