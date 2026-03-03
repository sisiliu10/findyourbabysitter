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
          <h2 className="text-lg font-medium text-text-primary mb-3">1. Data Controller</h2>
          <p>
            Sisi Liu<br />
            TBU (address)<br />
            TBU (email)<br />
            TBU (phone)
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">2. What Data We Collect</h2>
          <p className="mb-3">We collect the following personal data when you use Berlin Babysitter:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Account data:</strong> name, email address, hashed password, role (parent or babysitter)</li>
            <li><strong>Profile data:</strong> bio, hourly rate, experience, languages, districts, profile photo (babysitters)</li>
            <li><strong>Booking data:</strong> dates, times, addresses, booking status, special instructions</li>
            <li><strong>Messages:</strong> content of messages exchanged between parents and babysitters</li>
            <li><strong>Reviews:</strong> ratings and written reviews</li>
            <li><strong>Technical data:</strong> IP address, browser type, pages visited (collected automatically via server logs)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">3. Legal Basis for Processing</h2>
          <p className="mb-3">We process your data based on the following legal grounds (Art. 6 GDPR):</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Contract performance (Art. 6(1)(b)):</strong> processing necessary to provide the babysitter marketplace service, including account management, bookings, and messaging</li>
            <li><strong>Legitimate interest (Art. 6(1)(f)):</strong> fraud prevention, rate limiting, service improvement, and security</li>
            <li><strong>Consent (Art. 6(1)(a)):</strong> where we ask for your explicit consent, such as for optional email notifications</li>
            <li><strong>Legal obligation (Art. 6(1)(c)):</strong> where required by German or EU law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">4. How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>To create and manage your account</li>
            <li>To connect parents with babysitters and facilitate bookings</li>
            <li>To enable messaging between users</li>
            <li>To display reviews and ratings</li>
            <li>To send transactional emails (booking confirmations, verification, password reset)</li>
            <li>To protect against abuse through rate limiting</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">5. Third-Party Processors</h2>
          <p className="mb-3">We use the following third-party services to operate Berlin Babysitter:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Vercel Inc.</strong> (USA) — hosting and deployment. Data processed under EU Standard Contractual Clauses.</li>
            <li><strong>Neon Inc.</strong> (USA) — PostgreSQL database hosting. Data processed under EU Standard Contractual Clauses.</li>
            <li><strong>Resend Inc.</strong> (USA) — transactional email delivery. Data processed under EU Standard Contractual Clauses.</li>
            <li><strong>Upstash Inc.</strong> (Germany/EU) — Redis for rate limiting. Only IP addresses are stored temporarily.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">6. Data Retention</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Account data:</strong> retained until you delete your account</li>
            <li><strong>Booking data:</strong> retained for 3 years after booking completion (for potential disputes)</li>
            <li><strong>Messages:</strong> retained until you delete your account</li>
            <li><strong>Rate limiting data:</strong> IP addresses are automatically expired within 1 hour</li>
            <li><strong>Email verification tokens:</strong> automatically expired within 24 hours</li>
            <li><strong>Password reset tokens:</strong> automatically expired within 1 hour</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">7. Cookies</h2>
          <p>
            We use a single essential cookie (<code className="text-xs bg-surface-secondary px-1.5 py-0.5">fyb_session</code>) to keep you logged in. This is a strictly necessary cookie and does not require consent under the TTDSG. We do not use any tracking, analytics, or advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">8. Your Rights</h2>
          <p className="mb-3">Under the GDPR, you have the right to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Access</strong> — request a copy of your personal data (Art. 15)</li>
            <li><strong>Rectification</strong> — correct inaccurate personal data (Art. 16)</li>
            <li><strong>Erasure</strong> — request deletion of your personal data (Art. 17)</li>
            <li><strong>Restriction</strong> — restrict processing of your data (Art. 18)</li>
            <li><strong>Data portability</strong> — receive your data in a machine-readable format (Art. 20)</li>
            <li><strong>Object</strong> — object to processing based on legitimate interest (Art. 21)</li>
            <li><strong>Withdraw consent</strong> — where processing is based on consent (Art. 7(3))</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, contact us at TBU (email). We will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">9. Right to Lodge a Complaint</h2>
          <p>
            You have the right to lodge a complaint with a supervisory authority. The responsible authority for Berlin is:
          </p>
          <p className="mt-3">
            Berliner Beauftragte für Datenschutz und Informationsfreiheit<br />
            Friedrichstr. 219<br />
            10969 Berlin<br />
            Germany
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">10. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date. If we make significant changes, we will notify you via email.
          </p>
        </section>
      </div>
    </div>
  );
}
