"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import type { Kita } from "@prisma/client";
import { KitaCard } from "@/components/kita/KitaCard";
import { KitaFilters } from "@/components/kita/KitaFilters";
import { KitaPagination } from "@/components/kita/KitaPagination";

const KitaMap = dynamic(() => import("@/components/kita/KitaMap").then((m) => ({ default: m.KitaMap })), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-surface-tertiary">
      <span className="text-xs text-text-muted">Loading map...</span>
    </div>
  ),
});

interface KitaSearchClientProps {
  initialKitas: Kita[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  districts: { name: string; count: number }[];
}

export function KitaSearchClient({
  initialKitas,
  initialPagination,
  districts,
}: KitaSearchClientProps) {
  const t = useTranslations("kitaSearch");

  const [kitas, setKitas] = useState<Kita[]>(initialKitas);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);

  // Filters
  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState("");
  const [minRating, setMinRating] = useState("");
  const [hasSpots, setHasSpots] = useState(false);
  const [page, setPage] = useState(1);

  // Map interaction
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false); // mobile toggle

  const listRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchKitas = useCallback(
    async (params: {
      q?: string;
      district?: string;
      minRating?: string;
      hasSpots?: boolean;
      page?: number;
    }) => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams();
        if (params.q) searchParams.set("q", params.q);
        if (params.district) searchParams.set("district", params.district);
        if (params.minRating) searchParams.set("minRating", params.minRating);
        if (params.hasSpots) searchParams.set("hasSpots", "true");
        searchParams.set("page", String(params.page || 1));

        const res = await fetch(`/api/kitas?${searchParams.toString()}`);
        const json = await res.json();

        if (json.success) {
          setKitas(json.data.kitas);
          setPagination(json.data.pagination);
        }
      } catch (err) {
        console.error("Failed to fetch kitas:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Debounced search for text query
  const handleQueryChange = useCallback(
    (q: string) => {
      setQuery(q);
      setPage(1);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fetchKitas({ q, district, minRating, hasSpots, page: 1 });
      }, 400);
    },
    [district, minRating, hasSpots, fetchKitas]
  );

  const handleDistrictChange = useCallback(
    (d: string) => {
      setDistrict(d);
      setPage(1);
      fetchKitas({ q: query, district: d, minRating, hasSpots, page: 1 });
    },
    [query, minRating, hasSpots, fetchKitas]
  );

  const handleMinRatingChange = useCallback(
    (r: string) => {
      setMinRating(r);
      setPage(1);
      fetchKitas({ q: query, district, minRating: r, hasSpots, page: 1 });
    },
    [query, district, hasSpots, fetchKitas]
  );

  const handleHasSpotsChange = useCallback(
    (v: boolean) => {
      setHasSpots(v);
      setPage(1);
      fetchKitas({ q: query, district, minRating, hasSpots: v, page: 1 });
    },
    [query, district, minRating, fetchKitas]
  );

  const handlePageChange = useCallback(
    (p: number) => {
      setPage(p);
      fetchKitas({ q: query, district, minRating, hasSpots, page: p });
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    },
    [query, district, minRating, hasSpots, fetchKitas]
  );

  const handleMarkerClick = useCallback((kita: Kita) => {
    setHoveredId(kita.id);
    // Scroll card into view
    const card = document.getElementById(`kita-${kita.id}`);
    card?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-57px)]">
      {/* Filters bar */}
      <div className="border-b border-border-default bg-surface-primary px-4 py-3 sm:px-6">
        <div className="mx-auto max-w-[1400px]">
          <KitaFilters
            query={query}
            district={district}
            minRating={minRating}
            hasSpots={hasSpots}
            districts={districts}
            onQueryChange={handleQueryChange}
            onDistrictChange={handleDistrictChange}
            onMinRatingChange={handleMinRatingChange}
            onHasSpotsChange={handleHasSpotsChange}
          />
        </div>
      </div>

      {/* Results count + mobile toggle */}
      <div className="flex items-center justify-between border-b border-border-default bg-surface-primary px-4 py-2 sm:px-6">
        <span className="text-xs text-text-tertiary">
          {t("totalResults", { count: pagination.total })}
        </span>

        {/* Mobile view toggle */}
        <div className="flex sm:hidden">
          <button
            onClick={() => setShowMap(false)}
            className={`border px-3 py-1 text-xs uppercase tracking-wide transition-colors ${
              !showMap
                ? "border-text-primary bg-text-primary text-surface-primary"
                : "border-border-default text-text-secondary"
            }`}
          >
            {t("showList")}
          </button>
          <button
            onClick={() => setShowMap(true)}
            className={`border border-l-0 px-3 py-1 text-xs uppercase tracking-wide transition-colors ${
              showMap
                ? "border-text-primary bg-text-primary text-surface-primary"
                : "border-border-default text-text-secondary"
            }`}
          >
            {t("showMap")}
          </button>
        </div>
      </div>

      {/* Main content: list + map */}
      <div className="flex flex-1 overflow-hidden">
        {/* Card list */}
        <div
          ref={listRef}
          className={`flex-1 overflow-y-auto bg-surface-primary ${showMap ? "hidden sm:block" : ""}`}
        >
          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse border border-border-default">
                    <div className="aspect-[16/10] bg-surface-tertiary" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 w-3/4 bg-surface-tertiary" />
                      <div className="h-3 w-1/2 bg-surface-tertiary" />
                      <div className="h-3 w-full bg-surface-tertiary" />
                    </div>
                  </div>
                ))}
              </div>
            ) : kitas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <svg
                  className="mb-3 h-10 w-10 text-text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <p className="text-sm text-text-tertiary">{t("noResults")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {kitas.map((kita) => (
                  <div key={kita.id} id={`kita-${kita.id}`}>
                    <KitaCard
                      kita={kita}
                      isHighlighted={hoveredId === kita.id}
                      onHover={setHoveredId}
                      onClick={() => {
                        const url = kita.website || `https://www.google.com/search?q=${encodeURIComponent(kita.name + ' Berlin')}`;
                        window.open(url, "_blank");
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {kitas.length > 0 && (
              <div className="mt-6">
                <KitaPagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  total={pagination.total}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {/* Attribution */}
            <p className="mt-6 text-center text-[10px] text-text-muted">
              {t("poweredBy")}
            </p>
          </div>
        </div>

        {/* Map */}
        <div
          className={`w-full sm:w-[45%] sm:max-w-[600px] sm:border-l sm:border-border-default ${
            showMap ? "" : "hidden sm:block"
          }`}
        >
          <div className="sticky top-0 h-full">
            <KitaMap
              kitas={kitas}
              highlightedId={hoveredId}
              onMarkerClick={handleMarkerClick}
              onMarkerHover={setHoveredId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
