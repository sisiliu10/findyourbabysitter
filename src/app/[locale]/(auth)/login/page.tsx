"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useResendCooldown } from "@/hooks/useResendCooldown";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("auth");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const { cooldown, startCooldown, isOnCooldown } = useResendCooldown();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setUnverifiedEmail("");
    setResendMessage("");

    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("loginFailed"));
        if (data.needsVerification && data.email) {
          setUnverifiedEmail(data.email);
        }
        return;
      }

      router.push(data.data.onboarded ? "/dashboard" : "/onboarding");
      router.refresh();
    } catch {
      setError(t("somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (isOnCooldown) return;
    setResendMessage("");
    startCooldown();
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: unverifiedEmail }),
      });
      const data = await res.json();
      setResendMessage(data.message || t("verificationSent"));
    } catch {
      setResendMessage(t("failedResend"));
    }
  }

  return (
    <div>
      <h1 className="font-serif text-4xl text-text-primary">{t("welcomeBack")}</h1>
      <p className="mt-3 text-sm text-text-secondary">{t("loginSubtitle")}</p>

      {error && (
        <div className="mt-6 border border-danger/30 bg-danger-muted px-4 py-3 text-sm text-danger">
          {error}
          {unverifiedEmail && (
            <div className="mt-3">
              <button
                onClick={handleResend}
                disabled={isOnCooldown}
                className="text-text-primary underline underline-offset-4 hover:text-accent text-sm disabled:opacity-40"
              >
                {isOnCooldown
                  ? t("resendCooldown", { seconds: cooldown })
                  : t("resendVerification")}
              </button>
              {resendMessage && (
                <p className="mt-2 text-text-secondary">{resendMessage}</p>
              )}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-2">
            {t("email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="block w-full border border-border-default bg-transparent px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-text-primary focus:outline-none"
            placeholder={t("emailPlaceholder")}
          />
        </div>

        <PasswordInput
          id="password"
          name="password"
          label={t("password")}
          required
          autoComplete="current-password"
          placeholder={t("passwordPlaceholder")}
        />

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs text-text-tertiary underline underline-offset-4 hover:text-accent">
            {t("forgotPassword")}
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-text-primary bg-text-primary px-4 py-3 text-xs font-medium uppercase tracking-widest text-surface-primary transition-colors hover:bg-accent hover:border-accent disabled:opacity-40"
        >
          {loading ? t("loggingIn") : t("login")}
        </button>
      </form>

      <p className="mt-8 text-sm text-text-tertiary">
        {t("noAccount")}{" "}
        <Link href="/register" className="text-text-primary underline underline-offset-4 hover:text-accent">
          {t("signUp")}
        </Link>
      </p>
    </div>
  );
}
