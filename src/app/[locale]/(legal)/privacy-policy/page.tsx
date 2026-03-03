import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Berlin Babysitter",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <h1 className="font-serif text-4xl text-text-primary sm:text-5xl">Privacy Policy</h1>
      <p className="mt-4 text-sm text-text-tertiary">Last updated: March 3, 2026</p>

      <div className="mt-12 space-y-10 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">Data Controller</h2>
          <p>
            Sisi Liu<br />
            TBU (address)<br />
            TBU (email)
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">What We Collect</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Account info (name, email, password)</li>
            <li>Profile data, bookings, messages, and reviews</li>
            <li>Technical data (IP address, browser type)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">Why We Process Your Data</h2>
          <p>
            We process data to provide the service (Art. 6(1)(b) GDPR), for security and fraud prevention (Art. 6(1)(f)), and where required by law (Art. 6(1)(c)).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">Third-Party Services</h2>
          <p>
            We use Vercel (hosting), Neon (database), Resend (email), and Upstash (security). Services outside the EU operate under Standard Contractual Clauses.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">Cookies</h2>
          <p>
            We use one essential cookie to keep you logged in. No tracking or advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">Your Rights</h2>
          <p>
            Under the GDPR you can request access, correction, deletion, or export of your data. Contact us at TBU (email). You may also lodge a complaint with the Berliner Beauftragte für Datenschutz und Informationsfreiheit.
          </p>
        </section>
      </div>
    </div>
  );
}
