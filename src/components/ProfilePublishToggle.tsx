"use client";

import { useState } from "react";
import { invalidateCurrentUser } from "@/hooks/useCurrentUser";

interface Props {
  initialIsPublished: boolean;
  isSitter: boolean;
}

export function ProfilePublishToggle({ initialIsPublished, isSitter }: Props) {
  const [isPublished, setIsPublished] = useState(initialIsPublished);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;
    const next = !isPublished;
    setIsPublished(next); // optimistic
    setLoading(true);
    try {
      const res = await fetch("/api/profile/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: next }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setIsPublished(!next); // revert
      } else {
        invalidateCurrentUser(); // refresh cached user so PublishGate reflects new state
      }
    } catch {
      setIsPublished(!next); // revert on network error
    } finally {
      setLoading(false);
    }
  }

  const publishedText = isSitter
    ? "Dein Profil ist öffentlich — Familien können dich finden"
    : "Dein Profil ist öffentlich — Babysitter können dich finden";
  const privateText = isSitter
    ? "Dein Profil ist privat — du bist nicht in der Suche sichtbar"
    : "Dein Profil ist privat — du bist nicht in der Suche sichtbar";

  return (
    <div className={`flex items-center justify-between gap-4 border px-5 py-4 transition-colors duration-300 ${
      isPublished
        ? "border-success/30 bg-success/5"
        : "border-border-default bg-surface-secondary"
    }`}>
      {/* Left: status indicator + text */}
      <div className="flex items-center gap-3 min-w-0">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center transition-colors duration-300 ${
          isPublished ? "bg-success/15" : "bg-surface-tertiary"
        }`}>
          {isPublished ? (
            <svg className="h-4 w-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          )}
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-medium leading-snug transition-colors duration-200 ${
            isPublished ? "text-success" : "text-text-secondary"
          }`}>
            {isPublished ? "Öffentlich" : "Privat"}
          </p>
          <p className="text-xs leading-snug text-text-tertiary truncate">
            {isPublished ? publishedText : privateText}
          </p>
        </div>
      </div>

      {/* Right: toggle switch */}
      <button
        onClick={toggle}
        disabled={loading}
        aria-label={isPublished ? "Profil privat schalten" : "Profil veröffentlichen"}
        className="shrink-0 relative focus:outline-none disabled:opacity-60"
      >
        {/* Track */}
        <div className={`h-6 w-11 rounded-full border transition-colors duration-300 ${
          isPublished
            ? "border-success bg-success"
            : "border-border-default bg-surface-tertiary"
        }`}>
          {/* Knob */}
          <div className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-all duration-300 ${
            isPublished ? "left-[23px]" : "left-[3px]"
          } ${loading ? "opacity-70" : ""}`} />
        </div>
      </button>
    </div>
  );
}
