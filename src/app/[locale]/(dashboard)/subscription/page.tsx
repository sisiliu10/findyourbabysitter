"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Spinner } from "@/components/ui/Spinner";

interface SubscriptionData {
  isPremium: boolean;
  subscription: {
    status: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  } | null;
  usage: {
    conversations: { used: number; limit: number };
    likes: { used: number; limit: number };
    requests: { used: number; limit: number };
  };
}

export default function SubscriptionPage() {
  const t = useTranslations("premium");
  const { user } = useCurrentUser();
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState(false);
  const [success, setSuccess] = useState(false);

  // Check for success redirect from Stripe checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      setSuccess(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    fetch("/api/subscription/status")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setData(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePortal = async () => {
    setPortalLoading(true);
    setPortalError(false);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setPortalError(true);
        setPortalLoading(false);
      }
    } catch {
      setPortalError(true);
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" className="text-accent" />
      </div>
    );
  }

  const subStatus = data?.subscription?.status;
  const hasPaymentIssue = subStatus === "past_due" || subStatus === "action_required";

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 font-serif text-3xl text-text-primary">{t("subscriptionTitle")}</h1>

      {success && (
        <div className="mb-6 border border-success/30 bg-success-muted p-4 text-sm text-success">
          {t("welcomePremium")}
          {!data?.isPremium && (
            <p className="mt-1 text-xs opacity-75">{t("activatingNote")}</p>
          )}
        </div>
      )}

      {portalError && (
        <div className="mb-6 border border-error/30 bg-error-muted p-4 text-sm text-error">
          {t("portalError")}
        </div>
      )}

      {/* Payment issue banner — shown prominently above everything else */}
      {hasPaymentIssue && (
        <div className="mb-6 border border-warning/40 bg-warning-muted p-4">
          <p className="text-sm font-medium text-warning">
            {subStatus === "action_required" ? t("actionRequired") : t("paymentFailed")}
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            {subStatus === "action_required"
              ? t("actionRequiredMessage")
              : t("paymentFailedMessage")}
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

      {data?.isPremium && data.subscription ? (
        <div className="space-y-6">
          {/* Current plan */}
          <div className="border border-border-default bg-surface-secondary p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                  {t("currentPlan")}
                </p>
                <p className="mt-1 font-serif text-xl text-text-primary">{t("premiumPlan")}</p>
              </div>
              <span className="bg-success-muted px-2.5 py-1 text-xs font-medium text-success">
                {t("active")}
              </span>
            </div>

            {data.subscription.cancelAtPeriodEnd && (
              <p className="mt-3 text-sm text-warning">
                {t("canceledExpires", {
                  date: new Date(data.subscription.currentPeriodEnd).toLocaleDateString(),
                })}
              </p>
            )}

            {!data.subscription.cancelAtPeriodEnd && (
              <p className="mt-3 text-sm text-text-tertiary">
                {t("nextBilling", {
                  date: new Date(data.subscription.currentPeriodEnd).toLocaleDateString(),
                })}
              </p>
            )}

            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="mt-4 inline-block border border-border-default px-4 py-2 text-sm font-medium text-text-secondary transition hover:border-text-primary hover:text-text-primary disabled:opacity-50"
            >
              {portalLoading ? "..." : t("managePlan")}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Free plan info — only shown if no active subscription issue */}
          {!hasPaymentIssue && (
            <div className="border border-border-default bg-surface-secondary p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                {t("currentPlan")}
              </p>
              <p className="mt-1 font-serif text-xl text-text-primary">{t("free")}</p>

              {data && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">{t("contactsThisWeek")}</span>
                    <span className="text-text-primary">
                      {data.usage.conversations.used}/{data.usage.conversations.limit}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">{t("likesToday")}</span>
                    <span className="text-text-primary">
                      {data.usage.likes.used}/{data.usage.likes.limit}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">{t("activeRequests")}</span>
                    <span className="text-text-primary">
                      {data.usage.requests.used}/{data.usage.requests.limit}
                    </span>
                  </div>
                </div>
              )}

              <Link
                href="/pricing"
                className="mt-4 inline-block bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent/90"
              >
                {t("upgrade")}
              </Link>
            </div>
          )}

          {/* Paused subscription info — shown when issue exists but no active premium */}
          {hasPaymentIssue && data?.subscription && (
            <div className="border border-border-default bg-surface-secondary p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                    {t("currentPlan")}
                  </p>
                  <p className="mt-1 font-serif text-xl text-text-primary">{t("premiumPlan")}</p>
                </div>
                <span className="bg-warning-muted px-2.5 py-1 text-xs font-medium text-warning">
                  {subStatus === "action_required" ? t("statusActionRequired") : t("statusPastDue")}
                </span>
              </div>
              <p className="mt-3 text-sm text-text-tertiary">
                {t("accessPaused")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
