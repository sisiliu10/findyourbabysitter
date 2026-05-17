"use client";

import { useState } from "react";

export const GERMAN_CITIES = [
  "Berlin",
  "München",
  "Hamburg",
  "Frankfurt",
  "Köln",
  "Stuttgart",
  "Düsseldorf",
  "Leipzig",
  "Dortmund",
  "Essen",
  "Bremen",
  "Dresden",
  "Hannover",
  "Nürnberg",
  "Duisburg",
  "Bochum",
  "Wuppertal",
  "Bielefeld",
  "Bonn",
  "Münster",
];

interface CityPickerProps {
  onSelect: (city: string) => void;
  title?: string;
  subtitle?: string;
}

export function CityPicker({ onSelect, title, subtitle }: CityPickerProps) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? GERMAN_CITIES.filter((c) => c.toLowerCase().includes(query.toLowerCase()))
    : GERMAN_CITIES;

  const handleCustomCity = () => {
    const city = query.trim();
    if (city) onSelect(city);
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="font-serif text-3xl text-text-primary sm:text-4xl">
            {title ?? "In welcher Stadt bist du?"}
          </h2>
          {subtitle && (
            <p className="mt-3 text-sm text-text-tertiary">{subtitle}</p>
          )}
        </div>

        {/* Search input */}
        <div className="mb-6">
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCustomCity()}
            placeholder="Stadt suchen oder eingeben..."
            className="w-full border border-border-default bg-transparent px-4 py-3 text-base text-text-primary placeholder:text-text-muted focus:border-text-primary focus:outline-none"
          />
        </div>

        {/* City grid */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {filtered.map((city) => (
            <button
              key={city}
              onClick={() => onSelect(city)}
              className="group border border-border-default bg-surface-secondary px-4 py-3.5 text-left transition-all hover:border-text-primary hover:bg-surface-tertiary"
            >
              <span className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                {city}
              </span>
            </button>
          ))}

          {/* Custom city not in list */}
          {query.trim() && !GERMAN_CITIES.some((c) => c.toLowerCase() === query.toLowerCase()) && (
            <button
              onClick={handleCustomCity}
              className="col-span-2 sm:col-span-4 border border-dashed border-accent/50 bg-accent-muted px-4 py-3.5 text-left transition-all hover:border-accent"
            >
              <span className="text-sm font-medium text-accent">
                „{query.trim()}" verwenden →
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
