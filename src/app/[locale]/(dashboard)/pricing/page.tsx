"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function PricingPage() {
  const t = useTranslations("premium");
  const { user } = useCurrentUser();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subStatus, setSubStatus] = useState<string | null>(null);
  const [usage, setUsage] = useState<{
    conversations: { used: number; limit: number };
    likes: { used: number; limit: number };
    requests: { used: number; limit: number };
  } | null>(null);

  useEffect(() => {
    fetch("/api/subscription/status")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setUsage(json.data.usage);
          setSubStatus(json.data.subscription?.status ?? null);
        }
      })
      .catch(() => {});
  }, []);

  const hasPaymentIssue = subStatus === "past_due" || subStatus === "action_required";

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: billingPeriod }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Could not open billing portal. Please try again.");
        setPortalLoading(false);
      }
    } catch {
      setError("Could not open billing portal. Please try again.");
      setPortalLoading(false);
    }
  };

  const features = [
    { label: t("feature_unlimitedMessages"), free: t("freeLimit_messages") as string | false },
    { label: t("feature_unlimitedLikes"), free: t("freeLimit_likes") as string | false },
    { label: t("feature_unlimitedRequests"), free: t("freeLimit_requests") as string | false },
    { label: t("feature_premiumBadge"), free: false as string | false },
    { label: t("feature_seeWhoLikedYou"), free: false as string | false },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl text-text-primary">{t("title")}</h1>
        <p className="mt-2 text-sm text-text-secondary">{t("subtitle")}</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 border border-error/30 bg-error-muted p-4 text-sm text-error">
          {error}
        </div>
      )}

      {/* Payment issue banner */}
      {hasPaymentIssue && (
        <div className="mb-6 border border-warning/40 bg-warning-muted p-4">
          <p className="text-sm font-medium text-warning">
            {subStatus === "action_required" ? t("actionRequired") : t("paymentFailed")}
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            {subStatus === "action_required" ? t("actionRequiredMessage") : t("paymentFailedMessage")}
          </p>
          <button
            onClick={handlePortal}
            disabled={portalLoading}
            className="mt-3 inline-block bg-warning px-4 py-2 text-sm font-medium text-white transition hover:bg-warning/90 disabled:opacity-50"
          >
            {portalLoading ? "..." : t("fixPayment")}
          </button>
        </div>
      )}

      {/* Current usage for free users */}
      {usage && !user?.isPremium && !hasPaymentIssue && (
        <div className="mb-8 border border-border-default bg-surface-secondary p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">
            {t("currentUsage")}
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-medium text-text-primary">
                {usage.conversations.used}/{usage.conversations.limit}
              </p>
              <p className="text-xs text-text-tertiary">{t("contactsThisWeek")}</p>
            </div>
            <div>
              <p className="text-2xl font-medium text-text-primary">
                {usage.likes.used}/{usage.likes.limit}
              </p>
              <p className="text-xs text-text-tertiary">{t("likesToday")}</p>
            </div>
            <div>
              <p className="text-2xl font-medium text-text-primary">
                {usage.requests.used}/{usage.requests.limit}
              </p>
              <p className="text-xs text-text-tertiary">{t("activeRequests")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Billing toggle — hidden if payment issue exists */}
      {!hasPaymentIssue && (
        <div className="mb-8 flex justify-center">
          <div className="flex border border-border-default">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-5 py-2.5 text-sm font-medium transition ${
                billingPeriod === "monthly"
                  ? "bg-text-primary text-surface-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {t("monthly")}
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-5 py-2.5 text-sm font-medium transition ${
                billingPeriod === "yearly"
                  ? "bg-text-primary text-surface-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {t("yearly")}
              <span className="ml-1.5 bg-success-muted px-1.5 py-0.5 text-[10px] font-medium text-success">
                {t("yearlyDiscount")}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Comparison table */}
      <div className="grid grid-cols-2 gap-4">
        {/* Free */}
        <div className="border border-border-default p-6">
          <h3 className="text-xs font-medium uppercase tracking-wide text-text-secondary">
            {t("free")}
          </h3>
          <p className="mt-2 font-serif text-2xl text-text-primary">{t("freePrice")}</p>
          <p className="mt-1 text-xs text-text-tertiary">{t("foreverFree")}</p>
          <ul className="mt-6 space-y-3">
            {features.map((f) => (
              <li key={f.label} className="flex items-start gap-2 text-sm">
                {typeof f.free === "string" ? (
                  <>
                    <span className="mt-0.5 text-text-tertiary">~</span>
                    <span className="text-text-secondary">{f.free}</span>
                  </>
                ) : (
                  <>
                    <span className="mt-0.5 text-text-muted">✕</span>
                    <span className="text-text-muted">{f.label}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Premium */}
        <div className="border-2 border-accent bg-accent-muted p-6">
          <h3 className="text-xs font-medium uppercase tracking-wide text-accent">
            {t("premiumPlan")}
          </h3>
          {!hasPaymentIssue && (
            <>
              <p className="mt-2 font-serif text-2xl text-text-primary">
                {billingPeriod === "monthly" ? t("monthlyPrice") : t("yearlyPriceMonthly")}
              </p>
              <p className="mt-1 text-xs text-text-tertiary">{t("perMonth")}</p>
              {billingPeriod === "yearly" && (
                <p className="mt-0.5 text-xs text-text-muted">{t("billedAnnually")}</p>
              )}
            </>
          )}

          <ul className="mt-6 space-y-3">
            {features.map((f) => (
              <li key={f.label} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 text-success">✓</span>
                <span className="text-text-primary">{f.label}</span>
              </li>
            ))}
          </ul>

          {user?.isPremium ? (
            <div className="mt-6 w-full bg-success-muted px-4 py-2.5 text-center text-sm font-medium text-success">
              {t("currentPlan")}
            </div>
          ) : hasPaymentIssue ? (
            // User has a subscription but payment issue — send to portal, not new checkout
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="mt-6 block w-full bg-warning px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-warning/90 disabled:opacity-50"
            >
              {portalLoading ? "..." : t("fixPayment")}
            </button>
          ) : (
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="mt-6 block w-full bg-accent px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-accent/90 disabled:opacity-50"
            >
              {loading ? "..." : t("upgrade")}
            </button>
          )}
          {!hasPaymentIssue && (
            <p className="mt-3 text-center text-xs text-text-tertiary">
              {t("cancelAnytime")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
