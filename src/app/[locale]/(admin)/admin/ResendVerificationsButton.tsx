"use client";

import { useState } from "react";

export function ResendVerificationsButton({ initialCount }: { initialCount: number }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleResend() {
    if (!confirm(`Sende Verification-Mails an ${initialCount} unverifizierte Nutzer?`)) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/resend-verifications", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setResult(`✓ ${data.sent} Mails erfolgreich gesendet`);
      } else {
        setResult("Fehler beim Senden");
      }
    } catch {
      setResult("Fehler beim Senden");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 border border-border-default bg-surface-secondary p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg text-text-primary">Unverifizierte Nutzer</h2>
          <p className="mt-1 text-sm text-text-secondary">
            <span className="text-warning font-medium">{initialCount}</span> Nutzer haben ihre E-Mail noch nicht bestätigt.
          </p>
          {result && (
            <p className="mt-2 text-sm text-success">{result}</p>
          )}
        </div>
        <button
          onClick={handleResend}
          disabled={loading || initialCount === 0}
          className="border border-border-default bg-surface-tertiary px-4 py-2 text-xs font-medium uppercase tracking-wide text-text-primary transition hover:border-text-primary disabled:opacity-40"
        >
          {loading ? "Sende..." : "Verification-Mails senden"}
        </button>
      </div>
    </div>
  );
}
