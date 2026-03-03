"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";

export default function ForgotPasswordPage() {
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
        setError(data.error || "Something went wrong");
        return;
      }

      setSubmittedEmail(email);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
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

        <h1 className="font-serif text-4xl text-text-primary">Check your email</h1>
        <p className="mt-3 text-sm text-text-secondary">
          If an account exists for{" "}
          <span className="text-text-primary font-medium">{submittedEmail}</span>,
          we sent a password reset link.
        </p>
        <p className="mt-2 text-sm text-text-tertiary">
          The link expires in 1 hour. Check your spam folder if you don't see it.
        </p>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => { setSubmitted(false); setSubmittedEmail(""); }}
            className="w-full border border-border-default px-4 py-3 text-xs font-medium uppercase tracking-widest text-text-primary transition-colors hover:border-text-primary"
          >
            Try a different email
          </button>
        </div>

        <p className="mt-8 text-sm text-text-tertiary">
          Remember your password?{" "}
          <Link href="/login" className="text-text-primary underline underline-offset-4 hover:text-accent">Log in</Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-4xl text-text-primary">Reset password</h1>
      <p className="mt-3 text-sm text-text-secondary">
        Enter your email and we'll send you a link to reset your password.
      </p>

      {error && (
        <div className="mt-6 border border-danger/30 bg-danger-muted px-4 py-3 text-sm text-danger">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-2">Email</label>
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
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="mt-8 text-sm text-text-tertiary">
        Remember your password?{" "}
        <Link href="/login" className="text-text-primary underline underline-offset-4 hover:text-accent">Log in</Link>
      </p>
    </div>
  );
}
