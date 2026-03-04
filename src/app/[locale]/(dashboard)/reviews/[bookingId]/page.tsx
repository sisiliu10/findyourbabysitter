"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter, Link } from "@/i18n/navigation";
import { StarRating } from "@/components/ui/StarRating";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

export default function ReviewPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;
  const router = useRouter();
  const t = useTranslations("reviewForm");
  const tc = useTranslations("common");

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError(t("selectRating"));
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
      setError(json.error || t("failedToSubmit"));
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
          setError(result.error || t("failedToSubmit"));
        }
      } catch {
        setError(t("failedToSubmit"));
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
          &larr; {t("backToBooking")}
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-text-primary">
          {t("leaveReview")}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {t("subtitle")}
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
              {t("rating")}
            </label>
            <StarRating value={rating} onChange={setRating} size="lg" />
            {rating > 0 && (
              <p className="mt-2 text-sm text-text-secondary">
                {rating === 1
                  ? t("poor")
                  : rating === 2
                    ? t("fair")
                    : rating === 3
                      ? t("good")
                      : rating === 4
                        ? t("veryGood")
                        : t("excellent")}
              </p>
            )}
          </div>

          {/* Title */}
          <div className="mb-4">
            <Input
              label={t("titleOptional")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("titlePlaceholder")}
            />
          </div>

          {/* Comment */}
          <Textarea
            label={t("reviewOptional")}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t("reviewPlaceholder")}
            rows={5}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pb-8">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push(`/bookings/${bookingId}`)}
          >
            {tc("cancel")}
          </Button>
          <Button type="submit" loading={loading} disabled={rating === 0}>
            {loading ? t("submitting") : t("submitReview")}
          </Button>
        </div>
      </form>
    </div>
  );
}
