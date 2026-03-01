"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { formatCurrency, getInitials, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { SwipeCard } from "@/components/search/SwipeCard";

type SwipeMode = "babysitters" | "moms";

interface SitterResult {
  id: string;
  bio: string;
  hourlyRate: number;
  city: string;
  state: string;
  yearsExperience: number;
  hasFirstAid: boolean;
  hasCPR: boolean;
  hasTransportation: boolean;
  languages: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}

interface ParentResult {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  createdAt: string;
  childcareRequests: {
    id: string;
    title: string;
    city: string;
    state: string;
    numberOfChildren: number;
    childrenJson: string;
  }[];
}

// Unified card type for both modes
interface CardProfile {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  location: string;
  bio: string;
  tags: { label: string; variant: "success" | "info" | "neutral" }[];
  detail: string;
  linkHref: string;
  meta: string;
}

function sitterToCard(s: SitterResult): CardProfile {
  const tags: CardProfile["tags"] = [];
  if (s.hasCPR) tags.push({ label: "CPR", variant: "success" });
  if (s.hasFirstAid) tags.push({ label: "First Aid", variant: "success" });
  if (s.hasTransportation) tags.push({ label: "Transport", variant: "info" });

  return {
    id: s.user.id,
    firstName: s.user.firstName,
    lastName: s.user.lastName,
    avatarUrl: s.user.avatarUrl,
    location: [s.city, s.state].filter(Boolean).join(", "),
    bio: s.bio,
    tags,
    detail: `${formatCurrency(s.hourlyRate)}/hr`,
    linkHref: `/sitter/${s.user.id}`,
    meta: [
      s.yearsExperience > 0
        ? `${s.yearsExperience} yr${s.yearsExperience !== 1 ? "s" : ""} exp`
        : "",
      s.languages || "",
    ]
      .filter(Boolean)
      .join(" · "),
  };
}

function parentToCard(p: ParentResult): CardProfile {
  const reqs = p.childcareRequests;
  const totalKids = reqs.reduce((sum, r) => {
    try {
      const children = JSON.parse(r.childrenJson);
      return sum + (Array.isArray(children) ? children.length : r.numberOfChildren);
    } catch {
      return sum + r.numberOfChildren;
    }
  }, 0);

  const locations = [...new Set(reqs.map((r) => [r.city, r.state].filter(Boolean).join(", ")).filter(Boolean))];
  const tags: CardProfile["tags"] = [];
  if (totalKids > 0) tags.push({ label: `${totalKids} ${totalKids === 1 ? "child" : "children"}`, variant: "info" });
  if (reqs.length > 0) tags.push({ label: `${reqs.length} ${reqs.length === 1 ? "request" : "requests"}`, variant: "neutral" });

  return {
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    avatarUrl: p.avatarUrl,
    location: locations[0] || "",
    bio: reqs.length > 0
      ? reqs.map((r) => r.title).join(" · ")
      : "Looking to connect with other parents",
    tags,
    detail: reqs.length > 0 ? "Active requests" : "No active requests",
    linkHref: `/messages`,
    meta: `Member since ${new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`,
  };
}

export default function SearchPage() {
  const [mode, setMode] = useState<SwipeMode>("babysitters");
  const [cards, setCards] = useState<CardProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState<string[]>([]);
  const [passed, setPassed] = useState<string[]>([]);

  const fetchCards = useCallback(async (swipeMode: SwipeMode) => {
    setLoading(true);
    setCurrentIndex(0);

    try {
      if (swipeMode === "babysitters") {
        const res = await fetch("/api/sitters?limit=50");
        const json = await res.json();
        if (json.success && json.data) {
          setCards((json.data.sitters || []).map(sitterToCard));
        } else {
          setCards([]);
        }
      } else {
        const res = await fetch("/api/parents?limit=50");
        const json = await res.json();
        if (json.success && json.data) {
          setCards((json.data.parents || []).map(parentToCard));
        } else {
          setCards([]);
        }
      }
    } catch {
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards(mode);
  }, [mode, fetchCards]);

  const handleSwipeRight = useCallback(() => {
    const card = cards[currentIndex];
    if (card) setLiked((prev) => [...prev, card.id]);
    setCurrentIndex((i) => i + 1);
  }, [cards, currentIndex]);

  const handleSwipeLeft = useCallback(() => {
    const card = cards[currentIndex];
    if (card) setPassed((prev) => [...prev, card.id]);
    setCurrentIndex((i) => i + 1);
  }, [cards, currentIndex]);

  const handleUndo = useCallback(() => {
    if (currentIndex === 0) return;
    const prevCard = cards[currentIndex - 1];
    setLiked((prev) => prev.filter((id) => id !== prevCard.id));
    setPassed((prev) => prev.filter((id) => id !== prevCard.id));
    setCurrentIndex((i) => i - 1);
  }, [currentIndex, cards]);

  const currentCard = cards[currentIndex];
  const nextCard = cards[currentIndex + 1];
  const isFinished = !loading && currentIndex >= cards.length;

  return (
    <div className="flex h-full flex-col">
      {/* Toggle */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-text-primary">Discover</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {mode === "babysitters"
              ? "Swipe to find your perfect babysitter"
              : "Connect with other moms nearby"}
          </p>
        </div>
        <div className="flex border border-border-default bg-surface-secondary">
          <button
            onClick={() => setMode("babysitters")}
            className={cn(
              "px-4 py-2 text-xs font-medium uppercase tracking-wide transition-colors",
              mode === "babysitters"
                ? "bg-text-primary text-surface-primary"
                : "text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary"
            )}
          >
            Babysitters
          </button>
          <button
            onClick={() => setMode("moms")}
            className={cn(
              "px-4 py-2 text-xs font-medium uppercase tracking-wide transition-colors",
              mode === "moms"
                ? "bg-text-primary text-surface-primary"
                : "text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary"
            )}
          >
            Moms
          </button>
        </div>
      </div>

      {/* Counter */}
      {!loading && cards.length > 0 && !isFinished && (
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-tertiary">
          {currentIndex + 1} / {cards.length}
        </p>
      )}

      {/* Card stack area */}
      <div className="relative mx-auto w-full max-w-md flex-1" style={{ minHeight: 520 }}>
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner size="lg" className="text-accent" />
          </div>
        ) : isFinished ? (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="border border-border-default bg-surface-secondary p-10 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center bg-surface-tertiary">
                <svg
                  className="h-7 w-7 text-text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-text-primary">
                You&apos;ve seen everyone
              </p>
              <p className="mt-1 text-sm text-text-tertiary">
                {liked.length > 0
                  ? `You liked ${liked.length} ${mode === "babysitters" ? "sitter" : "mom"}${liked.length !== 1 ? "s" : ""}`
                  : "Check back later for new profiles"}
              </p>
              <div className="mt-6 flex gap-3">
                {currentIndex > 0 && (
                  <button
                    onClick={handleUndo}
                    className="border border-border-default px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-text-primary hover:text-text-primary"
                  >
                    Go back
                  </button>
                )}
                <button
                  onClick={() => {
                    setCurrentIndex(0);
                    setLiked([]);
                    setPassed([]);
                  }}
                  className="bg-text-primary px-4 py-2 text-sm font-medium text-surface-primary transition-colors hover:bg-accent"
                >
                  Start over
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Next card (behind) */}
            {nextCard && (
              <div className="absolute inset-0 z-10">
                <ProfileCard profile={nextCard} mode={mode} />
              </div>
            )}

            {/* Current card (top, draggable) */}
            {currentCard && (
              <SwipeCard
                key={currentCard.id}
                isTop
                onSwipeRight={handleSwipeRight}
                onSwipeLeft={handleSwipeLeft}
              >
                <ProfileCard profile={currentCard} mode={mode} />
              </SwipeCard>
            )}
          </>
        )}
      </div>

      {/* Action buttons */}
      {!loading && !isFinished && currentCard && (
        <div className="mt-6 flex items-center justify-center gap-4">
          {/* Undo */}
          <button
            onClick={handleUndo}
            disabled={currentIndex === 0}
            className={cn(
              "flex h-11 w-11 items-center justify-center border transition-colors",
              currentIndex === 0
                ? "border-border-subtle text-text-muted cursor-not-allowed"
                : "border-border-default text-text-secondary hover:border-text-primary hover:text-text-primary"
            )}
            title="Undo"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </button>

          {/* Pass */}
          <button
            onClick={handleSwipeLeft}
            className="flex h-14 w-14 items-center justify-center border-2 border-danger text-danger transition-colors hover:bg-danger-muted"
            title="Pass"
          >
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* View profile */}
          <Link
            href={currentCard.linkHref}
            className="flex h-11 w-11 items-center justify-center border border-border-default text-text-secondary transition-colors hover:border-text-primary hover:text-text-primary"
            title="View profile"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>

          {/* Like */}
          <button
            onClick={handleSwipeRight}
            className="flex h-14 w-14 items-center justify-center border-2 border-success text-success transition-colors hover:bg-success-muted"
            title="Like"
          >
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

function ProfileCard({
  profile,
  mode,
}: {
  profile: CardProfile;
  mode: SwipeMode;
}) {
  const initials = getInitials(profile.firstName, profile.lastName);

  return (
    <div className="flex h-full flex-col border border-border-default bg-surface-secondary">
      {/* Avatar / photo area */}
      <div className="relative flex-shrink-0">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="h-72 w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="flex h-72 w-full items-center justify-center bg-surface-tertiary">
            <span className="text-6xl font-semibold text-text-muted">
              {initials}
            </span>
          </div>
        )}
        {/* Gradient overlay on photo */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Name overlay on photo */}
        <div className="absolute bottom-0 left-0 p-5">
          <h2 className="text-2xl font-semibold text-white">
            {profile.firstName} {profile.lastName}
          </h2>
          {profile.location && (
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-white/80">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {profile.location}
            </p>
          )}
        </div>
      </div>

      {/* Card content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Detail (rate for sitters, request status for moms) */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-lg font-medium text-text-primary">
            {profile.detail}
          </span>
          <span className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
            {mode === "babysitters" ? "Babysitter" : "Parent"}
          </span>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="mb-4 text-sm leading-relaxed text-text-secondary line-clamp-3">
            {profile.bio}
          </p>
        )}

        {/* Tags / badges */}
        {profile.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {profile.tags.map((tag) => (
              <Badge key={tag.label} variant={tag.variant}>
                {tag.label}
              </Badge>
            ))}
          </div>
        )}

        {/* Meta info at bottom */}
        {profile.meta && (
          <p className="mt-auto pt-3 border-t border-border-subtle text-xs text-text-tertiary">
            {profile.meta}
          </p>
        )}
      </div>
    </div>
  );
}
