"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { getInitials } from "@/lib/utils";
import { invalidateCurrentUser } from "@/hooks/useCurrentUser";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl: string | null;
  city: string;
  district: string;
  bio: string;
  birthday: string | null;
  isPublished: boolean;
  babysitterProfile?: {
    bio: string;
    hourlyRate: number;
    languages: string;
    hasFirstAid: boolean;
    hasCPR: boolean;
  } | null;
}

function calculateAge(birthday: string | null): number | null {
  if (!birthday) return null;
  const birth = new Date(birthday);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() - birth.getMonth() < 0 || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
  return age > 0 ? age : null;
}

export default function PublishPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((json) => {
        const u = json.data;
        if (!u) return;
        // Already published — send to dashboard
        if (u.isPublished) {
          router.replace(u.role === "BABYSITTER" ? "/browse" : "/browse");
          return;
        }
        if (!u.onboarded) {
          router.replace("/onboarding");
          return;
        }
        setUser(u);
      })
      .catch(() => {});
  }, [router]);

  async function handlePublish() {
    setPublishing(true);
    setError("");
    try {
      const res = await fetch("/api/profile/publish", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Fehler beim Veröffentlichen. Bitte versuche es erneut.");
        return;
      }
      // Invalidate cache so PublishGate re-reads the new isPublished value
      invalidateCurrentUser();
      router.push("/browse");
    } catch {
      setError("Netzwerkfehler. Bitte überprüfe deine Verbindung.");
    } finally {
      setPublishing(false);
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border-default border-t-text-primary" />
      </div>
    );
  }

  const isSitter = user.role === "BABYSITTER";
  const bio = isSitter ? (user.babysitterProfile?.bio || user.bio) : user.bio;
  const age = calculateAge(user.birthday);
  const initials = getInitials(user.firstName, user.lastName || "");
  const languages = user.babysitterProfile?.languages?.split(",").map((l) => l.trim()).filter(Boolean) ?? [];

  return (
    <div className="mx-auto max-w-lg">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center bg-success/10">
          <svg className="h-7 w-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="font-serif text-3xl text-text-primary">
          Dein Profil ist bereit
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          {isSitter
            ? "Veröffentliche dein Profil damit Familien in deiner Stadt dich finden können."
            : "Veröffentliche dein Profil damit Babysitter in deiner Stadt dich finden können."}
        </p>
      </div>

      {error && (
        <div className="mb-4 border border-danger/30 bg-danger-muted p-3 text-sm text-danger">{error}</div>
      )}

      {/* Profile preview card */}
      <div className="mb-6 border border-border-default bg-surface-secondary">
        <div className="relative h-52 overflow-hidden">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.firstName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-tertiary">
              <span className="font-serif text-5xl text-text-muted/50">{initials}</span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: "linear-gradient(to top, rgba(44,36,32,0.65), transparent)" }} />
          {/* Preview badge */}
          <div className="absolute left-3 top-3 bg-black/30 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-white/80 backdrop-blur-sm">
            Vorschau
          </div>
          {/* Rate badge for sitters */}
          {isSitter && user.babysitterProfile && (
            <div className="absolute bottom-3 right-3 bg-text-primary/80 px-2 py-0.5 text-xs font-medium text-surface-primary backdrop-blur-sm">
              {user.babysitterProfile.hourlyRate}€/Std.
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 px-4 pb-3">
            <p className="font-serif text-xl leading-tight text-white drop-shadow-sm">
              {user.firstName}{age !== null && <span className="font-sans text-base font-light text-white/70">, {age}</span>}
            </p>
            {(user.district || user.city) && (
              <p className="text-xs text-white/60">{user.district || user.city}</p>
            )}
          </div>
        </div>
        <div className="p-4">
          {languages.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {languages.slice(0, 3).map((l) => (
                <span key={l} className="bg-accent-muted px-1.5 py-0.5 text-[10px] font-medium text-accent">{l}</span>
              ))}
            </div>
          )}
          {bio && (
            <p className="text-xs leading-relaxed text-text-secondary line-clamp-2">{bio}</p>
          )}
          {isSitter && user.babysitterProfile && (
            <div className="mt-2 flex flex-wrap gap-1">
              {user.babysitterProfile.hasFirstAid && (
                <span className="bg-success-muted px-1.5 py-0.5 text-[10px] font-medium text-success">Erste Hilfe</span>
              )}
              {user.babysitterProfile.hasCPR && (
                <span className="bg-success-muted px-1.5 py-0.5 text-[10px] font-medium text-success">CPR</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Benefits */}
      <div className="mb-6 space-y-2.5">
        {[
          isSitter
            ? "Familien aus deiner Stadt sehen dein Profil"
            : "Babysitter aus deiner Stadt sehen dein Profil",
          "Nachrichten empfangen und versenden",
          "Matches und Anfragen erhalten",
          isSitter
            ? "In Suchergebnissen erscheinen"
            : "Babysitter filtern und kontaktieren",
        ].map((benefit) => (
          <div key={benefit} className="flex items-center gap-3">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center bg-success/10">
              <svg className="h-3 w-3 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <p className="text-sm text-text-secondary">{benefit}</p>
          </div>
        ))}
      </div>

      {/* Publish CTA */}
      <button
        onClick={handlePublish}
        disabled={publishing}
        className="w-full bg-text-primary px-6 py-4 text-sm font-medium uppercase tracking-widest text-surface-primary transition hover:bg-accent disabled:opacity-60"
      >
        {publishing ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-surface-primary/30 border-t-surface-primary" />
            Wird veröffentlicht…
          </span>
        ) : (
          "Profil jetzt veröffentlichen →"
        )}
      </button>

      {/* Secondary: edit profile */}
      <div className="mt-4 text-center">
        <button
          onClick={() => router.push("/profile/edit")}
          className="text-xs text-text-muted underline underline-offset-2 hover:text-text-secondary"
        >
          Profil nochmal bearbeiten
        </button>
      </div>
    </div>
  );
}
