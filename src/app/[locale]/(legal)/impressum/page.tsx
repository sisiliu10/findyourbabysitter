import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum — Berlin Babysitter",
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <h1 className="font-serif text-4xl text-text-primary sm:text-5xl">Impressum</h1>
      <p className="mt-4 text-sm text-text-tertiary">Angaben gemäß § 5 TMG</p>

      <div className="mt-12 space-y-10 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">Betreiber</h2>
          <p>
            Sisi Liu<br />
            Grüntaler Straße 10<br />
            13357 Berlin<br />
            Deutschland
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">Kontakt</h2>
          <p>
            E-Mail:{" "}
            <a
              href="mailto:sisiliu2003@icloud.com"
              className="text-accent underline transition-colors hover:text-text-primary"
            >
              sisiliu2003@icloud.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
