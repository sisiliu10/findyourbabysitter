"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Tag-style input for multi-value text fields (e.g. languages).
 * - Enter / comma / Tab → add tag
 * - Backspace on empty input → remove last tag
 * - Paste of "English, German, French" → splits and adds all
 * - Duplicates and empty strings are silently ignored
 */
export function TagInput({ value, onChange, placeholder, className }: TagInputProps) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    // Ignore case-insensitive duplicates
    const already = value.some((t) => t.toLowerCase() === trimmed.toLowerCase());
    if (already) return;
    onChange([...value, trimmed]);
    setDraft("");
  }

  function addMany(raw: string) {
    const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
    const unique = parts.filter(
      (p) => !value.some((t) => t.toLowerCase() === p.toLowerCase()),
    );
    if (unique.length) onChange([...value, ...unique]);
    setDraft("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      if (draft.trim()) {
        e.preventDefault();
        addTag(draft);
      }
    } else if (e.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text");
    if (text.includes(",")) {
      e.preventDefault();
      addMany(text);
    }
    // Single value: let it land in the input normally
  }

  function handleBlur() {
    if (draft.trim()) addTag(draft);
  }

  return (
    <div
      className={cn(
        "mt-1 flex min-h-[42px] flex-wrap items-center gap-1.5 border border-border-default bg-transparent px-3 py-2 transition-colors focus-within:border-text-primary cursor-text",
        className,
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 bg-surface-tertiary px-2 py-0.5 text-xs text-text-primary"
        >
          {tag}
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
            className="text-text-muted hover:text-text-primary transition-colors"
            aria-label={`Remove ${tag}`}
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={handleBlur}
        placeholder={value.length === 0 ? placeholder : ""}
        className="min-w-[100px] flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
      />
    </div>
  );
}
