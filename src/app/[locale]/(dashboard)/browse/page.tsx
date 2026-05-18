"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatCurrency, getInitials, cn } from "@/lib/utils";
import { SITTER_TYPES, LANGUAGE_OPTIONS, GENDER_OPTIONS } from "@/lib/constants";
import { CityPicker } from "@/components/CityPicker";

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

type SortKey = "newest" | "price_asc" | "price_desc" | "experience" | "active";

function formatActivity(lastSeenAt: string | null): { label: string; color: "green" | "yellow" | "gray" } {
  if (!lastSeenAt) return { label: "Offline", color: "gray" };
  const diff = Date.now() - new Date(lastSeenAt).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 5) return { label: "Jetzt aktiv", color: "green" };
  if (min < 60) return { label: `Vor ${min} Min.`, color: "green" };
  const h = Math.floor(min / 60);
  if (h < 24) return { label: `Vor ${h} Std.`, color: "yellow" };
  const d = Math.floor(h / 24);
  if (d < 7) return { label: `Vor ${d} Tagen`, color: "yellow" };
  return { label: `Vor ${Math.floor(d / 7)} Wo.`, color: "gray" };
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

function sortSitters(sitters: SitterResult[], sort: SortKey): SitterResult[] {
  const arr = [...sitters];
  switch (sort) {
    case "price_asc": return arr.sort((a, b) => a.hourlyRate - b.hourlyRate);
    case "price_desc": return arr.sort((a, b) => b.hourlyRate - a.hourlyRate);
    case "experience": return arr.sort((a, b) => b.yearsExperience - a.yearsExperience);
    case "active": return arr.sort((a, b) => {
      const ta = a.user.lastSeenAt ? new Date(a.user.lastSeenAt).getTime() : 0;
      const tb = b.user.lastSeenAt ? new Date(b.user.lastSeenAt).getTime() : 0;
      return tb - ta;
    });
    default: return arr;
  }
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex flex-col border border-border-default bg-surface-secondary animate-pulse">
      <div className="h-56 bg-surface-tertiary" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-2/3 bg-surface-tertiary rounded" />
        <div className="h-3 w-1/3 bg-surface-tertiary rounded" />
        <div className="h-3 w-full bg-surface-tertiary rounded mt-3" />
        <div className="h-3 w-4/5 bg-surface-tertiary rounded" />
      </div>
    </div>
  );
}

// ── Active filter chip ────────────────────────────────────────────────────────
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 border border-text-primary/20 bg-text-primary/5 px-2.5 py-1 text-xs text-text-primary">
      {label}
      <button onClick={onRemove} className="ml-0.5 text-text-tertiary hover:text-text-primary">
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BrowseSittersPage() {
  const t = useTranslations("browse");
  const tc = useTranslations("common");
  const locale = useLocale();

  const [sitters, setSitters] = useState<SitterResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [cityPickerDone, setCityPickerDone] = useState(false);

  // Filters
  const [languageFilter, setLanguageFilter] = useState("");
  const [sitterTypeFilter, setSitterTypeFilter] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilterCount = [languageFilter, sitterTypeFilter, maxRate, genderFilter].filter(Boolean).length;

  const fetchSitters = useCallback(async () => {
    if (!cityPickerDone) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (selectedCity) params.set("city", selectedCity);
      if (languageFilter) params.set("language", languageFilter);
      if (sitterTypeFilter) params.set("sitterType", sitterTypeFilter);
      if (genderFilter) params.set("gender", genderFilter);
      if (maxRate) params.set("maxRate", maxRate);
      const res = await fetch(`/api/sitters?${params}`);
      const json = await res.json();
      setSitters(json.success ? json.data.sitters || [] : []);
    } catch {
      setSitters([]);
    } finally {
      setLoading(false);
    }
  }, [languageFilter, sitterTypeFilter, genderFilter, maxRate, selectedCity, cityPickerDone]);

  useEffect(() => { fetchSitters(); }, [fetchSitters]);

  const clearAllFilters = () => {
    setLanguageFilter("");
    setSitterTypeFilter("");
    setGenderFilter("");
    setMaxRate("");
    setSearchQuery("");
  };

  // Client-side search + sort
  const filtered = sortSitters(
    sitters.filter((s) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.user.firstName.toLowerCase().includes(q) ||
        s.user.lastName.toLowerCase().includes(q) ||
        s.bio.toLowerCase().includes(q) ||
        (s.user.district || "").toLowerCase().includes(q)
      );
    }),
    sortBy
  );

  if (!cityPickerDone) {
    return (
      <CityPicker
        onSelect={(city) => { setSelectedCity(city); setCityPickerDone(true); }}
        title={locale === "de" ? "In welcher Stadt bist du?" : "Which city are you in?"}
        subtitle={locale === "de" ? "Wir zeigen dir Babysitter in deiner Nähe." : "We'll show you babysitters near you."}
      />
    );
  }

  return (
    <div className="flex h-full flex-col">

      {/* ── Top bar ── */}
      <div className="mb-4 flex items-center gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full border border-border-default bg-transparent py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-text-primary focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className={cn(
            "flex shrink-0 items-center gap-1.5 border px-3 py-2.5 text-xs font-medium uppercase tracking-wide transition-colors",
            filtersOpen || activeFilterCount > 0
              ? "border-text-primary bg-text-primary text-surface-primary"
              : "border-border-default text-text-secondary hover:border-text-primary hover:text-text-primary"
          )}
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          Filter{activeFilterCount > 0 && ` (${activeFilterCount})`}
        </button>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="shrink-0 border border-border-default bg-surface-primary py-2.5 pl-3 pr-8 text-xs text-text-primary focus:border-text-primary focus:outline-none"
        >
          <option value="newest">Neueste</option>
          <option value="active">Zuletzt aktiv</option>
          <option value="price_asc">Preis ↑</option>
          <option value="price_desc">Preis ↓</option>
          <option value="experience">Erfahrung</option>
        </select>
      </div>

      {/* ── Collapsible filter panel ── */}
      {filtersOpen && (
        <div className="mb-4 space-y-4 border border-border-default bg-surface-secondary p-4">
          {/* Language */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">{t("language")}</p>
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => setLanguageFilter("")}
                className={cn("px-3 py-1.5 text-xs font-medium transition-colors",
                  !languageFilter ? "bg-text-primary text-surface-primary" : "bg-surface-tertiary text-text-secondary hover:bg-border-default")}>
                {t("all")}
              </button>
              {LANGUAGE_OPTIONS.map((lang) => (
                <button key={lang.value} onClick={() => setLanguageFilter(languageFilter === lang.value ? "" : lang.value)}
                  className={cn("px-3 py-1.5 text-xs font-medium transition-colors",
                    languageFilter === lang.value ? "bg-text-primary text-surface-primary" : "bg-surface-tertiary text-text-secondary hover:bg-border-default")}>
                  {lang.flag} {lang.value}
                </button>
              ))}
            </div>
          </div>

          {/* Type + Gender + Rate in a row */}
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">{t("sitterType")}</p>
              <div className="flex flex-wrap gap-1.5">
                <button onClick={() => setSitterTypeFilter("")}
                  className={cn("px-3 py-1.5 text-xs font-medium transition-colors",
                    !sitterTypeFilter ? "bg-text-primary text-surface-primary" : "bg-surface-tertiary text-text-secondary hover:bg-border-default")}>
                  {t("allTypes")}
                </button>
                {SITTER_TYPES.map((type) => (
                  <button key={type} onClick={() => setSitterTypeFilter(sitterTypeFilter === type ? "" : type)}
                    className={cn("px-3 py-1.5 text-xs font-medium transition-colors",
                      sitterTypeFilter === type ? "bg-text-primary text-surface-primary" : "bg-surface-tertiary text-text-secondary hover:bg-border-default")}>
                    {t(`sitterTypes.${type}`)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">{t("gender")}</p>
              <div className="flex flex-wrap gap-1.5">
                <button onClick={() => setGenderFilter("")}
                  className={cn("px-3 py-1.5 text-xs font-medium transition-colors",
                    !genderFilter ? "bg-text-primary text-surface-primary" : "bg-surface-tertiary text-text-secondary hover:bg-border-default")}>
                  {t("allGenders")}
                </button>
                {GENDER_OPTIONS.map((g) => (
                  <button key={g} onClick={() => setGenderFilter(genderFilter === g ? "" : g)}
                    className={cn("px-3 py-1.5 text-xs font-medium transition-colors",
                      genderFilter === g ? "bg-text-primary text-surface-primary" : "bg-surface-tertiary text-text-secondary hover:bg-border-default")}>
                    {t(`genders.${g}`)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">{t("maxRate")}</p>
              <div className="flex flex-wrap gap-1.5">
                {["", "15", "20", "25", "30"].map((rate) => (
                  <button key={rate} onClick={() => setMaxRate(maxRate === rate ? "" : rate)}
                    className={cn("px-3 py-1.5 text-xs font-medium transition-colors",
                      maxRate === rate ? "bg-text-primary text-surface-primary" : "bg-surface-tertiary text-text-secondary hover:bg-border-default")}>
                    {rate ? `bis ${formatCurrency(parseInt(rate))}/Std.` : t("anyRate")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button onClick={clearAllFilters} className="text-xs text-danger hover:underline">
              Alle Filter zurücksetzen
            </button>
          )}
        </div>
      )}

      {/* ── Active filter chips ── */}
      {activeFilterCount > 0 && !filtersOpen && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {languageFilter && <FilterChip label={languageFilter} onRemove={() => setLanguageFilter("")} />}
          {sitterTypeFilter && <FilterChip label={(t as any)(`sitterTypes.${sitterTypeFilter}`)} onRemove={() => setSitterTypeFilter("")} />}
          {genderFilter && <FilterChip label={(t as any)(`genders.${genderFilter}`)} onRemove={() => setGenderFilter("")} />}
          {maxRate && <FilterChip label={`bis ${formatCurrency(parseInt(maxRate))}/Std.`} onRemove={() => setMaxRate("")} />}
          <button onClick={clearAllFilters} className="text-xs text-text-tertiary underline underline-offset-2 hover:text-text-primary">
            Alle löschen
          </button>
        </div>
      )}

      {/* ── City + count bar ── */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">📍 {selectedCity}</span>
          <button
            onClick={() => { setSelectedCity(null); setCityPickerDone(false); setSitters([]); }}
            className="text-xs text-text-muted underline underline-offset-2 hover:text-text-secondary"
          >
            {locale === "de" ? "ändern" : "change"}
          </button>
        </div>
        {!loading && (
          <div className="flex items-center gap-3">
            <p className="text-xs text-text-muted">
              {filtered.length} {filtered.length === 1 ? "Sitter" : "Sitter"}
            </p>
            <Link
              href="/search"
              className="border border-border-default px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-text-secondary transition-colors hover:border-text-primary hover:text-text-primary"
            >
              {t("swipeView")}
            </Link>
          </div>
        )}
      </div>

      {/* ── Results ── */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-20">
          <p className="text-sm text-text-tertiary">{t("noResults")}</p>
          {activeFilterCount > 0 && (
            <button onClick={clearAllFilters} className="mt-3 text-sm text-accent hover:underline">
              {t("clearFilters")}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {filtered.map((sitter) => (
            <SitterCard key={sitter.id} sitter={sitter} t={t as any} tc={tc as any} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sitter card ───────────────────────────────────────────────────────────────
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
  const activity = formatActivity(sitter.user.lastSeenAt);
  const languages = sitter.languages.split(",").map((l) => l.trim()).filter(Boolean);

  return (
    <Link
      href={`/sitter/${sitter.user.id}`}
      className="group flex flex-col border border-border-default bg-surface-secondary transition-colors hover:border-border-hover"
    >
      {/* Photo */}
      <div className="relative h-56 overflow-hidden">
        {sitter.user.avatarUrl ? (
          <img
            src={sitter.user.avatarUrl}
            alt={`${sitter.user.firstName} ${sitter.user.lastName}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-tertiary">
            <span className="font-serif text-5xl text-text-muted/50">{initials}</span>
          </div>
        )}

        {/* Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: "linear-gradient(to top, rgba(44,36,32,0.6), transparent)" }} />

        {/* Activity dot */}
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/35 px-2 py-0.5 backdrop-blur-sm">
          <span className={cn("h-1.5 w-1.5 rounded-full shrink-0",
            activity.color === "green" && "bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]",
            activity.color === "yellow" && "bg-amber-400",
            activity.color === "gray" && "bg-white/40",
          )} />
          <span className="text-[10px] text-white/80">{activity.label}</span>
        </div>

        {/* Rate */}
        <div className="absolute bottom-2.5 right-2.5 bg-text-primary/80 px-2 py-0.5 text-xs font-medium text-surface-primary backdrop-blur-sm">
          {formatCurrency(sitter.hourlyRate)}/Std.
        </div>

        {/* Name over gradient */}
        <div className="absolute inset-x-0 bottom-0 px-3 pb-2.5">
          <p className="font-serif text-base leading-tight text-white drop-shadow-sm">
            {sitter.user.firstName}{age !== null && <span className="font-sans text-sm font-light text-white/70">, {age}</span>}
          </p>
          {sitter.user.district && (
            <p className="text-[11px] text-white/60">{sitter.user.district}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3">
        {/* Languages */}
        {languages.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {languages.slice(0, 3).map((lang) => (
              <span key={lang} className="bg-accent-muted px-1.5 py-0.5 text-[10px] font-medium text-accent">
                {lang}
              </span>
            ))}
          </div>
        )}

        {/* Bio */}
        {sitter.bio && (
          <p className="text-xs leading-relaxed text-text-secondary line-clamp-2">
            {sitter.bio}
          </p>
        )}

        {/* Badges */}
        <div className="mt-auto flex flex-wrap gap-1 pt-2">
          {sitter.yearsExperience > 0 && (
            <span className="text-[10px] text-text-muted">{sitter.yearsExperience}J Erf.</span>
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
