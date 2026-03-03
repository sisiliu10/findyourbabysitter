"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [expiredEmail, setExpiredEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    async function verify() {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message);
          setTimeout(() => router.push("/login"), 3000);
        } else {
          setStatus("error");
          setMessage(data.error);
          if (data.email) setExpiredEmail(data.email);
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    }

    verify();
  }, [token, router]);

  async function handleResend() {
    if (!expiredEmail) return;
    setResending(true);
    setResendMessage("");
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: expiredEmail }),
      });
      const data = await res.json();
      setResendMessage(data.message || "Verification email sent.");
    } catch {
      setResendMessage("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  }

  if (status === "loading") {
    return (
      <div>
        <h1 className="font-serif text-4xl text-text-primary">Verifying your email</h1>
        <p className="mt-3 text-sm text-text-secondary">Please wait...</p>
        <div className="mt-8 h-1 w-full overflow-hidden border border-border-default">
          <div className="h-full w-1/3 animate-pulse bg-text-primary" />
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div>
        <div className="mb-6 flex h-12 w-12 items-center justify-center border border-border-default">
          <svg className="h-6 w-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-serif text-4xl text-text-primary">Email verified</h1>
        <p className="mt-3 text-sm text-text-secondary">{message}</p>
        <p className="mt-2 text-sm text-text-tertiary">Redirecting to login...</p>

        <Link
          href="/login"
          className="mt-8 inline-block w-full border border-text-primary bg-text-primary px-4 py-3 text-center text-xs font-medium uppercase tracking-widest text-surface-primary transition-colors hover:bg-accent hover:border-accent"
        >
          Log in now
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex h-12 w-12 items-center justify-center border border-danger/30">
        <svg className="h-6 w-6 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h1 className="font-serif text-4xl text-text-primary">Verification failed</h1>
      <p className="mt-3 text-sm text-text-secondary">{message}</p>

      {expiredEmail && (
        <div className="mt-8 space-y-4">
          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full border border-border-default px-4 py-3 text-xs font-medium uppercase tracking-widest text-text-primary transition-colors hover:border-text-primary disabled:opacity-40"
          >
            {resending ? "Sending..." : "Resend verification email"}
          </button>

          {resendMessage && (
            <p className="text-sm text-text-secondary">{resendMessage}</p>
          )}
        </div>
      )}

      <p className="mt-8 text-sm text-text-tertiary">
        <Link href="/register" className="text-text-primary underline underline-offset-4 hover:text-accent">
          Back to registration
        </Link>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="border border-border-default bg-surface-secondary p-8 animate-pulse h-96" />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
