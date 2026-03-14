"use client";

import { useState } from "react";

type Tab = "impressum" | "datenschutz" | "nutzungsbedingungen";

const TABS: { id: Tab; label: string }[] = [
  { id: "impressum", label: "Impressum" },
  { id: "datenschutz", label: "Datenschutz" },
  { id: "nutzungsbedingungen", label: "Nutzungsbedingungen" },
];

export default function LegalPage() {
  const [active, setActive] = useState<Tab>("impressum");

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
      <h1 className="font-serif text-4xl text-text-primary">Legal</h1>

      {/* Tab nav */}
      <div className="mt-8 flex gap-1 border-b border-border-default">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2 text-xs uppercase tracking-wide transition-colors ${
              active === tab.id
                ? "border-b-2 border-text-primary text-text-primary font-medium"
                : "text-text-tertiary hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-text-secondary">
        {active === "impressum" && (
          <>
            <p className="text-xs text-text-tertiary">Angaben gemäß § 5 TMG</p>
            <section>
              <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted mb-2">Betreiber</h2>
              <p>
                Sisi Liu<br />
                Grüntaler Straße 10<br />
                13357 Berlin<br />
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
          </>
        )}

        {active === "datenschutz" && (
          <>
            <p className="text-xs text-text-tertiary">Datenschutzerklärung gemäß DSGVO · Last updated: March 2026</p>
            <section>
              <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted mb-2">Verantwortlicher</h2>
              <p>Sisi Liu, Grüntaler Straße 10, 13357 Berlin — <a href="mailto:sisiliu2003@icloud.com" className="underline hover:text-text-primary transition-colors">sisiliu2003@icloud.com</a></p>
            </section>
            <section>
              <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted mb-2">Was wir speichern</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Name, E-Mail-Adresse und Passwort (verschlüsselt)</li>
                <li>Profilangaben, Buchungen, Nachrichten und Bewertungen</li>
                <li>Ein Session-Cookie zur Anmeldung (kein Tracking)</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted mb-2">Rechtsgrundlage</h2>
              <p>Vertragserfüllung gem. Art. 6 Abs. 1 lit. b DSGVO. Keine Daten werden für Werbezwecke genutzt oder verkauft.</p>
            </section>
            <section>
              <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted mb-2">Drittanbieter</h2>
              <p>Vercel (Hosting), Neon (Datenbank), Resend (E-Mail). Alle außerhalb der EU operierenden Dienste handeln auf Basis von Standardvertragsklauseln (SCCs).</p>
            </section>
            <section>
              <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted mb-2">Deine Rechte</h2>
              <p>
                Auskunft, Berichtigung, Löschung, Einschränkung und Datenübertragbarkeit gem. DSGVO. Anfragen an{" "}
                <a href="mailto:sisiliu2003@icloud.com" className="underline hover:text-text-primary transition-colors">sisiliu2003@icloud.com</a>.{" "}
                Beschwerden beim{" "}
                <a href="https://www.datenschutz-berlin.de" target="_blank" rel="noopener noreferrer" className="underline hover:text-text-primary transition-colors">
                  Berliner Datenschutzbeauftragten
                </a>.
              </p>
            </section>
          </>
        )}

        {active === "nutzungsbedingungen" && (
          <>
            <p className="text-xs text-text-tertiary">Last updated: March 2026</p>
            <section>
              <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted mb-2">Die Plattform</h2>
              <p>Berlin Babysitter ist ein Online-Marktplatz, der Eltern und Babysitter in Berlin vernetzt. Wir sind keine Vermittlungsagentur und beschäftigen keine Babysitter.</p>
            </section>
            <section>
              <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted mb-2">Dein Account</h2>
              <p>Du bist verantwortlich für die Richtigkeit deiner Angaben und die Sicherheit deines Accounts.</p>
            </section>
            <section>
              <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted mb-2">Zahlungen</h2>
              <p>Alle Zahlungen erfolgen direkt zwischen Eltern und Babysitter. Berlin Babysitter verarbeitet keine Zahlungen und erhebt keine Provision.</p>
            </section>
            <section>
              <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted mb-2">Haftung</h2>
              <p>Die Plattform wird „wie besehen" bereitgestellt. Wir haften nicht für das Verhalten von Nutzern oder die Qualität der vermittelten Betreuung. Eltern sind verantwortlich für die Prüfung von Babysittern.</p>
            </section>
            <section>
              <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted mb-2">Anwendbares Recht</h2>
              <p>Es gilt deutsches Recht. Gerichtsstand ist Berlin.</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
