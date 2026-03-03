"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, Link } from "@/i18n/navigation";
import { Suspense } from "react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div>
        <div className="mb-6 flex h-12 w-12 items-center justify-center border border-danger/30">
          <svg className="h-6 w-6 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="font-serif text-4xl text-text-primary">Invalid link</h1>
        <p className="mt-3 text-sm text-text-secondary">This password reset link is invalid or incomplete.</p>
        <Link
          href="/forgot-password"
          className="mt-8 inline-block w-full border border-text-primary bg-text-primary px-4 py-3 text-center text-xs font-medium uppercase tracking-widest text-surface-primary transition-colors hover:bg-accent hover:border-accent"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Reset failed");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div>
        <div className="mb-6 flex h-12 w-12 items-center justify-center border border-border-default">
          <svg className="h-6 w-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-serif text-4xl text-text-primary">Password reset</h1>
        <p className="mt-3 text-sm text-text-secondary">Your password has been updated. Redirecting to login...</p>

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
      <h1 className="font-serif text-4xl text-text-primary">Set new password</h1>
      <p className="mt-3 text-sm text-text-secondary">Enter your new password below.</p>

      {error && (
        <div className="mt-6 border border-danger/30 bg-danger-muted px-4 py-3 text-sm text-danger">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-2">New password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="block w-full border border-border-default bg-transparent px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-text-primary focus:outline-none"
            placeholder="Min 8 characters"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-2">Confirm password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            className="block w-full border border-border-default bg-transparent px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-text-primary focus:outline-none"
            placeholder="Repeat your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-text-primary bg-text-primary px-4 py-3 text-xs font-medium uppercase tracking-widest text-surface-primary transition-colors hover:bg-accent hover:border-accent disabled:opacity-40"
        >
          {loading ? "Resetting..." : "Reset password"}
        </button>
      </form>

      <p className="mt-8 text-sm text-text-tertiary">
        <Link href="/forgot-password" className="text-text-primary underline underline-offset-4 hover:text-accent">
          Request a new reset link
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="border border-border-default bg-surface-secondary p-8 animate-pulse h-96" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
