"use client";

import { useTranslations } from "next-intl";
import type { Kita } from "@prisma/client";

interface KitaCardProps {
  kita: Kita;
  isHighlighted?: boolean;
  onHover?: (id: string | null) => void;
  onClick?: (kita: Kita) => void;
}

export function KitaCard({ kita, isHighlighted, onHover, onClick }: KitaCardProps) {
  const t = useTranslations("kitaSearch");

  return (
    <div
      className={`group flex h-full cursor-pointer flex-col border transition-all ${
        isHighlighted
          ? "border-accent bg-accent-muted"
          : "border-border-default bg-surface-secondary hover:border-border-hover"
      }`}
      onMouseEnter={() => onHover?.(kita.id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onClick?.(kita)}
    >
      {/* Photo */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-tertiary">
        {kita.photoUrl ? (
          <img
            src={kita.photoUrl}
            alt={kita.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-10 w-10 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21"
              />
            </svg>
          </div>
        )}

        {/* Tags overlay */}
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          {kita.isParentFavorite && (
            <span className="flex items-center gap-1 bg-warning-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-warning backdrop-blur-sm">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {t("parentFavorite")}
            </span>
          )}
          {kita.hasAvailableSpots && (
            <span className="bg-success-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-success backdrop-blur-sm">
              {t("spotsAvailable")}
            </span>
          )}
          {kita.hasJobs && (
            <span className="bg-danger-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-danger backdrop-blur-sm">
              {t("hiring")}
            </span>
          )}
        </div>

        {/* Heart / favorite button */}
        <button
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-white/80 text-text-tertiary transition-colors hover:text-accent backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
          }}
          aria-label="Save"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {/* Rating badge */}
        {kita.rating > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
            {kita.reviewCount > 0 && (
              <span className="text-[10px] text-white drop-shadow-sm">
                {kita.reviewCount === 1
                  ? `1 ${t("review")}`
                  : `${kita.reviewCount} ${t("reviews")}`}
              </span>
            )}
            <span className="flex h-8 w-8 items-center justify-center bg-accent text-xs font-semibold text-white">
              {kita.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="font-serif text-base leading-tight text-text-primary">
          {kita.name}
        </h3>
        {kita.carrier && (
          <p className="mt-0.5 text-xs text-text-tertiary">{kita.carrier}</p>
        )}

        {/* Details row */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary">
          {kita.openingHours && (
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {kita.openingHours}
            </span>
          )}
          {kita.capacity && (
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              {kita.capacity} {t("children")}
            </span>
          )}
          {kita.minAge && (
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5V4.5m6 0a48.11 48.11 0 013.478.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              {kita.minAge}
            </span>
          )}
        </div>

        {/* Address */}
        {kita.address && (
          <p className="mt-auto border-t border-border-subtle pt-2 text-xs text-text-tertiary">
            {kita.address}
          </p>
        )}
      </div>
    </div>
  );
}
