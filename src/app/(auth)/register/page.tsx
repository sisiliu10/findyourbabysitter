"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedRole = searchParams.get("role") || "";

  const [step, setStep] = useState(preselectedRole ? 2 : 1);
  const [role, setRole] = useState(preselectedRole);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      router.push("/onboarding");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (step === 1) {
    return (
      <div>
        <h1 className="font-serif text-4xl text-text-primary">Join us</h1>
        <p className="mt-3 text-sm text-text-secondary">How would you like to use the platform?</p>

        <div className="mt-10 space-y-0">
          <button
            onClick={() => { setRole("PARENT"); setStep(2); }}
            className="group w-full border border-border-default p-6 text-left transition-colors hover:border-text-primary"
          >
            <p className="text-xs uppercase tracking-wide text-text-muted mb-2">01</p>
            <h3 className="font-medium text-text-primary">I need a babysitter</h3>
            <p className="mt-1 text-sm text-text-secondary">Find and book trusted caregivers</p>
          </button>

          <button
            onClick={() => { setRole("BABYSITTER"); setStep(2); }}
            className="group w-full border border-border-default border-t-0 p-6 text-left transition-colors hover:border-text-primary"
          >
            <p className="text-xs uppercase tracking-wide text-text-muted mb-2">02</p>
            <h3 className="font-medium text-text-primary">I am a babysitter</h3>
            <p className="mt-1 text-sm text-text-secondary">Create your profile and get booked</p>
          </button>
        </div>

        <p className="mt-8 text-sm text-text-tertiary">
          Already have an account?{" "}
          <Link href="/login" className="text-text-primary underline underline-offset-4 hover:text-accent">Log in</Link>
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
        <svg className="mr-1.5 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back
      </button>

      <h1 className="font-serif text-4xl text-text-primary">Create account</h1>
      <p className="mt-3 text-sm text-text-secondary">
        Signing up as{" "}
        <span className="text-text-primary font-medium">
          {role === "PARENT" ? "a Parent" : "a Babysitter"}
        </span>
      </p>

      {error && (
        <div className="mt-6 border border-danger/30 bg-danger-muted px-4 py-3 text-sm text-danger">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-2">First name</label>
            <input id="firstName" name="firstName" required className="block w-full border border-border-default bg-transparent px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-text-primary focus:outline-none" />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-2">Last name</label>
            <input id="lastName" name="lastName" required className="block w-full border border-border-default bg-transparent px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-text-primary focus:outline-none" />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-2">Email</label>
          <input id="email" name="email" type="email" required className="block w-full border border-border-default bg-transparent px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-text-primary focus:outline-none" placeholder="you@example.com" />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-2">Password</label>
          <input id="password" name="password" type="password" required minLength={8} className="block w-full border border-border-default bg-transparent px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-text-primary focus:outline-none" placeholder="Min 8 characters" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-text-primary bg-text-primary px-4 py-3 text-xs font-medium uppercase tracking-widest text-surface-primary transition-colors hover:bg-accent hover:border-accent disabled:opacity-40"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-8 text-sm text-text-tertiary">
        Already have an account?{" "}
        <Link href="/login" className="text-text-primary underline underline-offset-4 hover:text-accent">Log in</Link>
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
