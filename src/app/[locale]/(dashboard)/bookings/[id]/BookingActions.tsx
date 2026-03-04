"use client";

import { useState } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

interface BookingActionsProps {
  bookingId: string;
  status: string;
  isParent: boolean;
  isSitter: boolean;
  hasReview: boolean;
}

export function BookingActions({
  bookingId,
  status,
  isParent,
  isSitter,
  hasReview,
}: BookingActionsProps) {
  const router = useRouter();
  const t = useTranslations("bookingActions");
  const tc = useTranslations("common");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function updateStatus(newStatus: string) {
    setLoading(newStatus);
    setError("");

    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || t("failedToUpdate"));
      } else {
        router.refresh();
      }
    } catch {
      setError(tc("somethingWentWrong"));
    } finally {
      setLoading(null);
    }
  }

  const showActions =
    (isSitter && status === "PENDING") ||
    (isParent && (status === "PENDING" || status === "ACCEPTED" || status === "CONFIRMED")) ||
    (isParent && status === "COMPLETED" && !hasReview);

  if (!showActions) return null;

  return (
    <div className="border border-border-default bg-surface-secondary p-6">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">{t("actions")}</p>

      {error && (
        <div className="mb-4 border border-danger/30 bg-danger-muted p-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {/* Sitter: Accept/Decline when PENDING */}
        {isSitter && status === "PENDING" && (
          <>
            <Button
              onClick={() => updateStatus("ACCEPTED")}
              loading={loading === "ACCEPTED"}
            >
              {t("accept")}
            </Button>
            <Button
              variant="danger"
              onClick={() => updateStatus("DECLINED")}
              loading={loading === "DECLINED"}
            >
              {t("decline")}
            </Button>
          </>
        )}

        {/* Parent: Cancel when PENDING or ACCEPTED */}
        {isParent && (status === "PENDING" || status === "ACCEPTED") && (
          <Button
            variant="danger"
            onClick={() => updateStatus("CANCELLED")}
            loading={loading === "CANCELLED"}
          >
            {t("cancelBooking")}
          </Button>
        )}

        {/* Parent: Confirm when ACCEPTED */}
        {isParent && status === "ACCEPTED" && (
          <Button
            onClick={() => updateStatus("CONFIRMED")}
            loading={loading === "CONFIRMED"}
          >
            {t("confirmBooking")}
          </Button>
        )}

        {/* Parent: Mark Complete when CONFIRMED */}
        {isParent && status === "CONFIRMED" && (
          <>
            <Button
              onClick={() => updateStatus("COMPLETED")}
              loading={loading === "COMPLETED"}
            >
              {t("markComplete")}
            </Button>
            <Button
              variant="danger"
              onClick={() => updateStatus("CANCELLED")}
              loading={loading === "CANCELLED"}
            >
              {t("cancelBooking")}
            </Button>
          </>
        )}

        {/* Parent: Leave Review when COMPLETED */}
        {isParent && status === "COMPLETED" && !hasReview && (
          <Link href={`/reviews/${bookingId}`}>
            <Button variant="secondary">{t("leaveReview")}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
