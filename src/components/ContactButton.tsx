"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";

interface Props {
  toUserId: string;
  toFirstName: string;
  defaultMessage?: string;
  label?: string;
  className?: string;
}

export function ContactButton({ toUserId, toFirstName, defaultMessage, label, className }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(
    defaultMessage ?? `Hallo ${toFirstName}, ich bin auf dein Profil aufmerksam geworden und würde mich gerne vorstellen. Hast du Interesse an einer Zusammenarbeit?`
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSend() {
    if (!message.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Fehler beim Senden");
        return;
      }
      router.push(`/messages/${data.data.matchId}`);
    } catch {
      setError("Netzwerkfehler — bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={className ?? "block w-full bg-text-primary px-4 py-3 text-center text-xs font-medium uppercase tracking-widest text-surface-primary transition hover:bg-accent"}
      >
        {label ?? "Nachricht senden"}
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <textarea
        autoFocus
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        maxLength={500}
        className="w-full border border-border-default bg-transparent px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-text-primary focus:outline-none resize-none"
      />
      <div className="flex items-center gap-2">
        <span className="flex-1 text-xs text-text-muted">{message.length}/500</span>
        <button
          onClick={() => { setOpen(false); setError(""); }}
          className="px-4 py-2 text-xs text-text-tertiary transition hover:text-text-primary"
        >
          Abbrechen
        </button>
        <button
          onClick={handleSend}
          disabled={loading || !message.trim()}
          className="bg-text-primary px-5 py-2 text-xs font-medium uppercase tracking-widest text-surface-primary transition hover:bg-accent disabled:opacity-40"
        >
          {loading ? "Sende…" : "Senden"}
        </button>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
