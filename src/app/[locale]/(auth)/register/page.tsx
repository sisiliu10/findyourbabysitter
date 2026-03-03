"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Suspense } from "react";
import { useTranslations } from "next-intl";

function RegisterForm() {
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const preselectedRole = searchParams.get("role") || "";

  const [step, setStep] = useState(preselectedRole ? 2 : 1);
  const [role, setRole] = useState(preselectedRole);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      setRegisteredEmail(data.email);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setResendMessage("");
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registeredEmail }),
      });
      const data = await res.json();
      setResendMessage(data.message || "Verification email sent.");
    } catch {
      setResendMessage("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  }

  // Show "check your email" screen after successful registration
  if (registeredEmail) {
    return (
      <div>
        <div className="mb-6 flex h-12 w-12 items-center justify-center border border-border-default">
          <svg className="h-6 w-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="font-serif text-4xl text-text-primary">{t("checkEmail")}</h1>
        <p className="mt-3 text-sm text-text-secondary">
          {t("verificationSentPrefix")}{" "}
          <span className="text-text-primary font-medium">{registeredEmail}</span>
          {t("verificationSentSuffix")}
        </p>
        <p className="mt-2 text-sm text-text-tertiary">
          {t("clickToVerify")}
        </p>

        <div className="mt-8 space-y-4">
          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full border border-border-default px-4 py-3 text-xs font-medium uppercase tracking-widest text-text-primary transition-colors hover:border-text-primary disabled:opacity-40"
          >
            {resending ? t("sending") : t("resendVerification")}
          </button>

          {resendMessage && (
            <p className="text-sm text-text-secondary">{resendMessage}</p>
          )}
        </div>

        <p className="mt-8 text-sm text-text-tertiary">
          {t("wrongEmail")}{" "}
          <button
            onClick={() => { setRegisteredEmail(""); setError(""); }}
            className="text-text-primary underline underline-offset-4 hover:text-accent"
          >
            {t("registerAgain")}
          </button>
        </p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div>
        <h1 className="font-serif text-4xl text-text-primary">{t("joinUs")}</h1>
        <p className="mt-3 text-sm text-text-secondary">{t("howUsePlatform")}</p>

        <div className="mt-10 space-y-0">
          <button
            onClick={() => { setRole("PARENT"); setStep(2); }}
            className="group w-full border border-border-default p-6 text-left transition-colors hover:border-text-primary"
          >
            <p className="text-xs uppercase tracking-wide text-text-muted mb-2">01</p>
            <h3 className="font-medium text-text-primary">{t("needBabysitter")}</h3>
            <p className="mt-1 text-sm text-text-secondary">{t("findBookCaregivers")}</p>
          </button>

          <button
            onClick={() => { setRole("BABYSITTER"); setStep(2); }}
            className="group w-full border border-border-default border-t-0 p-6 text-left transition-colors hover:border-text-primary"
          >
            <p className="text-xs uppercase tracking-wide text-text-muted mb-2">02</p>
            <h3 className="font-medium text-text-primary">{t("iAmBabysitter")}</h3>
            <p className="mt-1 text-sm text-text-secondary">{t("createProfileGetBooked")}</p>
          </button>
        </div>

        <p className="mt-8 text-sm text-text-tertiary">
          {t("alreadyAccount")}{" "}
          <Link href="/login" className="text-text-primary underline underline-offset-4 hover:text-accent">
            {t("login")}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setStep(1)}
        className="mb-6 flex items-center text-xs uppercase tracking-wide text-text-tertiary hover:text-text-primary"
      >
        <svg className="mr-1.5 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t("back")}
      </button>

      <h1 className="font-serif text-4xl text-text-primary">{t("createAccount")}</h1>
      <p className="mt-3 text-sm text-text-secondary">
        {t("signingUpAs")}{" "}
        <span className="text-text-primary font-medium">
          {role === "PARENT" ? t("signingUpAsParent") : t("signingUpAsSitter")}
        </span>
      </p>

      {error && (
        <div className="mt-6 border border-danger/30 bg-danger-muted px-4 py-3 text-sm text-danger">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-2">
              {t("firstName")}
            </label>
            <input id="firstName" name="firstName" required className="block w-full border border-border-default bg-transparent px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-text-primary focus:outline-none" />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-2">
              {t("lastName")}
            </label>
            <input id="lastName" name="lastName" required className="block w-full border border-border-default bg-transparent px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-text-primary focus:outline-none" />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-2">
            {t("email")}
          </label>
          <input id="email" name="email" type="email" required className="block w-full border border-border-default bg-transparent px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-text-primary focus:outline-none" placeholder={t("emailPlaceholder")} />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-2">
            {t("password")}
          </label>
          <input id="password" name="password" type="password" required minLength={8} className="block w-full border border-border-default bg-transparent px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-text-primary focus:outline-none" placeholder={t("passwordMinLength")} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-text-primary bg-text-primary px-4 py-3 text-xs font-medium uppercase tracking-widest text-surface-primary transition-colors hover:bg-accent hover:border-accent disabled:opacity-40"
        >
          {loading ? t("creatingAccount") : t("createAccount")}
        </button>
      </form>

      <p className="mt-8 text-sm text-text-tertiary">
        {t("alreadyAccount")}{" "}
        <Link href="/login" className="text-text-primary underline underline-offset-4 hover:text-accent">
          {t("login")}
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="border border-border-default bg-surface-secondary p-8 animate-pulse h-96" />}>
      <RegisterForm />
    </Suspense>
  );
}
