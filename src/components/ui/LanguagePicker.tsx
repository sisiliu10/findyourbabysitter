"use client";

import { useState, useRef, useEffect } from "react";
import { LANGUAGE_OPTIONS } from "@/lib/constants";

interface Props {
  selected: string[];
  onChange: (languages: string[]) => void;
  error?: boolean;
}

export function LanguagePicker({ selected, onChange, error }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const queryTrimmed = query.trim();

  const suggestions = LANGUAGE_OPTIONS.filter(
    (l) =>
      l.value.toLowerCase().includes(queryTrimmed.toLowerCase()) &&
      !selected.includes(l.value)
  );

  const isCustom =
    queryTrimmed.length > 0 &&
    !LANGUAGE_OPTIONS.some((l) => l.value.toLowerCase() === queryTrimmed.toLowerCase()) &&
    !selected.some((s) => s.toLowerCase() === queryTrimmed.toLowerCase());

  function add(lang: string) {
    if (!selected.includes(lang)) onChange([...selected, lang]);
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  }

  function remove(lang: string) {
    onChange(selected.filter((l) => l !== lang));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && queryTrimmed) {
      e.preventDefault();
      const exact = LANGUAGE_OPTIONS.find(
        (l) => l.value.toLowerCase() === queryTrimmed.toLowerCase()
      );
      add(exact ? exact.value : queryTrimmed);
    }
    if (e.key === "Backspace" && !query && selected.length > 0) {
      remove(selected[selected.length - 1]);
    }
    if (e.key === "Escape") setOpen(false);
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const flagFor = (lang: string) =>
    LANGUAGE_OPTIONS.find((l) => l.value === lang)?.flag ?? "🌐";

  return (
    <div ref={containerRef} className="relative">
      {/* Input + chips box */}
      <div
        onClick={() => { inputRef.current?.focus(); setOpen(true); }}
        className={`flex min-h-[44px] flex-wrap items-center gap-1.5 border px-3 py-2 cursor-text transition-colors ${
          error && selected.length === 0
            ? "border-danger bg-danger-muted"
            : open
            ? "border-text-primary"
            : "border-border-default"
        }`}
      >
        {/* Selected chips */}
        {selected.map((lang) => (
          <span
            key={lang}
            className="inline-flex items-center gap-1 bg-text-primary px-2 py-0.5 text-xs text-surface-primary"
          >
            {flagFor(lang)} {lang}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); remove(lang); }}
              className="ml-0.5 opacity-60 hover:opacity-100"
            >
              ×
            </button>
          </span>
        ))}

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selected.length === 0 ? "Sprache suchen oder eingeben…" : "Weitere Sprache…"}
          className="min-w-[140px] flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
        />
      </div>

      {/* Dropdown */}
      {open && (suggestions.length > 0 || isCustom) && (
        <div className="absolute z-50 mt-1 w-full border border-border-default bg-surface-primary shadow-md max-h-52 overflow-y-auto">
          {suggestions.map((lang) => (
            <button
              key={lang.value}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); add(lang.value); }}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-text-primary hover:bg-surface-secondary"
            >
              <span>{lang.flag}</span>
              <span>{lang.value}</span>
            </button>
          ))}
          {isCustom && (
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); add(queryTrimmed); }}
              className="flex w-full items-center gap-2 border-t border-border-default px-3 py-2.5 text-left text-sm text-accent hover:bg-surface-secondary"
            >
              <span>🌐</span>
              <span>„{queryTrimmed}" hinzufügen</span>
            </button>
          )}
        </div>
      )}

      <p className="mt-1.5 text-xs text-text-tertiary">
        Tippe und drücke Enter · Backspace zum Entfernen
      </p>
    </div>
  );
}
