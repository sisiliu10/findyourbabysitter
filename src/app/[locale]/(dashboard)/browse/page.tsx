"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatCurrency, getInitials, cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";
import { SITTER_TYPES, LANGUAGE_OPTIONS, GENDER_OPTIONS } from "@/lib/constants";
import { BERLIN_DISTRICTS } from "@/lib/berlin-districts";

const POPULAR_LANGUAGE_COUNT = 8;

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
  ageRangeMin: number;
  ageRangeMax: number;
  sitterType: string;
  gender: string;
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

export default function BrowseSittersPage() {
  const t = useTranslations("browse");
  const tc = useTranslations("common");
  const locale = useLocale();

  const [sitters, setSitters] = useState<SitterResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [languageFilter, setLanguageFilter] = useState("");
  const [sitterTypeFilter, setSitterTypeFilter] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [showAllLanguages, setShowAllLanguages] = useState(false);

  const fetchSitters = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (languageFilter) params.set("language", languageFilter);
      if (sitterTypeFilter) params.set("sitterType", sitterTypeFilter);
      if (genderFilter) params.set("gender", genderFilter);
      if (maxRate) params.set("maxRate", maxRate);
      if (districtFilter) params.set("district", districtFilter);

      const res = await fetch(`/api/sitters?${params}`);
      const json = await res.json();
      if (json.success && json.data) {
        setSitters(json.data.sitters || []);
      } else {
        setSitters([]);
      }
    } catch {
      setSitters([]);
    } finally {
      setLoading(false);
    }
  }, [languageFilter, sitterTypeFilter, genderFilter, maxRate, districtFilter]);

  useEffect(() => {
    fetchSitters();
  }, [fetchSitters]);

  // Client-side search filter (name, bio, district)
  const filtered = sitters.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.user.firstName.toLowerCase().includes(q) ||
      s.user.lastName.toLowerCase().includes(q) ||
      s.bio.toLowerCase().includes(q) ||
      (s.user.district || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-3xl text-text-primary">{t("title")}</h1>
            <p className="mt-1 text-sm text-text-secondary">{t("subtitle")}</p>
          </div>
          <Link
            href="/search"
            className="shrink-0 border border-border-default px-3 py-2 text-xs font-medium uppercase tracking-wide text-text-secondary transition-colors hover:border-text-primary hover:text-text-primary"
          >
            {t("swipeView")}
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4 border border-border-default bg-surface-secondary p-4">
        {/* Search bar */}
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full border border-border-default bg-transparent px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition focus:border-text-primary focus:outline-none"
          />
        </div>

        {/* Language filter — collapsible */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
              {t("language")}
            </p>
            {languageFilter && (
              <span className="text-[11px] text-accent font-medium">
                {languageFilter}
              </span>
            )}
          </div>
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
              {t("all")}
            </button>
            {(showAllLanguages ? LANGUAGE_OPTIONS : LANGUAGE_OPTIONS.slice(0, POPULAR_LANGUAGE_COUNT)).map((lang) => (
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
                {lang.flag} {t(`languages.${lang.value}` as Parameters<typeof t>[0])}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAllLanguages((v) => !v)}
            className="mt-2 text-[11px] text-text-tertiary underline underline-offset-2 hover:text-text-secondary"
          >
            {showAllLanguages
              ? t("showFewer")
              : t("showAllLanguages", { count: LANGUAGE_OPTIONS.length })}
          </button>
        </div>

        {/* District + Max rate — inline row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium uppercase tracking-wide text-text-secondary whitespace-nowrap">
              {t("district")}
            </label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="border border-border-default bg-transparent px-3 py-2 text-sm text-text-primary focus:border-text-primary focus:outline-none"
            >
              <option value="">{t("allDistricts")}</option>
              {BERLIN_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium uppercase tracking-wide text-text-secondary whitespace-nowrap">
              {t("maxRate")}
            </label>
            <select
              value={maxRate}
              onChange={(e) => setMaxRate(e.target.value)}
              className="border border-border-default bg-transparent px-3 py-2 text-sm text-text-primary focus:border-text-primary focus:outline-none"
            >
              <option value="">{t("anyRate")}</option>
              <option value="15">{t("upTo")} {formatCurrency(15)}/hr</option>
              <option value="20">{t("upTo")} {formatCurrency(20)}/hr</option>
              <option value="25">{t("upTo")} {formatCurrency(25)}/hr</option>
              <option value="30">{t("upTo")} {formatCurrency(30)}/hr</option>
            </select>
          </div>
        </div>

        {/* Type + Gender — inline row */}
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">
              {t("sitterType")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSitterTypeFilter("")}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  !sitterTypeFilter
                    ? "bg-text-primary text-surface-primary"
                    : "bg-surface-tertiary text-text-secondary hover:bg-border-default hover:text-text-primary"
                )}
              >
                {t("allTypes")}
              </button>
              {SITTER_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSitterTypeFilter(sitterTypeFilter === type ? "" : type)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-colors",
                    sitterTypeFilter === type
                      ? "bg-text-primary text-surface-primary"
                      : "bg-surface-tertiary text-text-secondary hover:bg-border-default hover:text-text-primary"
                  )}
                >
                  {t(`sitterTypes.${type}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">
              {t("gender")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setGenderFilter("")}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  !genderFilter
                    ? "bg-text-primary text-surface-primary"
                    : "bg-surface-tertiary text-text-secondary hover:bg-border-default hover:text-text-primary"
                )}
              >
                {t("allGenders")}
              </button>
              {GENDER_OPTIONS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGenderFilter(genderFilter === g ? "" : g)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-colors",
                    genderFilter === g
                      ? "bg-text-primary text-surface-primary"
                      : "bg-surface-tertiary text-text-secondary hover:bg-border-default hover:text-text-primary"
                  )}
                >
                  {t(`genders.${g}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-tertiary">
          {t("resultCount", { count: filtered.length })}
        </p>
      )}

      {/* Sitter grid */}
      {loading ? (
        <div className="flex flex-1 items-center justify-center py-20">
          <Spinner size="lg" className="text-accent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-20">
          <p className="text-sm text-text-tertiary">{t("noResults")}</p>
          {(languageFilter || sitterTypeFilter || genderFilter || maxRate || searchQuery || districtFilter) && (
            <button
              onClick={() => { setLanguageFilter(""); setSitterTypeFilter(""); setGenderFilter(""); setMaxRate(""); setSearchQuery(""); setDistrictFilter(""); }}
              className="mt-3 text-sm text-accent hover:underline"
            >
              {t("clearFilters")}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((sitter) => (
            <SitterCard key={sitter.id} sitter={sitter} t={t as any} tc={tc as any} />
          ))}
        </div>
      )}
    </div>
  );
}

function SitterCard({
  sitter,
  t,
  tc,
}: {
  sitter: SitterResult;
  t: (key: string, values?: Record<string, unknown>) => string;
  tc: (key: string, values?: Record<string, unknown>) => string;
}) {
  const initials = getInitials(sitter.user.firstName, sitter.user.lastName);
  const age = calculateAge(sitter.user.birthday);
  const activity = formatActivity(sitter.user.lastSeenAt, tc);
  const languages = sitter.languages
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <Link
      href={`/sitter/${sitter.user.id}`}
      className="group flex flex-col border border-border-default bg-surface-secondary transition-colors hover:border-border-hover"
    >
      {/* Photo */}
      <div className="relative h-48 overflow-hidden">
        {sitter.user.avatarUrl ? (
          <img
            src={sitter.user.avatarUrl}
            alt={`${sitter.user.firstName} ${sitter.user.lastName}`}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-tertiary">
            <span className="text-4xl font-serif text-text-muted/60">{initials}</span>
          </div>
        )}
        {/* Activity indicator */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 bg-black/40 px-2 py-1 backdrop-blur-sm">
          <span className={cn(
            "h-1.5 w-1.5 rounded-full",
            activity.color === "green" && "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]",
            activity.color === "yellow" && "bg-amber-400",
            activity.color === "gray" && "bg-white/40",
          )} />
          <span className="text-[10px] font-medium text-white/90">{activity.label}</span>
        </div>
        {/* Rate badge */}
        <div className="absolute bottom-3 right-3 bg-text-primary/80 px-2.5 py-1 text-xs font-medium text-surface-primary backdrop-blur-sm">
          {formatCurrency(sitter.hourlyRate)}/hr
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between">
          <h3 className="font-medium text-text-primary">
            {sitter.user.firstName} {sitter.user.lastName}
            {age !== null && (
              <span className="ml-1 font-normal text-text-tertiary">, {age}</span>
            )}
          </h3>
        </div>

        {sitter.user.district && (
          <p className="mt-0.5 text-xs text-text-tertiary">{sitter.user.district}</p>
        )}

        {/* Sitter type badge */}
        {sitter.sitterType && (
          <span className="mt-2 inline-flex w-fit items-center bg-info-muted px-2 py-0.5 text-[11px] font-medium text-info">
            {t(`sitterTypes.${sitter.sitterType}`)}
          </span>
        )}

        {/* Languages — highlighted */}
        <div className="mt-3 flex flex-wrap gap-1">
          {languages.map((lang) => (
            <span
              key={lang}
              className="inline-flex items-center bg-accent-muted px-2 py-0.5 text-[11px] font-medium text-accent"
            >
              {lang}
            </span>
          ))}
        </div>

        {/* Bio preview */}
        {sitter.bio && (
          <p className="mt-2.5 text-xs leading-relaxed text-text-secondary line-clamp-2">
            {sitter.bio}
          </p>
        )}

        {/* Tags */}
        <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
          {sitter.yearsExperience > 0 && (
            <span className="text-[11px] text-text-muted">
              {t("yrsExp", { count: sitter.yearsExperience })}
            </span>
          )}
          {sitter.hasFirstAid && (
            <span className="bg-success-muted px-1.5 py-0.5 text-[10px] font-medium text-success">
              {tc("firstAid")}
            </span>
          )}
          {sitter.hasCPR && (
            <span className="bg-success-muted px-1.5 py-0.5 text-[10px] font-medium text-success">
              {tc("cpr")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
