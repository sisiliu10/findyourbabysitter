import { LANGUAGE_OPTIONS } from "./constants";

// Map of all known variants/typos/native names → canonical LANGUAGE_OPTIONS value
const LANGUAGE_ALIASES: Record<string, string> = {
  // English
  english: "English",
  englisch: "English",
  "en": "English",
  "eng": "English",

  // German
  german: "German",
  deutsch: "German",
  deutsche: "German",
  deutschen: "German",
  deitsch: "German",
  "de": "German",
  "ger": "German",

  // Spanish
  spanish: "Spanish",
  spanisch: "Spanish",
  español: "Spanish",
  espanol: "Spanish",
  "es": "Spanish",

  // French
  french: "French",
  französisch: "French",
  franzosisch: "French",
  francais: "French",
  français: "French",
  "fr": "French",

  // Turkish
  turkish: "Turkish",
  türkisch: "Turkish",
  turkisch: "Turkish",
  "tr": "Turkish",

  // Russian
  russian: "Russian",
  russisch: "Russian",
  "ru": "Russian",

  // Arabic
  arabic: "Arabic",
  arabisch: "Arabic",
  "ar": "Arabic",

  // Polish
  polish: "Polish",
  polnisch: "Polish",
  "pl": "Polish",

  // Italian
  italian: "Italian",
  italienisch: "Italian",
  "it": "Italian",

  // Portuguese
  portuguese: "Portuguese",
  portugiesisch: "Portuguese",
  "pt": "Portuguese",

  // Ukrainian
  ukrainian: "Ukrainian",
  ukrainisch: "Ukrainian",
  "uk": "Ukrainian",

  // Romanian
  romanian: "Romanian",
  rumänisch: "Romanian",
  rumanisch: "Romanian",
  "ro": "Romanian",

  // Chinese
  chinese: "Chinese",
  chinesisch: "Chinese",
  mandarin: "Chinese",
  "zh": "Chinese",

  // Korean
  korean: "Korean",
  koreanisch: "Korean",
  "ko": "Korean",

  // Japanese
  japanese: "Japanese",
  japanisch: "Japanese",
  "ja": "Japanese",

  // Hindi
  hindi: "Hindi",
  "hi": "Hindi",

  // Persian
  persian: "Persian",
  persisch: "Persian",
  farsi: "Persian",
  "fa": "Persian",

  // Vietnamese
  vietnamese: "Vietnamese",
  vietnamesisch: "Vietnamese",
  "vi": "Vietnamese",

  // Greek
  greek: "Greek",
  griechisch: "Greek",
  "el": "Greek",

  // Bulgarian
  bulgarian: "Bulgarian",
  bulgarisch: "Bulgarian",
  "bg": "Bulgarian",
};

// Build a set of canonical values for fast lookup
const CANONICAL_VALUES = new Set(LANGUAGE_OPTIONS.map((l) => l.value));

/**
 * Normalize a single language string to its canonical LANGUAGE_OPTIONS value.
 * Returns null if unrecognized.
 */
export function normalizeLanguage(raw: string): string | null {
  const trimmed = raw.trim();
  // Already canonical (case-sensitive match)
  if (CANONICAL_VALUES.has(trimmed)) return trimmed;
  // Alias lookup (case-insensitive)
  const lower = trimmed.toLowerCase();
  return LANGUAGE_ALIASES[lower] ?? null;
}

/**
 * Normalize a comma-separated languages string.
 * Keeps unrecognized values as-is so no data is silently dropped.
 * Deduplicates canonical values.
 */
export function normalizeLanguages(raw: string): string {
  const parts = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const result: string[] = [];

  for (const part of parts) {
    const normalized = normalizeLanguage(part) ?? part;
    if (!seen.has(normalized)) {
      seen.add(normalized);
      result.push(normalized);
    }
  }

  return result.join(", ");
}
