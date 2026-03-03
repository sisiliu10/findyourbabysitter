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
          <h2 className="text-lg font-medium text-text-primary mb-3">1. Service Description</h2>
          <p>
            Berlin Babysitter (&quot;the Platform&quot;) is an online marketplace operated by Sisi Liu
            that connects parents and families in Berlin with babysitters. The Platform facilitates
            the discovery, communication, and booking of childcare services. Berlin Babysitter is not
            a childcare agency and does not employ babysitters directly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">2. Account Registration</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>You must be at least 18 years old to create an account.</li>
            <li>You must provide accurate and complete information during registration.</li>
            <li>You must verify your email address before you can use the Platform.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You are responsible for all activity that occurs under your account.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">3. User Responsibilities</h2>
          <h3 className="text-sm font-medium text-text-primary mb-2">For Parents</h3>
          <ul className="list-disc pl-5 space-y-1.5 mb-4">
            <li>You are responsible for verifying the qualifications and suitability of any babysitter you hire.</li>
            <li>You must provide accurate booking details including address, times, and special instructions.</li>
            <li>You are responsible for payment directly to the babysitter as agreed between you.</li>
          </ul>
          <h3 className="text-sm font-medium text-text-primary mb-2">For Babysitters</h3>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>You must provide accurate information in your profile, including experience, qualifications, and availability.</li>
            <li>You must honor confirmed bookings or cancel with reasonable notice.</li>
            <li>You are an independent contractor, not an employee of Berlin Babysitter.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">4. Bookings and Payments</h2>
          <p className="mb-3">
            The Platform facilitates the booking process between parents and babysitters. All payments
            are made directly between the parent and babysitter. Berlin Babysitter does not process
            payments, hold funds, or take a commission.
          </p>
          <p>
            Once a booking is confirmed, both parties are expected to honor the arrangement. If either
            party needs to cancel, they should communicate directly through the Platform as early as
            possible.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">5. Reviews and Content</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Reviews must be honest and based on actual experiences.</li>
            <li>You may not post defamatory, abusive, discriminatory, or misleading content.</li>
            <li>Berlin Babysitter reserves the right to remove reviews or content that violates these terms.</li>
            <li>By posting content on the Platform, you grant Berlin Babysitter a non-exclusive license to display it.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">6. Prohibited Conduct</h2>
          <p className="mb-3">You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Use the Platform for any unlawful purpose</li>
            <li>Impersonate another person or misrepresent your identity</li>
            <li>Harass, threaten, or abuse other users</li>
            <li>Attempt to circumvent the Platform to avoid its terms</li>
            <li>Use automated tools to scrape or access the Platform</li>
            <li>Interfere with the security or functionality of the Platform</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">7. Limitation of Liability</h2>
          <p className="mb-3">
            Berlin Babysitter provides the Platform &quot;as is&quot; and acts solely as an intermediary between
            parents and babysitters. To the maximum extent permitted by law:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>We are not liable for the actions, conduct, or quality of service of any user.</li>
            <li>We are not liable for any damages arising from the use of childcare services arranged through the Platform.</li>
            <li>We do not guarantee the accuracy of user profiles, reviews, or any information provided by users.</li>
            <li>Our total liability to you shall not exceed the amount you have paid to us in the 12 months preceding the claim (if any).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">8. Account Suspension and Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account at any time if you violate
            these terms, engage in prohibited conduct, or if we determine that your account poses a
            risk to other users or the Platform. You may delete your account at any time by
            contacting us at TBU (email).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">9. Changes to These Terms</h2>
          <p>
            We may update these terms from time to time. Changes will be posted on this page with an
            updated revision date. Continued use of the Platform after changes constitutes acceptance
            of the revised terms. For significant changes, we will notify you via email.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">10. Governing Law and Jurisdiction</h2>
          <p>
            These terms are governed by the laws of the Federal Republic of Germany. Any disputes
            arising from these terms shall be subject to the exclusive jurisdiction of the courts of
            Berlin, Germany.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">11. Contact</h2>
          <p>
            If you have questions about these terms, contact us at:<br />
            Sisi Liu<br />
            TBU (email)<br />
            TBU (address)
          </p>
        </section>
      </div>
    </div>
  );
}
