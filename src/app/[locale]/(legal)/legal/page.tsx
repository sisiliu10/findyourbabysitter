export default function LegalPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
      <h1 className="font-serif text-4xl text-text-primary">Impressum</h1>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-text-secondary">
        <p className="text-xs text-text-tertiary">Angaben gemäß § 5 TMG</p>
        <section>
          <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted mb-2">Betreiber</h2>
          <p>
            Sisi Liu<br />
            Homuthstr. 7<br />
            12161 Berlin<br />
            Deutschland
          </p>
        </section>
        <section>
          <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted mb-2">Kontakt</h2>
          <p>
            <a href="mailto:sisiliu2003@icloud.com" className="underline hover:text-text-primary transition-colors">
              sisiliu2003@icloud.com
            </a>
          </p>
        </section>
        <section>
          <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted mb-2">Hinweis</h2>
          <p>
            Berlin Babysitter ist eine Plattform, die Eltern und Babysitter miteinander vernetzt. Wir sind keine Vermittlungsagentur und beschäftigen keine Babysitter.
          </p>
        </section>
      </div>
    </div>
  );
}
