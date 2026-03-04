"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  const t = useTranslations("forgotPassword");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("somethingWentWrong"));
        return;
      }

      setSubmittedEmail(email);
      setSubmitted(true);
    } catch {
      setError(t("somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div>
        <div className="mb-6 flex h-12 w-12 items-center justify-center border border-border-default">
          <svg className="h-6 w-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="font-serif text-4xl text-text-primary">{t("checkEmail")}</h1>
        <p className="mt-3 text-sm text-text-secondary">
          {t("emailSent", { email: submittedEmail })}
        </p>
        <p className="mt-2 text-sm text-text-tertiary">
          {t("linkExpires")}
        </p>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => { setSubmitted(false); setSubmittedEmail(""); }}
            className="w-full border border-border-default px-4 py-3 text-xs font-medium uppercase tracking-widest text-text-primary transition-colors hover:border-text-primary"
          >
            {t("tryDifferentEmail")}
          </button>
        </div>

        <p className="mt-8 text-sm text-text-tertiary">
          {t("rememberPassword")}{" "}
          <Link href="/login" className="text-text-primary underline underline-offset-4 hover:text-accent">{t("logIn")}</Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-4xl text-text-primary">{t("resetPassword")}</h1>
      <p className="mt-3 text-sm text-text-secondary">
        {t("subtitle")}
      </p>

      {error && (
        <div className="mt-6 border border-danger/30 bg-danger-muted px-4 py-3 text-sm text-danger">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-2">{t("email")}</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="block w-full border border-border-default bg-transparent px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-text-primary focus:outline-none"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-text-primary bg-text-primary px-4 py-3 text-xs font-medium uppercase tracking-widest text-surface-primary transition-colors hover:bg-accent hover:border-accent disabled:opacity-40"
        >
          {loading ? t("sending") : t("sendResetLink")}
        </button>
      </form>

      <p className="mt-8 text-sm text-text-tertiary">
        {t("rememberPassword")}{" "}
        <Link href="/login" className="text-text-primary underline underline-offset-4 hover:text-accent">{t("logIn")}</Link>
      </p>
    </div>
  );
}
