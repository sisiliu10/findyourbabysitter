"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { formatCurrency, getInitials, cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { StarRating } from "@/components/ui/StarRating";

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

export default function SearchPage() {
  const [sitters, setSitters] = useState<SitterResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Filters
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [hasCPR, setHasCPR] = useState(false);
  const [hasFirstAid, setHasFirstAid] = useState(false);

  const search = useCallback(async () => {
    setLoading(true);
    setSearched(true);

    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (state) params.set("state", state);
    if (maxRate) params.set("maxRate", maxRate);
    if (hasCPR) params.set("hasCPR", "true");
    if (hasFirstAid) params.set("hasFirstAid", "true");

    try {
      const res = await fetch(`/api/sitters?${params.toString()}`);
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
  }, [city, state, maxRate, hasCPR, hasFirstAid]);

  // Load initial results
  useEffect(() => {
    search();
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    search();
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-3xl text-text-primary">Find a Babysitter</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Browse available babysitters in your area.
        </p>
      </div>

      {/* Filter bar */}
      <form
        onSubmit={handleSearch}
        className="mb-10 border border-border-default bg-surface-secondary p-6"
      >
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
          Filters
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Berlin"
          />
          <Input
            label="Address"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="e.g. Friedrichstraße 123"
          />
          <Input
            label="Max Hourly Rate"
            type="number"
            min="1"
            step="0.50"
            value={maxRate}
            onChange={(e) => setMaxRate(e.target.value)}
            placeholder="e.g. 30"
          />
          <div className="flex items-end">
            <Button type="submit" className="w-full" loading={loading}>
              Search
            </Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-5">
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={hasCPR}
              onChange={(e) => setHasCPR(e.target.checked)}
              className="h-4 w-4 border-border-default text-accent focus:ring-accent"
            />
            CPR Certified
          </label>
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={hasFirstAid}
              onChange={(e) => setHasFirstAid(e.target.checked)}
              className="h-4 w-4 border-border-default text-accent focus:ring-accent"
            />
            First Aid Certified
          </label>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Spinner size="lg" className="text-accent" />
        </div>
      ) : sitters.length === 0 && searched ? (
        <div className="border border-border-default bg-surface-secondary p-12">
          <div className="mb-4 flex h-12 w-12 items-center justify-center bg-surface-tertiary">
            <svg
              className="h-6 w-6 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <p className="text-sm text-text-secondary">
            No babysitters found matching your criteria.
          </p>
          <p className="mt-1 text-sm text-text-tertiary">
            Try broadening your search filters.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
            {sitters.length} {sitters.length === 1 ? "Result" : "Results"}
          </p>
          <div className="grid gap-px border border-border-default bg-border-default sm:grid-cols-2 lg:grid-cols-3">
            {sitters.map((sitter) => {
              const initials = getInitials(
                sitter.user.firstName,
                sitter.user.lastName
              );
              const certs: string[] = [];
              if (sitter.hasCPR) certs.push("CPR");
              if (sitter.hasFirstAid) certs.push("First Aid");
              if (sitter.hasTransportation) certs.push("Transport");

              return (
                <Link
                  key={sitter.user.id}
                  href={`/sitter/${sitter.user.id}`}
                  className="group bg-surface-secondary p-5 transition-colors hover:bg-surface-tertiary"
                >
                  <div className="flex items-start gap-4">
                    {sitter.user.avatarUrl ? (
                      <img
                        src={sitter.user.avatarUrl}
                        alt={`${sitter.user.firstName} ${sitter.user.lastName}`}
                        className="h-14 w-14 object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-accent-muted text-sm font-semibold text-accent">
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-text-primary group-hover:text-accent">
                        {sitter.user.firstName} {sitter.user.lastName}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {[sitter.city, sitter.state].filter(Boolean).join(", ")}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-lg font-medium text-text-primary">
                          {formatCurrency(sitter.hourlyRate)}
                        </span>
                        <span className="text-xs text-text-tertiary">/hr</span>
                      </div>
                    </div>
                  </div>

                  {sitter.bio && (
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-text-tertiary">
                      {sitter.bio}
                    </p>
                  )}

                  {certs.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {certs.map((cert) => (
                        <span
                          key={cert}
                          className="inline-flex items-center border border-success/20 bg-success-muted px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-success"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  )}

                  {sitter.yearsExperience > 0 && (
                    <p className="mt-2 text-xs text-text-tertiary">
                      {sitter.yearsExperience} yr{sitter.yearsExperience !== 1 ? "s" : ""} experience
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
