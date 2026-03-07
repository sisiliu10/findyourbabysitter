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
            E-Mail: TBU<br />
            Telefon: TBU
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </h2>
          <p>
            Sisi Liu<br />
            Grüntaler Straße 10, 13357 Berlin
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">EU-Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline transition-colors hover:text-text-primary"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p className="mt-3">
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>
      </div>
    </div>
  );
}
