"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

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
        setError(data.error || "Login failed");
        if (data.needsVerification && data.email) {
          setUnverifiedEmail(data.email);
        }
        return;
      }

      router.push(data.onboarded ? "/dashboard" : "/onboarding");
      router.refresh();
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
        body: JSON.stringify({ email: unverifiedEmail }),
      });
      const data = await res.json();
      setResendMessage(data.message || "Verification email sent.");
    } catch {
      setResendMessage("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-4xl text-text-primary">Welcome back</h1>
      <p className="mt-3 text-sm text-text-secondary">Log in to your account</p>

      {error && (
        <div className="mt-6 border border-danger/30 bg-danger-muted px-4 py-3 text-sm text-danger">
          {error}
          {unverifiedEmail && (
            <div className="mt-3">
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-text-primary underline underline-offset-4 hover:text-accent text-sm disabled:opacity-40"
              >
                {resending ? "Sending..." : "Resend verification email"}
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

        <div>
          <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-2">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="block w-full border border-border-default bg-transparent px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-text-primary focus:outline-none"
            placeholder="Your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-text-primary bg-text-primary px-4 py-3 text-xs font-medium uppercase tracking-widest text-surface-primary transition-colors hover:bg-accent hover:border-accent disabled:opacity-40"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-8 text-sm text-text-tertiary">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-text-primary underline underline-offset-4 hover:text-accent">Sign up</Link>
      </p>
    </div>
  );
}
