"use client";

import { useState } from "react";

interface UnverifiedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: Date;
}

export function ResendVerificationsButton({
  initialCount,
  users,
}: {
  initialCount: number;
  users: UnverifiedUser[];
}) {
  const [loadingAll, setLoadingAll] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [allSent, setAllSent] = useState(false);

  async function resendAll() {
    if (!confirm(`Sende Verification-Mails an alle ${initialCount} unverifizierte Nutzer?`)) return;
    setLoadingAll(true);
    try {
      await fetch("/api/admin/resend-verifications", { method: "POST" });
      setAllSent(true);
      setSentIds(new Set(users.map((u) => u.id)));
    } finally {
      setLoadingAll(false);
    }
  }

  async function resendOne(userId: string) {
    setLoadingId(userId);
    try {
      await fetch("/api/admin/resend-verifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      setSentIds((prev) => new Set([...prev, userId]));
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="mt-8 border border-border-default bg-surface-secondary">
      <div className="flex items-center justify-between border-b border-border-default px-6 py-4">
        <div>
          <h2 className="font-serif text-lg text-text-primary">Unverifizierte Nutzer</h2>
          <p className="mt-0.5 text-xs text-text-secondary">
            <span className="font-medium text-warning">{initialCount}</span> Nutzer haben ihre E-Mail noch nicht bestätigt
            {allSent && <span className="ml-2 text-success">— alle Mails gesendet ✓</span>}
          </p>
        </div>
        <button
          onClick={resendAll}
          disabled={loadingAll || initialCount === 0}
          className="border border-border-default bg-surface-tertiary px-4 py-2 text-xs font-medium uppercase tracking-wide text-text-primary transition hover:border-text-primary disabled:opacity-40"
        >
          {loadingAll ? "Sende..." : "Alle anschreiben"}
        </button>
      </div>

      {users.length === 0 ? (
        <p className="px-6 py-8 text-sm text-text-muted text-center">Alle Nutzer sind verifiziert ✓</p>
      ) : (
        <div className="divide-y divide-border-default">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between px-6 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-text-secondary truncate">{user.email}</p>
              </div>
              <div className="mx-6 shrink-0">
                <span className="text-xs text-text-muted uppercase tracking-wide">{user.role}</span>
              </div>
              <div className="mx-6 shrink-0 text-right">
                <p className="text-xs text-text-muted">
                  {new Date(user.createdAt).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={() => resendOne(user.id)}
                disabled={loadingId === user.id || sentIds.has(user.id)}
                className="shrink-0 border border-border-default px-3 py-1.5 text-xs text-text-secondary transition hover:border-text-primary hover:text-text-primary disabled:opacity-40"
              >
                {sentIds.has(user.id) ? "Gesendet ✓" : loadingId === user.id ? "..." : "Mail senden"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
