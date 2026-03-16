"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { expressInterest } from "@/actions/request.actions";

interface Props {
  requestId: string;
  alreadySent?: boolean;
}

export function ExpressInterestButton({ requestId, alreadySent = false }: Props) {
  const t = useTranslations("browseRequests");
  const [sent, setSent] = useState(alreadySent);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    if (sent || loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await expressInterest(requestId);
      if (result.success) {
        setSent(true);
        setBookingId(result.data?.bookingId ?? null);
      } else if (result.error === "already_expressed") {
        setSent(true);
      } else if (result.error === "no_rate") {
        setError(t("noRateError"));
      } else {
        setError(result.error || t("failedToExpress"));
      }
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          {t("interestSent")}
        </span>
        {bookingId && (
          <Link
            href={`/bookings/${bookingId}`}
            className="text-sm font-medium text-accent hover:underline"
          >
            {t("viewBooking")} →
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent/90 disabled:opacity-60"
      >
        {loading ? "..." : t("expressInterest")}
      </button>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
