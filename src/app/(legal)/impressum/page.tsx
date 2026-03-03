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
            TBU (Straße und Hausnummer)<br />
            TBU (PLZ und Ort)<br />
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
          <h2 className="text-lg font-medium text-text-primary mb-3">Umsatzsteuer-ID</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: TBU
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </h2>
          <p>
            Sisi Liu<br />
            TBU (Anschrift wie oben)
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

        <section>
          <h2 className="text-lg font-medium text-text-primary mb-3">Haftungsausschluss</h2>
          <p className="mb-3">
            <strong>Haftung für Inhalte:</strong> Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG
            für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
            §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte
            oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die
            auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
          <p>
            <strong>Haftung für Links:</strong> Unser Angebot enthält Links zu externen Websites
            Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
            fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist
            stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </p>
        </section>
      </div>
    </div>
  );
}
