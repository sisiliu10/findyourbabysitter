"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatCurrency, getInitials, cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";
import { SwipeCard } from "@/components/search/SwipeCard";
import { MatchModal } from "@/components/search/MatchModal";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useToast } from "@/components/ui/Toast";
import { LANGUAGE_OPTIONS } from "@/lib/constants";

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
    birthday: string | null;
    district: string;
    lastSeenAt: string | null;
  };
}

interface ParentResult {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  birthday: string | null;
  bio: string | null;
  childcareTypes: string;
  timesOfDay: string;
  careFrequency: string;
  zipCode: string;
  district: string;
  lastSeenAt: string | null;
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

interface ChildInfo {
  name: string;
  age: number;
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
  age: number | null;
  detail: string;
  linkHref: string;
  meta: string;
  lastSeenAt: string | null;
  // Rich fields for parent cards
  children?: ChildInfo[];
  needsSummary?: string;
  viewContext?: "sitter" | "parent";
}

function formatActivity(lastSeenAt: string | null, t: (key: string, values?: Record<string, unknown>) => string): { label: string; color: "green" | "yellow" | "gray" } {
  if (!lastSeenAt) return { label: t("offline"), color: "gray" };
  const diff = Date.now() - new Date(lastSeenAt).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 5) return { label: t("onlineNow"), color: "green" };
  if (minutes < 60) return { label: t("activeMinutes", { count: minutes }), color: "green" };
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return { label: t("activeHours", { count: hours }), color: "yellow" };
  const days = Math.floor(hours / 24);
  if (days < 7) return { label: t("activeDays", { count: days }), color: "yellow" };
  const weeks = Math.floor(days / 7);
  return { label: t("activeWeeks", { count: weeks }), color: "gray" };
}

function calculateAge(birthday: string | null): number | null {
  if (!birthday) return null;
  const birth = new Date(birthday);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age > 0 ? age : null;
}

function sitterToCard(s: SitterResult, t: (key: string, values?: Record<string, unknown>) => string): CardProfile {
  const tags: CardProfile["tags"] = [];
  if (s.hasCPR) tags.push({ label: t("cpr"), variant: "success" });
  if (s.hasFirstAid) tags.push({ label: t("firstAid"), variant: "success" });
  if (s.hasTransportation) tags.push({ label: t("transport"), variant: "info" });

  return {
    id: s.user.id,
    firstName: s.user.firstName,
    lastName: s.user.lastName,
    avatarUrl: s.user.avatarUrl,
    location: s.user.district || s.city || "",
    bio: s.bio,
    tags,
    age: calculateAge(s.user.birthday),
    detail: `${formatCurrency(s.hourlyRate)}/hr`,
    linkHref: `/sitter/${s.user.id}`,
    lastSeenAt: s.user.lastSeenAt,
    meta: [
      s.yearsExperience > 0
        ? t("yrsExp", { count: s.yearsExperience })
        : "",
      s.languages || "",
    ]
      .filter(Boolean)
      .join(" · "),
  };
}

function parentToCard(p: ParentResult, t: (key: string, values?: Record<string, unknown>) => string, locale: string, tn: (key: string) => string, viewerRole: "sitter" | "parent" = "parent"): CardProfile {
  const reqs = p.childcareRequests;

  // Parse children from all requests, deduplicate by name
  const allChildren: ChildInfo[] = [];
  const seenNames = new Set<string>();
  for (const req of reqs) {
    try {
      const parsed = JSON.parse(req.childrenJson);
      if (Array.isArray(parsed)) {
        for (const child of parsed) {
          const key = (child.name || "").toLowerCase();
          if (!seenNames.has(key)) {
            seenNames.add(key);
            allChildren.push({ name: child.name || "", age: child.age || 0 });
          }
        }
      }
    } catch { /* skip */ }
  }

  // Fallback child count from numberOfChildren if no childrenJson
  const totalKids = allChildren.length > 0
    ? allChildren.length
    : reqs.reduce((sum, r) => sum + r.numberOfChildren, 0);

  const locations = [...new Set(reqs.map((r) => r.city).filter(Boolean))];
  const tags: CardProfile["tags"] = [];

  // Build needs summary from childcare types (for sitter view)
  let needsSummary = "";
  try {
    const types: string[] = JSON.parse(p.childcareTypes || "[]");
    if (types.length > 0) {
      const typeLabels = types.map((type) => tn(`types.${type}`));
      needsSummary = t("lookingFor") + " " + typeLabels.join(", ").toLowerCase();
    }
  } catch { /* empty */ }

  // Tags vary by viewer context
  if (viewerRole === "sitter") {
    // Sitter sees: times of day + frequency (schedule info)
    try {
      const times: string[] = JSON.parse(p.timesOfDay || "[]");
      times.forEach((time) => {
        tags.push({ label: tn(`times.${time}`), variant: "info" });
      });
    } catch { /* empty */ }
  }

  // Frequency chip (both contexts — shows activity level)
  if (p.careFrequency) {
    tags.push({ label: tn(`frequencies.${p.careFrequency}`), variant: "neutral" });
  }

  // Build detail line: kids + ages
  let detail = "";
  if (allChildren.length > 0) {
    const ages = allChildren.map((c) => c.age).sort((a, b) => a - b);
    const agesStr = ages.length === 1
      ? String(ages[0])
      : ages.slice(0, -1).join(", ") + " & " + ages[ages.length - 1];
    detail = t("kidsAndAges", { count: allChildren.length, ages: agesStr });
  } else if (totalKids > 0) {
    detail = t("childCount", { count: totalKids });
  }

  const dateLocale = locale === "de" ? "de-DE" : "en-US";

  return {
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    avatarUrl: p.avatarUrl,
    age: calculateAge(p.birthday),
    location: p.district || locations[0] || "",
    lastSeenAt: p.lastSeenAt,
    bio: p.bio || (reqs.length > 0
      ? reqs.map((r) => r.title).join(" · ")
      : t("lookingToConnect")),
    tags,
    detail,
    linkHref: `/messages`,
    meta: t("memberSince", { date: new Date(p.createdAt).toLocaleDateString(dateLocale, { month: "short", year: "numeric" }) }),
    children: allChildren,
    needsSummary: viewerRole === "sitter" ? needsSummary : undefined,
    viewContext: viewerRole,
  };
}

interface MatchInfo {
  id: string;
  matchedUser: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}

export default function SearchPage() {
  const t = useTranslations("search");
  const tc = useTranslations("common");
  const tn = useTranslations("childcareNeeds");
  const locale = useLocale();
  const { user: currentUser, loading: userLoading } = useCurrentUser();
  const { toast } = useToast();
  const userRole = currentUser?.role;
  const isSitter = userRole === "BABYSITTER";

  const searchParams = useSearchParams();
  const [mode, setMode] = useState<SwipeMode | null>(null);
  const [cards, setCards] = useState<CardProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState<string[]>([]);
  const [passed, setPassed] = useState<string[]>([]);
  const [matchInfo, setMatchInfo] = useState<MatchInfo | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const likedIdsRef = useRef<Set<string>>(new Set());
  const [languageFilter, setLanguageFilter] = useState("");

  // Set mode from URL param or default based on user role
  useEffect(() => {
    if (!userLoading && currentUser && mode === null) {
      const urlMode = searchParams.get("mode");
      if (urlMode === "moms" || urlMode === "sitters") {
        setMode(urlMode === "sitters" ? "babysitters" : "moms");
      } else {
        setMode(isSitter ? "moms" : "babysitters");
      }
    }
  }, [userLoading, currentUser, isSitter, mode, searchParams]);

  const fetchCards = useCallback(async (swipeMode: SwipeMode) => {
    setLoading(true);
    setCurrentIndex(0);

    try {
      // Fetch already-liked user IDs to filter them out
      const likesRes = await fetch("/api/likes");
      const likesJson = await likesRes.json();
      const alreadyLiked = new Set<string>(
        likesJson.success ? likesJson.data.likedUserIds : []
      );
      likedIdsRef.current = alreadyLiked;

      if (swipeMode === "babysitters") {
        const params = new URLSearchParams({ limit: "50" });
        if (languageFilter) params.set("language", languageFilter);
        const res = await fetch(`/api/sitters?${params}`);
        const json = await res.json();
        if (json.success && json.data) {
          const all = (json.data.sitters || []).map((s: SitterResult) => sitterToCard(s, t as any));
          setCards(all.filter((c: CardProfile) => !alreadyLiked.has(c.id)));
        } else {
          setCards([]);
        }
      } else {
        const viewerRole = isSitter ? "sitter" : "parent";
        const res = await fetch("/api/parents?limit=50");
        const json = await res.json();
        if (json.success && json.data) {
          const all = (json.data.parents || []).map((p: ParentResult) => parentToCard(p, t as any, locale, tn as any, viewerRole as "sitter" | "parent"));
          setCards(all.filter((c: CardProfile) => !alreadyLiked.has(c.id)));
        } else {
          setCards([]);
        }
      }
    } catch {
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, [t, tn, locale, isSitter, languageFilter]);

  // Only fetch when mode is resolved or language filter changes
  useEffect(() => {
    if (mode) fetchCards(mode);
  }, [mode, fetchCards]);

  const handleSwipeRight = useCallback(() => {
    const card = cards[currentIndex];
    if (!card) return;
    setLiked((prev) => [...prev, card.id]);
    setCurrentIndex((i) => i + 1);

    // Persist like to server and check for match
    fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toUserId: card.id }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data.matched) {
          setMatchInfo({
            id: json.data.match.id,
            matchedUser: json.data.match.matchedUser,
          });
          setShowMatchModal(true);
        } else if (!json.success && json.code === "upgrade_required") {
          // Revert the optimistic update — like was not saved
          setLiked((prev) => prev.filter((id) => id !== card.id));
          setCurrentIndex((i) => i - 1);
          toast(
            `You've reached your daily limit of ${json.limit} likes. Upgrade to like more.`,
            "error"
          );
        }
      })
      .catch(() => {});
  }, [cards, currentIndex, toast]);

  const handleSwipeLeft = useCallback(() => {
    const card = cards[currentIndex];
    if (card) setPassed((prev) => [...prev, card.id]);
    setCurrentIndex((i) => i + 1);
  }, [cards, currentIndex]);

  const handleUndo = useCallback(() => {
    if (currentIndex === 0) return;
    const prevCard = cards[currentIndex - 1];
    const wasLiked = liked.includes(prevCard.id);
    setLiked((prev) => prev.filter((id) => id !== prevCard.id));
    setPassed((prev) => prev.filter((id) => id !== prevCard.id));
    setCurrentIndex((i) => i - 1);

    // If the card was liked, delete the like (and match if created) from the DB
    if (wasLiked) {
      fetch("/api/likes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: prevCard.id }),
      }).catch(() => {});
    }
  }, [currentIndex, cards, liked]);

  const currentCard = cards[currentIndex];
  const nextCard = cards[currentIndex + 1];
  const isInitializing = userLoading || mode === null;
  const isFinished = !loading && !isInitializing && currentIndex >= cards.length;

  return (
    <div className="flex h-full flex-col">
      {/* Header — role-aware */}
      {isSitter ? (
        <div className="mb-6">
          <h1 className="font-serif text-3xl text-text-primary">{t("discover")}</h1>
          <p className="mt-1 text-sm text-text-secondary">{t("browseFamilies")}</p>
        </div>
      ) : (
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl text-text-primary">{t("discover")}</h1>
            <p className="mt-1 text-sm text-text-secondary">
              {mode === "babysitters"
                ? t("swipeBabysitters")
                : t("connectParents")}
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
              {t("babysitters")}
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
              {t("parents")}
            </button>
          </div>
        </div>
      )}

      {/* Language filter — prominent, only for babysitter browsing */}
      {mode === "babysitters" && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">
            {t("filterByLanguage")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setLanguageFilter("")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors",
                !languageFilter
                  ? "bg-text-primary text-surface-primary"
                  : "bg-surface-tertiary text-text-secondary hover:bg-border-default hover:text-text-primary"
              )}
            >
              {t("allLanguages")}
            </button>
            {LANGUAGE_OPTIONS.map((lang) => (
              <button
                key={lang.value}
                onClick={() => setLanguageFilter(languageFilter === lang.value ? "" : lang.value)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  languageFilter === lang.value
                    ? "bg-text-primary text-surface-primary"
                    : "bg-surface-tertiary text-text-secondary hover:bg-border-default hover:text-text-primary"
                )}
              >
                {lang.flag} {lang.value}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Counter */}
      {!loading && cards.length > 0 && !isFinished && (
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-tertiary">
          {currentIndex + 1} / {cards.length}
        </p>
      )}

      {/* Card stack area */}
      <div className="relative mx-auto w-full max-w-md flex-1" style={{ minHeight: 540 }}>
        {(loading || isInitializing) ? (
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
                {t("seenEveryone")}
              </p>
              <p className="mt-1 text-sm text-text-tertiary">
                {liked.length > 0
                  ? mode === "babysitters"
                    ? t("likedSitters", { count: liked.length })
                    : isSitter
                      ? t("likedFamilies", { count: liked.length })
                      : t("likedParents", { count: liked.length })
                  : t("checkBackLater")}
              </p>
              <div className="mt-6 flex gap-3">
                {currentIndex > 0 && (
                  <button
                    onClick={handleUndo}
                    className="border border-border-default px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-text-primary hover:text-text-primary"
                  >
                    {t("goBack")}
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
                  {t("startOver")}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Next card (behind) — slightly scaled down for depth */}
            {nextCard && (
              <div className="absolute inset-0 z-10 origin-bottom scale-[0.97] opacity-60">
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

      {/* Action buttons — larger, with fill hover, visually connected */}
      {!loading && !isFinished && currentCard && (
        <div className="mt-5 flex items-center justify-center gap-6">
          {/* Pass */}
          <button
            onClick={handleSwipeLeft}
            className="group flex h-16 w-16 items-center justify-center bg-surface-secondary shadow-[0_2px_12px_rgba(44,36,32,0.06)] transition-all hover:bg-danger hover:shadow-[0_4px_20px_rgba(196,90,74,0.2)] active:scale-95"
            title={t("pass")}
          >
            <svg className="h-7 w-7 text-danger transition-colors group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Undo — small, subtle, centered */}
          {currentIndex > 0 && (
            <button
              onClick={handleUndo}
              className="flex h-10 w-10 items-center justify-center text-text-muted transition-colors hover:text-text-secondary"
              title={t("goBack")}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
            </button>
          )}

          {/* Like */}
          <button
            onClick={handleSwipeRight}
            className="group flex h-16 w-16 items-center justify-center bg-surface-secondary shadow-[0_2px_12px_rgba(44,36,32,0.06)] transition-all hover:bg-success hover:shadow-[0_4px_20px_rgba(90,138,98,0.2)] active:scale-95"
            title={t("like")}
          >
            <svg className="h-7 w-7 text-success transition-colors group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>
      )}

      {/* Match modal */}
      <MatchModal
        open={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        matchedUser={matchInfo?.matchedUser ?? null}
        matchId={matchInfo?.id ?? null}
      />
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
  const t = useTranslations("search");
  const tc = useTranslations("common");
  const initials = getInitials(profile.firstName, profile.lastName);
  const roleLabel = mode === "babysitters" ? tc("roles.BABYSITTER") : tc("roles.PARENT");
  const isParentCard = mode === "moms";
  const activity = formatActivity(profile.lastSeenAt, tc as any);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-surface-secondary shadow-[0_4px_24px_rgba(44,36,32,0.08)]">
      {/* Photo area */}
      <div className="relative flex-shrink-0">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="h-80 w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="flex h-80 w-full items-center justify-center bg-surface-tertiary">
            <span className="text-7xl font-serif text-text-muted/60">
              {initials}
            </span>
          </div>
        )}

        {/* Warm gradient */}
        <div
          className="absolute inset-x-0 bottom-0 h-44"
          style={{
            background: "linear-gradient(to top, rgba(44,36,32,0.55) 0%, rgba(44,36,32,0.25) 40%, transparent 100%)",
          }}
        />

        {/* View profile pill */}
        <Link
          href={profile.linkHref}
          className="absolute right-4 top-4 z-40 flex h-8 w-8 items-center justify-center bg-white/15 text-white/70 backdrop-blur-md transition-all hover:bg-white/25 hover:text-white"
          title={t("viewProfile")}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>

        {/* Role badge — top-left, glassy */}
        <div className="absolute left-4 top-4">
          <span className="inline-flex items-center bg-white/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-white/80 backdrop-blur-md">
            {roleLabel}
          </span>
        </div>

        {/* Name + location over gradient */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-5">
          <h2 className="font-serif text-[28px] leading-tight text-white drop-shadow-sm">
            {profile.firstName} {profile.lastName}
            {profile.age !== null && (
              <span className="font-sans text-xl font-light text-white/70">, {profile.age}</span>
            )}
          </h2>
          <div className="mt-1 flex items-center gap-3">
            {profile.location && (
              <p className="flex items-center gap-1.5 text-[13px] font-light text-white/70">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {profile.location}
              </p>
            )}
            <span className="flex items-center gap-1">
              <span className={cn(
                "h-1.5 w-1.5 rounded-full",
                activity.color === "green" && "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]",
                activity.color === "yellow" && "bg-amber-400",
                activity.color === "gray" && "bg-white/40",
              )} />
              <span className="text-[11px] font-light text-white/60">{activity.label}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-6 pt-5 pb-5">
        {/* Parent card: children + needs info */}
        {isParentCard && profile.detail && (
          <div className="mb-2 flex items-center gap-2">
            <svg className="h-4 w-4 shrink-0 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>
            <p className="text-sm font-medium text-text-primary">{profile.detail}</p>
          </div>
        )}

        {/* Sitter viewing parent: needs summary */}
        {isParentCard && profile.needsSummary && (
          <p className="mb-2 text-[13px] font-medium text-accent">
            {profile.needsSummary}
          </p>
        )}

        {/* Sitter card: rate/detail */}
        {!isParentCard && (
          <p className="text-base font-medium text-text-primary">
            {profile.detail}
          </p>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="mt-2.5 text-[13px] leading-relaxed text-text-secondary line-clamp-3">
            {profile.bio}
          </p>
        )}

        {/* Tags */}
        {profile.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {profile.tags.map((tag) => (
              <span
                key={tag.label}
                className={cn(
                  "inline-flex items-center px-2.5 py-1 text-[11px] font-medium tracking-wide",
                  tag.variant === "success" && "bg-success-muted text-success",
                  tag.variant === "info" && "bg-info-muted text-info",
                  tag.variant === "neutral" && "bg-surface-tertiary text-text-secondary",
                )}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}

        {/* Meta */}
        {profile.meta && (
          <p className="mt-auto pt-4 text-[11px] tracking-wide text-text-muted">
            {profile.meta}
          </p>
        )}
      </div>
    </div>
  );
}
