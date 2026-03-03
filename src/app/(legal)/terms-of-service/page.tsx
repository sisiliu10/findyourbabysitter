import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Berlin Babysitter",
};

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <h1 className="font-serif text-4xl text-text-primary sm:text-5xl">Terms of Service</h1>
      <p className="mt-4 text-sm text-text-tertiary">Last updated: March 3, 2026</p>

      <div className="mt-12 space-y-10 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">The Service</h2>
          <p>
            Berlin Babysitter is an online marketplace operated by Sisi Liu that connects parents with babysitters in Berlin. We are not a childcare agency and do not employ babysitters.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">Your Account</h2>
          <p>
            You must be at least 18 years old, provide accurate information, and verify your email. You are responsible for your account credentials and all activity under your account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">Bookings and Payments</h2>
          <p>
            All payments are made directly between parent and babysitter. Berlin Babysitter does not process payments or take a commission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">Liability</h2>
          <p>
            The Platform is provided &quot;as is.&quot; We are not liable for the actions or conduct of any user, nor for the quality of childcare services arranged through the Platform. Parents are responsible for verifying any babysitter they hire.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">Governing Law</h2>
          <p>
            These terms are governed by German law. Disputes are subject to the jurisdiction of Berlin courts.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">Contact</h2>
          <p>
            Sisi Liu<br />
            TBU (email)<br />
            TBU (address)
          </p>
        </section>
      </div>
    </div>
  );
}
